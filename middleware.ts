import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n-config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const defaultLocale = 'en';

  // Ignorer les fichiers statiques
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Vérifier si la langue est déjà dans l'URL
  const pathLocale = locales.find((loc) => pathname.startsWith(`/${loc}/`));
  if (pathLocale) return NextResponse.next();

  // Rediriger vers la langue par défaut
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return Response.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'],
};

export { defaultLocale };
