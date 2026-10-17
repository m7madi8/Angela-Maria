import { NextResponse, type NextRequest } from 'next/server';
import { isLocale } from '@/i18n/locales';

export function handleRequest(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  const locale = pathname.split('/')[1] ?? '';
  if (locale && isLocale(locale)) {
    const headers = new Headers(request.headers);
    headers.set('x-locale', locale);
    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

export function middleware(request: NextRequest): NextResponse {
  return handleRequest(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
