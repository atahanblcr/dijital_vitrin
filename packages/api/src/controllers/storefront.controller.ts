import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getBusinessBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    
    const business = await prisma.business.findUnique({
      where: { slug },
      include: {
        hours: true,
      }
    });

    if (!business) {
      return res.status(404).json({ error: 'İşletme bulunamadı' });
    }

    // Ürünleri ve kategorileri de çekelim (Anasayfa için)
    const products = await prisma.product.findMany({
      where: { business_id: business.id, is_active: true },
      include: {
        images: { orderBy: { sort_order: 'asc' } },
        category: true
      },
      orderBy: { created_at: 'desc' }
    });

    const categories = await prisma.category.findMany({
      where: { business_id: business.id },
      include: { _count: { select: { products: true } } }
    });

    res.json({
      business,
      products,
      categories
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug, productSlug } = req.params;
    
    const business = await prisma.business.findUnique({ where: { slug } });
    if (!business) throw new AppError(404, 'İşletme bulunamadı');

    const product = await prisma.product.findFirst({
      where: { 
        business_id: business.id,
        slug: productSlug,
        is_active: true 
      },
      include: {
        images: { orderBy: { sort_order: 'asc' } },
        category: {
          include: {
            attributes: {
              include: { options: true }
            }
          }
        },
        attr_values: {
          include: {
            attribute: true,
            option: true
          }
        }
      }
    });

    if (!product) throw new AppError(404, 'Ürün bulunamadı');

    res.json({ data: product });
  } catch (error) {
    next(error);
  }
};

export const getBlogsBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const business = await prisma.business.findUnique({ where: { slug } });
    if (!business) throw new AppError(404, 'İşletme bulunamadı');

    const blogs = await prisma.blogPost.findMany({
      where: { business_id: business.id, status: 'published' },
      orderBy: { published_at: 'desc' }
    });

    res.json({ data: blogs });
  } catch (error) {
    next(error);
  }
};
