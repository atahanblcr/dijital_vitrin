'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface MobileStickyBarProps {
  productName: string;
  waUrl: string;
  inStock: boolean;
}

const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ productName, waUrl, inStock }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-t border-gray-100 p-4 pb-safe md:hidden">
      <div className="flex items-center gap-4 max-w-7xl mx-auto px-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800 line-clamp-1 truncate">{productName}</p>
          <p className={`text-[10px] font-black uppercase tracking-wider ${inStock ? 'text-green-600' : 'text-red-600'}`}>
            {inStock ? 'STOKTA MEVCUT' : 'TÜKENDİ'}
          </p>
        </div>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-[1.5] bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-all"
        >
          <MessageCircle size={18} />
          Sipariş Ver
        </a>
      </div>
    </div>
  );
};

export default MobileStickyBar;
