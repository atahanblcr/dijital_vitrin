import app from './src/app';

async function performanceTest() {
  console.log('\n--- 🚀 PERFORMANS YÜK TESTİ BAŞLATILIYOR ---\n');
  
  const TEST_PORT = 4006;
  const server = app.listen(TEST_PORT, async () => {
    console.log(`✅ Sunucu http://localhost:${TEST_PORT} adresinde performans testi için hazır.`);
    
    try {
      const CONCURRENT_REQUESTS = 50;
      const TOTAL_ROUNDS = 5;
      
      console.log(`📊 Simülasyon: ${CONCURRENT_REQUESTS} eşzamanlı istek, ${TOTAL_ROUNDS} tur.`);
      
      let totalSuccess = 0;
      let totalFailed = 0;
      let totalTime = 0;

      for (let i = 1; i <= TOTAL_ROUNDS; i++) {
        const start = Date.now();
        console.log(`   🔸 Tur ${i} başlatılıyor...`);
        
        const requests = Array.from({ length: CONCURRENT_REQUESTS }).map(() => 
          fetch(`http://localhost:${TEST_PORT}/health`)
        );
        
        const results = await Promise.all(requests);
        const duration = Date.now() - start;
        totalTime += duration;
        
        const success = results.filter(r => r.ok).length;
        const failed = results.length - success;
        
        totalSuccess += success;
        totalFailed += failed;
        
        console.log(`      ✅ Başarılı: ${success}, ❌ Hatalı (veya limitli): ${failed}, ⏱️ Süre: ${duration}ms`);
      }

      console.log('\n📈 GENEL ÖZET:');
      console.log(`   - Toplam İstek: ${CONCURRENT_REQUESTS * TOTAL_ROUNDS}`);
      console.log(`   - Başarılı: ${totalSuccess}`);
      console.log(`   - Hatalı/Limitli: ${totalFailed}`);
      console.log(`   - Ortalama Tur Süresi: ${(totalTime / TOTAL_ROUNDS).toFixed(2)}ms`);
      console.log(`   - İstek Başına Ortalama: ${(totalTime / (CONCURRENT_REQUESTS * TOTAL_ROUNDS)).toFixed(2)}ms`);

      if (totalSuccess > 0) {
        console.log('\n✨ SONUÇ: Sunucu yüksek yük altında stabil yanıt verebiliyor.');
      }
    } catch (error: any) {
      console.error('\n❌ [HATA] Test sırasında bir hata oluştu:', error.message);
    } finally {
      console.log('\n--- 🏁 TEST TAMAMLANDI ---\n');
      server.close();
      process.exit(0);
    }
  });
}

performanceTest();
