# SKILL: Ortak Bileşen Kütüphanesi & Design System

> Bu dosya, tüm frontend uygulamalarında (storefront, admin-panel, super-admin) kullanılacak
> ortak bileşenlerin tasarım standardını ve implementasyon kurallarını tanımlar.

---

## 1. TEKNOLOJİ YIĞINI

- **UI Framework:** React 18 + TypeScript
- **Stil:** Tailwind CSS 3
- **Animasyon:** Framer Motion 11
- **İkonlar:** Lucide React
- **Form:** React Hook Form + Zod
- **Toast:** Sonner (veya react-hot-toast)
- **Dnd:** @dnd-kit/core + @dnd-kit/sortable
- **Editör:** Tiptap 2
- **Grafik:** Recharts
- **Tarih:** date-fns (Türkçe locale dahil)
- **Carousel:** Embla Carousel

---

## 2. TAILWIND THEME EXTENSION

```javascript
// tailwind.config.js — tüm uygulamalarda ortak
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
      },
      animation: {
        'wa-pulse': 'wa-pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        'wa-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.7)' },
          '50%': { boxShadow: '0 0 0 12px rgba(37, 211, 102, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
};
```

---

## 3. ORTAK BİLEŞENLER

### 3.1 Button
```typescript
// packages/shared/components/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  outline: 'border border-primary text-primary hover:bg-primary/5',
  ghost: 'text-gray-600 hover:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};
```

### 3.2 Badge
```typescript
interface BadgeProps {
  variant: 'new' | 'campaign' | 'soldout' | 'active' | 'inactive' | 'draft' | 'published';
}

const badgeStyles = {
  new: 'bg-blue-500 text-white',
  campaign: 'shimmer-badge text-white',  // Altın shimmer
  soldout: 'bg-red-600 text-white',
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-500',
  draft: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
};
```

### 3.3 Confirm Dialog
```typescript
// Tüm destructive işlemlerde kullanılır
interface ConfirmDialogProps {
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary';
  requiresTyping?: string;   // Kullanıcının yazması gereken metin
  onConfirm: () => void;
  onCancel: () => void;
}
```

### 3.4 Loading States

**Skeleton Grid:**
```typescript
// Ürün listesi yüklenirken
const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
```

**Page Loading:**
```typescript
// Sayfa geçişlerinde
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
    />
  </div>
);
```

### 3.5 WhatsApp Butonu (Storefront)
```typescript
interface WhatsAppButtonProps {
  business: { whatsapp: string; name: string };
  product?: { name: string };
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

// Otomatik mesaj oluşturur + wa.me linki açar
// wa-pulse animasyonu her zaman aktif
```

---

## 4. RENK YARDIMCI FONKSİYONLARI

```typescript
// packages/shared/utils/color.ts

// Hex renginden açık ve koyu ton türetme
export function lighten(hex: string, amount: number): string { /* ... */ }
export function darken(hex: string, amount: number): string { /* ... */ }

// Arka plan rengine göre metin rengi (siyah/beyaz)
export function getContrastColor(bgHex: string): '#000000' | '#ffffff' {
  const r = parseInt(bgHex.slice(1, 3), 16);
  const g = parseInt(bgHex.slice(3, 5), 16);
  const b = parseInt(bgHex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// 15 hazır renk paleti
export const PRESET_PALETTES = [
  { id: 'midnight', name: 'Gece Mavisi', primary: '#1e40af', accent: '#3b82f6', sector: 'elektronik' },
  { id: 'rose', name: 'Gül Pembesi', primary: '#be185d', accent: '#ec4899', sector: 'butik' },
  { id: 'emerald', name: 'Zümrüt', primary: '#065f46', accent: '#10b981', sector: 'el_isi' },
  { id: 'amber', name: 'Kehribar', primary: '#92400e', accent: '#f59e0b', sector: 'aksesuar' },
  { id: 'slate', name: 'Çelik', primary: '#1e293b', accent: '#475569', sector: 'oto_galeri' },
  // ... (15 adet)
];
```

---

## 5. TARİH FORMATLAMA (Türkçe)

```typescript
// packages/shared/utils/date.ts
import { format, formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export const formatDate = (date: Date | string) =>
  format(new Date(date), 'd MMMM yyyy', { locale: tr });
  // Örnek: "15 Haziran 2025"

export const formatDateTime = (date: Date | string) =>
  format(new Date(date), 'd MMMM yyyy, HH:mm', { locale: tr });

export const formatRelative = (date: Date | string) =>
  formatDistanceToNow(new Date(date), { locale: tr, addSuffix: true });
  // Örnek: "3 gün önce"
```

---

## 6. ÇALIŞMA SAATİ HESAPLAMA

```typescript
// packages/shared/utils/businessHours.ts
export function isBusinessOpen(hours: BusinessHour[]): {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
} {
  const now = new Date();
  const dayOfWeek = now.getDay();  // 0=Pazar
  const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  
  const todayHours = hours.find(h => h.day_of_week === dayOfWeek);
  if (!todayHours || !todayHours.is_open) return { isOpen: false };
  
  const isOpen = currentTime >= todayHours.open_time! && currentTime < todayHours.close_time!;
  return { isOpen, openTime: todayHours.open_time, closeTime: todayHours.close_time };
}
```

---

## 7. HOOK KATALOĞU

```typescript
// packages/shared/hooks/

// useDebounce — arama inputları için
export function useDebounce<T>(value: T, delay: number): T

// useLocalStorage — panel tercihleri için
export function useLocalStorage<T>(key: string, initialValue: T)

// useIntersectionObserver — lazy loading için
export function useIntersectionObserver(ref: RefObject<Element>, options?: IntersectionObserverInit)

// useTheme — CSS değişkenlerini DOM'a uygular
export function useTheme(business: { theme_primary: string; theme_accent: string })
```
