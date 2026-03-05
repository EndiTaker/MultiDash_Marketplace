import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";
import type { Stock, MarketplaceType } from "@/types/marketplace";
import { toast } from "sonner";

interface UseStocksOptions {
  marketplaceType?: MarketplaceType | "all";
  status?: "in_stock" | "low_stock" | "out_of_stock" | "all";
  searchQuery?: string;
}

export function useStocksWithSupabase(options: UseStocksOptions = {}) {
  const { user } = useAuth();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStocks = useCallback(async () => {
    if (!user) {
      setStocks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase.from("stocks").select("*").eq("user_id", user.id);

      if (options.marketplaceType && options.marketplaceType !== "all") {
        query = query.eq("marketplace_type", options.marketplaceType);
      }

      if (options.status && options.status !== "all") {
        query = query.eq("status", options.status);
      }

      if (options.searchQuery) {
        const search = `%${options.searchQuery.toLowerCase()}%`;
        query = query.or(`product_name.ilike.${search},sku.ilike.${search}`);
      }

      const { data, error } = await query.order("last_updated", {
        ascending: false,
      });

      if (error) throw error;

      // Преобразуем данные из БД в формат Stock
      const formatted: Stock[] = (data || []).map((item) => ({
        productId: item.product_id,
        sku: item.sku,
        name: item.product_name,
        warehouseId: item.warehouse_id,
        warehouseName: item.warehouse_name,
        marketplaceType: item.marketplace_type,
        quantity: item.quantity,
        reserved: item.reserved,
        available: item.available,
        threshold: item.threshold,
        status: item.status,
        lastUpdated: new Date(item.last_updated),
      }));

      setStocks(formatted);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки остатков");
      toast.error("Не удалось загрузить остатки");
    } finally {
      setLoading(false);
    }
  }, [user, options.marketplaceType, options.status, options.searchQuery]);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  const updateStock = useCallback(
    async (productId: string, warehouseId: string, newQuantity: number) => {
      try {
        // Находим текущую запись
        const stock = stocks.find(
          (s) => s.productId === productId && s.warehouseId === warehouseId,
        );
        if (!stock) throw new Error("Запись не найдена");

        const reserved = stock.reserved; // оставляем без изменений
        const available = newQuantity - reserved;
        let status: "in_stock" | "low_stock" | "out_of_stock" = "in_stock";
        if (newQuantity === 0) {
          status = "out_of_stock";
        } else if (newQuantity <= stock.threshold) {
          status = "low_stock";
        }

        const { error } = await supabase
          .from("stocks")
          .update({
            quantity: newQuantity,
            available,
            status,
            last_updated: new Date().toISOString(),
          })
          .eq("product_id", productId)
          .eq("warehouse_id", warehouseId);

        if (error) throw error;

        // Обновляем локальный стейт
        setStocks((prev) =>
          prev.map((s) =>
            s.productId === productId && s.warehouseId === warehouseId
              ? {
                  ...s,
                  quantity: newQuantity,
                  available,
                  status,
                  lastUpdated: new Date(),
                }
              : s,
          ),
        );

        toast.success("Остаток обновлён");
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Ошибка обновления");
        return false;
      }
    },
    [stocks],
  );

  const refreshStocks = useCallback(() => {
    loadStocks();
  }, [loadStocks]);

  const stats = useMemo(() => {
    const total = stocks.length;
    const inStock = stocks.filter((s) => s.status === "in_stock").length;
    const lowStock = stocks.filter((s) => s.status === "low_stock").length;
    const outOfStock = stocks.filter((s) => s.status === "out_of_stock").length;
    const totalQuantity = stocks.reduce((sum, s) => sum + s.quantity, 0);
    const totalReserved = stocks.reduce((sum, s) => sum + s.reserved, 0);
    const totalAvailable = stocks.reduce((sum, s) => sum + s.available, 0);
    return {
      total,
      inStock,
      lowStock,
      outOfStock,
      totalQuantity,
      totalReserved,
      totalAvailable,
    };
  }, [stocks]);

  return {
    stocks,
    loading,
    error,
    stats,
    updateStock,
    refreshStocks,
  };
}
