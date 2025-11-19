import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

interface Dish {
  id: number;
  name: string;
  description: string;
  image: string;
  badge: string;
}

const DISHES_FILE = join(process.cwd(), "public/dishes-data.json");

const DEFAULT_DISHES: Dish[] = [
  {
    id: 1,
    name: "Pincho camionero",
    description: "Exquisito pincho elaborado con los mejores ingredientes de nuestra tierra, una combinación perfecta de sabores que representa el alma de nuestra cocina tradicional",
    image: "/FotosBar/PinchoCamionero.png",
    badge: "Más vendido",
  },
  {
    id: 2,
    name: "Pulpo a la gallega",
    description: "Auténtico pulpo gallego cocido a la perfección, servido sobre cama de patatas gallegas y regado con nuestro aceite de oliva virgen extra",
    image: "/FotosBar/PulpoGallega.png",
    badge: "Tradicional",
  },
  {
    id: 3,
    name: "Especial Camioneros",
    description: "Espectacular mariscada con medio bogavante, sepia, calamarcitos, navajas, almejas gallegas, mejillones y gambas a la plancha, acompañada de nuestro pan de ajo casero",
    image: "/FotosBar/Mariscada.png",
    badge: "Especialidad",
  },
  {
    id: 4,
    name: "Croquetas de Jamón Caseras",
    description: "Deliciosas croquetas de jamón ibérico",
    image: "/FotosBar/CroquetasJamón.png",
    badge: "Tapas",
  },
  {
    id: 5,
    name: "Tarta de queso",
    description: "Deliciosa tarta de queso cremoso con base de galleta artesanal y coulis de fresas frescas, el postre perfecto para cerrar cualquier comida",
    image: "/FotosBar/TartaQueso.png",
    badge: "Postre",
  },
  {
    id: 6,
    name: "Chuletón a la brasa",
    description: "Premium corte de carne seleccionado cuidadosamente, cocinado a la brasa tradicional con leña natural, servido con patatas fritas caseras y pimientos del padrón",
    image: "/FotosBar/Carne.png",
    badge: "Premium",
  },
  {
    id: 7,
    name: "Manitas de cerdo",
    description: "Manitas de cerdo tiernas, cocinadas a la perfección con un acabado dorado y sabroso, acompañadas de patatas y perejil fresco.",
    image: "/FotosBar/ManitasCerdo.png",
    badge: "Tradicional",
  },
  {
    id: 8,
    name: "Pata de pulpo",
    description: "Pata de pulpo asada a la brasa, servida sobre cama de patatas con pimentón y aceite de oliva virgen extra, un clásico gallego con un toque moderno",
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
    description: "Sepia fresca, cocinada a la plancha con su punto perfecto, servida con guarnición de patatas fritas caseras y ensalada fresca",
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
    description: "Jugoso corte de cerdo ibérico de bellota, cocinado lentamente a la brasa con leña, acompañado de patatas fritas caseras",
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
    description: "Fresca lubina cocinada a la plancha en el momento, acompañada de berenjena asada y un toque de aceite de oliva virgen extra",
    image: "/FotosBar/Lubina2.png",
    badge: "Tradicional",
  },
];

async function getDishes(): Promise<Dish[]> {
  try {
    const data = await readFile(DISHES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return DEFAULT_DISHES;
  }
}

async function saveDishes(dishes: Dish[]) {
  await writeFile(DISHES_FILE, JSON.stringify(dishes, null, 2), "utf-8");
}

export async function GET() {
  try {
    const dishes = await getDishes();
    return NextResponse.json({ success: true, dishes });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dishes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { dish, action } = await request.json();
    const dishes = await getDishes();

    if (action === "add") {
      dishes.push(dish);
    } else if (action === "update") {
      const index = dishes.findIndex((d) => d.id === dish.id);
      if (index !== -1) {
        dishes[index] = dish;
      }
    } else if (action === "delete") {
      const filtered = dishes.filter((d) => d.id !== dish.id);
      await saveDishes(filtered);
      return NextResponse.json({ success: true });
    }

    await saveDishes(dishes);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating dishes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update dishes" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const dish = await request.json();
    const dishes = await getDishes();

    const index = dishes.findIndex((d) => d.id === dish.id);
    if (index !== -1) {
      dishes[index] = dish;
    } else {
      dishes.push(dish);
    }

    await saveDishes(dishes);
    return NextResponse.json({ success: true, dish });
  } catch (error) {
    console.error("Error updating dish:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update dish" },
      { status: 500 }
    );
  }
}
