import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { createUniqueSlug } from '../services/slug.service';
import { uploadImage, deleteImage } from '../services/image.service';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    if (!businessId) throw new AppError(403, 'İşletme bilgisi bulunamadı');

    const products = await prisma.product.findMany({
      where: { business_id: businessId },
      orderBy: { sort_order: 'asc' },
      include: {
        category: { select: { id: true, name: true } },
        images: { orderBy: { sort_order: 'asc' } },
        attr_values: {
          include: { attribute: true, option: true }
        },
        attr_multi_values: {
          include: { attribute: true, option: true }
        }
      }
    });

    res.json({ data: products });
  } catch (error) {
    next(error);
  }
};

// Ortak özellik kaydetme fonksiyonu
async function saveProductAttributes(tx: any, productId: string, attributes: any[]) {
  if (!attributes || attributes.length === 0) return;

  console.log(`[DEBUG] Saving attributes for product ${productId}:`, JSON.stringify(attributes, null, 2));

  for (const attr of attributes) {
    const defAttr = await tx.categoryAttribute.findUnique({ where: { id: attr.attribute_id } });
    if (!defAttr) continue;

    if (defAttr.type === 'select' && defAttr.is_multiple && attr.multi_option_ids) {
      // Çoklu seçim (Multi-select)
      const multiData = attr.multi_option_ids.map((optId: string) => ({
        product_id: productId,
        attribute_id: attr.attribute_id,
        option_id: optId,
      }));
      if (multiData.length > 0) {
        await tx.productAttributeMultiValue.createMany({ data: multiData });
      }
    } else {
      // Tekli değer (Text, Number, Single-select)
      await tx.productAttributeValue.create({
        data: {
          product_id: productId,
          attribute_id: attr.attribute_id,
          value_text: attr.value_text,
          value_number: attr.value_number,
          value_option_id: attr.value_option_id,
        }
      });
    }
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    if (!businessId) throw new AppError(403, 'İşletme bilgisi bulunamadı');

    const { name, category_id, short_desc, long_desc, is_campaign, in_stock, is_active, attributes } = req.body;

    const category = await prisma.category.findFirst({ where: { id: category_id, business_id: businessId } });
    if (!category) throw new AppError(404, 'Kategori bulunamadı');

    const slug = await createUniqueSlug(name, businessId);

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          business_id: businessId,
          category_id,
          name,
          slug,
          short_desc,
          long_desc,
          is_campaign,
          in_stock,
          is_active,
        }
      });

      await saveProductAttributes(tx, product.id, attributes);
      return product;
    });

    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id } = req.params;
    const { name, category_id, short_desc, long_desc, is_campaign, in_stock, is_active, attributes } = req.body;

    const existingProduct = await prisma.product.findFirst({ where: { id, business_id: businessId } });
    if (!existingProduct) throw new AppError(404, 'Ürün bulunamadı');

    const category = await prisma.category.findFirst({ where: { id: category_id, business_id: businessId } });
    if (!category) throw new AppError(404, 'Kategori bulunamadı');

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data: {
          category_id,
          name,
          short_desc,
          long_desc,
          is_campaign,
          in_stock,
          is_active,
        }
      });

      // Eski özellikleri sil
      await tx.productAttributeValue.deleteMany({ where: { product_id: id } });
      await tx.productAttributeMultiValue.deleteMany({ where: { product_id: id } });

      // Yeni özellikleri kaydet
      await saveProductAttributes(tx, id, attributes);
      
      return product;
    });

    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: { id, business_id: businessId },
      include: { images: true }
    });

    if (!product) throw new AppError(404, 'Ürün bulunamadı');

    for (const image of product.images) {
      if (image.public_id) {
        await deleteImage(image.public_id);
      }
    }

    await prisma.product.delete({ where: { id } });

    res.json({ data: { message: 'Ürün ve tüm görselleri başarıyla silindi' } });
  } catch (error) {
    next(error);
  }
};

export const updateSortOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { orders } = req.body;

    if (!orders || !Array.isArray(orders)) throw new AppError(400, 'Geçersiz veri formatı');

    await prisma.$transaction(
      orders.map(item => 
        prisma.product.update({
          where: { id: item.id, business_id: businessId },
          data: { sort_order: item.sort_order }
        })
      )
    );

    res.json({ data: { message: 'Sıralama başarıyla kaydedildi' } });
  } catch (error) {
    next(error);
  }
};

export const uploadProductImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    if (!businessId) throw new AppError(403, 'Yetki yok');

    const product = await prisma.product.findFirst({
      where: { id, business_id: businessId },
      include: { images: true }
    });

    if (!product) throw new AppError(404, 'Ürün bulunamadı');

    const business = await prisma.business.findUnique({ where: { id: businessId } });
    const maxImages = business?.max_images_per_product || 7;

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) throw new AppError(400, 'Görsel seçilmedi');

    if (product.images.length + files.length > maxImages) {
      throw new AppError(400, `Bu işletme için ürün başına en fazla ${maxImages} görsel yüklenebilir.`);
    }

    const uploadedImages = [];
    const currentMaxSort = product.images.reduce((max, img) => (img.sort_order > max ? img.sort_order : max), 0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const folderPath = `dijital-vitrin/${business?.slug}/${product.slug}`;
      const uploadResult = await uploadImage(file.buffer, folderPath);

      const isPrimary = product.images.length === 0 && i === 0;

      const newImage = await prisma.productImage.create({
        data: {
          product_id: product.id,
          url: uploadResult.url,
          public_id: uploadResult.publicId,
          is_primary: isPrimary,
          sort_order: currentMaxSort + i + 1,
        }
      });

      uploadedImages.push(newImage);
    }

    res.json({ data: uploadedImages });
  } catch (error) {
    next(error);
  }
};

export const deleteProductImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id, imgId } = req.params;

    const product = await prisma.product.findFirst({ where: { id, business_id: businessId }});
    if (!product) throw new AppError(404, 'Ürün bulunamadı');

    const image = await prisma.productImage.findFirst({ where: { id: imgId, product_id: id } });
    if (!image) throw new AppError(404, 'Görsel bulunamadı');

    if (image.public_id) {
      await deleteImage(image.public_id);
    }

    await prisma.productImage.delete({ where: { id: imgId } });

    if (image.is_primary) {
      const firstRemaining = await prisma.productImage.findFirst({
        where: { product_id: id },
        orderBy: { sort_order: 'asc' }
      });
      
      if (firstRemaining) {
        await prisma.productImage.update({
          where: { id: firstRemaining.id },
          data: { is_primary: true }
        });
      }
    }

    res.json({ data: { message: 'Görsel silindi' } });
  } catch (error) {
    next(error);
  }
};
