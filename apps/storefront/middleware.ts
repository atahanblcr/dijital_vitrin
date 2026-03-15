import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|og-default.png|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)',
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // E2E Test Desteği: localhost:3000/slug/... yapısını kontrol et
  if (hostname === 'localhost:3000' || hostname === 'dijitalvitrin.com') {
    const pathParts = url.pathname.split('/').filter(Boolean);
    // Eğer path bir slug ile başlıyorsa (ve next.js internal değilse)
    if (pathParts.length > 0 && !pathParts[0].startsWith('_') && pathParts[0] !== 'favicon.ico') {
      const slug = pathParts[0];
      // URL zaten /slug formatında, bu yüzden rewrite yapmaya gerek yok, Next.js app/[slug] klasörünü otomatik yakalar.
      // Sadece ana domainde olduğumuzu biliyoruz ve Next.js'e bırakıyoruz.
      return NextResponse.next();
    }
  }

  // 1. Ana domain kontrolü (localhost:3000 veya dijitalvitrin.com)
  const isBaseDomain = hostname === 'localhost:3000' || hostname === 'dijitalvitrin.com';
  
  if (isBaseDomain) {
    // Ana domaindeysek ve bir path yoksa hiçbir şey yapma
    return NextResponse.next();
  }

  // 2. Subdomain'i ayıkla
  let slug = '';
  if (hostname.endsWith('.localhost:3000')) {
    slug = hostname.replace('.localhost:3000', '');
  } else if (hostname.endsWith('.dijitalvitrin.com')) {
    slug = hostname.replace('.dijitalvitrin.com', '');
  }

  if (slug) {
    // 3. Rewrite: URL'yi içten /slug/... şeklinde değiştir
    const newUrl = new URL(`/${slug}${url.pathname}${url.search}`, req.url);
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}
