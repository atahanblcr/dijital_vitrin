import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';

describe('Storefront API - Filtering & Products', () => {
  let businessId: string;
  let categoryId1: string;
  let categoryId2: string;
  const businessSlug = 'test-isletme-filtering';

  beforeAll(async () => {
    // Test verisi hazırlığı
    // Temizlik
    await prisma.product.deleteMany({ where: { business: { slug: businessSlug } } });
    await prisma.category.deleteMany({ where: { business: { slug: businessSlug } } });
    await prisma.business.deleteMany({ where: { slug: businessSlug } });

    const business = await prisma.business.create({
      data: {
        name: 'Test Filtreleme İşletmesi',
        slug: businessSlug,
        sector: 'elektronik',
        whatsapp: '+905000000000',
        theme_primary: '#000000',
        theme_accent: '#ffffff',
        subscription_end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        subscription_plan: 'monthly',
      }
    });
    businessId = business.id;

    const cat1 = await prisma.category.create({
      data: { name: 'Kategori 1', business_id: businessId }
    });
    categoryId1 = cat1.id;

    const cat2 = await prisma.category.create({
      data: { name: 'Kategori 2', business_id: businessId }
    });
    categoryId2 = cat2.id;

    // Ürünler ekle
    await prisma.product.create({
      data: {
        name: 'Ürün 1 (Cat 1)',
        slug: 'urun-1-cat-1',
        business_id: businessId,
        category_id: categoryId1,
        is_active: true,
        in_stock: true
      }
    });

    await prisma.product.create({
      data: {
        name: 'Ürün 2 (Cat 2)',
        slug: 'urun-2-cat-2',
        business_id: businessId,
        category_id: categoryId2,
        is_active: true,
        in_stock: true
      }
    });
  });

  it('Tüm ürünleri listeleyebilmeli', async () => {
    const res = await request(app).get(`/api/storefront/${businessSlug}/products`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('Kategoriye göre filtreleme yapabilmeli (Server-Side)', async () => {
    const res = await request(app)
      .get(`/api/storefront/${businessSlug}/products`)
      .query({ categoryId: categoryId1 });
    
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].category_id).toBe(categoryId1);
    expect(res.body.data[0].name).toContain('Cat 1');
  });

  it('Geçersiz kategori ID gönderildiğinde boş liste dönmeli', async () => {
    const res = await request(app)
      .get(`/api/storefront/${businessSlug}/products`)
      .query({ categoryId: '00000000-0000-0000-0000-000000000000' });
    
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it('İşletme bulunamadığında 404 dönmeli', async () => {
    const res = await request(app).get('/api/storefront/olmayan-isletme/products');
    expect(res.status).toBe(404);
  });
});
