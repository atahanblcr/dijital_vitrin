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

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const { categoryId } = req.query;
    
    const business = await prisma.business.findUnique({ where: { slug } });
    if (!business) throw new AppError(404, 'İşletme bulunamadı');

    const products = await prisma.product.findMany({
      where: { 
        business_id: business.id, 
        is_active: true,
        ...(categoryId ? { category_id: String(categoryId) } : {})
      },
      include: {
        images: { orderBy: { sort_order: 'asc' } },
        category: true
      },
      orderBy: { created_at: 'desc' }
    });

    res.json({ data: products });
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
        },
        attr_multi_values: {
          include: {
            attribute: true,
            option: true
          }
        }
      }
    });

    if (!product) throw new AppError(404, 'Ürün bulunamadı');

    console.log(`[DEBUG] Fetched product ${product.id} with ${product.attr_values.length} flat values and ${product.attr_multi_values.length} multi values`);

    // Özellikleri tek bir listede birleştirelim
    const combinedMap: Record<string, string> = {};

    // 1. Tekli değerler
    (product.attr_values || []).forEach((av: any) => {
      const val = av.value_text || av.value_number || av.option?.value;
      if (val !== undefined && val !== null) {
        combinedMap[av.attribute.name] = String(val);
      }
    });

    // 2. Çoklu değerler (Renk vb.)
    (product.attr_multi_values || []).forEach((amv: any) => {
      const attrName = amv.attribute.name;
      const optVal = amv.option.value;
      if (combinedMap[attrName]) {
        combinedMap[attrName] += `, ${optVal}`;
      } else {
        combinedMap[attrName] = optVal;
      }
    });

    const attributes = Object.entries(combinedMap).map(([name, value]) => ({ name, value }));

    res.json({ 
      data: {
        product,
        attributes
      } 
    });
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

export const getBlogPostBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug, blogSlug } = req.params;
    const business = await prisma.business.findUnique({ where: { slug } });
    if (!business) throw new AppError(404, 'İşletme bulunamadı');

    const blog = await prisma.blogPost.findFirst({
      where: { 
        business_id: business.id, 
        slug: blogSlug,
        status: 'published' 
      }
    });

    if (!blog) throw new AppError(404, 'Blog yazısı bulunamadı');

    res.json({ data: { blog } });
  } catch (error) {
    next(error);
  }
};
