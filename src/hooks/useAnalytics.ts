import { useState, useCallback, useMemo } from 'react';
import type { AnalyticsData, MarketplaceType } from '@/types/marketplace';

// Mock analytics data
const generateMockAnalytics = (days: number = 30): AnalyticsData => {
  const byDay = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    byDay.push({
      date: date.toISOString().split('T')[0],
      sales: Math.floor(Math.random() * 50) + 20,
      orders: Math.floor(Math.random() * 30) + 10,
      revenue: Math.floor(Math.random() * 500000) + 100000,
    });
  }
  
  const totalSales = byDay.reduce((sum, d) => sum + d.sales, 0);
  const totalOrders = byDay.reduce((sum, d) => sum + d.orders, 0);
  const totalRevenue = byDay.reduce((sum, d) => sum + d.revenue, 0);
  const commission = Math.floor(totalRevenue * 0.15);
  
  return {
    period: {
      start: new Date(today.getTime() - days * 24 * 60 * 60 * 1000),
      end: today,
    },
    summary: {
      totalSales,
      totalOrders,
      totalRevenue,
      totalCommission: commission,
      netProfit: totalRevenue - commission,
      averageOrderValue: Math.floor(totalRevenue / totalOrders),
      conversionRate: 3.2,
    },
    byMarketplace: [
      {
        marketplaceType: 'ozon',
        sales: Math.floor(totalSales * 0.4),
        orders: Math.floor(totalOrders * 0.35),
        revenue: Math.floor(totalRevenue * 0.38),
        commission: Math.floor(totalRevenue * 0.38 * 0.15),
        netProfit: Math.floor(totalRevenue * 0.38 * 0.85),
      },
      {
        marketplaceType: 'wildberries',
        sales: Math.floor(totalSales * 0.35),
        orders: Math.floor(totalOrders * 0.4),
        revenue: Math.floor(totalRevenue * 0.35),
        commission: Math.floor(totalRevenue * 0.35 * 0.12),
        netProfit: Math.floor(totalRevenue * 0.35 * 0.88),
      },
      {
        marketplaceType: 'yandex',
        sales: Math.floor(totalSales * 0.25),
        orders: Math.floor(totalOrders * 0.25),
        revenue: Math.floor(totalRevenue * 0.27),
        commission: Math.floor(totalRevenue * 0.27 * 0.18),
        netProfit: Math.floor(totalRevenue * 0.27 * 0.82),
      },
    ],
    byDay,
    topProducts: [
      {
        productId: '1',
        name: 'Беспроводные наушники Sony WH-1000XM5',
        sku: 'OZ-12345',
        quantity: 156,
        revenue: 4678440,
      },
      {
        productId: '2',
        name: 'Смартфон iPhone 15 Pro 256GB',
        sku: 'OZ-12346',
        quantity: 89,
        revenue: 11569110,
      },
      {
        productId: '3',
        name: 'Ноутбук MacBook Air M3',
        sku: 'YM-78901',
        quantity: 45,
        revenue: 6749550,
      },
      {
        productId: '4',
        name: 'Кофемашина DeLonghi ECAM',
        sku: 'WB-45678',
        quantity: 34,
        revenue: 3059660,
      },
      {
        productId: '6',
        name: 'Планшет iPad Pro 12.9" 256GB',
        sku: 'OZ-12347',
        quantity: 28,
        revenue: 3359720,
      },
    ],
  };
};

type PeriodType = '7d' | '30d' | '90d' | '1y';

export function useAnalytics() {
  const [period, setPeriod] = useState<PeriodType>('30d');
  const [isLoading, setIsLoading] = useState(false);
  
  const daysMap: Record<PeriodType, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '1y': 365,
  };

  const data = useMemo(() => {
    return generateMockAnalytics(daysMap[period]);
  }, [period]);

  const refreshAnalytics = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    return true;
  }, []);

  const getMarketplaceAnalytics = useCallback((marketplaceType: MarketplaceType) => {
    return data.byMarketplace.find(m => m.marketplaceType === marketplaceType);
  }, [data]);

  return {
    data,
    period,
    setPeriod,
    isLoading,
    refreshAnalytics,
    getMarketplaceAnalytics,
  };
}
