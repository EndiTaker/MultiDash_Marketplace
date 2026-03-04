import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Wallet,
  Percent,
  BarChart3,
  Calendar,
  Download
} from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { RevenueChart } from '@/components/RevenueChart';
import { MarketplaceDistribution } from '@/components/MarketplaceDistribution';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { MarketplaceType } from '@/types/marketplace';
import { MarketplaceIcon } from '@/components/MarketplaceIcon';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const marketplaceNames: Record<MarketplaceType, string> = {
  ozon: 'Ozon',
  yandex: 'Яндекс Маркет',
  wildberries: 'Wildberries',
  sber: 'СберМегаМаркет',
  aliexpress: 'AliExpress',
};

export function Analytics() {
  const { data, isLoading, refreshAnalytics, period, setPeriod } = useAnalytics();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Аналитика</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Детальная аналитика продаж и показателей
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Period selector */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['7d', '30d', '90d', '1y'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  period === p
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {p === '7d' && '7 дней'}
                {p === '30d' && '30 дней'}
                {p === '90d' && '90 дней'}
                {p === '1y' && 'Год'}
              </button>
            ))}
          </div>
          
          <button
            onClick={refreshAnalytics}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Экспорт
          </button>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Выручка"
          value={formatCurrency(data.summary.totalRevenue)}
          description="За выбранный период"
          icon={Wallet}
          trend={{ value: 12.5, isPositive: true }}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Заказы"
          value={data.summary.totalOrders.toLocaleString('ru-RU')}
          description="Всего заказов"
          icon={ShoppingCart}
          trend={{ value: 8.2, isPositive: true }}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="Продажи"
          value={data.summary.totalSales.toLocaleString('ru-RU')}
          description="Единиц товара"
          icon={Package}
          trend={{ value: 3.1, isPositive: false }}
          color="purple"
          delay={0.2}
        />
        <StatCard
          title="Средний чек"
          value={formatCurrency(data.summary.averageOrderValue)}
          description="На один заказ"
          icon={BarChart3}
          trend={{ value: 5.4, isPositive: true }}
          color="orange"
          delay={0.3}
        />
      </motion.div>

      {/* Second row stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Комиссия"
          value={formatCurrency(data.summary.totalCommission)}
          description={`${((data.summary.totalCommission / data.summary.totalRevenue) * 100).toFixed(1)}% от выручки`}
          icon={Percent}
          color="red"
          delay={0.4}
        />
        <StatCard
          title="Чистая прибыль"
          value={formatCurrency(data.summary.netProfit)}
          description="После всех комиссий"
          icon={TrendingUp}
          trend={{ value: 15.8, isPositive: true }}
          color="cyan"
          delay={0.5}
        />
        <StatCard
          title="Конверсия"
          value={`${data.summary.conversionRate}%`}
          description="Посетители в покупатели"
          icon={Calendar}
          trend={{ value: 0.3, isPositive: true }}
          color="blue"
          delay={0.6}
        />
      </motion.div>

      {/* Charts row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={data.byDay} showOrders />
        </div>
        <div>
          <MarketplaceDistribution data={data.byMarketplace} metric="revenue" />
        </div>
      </motion.div>

      {/* Marketplace breakdown */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Аналитика по площадкам
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Детальная статистика по каждому маркетплейсу
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Площадка</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Заказы</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Продажи</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Выручка</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Комиссия</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Прибыль</th>
              </tr>
            </thead>
            <tbody>
              {data.byMarketplace.map((marketplace, index) => (
                <motion.tr
                  key={marketplace.marketplaceType}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <MarketplaceIcon type={marketplace.marketplaceType} size="sm" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {marketplaceNames[marketplace.marketplaceType]}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-sm text-gray-900 dark:text-white">
                    {marketplace.orders.toLocaleString('ru-RU')}
                  </td>
                  <td className="py-4 px-4 text-right text-sm text-gray-900 dark:text-white">
                    {marketplace.sales.toLocaleString('ru-RU')}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(marketplace.revenue)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm text-red-600 dark:text-red-400">
                      -{formatCurrency(marketplace.commission)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(marketplace.netProfit)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Top products */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Топ товаров
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Самые продаваемые товары за период
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">#</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Товар</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">SKU</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Продажи</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Выручка</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Средняя цена</th>
              </tr>
            </thead>
            <tbody>
              {data.topProducts.map((product, index) => (
                <motion.tr
                  key={product.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                      index === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400' :
                      index === 2 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                      'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-500'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">{product.sku}</td>
                  <td className="py-4 px-4 text-right text-sm text-gray-900 dark:text-white">
                    {product.quantity.toLocaleString('ru-RU')} шт.
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(product.revenue)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(product.revenue / product.quantity)}
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
