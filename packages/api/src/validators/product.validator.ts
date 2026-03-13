import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Ürün adı zorunludur').max(100, 'Maksimum 100 karakter olabilir'),
    category_id: z.string().uuid('Geçerli bir kategori seçilmelidir'),
    short_desc: z.string().max(150, 'Kısa açıklama maksimum 150 karakter olabilir').optional().nullable(),
    long_desc: z.string().optional().nullable(),
    is_campaign: z.boolean().optional().default(false),
    in_stock: z.boolean().optional().default(true),
    is_active: z.boolean().optional().default(true),
    
    // Dinamik özelliklerin listesi
    attributes: z.array(z.object({
      attribute_id: z.string().uuid(),
      value_text: z.string().optional().nullable(),
      value_number: z.number().optional().nullable(),
      value_option_id: z.string().uuid().optional().nullable(), // Tekli seçim
      multi_option_ids: z.array(z.string().uuid()).optional()    // Çoklu seçim
    })).optional().default([]),
  })
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Geçersiz ürün ID'),
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    category_id: z.string().uuid().optional(),
    short_desc: z.string().max(150).optional().nullable(),
    long_desc: z.string().optional().nullable(),
    is_campaign: z.boolean().optional(),
    in_stock: z.boolean().optional(),
    is_active: z.boolean().optional(),
    
    // Özellikler baştan gönderilir, mevcudu silip yenisini yazarız.
    attributes: z.array(z.object({
      attribute_id: z.string().uuid(),
      value_text: z.string().optional().nullable(),
      value_number: z.number().optional().nullable(),
      value_option_id: z.string().uuid().optional().nullable(),
      multi_option_ids: z.array(z.string().uuid()).optional()
    })).optional(),
  })
});

export const updateProductSortSchema = z.object({
  body: z.object({
    product_ids: z.array(z.string().uuid()),
  })
});

export const toggleProductSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ value: z.boolean() })
});
