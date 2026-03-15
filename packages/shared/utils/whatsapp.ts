/**
 * WhatsApp telefon numarasını wa.me linki için temizler ve formatlar.
 * @param phoneNumber Ham telefon numarası (örn: "0 (555) 123-4567")
 * @returns Formatlanmış numara (örn: "905551234567")
 */
export function formatWhatsAppNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';

  // Tüm rakam dışı karakterleri temizle
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  let formattedPhone = cleanPhone;
  
  // Başındaki 0'ı kaldır
  if (formattedPhone.startsWith('0')) {
    formattedPhone = formattedPhone.substring(1);
  }
  
  // Eğer başında 90 yoksa ekle
  if (!formattedPhone.startsWith('90')) {
    formattedPhone = `90${formattedPhone}`;
  }

  return formattedPhone;
}

/**
 * WhatsApp wa.me URL'i oluşturur.
 * @param phoneNumber Formatlanmış veya ham telefon numarası
 * @param message Gönderilecek mesaj
 * @returns Tam URL
 */
export function getWhatsAppUrl(phoneNumber: string, message: string): string {
  const formattedPhone = formatWhatsAppNumber(phoneNumber);
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
