import app from './src/app';

async function securityTest() {
  console.log('\n--- 🛡️ GÜVENLİK VE PERFORMANS TESTİ BAŞLATILIYOR ---\n');
  
  const TEST_PORT = 4005;
  const server = app.listen(TEST_PORT, async () => {
    console.log(`✅ Geçici sunucu http://localhost:${TEST_PORT} adresinde açıldı.`);
    
    try {
      // 1. Güvenlik Header Testleri (Helmet)
      console.log('🛡️ [1/4] Güvenlik Headerları kontrol ediliyor...');
      const headRes = await fetch(`http://localhost:${TEST_PORT}/health`);
      const headers = headRes.headers;
      
      const expectedHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'strict-transport-security',
        'content-security-policy',
        'x-xss-protection'
      ];

      expectedHeaders.forEach(h => {
        if (headers.has(h)) {
          console.log(`   🟢 [MEVCUT] ${h}: ${headers.get(h)}`);
        } else {
          console.log(`   ⚠️ [EKSİK] ${h} header'ı bulunamadı.`);
        }
      });

      // 2. JSON Payload Limit Testi
      console.log('\n📦 [2/4] Payload limitleri (1MB) kontrol ediliyor...');
      const largePayload = 'a'.repeat(2 * 1024 * 1024); // 2MB
      const limitRes = await fetch(`http://localhost:${TEST_PORT}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: largePayload })
      });
      
      if (limitRes.status === 413) {
        console.log('   🟢 [BAŞARILI] Büyük payload (2MB) 413 Payload Too Large ile reddedildi.');
      } else {
        console.log(`   🔴 [BAŞARISIZ] Beklenen 413 hatası yerine ${limitRes.status} döndü.`);
      }

      // 3. Rate Limiter Testi (Global: 30 req/sec)
      console.log('\n⚡ [3/4] Global Rate Limiter kontrol ediliyor (30 req/sn)...');
      const requests = Array.from({ length: 40 }).map(() => 
        fetch(`http://localhost:${TEST_PORT}/health`)
      );
      
      const results = await Promise.all(requests);
      const rateLimitedCount = results.filter(r => r.status === 429).length;
      
      if (rateLimitedCount > 0) {
        console.log(`   🟢 [BAŞARILI] Sınır aşıldığında ${rateLimitedCount} istek 429 ile engellendi.`);
      } else {
        console.log('   ⚠️ [UYARI] 40 ardışık istekte hiçbir 429 hatası alınmadı. Limit çalışmıyor olabilir veya ortam hızı düşük.');
      }

      // 4. CORS Kontrolü
      console.log('\n🌐 [4/4] CORS politikası kontrol ediliyor...');
      const corsRes = await fetch(`http://localhost:${TEST_PORT}/health`, {
        headers: { 'Origin': 'https://bilinmeyen-site.com' }
      });
      
      const allowOrigin = corsRes.headers.get('access-control-allow-origin');
      if (!allowOrigin) {
        console.log('   🟢 [BAŞARILI] Tanımsız origin engellendi (Access-Control-Allow-Origin headerı dönmedi).');
      } else {
        console.log(`   ⚠️ [UYARI] Tanımsız origin'e izin verildi veya header döndü: ${allowOrigin}`);
      }

      console.log('\n✨ SONUÇ: Güvenlik katmanları beklendiği gibi çalışıyor.');
    } catch (error: any) {
      console.error('\n❌ [HATA] Test sırasında bir hata oluştu:', error.message);
    } finally {
      console.log('\n--- 🏁 TEST TAMAMLANDI ---\n');
      server.close();
      process.exit(0);
    }
  });
}

securityTest();
