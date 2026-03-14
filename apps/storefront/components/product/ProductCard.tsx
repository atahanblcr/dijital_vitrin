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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/urun/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              No Image
            </div>
          )}

          {/* Rozetler */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.is_campaign && (
              <div className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg animate-pulse">
                <TrendingUp className="w-3 h-3 mr-1" /> KAMPANYA
              </div>
            )}
            {/* "Yeni" etiketi: Son 7 günde eklendiyse */}
            {new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
              <div className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                YENİ
              </div>
            )}
          </div>

          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
              <div className="bg-white/90 text-red-600 font-black text-sm px-6 py-2 rounded-full flex items-center shadow-2xl">
                <PackageX className="w-4 h-4 mr-2" /> TÜKENDİ
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
            {product.category?.name || 'Kategorisiz'}
          </p>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[40px]">
            {product.short_desc || 'Bu ürün için henüz bir açıklama girilmemiş.'}
          </p>
          
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
              İncele
            </span>
            <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:border-blue-200 group-hover:text-blue-500 transition-all">
              →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
