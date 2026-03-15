import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Security API - CORS & Auth', () => {
  const originalEnv = process.env;

  beforeAll(() => {
    // Çevre değişkenlerini test için manipüle et
    process.env.ALLOWED_ORIGINS = 'http://guvenli-site.com,http://localhost:3000';
    process.env.NODE_ENV = 'production';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('CORS Politika Testleri', () => {
    it('İzin verilen origin (guvenli-site.com) için erişim sağlamalı', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'http://guvenli-site.com');
      
      expect(res.headers['access-control-allow-origin']).toBe('http://guvenli-site.com');
    });

    it('Yabancı bir origin (kotu-site.com) için erişimi engellemeli', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'http://kotu-site.com');
      
      // CORS middleware'imiz eğer origin izinli değilse genelde header dönmez veya hata verir
      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });

    it('Postman gibi origin göndermeyen isteklere izin vermeli', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
    });
  });

  describe('Yetkilendirme (401) Testleri', () => {
    it('Geçersiz token ile korunan bir rotaya girildiğinde 401 dönmeli', async () => {
      const res = await request(app)
        .get('/api/business/products')
        .set('Authorization', 'Bearer gecersiz-token-123');
      
      expect(res.status).toBe(401);
    });

    it('Token gönderilmediğinde korunan bir rotaya girildiğinde 401 dönmeli', async () => {
      const res = await request(app).get('/api/business/products');
      expect(res.status).toBe(401);
    });
  });
});
