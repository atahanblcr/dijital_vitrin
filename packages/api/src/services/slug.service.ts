import { prisma } from '../config/database';
import { generateSlug } from '../utils/slugify';

export async function createUniqueSlug(baseText: string, businessId: string, excludeProductId?: string): Promise<string> {
  const baseSlug = generateSlug(baseText);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        business_id: businessId,
        slug: slug,
        // Güncelleme sırasında kendi slug'ı çakışma sayılmasın diye
        id: excludeProductId ? { not: excludeProductId } : undefined,
      }
    });

    if (!existing) {
      return slug;
    }

    // Eğer çakışma varsa sonuna sayaç ekleyerek tekrar dene
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
