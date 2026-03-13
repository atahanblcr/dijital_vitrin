export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ı/g, 'i')
    .replace(/\s+/g, '-')       // Boşlukları tire ile değiştir
    .replace(/[^\w\-]+/g, '')   // Alfanumerik ve tire dışı karakterleri kaldır
    .replace(/\-\-+/g, '-')     // Yan yana birden fazla tireyi tek tire yap
    .replace(/^-+/, '')         // Baştaki tireleri kaldır
    .replace(/-+$/, '');        // Sondaki tireleri kaldır
}
