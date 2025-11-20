// middleware.ts ← versión definitiva y sin fallos
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('adminToken')?.value;
  const pathname = request.nextUrl.pathname;

  // 1. Permitir siempre estas rutas públicas
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/') ||
    pathname === '/adminCamioneros/login'
  ) {
    return NextResponse.next();
  }

  // 2. Proteger todo lo que empiece por /adminCamioneros
  if (pathname.startsWith('/adminCamioneros')) {
    if (!token) {
      // Redirige al login si no hay token
      const loginUrl = new URL('/adminCamioneros/login', request.url);
      loginUrl.searchParams.set('from', pathname); // opcional: para volver después
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};