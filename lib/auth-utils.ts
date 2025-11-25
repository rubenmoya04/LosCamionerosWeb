import { type NextRequest, NextResponse } from "next/server"

/**
 * Validates admin authentication token from cookies
 * Returns user data if valid, null if invalid
 */
export function validateAuthToken(request: NextRequest): boolean {
  const token = request.cookies.get("adminToken")?.value
  return !!token
}

/**
 * Sanitizes string input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return ""
  return input
    .trim()
    .slice(0, 500) // Limit length
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
}

/**
 * Validates dish data
 */
export interface DishData {
  id: number
  name: string
  description: string
  image: string
  badge: string
}

export function validateDishData(data: any): data is DishData {
  return (
    typeof data.id === "number" &&
    typeof data.name === "string" &&
    typeof data.description === "string" &&
    typeof data.image === "string" &&
    typeof data.badge === "string" &&
    data.name.trim().length > 0 &&
    data.description.trim().length > 0
  )
}

/**
 * Creates a protected response
 */
export function createProtectedResponse(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

/**
 * Creates an error response
 */
export function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}
