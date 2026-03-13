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
      orderBy: { sort_order: 'asc' }, // nulls last varsayılanı çalışır
      include: {
        category: { select: { id: true, name: true } },
        images: { orderBy: { sort_order: 'asc' } },
        attr_values: {
          include: { attribute: true, option: true }
        }
      }
    });

    res.json({ data: products });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    if (!businessId) throw new AppError(403, 'İşletme bilgisi bulunamadı');

    const { name, category_id, short_desc, long_desc, is_campaign, in_stock, is_active, attributes } = req.body;

    // Kategori kontrolü
    const category = await prisma.category.findFirst({ where: { id: category_id, business_id: businessId } });
    if (!category) throw new AppError(404, 'Kategori bulunamadı');

    // Slug üretimi
    const slug = await createUniqueSlug(name, businessId);

    // Kategoriye ait zorunlu özellikleri kontrol edelim
    const requiredAttributes = await prisma.categoryAttribute.findMany({
      where: { category_id, is_required: true }
    });

    for (const reqAttr of requiredAttributes) {
      const found = attributes?.find((a: any) => a.attribute_id === reqAttr.id);
      
      const hasValue = found && (
        (reqAttr.type === 'text' && found.value_text) ||
        (reqAttr.type === 'number' && found.value_number !== null && found.value_number !== undefined) ||
        (reqAttr.type === 'select' && !reqAttr.is_multiple && found.value_option_id) ||
        (reqAttr.type === 'select' && reqAttr.is_multiple && found.multi_option_ids && found.multi_option_ids.length > 0)
      );

      if (!hasValue) {
        throw new AppError(400, `"${reqAttr.name}" özelliği zorunludur.`);
      }
    }

    // Ürünü kaydet
    const product = await prisma.product.create({
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

    // Dinamik özellikleri kaydet
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        // İlgili attribute'un tipini ve multi-select durumunu bul
        const defAttr = await prisma.categoryAttribute.findUnique({ where: { id: attr.attribute_id }});
        if (!defAttr) continue;

        if (defAttr.type === 'select' && defAttr.is_multiple && attr.multi_option_ids) {
          // Multi-select durumu için özel tabloya çoklu kayıt atıyoruz
          const multiData = attr.multi_option_ids.map((optId: string) => ({
            product_id: product.id,
            attribute_id: attr.attribute_id,
            option_id: optId,
          }));
          await prisma.productAttributeMultiValue.createMany({ data: multiData });
        } else {
          // Normal kayıt
          await prisma.productAttributeValue.create({
            data: {
              product_id: product.id,
              attribute_id: attr.attribute_id,
              value_text: attr.value_text,
              value_number: attr.value_number,
              value_option_id: attr.value_option_id,
            }
          });
        }
      }
    }

    res.status(201).json({ data: product });
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

    // Önce Cloudinary üzerindeki görselleri sil
    for (const image of product.images) {
      if (image.public_id) {
        await deleteImage(image.public_id);
      }
    }

    // Veritabanı Cascade Delete sayesinde attribute_values ve image kayıtları otomatik silinecektir
    await prisma.product.delete({ where: { id } });

    res.json({ data: { message: 'Ürün ve tüm görselleri başarıyla silindi' } });
  } catch (error) {
    next(error);
  }
};

// ─── GÖRSEL YÜKLEME ──────────────────────────────────────────────

export const uploadProductImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id } = req.params; // Product ID

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
      // Cloudinary'de düzenli bir yapı olması için: dijital-vitrin/businessSlug/productSlug/
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

    // Cloudinary'den sil
    if (image.public_id) {
      await deleteImage(image.public_id);
    }

    // DB'den sil
    await prisma.productImage.delete({ where: { id: imgId } });

    // Eğer silinen ana görsel idiyse, kalan ilk görseli ana görsel yap
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
