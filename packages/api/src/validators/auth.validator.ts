import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Kullanıcı adı zorunludur'),
    password: z.string().min(1, 'Şifre zorunludur'),
  }),
});

export const verify2FaSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Geçersiz kullanıcı ID'),
    token: z.string().length(6, '2FA kodu 6 haneli olmalıdır'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token zorunludur'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Geçersiz kullanıcı ID'),
    newPassword: z.string()
      .min(8, 'Şifre en az 8 karakter olmalıdır')
      .regex(/[A-Z]/, 'En az bir büyük harf içermelidir')
      .regex(/[a-z]/, 'En az bir küçük harf içermelidir')
      .regex(/[0-9]/, 'En az bir rakam içermelidir'),
  }),
});
