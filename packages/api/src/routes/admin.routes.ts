import { Router } from 'express';
import { authenticate, requireSuperAdmin } from '../middleware/auth';
import { prisma } from '../config/database';
import { createBusinessSchema, updateBusinessSchema } from '../validators/admin.validator';
import { hashPassword } from '../utils/password';
import { UserRole } from '@prisma/client';
import { generateAccessToken } from '../utils/jwt';

const router = Router();

// Bütün admin rotaları için süper admin yetkisi gerekir
router.use(authenticate, requireSuperAdmin);

// İşletmeleri listele
router.get('/businesses', async (req, res, next) => {
  try {
    const businesses = await prisma.business.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json({ data: businesses });
  } catch (error) {
    next(error);
  }
});

// Yeni işletme ekle (Business + Admin User)
router.post('/businesses', async (req, res, next) => {
  try {
    const validatedData = await createBusinessSchema.parseAsync(req.body);

    // Slug ve Kullanıcı adı çakışma kontrolü
    const existingBiz = await prisma.business.findUnique({ where: { slug: validatedData.slug } });
    if (existingBiz) return res.status(400).json({ error: 'Bu subdomain zaten kullanımda' });

    const existingUser = await prisma.user.findUnique({ where: { username: validatedData.username } });
    if (existingUser) return res.status(400).json({ error: 'Bu kullanıcı adı zaten alınmış' });

    // Veritabanı işlemi (Transaction)
    const result = await prisma.$transaction(async (tx) => {
      // 1. İşletme oluştur
      const business = await tx.business.create({
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          sector: validatedData.sector,
          whatsapp: validatedData.whatsapp,
          subscription_plan: validatedData.subscription_plan,
          subscription_end: new Date(validatedData.subscription_end),
          theme_primary: '#2563eb', // Varsayılan renkler
          theme_accent: '#3b82f6',
          is_active: true
        }
      });

      // 2. Admin kullanıcısı oluştur
      const hashedPassword = await hashPassword(validatedData.password);
      await tx.user.create({
        data: {
          username: validatedData.username,
          password_hash: hashedPassword,
          role: UserRole.business_admin,
          business_id: business.id
        }
      });

      // 3. Varsayılan Kategorileri Ekle (Sektöre göre)
      const defaultCategories: Record<string, string[]> = {
        'butik': ['Kadın Giyim', 'Erkek Giyim', 'Aksesuar'],
        'elektronik': ['Telefon', 'Bilgisayar', 'Aksesuar'],
        'aksesuar': ['Takı', 'Çanta', 'Saat'],
        'el_isi': ['Örgü', 'Ahşap', 'Seramik'],
        'oto_galeri': ['Binek Araç', 'SUV', 'Yedek Parça']
      };

      const categories = defaultCategories[validatedData.sector] || ['Genel'];
      
      for (const catName of categories) {
        await tx.category.create({
          data: {
            name: catName,
            business_id: business.id
          }
        });
      }

      return business;
    });

    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
});

// İşletme güncelle
router.put('/businesses/:id', async (req, res, next) => {
  try {
    const validatedData = await updateBusinessSchema.parseAsync(req.body);
    const { id } = req.params;

    const business = await prisma.business.update({
      where: { id },
      data: {
        ...validatedData,
        subscription_end: validatedData.subscription_end ? new Date(validatedData.subscription_end) : undefined
      }
    });

    res.json({ data: business });
  } catch (error) {
    next(error);
  }
});

// İşletme aktif/pasif durumu değiştir
router.patch('/businesses/:id/toggle', async (req, res, next) => {
  try {
    const { id } = req.params;
    const current = await prisma.business.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: 'İşletme bulunamadı' });

    const updated = await prisma.business.update({
      where: { id },
      data: { is_active: !current.is_active }
    });

    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
});

// İşletme sil (Cascading delete Prisma schema'da tanımlı olduğu için tüm verileri gider)
router.delete('/businesses/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.business.delete({ where: { id } });
    res.json({ message: 'İşletme başarıyla silindi' });
  } catch (error) {
    next(error);
  }
});

// Sistem ayarlarını getir
router.get('/settings', async (req, res, next) => {
  try {
    let settings = await prisma.systemSettings.findUnique({ where: { id: 'singleton' } });
    if (!settings) {
      settings = await prisma.systemSettings.create({ data: { id: 'singleton' } });
    }
    res.json({ data: settings });
  } catch (error) {
    next(error);
  }
});

// Sistem ayarlarını güncelle
router.put('/settings', async (req, res, next) => {
  try {
    const { default_max_images, max_file_size_mb, global_announcement, maintenance_mode } = req.body;
    const settings = await prisma.systemSettings.upsert({
      where: { id: 'singleton' },
      update: { default_max_images, max_file_size_mb, global_announcement, maintenance_mode },
      create: { id: 'singleton', default_max_images, max_file_size_mb, global_announcement, maintenance_mode }
    });
    res.json({ data: settings });
  } catch (error) {
    next(error);
  }
});

// İşletme Paneline Yedek Giriş (Impersonate)
router.post('/businesses/:id/impersonate', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // İşletmeye ait ilk admin kullanıcısını bul
    const businessUser = await prisma.user.findFirst({
      where: { business_id: id, role: UserRole.business_admin }
    });

    if (!businessUser) {
      return res.status(404).json({ error: 'İşletmeye ait admin hesabı bulunamadı' });
    }

    // O kullanıcı adına token üret
    const token = generateAccessToken({
      id: businessUser.id,
      username: businessUser.username,
      role: 'business_admin',
      business_id: businessUser.business_id
    });

    // Loglama yapılabilir (Tasarım dokümanı zorunluluğu)
    console.log(`[LOG] Super Admin (${req.user?.username}), ${id} ID'li işletmeye yedek giriş yaptı.`);

    res.json({ data: { token } });
  } catch (error) {
    next(error);
  }
});

export default router;
