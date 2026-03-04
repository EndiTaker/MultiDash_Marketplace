import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  RefreshCw, 
  MoreHorizontal, 
  Edit2, 
  Eye, 
  EyeOff,
  Package,
  TrendingUp,
  Star
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import type { MarketplaceType } from '@/types/marketplace';
import { MarketplaceBadge } from '@/components/MarketplaceIcon';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const statusColors = {
  active: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  inactive: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  blocked: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  draft: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
};

const statusLabels = {
  active: 'Активен',
  inactive: 'Неактивен',
  blocked: 'Заблокирован',
  draft: 'Черновик',
};

export function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [marketplaceFilter, setMarketplaceFilter] = useState<MarketplaceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'all'>('all');
  
  const { products, isLoading, stats, toggleProductStatus, refreshProducts } = useProducts({
    marketplaceType: marketplaceFilter,
    status: statusFilter,
    searchQuery,
  });

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Товары</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Управление товарами на всех площадках
          </p>
        </div>
        
        <button
          onClick={refreshProducts}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Обновить
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Всего товаров</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Активные</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Заканчиваются</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.lowStock}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Package className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Нет в наличии</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.outOfStock}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию, SKU или бренду..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Marketplace filter */}
        <select
          value={marketplaceFilter}
          onChange={(e) => setMarketplaceFilter(e.target.value as MarketplaceType | 'all')}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Все площадки</option>
          <option value="ozon">Ozon</option>
          <option value="yandex">Яндекс Маркет</option>
          <option value="wildberries">Wildberries</option>
          <option value="sber">СберМегаМаркет</option>
          <option value="aliexpress">AliExpress</option>
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'active' | 'inactive' | 'all')}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
        </select>
      </motion.div>

      {/* Products table */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Товар</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Площадка</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Цена</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Остаток</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Статус</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Рейтинг</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{product.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <MarketplaceBadge type={product.marketplaceType} />
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(product.price)}</p>
                      {product.oldPrice && (
                        <p className="text-sm text-gray-400 line-through">{formatCurrency(product.oldPrice)}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className={`font-medium ${
                        product.quantity === 0 
                          ? 'text-red-600 dark:text-red-400' 
                          : product.quantity <= 10 
                            ? 'text-orange-600 dark:text-orange-400' 
                            : 'text-gray-900 dark:text-white'
                      }`}>
                        {product.quantity} шт.
                      </p>
                      {product.reservedQuantity > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Зарезервировано: {product.reservedQuantity}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[product.status]}`}>
                      {statusLabels[product.status]}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {product.rating ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium text-gray-900 dark:text-white">{product.rating}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({product.reviewsCount})</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Edit2 className="w-4 h-4" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center gap-2"
                          onClick={() => toggleProductStatus(product.id)}
                        >
                          {product.status === 'active' ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Деактивировать
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              Активировать
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Товары не найдены</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
