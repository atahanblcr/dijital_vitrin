'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductGrid from '../product/ProductGrid';

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
    <section id="katalog" className="px-4 sm:px-6 lg:px-8 mt-12 scroll-mt-24 pb-20">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Koleksiyonlar</h2>
          <p className="text-gray-500 font-medium">Sizin için seçtiğimiz en yeni ürünlerimizi keşfedin.</p>
        </div>
        
        {/* Kategori Sekmeleri */}
        {categories.length > 0 && (
          <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeCategory === 'all' 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 scale-105' 
                  : 'bg-white text-gray-500 border border-gray-100 hover:border-blue-200 hover:text-blue-600'
              }`}
            >
              Hepsi
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  activeCategory === cat.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 scale-105' 
                    : 'bg-white text-gray-500 border border-gray-100 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ürün Listesi */}
      <motion.div layout transition={{ duration: 0.5 }}>
        <ProductGrid products={filteredProducts} businessSlug={businessSlug} />
      </motion.div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold italic">Bu kategoride henüz sergilenecek bir ürün bulunmuyor.</p>
        </div>
      )}
    </section>
  );
}
