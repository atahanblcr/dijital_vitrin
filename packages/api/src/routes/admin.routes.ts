import { Router } from 'express';
import { authenticate, requireSuperAdmin } from '../middleware/auth';
import { prisma } from '../config/database';

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

export default router;
