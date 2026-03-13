# SKILL: Backend API (Express.js + Prisma)

> Bu dosya, Dijital Vitrin projesinin Express.js API katmanını geliştirirken uyulması
> gereken kuralları, kalıpları ve güvenlik gereksinimlerini kapsar.

---

## 1. PROJENİN TEKNOLOJİ YIĞINI

- **Runtime:** Node.js 20+ LTS
- **Framework:** Express.js 4+
- **Dil:** TypeScript (strict mode)
- **ORM:** Prisma 5+
- **Veritabanı:** PostgreSQL 16+
- **Kimlik Doğrulama:** JWT (jsonwebtoken) + bcrypt (salt: 12)
- **2FA:** otplib (TOTP — Google Authenticator uyumlu)
- **Görsel Depolama:** Cloudinary SDK
- **Önbellek:** Redis (Faz 2 sonrası — şimdilik opsiyonel)
- **Güvenlik:** helmet, cors, express-rate-limit, hpp

---

## 2. PROJE KLASÖR YAPISI (packages/api)

```
packages/api/src/
├── index.ts                  # Express app başlatma
├── config/
│   ├── env.ts                # Zod ile env validation
│   ├── database.ts           # Prisma client singleton
│   └── cloudinary.ts         # Cloudinary config
├── middleware/
│   ├── auth.ts               # JWT doğrulama middleware
│   ├── rateLimiter.ts        # Rate limit ayarları
│   ├── errorHandler.ts       # Global hata yakalama
│   ├── validate.ts           # Zod request validation
│   └── security.ts           # Helmet, CORS, HPP
├── routes/
│   ├── auth.routes.ts
│   ├── admin.routes.ts       # Süper admin
│   ├── business.routes.ts    # İşletme admin
│   ├── storefront.routes.ts  # Herkese açık
│   └── analytics.routes.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── businesses.controller.ts
│   ├── categories.controller.ts
│   ├── products.controller.ts
│   ├── blog.controller.ts
│   ├── storefront.controller.ts
│   └── analytics.controller.ts
├── services/
│   ├── auth.service.ts
│   ├── business.service.ts
│   ├── product.service.ts
│   ├── image.service.ts      # Cloudinary upload/delete
│   ├── analytics.service.ts
│   └── slug.service.ts       # Türkçe slug üretimi
├── validators/               # Zod şemaları
│   ├── auth.validator.ts
│   ├── business.validator.ts
│   ├── product.validator.ts
│   ├── category.validator.ts
│   └── blog.validator.ts
└── utils/
    ├── jwt.ts
    ├── password.ts
    ├── slugify.ts            # Türkçe karakter dönüşümü
    ├── botFilter.ts
    └── ipHash.ts             # SHA256 hash (KVKK)
```

---

## 3. ZORUNLU GÜVENLİK KATMANLARI

### 3.1 Middleware Sırası (index.ts)
```typescript
app.use(helmet());                    // 1. Güvenlik header'ları
app.use(cors(corsOptions));           // 2. CORS
app.use(hpp());                       // 3. HTTP Parameter Pollution
app.use(express.json({ limit: '1mb' })); // 4. Body parser (limit!)
app.use(globalRateLimiter);           // 5. Global rate limit
```

### 3.2 Rate Limit Ayarları
```typescript
// Global: tüm endpoint'ler
const globalRateLimiter = rateLimit({
  windowMs: 1000,  // 1 saniye
  max: 30,
  message: { error: "Çok fazla istek gönderildi. Lütfen bekleyin." },
});

// Admin endpoint'leri için
const adminRateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 dakika
  max: 60,
});

// Login için özel (brute-force önlemi)
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 dakika
  max: 10,
  skipSuccessfulRequests: true,
});
```

### 3.3 JWT Middleware
```typescript
// middleware/auth.ts
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Kimlik doğrulama gerekli" });
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Geçersiz veya süresi dolmuş token" });
  }
};

export const requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== 'super_admin') 
    return res.status(403).json({ error: "Bu işlem için yetkiniz yok" });
  next();
};

export const requireBusinessAdmin = (req, res, next) => {
  if (!['super_admin', 'business_admin'].includes(req.user?.role))
    return res.status(403).json({ error: "Bu işlem için yetkiniz yok" });
  next();
};
```

### 3.4 Business İzolasyonu (ÇOK KRİTİK)
```typescript
// İşletme admin her sorguda kendi business_id'sini kullanmalı
// Asla client'tan gelen business_id'ye güvenme

// YANLIŞ:
const products = await prisma.product.findMany({
  where: { business_id: req.body.business_id } // ❌
});

// DOĞRU:
const products = await prisma.product.findMany({
  where: { business_id: req.user.business_id } // ✅ Token'dan alınır
});
```

---

## 4. TÜRKÇE SLUG ÜRETİMİ

```typescript
// utils/slugify.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ı/g, 'i')
    .replace(/İ/g, 'i').replace(/Ü/g, 'u').replace(/Ö/g, 'o')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Benzersizlik kontrolü (işletme içinde)
export async function uniqueSlug(
  baseSlug: string,
  businessId: string,
  excludeId?: string
): Promise<string> {
  let slug = slugify(baseSlug);
  let counter = 0;
  
  while (true) {
    const candidate = counter === 0 ? slug : `${slug}-${counter}`;
    const existing = await prisma.product.findFirst({
      where: { business_id: businessId, slug: candidate, id: { not: excludeId } }
    });
    if (!existing) return candidate;
    counter++;
  }
}
```

---

## 5. GÖRSEL YÜKLEME (CLOUDINARY)

```typescript
// services/image.service.ts
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Multer: memory storage (disk değil)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Yalnızca JPG, PNG ve WebP formatları kabul edilir"));
  },
});

export async function uploadImage(
  buffer: Buffer,
  folder: string,
  publicId?: string
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result!.secure_url, publicId: result!.public_id });
      }
    ).end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
```

---

## 6. İSTATİSTİK VE BOT FİLTRESİ

```typescript
// utils/botFilter.ts — Bilinen crawler'lar
const BOT_PATTERNS = [
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i,
  /baiduspider/i, /yandexbot/i, /facebot/i, /ia_archiver/i,
  /linkedinbot/i, /twitterbot/i, /whatsapp/i,
];

export function isBot(userAgent: string): boolean {
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

// utils/ipHash.ts — KVKK uyumu
import crypto from 'crypto';

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT;
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
}

// analytics.controller.ts — Event kayıt
export const recordEvent = async (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const ip = req.ip || req.connection.remoteAddress;
  
  if (isBot(userAgent)) {
    // Bot trafiğini kaydet ama is_bot=true ile işaretle
    // Dashboard'da bot trafiği filtrelenir
  }
  
  const ipHash = hashIp(ip);
  const isMobile = /mobile|android|iphone/i.test(userAgent);
  
  // Spam önleme: Aynı IP hash + event_type + product_id 1 dakikada bir kez sayılır
  const recentEvent = await prisma.analyticsEvent.findFirst({
    where: {
      ip_hash: ipHash,
      event_type: req.body.event_type,
      product_id: req.body.product_id,
      created_at: { gte: new Date(Date.now() - 60_000) }
    }
  });
  
  if (!recentEvent) {
    await prisma.analyticsEvent.create({ data: { /* ... */ } });
  }
};
```

---

## 7. HATA YÖNETİMİ

```typescript
// middleware/errorHandler.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
  }
}

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }
  
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Doğrulama hatası",
      details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
    });
  }
  
  // Prisma unique constraint
  if (err.code === 'P2002') {
    return res.status(409).json({ error: "Bu değer zaten kullanılıyor" });
  }
  
  console.error(err);
  res.status(500).json({ error: "Sunucu hatası. Lütfen tekrar deneyin." });
};
```

---

## 8. STANDART API RESPONSE FORMAT

```typescript
// Başarılı tekil kaynak
{ data: { id, name, ... } }

// Başarılı liste
{ data: [...], total: 42, page: 1, limit: 20 }

// Hata
{ error: "Hata mesajı", code: "BUSINESS_NOT_FOUND" }

// Validasyon hatası
{ error: "Doğrulama hatası", details: [{ field: "name", message: "..." }] }
```

---

## 9. ZAMANLANMIŞ GÖREVLER (Cron Jobs)

```typescript
// jobs/dailySummary.ts — Her gece 02:00'de çalışır
// analytics_events tablosundan analytics_daily tablosuna özetler
// Eski ham event'ları temizler (30 gün'den eski)

// jobs/subscriptionCheck.ts — Her sabah 09:00'da çalışır
// auto_deactivate=true olan süresi dolmuş işletmeleri pasife alır
```

---

## 10. ENV ZORUNLU DEĞİŞKENLER

```env
DATABASE_URL=postgresql://...
JWT_SECRET=min_32_karakter_random_string
JWT_REFRESH_SECRET=farklı_min_32_karakter
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
IP_HASH_SALT=min_16_karakter_random
NODE_ENV=production
```
