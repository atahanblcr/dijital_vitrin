'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGalleryProps {
  images: any[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Görsel yoksa default
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400">Görsel Bulunamadı</span>
      </div>
    );
  }

  // Ensure they are sorted properly
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-square relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={sortedImages[activeIndex].url}
            alt={`${productName} - Görsel ${activeIndex + 1}`}
            className="w-full h-full object-contain"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {sortedImages.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(index)}
              className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-all ${
                activeIndex === index 
                  ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-50' 
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              <img 
                src={img.url} 
                alt="Thumbnail" 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
