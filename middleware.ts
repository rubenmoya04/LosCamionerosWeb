import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Proteger todo lo que empiece por /adminCamioneros excepto el login
  if (path.startsWith("/adminCamioneros") && !path.startsWith("/adminCamioneros/login")) {
    const token = request.cookies.get("adminToken")?.value

    if (!token) {
      // Redirige al login si no hay cookie
      const loginUrl = new URL("/adminCamioneros/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (path === "/api/adminCamioneros/dishes" && request.method === "GET") {
    return NextResponse.next()
  }

  // Proteger todas las rutas de API del admin excepto login
  if (path.startsWith("/api/adminCamioneros") && !path.startsWith("/api/adminCamioneros/login")) {
    const token = request.cookies.get("adminToken")?.value

    if (path === "/api/adminCamioneros/dishes" && request.method === "GET") {
      return NextResponse.next()
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/adminCamioneros/:path*", "/api/adminCamioneros/:path*"],
}
