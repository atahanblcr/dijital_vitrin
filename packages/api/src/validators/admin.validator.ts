import { z } from 'zod';

export const createBusinessSchema = z.object({
  name: z.string().min(2, 'İşletme adı en az 2 karakter olmalıdır').max(150),
  slug: z.string().min(2, 'Slug en az 2 karakter olmalıdır').max(100).regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir'),
  sector: z.enum(['elektronik', 'butik', 'aksesuar', 'el_isi', 'oto_galeri']),
  whatsapp: z.string().min(10, 'WhatsApp numarası geçerli bir formatta olmalıdır'),
  subscription_plan: z.enum(['monthly', 'yearly']),
  subscription_end: z.coerce.date(),
  // Admin Hesabı
  username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalıdır').max(50),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'),
});

export const updateBusinessSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  sector: z.enum(['elektronik', 'butik', 'aksesuar', 'el_isi', 'oto_galeri']).optional(),
  whatsapp: z.string().min(10).optional(),
  subscription_plan: z.enum(['monthly', 'yearly']).optional(),
  subscription_end: z.coerce.date().optional(),
  is_active: z.boolean().optional(),
  auto_deactivate: z.boolean().optional(),
});
