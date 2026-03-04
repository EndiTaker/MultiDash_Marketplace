import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, User, Check, Loader2, ExternalLink } from 'lucide-react';
import type { Marketplace, MarketplaceType } from '@/types/marketplace';
import { MarketplaceIcon } from './MarketplaceIcon';

interface ConnectMarketplaceModalProps {
  marketplace: Marketplace | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (apiKey: string, clientId?: string) => Promise<void>;
  isLoading: boolean;
}

const marketplaceInstructions: Record<MarketplaceType, string[]> = {
  ozon: [
    'Перейдите в личный кабинет Ozon Seller',
    'Откройте раздел "Настройки" → "API ключи"',
    'Создайте новый API ключ',
    'Скопируйте Client ID и API Key',
  ],
  yandex: [
    'Перейдите в личный кабинет Яндекс Маркет',
    'Откройте раздел "Интеграция" → "API"',
    'Создайте новый OAuth токен',
    'Скопируйте Campaign ID и OAuth токен',
  ],
  wildberries: [
    'Перейдите в личный кабинет WB Seller',
    'Откройте раздел "Настройки" → "Доступ к API"',
    'Создайте новый токен',
    'Скопируйте API токен',
  ],
  sber: [
    'Перейдите в личный кабинет СберМегаМаркет',
    'Откройте раздел "Интеграции"',
    'Создайте новый API ключ',
    'Скопируйте API ключ',
  ],
  aliexpress: [
    'Перейдите в центр продавцов AliExpress',
    'Откройте раздел "API Center"',
    'Создайте новое приложение',
    'Получите App Key и App Secret',
  ],
};

const marketplaceLinks: Record<MarketplaceType, string> = {
  ozon: 'https://seller.ozon.ru',
  yandex: 'https://partner.market.yandex.ru',
  wildberries: 'https://seller.wildberries.ru',
  sber: 'https://seller.sbermegamarket.ru',
  aliexpress: 'https://seller.aliexpress.ru',
};

export function ConnectMarketplaceModal({ 
  marketplace, 
  isOpen, 
  onClose, 
  onConnect,
  isLoading 
}: ConnectMarketplaceModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [clientId, setClientId] = useState('');
  const [step, setStep] = useState<'info' | 'form'>('info');

  if (!marketplace) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConnect(apiKey, clientId || undefined);
    setApiKey('');
    setClientId('');
    setStep('info');
  };

  const handleClose = () => {
    setApiKey('');
    setClientId('');
    setStep('info');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <MarketplaceIcon type={marketplace.type} size="md" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Подключение {marketplace.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Настройте интеграцию с маркетплейсом
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 'info' ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Как получить API ключ:
                  </h3>
                  <ol className="space-y-3 mb-6">
                    {marketplaceInstructions[marketplace.type].map((instruction, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">{instruction}</span>
                      </li>
                    ))}
                  </ol>

                  <a
                    href={marketplaceLinks[marketplace.type]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mb-6"
                  >
                    Открыть личный кабинет
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setStep('form')}
                    className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
                  >
                    У меня есть API ключ
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Client ID (for Ozon and Yandex) */}
                  {(marketplace.type === 'ozon' || marketplace.type === 'yandex') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {marketplace.type === 'ozon' ? 'Client ID' : 'Campaign ID'}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={clientId}
                          onChange={(e) => setClientId(e.target.value)}
                          placeholder={marketplace.type === 'ozon' ? 'Введите Client ID' : 'Введите Campaign ID'}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* API Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      API Key
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Введите API ключ"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep('info')}
                      className="flex-1 py-3 px-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Назад
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Подключение...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Подключить
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
