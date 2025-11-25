import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      const token = randomUUID()

      const response = NextResponse.json({ success: true })
      response.cookies.set("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date("9999-12-31"),
      })

      // Audit log
      fetch(`${request.headers.get("origin") || ""}/api/adminCamioneros/audit-log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "Login",
          type: "sesion",
          details: `Usuario: ${username}`,
        }),
      }).catch(() => {})

      return response
    }

    return NextResponse.json({ success: false }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
