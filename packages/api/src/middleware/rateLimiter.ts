import rateLimit from 'express-rate-limit';

// Global limit: Tüm endpointler için saniyede 30 istek (SKILL referansı)
export const globalRateLimiter = rateLimit({
  windowMs: 1000, // 1 saniye
  max: 30,
  message: { error: 'Çok fazla istek gönderildi. Lütfen bekleyin.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin limit: Dakikada 60 istek
export const adminRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 dakika
  max: 60,
  message: { error: 'Admin işlem sınırı aşıldı. Lütfen bekleyin.' },
});

// Login limit: Brute force koruması (15 dakikada 5 başarısız istekte kilitlenmesi service katmanında da kontrol edilecek, burada genel API sınırını çiziyoruz)
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 10,
  skipSuccessfulRequests: true,
  message: { error: 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.' },
});
