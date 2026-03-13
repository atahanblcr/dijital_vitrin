import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SECTOR_TEMPLATES = {
  elektronik: ['Telefon & Aksesuar', 'Bilgisayar', 'Ses & Görüntü', 'Küçük Ev Aletleri'],
  butik: ['Kadın Giyim', 'Erkek Giyim', 'Çocuk Giyim', 'Dış Giyim'],
  aksesuar: ['Takı & Mücevher', 'Çanta & Cüzdan', 'Saat', 'Gözlük'],
  el_isi: ['El Örgüsü', 'Ahşap El Sanatları', 'Seramik & Çini', 'Tekstil & Nakış'],
  oto_galeri: ['Binek Araç', 'SUV & Crossover', 'Ticari Araç', 'Motosiklet'],
};

async function main() {
  console.log('Seed başlatılıyor...');

  // Gerekirse buraya süper admin seed işlemleri de eklenebilir.
  // ...

  console.log('Seed tamamlandı.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
