import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { languages } from './app/i18n/settings';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if this is an API route, static file, or other special paths
  if (
    pathname === '/' || // Skip processing the root path to avoid loops
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/admin/') ||
    pathname.includes('.') ||
    pathname.startsWith('/public/') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Check if the path starts with a language code we need to redirect from
  for (const locale of languages) {
    if (pathname.startsWith(`/${locale}/`)) {
      // Remove the language prefix and redirect
      const newPath = pathname.replace(`/${locale}`, '');
      // Add a console log to debug
      console.log(`Redirecting from ${pathname} to ${newPath}`);
      return NextResponse.redirect(new URL(newPath, request.url));
    } else if (pathname === `/${locale}`) {
      // Redirect /en to /
      console.log(`Redirecting from ${pathname} to /`);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin routes)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin|public).*)',
  ],
}; 