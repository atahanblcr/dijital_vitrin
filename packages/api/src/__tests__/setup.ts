import { prisma } from '@dijital-vitrin/database';

// Testler bitince veritabanı bağlantısını kapat
afterAll(async () => {
  await prisma.$disconnect();
});
