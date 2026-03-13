import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BlogCardProps {
  post: any;
  businessSlug: string;
}

export default function BlogCard({ post, businessSlug }: BlogCardProps) {
  // Tarih formatlama
  const dateObj = new Date(post.published_at || post.created_at);
  const formattedDate = dateObj.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link 
      href={`/${businessSlug}/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden h-full"
    >
      <div className="aspect-[16/9] relative overflow-hidden bg-gray-50">
        <img 
          src={post.cover_image_url || '/og-default.png'} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs text-gray-400 mb-2">
          {formattedDate}
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3 mt-auto">
          {post.meta_description || 'Yazının devamını okumak için tıklayın.'}
        </p>
      </div>
    </Link>
  );
}
