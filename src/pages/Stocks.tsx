import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  RefreshCw, 
  Warehouse,
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useStocks } from '@/hooks/useStocks';
import type { MarketplaceType } from '@/types/marketplace';
import { MarketplaceBadge } from '@/components/MarketplaceIcon';

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

const statusConfig = {
  in_stock: {
    label: 'В наличии',
    className: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    icon: CheckCircle2,
  },
  low_stock: {
    label: 'Заканчивается',
    className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    icon: AlertTriangle,
  },
  out_of_stock: {
    label: 'Нет в наличии',
    className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    icon: XCircle,
  },
};

export function Stocks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [marketplaceFilter, setMarketplaceFilter] = useState<MarketplaceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'in_stock' | 'low_stock' | 'out_of_stock' | 'all'>('all');
  const [editingStock, setEditingStock] = useState<{ productId: string; warehouseId: string } | null>(null);
  const [editQuantity, setEditQuantity] = useState('');
  
  const { stocks, isLoading, stats, updateStock, refreshStocks } = useStocks({
    marketplaceType: marketplaceFilter,
    status: statusFilter,
    searchQuery,
  });

  const handleEdit = (productId: string, warehouseId: string, currentQuantity: number) => {
    setEditingStock({ productId, warehouseId });
    setEditQuantity(currentQuantity.toString());
  };

  const handleSave = async () => {
    if (editingStock) {
      await updateStock(editingStock.productId, editingStock.warehouseId, parseInt(editQuantity));
      setEditingStock(null);
      setEditQuantity('');
    }
  };

  const handleCancel = () => {
    setEditingStock(null);
    setEditQuantity('');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Остатки</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Управление остатками на складах маркетплейсов
          </p>
        </div>
        
        <button
          onClick={refreshStocks}
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
              <Warehouse className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Всего позиций</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">В наличии</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.inStock}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Заканчивается</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.lowStock}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Нет в наличии</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.outOfStock}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-sm text-blue-100">Общий остаток</p>
          <p className="text-2xl font-bold">{stats.totalQuantity.toLocaleString('ru-RU')} шт.</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-sm text-purple-100">Зарезервировано</p>
          <p className="text-2xl font-bold">{stats.totalReserved.toLocaleString('ru-RU')} шт.</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
          <p className="text-sm text-emerald-100">Доступно</p>
          <p className="text-2xl font-bold">{stats.totalAvailable.toLocaleString('ru-RU')} шт.</p>
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
            placeholder="Поиск по товару или SKU..."
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
          onChange={(e) => setStatusFilter(e.target.value as 'in_stock' | 'low_stock' | 'out_of_stock' | 'all')}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Все статусы</option>
          <option value="in_stock">В наличии</option>
          <option value="low_stock">Заканчивается</option>
          <option value="out_of_stock">Нет в наличии</option>
        </select>
      </motion.div>

      {/* Stocks table */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Товар</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Склад</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Площадка</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Всего</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Зарезерв.</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Доступно</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Статус</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Действия</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, index) => {
                const isEditing = editingStock?.productId === stock.productId && editingStock?.warehouseId === stock.warehouseId;
                const StatusIcon = statusConfig[stock.status].icon;
                
                return (
                  <motion.tr
                    key={`${stock.productId}-${stock.warehouseId}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{stock.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{stock.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900 dark:text-white">{stock.warehouseName}</p>
                    </td>
                    <td className="py-4 px-4">
                      <MarketplaceBadge type={stock.marketplaceType} />
                    </td>
                    <td className="py-4 px-4 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(e.target.value)}
                          className="w-20 px-2 py-1 text-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-gray-900 dark:text-white">{stock.quantity}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-gray-600 dark:text-gray-400">{stock.reserved}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`font-medium ${
                        stock.available === 0 
                          ? 'text-red-600 dark:text-red-400' 
                          : stock.available <= stock.threshold 
                            ? 'text-orange-600 dark:text-orange-400' 
                            : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {stock.available}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[stock.status].className}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig[stock.status].label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={handleSave}
                            className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(stock.productId, stock.warehouseId, stock.quantity)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-gray-500" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {stocks.length === 0 && (
          <div className="py-12 text-center">
            <Warehouse className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Остатки не найдены</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
