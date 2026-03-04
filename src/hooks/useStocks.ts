import { useState, useCallback, useMemo } from 'react';
import type { Stock, Warehouse, MarketplaceType } from '@/types/marketplace';

// Mock warehouses
const mockWarehouses: Warehouse[] = [
  { id: 'wh1', marketplaceType: 'ozon', name: 'Ozon РФЗ Москва', city: 'Москва', type: 'fba' },
  { id: 'wh2', marketplaceType: 'ozon', name: 'Ozon РФЗ Санкт-Петербург', city: 'Санкт-Петербург', type: 'fba' },
  { id: 'wh3', marketplaceType: 'wildberries', name: 'WB Склад Москва', city: 'Москва', type: 'fba' },
  { id: 'wh4', marketplaceType: 'wildberries', name: 'WB Склад Казань', city: 'Казань', type: 'fba' },
  { id: 'wh5', marketplaceType: 'yandex', name: 'Яндекс Склад Москва', city: 'Москва', type: 'fba' },
  { id: 'wh6', marketplaceType: 'yandex', name: 'Яндекс Склад Екатеринбург', city: 'Екатеринбург', type: 'fba' },
];

// Mock stocks data
const mockStocks: Stock[] = [
  {
    productId: '1',
    sku: 'OZ-12345',
    name: 'Беспроводные наушники Sony WH-1000XM5',
    warehouseId: 'wh1',
    warehouseName: 'Ozon РФЗ Москва',
    marketplaceType: 'ozon',
    quantity: 25,
    reserved: 3,
    available: 22,
    threshold: 10,
    status: 'in_stock',
    lastUpdated: new Date('2024-03-15'),
  },
  {
    productId: '1',
    sku: 'OZ-12345',
    name: 'Беспроводные наушники Sony WH-1000XM5',
    warehouseId: 'wh2',
    warehouseName: 'Ozon РФЗ Санкт-Петербург',
    marketplaceType: 'ozon',
    quantity: 20,
    reserved: 2,
    available: 18,
    threshold: 10,
    status: 'in_stock',
    lastUpdated: new Date('2024-03-14'),
  },
  {
    productId: '2',
    sku: 'OZ-12346',
    name: 'Смартфон iPhone 15 Pro 256GB',
    warehouseId: 'wh1',
    warehouseName: 'Ozon РФЗ Москва',
    marketplaceType: 'ozon',
    quantity: 15,
    reserved: 2,
    available: 13,
    threshold: 5,
    status: 'in_stock',
    lastUpdated: new Date('2024-03-15'),
  },
  {
    productId: '3',
    sku: 'YM-78901',
    name: 'Ноутбук MacBook Air M3',
    warehouseId: 'wh5',
    warehouseName: 'Яндекс Склад Москва',
    marketplaceType: 'yandex',
    quantity: 8,
    reserved: 1,
    available: 7,
    threshold: 5,
    status: 'low_stock',
    lastUpdated: new Date('2024-03-13'),
  },
  {
    productId: '4',
    sku: 'WB-45678',
    name: 'Кофемашина DeLonghi ECAM',
    warehouseId: 'wh3',
    warehouseName: 'WB Склад Москва',
    marketplaceType: 'wildberries',
    quantity: 5,
    reserved: 1,
    available: 4,
    threshold: 5,
    status: 'low_stock',
    lastUpdated: new Date('2024-03-12'),
  },
  {
    productId: '5',
    sku: 'WB-45679',
    name: 'Пылесос Dyson V15 Detect',
    warehouseId: 'wh3',
    warehouseName: 'WB Склад Москва',
    marketplaceType: 'wildberries',
    quantity: 0,
    reserved: 0,
    available: 0,
    threshold: 3,
    status: 'out_of_stock',
    lastUpdated: new Date('2024-03-10'),
  },
  {
    productId: '6',
    sku: 'OZ-12347',
    name: 'Планшет iPad Pro 12.9" 256GB',
    warehouseId: 'wh1',
    warehouseName: 'Ozon РФЗ Москва',
    marketplaceType: 'ozon',
    quantity: 12,
    reserved: 3,
    available: 9,
    threshold: 5,
    status: 'in_stock',
    lastUpdated: new Date('2024-03-15'),
  },
];

interface UseStocksOptions {
  marketplaceType?: MarketplaceType | 'all';
  status?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'all';
  searchQuery?: string;
}

export function useStocks(options: UseStocksOptions = {}) {
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [warehouses] = useState<Warehouse[]>(mockWarehouses);
  const [isLoading, setIsLoading] = useState(false);

  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      if (options.marketplaceType && options.marketplaceType !== 'all') {
        if (stock.marketplaceType !== options.marketplaceType) return false;
      }
      
      if (options.status && options.status !== 'all') {
        if (stock.status !== options.status) return false;
      }
      
      if (options.searchQuery) {
        const query = options.searchQuery.toLowerCase();
        const matchesName = stock.name.toLowerCase().includes(query);
        const matchesSku = stock.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesSku) return false;
      }
      
      return true;
    });
  }, [stocks, options]);

  const updateStock = useCallback(async (productId: string, warehouseId: string, newQuantity: number) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setStocks(prev => prev.map(s => {
      if (s.productId === productId && s.warehouseId === warehouseId) {
        const available = newQuantity - s.reserved;
        let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
        
        if (newQuantity === 0) {
          status = 'out_of_stock';
        } else if (newQuantity <= s.threshold) {
          status = 'low_stock';
        }
        
        return {
          ...s,
          quantity: newQuantity,
          available,
          status,
          lastUpdated: new Date(),
        };
      }
      return s;
    }));
    
    setIsLoading(false);
    return true;
  }, []);

  const refreshStocks = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    return true;
  }, []);

  const stats = useMemo(() => {
    const total = filteredStocks.length;
    const inStock = filteredStocks.filter(s => s.status === 'in_stock').length;
    const lowStock = filteredStocks.filter(s => s.status === 'low_stock').length;
    const outOfStock = filteredStocks.filter(s => s.status === 'out_of_stock').length;
    const totalQuantity = filteredStocks.reduce((sum, s) => sum + s.quantity, 0);
    const totalReserved = filteredStocks.reduce((sum, s) => sum + s.reserved, 0);
    const totalAvailable = filteredStocks.reduce((sum, s) => sum + s.available, 0);
    
    return {
      total,
      inStock,
      lowStock,
      outOfStock,
      totalQuantity,
      totalReserved,
      totalAvailable,
    };
  }, [filteredStocks]);

  const getWarehousesByMarketplace = useCallback((marketplaceType: MarketplaceType) => {
    return warehouses.filter(w => w.marketplaceType === marketplaceType);
  }, [warehouses]);

  return {
    stocks: filteredStocks,
    allStocks: stocks,
    warehouses,
    isLoading,
    stats,
    updateStock,
    refreshStocks,
    getWarehousesByMarketplace,
  };
}
