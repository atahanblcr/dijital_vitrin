import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    if (!businessId) throw new AppError(403, 'İşletme bilgisi bulunamadı');

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        hours: true,
      }
    });

    if (!business) throw new AppError(404, 'İşletme bulunamadı');

    res.json({ data: business });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    if (!businessId) throw new AppError(403, 'İşletme bilgisi bulunamadı');

    // Sadece işletme admininin güncelleyebileceği alanlar
    const { 
      product_sort_mode, 
      theme_preset, 
      theme_primary, 
      theme_accent, 
      slogan, 
      about_text,
      instagram_url,
      facebook_url,
      tiktok_url,
      maps_url
    } = req.body;

    const updated = await prisma.business.update({
      where: { id: businessId },
      data: {
        product_sort_mode,
        theme_preset,
        theme_primary,
        theme_accent,
        slogan,
        about_text,
        instagram_url,
        facebook_url,
        tiktok_url,
        maps_url
      }
    });

    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};
