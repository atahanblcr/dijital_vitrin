import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

// ─── KATEGORİ YÖNETİMİ ──────────────────────────────────────────────

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    if (!businessId) throw new AppError(403, 'İşletme bilgisi bulunamadı');

    const categories = await prisma.category.findMany({
      where: { business_id: businessId },
      orderBy: { sort_order: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    res.json({ data: categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    if (!businessId) throw new AppError(403, 'İşletme bilgisi bulunamadı');

    const { name, sort_order } = req.body;

    const newCategory = await prisma.category.create({
      data: {
        business_id: businessId,
        name,
        sort_order,
      },
    });

    res.status(201).json({ data: newCategory });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category || category.business_id !== businessId) {
      throw new AppError(404, 'Kategori bulunamadı');
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: req.body,
    });

    res.json({ data: updatedCategory });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category || category.business_id !== businessId) {
      throw new AppError(404, 'Kategori bulunamadı');
    }

    if (category._count.products > 0) {
      throw new AppError(400, 'Bu kategoriye ait ürünler var. Lütfen önce ürünleri başka kategoriye taşıyın.');
    }

    await prisma.category.delete({ where: { id } });

    res.json({ data: { message: 'Kategori başarıyla silindi' } });
  } catch (error) {
    next(error);
  }
};

// ─── KATEGORİ ÖZELLİKLERİ YÖNETİMİ ──────────────────────────────────

export const getAttributes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    // Kategori işletmeye mi ait doğrula
    const category = await prisma.category.findFirst({
      where: { id, business_id: businessId }
    });
    if (!category) throw new AppError(404, 'Kategori bulunamadı');

    const attributes = await prisma.categoryAttribute.findMany({
      where: { category_id: id },
      orderBy: { sort_order: 'asc' },
      include: { options: { orderBy: { sort_order: 'asc' } } },
    });

    res.json({ data: attributes });
  } catch (error) {
    next(error);
  }
};

export const createAttribute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id: category_id } = req.params;
    const { name, type, unit, is_required, is_multiple, sort_order } = req.body;

    const category = await prisma.category.findFirst({
      where: { id: category_id, business_id: businessId }
    });
    if (!category) throw new AppError(404, 'Kategori bulunamadı');

    const attribute = await prisma.categoryAttribute.create({
      data: {
        category_id,
        name,
        type,
        unit,
        is_required,
        is_multiple,
        sort_order,
      },
      include: { options: true }
    });

    res.status(201).json({ data: attribute });
  } catch (error) {
    next(error);
  }
};

export const updateAttribute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id: category_id, attrId } = req.params;

    const attribute = await prisma.categoryAttribute.findFirst({
      where: { 
        id: attrId, 
        category_id, 
        category: { business_id: businessId } 
      },
    });

    if (!attribute) throw new AppError(404, 'Özellik bulunamadı');

    const updatedAttr = await prisma.categoryAttribute.update({
      where: { id: attrId },
      data: req.body,
    });

    res.json({ data: updatedAttr });
  } catch (error) {
    next(error);
  }
};

export const deleteAttribute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id: category_id, attrId } = req.params;

    const attribute = await prisma.categoryAttribute.findFirst({
      where: { 
        id: attrId, 
        category_id, 
        category: { business_id: businessId } 
      },
    });

    if (!attribute) throw new AppError(404, 'Özellik bulunamadı');

    await prisma.categoryAttribute.delete({ where: { id: attrId } });

    res.json({ data: { message: 'Özellik kalıcı olarak silindi' } });
  } catch (error) {
    next(error);
  }
};

// ─── ÖZELLİK SEÇENEKLERİ (OPTIONS) YÖNETİMİ ──────────────────────────

export const createOption = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id: category_id, attrId } = req.params;
    const { value, sort_order } = req.body;

    const attribute = await prisma.categoryAttribute.findFirst({
      where: { 
        id: attrId, 
        category_id, 
        type: 'select',
        category: { business_id: businessId } 
      },
    });

    if (!attribute) throw new AppError(404, 'Seçim tipinde geçerli bir özellik bulunamadı');

    const option = await prisma.attributeOption.create({
      data: {
        attribute_id: attrId,
        value,
        sort_order,
      }
    });

    res.status(201).json({ data: option });
  } catch (error) {
    next(error);
  }
};

export const deleteOption = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id: category_id, attrId, optId } = req.params;

    const option = await prisma.attributeOption.findFirst({
      where: { 
        id: optId, 
        attribute_id: attrId,
        attribute: {
          category_id,
          category: { business_id: businessId }
        }
      },
    });

    if (!option) throw new AppError(404, 'Seçenek bulunamadı');

    await prisma.attributeOption.delete({ where: { id: optId } });

    res.json({ data: { message: 'Seçenek silindi' } });
  } catch (error) {
    next(error);
  }
};
