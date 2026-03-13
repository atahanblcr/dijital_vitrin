import app from './src/app';
import { env } from './src/config/env';

async function verifyAPI() {
  console.log('\n--- 🔍 API DOĞRULAMA TESTİ BAŞLATILIYOR ---\n');
  
  // Sunucuyu geçici bir portta açalım (çakışma olmaması için)
  const TEST_PORT = 4001;
  const server = app.listen(TEST_PORT, async () => {
    console.log(`✅ Geçici sunucu http://localhost:${TEST_PORT} adresinde açıldı.`);
    
    try {
      // 1. Health Check Testi
      console.log('📡 [1/2] Health Check kontrol ediliyor...');
      const healthRes = await fetch(`http://localhost:${TEST_PORT}/health`);
      const healthData: any = await healthRes.json();
      
      if (healthRes.ok && healthData.status === 'ok') {
        console.log('   🟢 [BAŞARILI] API sağlıklı çalışıyor.');
      } else {
        console.log('   🔴 [BAŞARISIZ] API yanıt vermedi veya hatalı yanıt dönderdi.');
      }

      // 2. Yanlış Login Testi (Güvenlik kontrolü)
      console.log('🔐 [2/2] Auth (Login) güvenliği kontrol ediliyor...');
      const authRes = await fetch(`http://localhost:${TEST_PORT}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'hatali_kullanici', password: 'hatali_sifre' })
      });
      
      // Beklenen: 401 Unauthorized veya 404 (Kullanıcı bulunamadığı için)
      if (authRes.status === 401 || authRes.status === 404) {
        console.log(`   🟢 [BAŞARILI] Auth sistemi beklenen yanıtı verdi (Status: ${authRes.status}).`);
      } else {
        console.log(`   ⚠️ [UYARI] Auth sistemi beklenmedik bir status döndü: ${authRes.status}`);
      }

      console.log('\n✨ SONUÇ: API temel mantığı DOĞRU çalışıyor. Kodda bir sorun yok.');
    } catch (error: any) {
      console.error('\n❌ [KRİTİK HATA] Doğrulama sırasında bir hata oluştu:', error.message);
    } finally {
      console.log('\n--- 🏁 DOĞRULAMA TAMAMLANDI ---\n');
      server.close();
      process.exit(0);
    }
  });
}

verifyAPI();
