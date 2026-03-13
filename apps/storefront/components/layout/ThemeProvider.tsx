'use client';

import React, { useEffect } from 'react';

// Hedef: jenerik olmayan, canlı, bold renkler
// Hex rengini RGB veya HSL'e çeviren yardımcı eklenebilir, şimdilik CSS variable ile
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : '0 0 0';
}

interface ThemeProviderProps {
  children: React.ReactNode;
  primaryColor: string;
  accentColor: string;
}

export default function ThemeProvider({ children, primaryColor, accentColor }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-primary-rgb', hexToRgb(primaryColor));
    
    root.style.setProperty('--color-accent', accentColor);
    root.style.setProperty('--color-accent-rgb', hexToRgb(accentColor));
    
    // Basit bir gradyan hesaplaması
    root.style.setProperty(
      '--color-gradient', 
      `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`
    );
  }, [primaryColor, accentColor]);

  return <div className="theme-wrapper w-full min-h-screen">{children}</div>;
}
