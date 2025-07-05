import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { languages, fallbackLng } from './app/i18n/settings';

// Get the preferred locale
function getLocale(request: NextRequest): string {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = languages.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Get locale from Accept-Language header
    const acceptLanguage = request.headers.get('Accept-Language');
    let locale = fallbackLng;
    
    if (acceptLanguage) {
      // Parse Accept-Language header to find the best matching locale
      const acceptedLanguages = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].trim());
      
      for (const acceptedLang of acceptedLanguages) {
        if (languages.includes(acceptedLang)) {
          locale = acceptedLang;
          break;
        }
        // Check for language variants (e.g., 'en-US' -> 'en')
        const langCode = acceptedLang.split('-')[0];
        if (languages.includes(langCode)) {
          locale = langCode;
          break;
        }
      }
    }
    
    // Get locale from cookie if available
    const cookieLocale = request.cookies.get('i18next')?.value;
    if (cookieLocale && languages.includes(cookieLocale)) {
      locale = cookieLocale;
    }
    
    return locale;
  }

  return languages.find(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) || fallbackLng;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if this is an API route, static file, or other special paths
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/admin/') ||
    pathname.includes('.') ||
    pathname.startsWith('/public/') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = languages.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // If no locale in pathname and it's not the root, redirect with locale
  if (pathnameIsMissingLocale && pathname !== '/') {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
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