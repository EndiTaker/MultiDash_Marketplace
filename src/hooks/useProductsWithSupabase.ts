import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";
import type { Product, MarketplaceType } from "@/types/marketplace";
import { toast } from "sonner";

interface UseProductsOptions {
  marketplaceType?: MarketplaceType | "all";
  status?: "active" | "inactive" | "all";
  searchQuery?: string;
}

export function useProductsWithSupabase(options: UseProductsOptions = {}) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка товаров с учётом фильтров
  const loadProducts = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase.from("products").select("*").eq("user_id", user.id);

      // Фильтр по маркетплейсу
      if (options.marketplaceType && options.marketplaceType !== "all") {
        query = query.eq("marketplace_type", options.marketplaceType);
      }

      // Фильтр по статусу
      if (options.status && options.status !== "all") {
        query = query.eq("status", options.status);
      }

      // Поиск по названию, SKU или бренду
      if (options.searchQuery) {
        const search = `%${options.searchQuery.toLowerCase()}%`;
        query = query.or(
          `name.ilike.${search},sku.ilike.${search},brand.ilike.${search}`,
        );
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      // Преобразуем данные из БД в формат Product
      const formatted: Product[] = (data || []).map((item) => ({
        id: item.id,
        marketplaceId: item.marketplace_id?.toString() || "",
        marketplaceType: item.marketplace_type,
        sku: item.sku,
        name: item.name,
        description: item.description || undefined,
        price: item.price,
        oldPrice: item.old_price || undefined,
        currency: item.currency,
        quantity: item.quantity,
        reservedQuantity: item.reserved_quantity,
        images: item.images || [],
        category: item.category,
        brand: item.brand || undefined,
        barcode: item.barcode || undefined,
        weight: item.weight || undefined,
        dimensions: item.dimensions || undefined,
        rating: item.rating || undefined,
        reviewsCount: item.reviews_count,
        salesCount: item.sales_count,
        status: item.status,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      }));

      setProducts(formatted);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки товаров");
      toast.error("Не удалось загрузить товары");
    } finally {
      setLoading(false);
    }
  }, [user, options.marketplaceType, options.status, options.searchQuery]);

  // Загружаем при изменении фильтров
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Обновление товара (частичное)
  const updateProduct = useCallback(
    async (productId: string, updates: Partial<Product>) => {
      try {
        const dbUpdates: any = {};
        if (updates.price !== undefined) dbUpdates.price = updates.price;
        if (updates.oldPrice !== undefined)
          dbUpdates.old_price = updates.oldPrice;
        if (updates.quantity !== undefined)
          dbUpdates.quantity = updates.quantity;
        if (updates.reservedQuantity !== undefined)
          dbUpdates.reserved_quantity = updates.reservedQuantity;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        dbUpdates.updated_at = new Date().toISOString();

        const { error } = await supabase
          .from("products")
          .update(dbUpdates)
          .eq("id", productId);

        if (error) throw error;

        // Обновляем локальный стейт
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, ...updates, updatedAt: new Date() }
              : p,
          ),
        );

        toast.success("Товар обновлён");
        return true;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Ошибка обновления товара",
        );
        return false;
      }
    },
    [],
  );

  const updatePrice = useCallback(
    (productId: string, newPrice: number) => {
      return updateProduct(productId, { price: newPrice, oldPrice: undefined });
    },
    [updateProduct],
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      return updateProduct(productId, { quantity: newQuantity });
    },
    [updateProduct],
  );

  const toggleProductStatus = useCallback(
    async (productId: string) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return false;
      const newStatus = product.status === "active" ? "inactive" : "active";
      return updateProduct(productId, { status: newStatus });
    },
    [products, updateProduct],
  );

  // Принудительное обновление (перезагрузка)
  const refreshProducts = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  // Статистика по товарам (вычисляется из текущего списка)
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === "active").length;
    const inactive = products.filter((p) => p.status === "inactive").length;
    const outOfStock = products.filter((p) => p.quantity === 0).length;
    const lowStock = products.filter(
      (p) => p.quantity > 0 && p.quantity <= 10,
    ).length;
    return { total, active, inactive, outOfStock, lowStock };
  }, [products]);

  return {
    products,
    loading,
    error,
    stats,
    updateProduct,
    updatePrice,
    updateQuantity,
    toggleProductStatus,
    refreshProducts,
  };
}
