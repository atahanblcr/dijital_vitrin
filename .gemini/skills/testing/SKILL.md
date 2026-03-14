# 🧪 DİJİTAL VİTRİN — TEST YAZMA VE ÇALIŞTIRMA KURALLARI (ZORUNLU)

> ⚠️ **SİSTEM KURALI (CRITICAL):** Bu proje bir npm workspaces (monorepo) mimarisidir. Yapay zeka, test yazarken veya test hatalarını çözerken aşağıdaki kuralların dışına KESİNLİKLE ÇIKAMAZ. Aksi halde sonsuz döngüye girilir.

## 1. Konfigürasyon Dosyalarına Dokunmak YASAK
- `vitest.config.ts` veya `tsconfig.json` dosyalarına ASLA yeni `alias` (yönlendirme) ekleme. 
- Eğer bir modül bulunamıyorsa, sorun alias eksikliği değil, workspace linklerinin güncellenmemesidir. Konfig dosyalarını hacklemeye çalışma.

## 2. Bağımlılık (Dependency) Kuralları
- Test kütüphaneleri (`vitest`, `supertest`, vb.) YALNIZCA ana dizindeki (root) `package.json` dosyasında bulunur.
- ASLA `apps/*` veya `packages/*` altındaki klasörlere `npm install vitest` vb. test aracı kurma. Alt paketlerde bu paketler bulunmamalıdır.

## 3. Import Kuralları
- Monorepo içindeki diğer paketleri çağırırken ASLA relative path (göreceli yol, örn: `../../database/src`) kullanma.
- DAİMA workspace ismini kullan: `import { prisma } from '@dijital-vitrin/database';`

## 4. Veritabanı (Prisma) Kuralları
- Testlerde yeni bir `PrismaClient` instance'ı oluşturma.
- Daima `@dijital-vitrin/database` paketinin dışa aktardığı (export ettiği) hazır `prisma` instance'ını kullan.
- Test dosyalarının sonunda veritabanı bağlantısını kapatmak için doğrudan `setup.ts` dosyasına güven veya ilgili testin `afterAll` bloğunda `await prisma.$disconnect();` kullan.

## 5. Hata Çözme Prosedürü
Eğer bir test çalıştırıldığında "Cannot find module '@dijital-vitrin/...'" hatası alırsan:
1. Konfigürasyon değiştirmeye ÇALIŞMA.
2. Sadece terminalde ana dizine (root) git ve `npm install` komutunu çalıştırarak symlinkleri tazele.
3. Testi tekrar çalıştır.