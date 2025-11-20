import { NextRequest, NextResponse } from "next/server";

// ← AÑADE ESTO
export async function GET() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;

    if (!adminUser || !adminPass) {
      console.error("FATAL: Las variables de entorno ADMIN_USER o ADMIN_PASS no están configuradas.");
      return NextResponse.json(
        { success: false, message: "Error de configuración del servidor." },
        { status: 500 }
      );
    }

    if (username !== adminUser || password !== adminPass) {
      return NextResponse.json(
        { success: false, message: "Usuario o contraseña incorrectos." },
        { status: 401 }
      );
    }

    const token = `admin-token-${Date.now()}-${Math.random().toString(36).substring(2)}`;

    fetch(`${request.nextUrl.origin}/api/adminCamioneros/audit-log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "Login",
        type: "sesion",
        details: `Usuario: ${username}`,
      }),
    }).catch(() => {});

    const response = NextResponse.json({ success: true, message: "Autenticación exitosa." });

    response.cookies.set({
      name: 'adminToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error("[API] Error inesperado en /api/adminCamioneros/login:", error);
    return NextResponse.json(
      { success: false, message: "Ocurrió un error inesperado en el servidor." },
      { status: 500 }
    );
  }
}