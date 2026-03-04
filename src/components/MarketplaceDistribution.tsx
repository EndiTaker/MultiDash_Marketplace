import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import type { MarketplaceType } from '@/types/marketplace';

interface MarketplaceData {
  marketplaceType: MarketplaceType;
  sales: number;
  orders: number;
  revenue: number;
  commission: number;
  netProfit: number;
}

interface MarketplaceDistributionProps {
  data: MarketplaceData[];
  metric?: 'revenue' | 'sales' | 'orders' | 'netProfit';
}

const marketplaceColors: Record<MarketplaceType, string> = {
  ozon: '#005BFF',
  yandex: '#FC3F1D',
  wildberries: '#8B5CF6',
  sber: '#21A038',
  aliexpress: '#FF4747',
};

const marketplaceNames: Record<MarketplaceType, string> = {
  ozon: 'Ozon',
  yandex: 'Яндекс Маркет',
  wildberries: 'Wildberries',
  sber: 'СберМегаМаркет',
  aliexpress: 'AliExpress',
};

const metricLabels = {
  revenue: 'Выручка',
  sales: 'Продажи',
  orders: 'Заказы',
  netProfit: 'Прибыль',
};

export function MarketplaceDistribution({ data, metric = 'revenue' }: MarketplaceDistributionProps) {
  const chartData = data.map(item => ({
    name: marketplaceNames[item.marketplaceType],
    value: item[metric],
    color: marketplaceColors[item.marketplaceType],
    type: item.marketplaceType,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {metricLabels[metric]}: <span className="font-medium text-gray-900 dark:text-white">
              {metric === 'revenue' || metric === 'netProfit' 
                ? new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(item.value)
                : item.value.toLocaleString('ru-RU')
              }
            </span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Доля: <span className="font-medium text-gray-900 dark:text-white">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Распределение по площадкам
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {metricLabels[metric]} по маркетплейсам
        </p>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {chartData.map((item) => (
          <div key={item.type} className="text-center">
            <div 
              className="w-3 h-3 rounded-full mx-auto mb-1" 
              style={{ backgroundColor: item.color }}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.name}</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {((item.value / total) * 100).toFixed(0)}%
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
