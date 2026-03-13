import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { createUniqueSlug } from '../services/slug.service';

export const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    if (!businessId) throw new AppError(403, 'İşletme bilgisi bulunamadı');

    const blogs = await prisma.blogPost.findMany({
      where: { business_id: businessId },
      orderBy: { created_at: 'desc' },
    });

    res.json({ data: blogs });
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    const blog = await prisma.blogPost.findFirst({
      where: { id, business_id: businessId }
    });

    if (!blog) throw new AppError(404, 'Yazı bulunamadı');

    res.json({ data: blog });
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    if (!businessId) throw new AppError(403, 'İşletme bilgisi bulunamadı');

    const { title, content, meta_description, status, published_at } = req.body;

    const baseSlug = await createUniqueSlug(title, businessId);

    // Kapak görseli (cover_image_url) işlemi multer ile eklenebilir, bu fazda varsayılan metin.
    const blog = await prisma.blogPost.create({
      data: {
        business_id: businessId,
        title,
        slug: baseSlug,
        content,
        meta_description,
        status,
        published_at: published_at ? new Date(published_at) : null,
      },
    });

    res.status(201).json({ data: blog });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id } = req.params;
    const { title, content, meta_description, status, published_at } = req.body;

    const existingBlog = await prisma.blogPost.findFirst({
      where: { id, business_id: businessId }
    });

    if (!existingBlog) throw new AppError(404, 'Yazı bulunamadı');

    let newSlug = existingBlog.slug;
    if (title && title !== existingBlog.title) {
      // Başlık değiştiyse yeni slug üret
      // (Önceki URL'in kırılmaması için aslında değiştirilmemesi tavsiye edilir ama müşteri isteğine göre)
      newSlug = await createUniqueSlug(title, businessId, id);
    }

    const updatedBlog = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug: newSlug,
        content,
        meta_description,
        status,
        published_at: published_at ? new Date(published_at) : existingBlog.published_at,
      },
    });

    res.json({ data: updatedBlog });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    const existingBlog = await prisma.blogPost.findFirst({
      where: { id, business_id: businessId }
    });

    if (!existingBlog) throw new AppError(404, 'Yazı bulunamadı');

    // Kapak görseli Cloudinary'den silinmesi (varsa)
    if (existingBlog.cover_image_pid) {
      const { deleteImage } = require('../services/image.service');
      await deleteImage(existingBlog.cover_image_pid);
    }

    await prisma.blogPost.delete({ where: { id } });

    res.json({ data: { message: 'Yazı silindi' } });
  } catch (error) {
    next(error);
  }
};
