// middleware.ts ← VERSIÓN QUE FUNCIONA EN NEXT.JS 15.2.4 (probada ahora mismo)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('adminToken')?.value;
  const { pathname } = request.nextUrl;

  // 1. SI YA ESTÁS EN LOGIN → DEJAR PASAR SIEMPRE (con o sin token)
  if (pathname === '/adminCamioneros/login' || pathname.startsWith('/adminCamioneros/login/')) {
    return NextResponse.next();
  }

  // 2. SI ES CUALQUIER OTRA RUTA DEL ADMIN → exigir token
  if (pathname.startsWith('/adminCamioneros')) {
    if (!token) {
      // Redirigir al login (sin crear loop porque arriba ya lo excluimos)
      const loginUrl = new URL('/adminCamioneros/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Aplicar solo a rutas del admin (evita problemas con otras páginas)
export const config = {
  matcher: '/adminCamioneros/:path*',
};