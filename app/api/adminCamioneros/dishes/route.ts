import { type NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { validateAuthToken, validateDishData, createErrorResponse, createProtectedResponse } from "@/lib/auth-utils"

const isDev = process.env.NODE_ENV === "development"
interface Dish {
  id: number
  name: string
  description: string
  image: string
  badge: string
}

const KV_KEY = "dishes"

const DEFAULT_DISHES: Dish[] = [
  {
    id: 1,
    name: "Pincho camionero",
    description:
      "Exquisito pincho elaborado con los mejores ingredientes de nuestra tierra, una combinación perfecta de sabores que representa el alma de nuestra cocina tradicional",
    image: "/FotosBar/PinchoCamionero.png",
    badge: "Más vendido",
  },
  {
    id: 2,
    name: "Pulpo a la gallega",
    description:
      "Auténtico pulpo gallego cocido a la perfección, servido sobre cama de patatas gallegas y regado con nuestro aceite de oliva virgen extra",
    image: "/FotosBar/PulpoGallega.png",
    badge: "Tradicional",
  },
  {
    id: 3,
    name: "Especial Camioneros",
    description:
      "Espectacular mariscada con medio bogavante, sepia, calamarcitos, navajas, almejas gallegas, mejillones y gambas a la plancha, acompañada de nuestro pan de ajo casero",
    image: "/FotosBar/Mariscada.png",
    badge: "Especialidad",
  },
  {
    id: 5,
    name: "Tarta de queso",
    description:
      "Deliciosa tarta de queso cremoso con base de galleta artesanal y coulis de fresas frescas, el postre perfecto para cerrar cualquier comida",
    image: "/FotosBar/TartaQueso.png",
    badge: "Postre",
  },
  {
    id: 6,
    name: "Chuletón a la brasa",
    description:
      "Premium corte de carne seleccionado cuidadosamente, cocinado a la brasa tradicional con leña natural, servido con patatas fritas caseras y pimientos del padrón",
    image: "/FotosBar/Carne.png",
    badge: "Premium",
  },
  {
    id: 7,
    name: "Manitas de cerdo",
    description:
      "Manitas de cerdo tiernas, cocinadas a la perfección con un acabado dorado y sabroso, acompañadas de patatas y perejil fresco.",
    image: "/FotosBar/ManitasCerdo.png",
    badge: "Tradicional",
  },
  {
    id: 8,
    name: "Pata de pulpo",
    description:
      "Pata de pulpo asada a la brasa, servida sobre cama de patatas con pimentón y aceite de oliva virgen extra, un clásico gallego con un toque moderno",
    image: "/FotosBar/PulpoPata.png",
    badge: "Tapas",
  },
  {
    id: 9,
    name: "Tortilla de patatas",
    description: "La especialidad de la casa: jugosa tortilla de patatas, dorada y casera.",
    image: "/FotosBar/TortillaPatata.png",
    badge: "Especialidad",
  },
  {
    id: 10,
    name: "Plato combinado de sepia",
    description:
      "Sepia fresca, cocinada a la plancha con su punto perfecto, servida con guarnición de patatas fritas caseras y ensalada fresca",
    image: "/FotosBar/SepiaPlato.png",
    badge: "Especialidad",
  },
  {
    id: 11,
    name: "Plato de jamón",
    description: "Excepcional jamón ibérico de bellota, cortado a mano por nuestro maestro cortador",
    image: "/FotosBar/PlatoJamón.png",
    badge: "Tapas",
  },
  {
    id: 12,
    name: "Secreto Ibérico a la brasa",
    description:
      "Jugoso corte de cerdo ibérico de bellota, cocinado lentamente a la brasa con leña, acompañado de patatas fritas caseras",
    image: "/FotosBar/Brasa.png",
    badge: "Premium",
  },
  {
    id: 13,
    name: "Coulant con bola de chocolate",
    description: "Un coulant con bola de chocolate, el postre perfecto para cerrar cualquier comida",
    image: "/FotosBar/Bizcocho.png",
    badge: "Postre",
  },
  {
    id: 14,
    name: "Sepia con gambas rojas",
    description: "Sepia fresca, cocinada a la plancha con su punto perfecto, servida con gambas rojas a la plancha",
    image: "/FotosBar/SepiaGamba.png",
    badge: "Tradicional",
  },
  {
    id: 15,
    name: "Almejas",
    description: "Almejas frescas, cocinadas a la plancha con su punto perfecto",
    image: "/FotosBar/Almejas.png",
    badge: "Tradicional",
  },
  {
    id: 16,
    name: "Tapas de pimientos del padrón",
    description: "Tapas de pimientos del padrón, cocinadas a la plancha con su punto perfecto",
    image: "/FotosBar/PimientosPadrón.png",
    badge: "Tapas",
  },
  {
    id: 17,
    name: "Lubina con berenjena",
    description:
      "Fresca lubina cocinada a la plancha en el momento, acompañada de berenjena asada y un toque de aceite de oliva virgen extra",
    image: "/FotosBar/Lubina2.png",
    badge: "Tradicional",
  },
]

async function getDishes(): Promise<Dish[]> {

  if (isDev) {
    console.log("[DEV] Modo local → usando DEFAULT_DISHES")
    return DEFAULT_DISHES
  }

  try {
    const dishes = await kv.get<Dish[]>(KV_KEY)
    return dishes || DEFAULT_DISHES
  } catch (error) {
    console.error("[v0] Error fetching from KV:", error)
    return DEFAULT_DISHES
  }
}

async function saveDishes(dishes: Dish[]) {
  // EN MODO DESARROLLO (LOCAL) NO GUARDAMOS EN UPSTASH → evitamos el error 500
  if (process.env.NODE_ENV === "development") {
    console.log("MODO LOCAL → cambios NO guardados en la base de datos (solo lectura)")
    return
  }

  try {
    await kv.set(KV_KEY, dishes)
  } catch (error) {
    console.error("[v0] Error saving to KV:", error)
    throw new Error("Failed to save dishes to database")
  }
}

export async function GET(request: NextRequest) {
  try {
    const dishes = await getDishes()
    return NextResponse.json(dishes)
  } catch (error) {
    console.error("[v0] Error fetching dishes:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateAuthToken(request)) {
    return createErrorResponse("Unauthorized", 401)
  }

  try {
    const body = await request.json()
    const { dish, action } = body

    if (!dish || !action) {
      return createErrorResponse("Missing dish or action", 400)
    }

    if (!validateDishData(dish)) {
      return createErrorResponse("Invalid dish data", 400)
    }

    const dishes = await getDishes()

    if (action === "add") {
      if (dishes.some((d) => d.id === dish.id)) {
        return createErrorResponse("ID already exists", 409)
      }
      dishes.push(dish)
    } else if (action === "update") {
      const index = dishes.findIndex((d) => d.id === dish.id)
      if (index !== -1) {
        dishes[index] = dish
      } else {
        return createErrorResponse("Dish not found", 404)
      }
    } else if (action === "delete") {
      const filtered = dishes.filter((d) => d.id !== dish.id)
      await saveDishes(filtered)
      return createProtectedResponse({ success: true })
    } else {
      return createErrorResponse("Invalid action", 400)
    }

    await saveDishes(dishes)
    return createProtectedResponse({ success: true, dish })
  } catch (error) {
    console.error("[v0] Error updating dishes:", error)
    return createErrorResponse("Failed to update dishes", 500)
  }
}

export async function PUT(request: NextRequest) {
  if (!validateAuthToken(request)) {
    return createErrorResponse("Unauthorized", 401)
  }

  try {
    const dish = await request.json()

    if (!validateDishData(dish)) {
      return createErrorResponse("Invalid dish data", 400)
    }

    const dishes = await getDishes()

    const index = dishes.findIndex((d) => d.id === dish.id)
    if (index !== -1) {
      dishes[index] = dish
    } else {
      dishes.push(dish)
    }

    await saveDishes(dishes)
    return createProtectedResponse({ success: true, dish })
  } catch (error) {
    console.error("[v0] Error updating dish:", error)
    return createErrorResponse("Failed to update dish", 500)
  }
}
