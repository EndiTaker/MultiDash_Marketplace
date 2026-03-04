import { useState, useCallback } from 'react';
import type { Marketplace } from '@/types/marketplace';

const initialMarketplaces: Marketplace[] = [
  {
    id: '1',
    name: 'Ozon',
    type: 'ozon',
    icon: 'ozon',
    connected: false,
    status: 'inactive',
  },
  {
    id: '2',
    name: 'Яндекс Маркет',
    type: 'yandex',
    icon: 'yandex',
    connected: false,
    status: 'inactive',
  },
  {
    id: '3',
    name: 'Wildberries',
    type: 'wildberries',
    icon: 'wildberries',
    connected: false,
    status: 'inactive',
  },
  {
    id: '4',
    name: 'СберМегаМаркет',
    type: 'sber',
    icon: 'sber',
    connected: false,
    status: 'inactive',
  },
  {
    id: '5',
    name: 'AliExpress',
    type: 'aliexpress',
    icon: 'aliexpress',
    connected: false,
    status: 'inactive',
  },
];

export function useMarketplaces() {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>(initialMarketplaces);
  const [isLoading, setIsLoading] = useState(false);

  const connectMarketplace = useCallback(async (id: string, apiKey: string, clientId?: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setMarketplaces(prev => prev.map(mp => 
      mp.id === id 
        ? { 
            ...mp, 
            connected: true, 
            apiKey,
            clientId,
            status: 'active',
            lastSync: new Date()
          }
        : mp
    ));
    
    setIsLoading(false);
    return true;
  }, []);

  const disconnectMarketplace = useCallback(async (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setMarketplaces(prev => prev.map(mp => 
      mp.id === id 
        ? { 
            ...mp, 
            connected: false, 
            apiKey: undefined,
            clientId: undefined,
            status: 'inactive',
            lastSync: undefined
          }
        : mp
    ));
    
    setIsLoading(false);
    return true;
  }, []);

  const syncMarketplace = useCallback(async (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setMarketplaces(prev => prev.map(mp => 
      mp.id === id 
        ? { ...mp, lastSync: new Date() }
        : mp
    ));
    
    setIsLoading(false);
    return true;
  }, []);

  const getConnectedMarketplaces = useCallback(() => {
    return marketplaces.filter(mp => mp.connected);
  }, [marketplaces]);

  return {
    marketplaces,
    isLoading,
    connectMarketplace,
    disconnectMarketplace,
    syncMarketplace,
    getConnectedMarketplaces,
  };
}
