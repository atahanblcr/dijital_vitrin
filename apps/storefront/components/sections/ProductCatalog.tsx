'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductGrid from '../product/ProductGrid';
import { getStorefrontProducts } from '../../lib/api';

interface ProductCatalogProps {
  products: any[];
  categories: any[];
  businessSlug: string;
}

export default function ProductCatalog({ products: initialProducts, categories, businessSlug }: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [loading, setLoading] = useState<boolean>(false);

  // Kategori değiştiğinde ürünleri API'den çek
  useEffect(() => {
    // İlk yüklemede initialProducts'ı kullan, tekrar çekme (opsiyonel ama performans için iyi)
    if (activeCategory === 'all' && products === initialProducts) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getStorefrontProducts(businessSlug, activeCategory);
        setProducts(data);
      } catch (error) {
        console.error('Ürünler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, businessSlug]);

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
              disabled={loading}
              className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 disabled:opacity-50 ${
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
                disabled={loading}
                className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 disabled:opacity-50 ${
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
      <div className={`transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <motion.div layout transition={{ duration: 0.5 }}>
          <ProductGrid products={products} businessSlug={businessSlug} />
        </motion.div>
      </div>

      {!loading && products.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold italic">Bu kategoride henüz sergilenecek bir ürün bulunmuyor.</p>
        </div>
      )}
    </section>
  );
}
