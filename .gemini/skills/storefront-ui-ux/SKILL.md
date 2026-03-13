# SKILL: Storefront (Vitrin Sitesi) UI & UX

> Bu dosya, Dijital Vitrin projesinin müşteriye açık vitrin sitesini oluştururken yapay zekanın
> uyması gereken UI ve UX kurallarının **eksiksiz** referans belgesidir.
> Her bileşen yazılmadan önce bu dosya okunmalı ve kurallara tam uyum sağlanmalıdır.

---

## 1. TASARIM FELSEFESİ — HİÇBİR ZAMAN UNUTMA

### 1.1 Anti-Pattern: "AI Template" Görünümü
Vitrin sitesi **ASLA** şu özelliklere sahip olmamalıdır:
- Beyaz arka plan + gri kartlar + mavi buton kombinasyonu (jenerik SaaS görünümü)
- Aynı tipografi hiyerarşisi her işletmede tekrarlanmamalı
- Flat, renksiz, "sakin" bir estetik
- Bootstrap/MUI'ye özgü hazır bileşen görünümü

### 1.2 Zorunlu Tasarım Karakteri
Her vitrin sayfası **canlı, enerjik ve işletmeye özel** hissettirmelidir:
- **Bold renkler:** İşletmenin `theme_primary` rengi agresif biçimde uygulanır
- **Gradyan arka planlar:** Sade düz renkler yerine gradient kullanılır
- **Akıcı animasyonlar:** Framer Motion ile her bileşen hareket eder
- **Derinlik:** Box shadow, glassmorphism, parallax efektleriyle 3 boyutlu his

### 1.3 Mobile-First Kuralı
Her bileşen **önce mobil (375px) için** tasarlanır, sonra büyük ekrana ölçeklenir.
Hiçbir zaman masaüstü tasarımı mobil için daraltılmaz.

---

## 2. RENK TEMA SİSTEMİ

### 2.1 CSS Değişkenleri — Zorunlu Yapı
Tüm tema renkleri CSS custom properties üzerinden uygulanır:

```css
:root {
  --color-primary: #hex;        /* İşletmenin ana rengi */
  --color-accent: #hex;         /* Vurgu rengi (primary'den türetilir) */
  --color-primary-light: #hex;  /* %20 daha açık ton */
  --color-primary-dark: #hex;   /* %20 daha koyu ton */
  --color-bg-gradient-start: #hex;
  --color-bg-gradient-end: #hex;
  --color-card-bg: #hex;
  --color-card-border: rgba(255,255,255,0.15);
  --color-text-on-primary: #fff veya #000; /* Kontrast oranı 4.5:1'i geçmeli */
}
```

### 2.2 Renk Uygulama Kuralları
- **Butonlar:** `bg-[var(--color-primary)]` hover'da `bg-[var(--color-primary-dark)]`
- **Başlıklar:** H1/H2 başlıklarda `text-[var(--color-primary)]` veya gradient text
- **Kartlar:** `bg-[var(--color-card-bg)]` + `border border-[var(--color-card-border)]`
- **Arka plan:** Hero bölümünde gradient mutlaka kullanılır
- **WhatsApp butonu:** HER ZAMAN yeşil — `#25D366` — tema rengi ne olursa olsun

### 2.3 Kontrast Uyumu
- Koyu arka plan üzerinde beyaz metin (minimum 4.5:1 oranı)
- Açık renkli temalarda otomatik koyu metin geçişi
- `getTextColor(bgHex)` yardımcı fonksiyonu kullanılmalı

---

## 3. ANİMASYON SİSTEMİ (Framer Motion)

### 3.1 Zorunlu Animasyonlar — Hiçbirini Atlama

#### Scroll Reveal (Bölüm Girişleri)
```typescript
// Tüm sayfa bölümleri için kullanılacak variant
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

// Her bölümü <motion.section> ile sar
<motion.section
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
>
```

#### Ürün Kartı Hover
```typescript
<motion.div
  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
>
```

#### Hero Parallax
```typescript
// useScroll + useTransform kullanılır
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 500], [0, -80]);
<motion.div style={{ y }}>
  {/* Banner görseli */}
</motion.div>
```

#### WhatsApp Pulse
```css
/* Tailwind custom animation — globals.css */
@keyframes wa-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
  50% { box-shadow: 0 0 0 12px rgba(37, 211, 102, 0); }
}
.wa-pulse { animation: wa-pulse 2s ease-in-out infinite; }
```

#### Kampanya Shimmer
```css
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.shimmer-badge {
  background: linear-gradient(90deg, #f59e0b 30%, #fde68a 50%, #f59e0b 70%);
  background-size: 200% auto;
  animation: shimmer 2.5s linear infinite;
}
```

#### Kategori Sekme Geçişi
```typescript
// AnimatePresence ile ürün listesi değişimi
<AnimatePresence mode="wait">
  <motion.div
    key={activeCategory}
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.25 }}
  >
```

#### Sayfa Geçişi (Next.js)
```typescript
// layout.tsx içinde
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

#### Skeleton Loader
```typescript
// Veri yüklenirken gösterilir — asla boş ekran kalmamalı
const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl overflow-hidden">
    <div className="bg-gray-300 aspect-square w-full" />
    <div className="p-4 space-y-2">
      <div className="bg-gray-300 h-4 w-3/4 rounded" />
      <div className="bg-gray-300 h-3 w-full rounded" />
      <div className="bg-gray-300 h-3 w-2/3 rounded" />
    </div>
  </div>
);
```

### 3.2 Performans Kuralları
- `will-change: transform` sadece animasyon süresince ekle, sonra kaldır
- `transform3d` yerine `transform` kullan (GPU zorunlu değil)
- `viewport={{ once: true }}` — scroll reveal animasyonları bir kez çalışır
- 60fps hedefi: `opacity` ve `transform` dışındaki özellikler animate edilmez

---

## 4. BÖLÜM BÖLÜM UI KALIBİ

### 4.1 Sticky Header

**Yapı:**
```
[LOGO + İŞLETME ADI]  [NAV]  [WHATSAPP BUTONU]
```

**Kurallar:**
- Başlangıç: Saydam arka plan, tam boyut
- Scroll sonrası: `backdrop-blur-md bg-white/80` geçişi (300ms ease)
- Header yüksekliği: scroll öncesi `80px`, sonrası `56px` (smooth transition)
- WhatsApp butonu: `wa-pulse` animasyonu, yeşil (#25D366), beyaz ikon
- Mobilde: Hamburger menü, `<motion.div>` ile bottom-sheet açılışı (y: 100% → 0)
- Nav linkleri hover'da `text-[var(--color-primary)]` + alt çizgi scale animasyonu

**Erişilebilirlik:**
- `role="navigation"` ve `aria-label="Ana menü"`
- Mobil menüde focus trap uygulanır
- Skip-to-content linki (screen reader için)

### 4.2 Hero / Banner Bölümü

**Layout:**
```
[Gradyan arkaplan + parallax banner görseli]
  [Sağ üst dekoratif şekil — animasyonlu]
  [Büyük slogan metni — fade-up]
  [Çalışma saati göstergesi — canlı]
  [2 CTA butonu]
[Sol alt dekoratif şekil]
```

**Çalışma Saati Göstergesi:**
```typescript
// Sunucudan gelen business_hours verisi ile client-side hesaplama
const isOpen = checkBusinessHours(businessHours, new Date());

<div className={`flex items-center gap-2 text-sm font-medium ${
  isOpen ? 'text-green-400' : 'text-red-400'
}`}>
  <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
  {isOpen ? `Şu an AÇIK • ${closeTime}'e kadar` : `Şu an KAPALI • ${openTime}'de açılır`}
</div>
```

**Dekoratif Şekiller:**
- SVG blob/circle elementleri, `animate-float` ile yavaş yukarı-aşağı hareketi
- İşletmenin `--color-primary` rengiyle `opacity-20` tonda
- Asla performansı etkilemeyecek kadar basit SVG

**CTA Butonları:**
- "Ürünleri Gör": Dolu, primary renk, okla birlikte
- "WhatsApp'tan Yaz": Outline veya yeşil, WhatsApp ikonu ile

### 4.3 Kampanya Carousel

**Şartlı Render:** Kampanyalı ürün yoksa bu bölüm DOM'dan tamamen kaldırılır (`null` return).

**Carousel Kuralları:**
- Kütüphane önerisi: `embla-carousel-react` (Swiper alternatif, hafif)
- Otomatik geçiş: 4 saniye, kullanıcı etkileşiminde durur
- Mobil: Swipe desteği zorunlu
- Desktop: Ok butonları görünür
- Her kartta: Shimmer "KAMPANYA" rozeti köşede (absolute, top-left)
- Kartlar ürün kataloğu kartıyla aynı bileşeni kullanır, `isCampaignView` prop'u ile

### 4.4 Ürün Kataloğu

**Kategori Sekme Çubuğu:**
```typescript
// Yatay scroll, tüm kategorileri ve "Tümü" seçeneğini içerir
// Aktif sekme: primary renk arka plan, beyaz metin
// Pasif sekme: şeffaf, muted metin
// Geçiş: Framer Motion layout animation ile underline kayması

<motion.div
  layoutId="active-tab-indicator"
  className="absolute inset-0 bg-[var(--color-primary)] rounded-full"
/>
```

**Grid Yapısı:**
```
📱 Mobil (< 640px):  grid-cols-2, gap-3
📱 Tablet (640-1024): grid-cols-3, gap-4
🖥️ Desktop (> 1024): grid-cols-4, gap-5
```

**Ürün Kartı Anatomisi:**
```
┌─────────────────────────────┐
│  [ANA GÖRSEL - aspect:1/1]  │  ← object-fit: cover
│  [KAMPANYA rozeti - sol üst] │  ← absolute, shimmer
│  [YENİ rozeti - sol üst]     │  ← absolute, sadece son 7 gün
│  [TÜKENDİ overlay - tam]     │  ← kırmızı yarı saydam, varsa
├─────────────────────────────┤
│  [Ürün Adı - 2 satır max]    │
│  [Kısa açıklama - 2 satır]   │  ← line-clamp-2
│  [Detay Butonu]              │
└─────────────────────────────┘
```

**"Tükendi" Overlay:**
```typescript
{!product.in_stock && (
  <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center rounded-t-xl">
    <span className="text-white font-bold text-lg tracking-wider">TÜKENDİ</span>
  </div>
)}
```

**"YENİ" Etiketi:**
```typescript
const isNew = differenceInDays(new Date(), new Date(product.created_at)) <= 7;
```

### 4.5 Ürün Detay Sayfası

**Layout (Desktop):**
```
[Sol %55: Lightbox Galeri] | [Sağ %45: Ürün Bilgisi]
```

**Layout (Mobil):**
```
[Galeri - tam genişlik]
[Ürün Bilgisi]
```

**Lightbox Galeri Kuralları:**
- Ana görsel: `aspect-[4/3]` veya `aspect-square`, `object-contain`
- Thumbnail'lar: Yatay scroll, tıklanınca ana görsel değişir (cross-fade animasyonu)
- Desktop: Önceki/Sonraki ok butonları
- Mobil: Swipe hareketi (sol/sağ)
- Büyütme: Tıklanınca full-screen lightbox açılır (Framer Motion ile)
- Görsel yoksa: Gri placeholder ile "Görsel Eklenmemiş" yazısı

**Özellik Tablosu:**
```typescript
// Sadece dolu olan özellikler gösterilir
// Boş opsiyonel özellikler DOM'dan kaldırılır
<table className="w-full text-sm">
  <tbody>
    {filledAttributes.map((attr) => (
      <tr key={attr.id} className="border-b border-gray-100">
        <td className="py-2 pr-4 font-medium text-gray-500 w-2/5">{attr.name}</td>
        <td className="py-2 text-gray-900 font-medium">
          {formatAttributeValue(attr)}
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

**WhatsApp CTA:**
```typescript
const waMessage = encodeURIComponent(
  `Merhaba! ${business.name} — ${product.name} hakkında bilgi almak istiyorum.`
);
const waUrl = `https://wa.me/${business.whatsapp}?text=${waMessage}`;

// Büyük, full-width buton, mobilde sticky bottom
<a
  href={waUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="wa-pulse flex items-center justify-center gap-3 w-full py-4 
             bg-[#25D366] text-white font-bold text-lg rounded-2xl"
>
  <WhatsAppIcon className="w-6 h-6" />
  WhatsApp'tan Sor
</a>
```

**Mobil Sticky WA Butonu:**
```typescript
// Mobilde sayfa altına yapışık kalır
<div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm
               border-t border-gray-100 sm:hidden z-50">
  <WhatsAppButton product={product} business={business} />
</div>
```

### 4.6 Blog Sayfaları

**Liste Sayfası — Kart:**
```
[Kapak Görseli - aspect:video]
[Başlık - 2 satır max]
[Özet - 3 satır, muted renk]
[Tarih + Okumaya devam et linki]
```

**Blog Yazısı Sayfası:**
- Max genişlik: `prose max-w-3xl mx-auto`
- `@tailwindcss/typography` plugin kullanılır
- Kapak görseli: Tam genişlik, `aspect-[21/9]`, üstünde başlık overlay'i

### 4.7 Footer

**Layout:**
```
[Logo + Ad]  [WA Linki]  [Sosyal Medyalar]
[Çalışma Saatleri]
[— Dijital Vitrin ile güçlendirilmiştir —]  (en alt, küçük, muted)
```

**Sosyal Medya İkonları:**
- Sadece girilmiş (boş olmayan) sosyal medya linklerinin ikonu gösterilir
- Hover: `opacity-70` → `opacity-100` + `scale-110`

---

## 5. FORM VE VALİDASYON UX'İ (Vitrin için küçük formlar)

### 5.1 Genel Kural
Vitrin sitesinde form yoktur (ödeme/iletişim formu bulunmaz). Tüm iletişim WhatsApp ile.

---

## 6. SEO — NEXT.JS METADATA

### 6.1 Her Sayfa İçin Zorunlu
```typescript
// app/[slug]/urun/[productSlug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug, params.productSlug);
  return {
    title: `${product.name} | ${business.name}`,
    description: product.short_desc || product.long_desc?.slice(0, 160),
    openGraph: {
      title: `${product.name} | ${business.name}`,
      images: [product.images[0]?.url],
      type: 'website',
      url: `https://${business.slug}.dijitalvitrin.com/urun/${product.slug}`,
    },
    alternates: {
      canonical: `https://${business.slug}.dijitalvitrin.com/urun/${product.slug}`,
    },
  };
}
```

### 6.2 JSON-LD Script
```typescript
// Her ürün sayfasına eklenir — <head> içinde
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
/>
```

---

## 7. ERİŞİLEBİLİRLİK (a11y) — ZORUNLU

- Tüm interaktif elementlerde `focus-visible` ring stili
- Görsellerde anlamlı `alt` metni — ürün adı + işletme adı kombinasyonu
- Renk kontrastı: WCAG AA minimum (4.5:1)
- Butonlarda `aria-label` — ikonlu butonlarda özellikle
- Animasyonlar: `prefers-reduced-motion` media query'e saygı
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. PERFORMANS KURALLARI

- Görseller: `<Image>` (Next.js) kullanılır — asla `<img>` değil
- Lazy loading: Viewport dışı görseller `loading="lazy"`
- Cloudinary URL dönüşümü: `?w=400&q=80&f=webp` gibi parametreler eklenir
- `font-display: swap` — web fontları için
- Kritik CSS inline edilir
- `dynamic()` ile büyük bileşenler lazy import edilir

---

## 9. SUBDOMAIN YÖNLENDİRME (Next.js Middleware)

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host');
  const slug = hostname?.split('.dijitalvitrin.com')[0];
  
  // app veya admin subdomain'leri vitrin değil
  if (slug === 'app' || slug === 'admin') return NextResponse.next();
  
  // Slug'ı request header'a ekle
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-business-slug', slug || '');
  
  return NextResponse.next({ request: { headers: requestHeaders } });
}
```

---

## 10. COOKIE CONSENT & KVKK BANNER

Platform KVKK uyumu için minimal bir çerez bilgilendirme banner'ı göstermelidir:

```typescript
// components/CookieConsent.tsx
// LocalStorage'da "cookie-consent-accepted" key'i ile kontrol edilir
// İlk ziyarette sayfanın alt kısmında yukarı kayar
// "Kabul Et" ve "Daha Fazla Bilgi" (gizlilik politikası linki) butonları
```

---

## 11. PASSİF İŞLETME SAYFASI

Subdomain aktif değilse gösterilecek özel sayfa:

```
[Dijital Vitrin logosu]
[Bu vitrin şu an aktif değil]
[İletişim için dijitalvitrin.com]
```

Tasarım: Minimal, marka renkleri, hata sayfası değil bilgilendirme sayfası.

---

## KONTROL LİSTESİ — KOD YAZILMADAN ÖNCE

- [ ] CSS değişkenleri tema sistemi kuruldu mu?
- [ ] Framer Motion `AnimatePresence` ve `motion` import edildi mi?
- [ ] Her scroll bölümüne `whileInView` eklendi mi?
- [ ] WhatsApp butonu `wa-pulse` animasyonu var mı?
- [ ] Kampanya shimmer CSS'i var mı?
- [ ] Mobile-first grid kullanıldı mı?
- [ ] Skeleton loader hazır mı?
- [ ] `prefers-reduced-motion` eklendi mi?
- [ ] `alt` metinleri anlamlı mı?
- [ ] JSON-LD eklendi mi?
