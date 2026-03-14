'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface MobileStickyBarProps {
  productName: string;
  waUrl: string;
  inStock: boolean;
}

const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ productName, waUrl, inStock }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show bar after scrolling 400px
      if (window.scrollY > 400) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-[60] md:hidden bg-white border-t border-gray-100 p-4 pb-safe shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate">{productName}</p>
              <p className={`text-xs font-bold ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                {inStock ? 'STOKTA MEVCUT' : 'TÜKENDİ'}
              </p>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-[1.5] bg-[#25D366] text-white font-black text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-transform"
            >
              <MessageCircle size={18} />
              WhatsApp'tan Yaz
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyBar;
