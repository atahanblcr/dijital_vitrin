import { z } from 'zod';

// Kategori Şemaları
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Kategori adı zorunludur').max(100, 'Kategori adı en fazla 100 karakter olabilir'),
    sort_order: z.number().int().optional().default(0),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Geçersiz kategori ID'),
  }),
  body: z.object({
    name: z.string().min(1, 'Kategori adı zorunludur').max(100, 'Kategori adı en fazla 100 karakter olabilir').optional(),
    sort_order: z.number().int().optional(),
  }),
});

// Kategori Özelliği Şemaları
export const createAttributeSchema = z.object({
  params: z.object({
    id: z.string().uuid('Geçersiz kategori ID'),
  }),
  body: z.object({
    name: z.string().min(1, 'Özellik adı zorunludur').max(100, 'Özellik adı en fazla 100 karakter olabilir'),
    type: z.enum(['text', 'number', 'select'], {
      required_error: 'Geçerli bir özellik tipi seçmelisiniz (text, number, select)',
    }),
    unit: z.string().max(20).optional().nullable(),
    is_required: z.boolean().optional().default(false),
    is_multiple: z.boolean().optional().default(false),
    sort_order: z.number().int().optional().default(0),
  }),
});

export const updateAttributeSchema = z.object({
  params: z.object({
    id: z.string().uuid('Geçersiz kategori ID'),
    attrId: z.string().uuid('Geçersiz özellik ID'),
  }),
  body: z.object({
    name: z.string().min(1, 'Özellik adı zorunludur').max(100).optional(),
    type: z.enum(['text', 'number', 'select']).optional(),
    unit: z.string().max(20).optional().nullable(),
    is_required: z.boolean().optional(),
    is_multiple: z.boolean().optional(),
    sort_order: z.number().int().optional(),
  }),
});

// Özellik Seçenekleri (Çoktan Seçmeli Tip)
export const createOptionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Geçersiz kategori ID'),
    attrId: z.string().uuid('Geçersiz özellik ID'),
  }),
  body: z.object({
    value: z.string().min(1, 'Seçenek değeri zorunludur').max(100, 'En fazla 100 karakter'),
    sort_order: z.number().int().optional().default(0),
  }),
});
