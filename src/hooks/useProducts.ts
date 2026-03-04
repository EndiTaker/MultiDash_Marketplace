import { useState, useCallback, useMemo } from 'react';
import type { Product, MarketplaceType } from '@/types/marketplace';

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: '1',
    marketplaceId: '1',
    marketplaceType: 'ozon',
    sku: 'OZ-12345',
    name: 'Беспроводные наушники Sony WH-1000XM5',
    description: 'Премиальные беспроводные наушники с шумоподавлением',
    price: 29990,
    oldPrice: 34990,
    currency: 'RUB',
    quantity: 45,
    reservedQuantity: 5,
    images: ['https://via.placeholder.com/150'],
    category: 'Электроника',
    brand: 'Sony',
    barcode: '4548736132345',
    weight: 250,
    dimensions: { length: 20, width: 15, height: 8 },
    rating: 4.8,
    reviewsCount: 1234,
    salesCount: 567,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '2',
    marketplaceId: '1',
    marketplaceType: 'ozon',
    sku: 'OZ-12346',
    name: 'Смартфон iPhone 15 Pro 256GB',
    description: 'Флагманский смартфон Apple',
    price: 129990,
    currency: 'RUB',
    quantity: 23,
    reservedQuantity: 3,
    images: ['https://via.placeholder.com/150'],
    category: 'Электроника',
    brand: 'Apple',
    barcode: '194253873456',
    weight: 187,
    dimensions: { length: 15, width: 7, height: 1 },
    rating: 4.9,
    reviewsCount: 3421,
    salesCount: 892,
    status: 'active',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: '3',
    marketplaceId: '2',
    marketplaceType: 'yandex',
    sku: 'YM-78901',
    name: 'Ноутбук MacBook Air M3',
    description: 'Ультратонкий ноутбук Apple с чипом M3',
    price: 149990,
    oldPrice: 169990,
    currency: 'RUB',
    quantity: 12,
    reservedQuantity: 2,
    images: ['https://via.placeholder.com/150'],
    category: 'Компьютеры',
    brand: 'Apple',
    barcode: '194253987654',
    weight: 1300,
    dimensions: { length: 30, width: 22, height: 1.5 },
    rating: 4.7,
    reviewsCount: 892,
    salesCount: 234,
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    marketplaceId: '3',
    marketplaceType: 'wildberries',
    sku: 'WB-45678',
    name: 'Кофемашина DeLonghi ECAM',
    description: 'Автоматическая кофемашина',
    price: 89990,
    currency: 'RUB',
    quantity: 8,
    reservedQuantity: 1,
    images: ['https://via.placeholder.com/150'],
    category: 'Бытовая техника',
    brand: 'DeLonghi',
    barcode: '8004399321456',
    weight: 9500,
    dimensions: { length: 38, width: 24, height: 36 },
    rating: 4.6,
    reviewsCount: 456,
    salesCount: 178,
    status: 'active',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-08'),
  },
  {
    id: '5',
    marketplaceId: '3',
    marketplaceType: 'wildberries',
    sku: 'WB-45679',
    name: 'Пылесос Dyson V15 Detect',
    description: 'Беспроводной пылесос с лазерной технологией',
    price: 69990,
    oldPrice: 79990,
    currency: 'RUB',
    quantity: 0,
    reservedQuantity: 0,
    images: ['https://via.placeholder.com/150'],
    category: 'Бытовая техника',
    brand: 'Dyson',
    barcode: '5025155056789',
    weight: 3000,
    dimensions: { length: 27, width: 12, height: 27 },
    rating: 4.8,
    reviewsCount: 2341,
    salesCount: 567,
    status: 'inactive',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-12'),
  },
  {
    id: '6',
    marketplaceId: '1',
    marketplaceType: 'ozon',
    sku: 'OZ-12347',
    name: 'Планшет iPad Pro 12.9" 256GB',
    description: 'Профессиональный планшет Apple',
    price: 119990,
    currency: 'RUB',
    quantity: 18,
    reservedQuantity: 4,
    images: ['https://via.placeholder.com/150'],
    category: 'Электроника',
    brand: 'Apple',
    barcode: '194253876543',
    weight: 682,
    dimensions: { length: 28, width: 21, height: 0.6 },
    rating: 4.9,
    reviewsCount: 1567,
    salesCount: 423,
    status: 'active',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-15'),
  },
];

interface UseProductsOptions {
  marketplaceType?: MarketplaceType | 'all';
  status?: 'active' | 'inactive' | 'all';
  searchQuery?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isLoading, setIsLoading] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (options.marketplaceType && options.marketplaceType !== 'all') {
        if (product.marketplaceType !== options.marketplaceType) return false;
      }
      
      if (options.status && options.status !== 'all') {
        if (product.status !== options.status) return false;
      }
      
      if (options.searchQuery) {
        const query = options.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesBrand = product.brand?.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesBrand) return false;
      }
      
      return true;
    });
  }, [products, options]);

  const updateProduct = useCallback(async (productId: string, updates: Partial<Product>) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, ...updates, updatedAt: new Date() }
        : p
    ));
    
    setIsLoading(false);
    return true;
  }, []);

  const updatePrice = useCallback(async (productId: string, newPrice: number) => {
    return updateProduct(productId, { price: newPrice, oldPrice: undefined });
  }, [updateProduct]);

  const updateQuantity = useCallback(async (productId: string, newQuantity: number) => {
    return updateProduct(productId, { quantity: newQuantity });
  }, []);

  const toggleProductStatus = useCallback(async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return false;
    
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    return updateProduct(productId, { status: newStatus });
  }, [products, updateProduct]);

  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    return true;
  }, []);

  const stats = useMemo(() => {
    const total = filteredProducts.length;
    const active = filteredProducts.filter(p => p.status === 'active').length;
    const inactive = filteredProducts.filter(p => p.status === 'inactive').length;
    const outOfStock = filteredProducts.filter(p => p.quantity === 0).length;
    const lowStock = filteredProducts.filter(p => p.quantity > 0 && p.quantity <= 10).length;
    
    return { total, active, inactive, outOfStock, lowStock };
  }, [filteredProducts]);

  return {
    products: filteredProducts,
    allProducts: products,
    isLoading,
    stats,
    updateProduct,
    updatePrice,
    updateQuantity,
    toggleProductStatus,
    refreshProducts,
  };
}
