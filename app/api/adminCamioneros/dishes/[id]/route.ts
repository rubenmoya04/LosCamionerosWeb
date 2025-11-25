import type { NextRequest } from "next/server"
import { kv } from "@vercel/kv"
import { validateAuthToken, createErrorResponse, createProtectedResponse } from "@/lib/auth-utils"

interface Dish {
  id: number
  name: string
  description: string
  image: string
  badge: string
}

const KV_KEY = "dishes"

async function getDishes(): Promise<Dish[]> {
  try {
    const dishes = await kv.get<Dish[]>(KV_KEY)
    return dishes || []
  } catch (error) {
    console.error("[v0] Error fetching from KV:", error)
    return []
  }
}

async function saveDishes(dishes: Dish[]) {
  await kv.set(KV_KEY, dishes)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!validateAuthToken(request)) {
    return createErrorResponse("Unauthorized", 401)
  }

  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return createErrorResponse("Invalid ID", 400)
    }

    const dishes = await getDishes()
    const filtered = dishes.filter((d: any) => d.id !== id)

    if (filtered.length === dishes.length) {
      return createErrorResponse("Dish not found", 404)
    }

    await saveDishes(filtered)
    return createProtectedResponse({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting dish:", error)
    return createErrorResponse("Failed to delete dish", 500)
  }
}
