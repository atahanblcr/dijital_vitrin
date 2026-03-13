'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCatalogProps {
  products: any[];
  categories: any[];
  businessSlug: string;
}

export default function ProductCatalog({ products, categories, businessSlug }: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filtreleme
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category_id === activeCategory);

  return (
    <section id="katalog" className="px-4 sm:px-6 lg:px-8 mt-4 scroll-mt-24">
      <div className="mb-8 flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Ürünlerimiz</h2>
        
        {/* Kategori Sekmeleri */}
        {categories.length > 0 && (
          <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === 'all' 
                  ? 'bg-[var(--color-primary)] text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Tümü
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id 
                    ? 'bg-[var(--color-primary)] text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ürün Grid */}
      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => {
            const primaryImage = product.images?.find((img: any) => img.is_primary)?.url 
                              || product.images?.[0]?.url 
                              || '/og-default.png';

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={product.id}
                className="h-full"
              >
                <Link 
                  href={`/${businessSlug}/urun/${product.slug}`}
                  className="group block h-full bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-50">
                    {!product.in_stock && (
                      <div className="absolute inset-0 z-20 bg-white/50 flex items-center justify-center">
                        <span className="bg-gray-900 text-white font-bold px-3 py-1 rounded-md rotate-12 text-sm">
                          TÜKENDİ
                        </span>
                      </div>
                    )}
                    <img 
                      src={primaryImage} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                      {product.short_desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Bu kategoride ürün bulunamadı.
        </div>
      )}
    </section>
  );
}
