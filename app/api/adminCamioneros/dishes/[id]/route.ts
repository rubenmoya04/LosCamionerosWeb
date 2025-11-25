// app/api/adminCamioneros/dishes/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { validateAuthToken, createErrorResponse } from "@/lib/auth-utils"

const KV_KEY = "dishes"
const isDev = process.env.NODE_ENV === "development"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← AWAITED!
) {
  // 1. Auth
  if (!validateAuthToken(request)) {
    return createErrorResponse("Unauthorized", 401)
  }

  // 2. Await params (Next.js 15 obliga)
  const { id: idStr } = await params
  const id = Number(idStr)
  if (isNaN(id)) return createErrorResponse("Invalid ID", 400)

  // 3. EN LOCAL → NO GUARDAMOS NADA (evitamos error KV)
  if (isDev) {
    console.log("MODO LOCAL → eliminación ignorada (solo lectura)")
    return NextResponse.json({ success: true, message: "Deleted (local mode)" })
  }

  try {
    const data = await kv.get<any[]>(KV_KEY)
    const dishes = data || []
    const filtered = dishes.filter(d => d.id !== id)

    if (filtered.length === dishes.length) {
      return createErrorResponse("Dish not found", 404)
    }

    await kv.set(KV_KEY, filtered)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[KV] DELETE error:", error)
    return createErrorResponse("Server error", 500)
  }
}