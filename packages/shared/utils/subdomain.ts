/**
 * Hostname'den işletme slug'ını ayıklar.
 * @param hostname Request host header (örn: "ahmet.dijitalvitrin.com")
 * @returns İşletme slug'ı (örn: "ahmet") veya boş string
 */
export function getSlugFromHostname(hostname: string): string {
  if (!hostname) return '';

  const baseDomains = ['localhost:3000', 'dijitalvitrin.com'];
  
  // Ana domain ise slug yoktur
  if (baseDomains.includes(hostname)) {
    return '';
  }

  // Subdomain kontrolü
  for (const domain of baseDomains) {
    if (hostname.endsWith(`.${domain}`)) {
      return hostname.replace(`.${domain}`, '');
    }
  }

  return '';
}

/**
 * URL pathname'inden ilk segmenti slug olarak ayıklar (Local testing/E2E için).
 * @param pathname Request URL pathname (örn: "/ahmet/urunler")
 * @returns { slug: string, remainingPath: string }
 */
export function getSlugFromPathname(pathname: string): { slug: string, remainingPath: string } {
  const parts = pathname.split('/').filter(Boolean);
  
  if (parts.length > 0 && !parts[0].startsWith('_') && parts[0] !== 'favicon.ico' && parts[0] !== 'api') {
    const slug = parts[0];
    const remainingPath = '/' + parts.slice(1).join('/');
    return { slug, remainingPath };
  }
  
  return { slug: '', remainingPath: pathname };
}
