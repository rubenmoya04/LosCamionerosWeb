import type { NextRequest } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import { validateAuthToken, createErrorResponse, createProtectedResponse } from "@/lib/auth-utils"

const DISHES_FILE = join(process.cwd(), "public/dishes-data.json")

async function getDishes() {
  try {
    const data = await readFile(DISHES_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveDishes(dishes: any) {
  await writeFile(DISHES_FILE, JSON.stringify(dishes, null, 2), "utf-8")
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
