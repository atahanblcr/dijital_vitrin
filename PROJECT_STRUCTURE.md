# 📁 DİJİTAL VİTRİN — Proje Dosya Ağacı Dokümantasyonu

> **Amaç:** Bu doküman, yapay zekanın projeyi sıfırdan oluştururken
> takip edeceği klasör ve dosya yapısını tanımlar.
> Tüm dosyalar bu yapıya uygun oluşturulmalıdır.

---

## Teknoloji Özeti

| Katman | Teknoloji |
|---|---|
| Monorepo | npm workspaces |
| Vitrin (SSR) | Next.js 14 + TypeScript |
| Admin Paneller | React 18 + TypeScript (Vite) |
| Backend API | Node.js + Express.js + TypeScript |
| Veritabanı | PostgreSQL + Prisma ORM |
| Stil | Tailwind CSS |
| Animasyon | Framer Motion |
| Görsel CDN | Cloudinary |
| Süreç Yönetimi | PM2 |
| Web Sunucusu | Nginx (wildcard subdomain) |

---

## Tam Dosya Ağacı

```
dijital-vitrin/
│
├── package.json                          # Root — npm workspaces tanımı
├── tsconfig.base.json                    # Ortak TypeScript ayarları
├── .env.example                          # Örnek environment değişkenleri
├── .gitignore
├── README.md
│
├── apps/
│   │
│   ├── storefront/                       # Next.js 14 — Vitrin Sitesi (SSR)
│   │   ├── package.json
│   │   ├── next.config.js                # Subdomain + image domains ayarı
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   ├── middleware.ts                 # Subdomain → slug çözümleme
│   │   │
│   │   ├── app/
│   │   │   ├── layout.tsx               # Root layout — ThemeProvider
│   │   │   ├── not-found.tsx            # Global 404 sayfası
│   │   │   ├── inactive/
│   │   │   │   └── page.tsx             # Pasif işletme bilgilendirme sayfası
│   │   │   │
│   │   │   └── [slug]/                  # İşletme vitrin route'ları
│   │   │       ├── layout.tsx           # Header + Footer + Tema CSS değişkenleri
│   │   │       ├── page.tsx             # Anasayfa (Hero + Carousel + Katalog)
│   │   │       ├── urunler/
│   │   │       │   └── page.tsx         # Tüm ürünler sayfası
│   │   │       ├── urun/
│   │   │       │   └── [productSlug]/
│   │   │       │       └── page.tsx     # Ürün detay sayfası (SSR + JSON-LD)
│   │   │       ├── blog/
│   │   │       │   ├── page.tsx         # Blog listesi
│   │   │       │   └── [blogSlug]/
│   │   │       │       └── page.tsx     # Blog yazısı (SSR + JSON-LD)
│   │   │       └── hakkimizda/
│   │   │           └── page.tsx         # Hakkımızda + Çalışma saatleri + Harita
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx           # Sticky header, hamburger menü
│   │   │   │   ├── Footer.tsx           # Logo, WA, sosyal medya, saatler
│   │   │   │   ├── MobileMenu.tsx       # Bottom sheet, Framer Motion
│   │   │   │   └── ThemeProvider.tsx    # CSS değişkenlerini DOM'a yazar
│   │   │   ├── sections/
│   │   │   │   ├── Hero.tsx             # Banner, slogan, CTA, çalışma saati
│   │   │   │   ├── CampaignCarousel.tsx # Kampanya ürünleri carousel
│   │   │   │   ├── ProductCatalog.tsx   # Kategori sekmeleri + grid
│   │   │   │   ├── BlogSection.tsx      # Son blog yazıları (anasayfada)
│   │   │   │   └── AboutSection.tsx     # Hakkımızda bölümü
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.tsx      # Kart (YENİ, KAMPANYA, TÜKENDİ badge)
│   │   │   │   ├── ProductGrid.tsx      # Responsive grid wrapper
│   │   │   │   ├── ProductGallery.tsx   # Lightbox galeri + thumbnail
│   │   │   │   ├── AttributeTable.tsx   # Özellik tablosu
│   │   │   │   └── ProductJsonLd.tsx    # Schema.org JSON-LD
│   │   │   ├── blog/
│   │   │   │   ├── BlogCard.tsx
│   │   │   │   └── BlogJsonLd.tsx
│   │   │   ├── ui/
│   │   │   │   ├── WhatsAppButton.tsx   # wa-pulse animasyonlu, mesaj şablonu
│   │   │   │   ├── BusinessHoursStatus.tsx # Açık/Kapalı göstergesi
│   │   │   │   ├── CategoryTabs.tsx     # Kaydırmalı sekme çubuğu
│   │   │   │   ├── SkeletonCard.tsx     # Loading placeholder
│   │   │   │   ├── CookieConsent.tsx    # KVKK çerez banner
│   │   │   │   └── ScrollReveal.tsx     # Framer Motion whileInView wrapper
│   │   │   └── seo/
│   │   │       ├── BusinessJsonLd.tsx   # LocalBusiness schema
│   │   │       └── generateMetadata.ts  # Sayfa metadata üretici
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                   # Storefront API çağrıları
│   │   │   └── theme.ts                 # CSS değişken hesaplama
│   │   │
│   │   └── public/
│   │       ├── favicon.ico
│   │       └── og-default.png           # Varsayılan OG görseli
│   │
│   ├── admin-panel/                     # Vite + React SPA — İşletme Admin
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   ├── index.html
│   │   │
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx                  # Router + AuthGuard
│   │       ├── routes.tsx               # React Router tanımları
│   │       │
│   │       ├── pages/
│   │       │   ├── Login.tsx
│   │       │   ├── Dashboard.tsx        # KPI kartlar + grafik + hızlı eylem
│   │       │   ├── categories/
│   │       │   │   ├── CategoryList.tsx  # Kategori listesi + CRUD
│   │       │   │   └── AttributeManager.tsx # Özellik yönetimi
│   │       │   ├── products/
│   │       │   │   ├── ProductList.tsx   # Tablo, filtre, toggle'lar
│   │       │   │   ├── ProductForm.tsx   # Ekle/düzenle formu (tam validasyon)
│   │       │   │   └── ProductSort.tsx   # Sürükle-bırak sıralama
│   │       │   ├── blog/
│   │       │   │   ├── BlogList.tsx
│   │       │   │   └── BlogEditor.tsx    # Tiptap editör + yayın kontrol
│   │       │   └── analytics/
│   │       │       └── Analytics.tsx    # Grafikler + ürün tablosu
│   │       │
│   │       ├── components/
│   │       │   ├── layout/
│   │       │   │   ├── AdminLayout.tsx   # Sidebar + Topbar wrapper
│   │       │   │   ├── Sidebar.tsx
│   │       │   │   └── Topbar.tsx
│   │       │   ├── product/
│   │       │   │   ├── ImageUploader.tsx # Sürükle-bırak, sıralama
│   │       │   │   └── AttributeFields.tsx # Dinamik özellik alanları
│   │       │   └── ui/
│   │       │       ├── ConfirmDialog.tsx
│   │       │       ├── DataTable.tsx
│   │       │       ├── EmptyState.tsx
│   │       │       ├── StatsCard.tsx
│   │       │       └── TagInput.tsx     # Çoktan seçmeli seçenek girişi
│   │       │
│   │       ├── hooks/
│   │       │   ├── useAuth.ts
│   │       │   ├── useProducts.ts       # React Query hooks
│   │       │   ├── useCategories.ts
│   │       │   └── useBlog.ts
│   │       │
│   │       ├── lib/
│   │       │   ├── api.ts               # Axios instance + interceptors
│   │       │   └── queryClient.ts       # React Query config
│   │       │
│   │       └── store/
│   │           └── authStore.ts         # Zustand — auth state
│   │
│   └── super-admin/                     # Vite + React SPA — Süper Admin
│       ├── package.json
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       ├── index.html
│       │
│       └── src/
│           ├── main.tsx
│           ├── App.tsx
│           ├── routes.tsx
│           │
│           ├── pages/
│           │   ├── Login.tsx             # 2FA step dahil
│           │   ├── Dashboard.tsx         # Platform özeti + abonelik uyarıları
│           │   ├── businesses/
│           │   │   ├── BusinessList.tsx  # Arama, filtre, sıralama tablosu
│           │   │   ├── BusinessForm.tsx  # Tam işletme oluşturma/düzenleme formu
│           │   │   └── BusinessDetail.tsx # Detay + impersonation + şifre sıfırla
│           │   ├── analytics/
│           │   │   └── PlatformAnalytics.tsx # Platform geneli + işletme karşılaştırma
│           │   └── settings/
│           │       └── PlatformSettings.tsx  # Varsayılan ayarlar + platform duyurusu
│           │
│           ├── components/
│           │   ├── layout/
│           │   │   ├── SuperAdminLayout.tsx
│           │   │   ├── Sidebar.tsx        # Koyu sidebar
│           │   │   └── ImpersonationBanner.tsx # Sarı uyarı banner
│           │   ├── business/
│           │   │   ├── ThemePicker.tsx    # 15 palet + custom hex
│           │   │   ├── WorkingHoursForm.tsx # Haftanın günleri
│           │   │   └── SubscriptionForm.tsx
│           │   └── charts/
│           │       ├── PlatformTrendChart.tsx
│           │       ├── BusinessCompareChart.tsx
│           │       └── SectorPieChart.tsx
│           │
│           ├── hooks/
│           │   ├── useAuth.ts
│           │   └── useBusinesses.ts
│           │
│           ├── lib/
│           │   ├── api.ts
│           │   └── queryClient.ts
│           │
│           └── store/
│               └── authStore.ts
│
├── packages/
│   │
│   ├── api/                              # Express.js REST API
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   │
│   │   └── src/
│   │       ├── index.ts                  # App bootstrap, middleware sırası
│   │       │
│   │       ├── config/
│   │       │   ├── env.ts               # Zod env validation
│   │       │   ├── database.ts          # Prisma client singleton
│   │       │   └── cloudinary.ts
│   │       │
│   │       ├── middleware/
│   │       │   ├── auth.ts              # JWT + rol kontrolü
│   │       │   ├── rateLimiter.ts       # Global, admin, login limitler
│   │       │   ├── errorHandler.ts      # AppError + Zod + Prisma hataları
│   │       │   ├── validate.ts          # Request body/params validation
│   │       │   └── security.ts          # Helmet, CORS, HPP
│   │       │
│   │       ├── routes/
│   │       │   ├── auth.routes.ts       # /api/auth/*
│   │       │   ├── admin.routes.ts      # /api/admin/* (süper admin)
│   │       │   ├── business.routes.ts   # /api/business/* (işletme admin)
│   │       │   ├── storefront.routes.ts # /api/storefront/* (public)
│   │       │   └── analytics.routes.ts  # /api/analytics/*
│   │       │
│   │       ├── controllers/
│   │       │   ├── auth.controller.ts
│   │       │   ├── businesses.controller.ts
│   │       │   ├── categories.controller.ts
│   │       │   ├── products.controller.ts
│   │       │   ├── images.controller.ts
│   │       │   ├── blog.controller.ts
│   │       │   ├── storefront.controller.ts
│   │       │   └── analytics.controller.ts
│   │       │
│   │       ├── services/
│   │       │   ├── auth.service.ts      # Login, 2FA, token yönetimi
│   │       │   ├── business.service.ts
│   │       │   ├── product.service.ts
│   │       │   ├── image.service.ts     # Cloudinary upload/delete
│   │       │   ├── analytics.service.ts # Event kayıt + özet hesaplama
│   │       │   └── slug.service.ts      # Benzersiz Türkçe slug üretimi
│   │       │
│   │       ├── validators/              # Zod şemaları
│   │       │   ├── auth.validator.ts
│   │       │   ├── business.validator.ts
│   │       │   ├── product.validator.ts
│   │       │   ├── category.validator.ts
│   │       │   └── blog.validator.ts
│   │       │
│   │       ├── jobs/
│   │       │   ├── dailySummary.ts      # Cron: gece 02:00 analytics özetleme
│   │       │   └── subscriptionCheck.ts # Cron: sabah 09:00 abonelik kontrol
│   │       │
│   │       └── utils/
│   │           ├── jwt.ts
│   │           ├── password.ts          # bcrypt hash + compare
│   │           ├── slugify.ts           # Türkçe karakter dönüşümü
│   │           ├── botFilter.ts         # User-agent crawler kontrolü
│   │           └── ipHash.ts            # SHA256 (KVKK)
│   │
│   ├── database/                        # Prisma şeması ve migration'lar
│   │   ├── package.json
│   │   └── prisma/
│   │       ├── schema.prisma            # Tam veritabanı şeması
│   │       ├── seed.ts                  # Süper admin + sektör şablonları
│   │       └── migrations/              # Otomatik oluşturulan migration dosyaları
│   │
│   └── shared/                          # Ortak tipler, yardımcılar, bileşenler
│       ├── package.json
│       ├── tsconfig.json
│       │
│       ├── types/
│       │   ├── business.types.ts        # Business, BusinessHour, Sector
│       │   ├── product.types.ts         # Product, ProductImage, Attribute
│       │   ├── user.types.ts            # User, UserRole
│       │   ├── analytics.types.ts       # Event, DailySummary
│       │   └── api.types.ts             # ApiResponse<T>, PaginatedResponse<T>
│       │
│       ├── utils/
│       │   ├── slugify.ts               # Türkçe slug (hem API hem frontend)
│       │   ├── color.ts                 # Renk türetme, kontrast hesaplama, paletler
│       │   ├── businessHours.ts         # Çalışma saati hesaplama
│       │   ├── date.ts                  # Türkçe date-fns formatları
│       │   └── whatsapp.ts              # wa.me URL üretici + mesaj şablonları
│       │
│       └── constants/
│           ├── sectors.ts               # Sektör listesi + kategori şablonları
│           ├── themes.ts                # 15 hazır renk paleti
│           └── botPatterns.ts           # Bilinen crawler user-agent'ları
│
└── infrastructure/
    ├── nginx/
    │   ├── dijitalvitrin.conf           # Wildcard subdomain konfigürasyonu
    │   └── snippets/
    │       └── ssl-params.conf          # SSL/TLS güvenlik ayarları
    │
    ├── pm2/
    │   └── ecosystem.config.js          # API + storefront process yönetimi
    │
    └── scripts/
        ├── deploy.sh                    # Tam deployment scripti
        ├── backup.sh                    # PostgreSQL dump + upload
        └── setup.sh                     # Sunucu ilk kurulum (Nginx, certbot, PM2)
```

---

## Subdomain Mimarisi

```
dijitalvitrin.com          →  Platform tanıtım sayfası (opsiyonel / statik)
app.dijitalvitrin.com      →  İşletme admin paneli (admin-panel SPA)
admin.dijitalvitrin.com    →  Süper admin paneli (super-admin SPA)
*.dijitalvitrin.com        →  İşletme vitrin siteleri (storefront Next.js)
```

---

## Port Yapısı (VPS Üzerinde)

```
Nginx           → 80/443    (public)
Next.js (SSR)   → 3000      (internal, Nginx proxy)
Express API     → 4000      (internal, Nginx proxy)
Vite admin      → Build     (static dosyalar Nginx'ten servis edilir)
PostgreSQL      → 5432      (sadece localhost)
Redis (Faz 2)   → 6379      (sadece localhost)
```

---

## Environment Değişkenleri (.env.example)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dijital_vitrin

# JWT
JWT_SECRET=                    # min 32 karakter, random
JWT_REFRESH_SECRET=            # farklı, min 32 karakter

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Analytics
IP_HASH_SALT=                  # min 16 karakter, random

# Redis (Faz 2)
REDIS_URL=redis://localhost:6379

# App
NODE_ENV=production
API_PORT=4000
NEXT_PUBLIC_API_URL=https://api.dijitalvitrin.com
NEXT_PUBLIC_BASE_DOMAIN=dijitalvitrin.com
```

---

## npm Workspaces (package.json root)

```json
{
  "name": "dijital-vitrin",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:api": "npm run dev --workspace=packages/api",
    "dev:storefront": "npm run dev --workspace=apps/storefront",
    "dev:admin": "npm run dev --workspace=apps/admin-panel",
    "dev:super": "npm run dev --workspace=apps/super-admin",
    "db:migrate": "npm run migrate --workspace=packages/database",
    "db:seed": "npm run seed --workspace=packages/database",
    "build:all": "npm run build --workspaces",
    "type-check": "tsc --noEmit --project tsconfig.base.json"
  }
}
```

---

## Geliştirme Öncelik Sırası (Faz 1 → 5)

### Faz 1 — Altyapı
1. `packages/database` — Prisma şeması + migration + seed
2. `packages/api` — Express kurulum, güvenlik middleware, auth
3. `apps/super-admin` — İşletme CRUD paneli
4. Cloudinary entegrasyonu
5. Nginx + wildcard SSL

### Faz 2 — İçerik Sistemleri
6. `packages/api` — Kategori, özellik, ürün endpoint'leri
7. `apps/admin-panel` — Kategori + ürün yönetim paneli
8. Görsel yükleme (sürükle-bırak)

### Faz 3 — Vitrin Sitesi
9. `apps/storefront` — Next.js SSR altyapısı + subdomain routing
10. Renk tema sistemi
11. Tüm vitrin bileşenleri + animasyonlar
12. WhatsApp entegrasyonu

### Faz 4 — SEO ve İstatistik
13. JSON-LD, sitemap, robots.txt
14. Analytics event sistemi + cron job
15. Dashboard grafikleri

### Faz 5 — Test ve Yayın
16. Güvenlik, performans, mobil testleri
17. VPS kurulum scriptleri
18. Canlıya geçiş

---

## SKILL Dosyaları Referans Tablosu

| Görev | Okunacak SKILL Dosyası |
|---|---|
| Vitrin bileşeni yazmak | `SKILL-storefront-ui-ux.md` |
| Admin panel bileşeni yazmak | `SKILL-admin-panel-ui-ux.md` |
| Backend endpoint yazmak | `SKILL-backend-api.md` |
| Veritabanı şeması/sorgu | `SKILL-database.md` |
| Ortak bileşen/util yazmak | `SKILL-component-library.md` |

---

*Dijital Vitrin Platformu — Gizlidir*
*Bu doküman AI geliştirme referans belgesidir.*
