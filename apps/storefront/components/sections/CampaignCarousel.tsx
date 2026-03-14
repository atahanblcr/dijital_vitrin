'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CampaignCarouselProps {
  products: any[];
  businessSlug: string;
}

export default function CampaignCarousel({ products, businessSlug }: CampaignCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-xl">🔥</span> Fırsat Ürünleri
        </h2>
      </div>

      {/* Yatay Scroll Konteyner */}
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {products.map((product) => {
          // İlk görseli ana görsel olarak bul
          const primaryImage = product.images?.find((img: any) => img.is_primary)?.url 
                            || product.images?.[0]?.url 
                            || '/og-default.png';

          return (
            <Link 
              key={product.id} 
              href={`/urun/${product.slug}`}
              className="snap-start shrink-0 w-64 md:w-80"
            >
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group h-full flex flex-col"
              >
                {/* Kampanya Rozeti */}
                <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md overflow-hidden">
                  <span className="relative z-10">KAMPANYA</span>
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                </div>

                {/* Tükendi Overlay */}
                {!product.in_stock && (
                  <div className="absolute inset-0 z-20 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="bg-gray-900 text-white font-bold px-4 py-2 rounded-lg rotate-12 text-lg">
                      TÜKENDİ
                    </span>
                  </div>
                )}

                <div className="aspect-square relative overflow-hidden bg-gray-50">
                  <img 
                    src={primaryImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 flex-1">{product.short_desc}</p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
