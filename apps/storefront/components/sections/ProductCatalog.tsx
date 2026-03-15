'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductGrid from '../product/ProductGrid';
import { getStorefrontProducts } from '../../lib/api';
import EmptyState from '../ui/EmptyState';

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
    <section id="katalog" className="mt-12 scroll-mt-24 pb-20">
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Koleksiyonlar</h2>
        <p className="text-gray-500 font-medium">Sizin için seçtiğimiz en yeni ürünlerimizi keşfedin.</p>
      </div>
      
      {/* Sticky Kategori Sekmeleri (Mobil App Hissi) */}
      {categories.length > 0 && (
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100/50 mb-8 py-3">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto gap-3 pb-1 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              <button
                onClick={() => setActiveCategory('all')}
                disabled={loading}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 disabled:opacity-50 flex-shrink-0 ${
                  activeCategory === 'all' 
                    ? 'bg-gray-900 text-white shadow-md shadow-gray-900/20 scale-100' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Hepsi
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  disabled={loading}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 disabled:opacity-50 flex-shrink-0 ${
                    activeCategory === cat.id 
                      ? 'bg-gray-900 text-white shadow-md shadow-gray-900/20 scale-100' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ürün Listesi */}
      <div className={`px-4 sm:px-6 lg:px-8 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <motion.div layout transition={{ duration: 0.5 }}>
          <ProductGrid products={products} businessSlug={businessSlug} />
        </motion.div>

        {!loading && products.length === 0 && (
          <div className="mt-8">
            <EmptyState />
          </div>
        )}
      </div>
    </section>
  );
}
