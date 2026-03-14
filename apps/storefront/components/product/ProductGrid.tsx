'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

interface ProductGridProps {
  products: any[];
  businessSlug: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, businessSlug }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-xl font-medium">Bu kategoride henüz ürün bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} businessSlug={businessSlug} />
      ))}
    </div>
  );
};

export default ProductGrid;
