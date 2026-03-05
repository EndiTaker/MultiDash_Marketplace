import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Wallet,
  RefreshCw,
  AlertTriangle,
  Warehouse,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { RevenueChart } from "@/components/RevenueChart";
import { MarketplaceDistribution } from "@/components/MarketplaceDistribution";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useMarketplacesWithSupabase } from "@/hooks/useMarketplacesWithSupabase";
import { MarketplaceBadge } from "@/components/MarketplaceIcon";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Dashboard() {
  const {
    analyticsData,
    productsStats,
    stocksStats,
    period,
    setPeriod,
    loading,
    refreshAll,
  } = useDashboardData();

  const { getConnectedMarketplaces } = useMarketplacesWithSupabase();

  const connectedMarketplaces = getConnectedMarketplaces();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Дашборд
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Обзор ваших продаж и показателей
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Period selector */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(["7d", "30d", "90d", "1y"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                disabled={loading}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  period === p
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {p === "7d" && "7 дней"}
                {p === "30d" && "30 дней"}
                {p === "90d" && "90 дней"}
                {p === "1y" && "Год"}
              </button>
            ))}
          </div>

          <button
            onClick={refreshAll}
            disabled={loading}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </motion.div>

      {/* Connected marketplaces */}
      {connectedMarketplaces.length > 0 && (
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Подключенные площадки:
          </span>
          <div className="flex items-center gap-2">
            {connectedMarketplaces.map((mp) => (
              <MarketplaceBadge key={mp.id} type={mp.type} showName />
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Выручка"
          value={formatCurrency(analyticsData.summary.totalRevenue)}
          description="За выбранный период"
          icon={Wallet}
          trend={{ value: 12.5, isPositive: true }}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Заказы"
          value={analyticsData.summary.totalOrders.toLocaleString("ru-RU")}
          description="Всего заказов"
          icon={ShoppingCart}
          trend={{ value: 8.2, isPositive: true }}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="Продажи"
          value={analyticsData.summary.totalSales.toLocaleString("ru-RU")}
          description="Единиц товара"
          icon={Package}
          trend={{ value: 3.1, isPositive: false }}
          color="purple"
          delay={0.2}
        />
        <StatCard
          title="Чистая прибыль"
          value={formatCurrency(analyticsData.summary.netProfit)}
          description="После комиссий"
          icon={TrendingUp}
          trend={{ value: 15.8, isPositive: true }}
          color="cyan"
          delay={0.3}
        />
      </motion.div>

      {/* Additional stats row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Link to="/products" className="block">
          <StatCard
            title="Товары"
            value={`${productsStats.active} активных`}
            description={`Всего: ${productsStats.total}, заканчивается: ${productsStats.lowStock}`}
            icon={Package}
            color="blue"
          />
        </Link>
        <Link to="/stocks" className="block">
          <StatCard
            title="Остатки"
            value={`${stocksStats.totalQuantity} шт.`}
            description={`Доступно: ${stocksStats.totalAvailable}, зарезервировано: ${stocksStats.totalReserved}`}
            icon={Warehouse}
            color="green"
          />
        </Link>
        <Link to="/stocks" className="block">
          <StatCard
            title="Проблемные остатки"
            value={`${stocksStats.lowStock + stocksStats.outOfStock}`}
            description={`Заканчивается: ${stocksStats.lowStock}, нет в наличии: ${stocksStats.outOfStock}`}
            icon={AlertTriangle}
            color="orange"
          />
        </Link>
      </motion.div>

      {/* Charts row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <RevenueChart data={analyticsData.byDay} showOrders />
        </div>
        <div>
          <MarketplaceDistribution
            data={analyticsData.byMarketplace}
            metric="revenue"
          />
        </div>
      </motion.div>

      {/* Top products (short version) */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Топ товаров
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Самые продаваемые товары за период
            </p>
          </div>
          <Link
            to="/analytics"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Подробнее →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Товар
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  SKU
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Продажи
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Выручка
                </th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topProducts.slice(0, 5).map((product, index) => (
                <motion.tr
                  key={product.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                    {product.sku}
                  </td>
                  <td className="py-4 px-4 text-right text-sm text-gray-900 dark:text-white">
                    {product.quantity.toLocaleString("ru-RU")} шт.
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(product.revenue)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
