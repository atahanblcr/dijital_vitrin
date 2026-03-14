import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Kesin çözüm seed işlemi başlatılıyor...');

  // Salt rounds 12 - API ile birebir aynı olmalı
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash('Admin123!', salt);

  console.log('Kullanılan Hash:', passwordHash);

  // 1. Süper Admin
  await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: { password_hash: passwordHash, failed_attempts: 0, locked_until: null },
    create: {
      username: 'superadmin',
      password_hash: passwordHash,
      role: 'super_admin',
    },
  });

  // 2. İşletme Admin
  const demoBus = await prisma.business.findUnique({ where: { slug: 'demo-isletme' } });
  if (demoBus) {
    await prisma.user.upsert({
      where: { username: 'demo_admin' },
      update: { password_hash: passwordHash, failed_attempts: 0, locked_until: null },
      create: {
        username: 'demo_admin',
        password_hash: passwordHash,
        role: 'business_admin',
        business_id: demoBus.id,
      },
    });
  }

  console.log('✨ Seed başarıyla tamamlandı. Şifreler güncellendi.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
