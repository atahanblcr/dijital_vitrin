import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Get hostname of request (e.g. demo.dijitalvitrin.com, demo.localhost:3000)
  const hostname = req.headers.get('host') || 'dijitalvitrin.com';

  // Extract the root domain and the subdomain
  // In production, BASE_DOMAIN will be "dijitalvitrin.com"
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost:3000';
  
  // Exclude the base domain to get the subdomain
  const currentHost =
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
      ? hostname.replace(`.dijitalvitrin.com`, '')
      : hostname.replace(`.${baseDomain}`, '');

  // If there's no subdomain (i.e. we are on dijitalvitrin.com or localhost:3000)
  if (currentHost === baseDomain || currentHost === hostname) {
    // Optionally redirect to main platform landing page
    // return NextResponse.rewrite(new URL('/landing', req.url));
    return NextResponse.next();
  }

  // We have a subdomain! Let's rewrite the URL so the Next.js app 
  // can catch it under the app/[slug] folder structure.
  // Example: demo.dijitalvitrin.com/urunler -> /demo/urunler
  return NextResponse.rewrite(new URL(`/${currentHost}${url.pathname}${url.search}`, req.url));
}
