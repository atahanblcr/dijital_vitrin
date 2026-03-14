# 🖥️ DİJİTAL VİTRİN — Proje Gereksinim & Teknik Tasarım Dokümanı

> **Versiyon:** 3.0 | **Durum:** Aktif Geliştirme Öncesi | **Gizlilik:** Kişisel / Gizli

---

## İçindekiler

1. [Proje Özeti](#1-proje-özeti)
2. [Kullanıcı Rolleri ve Yetkiler](#2-kullanıcı-rolleri-ve-yetkiler)
3. [Kategori ve Özellik Sistemi](#3-kategori-ve-özellik-sistemi)
4. [Ürün Yönetimi](#4-ürün-yönetimi)
5. [İşletme Vitrin Sitesi — Tasarım ve UX](#5-i̇şletme-vitrin-sitesi--tasarım-ve-ux)
6. [Blog ve Duyuru Sistemi](#6-blog-ve-duyuru-sistemi)
7. [İstatistik ve Analitik Sistemi](#7-i̇statistik-ve-analitik-sistemi)
8. [SEO Mimarisi](#8-seo-mimarisi)
9. [Süper Admin Paneli](#9-süper-admin-paneli)
10. [İşletme Admin Paneli](#10-i̇şletme-admin-paneli)
11. [WhatsApp Entegrasyonu](#11-whatsapp-entegrasyonu)
12. [Güvenlik Mimarisi](#12-güvenlik-mimarisi)
13. [Teknik Mimari ve Teknoloji Yığını](#13-teknik-mimari-ve-teknoloji-yığını)
14. [Veritabanı Şeması](#14-veritabanı-şeması)
15. [API Endpoint Listesi](#15-api-endpoint-listesi)
16. [Abonelik Modeli](#16-abonelik-modeli)
17. [Geliştirme Yol Haritası](#17-geliştirme-yol-haritası)
18. [Açık Kalan Kararlar](#18-açık-kalan-kararlar)
19. [Açık Kalan Kararların Cevapları ve eksik kalanlar] (#19-açık-kalan-kararların-cevapları-ve-eksik-kalanlar)

---

## 1. Proje Özeti

**Dijital Vitrin**; küçük ve orta ölçekli işletmelerin teknik bilgiye ihtiyaç duymadan ürünlerini fiyat belirtmeksizin internet üzerinde sergileyebildiği, müşteri iletişimini WhatsApp üzerinden yönettiği, modern ve animasyonlu bir SaaS platformudur.

Her işletme kendi subdomain adresinde (`isletme.dijitalvitrin.com`) bağımsız, özelleştirilmiş bir vitrin sitesine sahip olur.

### 1.1 Temel Özellikler

| Başlık | Değer |
|---|---|
| Platform Türü | Web Tabanlı SaaS — Türkçe |
| Adres Yapısı | `isletme.dijitalvitrin.com` (Wildcard Subdomain) |
| Hedef Kitle | KOBİ — Elektronik, Butik, Aksesuar, El İşi, Oto Galeri |
| İşletme Kapasitesi | 10–50 İşletme (Orta Ölçek, genişletilebilir) |
| Ödeme Modeli | Aylık / Yıllık — Elden veya Havale |
| Site İçi Ödeme | **YOKTUR** — hiçbir ödeme altyapısı bulunmaz |
| İletişim Kanalı | Yalnızca WhatsApp (`wa.me` — API ücreti yok) |
| Dil | Yalnızca Türkçe |
| Fiyat Gösterimi | **YOKTUR** — hiçbir ürün kartında fiyat alanı bulunmaz |

### 1.2 Temel İlkeler

- Platform üzerinden hiçbir ödeme gerçekleşmez
- Fiyat bilgisi hiçbir yerde gösterilmez
- Müşteri iletişimi yalnızca WhatsApp üzerinden sağlanır
- İşletme admini yalnızca içerik yönetimi yapar; site ayarlarına müdahale edemez
- Süper admin tüm platformu merkezi olarak yönetir ve işletme admininin yapabildiği her şeyi onun adına yapabilir

### 1.3 Hedef Sektörler ve Kategori Şablonları

| Sektör | Örnek Kategoriler |
|---|---|
| ⚡ Elektronik | Telefon & Aksesuar, Bilgisayar, Ses & Görüntü, Küçük Ev Aletleri, Yedek Parça |
| 👗 Butik | Kadın Giyim, Erkek Giyim, Çocuk Giyim, Dış Giyim, İç Giyim |
| 💎 Aksesuar | Takı & Mücevher, Çanta & Cüzdan, Saat, Şapka & Bere, Gözlük |
| 🧶 El İşi | El Örgüsü, Ahşap El Sanatları, Seramik & Çini, Tekstil & Nakış, Tasarım Ürünler |
| 🚗 Oto Galeri | Binek Araç, SUV & Crossover, Ticari Araç, Motosiklet, Yedek Parça |

> Kategori şablonları süper admin tarafından işletmeye atanır; işletme daha sonra kendi kategorilerini ekleyip düzenleyebilir.

---

## 2. Kullanıcı Rolleri ve Yetkiler

Platformda 3 seviyeli kullanıcı yapısı bulunur: **Süper Admin**, **İşletme Admin** ve **Ziyaretçi**.

> ⚠️ **Temel Kural:** Süper admin, işletme admininin yapabildiği her şeyi yapar ve her şeyi görür. İşletme admini yalnızca kendi işletmesine ait verilere erişir.

### 2.1 Tam Yetki Tablosu

| Özellik / İşlem | Süper Admin | İşletme Admin | Ziyaretçi | Not |
|---|:---:|:---:|:---:|---|
| İşletme Ekleme/Silme | ✅ | ❌ | ❌ | |
| Tema/Renk Belirleme | ✅ | ❌ | ❌ | |
| Logo & Banner Yükleme | ✅ | ❌ | ❌ | |
| Subdomain Belirleme | ✅ | ❌ | ❌ | Manuel, slug formatında |
| WhatsApp Numarası | ✅ | ❌ | ❌ | |
| Çalışma Saatleri | ✅ | ❌ | ❌ | |
| Header Sloganı | ✅ | ❌ | ❌ | |
| Hakkımızda Metni | ✅ | ❌ | ❌ | |
| Sosyal Medya Linkleri | ✅ | ❌ | ❌ | |
| Google Maps Konumu | ✅ | ❌ | ❌ | |
| SEO Meta Bilgileri | ✅ | ❌ | ❌ | Otomatik + manuel override |
| Kullanıcı Adı Değiştirme | ✅ | ❌ | ❌ | Sadece süper admin |
| Şifre Belirleme/Sıfırlama | ✅ | ❌ | ❌ | Bildirim gitmez |
| İşletme Paneline Yedek Giriş | ✅ | ❌ | ❌ | Loglanır |
| Abonelik Yönetimi | ✅ | ❌ | ❌ | |
| Max Fotoğraf Sayısı (işletme bazlı) | ✅ | ❌ | ❌ | Varsayılan: 7 |
| Kategori Ekleme/Düzenleme/Silme | ✅ | ✅ | ❌ | Her ikisi de |
| Kategori Özelliği Ekleme/Düzenleme | ✅ | ✅ | ❌ | Her ikisi de |
| Özellik Zorunluluğu Ayarlama | ✅ | ✅ | ❌ | Her ikisi de |
| Ürün Ekleme/Düzenleme/Silme | ✅ | ✅ | ❌ | |
| Ürün Aktif/Pasif Yapma | ✅ | ✅ | ❌ | Pasif ürün vitinde gözükmez |
| Stok Durumu Güncelleme | ✅ | ✅ | ❌ | |
| Kampanya Etiketi | ✅ | ✅ | ❌ | |
| Ürün Sıralaması Ayarlama | ✅ | ✅ | ❌ | Manuel veya varsayılan (random) |
| Blog Yazısı Ekleme/Düzenleme | ✅ | ✅ | ❌ | |
| Kendi İstatistiklerini Görme | ✅ | ✅ | ❌ | İşletme yalnızca kendini |
| Tüm Platform İstatistikleri | ✅ | ❌ | ❌ | |
| Vitrin Sitesini Görüntüleme | ✅ | ✅ | ✅ | Herkese açık |
| Ürün Filtreleme | ✅ | ✅ | ✅ | Herkese açık |
| WhatsApp Butonuna Tıklama | ✅ | ✅ | ✅ | Herkese açık |

---

## 3. Kategori ve Özellik Sistemi

Bu sistem, platformun en kritik ve en esnek parçasıdır. Her işletme kendi ürün yapısına özel kategoriler ve bu kategorilere bağlı özellikler tanımlayabilir.

### 3.1 Kategori Yapısı

- Her işletmenin kendi kategori listesi vardır; başka işletmelerin kategorileriyle bağlantısı yoktur
- Süper admin işletmeye sektör şablonu atarken başlangıç kategorilerini de atar
- İşletme admin ve süper admin sonradan kategori ekleyebilir, düzenleyebilir, silebilir
- Bir ürün **yalnızca bir kategoriye** atanabilir
- Kategori seçimi ürün eklerken **zorunludur**
- Kategori silinmek istendiğinde içinde ürün varsa uyarı verilir; ürünler başka kategoriye taşınmadan kategori silinemez

### 3.2 Kategori Özellik Tipleri

Her kategoriye özel alanlar (özellikler) tanımlanabilir. 3 tip özellik desteklenir:

#### Tip 1: Metin (`text`)
- Serbest yazı girişi
- Örnek: "Marka", "Menşei", "Malzeme", "Model"
- Karakter sınırı belirlenebilir (opsiyonel)

#### Tip 2: Sayı (`number`)
- Yalnızca sayısal değer
- Birim eklenebilir (opsiyonel): "kg", "cm", "yıl", "adet" vs.
- Örnek: "Ağırlık (kg)", "Garanti Süresi (yıl)", "Ekran Boyutu (inç)"

#### Tip 3: Çoktan Seçmeli (`select`)
- Önceden tanımlanmış seçenekler listesi
- Tekli seçim (bir değer seçilir)
- Seçenekler özellik oluştururken veya düzenlerken eklenir/çıkarılır
- Örnek: "Renk" → [Kırmızı, Mavi, Beyaz, Siyah], "Durum" → [Sıfır, İkinci El]

### 3.3 Özellik Zorunluluğu

- Her özellik için **zorunlu** veya **opsiyonel** ayarı yapılabilir
- Bu ayarı hem işletme admin hem süper admin değiştirebilir
- Zorunlu özellik doldurulmadan ürün kaydedilemez; anlık hata mesajı gösterilir
- Opsiyonel özellik boş bırakılırsa vitrin sitesinde o satır gösterilmez

### 3.4 Özellik Yönetimi Kuralları

- Özellik eklenebilir, düzenlenebilir, silinebilir
- **Özellik silinirse:** O özelliğe ait tüm ürün verisi de silinir. Silmeden önce uyarı gösterilir: *"Bu özelliği silersen X üründeki bu alan kalıcı olarak silinecek."*
- **Özellik tipi değiştirilirse:** Mevcut veriler uyumsuz hale gelebilir. Uyarı gösterilir.
- **Çoktan seçmeli seçenek silinirse:** O seçeneği kullanan ürünler "değer atanmamış" durumuna düşer, uyarı verilir

### 3.5 Vitrin Sitesinde Görünüm

Ürün detay sayfasında özellikler tablo olarak gösterilir:

```
┌─────────────────┬──────────────────┐
│ Marka           │ Samsung          │
│ Model           │ Galaxy A54       │
│ Depolama        │ 128 GB           │
│ Renk            │ Siyah            │
│ Garanti Süresi  │ 2 Yıl            │
└─────────────────┴──────────────────┘
```

- Değeri girilmemiş opsiyonel özellikler tabloda gösterilmez
- Tablo mobilde tam genişlik, okunabilir font

---

## 4. Ürün Yönetimi

### 4.1 Ürün Alanları

| Alan | Zorunlu | Açıklama |
|---|:---:|---|
| Ürün Adı | ✅ | Max 100 karakter |
| Kategori | ✅ | Tek kategori seçimi |
| Kategori Özellikleri | ⚠️ | Zorunlu olarak işaretlenenler zorunlu |
| Kısa Açıklama | ❌ | Ürün kartında görünür, max 150 karakter |
| Uzun Açıklama | ❌ | Detay sayfasında görünür, sınır yok |
| Görseller | ❌ | Min 1 önerilir, max işletme bazlı (varsayılan 7) |
| Kampanya Etiketi | ❌ | Açıksa kampanya carousel'ına eklenir |
| Stok Durumu | ✅ | Mevcut / Tükendi |
| Aktif/Pasif Durumu | ✅ | Pasif ürün vitrin sitesinde gözükmez |

### 4.2 Görsel Yönetimi

- Çoklu görsel yükleme: sürükle-bırak veya dosya seç
- İlk yüklenen görsel otomatik olarak **ana görsel** olur
- Ana görsel sonradan değiştirilebilir (görsellerin sırası sürükle-bırak ile)
- Görsel başına max **5MB**, desteklenen formatlar: JPG, PNG, WebP
- Görseller **olduğu gibi** saklanır, otomatik kırpma yapılmaz
- Cloudinary CDN üzerinden servis edilir — mobil uyumlu otomatik boyutlandırma
- Maksimum görsel sayısı: **işletme bazlı**, süper admin tarafından belirlenir (varsayılan: 7)
- Süper admin istediği işletme için bu limiti artırabilir veya azaltabilir

### 4.3 Ürün Durumları

| Durum | Vitrin Görünümü | Açıklama |
|---|---|---|
| Aktif + Mevcut | Normal gösterilir | Standart ürün |
| Aktif + Tükendi | Gösterilir, "Tükendi" overlay'i var | Stok bilgisi var ama görünür |
| Pasif | **Gösterilmez** | Geçici olarak gizlenmiş |

### 4.4 Ürün Sıralaması

- **Varsayılan:** Gerçek random — sayfa her yüklendiğinde sıralama değişir
- **Manuel:** İşletme admin sürükle-bırak ile sıralamayı belirler; kaydedilen bu sıra sabittir
- Sıralama modu "Varsayılan (Random)" veya "Manuel" olarak admin panelinde seçilir
- Kampanyalı ürünler normal katalogda da görünür (carousel'a ek olarak)

### 4.5 Hata Mesajları ve Validasyon

**Anlık Kontrol (yazarken):**
- Karakter sınırı aşıldığında alanın altında kalan karakter sayısı gösterilir, limit aşılınca kırmızı
- Zorunlu alan boşken başka alana geçilince o alan kırmızı çerçeve + uyarı mesajı alır
- Sayı tipli özelliklere harf girilmeye çalışılınca engellenir

**Kaydet/Gönder Anında:**
- Tüm zorunlu alanlar kontrol edilir
- Hatalı alanlar kırmızı çerçeve + açıklayıcı mesaj ile işaretlenir
- Form sayfanın üstüne kaydırılır, hata özeti gösterilir: *"3 alanda eksik/hatalı bilgi var"*
- Başarılı kayıtta yeşil toast bildirimi gösterilir

**Örnek Hata Mesajları:**
- `"Ürün adı zorunludur."`
- `"Ürün adı en fazla 100 karakter olabilir. (Şu an: 112)"`
- `"Kategori seçimi zorunludur."`
- `"'Garanti Süresi' alanı bu kategori için zorunludur."`
- `"Görsel boyutu 5MB'ı geçemez. (Yüklenen: 7.2MB)"`
- `"Bu ürün adı zaten mevcut. Farklı bir ad deneyin."`

---

## 5. İşletme Vitrin Sitesi — Tasarım ve UX

### 5.1 Tasarım Felsefesi

Vitrin sitesi, jenerik yapay zeka estetiğinden tamamen uzak, **canlı ve enerjik** bir karaktere sahip olacak. Her işletme farklı hissettirecek; ziyaretçi "bu bir template" diyemeyecek.

- **Canlı & Enerjik:** Bold renkler, gradyan arka planlar, akıcı animasyonlar
- **Mobile-First:** Tüm bileşenler önce mobil için tasarlanır
- **Tema Sürüklenmesi:** İşletmenin rengi tüm siteye — butonlara, başlıklara, kartlara, arka planlara yansır
- **Performans:** Skeleton loader, lazy loading, Cloudinary CDN ile hızlı açılış

### 5.2 Renk Teması Sistemi

Süper admin her işletme için renk teması belirler:

- **Yöntem 1:** 15 hazır renk paleti (sektöre göre öneriler ile birlikte)
- **Yöntem 2:** Hex kodu girişi — sistem otomatik açık ton, koyu ton, vurgu rengi türetir
- Her tema 4 değer içerir: Ana Renk, Vurgu Rengi, Arkaplan Gradyanı, Kart Rengi
- CSS değişkenleri ile uygulanır — tema değiştirildiğinde site anında güncellenir

### 5.3 URL Yapısı

```
isletme.dijitalvitrin.com/                    → Anasayfa
isletme.dijitalvitrin.com/urunler             → Tüm ürünler
isletme.dijitalvitrin.com/urun/[slug]         → Ürün detay sayfası
isletme.dijitalvitrin.com/blog                → Blog listesi
isletme.dijitalvitrin.com/blog/[slug]         → Blog yazısı
isletme.dijitalvitrin.com/hakkimizda          → Hakkımızda
```

> Ürün detayı ayrı URL'li sayfadır — modal değil. Bu sayede Google indexleyebilir ve kullanıcılar paylaşabilir. Sayfa geçişi smooth animasyonla yapılır, "sayfa yenilendi" hissi verilmez.

### 5.4 Sayfa Yapısı — Bölüm Bölüm

#### ① Yapışkan Header (Sticky)
- Sol: İşletme logosu + adı
- Orta: Navigasyon (Anasayfa, Ürünler, Blog, Hakkımızda, İletişim)
- Sağ: WhatsApp butonu — yeşil, pulse animasyonlu, her zaman görünür
- Scroll'da header küçülür, cam efekti arkaplan (backdrop-blur)
- Mobilde hamburger menü, smooth açılış animasyonu

#### ② Hero / Banner Bölümü
- Tam genişlik banner görseli veya gradyan arkaplan
- İşletme sloganı — büyük, bold, fade-up animasyonu
- **Çalışma saatleri göstergesi:** `🟢 Şu an AÇIK` / `🔴 Şu an KAPALI` (anlık hesaplama, saat bilgisi ile)
- Dekoratif animasyonlu şekiller / parçacıklar
- İki CTA butonu: "Ürünleri Gör" + "WhatsApp'tan Yaz"

#### ③ Kampanyalı Ürünler Carousel
- Sadece kampanya etiketli ürünler
- Yatay kaydırmalı, swipe destekli (mobil)
- "KAMPANYA" köşe rozeti + shimmer animasyonu
- Otomatik geçiş 4sn, kullanıcı tıklayınca durur
- Kampanyalı ürün yoksa bölüm tamamen gizlenir

#### ④ Ürün Kataloğu
- Kategori sekme filtresi — yatay scroll, aktif sekme vurgulu
- Tüm ürünler listelenir (sayfalama yok)
- Grid: 📱 2 sütun → 💻 3 sütun → 🖥️ 4 sütun
- Her kartta: ana görsel, ad, kısa açıklama (2 satır), stok durumu, detay butonu
- Tükendi → kırmızı overlay + "Tükendi" yazısı
- Yeni → son 7 günde eklenen ürünlere otomatik "YENİ" etiketi
- Hover: lift animasyonu + gölge derinleşmesi

#### ⑤ Ürün Detay Sayfası (Ayrı URL)
- Lightbox galeri: ana görsel büyük, alt kısımda thumbnail'lar
- Soldaki/sağdaki ok ile gezinme, swipe mobilde
- Ürün adı ve detaylı açıklama
- **Özellikler tablosu** (kategoriye göre doldurulan alanlar)
- Kampanya rozeti (varsa)
- Stok durumu göstergesi
- **Büyük WhatsApp butonu** — otomatik mesajlı
- Sayfa başlığı ve URL SEO için optimize edilmiş

#### ⑥ Blog Bölümü
- Kart listesi: kapak görseli, başlık, kısa özet, tarih
- Ayrı URL'li blog yazısı sayfası
- Zengin metin editörü (başlık, paragraf, görsel, liste)

#### ⑦ Hakkımızda Bölümü
- İşletme tanıtım metni
- Çalışma saatleri tablosu (gün gün)
- Google Maps embed (girilmişse)

#### ⑧ Footer
- Logo + ad
- WhatsApp linki
- Sosyal medya ikonları (yalnızca girilenlerin ikonu aktif)
- Çalışma saatleri özeti
- "Dijital Vitrin ile güçlendirilmiştir" — küçük, alt köşe

### 5.5 Animasyon Kataloğu

| Animasyon | Tetikleyici | Etki |
|---|---|---|
| Scroll Reveal | Sayfa kaydırma | Bölümler fade-up ile belirginleşir |
| Hero Parallax | Scroll | Banner farklı hızda kayar |
| Ürün Kartı Lift | Hover | Kart 8px yukarı kalkar, gölge artar |
| WhatsApp Pulse | Sürekli | Buton çevresinde yeşil hale nefes alır |
| Kampanya Shimmer | Sürekli | Rozet üzerinde parlama geçer |
| Skeleton Loader | Yükleme | Gri titreşen placeholder |
| Kategori Geçiş | Sekme değişimi | Ürünler fade ile yenilenir |
| Sayfa Geçişi | Link tıklama | Smooth animasyonlu geçiş |
| Modal / Drawer | Menü açma | Aşağıdan yukarı kaydırma |

---

## 6. Blog ve Duyuru Sistemi

### 6.1 Genel Yapı

- Her işletmenin kendi blog bölümü vardır
- Blog hem SEO için hem müşteri bilgilendirme için kullanılır
- Hem işletme admin hem süper admin blog yazısı ekleyebilir, düzenleyebilir, silebilir

### 6.2 Blog Yazısı Alanları

| Alan | Zorunlu | Açıklama |
|---|:---:|---|
| Başlık | ✅ | Max 150 karakter, URL slug'ına dönüştürülür |
| İçerik | ✅ | Zengin metin editörü (WYSIWYG) |
| Kapak Görseli | ❌ | Liste sayfasında ve OG etiketinde kullanılır |
| Meta Açıklama | ❌ | Girilmezse içerikten otomatik üretilir (ilk 160 karakter) |
| Yayın Durumu | ✅ | Taslak / Yayında |
| Yayın Tarihi | ✅ | İleri tarih yazısı zamanlanmış yayın desteği |

### 6.3 URL Yapısı

```
isletme.dijitalvitrin.com/blog/[yazi-basligi-slug]
```

Örnek: `ahmetbutik.dijitalvitrin.com/blog/2025-yaz-koleksiyonu-geldi`

### 6.4 Zengin Metin Editörü Özellikleri

- Başlık seviyeleri (H2, H3)
- Paragraf metni
- Kalın, italik, altı çizili
- Sıralı ve sırasız liste
- Görsel ekleme (yükleme veya URL)
- Bağlantı ekleme

---

## 7. İstatistik ve Analitik Sistemi

### 7.1 Takip Edilen Metrikler

#### Site Düzeyinde
- Sayfa görüntülenme (toplam + benzersiz)
- Ziyaretçi sayısı (IP hash bazlı benzersiz)
- Mobil / Masaüstü oranı
- Saatlik ziyaretçi dağılımı (en yoğun saat)

#### Ürün Düzeyinde
- Ürün kartı tıklama sayısı
- Ürün detay sayfası görüntülenme
- WhatsApp butonu tıklanma sayısı
- Dönüşüm oranı: `(WA Tıklama / Görüntülenme) × 100`

#### Blog Düzeyinde
- Her yazının görüntülenme sayısı

### 7.2 Süper Admin İstatistik Paneli

- **Özet Kartlar:** Toplam platform ziyareti, toplam WA tıklaması, aktif işletme sayısı
- **Platform Trend Grafiği:** Son 30 gün çizgi grafik
- **İşletme Karşılaştırma:** Bar grafik — hangi işletme daha çok trafik alıyor
- **Sektör Dağılımı:** Pasta grafik
- **En İyi 10 Ürün:** Tüm platform geneli sıralama
- **Detay:** Herhangi bir işletmenin istatistiğine tıklayarak erişim

### 7.3 İşletme Admin İstatistik Paneli

- **Özet Kartlar:** Bu ay görüntülenme, WA tıklaması, toplam ürün sayısı
- **Ziyaretçi Trendi:** Günlük/Haftalık/Aylık çizgi grafik
- **Ürün Performansı:** Bar grafik (en çok görüntülenen)
- **WA Dağılımı:** Pasta grafik (hangi üründen daha çok WA tıklaması)
- **Ürün Tablosu:** Her ürün için görüntülenme, WA tıklaması, dönüşüm oranı
- **Öne Çıkan:** "Bu haftanın en çok ilgi gören ürünü" kartı

### 7.4 Teknik İstatistik Altyapısı

- Her sayfa yüklenişinde sessiz arka plan API çağrısı ile kayıt
- Her WA butonu tıklamasında event kaydı
- **Bot filtresi:** Bilinen crawler user-agent'ları kara liste ile elenecek
- **Spam önleme:** Aynı IP hash'inden 1 dakika içinde tekrar görüntülemeler tek sayılır
- **Veri saklama:** Son 30 gün detaylı; daha eski veriler aylık özet olarak arşivlenir

---

## 8. SEO Mimarisi

### 8.1 Otomatik SEO Etiketleri

Her işletme sayfası ve ürün sayfası için otomatik oluşturulur:

```html
<!-- Her ürün sayfası için örnek -->
<title>Siyah Deri Çanta | Ahmet Butik</title>
<meta name="description" content="Ahmet Butik'te Siyah Deri Çanta modeli. Detaylar ve WhatsApp ile iletişim için tıklayın.">
<link rel="canonical" href="https://ahmetbutik.dijitalvitrin.com/urun/siyah-deri-canta">

<!-- Open Graph (WhatsApp/sosyal medya paylaşım önizlemesi) -->
<meta property="og:title" content="Siyah Deri Çanta | Ahmet Butik">
<meta property="og:description" content="...">
<meta property="og:image" content="[ürün ana görseli]">
<meta property="og:url" content="https://ahmetbutik.dijitalvitrin.com/urun/siyah-deri-canta">
<meta property="og:type" content="product">
```

### 8.2 Schema.org Yapılandırılmış Veri (JSON-LD)

**İşletme Anasayfası:**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Ahmet Butik",
  "url": "https://ahmetbutik.dijitalvitrin.com",
  "telephone": "+905xxxxxxxxx",
  "openingHours": ["Mo-Fr 09:00-18:00", "Sa 10:00-15:00"],
  "address": { "@type": "PostalAddress", ... },
  "sameAs": ["https://instagram.com/ahmetbutik"]
}
```

**Ürün Sayfası:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Siyah Deri Çanta",
  "description": "...",
  "image": ["..."],
  "brand": { "@type": "Brand", "name": "Ahmet Butik" },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "Ahmet Butik" }
  }
}
```

**Blog Yazısı:**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "2025 Yaz Koleksiyonu Geldi",
  "datePublished": "2025-06-01",
  "author": { "@type": "Organization", "name": "Ahmet Butik" }
}
```

### 8.3 Teknik SEO

- **`sitemap.xml`:** Her işletme için otomatik oluşturulur ve güncellenir. Tüm ürün, blog, ana sayfa URL'lerini içerir.
- **`robots.txt`:** Her subdomain için ayrı, tarayıcı erişimine açık
- **Canonical URL:** Duplicate content önlemek için her sayfada canonical etiketi
- **SSR (Server-Side Rendering):** Tüm vitrin sayfaları sunucu tarafında render edilir — Google JS çalıştırmaya gerek kalmaz, anında indexlenebilir
- **Sayfa Hızı:** Cloudinary CDN, lazy loading, kritik CSS inline

### 8.4 Google My Business Rehberi (Admin Panelinde)

Admin panelinde "Google'da Görün 🔍" başlıklı bir rehber bölümü bulunacak:

```
Adım 1: business.google.com adresine gidin
Adım 2: "İşletme Ekle" butonuna tıklayın
Adım 3: İşletme adınızı ve kategorinizi girin
Adım 4: Fiziksel adresinizi veya hizmet bölgenizi girin
Adım 5: Telefon numaranızı ekleyin
Adım 6: Web siteniz olarak [subdomain adresinizi] girin
Adım 7: Doğrulama kodunu bekleyin (posta veya telefon)
```

> Bu adımları tamamladıktan sonra işletmeniz Google Haritalar'da görünmeye başlar ve arama sonuçlarında bilgi kartı oluşur.

### 8.5 URL Slug Kuralları

- Türkçe karakterler dönüştürülür: `ş→s`, `ç→c`, `ğ→g`, `ü→u`, `ö→o`, `ı→i`
- Boşluklar tire ile değiştirilir
- Yalnızca küçük harf, rakam ve tire kullanılır
- Örnek: "Şık Çanta Modeli" → `sik-canta-modeli`
- Subdomain slug'ı süper admin tarafından manuel girilir (otomatik öneride bulunulur)

---

## 9. Süper Admin Paneli

### 9.1 Genel Tasarım

Sade ve fonksiyonel. Hız ve verimlilik öncelikli, fazla dekorasyon yok.

### 9.2 Dashboard (Ana Ekran)

- Özet kartlar: Toplam işletme, aktif işletme, bu ay platform ziyareti, bu ay WA tıklaması
- **Uyarı listesi:** Aboneliği 7 gün içinde dolacak işletmeler (kırmızı banner)
- Platform geneli 30 günlük trafik çizgi grafiği
- İşletme sıralaması bar grafiği (en çok trafik alan)
- Son eklenen / güncellenen içerikler

### 9.3 İşletme Yönetimi

**Liste Görünümü:**
- Arama, sektör filtresi, aktif/pasif filtresi, abonelik durumu filtresi
- Her satır: Ad, subdomain, sektör, ürün sayısı, bu ay trafik, abonelik bitiş, durum

**Yeni İşletme Ekleme Formu:**

```
Temel Bilgiler:
  - İşletme adı *
  - Subdomain (slug) * → otomatik öneri + manuel düzenleme
  - Sektör * → kategori şablonu otomatik atanır
  - WhatsApp numarası * (ülke kodu dahil)

Görsel & Tema:
  - Logo (1:1, max 2MB)
  - Banner (16:9, max 5MB)
  - Renk teması (palet seç VEYA hex gir)

İçerik:
  - Header sloganı (max 100 kar.)
  - Hakkımızda metni
  - Google Maps linki/koordinat
  - Instagram, Facebook, TikTok URL

Çalışma Saatleri:
  - Pazartesi → Pazar: [Kapalı | Açık: saat aralığı]

Admin Hesabı:
  - Kullanıcı adı *
  - Şifre * (kural: min 8 kar., büyük+küçük+rakam)
  - Max görsel sayısı (varsayılan: 7)

Abonelik:
  - Paket: Aylık / Yıllık
  - Başlangıç tarihi
  - Bitiş tarihi
  - Otomatik pasife al: Evet / Hayır
```

**İşletme Detay / Düzenleme:**
- Tüm alanlar güncellenebilir
- Şifre sıfırlama butonu (bildirim gitmez)
- "Bu işletme adına giriş yap" butonu — oturum loglanır
- Aktif/Pasif geçiş
- Silme (onay diyalogu: *"Bu işletme ve tüm verileri kalıcı olarak silinecek."*)

### 9.4 Platform Ayarları

- Varsayılan maksimum görsel sayısı (yeni işletmeler için)
- Platform geneli duyuru (tüm işletme panellerinde gösterilecek mesaj)

---

## 10. İşletme Admin Paneli

### 10.1 Genel Tasarım

Sade ve fonksiyonel. İşletme sahibi teknik bilgisi olmadan kullanabilmeli.

### 10.2 Dashboard

- Özet kartlar: Toplam ürün, bu ay görüntülenme, bu ay WA tıklaması
- Bu haftanın en çok ilgi gören 3 ürünü
- 30 günlük trafik çizgi grafiği
- Hızlı eylem: "Yeni Ürün Ekle" butonu

### 10.3 Kategori Yönetimi

- Kategori listesi (süper admin tarafından atanan şablonla başlar)
- Yeni kategori ekleme: ad girişi
- Kategori düzenleme: ad değiştirme
- Kategori silme: içinde ürün varsa uyarı + ürün taşıma zorunluluğu
- **Kategori Özellik Yönetimi** (her kategori altında):
  - Özellik listesi görüntüleme
  - Yeni özellik ekleme: ad, tip (metin/sayı/çoktan seçmeli), birim (sayı için), seçenekler (çoktan seçmeli için), zorunlu/opsiyonel
  - Özellik düzenleme
  - Özellik silme (uyarı ile)

### 10.4 Ürün Yönetimi

**Liste:**
- Thumbnail, ad, kategori, stok, kampanya, aktif/pasif, eklenme tarihi
- Kategori filtresi, arama, sıralama seçenekleri
- Tek tıkla stok ve aktif/pasif toggle

**Ürün Ekleme / Düzenleme:**
- Anlık validasyon + gönderimde tam kontrol
- Tüm alanlar (bkz. Bölüm 4.1)
- Görsel yükleme: sürükle-bırak, sıra değiştirme, ana görsel seçimi
- Kategori özellik alanları dinamik olarak yüklenir

**Ürün Sıralaması:**
- "Sıralama Modu" seçimi: Varsayılan (Random) / Manuel
- Manuel modda tüm ürünler sürükle-bırak ile sıralanır

### 10.5 Blog Yönetimi

- Blog yazısı listesi: başlık, yayın durumu, tarih, görüntülenme
- Yeni yazı ekleme (zengin metin editörü)
- Düzenleme ve silme
- Taslak kaydetme

### 10.6 İstatistikler

Bkz. Bölüm 7.3

---

## 11. WhatsApp Entegrasyonu

### 11.1 Çalışma Mantığı

Standart `wa.me` linki kullanılır. Herhangi bir ücretli API kullanılmaz.

```
https://wa.me/[numara]?text=[URL encode edilmiş mesaj]
```

Tıklandığında: Telefonda WhatsApp uygulaması, masaüstünde WhatsApp Web açılır.

### 11.2 Otomatik Mesaj Şablonları

**Genel İletişim (Header/Footer):**
```
Merhaba! [İşletme Adı] ile iletişime geçmek istiyorum.
```

**Ürün Sorgusu (Ürün Detay Sayfası):**
```
Merhaba! [İşletme Adı] — [Ürün Adı] hakkında bilgi almak istiyorum.
```

### 11.3 İstatistik Takibi

- Her tıklama istatistik sistemine kaydedilir (hangi ürün, tarih, mobil/masaüstü)
- Süper admin ve işletme admin panelinde raporlanır

---

## 12. Güvenlik Mimarisi

### 12.1 Kimlik Doğrulama

- JWT tabanlı oturum yönetimi
- Access token süresi: **8 saat**
- Refresh token süresi: **7 gün**
- Süper admin için **Google Authenticator 2FA zorunlu**
- İşletme admin için 2FA opsiyonel (süper admin aktif edebilir)
- Süper admin yedek giriş yaptığında oturum loglanır

### 12.2 Şifre Politikası

- Minimum 8 karakter
- En az 1 büyük harf, 1 küçük harf, 1 rakam
- 10.000 yaygın şifre kara listesi
- Veritabanında **bcrypt (salt rounds: 12)** ile hash — düz metin asla saklanmaz
- Şifre sıfırlandığında işletmeye bildirim **gitmez** — süper admin bilgilendirir

### 12.3 Brute-Force ve Hız Sınırlama

- **5 başarısız giriş** → hesap 15 dakika kilitlenir (hesap bazlı, IP bağımsız)
- Süper admin tüm kilitleri görür ve manuel açabilir
- **API rate limiting:** IP başına saniyede 30 istek
- **Admin endpoint'leri:** Dakikada 60 istek
- **Token blacklist:** Güvenlik ihlali şüphesinde tüm aktif tokenlar geçersiz kılınabilir (tek tıkla)

### 12.4 Ağ ve Protokol Güvenliği

- Tüm subdomain'lerde **wildcard SSL** (Let's Encrypt — ücretsiz, otomatik yenileme)
- HTTP → HTTPS otomatik 301 yönlendirme
- Güvenlik header'ları: `HSTS`, `X-Frame-Options`, `X-Content-Type-Options`, `CSP`
- Cookie'ler: `HttpOnly`, `Secure`, `SameSite=Strict`
- CORS: Yalnızca tanımlı origin'ler

### 12.5 Veri Güvenliği

- Dosya yükleme: tip ve boyut kontrolü (JPG/PNG/WebP, max 5MB)
- Tüm girdi alanlarında SQL injection ve XSS sanitizasyonu
- Veritabanı bağlantısı SSL üzerinden
- Günlük otomatik veritabanı yedeği (7 gün saklanır, sonra silinir)
- İstatistik için IP adresleri **SHA256 ile hash'lenerek** saklanır (KVKK uyumu)

---

## 13. Teknik Mimari ve Teknoloji Yığını

### 13.1 Teknoloji Tablosu

| Katman | Teknoloji | Versiyon | Neden? |
|---|---|---|---|
| **Frontend** | React.js + TypeScript | 18+ | Tip güvenliği, geniş ekosistem |
| **UI Stili** | Tailwind CSS | 3+ | Utility-first, hızlı geliştirme |
| **Animasyon** | Framer Motion | 11+ | Profesyonel, performanslı animasyonlar |
| **Zengin Metin** | Tiptap (blog editörü) | 2+ | Headless, özelleştirilebilir WYSIWYG |
| **Grafik** | Recharts | 2+ | React tabanlı, sade API |
| **Backend** | Node.js + Express.js | 20+ LTS | Hızlı API, JS ekosistemi |
| **Veritabanı** | PostgreSQL | 16+ | İlişkisel yapı, güçlü sorgu |
| **ORM** | Prisma | 5+ | Tip güvenli DB erişimi, migration |
| **Kimlik Doğrulama** | JWT + bcrypt | — | Hafif, güvenli, bağımsız |
| **2FA** | otplib (TOTP) | — | Google Authenticator uyumlu |
| **Görsel Depolama** | Cloudinary | — | CDN, otomatik boyutlandırma, ücretsiz tier |
| **SSR** | Next.js (vitrin için) | 14+ | SEO kritik — sunucu taraflı render |
| **Web Sunucusu** | Nginx | — | Wildcard subdomain + SSL proxy |
| **SSL** | Let's Encrypt (Certbot) | — | Ücretsiz, otomatik wildcard yenileme |
| **Süreç Yöneticisi** | PM2 | — | Node.js monitoring, otomatik restart |
| **Sunucu** | Hetzner CX21 VPS | — | ~5€/ay, 2vCPU, 4GB RAM |
| **Önbellek** | Redis (opsiyonel Faz 2) | 7+ | Sık erişilen verilerin cache'lenmesi |

> **Mimari Not:** Vitrin sitesi **Next.js** ile SSR olarak çalışır (SEO için zorunlu). Süper admin ve işletme admin panelleri React SPA olarak ayrı çalışır. Backend ortak Express.js API'sidir.

### 13.2 Proje Klasör Yapısı

```
dijital-vitrin/
├── apps/
│   ├── storefront/          → Next.js — vitrin sitesi (SSR)
│   ├── admin-panel/         → React SPA — işletme admin
│   └── super-admin/         → React SPA — süper admin
├── packages/
│   ├── api/                 → Express.js REST API
│   ├── database/            → Prisma şeması ve migration'lar
│   └── shared/              → Ortak tipler, yardımcı fonksiyonlar
└── infrastructure/
    ├── nginx/               → Nginx konfigürasyonu
    └── scripts/             → Deploy ve yedek scriptleri
```

### 13.3 Subdomain Mimarisi

```
dijitalvitrin.com              → Platform tanıtım sayfası (opsiyonel)
app.dijitalvitrin.com          → İşletme admin paneli
admin.dijitalvitrin.com        → Süper admin paneli
*.dijitalvitrin.com            → İşletme vitrin siteleri
```

**Nginx Wildcard Yönlendirme:**
1. DNS: `*.dijitalvitrin.com` → Sunucu IP
2. Nginx subdomain'i okur → Next.js'e `slug` parametresi olarak iletir
3. Next.js veritabanından o slug'a ait işletmeyi yükler
4. Pasif işletme → 302 ile bilgilendirme sayfasına yönlendirilir

---

## 14. Veritabanı Şeması

### `businesses` — İşletmeler

| Alan | Tip | Zorunlu | Açıklama |
|---|---|:---:|---|
| `id` | UUID | ✅ | Birincil anahtar |
| `name` | VARCHAR(150) | ✅ | İşletme adı |
| `slug` | VARCHAR(100) | ✅ | Subdomain adı (benzersiz) |
| `sector` | ENUM | ✅ | elektronik/butik/aksesuar/el_isi/oto_galeri |
| `whatsapp` | VARCHAR(20) | ✅ | WhatsApp numarası (+90...) |
| `logo_url` | VARCHAR | ❌ | Cloudinary URL |
| `banner_url` | VARCHAR | ❌ | Cloudinary URL |
| `theme_preset` | VARCHAR(50) | ❌ | Hazır tema adı |
| `theme_primary` | CHAR(7) | ✅ | Ana renk hex (#xxxxxx) |
| `theme_accent` | CHAR(7) | ✅ | Vurgu rengi hex |
| `slogan` | VARCHAR(100) | ❌ | Header sloganı |
| `about_text` | TEXT | ❌ | Hakkımızda metni |
| `maps_url` | VARCHAR | ❌ | Google Maps linki |
| `instagram_url` | VARCHAR | ❌ | |
| `facebook_url` | VARCHAR | ❌ | |
| `tiktok_url` | VARCHAR | ❌ | |
| `max_images_per_product` | INT | ✅ | Varsayılan: 7 |
| `product_sort_mode` | ENUM | ✅ | random / manual |
| `is_active` | BOOLEAN | ✅ | Aktif/pasif |
| `auto_deactivate` | BOOLEAN | ✅ | Abonelik bitince otomatik pasife al |
| `subscription_plan` | ENUM | ✅ | monthly / yearly |
| `subscription_end` | DATE | ✅ | Abonelik bitiş tarihi |
| `created_at` | TIMESTAMP | ✅ | |

### `business_hours` — Çalışma Saatleri

| Alan | Tip | Zorunlu | Açıklama |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `business_id` | UUID | ✅ | FK → businesses |
| `day_of_week` | INT | ✅ | 0=Paz, 1=Pzt ... 6=Cmt |
| `is_open` | BOOLEAN | ✅ | O gün açık mı? |
| `open_time` | TIME | ❌ | Açılış (örn: 09:00) |
| `close_time` | TIME | ❌ | Kapanış (örn: 18:00) |

### `users` — Kullanıcılar

| Alan | Tip | Zorunlu | Açıklama |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `username` | VARCHAR(50) | ✅ | Kullanıcı adı (benzersiz) |
| `password_hash` | VARCHAR | ✅ | bcrypt hash (salt: 12) |
| `role` | ENUM | ✅ | super_admin / business_admin |
| `business_id` | UUID | ❌ | FK → businesses (business_admin için) |
| `totp_secret` | VARCHAR | ❌ | 2FA gizli anahtarı |
| `totp_enabled` | BOOLEAN | ✅ | 2FA aktif mi? |
| `failed_attempts` | INT | ✅ | Başarısız giriş sayacı |
| `locked_until` | TIMESTAMP | ❌ | Kilitleme bitiş zamanı |
| `last_login` | TIMESTAMP | ❌ | Son giriş |
| `created_at` | TIMESTAMP | ✅ | |

### `categories` — Kategoriler

| Alan | Tip | Zorunlu | Açıklama |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `business_id` | UUID | ✅ | FK → businesses |
| `name` | VARCHAR(100) | ✅ | Kategori adı |
| `sort_order` | INT | ✅ | Görünüm sırası |
| `created_at` | TIMESTAMP | ✅ | |

### `category_attributes` — Kategori Özellikleri

| Alan | Tip | Zorunlu | Açıklama |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `category_id` | UUID | ✅ | FK → categories |
| `name` | VARCHAR(100) | ✅ | Özellik adı (örn: "Renk") |
| `type` | ENUM | ✅ | text / number / select |
| `unit` | VARCHAR(20) | ❌ | Birim (sayı tipi için, örn: "kg") |
| `is_required` | BOOLEAN | ✅ | Zorunlu mu? |
| `sort_order` | INT | ✅ | Görünüm sırası |

### `attribute_options` — Çoktan Seçmeli Seçenekler

| Alan | Tip | Zorunlu | Açıklama |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `attribute_id` | UUID | ✅ | FK → category_attributes |
| `value` | VARCHAR(100) | ✅ | Seçenek değeri (örn: "Kırmızı") |
| `sort_order` | INT | ✅ | Görünüm sırası |

### `products` — Ürünler

| Alan | Tip | Zorunlu | Açıklama |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `business_id` | UUID | ✅ | FK → businesses |
| `category_id` | UUID | ✅ | FK → categories |
| `name` | VARCHAR(100) | ✅ | Ürün adı |
| `slug` | VARCHAR(120) | ✅ | URL slug (benzersiz işletme içinde) |
| `short_desc` | VARCHAR(150) | ❌ | Ürün kartında gösterilir |
| `long_desc` | TEXT | ❌ | Detay sayfasında gösterilir |
| `is_campaign` | BOOLEAN | ✅ | Kampanya ürünü mü? |
| `in_stock` | BOOLEAN | ✅ | Stokta var mı? |
| `is_active` | BOOLEAN | ✅ | Vitrin sitesinde görünsün mü? |
| `sort_order` | INT | ❌ | Manuel sıralama için |
| `created_at` | TIMESTAMP | ✅ | |

### `product_attribute_values` — Ürün Özellik Değerleri

| Alan | Tip | Zorunlu | Açıklama |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `product_id` | UUID | ✅ | FK → products |
| `attribute_id` | UUID | ✅ | FK → category_attributes |
| `value_text` | TEXT | ❌ | Metin tipi için |
| `value_number` | DECIMAL | ❌ | Sayı tipi için |
| `value_option_id` | UUID | ❌ | FK → attribute_options (select tipi) |

### `product_images` — Ürün Görselleri

| Alan | Tip | Zorunlu | Açıklama |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `product_id` | UUID | ✅ | FK → products |
| `url` | VARCHAR | ✅ | Cloudinary URL |
| `is_primary` | BOOLEAN | ✅ | Ana görsel mi? |
| `sort_order` | INT | ✅ | Galeri sırası |

### `blog_posts` — Blog Yazıları

| Alan | Tip | Zorunlu | Açıklama |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `business_id` | UUID | ✅ | FK → businesses |
| `title` | VARCHAR(150) | ✅ | Başlık |
| `slug` | VARCHAR(170) | ✅ | URL slug |
| `content` | TEXT | ✅ | HTML içerik (WYSIWYG çıktısı) |
| `cover_image_url` | VARCHAR | ❌ | Kapak görseli |
| `meta_description` | VARCHAR(160) | ❌ | Boşsa içerikten üretilir |
| `status` | ENUM | ✅ | draft / published |
| `published_at` | TIMESTAMP | ❌ | İleri tarih zamanlanmış yayın |
| `created_at` | TIMESTAMP | ✅ | |

### `analytics_events` — İstatistik Olayları (Ham)

| Alan | Tip | Zorunlu | Açıklama |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `business_id` | UUID | ✅ | |
| `product_id` | UUID | ❌ | Varsa |
| `blog_post_id` | UUID | ❌ | Varsa |
| `event_type` | ENUM | ✅ | page_view / product_view / whatsapp_click / blog_view |
| `ip_hash` | CHAR(64) | ✅ | SHA256 hash (KVKK) |
| `is_mobile` | BOOLEAN | ✅ | |
| `is_bot` | BOOLEAN | ✅ | Bot filtresi sonucu |
| `created_at` | TIMESTAMP | ✅ | |

### `analytics_daily` — Günlük Özetler (Önceden Hesaplanmış)

| Alan | Tip | Zorunlu | Açıklama |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `business_id` | UUID | ✅ | |
| `product_id` | UUID | ❌ | null ise işletme geneli |
| `date` | DATE | ✅ | Gün |
| `page_views` | INT | ✅ | |
| `unique_visitors` | INT | ✅ | |
| `product_views` | INT | ✅ | |
| `whatsapp_clicks` | INT | ✅ | |

---

## 15. API Endpoint Listesi

### Kimlik Doğrulama

| Method | Endpoint | Rol | Açıklama |
|---|---|---|---|
| POST | `/api/auth/login` | Herkese Açık | Giriş — JWT döner |
| POST | `/api/auth/logout` | Giriş Yapmış | Çıkış — token geçersiz |
| POST | `/api/auth/refresh` | Giriş Yapmış | Token yenile |
| POST | `/api/auth/verify-2fa` | Giriş Yapmış | 2FA kodu doğrula |
| POST | `/api/auth/reset-password` | Süper Admin | Şifre sıfırla |

### İşletme Yönetimi (Süper Admin)

| Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/admin/businesses` | Tüm işletmeler |
| POST | `/api/admin/businesses` | Yeni işletme |
| GET | `/api/admin/businesses/:id` | Detay |
| PUT | `/api/admin/businesses/:id` | Güncelle |
| DELETE | `/api/admin/businesses/:id` | Sil |
| PATCH | `/api/admin/businesses/:id/toggle` | Aktif/Pasif |
| POST | `/api/admin/businesses/:id/impersonate` | Yedek giriş |
| GET | `/api/admin/analytics` | Platform istatistikleri |
| GET | `/api/admin/analytics/:bizId` | İşletme istatistikleri |

### Kategori Yönetimi (İşletme Admin + Süper Admin)

| Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/business/categories` | Kategorileri listele |
| POST | `/api/business/categories` | Kategori ekle |
| PUT | `/api/business/categories/:id` | Kategori düzenle |
| DELETE | `/api/business/categories/:id` | Kategori sil |
| GET | `/api/business/categories/:id/attributes` | Özellikleri listele |
| POST | `/api/business/categories/:id/attributes` | Özellik ekle |
| PUT | `/api/business/categories/:id/attributes/:attrId` | Özellik düzenle |
| DELETE | `/api/business/categories/:id/attributes/:attrId` | Özellik sil |
| POST | `/api/business/categories/:id/attributes/:attrId/options` | Seçenek ekle |
| PUT | `/api/business/categories/:id/attributes/:attrId/options/:optId` | Seçenek düzenle |
| DELETE | `/api/business/categories/:id/attributes/:attrId/options/:optId` | Seçenek sil |

### Ürün Yönetimi (İşletme Admin + Süper Admin)

| Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/business/products` | Ürünleri listele |
| POST | `/api/business/products` | Ürün ekle |
| PUT | `/api/business/products/:id` | Ürün düzenle |
| DELETE | `/api/business/products/:id` | Ürün sil |
| PATCH | `/api/business/products/:id/stock` | Stok güncelle |
| PATCH | `/api/business/products/:id/visibility` | Aktif/Pasif |
| POST | `/api/business/products/:id/images` | Görsel yükle |
| DELETE | `/api/business/products/:id/images/:imgId` | Görsel sil |
| PATCH | `/api/business/products/:id/primary-image` | Ana görseli değiştir |
| PUT | `/api/business/products/sort-order` | Sıralamayı kaydet |

### Blog (İşletme Admin + Süper Admin)

| Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/business/blog` | Yazıları listele |
| POST | `/api/business/blog` | Yazı ekle |
| PUT | `/api/business/blog/:id` | Yazı düzenle |
| DELETE | `/api/business/blog/:id` | Yazı sil |
| PATCH | `/api/business/blog/:id/publish` | Yayınla / Taslağa al |

### Vitrin Sitesi (Herkese Açık)

| Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/storefront/:slug` | İşletme bilgisi + ayarları |
| GET | `/api/storefront/:slug/products` | Ürün listesi |
| GET | `/api/storefront/:slug/products/:productSlug` | Ürün detayı |
| GET | `/api/storefront/:slug/blog` | Blog listesi |
| GET | `/api/storefront/:slug/blog/:blogSlug` | Blog yazısı |
| POST | `/api/analytics/event` | İstatistik olayı kaydet |

### İstatistikler (İşletme Admin)

| Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/business/analytics` | Özet istatistikler |
| GET | `/api/business/analytics/products` | Ürün bazlı istatistik |
| GET | `/api/business/analytics/blog` | Blog istatistikleri |

---

## 16. Abonelik Modeli

- Platform içinde ödeme sistemi **yoktur**
- Tüm tahsilat elden veya banka havalesi ile gerçekleşir
- Abonelik süresi ve bitiş tarihi süper admin panelinden manuel girilir
- Aboneliği 7 gün içinde dolacak işletmeler dashboard'da uyarı olarak gösterilir
- **Otomatik pasife alma:** Süper admin işletme bazlı açıp kapatabilir (varsayılan: kapalı)
- Pasif işletmenin subdomain'ine girenlere bilgilendirme sayfası gösterilir
- Ödeme alındıktan sonra süper admin bitiş tarihini uzatır ve siteyi aktif eder

---

## 17. Geliştirme Yol Haritası

### Faz 1 — Temel Altyapı
1. Monorepo kurulumu (npm workspaces)
2. Veritabanı şeması (Prisma migration)
3. Kimlik doğrulama sistemi (JWT + bcrypt + 2FA)
4. Güvenlik katmanları (rate limiting, brute-force, CORS, header'lar)
5. Süper admin paneli — işletme CRUD
6. İşletme admin paneli — temel iskelet
7. Görsel yükleme altyapısı (Cloudinary)
8. Subdomain yönlendirme (Nginx wildcard + SSL)

### Faz 2 — İçerik Sistemleri
1. Kategori ve özellik yönetimi (tam CRUD + validasyon)
2. Ürün yönetimi (çoklu görsel, sıralama, aktif/pasif)
3. Blog sistemi (zengin metin editörü, taslak/yayın)
4. Hata mesajları ve validasyon katmanı

### Faz 3 — Vitrin Sitesi
1. Next.js SSR altyapısı + subdomain routing
2. Renk teması sistemi (CSS değişkenleri)
3. Vitrin tasarımı + animasyon sistemi (Framer Motion)
4. Kampanyalı ürünler carousel
5. Ürün detay sayfası + lightbox galeri
6. Kategori özellikler tablosu
7. Blog sayfaları
8. WhatsApp entegrasyonu

### Faz 4 — SEO ve İstatistik
1. Meta etiketleri, OG, JSON-LD yapılandırılmış veri
2. `sitemap.xml` ve `robots.txt` otomatik üretimi
3. İstatistik event kayıt sistemi + bot filtresi
4. Günlük özet cron job
5. Dashboard grafikleri (Recharts)
6. Google My Business rehberi

### Faz 5 — Test ve Yayın
1. Güvenlik testleri
2. Performans testleri (50 eşzamanlı işletme)
3. Mobil uyumluluk testleri (iOS Safari, Android Chrome)
4. VPS kurulum ve yapılandırma
5. DNS ve wildcard SSL yapılandırması
6. Canlıya geçiş ve izleme

---

## 18. Açık Kalan Kararlar

Geliştirme sürecinde netleştirilmesi gereken konular:

| # | Konu | Durum |
|---|---|---|
| 1 | Taslak blog yazısı zamanlanmış yayın özelliği isteniyor mu? | ✅ Evet (dokümanda var) |
| 2 | Ürün görseli boyut/kırpma otomatik mi, ham mı? | ✅ Ham — olduğu gibi |
| 3 | Çoktan seçmeli özellikte çoklu seçim (birden fazla değer) isteniyor mu? | ❓ Netleştirilmeli |
| 4 | Platform tanıtım anasayfası (`dijitalvitrin.com`) hazırlanacak mı? | ❓ Netleştirilmeli |
| 5 | İşletme admini kendi şifresini değiştirebilmeli mi? | ❌ Hayır — sadece süper admin |
| 6 | Redis cache Faz 1'de mi, sonra mı eklensin? | ❓ Netleştirilmeli |

---

## 19. Açık Kalan Kararların Cevapları ve eksik kalanlar


- Varyasyon ve Çoklu Seçim: Açık kararlar (Madde 18.3) bölümünde belirttiğiniz konu çok kritik. Eğer çoklu seçime izin verilmezse, bir butik "Mavi Tişört" için S, M, L bedenlerini tek bir üründe gösteremez; her beden için ayrı ürün açmak zorunda kalır. Çoktan seçmeli özelliklerde "Çoklu Seçim (Multiple-Choice)" desteği kesinlikle olmalı.


- Yasal Sayfalar (KVKK & Gizlilik): Platform üzerinden doğrudan ödeme alınmasa da, ziyaretçilerden WhatsApp üzerinden iletişim kurulması sebebiyle veri işleniyor demektir. Vitrin sitesinin footer bölümüne süper admin tarafından merkezi olarak yönetilen (veya işletmenin kendi girebileceği) "Gizlilik Politikası" ve "Kullanım Koşulları" gibi statik sayfalar için bir alan ayrılmalı.

- Çerez (Cookie) Onay Banner'ı: Analitik sistemi için IP adreslerini hash'leyerek takip ediyorsunuz (KVKK açısından harika bir hamle), ancak tarayıcıda oturum yönetimi veya gelecekteki potansiyel takip araçları için yasal olarak ekranda ufak bir çerez aydınlatma uyarısı (Cookie Consent) çıkması faydalı olacaktır.





*Bu doküman projenin yaşayan referans belgesidir. Her karar alındığında güncellenir.*

---

## 20. Proje İlerleme ve Durum Raporlama Kuralı (ZORUNLU)

> ⚠️ **SİSTEM KURALI:** Yapay zeka, kendisine verilen **her görev veya iş paketi tamamlandığında**, proje ana dizinindeki `active_context` ve `progress.md` dosyalarını zorunlu olarak güncellemekle yükümlüdür.
> 
> - `active_context`: En son yapılan iş, çalışılan faz, eklenen/çıkarılan/düzenlenen dosyalar ve bir sonraki adımı içerecek şekilde güncellenmelidir.
> - `progress.md`: Projenin genel yol haritasındaki tamamlanan maddelerin onay kutuları (`[x]`) işaretlenmeli ve bir sonraki adıma geçildiği raporlanmalıdır.
> 
> Bu kural atlanamaz ve her prompt/işlem sonrasında otomatik olarak işletilmelidir.

---

## 21. Otomatik Test Yazma ve Çalıştırma Kuralı (ZORUNLU)

> ⚠️ **SİSTEM KURALI:** Geliştirme süreci ilerledikçe kod karmaşıklığını yönetmek ve geriye dönük (regression) hataları engellemek adına; bundan sonra geliştirilecek **test edilebilir her yeni özellik, API uç noktası veya UI mantığının hemen ardından ilgili testleri (Unit / Integration) yazılmalı ve çalıştırılmalıdır.**
> 
> - API tarafı için `Jest + Supertest` gibi araçlarla endpoint doğrulama testleri yazılacaktır.
> - Bir özellik (feature) geliştirildiğinde, o özelliğe ait test senaryoları kodlanmadan bir sonraki göreve geçilmeyecektir.

## 22. Otomatik Test Kuralları (ZORUNLU)
Test yazarken, test konfigürasyonlarını düzenlerken veya test hatalarını çözerken DAİMA `.gemini/skills/testing/SKILL.md` dosyasındaki kurallara uyulacaktır. Test altyapısı (Vitest) monorepo mimarisine göre kurulmuştur, yapay zeka bu ayarları "hack" yöntemlerle (alias ekleyerek veya alt paketlere kütüphane kurarak) aşmaya çalışamaz.

*Dijital Vitrin Platformu — Gizlidir*
