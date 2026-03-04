import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Globe, 
  Shield, 
  Database,
  Save,
  Check,
  Mail,
  Smartphone,
  Lock,
  Moon
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

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

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  
  // Form states
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sales: true,
    stock: true,
    system: false,
  });
  
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState('15');
  const [language, setLanguage] = useState('ru');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Настройки</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Управление настройками приложения
          </p>
        </div>
        
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-xl transition-all ${
            saved 
              ? 'bg-emerald-500 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Сохранено
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Сохранить
            </>
          )}
        </button>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Внешний вид</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Настройте тему оформления</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`p-4 rounded-xl border-2 transition-all ${
                theme === t
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  t === 'light' ? 'bg-yellow-100 text-yellow-600' :
                  t === 'dark' ? 'bg-gray-800 text-gray-400' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {t === 'light' && <Globe className="w-6 h-6" />}
                  {t === 'dark' && <Moon className="w-6 h-6" />}
                  {t === 'system' && <Database className="w-6 h-6" />}
                </div>
                <span className={`font-medium ${
                  theme === t ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {t === 'light' && 'Светлая'}
                  {t === 'dark' && 'Тёмная'}
                  {t === 'system' && 'Системная'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Уведомления</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Настройте способы получения уведомлений</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email уведомления</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Получать уведомления на email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Push-уведомления</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Получать push в браузере</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white mb-4">Типы уведомлений</p>
          <div className="space-y-3">
            {[
              { key: 'sales', label: 'Новые продажи', desc: 'Уведомления о новых заказах' },
              { key: 'stock', label: 'Изменение остатков', desc: 'Когда товар заканчивается' },
              { key: 'system', label: 'Системные', desc: 'Обновления и важные события' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[key as keyof typeof notifications]}
                    onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Synchronization */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Синхронизация</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Настройте автоматическую синхронизацию</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Автосинхронизация</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Автоматически обновлять данные</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {autoSync && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Интервал синхронизации
              </label>
              <select
                value={syncInterval}
                onChange={(e) => setSyncInterval(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">Каждые 5 минут</option>
                <option value="15">Каждые 15 минут</option>
                <option value="30">Каждые 30 минут</option>
                <option value="60">Каждый час</option>
              </select>
            </div>
          )}
        </div>
      </motion.div>

      {/* Language */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Язык</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Выберите язык интерфейса</p>
          </div>
        </div>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>
      </motion.div>

      {/* Security */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Безопасность</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Настройки безопасности аккаунта</p>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Изменить пароль</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Обновить пароль от аккаунта</p>
              </div>
            </div>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Двухфакторная аутентификация</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Дополнительная защита аккаунта</p>
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Не подключено</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
