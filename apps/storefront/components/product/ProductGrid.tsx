'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import EmptyState from '../ui/EmptyState';

interface ProductGridProps {
  products: any[];
  businessSlug: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, businessSlug }) => {
  if (products.length === 0) {
    return <EmptyState />;
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
