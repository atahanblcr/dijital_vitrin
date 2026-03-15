import { test, expect } from '@playwright/test';

test.describe('Dizital Vitrin - Happy Path', () => {
  const timestamp = Date.now();
  const businessName = `Butik ${timestamp}`;
  const businessSlug = `butik-${timestamp}`;
  const productName = `Urun ${timestamp}`;


  test('Süper Admin işletme oluşturmalı, İşletme Admin ürün eklemeli ve Vitrin göstermeli', async ({ page }) => {
    // 1. Süper Admin Girişi ve İşletme Oluşturma
    await page.goto('http://localhost:3002/login');
    await page.waitForSelector('input[name="username"]');
    await page.fill('input[name="username"]', 'superadmin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');
    
    // Yönlendirmeyi bekle (Daha uzun süre verelim)
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/.*dashboard/);
    await page.click('text=İşletmeler');
    await page.click('text=Yeni İşletme Ekle');
    
    await page.fill('input[placeholder="Örn: Ahmet Butik"]', businessName);
    await page.fill('input[placeholder="ahmet-butik"]', businessSlug);
    await page.selectOption('select', 'butik');
    const adminUsername = `admin${timestamp}`;
    await page.fill('input[placeholder="+905..."]', '905000000000');
    await page.fill('input[placeholder="admin_ahmet"]', adminUsername);
    await page.fill('input[placeholder="********"]', 'Admin123!');
    
    await page.click('button:has-text("İşletmeyi Kaydet ve Başlat")');
    await expect(page.locator('text=' + businessName)).toBeVisible({ timeout: 15000 });

    // 2. İşletme Admin Girişi ve Ürün Ekleme
    const adminPage = await page.context().newPage();
    await adminPage.goto('http://localhost:3001/login');
    await adminPage.fill('input[name="username"]', adminUsername);
    await adminPage.fill('input[name="password"]', 'Admin123!');
    await adminPage.click('button[type="submit"]');
    
    await expect(adminPage).toHaveURL(/.*dashboard/);
    
    // Ürün ekleme sayfasına git (Sol menüden)
    await adminPage.click('text=Ürün Yönetimi');
    await adminPage.click('text=Yeni Ürün Ekle');
    
    await adminPage.fill('input[name="name"]', productName);
    // Kategori seçimi
    await adminPage.selectOption('select[name="category_id"]', { index: 1 }); 
    
    await adminPage.click('button:has-text("Ürünü Kaydet ve Yayınla")');
    await expect(adminPage.locator('text=' + productName)).toBeVisible({ timeout: 10000 });

    // 3. Vitrin Kontrolü
    const storefrontPage = await page.context().newPage();
    await storefrontPage.goto(`http://localhost:3000/${businessSlug}`, { waitUntil: 'domcontentloaded' });
    
    // İşletme adını ve Ürünün varlığını kontrol et
    // Timeout süresini artırıyoruz çünkü ilk render SSR nedeniyle vakit alabilir
    await expect(storefrontPage.locator('h1').first()).toContainText(businessName, { timeout: 30000 });
    await expect(storefrontPage.locator(`text=${productName}`).first()).toBeVisible({ timeout: 20000 });
    
    console.log('✅ E2E Happy Path: Super Admin -> Admin Panel -> Storefront akışı başarıyla doğrulandı.');
  });
});
