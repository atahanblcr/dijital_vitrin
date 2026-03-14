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

  // 1. Ana domain kontrolü (localhost:3000 veya dijitalvitrin.com)
  const isBaseDomain = hostname === 'localhost:3000' || hostname === 'dijitalvitrin.com';
  
  if (isBaseDomain) {
    // Ana domaindeysek hiçbir şey yapma (veya landing page'e yönlendir)
    return NextResponse.next();
  }

  // 2. Subdomain'i ayıkla
  let slug = '';
  if (hostname.endsWith('.localhost:3000')) {
    slug = hostname.replace('.localhost:3000', '');
  } else if (hostname.endsWith('.dijitalvitrin.com')) {
    slug = hostname.replace('.dijitalvitrin.com', '');
  } else if (hostname.endsWith('.dijitalvitrin.test:3000')) {
    slug = hostname.replace('.dijitalvitrin.test:3000', '');
  }

  if (slug) {
    // 3. Rewrite: URL'yi içten /slug/... şeklinde değiştir
    const newUrl = new URL(`/${slug}${url.pathname}${url.search}`, req.url);
    console.log(`[MIDDLEWARE] Rewriting ${hostname}${url.pathname} to ${newUrl.pathname}`);
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}
