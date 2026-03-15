'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PackageX, TrendingUp } from 'lucide-react';

interface ProductCardProps {
  product: any;
  businessSlug: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, businessSlug }) => {
  const mainImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300"
    >
      <Link href={`/urun/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              Görsel Yok
            </div>
          )}

          {/* Rozetler */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_campaign && (
              <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center shadow-md animate-pulse">
                <TrendingUp className="w-3 h-3 mr-1" /> KAMPANYA
              </div>
            )}
            {/* "Yeni" etiketi: Son 7 günde eklendiyse */}
            {new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
              <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                YENİ
              </div>
            )}
          </div>

          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
              <div className="bg-white/95 text-red-600 font-black text-xs px-4 py-1.5 rounded-full flex items-center shadow-lg">
                <PackageX className="w-3.5 h-3.5 mr-1.5" /> TÜKENDİ
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 line-clamp-1">
            {product.category?.name || 'Kategorisiz'}
          </p>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug h-[44px]">
            {product.name}
          </h3>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 group-hover:text-blue-600 transition-colors">
              İncele
            </span>
            <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
              →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
