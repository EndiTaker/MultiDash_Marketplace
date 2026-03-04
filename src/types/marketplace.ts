// Types for Marketplace Seller Hub

export type MarketplaceType = 'ozon' | 'yandex' | 'wildberries' | 'sber' | 'aliexpress';

export interface Marketplace {
  id: string;
  name: string;
  type: MarketplaceType;
  icon: string;
  connected: boolean;
  apiKey?: string;
  clientId?: string;
  lastSync?: Date;
  status: 'active' | 'inactive' | 'error';
}

export interface Product {
  id: string;
  marketplaceId: string;
  marketplaceType: MarketplaceType;
  sku: string;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  currency: string;
  quantity: number;
  reservedQuantity: number;
  images: string[];
  category: string;
  brand?: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  rating?: number;
  reviewsCount?: number;
  salesCount: number;
  status: 'active' | 'inactive' | 'blocked' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export interface Stock {
  productId: string;
  sku: string;
  name: string;
  warehouseId: string;
  warehouseName: string;
  marketplaceType: MarketplaceType;
  quantity: number;
  reserved: number;
  available: number;
  threshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: Date;
}

export interface Warehouse {
  id: string;
  marketplaceType: MarketplaceType;
  name: string;
  address?: string;
  city?: string;
  type: 'fba' | 'fbs' | 'dbm';
}

export interface Sale {
  id: string;
  orderId: string;
  productId: string;
  sku: string;
  productName: string;
  marketplaceType: MarketplaceType;
  quantity: number;
  price: number;
  totalAmount: number;
  commission: number;
  deliveryCost: number;
  netAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  createdAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface Order {
  id: string;
  marketplaceType: MarketplaceType;
  orderNumber: string;
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  customer?: {
    name?: string;
    phone?: string;
    address?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface AnalyticsData {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalSales: number;
    totalOrders: number;
    totalRevenue: number;
    totalCommission: number;
    netProfit: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  byMarketplace: {
    marketplaceType: MarketplaceType;
    sales: number;
    orders: number;
    revenue: number;
    commission: number;
    netProfit: number;
  }[];
  byDay: {
    date: string;
    sales: number;
    orders: number;
    revenue: number;
  }[];
  topProducts: {
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'viewer';
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: boolean;
    autoSync: boolean;
  };
}
