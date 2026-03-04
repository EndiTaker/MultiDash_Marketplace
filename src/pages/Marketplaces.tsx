import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Check, 
  X, 
  RefreshCw,
  AlertCircle,
  Power
} from 'lucide-react';
import { useMarketplaces } from '@/hooks/useMarketplaces';
import type { Marketplace } from '@/types/marketplace';
import { MarketplaceIcon } from '@/components/MarketplaceIcon';
import { ConnectMarketplaceModal } from '@/components/ConnectMarketplaceModal';

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

export function Marketplaces() {
  const { 
    marketplaces, 
    isLoading, 
    connectMarketplace, 
    disconnectMarketplace, 
    syncMarketplace 
  } = useMarketplaces();
  
  const [selectedMarketplace, setSelectedMarketplace] = useState<Marketplace | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnect = (marketplace: Marketplace) => {
    setSelectedMarketplace(marketplace);
    setIsModalOpen(true);
  };

  const handleConnectSubmit = async (apiKey: string, clientId?: string) => {
    if (selectedMarketplace) {
      await connectMarketplace(selectedMarketplace.id, apiKey, clientId);
      setIsModalOpen(false);
      setSelectedMarketplace(null);
    }
  };

  const handleDisconnect = async (marketplace: Marketplace) => {
    if (confirm(`Отключить ${marketplace.name}?`)) {
      await disconnectMarketplace(marketplace.id);
    }
  };

  const handleSync = async (marketplace: Marketplace) => {
    await syncMarketplace(marketplace.id);
  };

  const connectedCount = marketplaces.filter(mp => mp.connected).length;

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Маркетплейсы</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Управление подключениями к маркетплейсам
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl">
          <Check className="w-5 h-5" />
          <span className="font-medium">{connectedCount} из {marketplaces.length} подключено</span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-sm text-blue-100">Подключено</p>
          <p className="text-2xl font-bold">{connectedCount}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-sm text-purple-100">Доступно</p>
          <p className="text-2xl font-bold">{marketplaces.length - connectedCount}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
          <p className="text-sm text-emerald-100">Активных</p>
          <p className="text-2xl font-bold">
            {marketplaces.filter(mp => mp.status === 'active').length}
          </p>
        </div>
      </motion.div>

      {/* Marketplaces grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {marketplaces.map((marketplace, index) => (
          <motion.div
            key={marketplace.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl border ${
              marketplace.connected 
                ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            } p-6 transition-all hover:shadow-lg`}
          >
            {/* Status badge */}
            <div className="absolute top-4 right-4">
              {marketplace.connected ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  Подключено
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <X className="w-3.5 h-3.5" />
                  Не подключено
                </span>
              )}
            </div>

            <div className="flex items-start gap-4">
              <MarketplaceIcon type={marketplace.type} size="lg" />
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {marketplace.name}
                </h3>
                
                {marketplace.connected && marketplace.lastSync && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Последняя синхронизация: {marketplace.lastSync.toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}

                {!marketplace.connected && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Подключитесь для синхронизации данных
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  {marketplace.connected ? (
                    <>
                      <button
                        onClick={() => handleSync(marketplace)}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Синхронизировать
                      </button>
                      <button
                        onClick={() => handleDisconnect(marketplace)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Отключить"
                      >
                        <Power className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnect(marketplace)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Подключить
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Connection info */}
            {marketplace.connected && (
              <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800/50">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-gray-600 dark:text-gray-400">API: активно</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">Автосинхронизация: вкл</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Info block */}
      <motion.div variants={itemVariants} className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-400">
              Как подключить маркетплейс?
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Для подключения маркетплейса вам потребуется API ключ из личного кабинета продавца. 
              Нажмите "Подключить" и следуйте инструкциям. Данные будут автоматически синхронизироваться каждые 15 минут.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <ConnectMarketplaceModal
        marketplace={selectedMarketplace}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMarketplace(null);
        }}
        onConnect={handleConnectSubmit}
        isLoading={isLoading}
      />
    </motion.div>
  );
}
