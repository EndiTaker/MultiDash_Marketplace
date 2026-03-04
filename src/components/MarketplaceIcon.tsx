import type { MarketplaceType } from '@/types/marketplace';

interface MarketplaceIconProps {
  type: MarketplaceType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export function MarketplaceIcon({ type, size = 'md', className = '' }: MarketplaceIconProps) {
  const sizeClass = sizeMap[size];
  
  switch (type) {
    case 'ozon':
      return (
        <div className={`${sizeClass} rounded-lg bg-gradient-to-br from-[#005BFF] to-[#0041B3] flex items-center justify-center text-white font-bold ${className}`}>
          <span className="text-xs">O</span>
        </div>
      );
    case 'yandex':
      return (
        <div className={`${sizeClass} rounded-lg bg-gradient-to-br from-[#FC3F1D] to-[#D93616] flex items-center justify-center text-white font-bold ${className}`}>
          <span className="text-xs">Я</span>
        </div>
      );
    case 'wildberries':
      return (
        <div className={`${sizeClass} rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white font-bold ${className}`}>
          <span className="text-xs">WB</span>
        </div>
      );
    case 'sber':
      return (
        <div className={`${sizeClass} rounded-lg bg-gradient-to-br from-[#21A038] to-[#157026] flex items-center justify-center text-white font-bold ${className}`}>
          <span className="text-xs">СБ</span>
        </div>
      );
    case 'aliexpress':
      return (
        <div className={`${sizeClass} rounded-lg bg-gradient-to-br from-[#FF4747] to-[#E60000] flex items-center justify-center text-white font-bold ${className}`}>
          <span className="text-xs">AE</span>
        </div>
      );
    default:
      return (
        <div className={`${sizeClass} rounded-lg bg-gray-400 flex items-center justify-center text-white font-bold ${className}`}>
          <span className="text-xs">?</span>
        </div>
      );
  }
}

export function MarketplaceBadge({ type, showName = false }: { type: MarketplaceType; showName?: boolean }) {
  const names: Record<MarketplaceType, string> = {
    ozon: 'Ozon',
    yandex: 'Яндекс Маркет',
    wildberries: 'Wildberries',
    sber: 'СберМегаМаркет',
    aliexpress: 'AliExpress',
  };

  return (
    <div className="flex items-center gap-2">
      <MarketplaceIcon type={type} size="sm" />
      {showName && <span className="text-sm font-medium">{names[type]}</span>}
    </div>
  );
}
