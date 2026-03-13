# SKILL: Admin Panel UI & UX (İşletme Admin + Süper Admin)

> Bu dosya, Dijital Vitrin projesindeki her iki admin panelinin (işletme admin ve süper admin)
> UI/UX tasarım ve geliştirme kurallarını kapsar.
> Her panel bileşeni yazmadan önce bu dosya eksiksiz okunmalıdır.

---

## 1. GENEL TASARIM PRENSİBİ

### 1.1 Admin Panel Karakteri
Admin panelleri vitrin sitesinin aksine:
- **Fonksiyonel ve sade** — süslü animasyonlar değil, hız ve verimlilik
- **Bilgi yoğun** — çok veri, az alan israfı
- **Hızlı etkileşim** — inline editing, toggle switch, tek tıkla işlemler
- **Güven verici** — destructive işlemlerde onay diyalogu, geri alınamaz işlemlerde uyarı

### 1.2 İki Panel Arasındaki Fark

| Özellik | Süper Admin | İşletme Admin |
|---|---|---|
| Karmaşıklık | Yüksek (çok işletme) | Düşük (tek işletme) |
| Renk tonu | Koyu sidebar, profesyonel | Açık, daha samimi |
| Hedef kullanıcı | Teknik bilen | Teknik bilmeyen KOBİ sahibi |
| İkonografi | Yönetimsel, raporlama | Ürün, içerik odaklı |

---

## 2. LAYOUT MİMARİSİ

### 2.1 Ana Layout Yapısı
```
┌──────────────┬──────────────────────────────────────┐
│   SIDEBAR    │  TOPBAR                               │
│   (240px)    │  [Breadcrumb]  [Bildirimler] [Avatar] │
│              ├──────────────────────────────────────┤
│  [Logo]      │                                       │
│              │         MAIN CONTENT                  │
│  [Nav Items] │                                       │
│              │                                       │
│  [Alt: Çıkış]│                                       │
└──────────────┴──────────────────────────────────────┘
```

### 2.2 Responsive Davranış
- **Desktop (> 1024px):** Sidebar her zaman açık, `w-60`
- **Tablet (768-1024px):** Sidebar overlay olarak açılır/kapanır
- **Mobil (< 768px):** Sidebar hamburger menü arkasında, tam ekran overlay

### 2.3 Sidebar Tasarım Kuralları

**Süper Admin Sidebar:**
```
Arka plan: bg-gray-900 veya bg-slate-900
Logo: beyaz/açık renk
Nav item hover: bg-gray-700/50
Aktif nav: bg-primary sol kenar çizgisi (border-l-4)
```

**İşletme Admin Sidebar:**
```
Arka plan: bg-white + sağ kenar gölgesi
Logo: renk
Nav item hover: bg-gray-50
Aktif nav: text-primary + bg-primary/10
```

**Nav Item Yapısı:**
```typescript
interface NavItem {
  label: string;      // Türkçe etiket
  icon: LucideIcon;   // Lucide icon
  href: string;
  badge?: number;     // Bildirim sayısı (varsa kırmızı badge)
}

// İkon + etiket yan yana, aktif state yönetimi
```

---

## 3. FORM TASARIMI VE VALİDASYON

### 3.1 Form Mimarisi
React Hook Form + Zod kullanılır:

```typescript
// Zorunlu yapı — her formda
const schema = z.object({
  name: z.string().min(1, "Bu alan zorunludur").max(100, "En fazla 100 karakter"),
  // ...
});

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  mode: "onBlur", // Alan odak kaybedince validate et
});
```

### 3.2 Input Bileşen Standartları

**Her input alanı şu yapıya sahip olmalı:**
```typescript
<div className="space-y-1.5">
  <label className="text-sm font-medium text-gray-700">
    Alan Adı {required && <span className="text-red-500">*</span>}
  </label>
  <input
    className={cn(
      "w-full px-3 py-2 rounded-lg border text-sm transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30",
      "focus:border-[var(--color-primary)]",
      error && "border-red-500 focus:ring-red-500/30 focus:border-red-500",
      !error && "border-gray-300"
    )}
    {...field}
  />
  {error && (
    <p className="text-xs text-red-600 flex items-center gap-1">
      <AlertCircle className="w-3 h-3" /> {error.message}
    </p>
  )}
  {helperText && !error && (
    <p className="text-xs text-gray-400">{helperText}</p>
  )}
</div>
```

### 3.3 Karakter Sayacı
Karakter limiti olan alanlarda zorunlu:
```typescript
<div className="flex justify-between">
  <p className={cn("text-xs", isOverLimit ? "text-red-600 font-medium" : "text-gray-400")}>
    {currentLength} / {maxLength}
  </p>
</div>
```

### 3.4 Form Gönderim Hata Özeti
```typescript
// Form submit'te hata varsa sayfanın üstüne scroll + özet göster
<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
  <p className="text-red-800 font-medium text-sm">
    ⚠️ {errorCount} alanda eksik veya hatalı bilgi var. Lütfen kontrol edin.
  </p>
</div>
```

### 3.5 Başarı Bildirimi (Toast)
```typescript
// react-hot-toast veya sonner kullanılır
toast.success("Ürün başarıyla kaydedildi", {
  icon: "✅",
  duration: 3000,
});
```

---

## 4. DESTRUCTIVE İŞLEMLER — ONAY DİYALOGU

Her silme veya geri alınamaz işlem için Confirm Dialog zorunludur:

```typescript
// Örnek: İşletme silme diyalogu
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className="text-red-600">
        ⚠️ Bu işlem geri alınamaz
      </AlertDialogTitle>
      <AlertDialogDescription>
        <strong>{business.name}</strong> ve bu işletmeye ait tüm 
        ürünler, kategoriler, blog yazıları ve istatistikler 
        <strong> kalıcı olarak silinecek.</strong>
        <br /><br />
        Devam etmek için işletme adını yazın:
        <input 
          placeholder={business.name}
          className="mt-2 w-full border rounded px-2 py-1 text-sm"
        />
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>İptal</AlertDialogCancel>
      <AlertDialogAction className="bg-red-600 hover:bg-red-700" disabled={!confirmed}>
        Kalıcı Olarak Sil
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Uyarı seviyeleri:**
- 🟡 **Sarı uyarı:** Kategori içinde ürün varken silmeye çalışma
- 🔴 **Kırmızı onay:** İşletme silme, özellik silme (veri kaybı)

---

## 5. VERİ TABLOLARI

### 5.1 Tablo Tasarım Standartları
```typescript
// Tüm listeleme ekranlarında kullanılır
<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
  {/* Tablo Başlığı + Filtreler */}
  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <input placeholder="Ara..." className="..." />
      {/* Filtre butonları */}
    </div>
    <Button>+ Yeni Ekle</Button>
  </div>

  {/* Tablo */}
  <table className="w-full">
    <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
      <tr>
        <th className="px-6 py-3 text-left">İşletme Adı</th>
        {/* ... */}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-50">
      {rows.map(row => (
        <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
          {/* ... */}
        </tr>
      ))}
    </tbody>
  </table>

  {/* Boş durum */}
  {rows.length === 0 && <EmptyState />}
</div>
```

### 5.2 Boş Durum Bileşeni
```typescript
const EmptyState = ({ message, action }) => (
  <div className="text-center py-16 px-4">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Inbox className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">{message}</p>
    {action && <Button className="mt-4">{action.label}</Button>}
  </div>
);
```

### 5.3 Inline Toggle (Aktif/Pasif, Stok)
```typescript
// Tablo içinde single-click işlem
<Switch
  checked={product.is_active}
  onCheckedChange={(checked) => updateProductVisibility(product.id, checked)}
  className="data-[state=checked]:bg-green-500"
/>
```

---

## 6. GÖRSEL YÜKLEME UX

### 6.1 Sürükle-Bırak Yükleme Alanı
```typescript
// react-dropzone kullanılır
<div
  {...getRootProps()}
  className={cn(
    "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
    isDragActive 
      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" 
      : "border-gray-300 hover:border-gray-400"
  )}
>
  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
  <p className="text-sm text-gray-600">
    Görselleri sürükle bırak veya <span className="text-[var(--color-primary)] font-medium">tıkla seç</span>
  </p>
  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — Maks. 5MB</p>
</div>
```

### 6.2 Yükleme İlerleme Durumu
```typescript
// Her görsel için ayrı progress bar
{uploadingImages.map((img) => (
  <div key={img.id} className="relative">
    <img src={img.preview} className="w-20 h-20 object-cover rounded-lg opacity-50" />
    <div className="absolute inset-x-0 bottom-0 bg-gray-900/70 rounded-b-lg h-1">
      <div 
        className="bg-blue-500 h-full transition-all duration-300 rounded"
        style={{ width: `${img.progress}%` }}
      />
    </div>
  </div>
))}
```

### 6.3 Görsel Sıralama (Sürükle-Bırak)
```typescript
// @dnd-kit/sortable kullanılır
// Ana görsel: ilk sıradaki görsel — mor/mavi "Ana Görsel" rozeti
// Diğer görseller: X butonu ile silinebilir
// Sıra değişince API'ye anında PATCH isteği
```

---

## 7. SÜRÜKLE-BIRAK ÜRÜN SIRALAMA

```typescript
// @dnd-kit/core + @dnd-kit/sortable
// Her ürün satırının solunda grip ikonu
// Sürükleme sırasında "ghost" öğe gösterilir
// Bırakınca API'ye kaydet
<DndContext onDragEnd={handleDragEnd}>
  <SortableContext items={products.map(p => p.id)}>
    {products.map(product => (
      <SortableProductRow key={product.id} product={product} />
    ))}
  </SortableContext>
</DndContext>
```

---

## 8. İSTATİSTİK DASHBOARD TASARIMI

### 8.1 KPI Kart Tasarımı
```typescript
<div className="bg-white rounded-xl border border-gray-200 p-6">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <div className="p-2 bg-primary/10 rounded-lg">
      <Icon className="w-4 h-4 text-primary" />
    </div>
  </div>
  <p className="text-3xl font-bold text-gray-900">{value}</p>
  <p className={cn("text-xs mt-1 flex items-center gap-1", change > 0 ? "text-green-600" : "text-red-600")}>
    {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
    Geçen aya göre %{Math.abs(change)}
  </p>
</div>
```

### 8.2 Grafik Standartları (Recharts)
```typescript
// Ortak renk paleti
const CHART_COLORS = {
  primary: 'var(--color-primary)',
  secondary: '#94a3b8',
  success: '#22c55e',
  warning: '#f59e0b',
};

// Tooltip Türkçeleştir
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium text-gray-700 mb-1">{formatDate(label)}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{p.value.toLocaleString('tr-TR')}</strong>
        </p>
      ))}
    </div>
  );
};
```

### 8.3 Tarih Aralığı Seçici
```
[Bu Hafta] [Bu Ay] [Son 30 Gün] [Son 3 Ay]
```
Aktif buton: primary renk. Veri değişimi smooth fetch + loading state.

---

## 9. BLOG EDİTÖRÜ (Tiptap)

### 9.1 Toolbar Yapısı
```
[H2] [H3] | [B] [I] [U] | [Liste] [Sıralı Liste] | [Link] [Görsel] | [Temizle]
```

### 9.2 Editör Alan Stili
```typescript
// Tiptap editorContent wrapper
<div className="min-h-[400px] border border-gray-300 rounded-b-lg p-4
               prose max-w-none focus-within:border-primary
               focus-within:ring-2 focus-within:ring-primary/20">
  <EditorContent editor={editor} />
</div>
```

### 9.3 Taslak / Yayın UI
```typescript
// Sağ sidebar'da yayın kontrol paneli
<div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
  <div>
    <label className="text-sm font-medium">Durum</label>
    <Select value={status} onValueChange={setStatus}>
      <SelectItem value="draft">📝 Taslak</SelectItem>
      <SelectItem value="published">✅ Yayında</SelectItem>
    </Select>
  </div>
  
  {/* Zamanlanmış yayın — ileri tarih */}
  <div>
    <label className="text-sm font-medium">Yayın Tarihi</label>
    <DateTimePicker value={publishedAt} onChange={setPublishedAt} />
  </div>

  <Button className="w-full" type="submit">
    {status === 'published' ? 'Yayınla' : 'Taslak Kaydet'}
  </Button>
</div>
```

---

## 10. KATEGORİ VE ÖZELLİK YÖNETİMİ UX

### 10.1 Özellik Tipi Seçimi
```typescript
// Tip seçildiğinde dinamik olarak ek alanlar açılır
{type === 'number' && (
  <input placeholder="Birim (örn: kg, cm, yıl)" />
)}

{type === 'select' && (
  <div>
    <label>Seçenekler</label>
    {/* Tag input benzeri: Enter'a basınca seçenek eklenir */}
    <TagInput
      value={options}
      onChange={setOptions}
      placeholder="Seçenek yazın, Enter'a basın..."
    />
    {/* Eklenen seçenekler chip olarak gösterilir, X ile silinir */}
  </div>
)}
```

### 10.2 Çoklu Seçim (Multi-select) Özelliği
```typescript
// Özellik tipi select ise çoklu seçim toggle'ı
<div className="flex items-center gap-2">
  <Switch id="multi-select" checked={isMultiple} onCheckedChange={setIsMultiple} />
  <label htmlFor="multi-select" className="text-sm">
    Birden fazla değer seçilebilsin
    <span className="text-xs text-gray-400 ml-1">(örn: Beden: S, M, L)</span>
  </label>
</div>
```

### 10.3 Özellik Silme Uyarısı
```typescript
// Özellik silinmeden önce kaç üründe veri olduğu gösterilir
<AlertDialog>
  <AlertDialogDescription>
    <strong>"{attribute.name}"</strong> özelliğini silmek üzeresiniz.
    <br />
    Bu işlem <strong className="text-red-600">{affectedProductCount} üründeki</strong> bu 
    alanın tüm verilerini <strong>kalıcı olarak silecek.</strong>
  </AlertDialogDescription>
</AlertDialog>
```

---

## 11. SÜPER ADMİN — ÖZEL UX KURALLARI

### 11.1 Yedek Giriş (Impersonation)
```typescript
// İşletme listesinde her satırda "Giriş Yap" butonu
// Tıklanınca: sarı banner sayfanın üstünde kalır
<div className="bg-yellow-50 border-b border-yellow-200 px-6 py-2 flex items-center justify-between">
  <span className="text-yellow-800 text-sm font-medium">
    🔐 {businessName} adına giriş yapıldı — Tüm işlemler loglanıyor
  </span>
  <button onClick={exitImpersonation} className="text-yellow-800 text-xs underline">
    Kendi hesabıma dön
  </button>
</div>
```

### 11.2 Abonelik Uyarıları
```typescript
// Dashboard'da kırmızı uyarı kartı
{expiringBusinesses.length > 0 && (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
    <h3 className="text-red-800 font-semibold flex items-center gap-2">
      <AlertTriangle className="w-4 h-4" /> 
      {expiringBusinesses.length} İşletmenin Aboneliği 7 Gün İçinde Bitiyor
    </h3>
    <ul className="mt-2 space-y-1">
      {expiringBusinesses.map(b => (
        <li key={b.id} className="text-red-700 text-sm flex justify-between">
          <span>{b.name}</span>
          <span className="font-medium">{formatDate(b.subscription_end)}</span>
        </li>
      ))}
    </ul>
  </div>
)}
```

### 11.3 Renk Tema Seçici
```typescript
// 15 hazır palet: renk örneği + ad + sektör önerisi
<div className="grid grid-cols-5 gap-2">
  {PRESET_PALETTES.map(palette => (
    <button
      key={palette.id}
      onClick={() => selectPalette(palette)}
      className={cn(
        "rounded-lg p-2 border-2 transition-all",
        selected === palette.id ? "border-gray-900 scale-105" : "border-transparent"
      )}
    >
      <div 
        className="w-full h-8 rounded" 
        style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})` }}
      />
      <span className="text-xs text-gray-600 mt-1 block">{palette.name}</span>
    </button>
  ))}
</div>

{/* Veya özel hex */}
<input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)} />
```

---

## 12. GÜVENLİK UX

### 12.1 2FA Kurulum Akışı (Süper Admin)
```
Adım 1: QR kodu göster (otplib ile üretilen secret)
Adım 2: "Google Authenticator ile tara"
Adım 3: 6 haneli kodu gir ve doğrula
Adım 4: Yedek kodları göster ve kaydet uyarısı
```

### 12.2 Hesap Kilit Durumu
```typescript
// Giriş ekranında kilitli hesap gösterimi
{isLocked && (
  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700">
    🔒 Hesap {lockMinutesLeft} dakika kilitli. Çok fazla hatalı giriş denemesi.
  </div>
)}
```

### 12.3 Oturum Süresi Uyarısı
```typescript
// Access token bitiminden 15 dakika önce soft uyarı
<div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
  <p className="text-sm text-yellow-800">
    ⏰ Oturumunuz 15 dakika içinde sona erecek
  </p>
  <button onClick={refreshToken} className="mt-2 text-xs text-yellow-700 underline">
    Oturumu Uzat
  </button>
</div>
```

---

## KONTROL LİSTESİ — ADMIN PANEL

- [ ] Form validasyonu React Hook Form + Zod mi?
- [ ] Destructive işlemlerde onay diyalogu var mı?
- [ ] Toast bildirimleri eklendi mi?
- [ ] Boş durum (EmptyState) tasarlandı mı?
- [ ] Loading skeleton / spinner eklendi mi?
- [ ] Tablo satırları hover state'i var mı?
- [ ] Silme öncesi etkilenen veri sayısı gösteriliyor mu?
- [ ] Mobile menü hamburger toggle çalışıyor mu?
- [ ] Yedek giriş banner'ı eklendi mi?
- [ ] Abonelik uyarı kartları mevcut mu?
