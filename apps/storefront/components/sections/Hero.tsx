'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  business: any;
}

export default function Hero({ business }: HeroProps) {
  // Eğer banner yoksa CSS değişkenlerinden türetilen gradyan kullanılacak
  const hasBanner = !!business.banner_url;

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden rounded-b-3xl sm:rounded-3xl sm:mt-4 max-w-7xl mx-auto">
      
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={hasBanner ? {
          backgroundImage: `url(${business.banner_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {
          background: 'var(--color-gradient)'
        }}
      />

      {/* Overlay to ensure text readability */}
      {hasBanner && (
        <div className="absolute inset-0 z-10 bg-black/40" />
      )}

      {/* Content */}
      <div className="relative z-20 text-center px-4 text-white flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md"
        >
          {business.name}
        </motion.h1>
        
        {business.slogan && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-2xl opacity-90 drop-shadow-sm max-w-2xl"
          >
            {business.slogan}
          </motion.p>
        )}

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <a 
            href="#katalog"
            className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Ürünleri Gör
          </a>
        </motion.div>
      </div>

    </div>
  );
}
