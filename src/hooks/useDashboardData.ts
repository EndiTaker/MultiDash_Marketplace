import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useAnalyticsWithSupabase } from "./useAnalyticsWithSupabase";
import { useProductsWithSupabase } from "./useProductsWithSupabase";
import { useStocksWithSupabase } from "./useStocksWithSupabase";
import { toast } from "sonner";

type PeriodType = "7d" | "30d" | "90d" | "1y";

export function useDashboardData(initialPeriod: PeriodType = "30d") {
  const { user } = useAuth();
  const [period, setPeriod] = useState<PeriodType>(initialPeriod);

  // Просто вызываем хуки напрямую
  const analytics = useAnalyticsWithSupabase(period);
  const products = useProductsWithSupabase({});
  const stocks = useStocksWithSupabase({});

  const loading = analytics.loading || products.loading || stocks.loading;

  const refreshAll = useCallback(async () => {
    try {
      await Promise.all([
        analytics.refreshAnalytics?.(),
        products.refreshProducts?.(),
        stocks.refreshStocks?.(),
      ]);
      toast.success("Данные обновлены");
    } catch (error) {
      toast.error("Ошибка обновления");
    }
  }, [analytics, products, stocks]);

  // Простой объект без useMemo
  return {
    analyticsData: analytics.data,
    productsStats: products.stats,
    stocksStats: stocks.stats,
    period,
    setPeriod,
    loading,
    refreshAll,
  };
}
