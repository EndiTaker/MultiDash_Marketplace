import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";
import type { AnalyticsData, MarketplaceType } from "@/types/marketplace";
import { toast } from "sonner";

type PeriodType = "7d" | "30d" | "90d" | "1y";

// Вспомогательная функция для получения диапазона дат
function getDateRange(period: PeriodType): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  switch (period) {
    case "7d":
      start.setDate(end.getDate() - 7);
      break;
    case "30d":
      start.setDate(end.getDate() - 30);
      break;
    case "90d":
      start.setDate(end.getDate() - 90);
      break;
    case "1y":
      start.setFullYear(end.getFullYear() - 1);
      break;
  }
  return { start, end };
}

// Тип для записи из таблицы analytics (соответствует нашей структуре)
interface AnalyticsRow {
  id: string;
  user_id: string;
  date: string;
  marketplace_type: MarketplaceType | null; // null означает общую статистику
  sales: number;
  orders: number;
  revenue: number;
  commission: number;
  net_profit: number;
  created_at: string;
}

export function useAnalyticsWithSupabase(initialPeriod: PeriodType = "30d") {
  const { user } = useAuth();
  const [period, setPeriod] = useState<PeriodType>(initialPeriod);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных аналитики за выбранный период
  const loadAnalytics = useCallback(async () => {
    console.log("🔍 useAnalyticsWithSupabase - loadAnalytics вызван");
    console.log("🔍 Текущий период:", period);
    console.log("🔍 Пользователь:", user?.id);

    if (!user) {
      console.log("🔍 Нет пользователя, выход");
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { start, end } = getDateRange(period);
      const startStr = start.toISOString().split("T")[0];
      const endStr = end.toISOString().split("T")[0];

      console.log("🔍 Диапазон дат:", startStr, "до", endStr);

      // Запрашиваем все записи за период для данного пользователя
      const { data: rows, error } = await supabase
        .from("analytics")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", startStr)
        .lte("date", endStr)
        .order("date", { ascending: true });

      if (error) {
        console.error("🔍 Ошибка запроса к Supabase:", error);
        throw error;
      }

      console.log("🔍 Получено строк из БД:", rows?.length || 0);
      if (rows && rows.length > 0) {
        console.log("🔍 Первые 3 строки:", rows.slice(0, 3));
        console.log(
          "🔍 Диапазон дат в данных:",
          rows[0]?.date,
          "до",
          rows[rows.length - 1]?.date,
        );
      }

      // Преобразуем строки в нужный формат
      const typedRows = (rows || []) as AnalyticsRow[];

      // Суммарные показатели
      let totalSales = 0;
      let totalOrders = 0;
      let totalRevenue = 0;
      let totalCommission = 0;
      let netProfit = 0;
      let orderCountForAverage = 0;

      // Группировка по маркетплейсам
      const marketplaceMap = new Map<
        MarketplaceType,
        {
          sales: number;
          orders: number;
          revenue: number;
          commission: number;
          netProfit: number;
        }
      >();

      // Дневные данные (уже сгруппированы по дате и маркетплейсу)
      const byDayMap = new Map<
        string,
        { sales: number; orders: number; revenue: number }
      >();

      typedRows.forEach((row) => {
        // Общие суммы
        totalSales += row.sales;
        totalOrders += row.orders;
        totalRevenue += row.revenue;
        totalCommission += row.commission;
        netProfit += row.net_profit;

        // Для среднего чека считаем количество заказов (не нулевых)
        if (row.orders > 0) orderCountForAverage += row.orders;

        // Группировка по маркетплейсу
        if (row.marketplace_type) {
          const mp = row.marketplace_type;
          const current = marketplaceMap.get(mp) || {
            sales: 0,
            orders: 0,
            revenue: 0,
            commission: 0,
            netProfit: 0,
          };
          current.sales += row.sales;
          current.orders += row.orders;
          current.revenue += row.revenue;
          current.commission += row.commission;
          current.netProfit += row.net_profit;
          marketplaceMap.set(mp, current);
        }

        // Дневные данные (суммируем все маркетплейсы для этой даты)
        const dayKey = row.date;
        const dayCurrent = byDayMap.get(dayKey) || {
          sales: 0,
          orders: 0,
          revenue: 0,
        };
        dayCurrent.sales += row.sales;
        dayCurrent.orders += row.orders;
        dayCurrent.revenue += row.revenue;
        byDayMap.set(dayKey, dayCurrent);
      });

      // Преобразуем Map в массивы для итогового объекта
      const byMarketplace = Array.from(marketplaceMap.entries()).map(
        ([marketplaceType, values]) => ({
          marketplaceType,
          ...values,
        }),
      );

      const byDay = Array.from(byDayMap.entries()).map(([date, values]) => ({
        date,
        ...values,
      }));

      // Вычисляем дополнительные метрики
      const averageOrderValue =
        orderCountForAverage > 0
          ? Math.floor(totalRevenue / orderCountForAverage)
          : 0;
      // Конверсия — моковая, так как у нас нет данных о посещениях
      const conversionRate = 3.2;

      const analyticsData: AnalyticsData = {
        period: { start, end },
        summary: {
          totalSales,
          totalOrders,
          totalRevenue,
          totalCommission,
          netProfit,
          averageOrderValue,
          conversionRate,
        },
        byMarketplace,
        byDay,
        topProducts: [],
      };

      console.log("🔍 ИТОГОВЫЕ ПОКАЗАТЕЛИ:");
      console.log("🔍 Выручка:", totalRevenue);
      console.log("🔍 Заказы:", totalOrders);
      console.log("🔍 Продажи:", totalSales);
      console.log("🔍 Количество дней с данными:", byDay.length);

      setData(analyticsData);
      setError(null);
    } catch (err) {
      console.error("🔍 Ошибка в loadAnalytics:", err);
      setError(
        err instanceof Error ? err.message : "Ошибка загрузки аналитики",
      );
      toast.error("Не удалось загрузить аналитику");
    } finally {
      setLoading(false);
    }
  }, [user, period]);

  // Загрузка топ-товаров (отдельно)
  const loadTopProducts = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, sku, sales_count, price")
        .eq("user_id", user.id)
        .order("sales_count", { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map((item) => ({
        productId: item.id,
        name: item.name,
        sku: item.sku,
        quantity: item.sales_count || 0,
        revenue: (item.sales_count || 0) * (item.price || 0),
      }));
    } catch (err) {
      toast.error("Ошибка загрузки топ-товаров");
      return [];
    }
  }, [user]);

  // Основной эффект загрузки
  useEffect(() => {
    console.log("🔍 useEffect в useAnalyticsWithSupabase запущен");
    console.log("🔍 period:", period);
    console.log("🔍 user:", user?.id);

    if (!user) {
      console.log("🔍 Нет пользователя, выход из эффекта");
      setData(null);
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      console.log("🔍 fetchAll начат");
      await loadAnalytics();
      const top = await loadTopProducts();
      setData((prev) => (prev ? { ...prev, topProducts: top } : null));
      console.log("🔍 fetchAll завершён");
    };

    fetchAll();
  }, [loadAnalytics, loadTopProducts, user, period]); // ✅ period добавлен в зависимости

  const refreshAnalytics = useCallback(async () => {
    console.log("🔍 refreshAnalytics вызван");
    await loadAnalytics();
    const top = await loadTopProducts();
    setData((prev) => (prev ? { ...prev, topProducts: top } : null));
  }, [loadAnalytics, loadTopProducts]);

  const getMarketplaceAnalytics = useCallback(
    (marketplaceType: MarketplaceType) => {
      return data?.byMarketplace.find(
        (m) => m.marketplaceType === marketplaceType,
      );
    },
    [data],
  );

  return {
    data,
    period,
    setPeriod,
    loading,
    error,
    refreshAnalytics,
    getMarketplaceAnalytics,
  };
}
