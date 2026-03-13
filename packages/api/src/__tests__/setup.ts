import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Testler bitince veritabanı bağlantısını kapat
afterAll(async () => {
  await prisma.$disconnect();
});
