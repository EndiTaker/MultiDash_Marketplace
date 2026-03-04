import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
  delay?: number;
}

const colorVariants = {
  blue: 'from-blue-500/20 to-blue-600/10 text-blue-600 dark:text-blue-400',
  green: 'from-emerald-500/20 to-emerald-600/10 text-emerald-600 dark:text-emerald-400',
  purple: 'from-purple-500/20 to-purple-600/10 text-purple-600 dark:text-purple-400',
  orange: 'from-orange-500/20 to-orange-600/10 text-orange-600 dark:text-orange-400',
  red: 'from-red-500/20 to-red-600/10 text-red-600 dark:text-red-400',
  cyan: 'from-cyan-500/20 to-cyan-600/10 text-cyan-600 dark:text-cyan-400',
};

const iconBgVariants = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400',
  cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
};

export function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  color = 'blue',
  delay = 0 
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorVariants[color]} opacity-50`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{value}</h3>
            
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${trend.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">к прошлому периоду</span>
              </div>
            )}
            
            {description && !trend && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            )}
          </div>
          
          <div className={`p-3 rounded-xl ${iconBgVariants[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
