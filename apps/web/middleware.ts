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

  // Get hostname of request
  let hostname = req.headers.get('host')!;

  // Map localhost development domains to production equivalents for testing
  if (hostname.includes('.localhost:3000')) {
    hostname = hostname.replace('.localhost:3000', '.deejay.africa');
  } else if (hostname === 'localhost:3000') {
    hostname = 'upbeat.africa';
  }

  // Define allowed root domains for the MAIN web app
  const rootDomains = [
    'upbeat.africa',
    'www.upbeat.africa',
    // fallback domains
    'upbeatafrica.com',
    'www.upbeatafrica.com',
    'app.upbeatafrica.com',
    'admin.upbeatafrica.com',
    'upbeatafrica.vercel.app'
  ];

  // 1. If it's a main domain, pass normally to standard pages
  if (rootDomains.includes(hostname)) {
    return NextResponse.next();
  }

  // 2. Check for subdomains on deejay.africa
  if (hostname.endsWith('.deejay.africa')) {
    // Extract subdomain (e.g. "shobuj.deejay.africa" -> "shobuj")
    const subdomain = hostname.replace('.deejay.africa', '');
    
    // Ignore "www" or empty subdomain on deejay.africa
    if (subdomain && subdomain !== 'www') {
      // Rewrite subdomain requests to /site/[subdomain]/[path]
      return NextResponse.rewrite(new URL(`/site/${subdomain}${url.pathname}`, req.url));
    }
  }

  return NextResponse.next();
}
