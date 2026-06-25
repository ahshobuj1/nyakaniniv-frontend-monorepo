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
     * - theme/ (theme assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|theme|.*\\..*).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.upbeatafrica.com, demo.localhost:3000)
  const hostname = req.headers
    .get('host')!
    .replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'upbeatafrica.com'}`);

  // Define allowed root domains (including local dev variations)
  const rootDomains = [
    'upbeatafrica.com',
    'www.upbeatafrica.com',
    'localhost:3000',
    'app.upbeatafrica.com',
    'admin.upbeatafrica.com'
  ];

  // If the request is for the main domain, app dashboard, or admin, let it pass normally.
  if (rootDomains.includes(hostname)) {
    return NextResponse.next();
  }

  // Extract the subdomain. e.g. "djkwame.upbeatafrica.com" -> "djkwame"
  const currentHost =
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
      ? hostname.replace(`.upbeatafrica.com`, '')
      : hostname.replace(`.upbeatafrica.com`, '').replace('.localhost:3000', '');

  // Rewrite subdomain requests to /site/[subdomain]/[path]
  if (currentHost && currentHost !== 'www' && currentHost !== 'app' && currentHost !== 'admin') {
    return NextResponse.rewrite(new URL(`/site/${currentHost}${url.pathname}`, req.url));
  }

  return NextResponse.next();
}
