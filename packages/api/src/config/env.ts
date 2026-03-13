import { z } from 'zod';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from project root relative to this file
const rootEnvPath = path.resolve(__dirname, '../../../../.env');
const result = dotenv.config({ path: rootEnvPath, override: true });

if (result.error) {
  console.warn('⚠️ .env dosyası yüklenirken hata oluştu:', result.error.message);
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PORT: z.string().default('4000').transform(Number),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  IP_HASH_SALT: z.string().min(16, 'IP_HASH_SALT must be at least 16 characters').optional().default('default-salt-for-dev-123456'),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_BASE_DOMAIN: z.string().optional(),
});

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  console.error('❌ Geçersiz Environment Değişkenleri:', envParsed.error.format());
  console.log('💡 Aranan .env yolu:', rootEnvPath);
  process.exit(1);
}

export const env = envParsed.data;
