import React from 'react';
import Link from 'next/link';

interface FooterProps {
  business: any;
}

export default function Footer({ business }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 py-10 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-bold text-xl text-gray-900 mb-2">{business.name}</h3>
          <p className="text-sm max-w-sm">{business.about_text?.substring(0, 100)}...</p>
        </div>

        <div className="flex gap-4">
          {/* Sadece girilen sosyal medya linkleri */}
          {business.instagram_url && (
            <a href={business.instagram_url} target="_blank" rel="noreferrer" className="hover:text-gray-900">
              Instagram
            </a>
          )}
          {business.facebook_url && (
            <a href={business.facebook_url} target="_blank" rel="noreferrer" className="hover:text-gray-900">
              Facebook
            </a>
          )}
        </div>

      </div>
      <div className="mt-8 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} {business.name}. Tüm hakları saklıdır.
        <br />
        <span className="mt-2 inline-block">Dijital Vitrin ile güçlendirilmiştir.</span>
      </div>
    </footer>
  );
}
