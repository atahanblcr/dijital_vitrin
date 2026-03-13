import { z } from 'zod';

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Başlık zorunludur').max(150, 'Başlık en fazla 150 karakter olabilir'),
    content: z.string().min(1, 'İçerik zorunludur'), // HTML içerik
    meta_description: z.string().max(160, 'Meta açıklama en fazla 160 karakter olabilir').optional().nullable(),
    status: z.enum(['draft', 'published']).default('draft'),
    published_at: z.string().datetime().optional().nullable(), // İleri zamanlı yayın için ISO 8601 tarihi
  }),
});

export const updateBlogSchema = z.object({
  params: z.object({
    id: z.string().uuid('Geçersiz yazı ID'),
  }),
  body: z.object({
    title: z.string().min(1).max(150).optional(),
    content: z.string().min(1).optional(),
    meta_description: z.string().max(160).optional().nullable(),
    status: z.enum(['draft', 'published']).optional(),
    published_at: z.string().datetime().optional().nullable(),
  }),
});
