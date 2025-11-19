import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

interface GalleryImage {
  id: number;
  src: string;
  title: string;
  description: string;
  badge: string;
}

const GALLERY_FILE = join(process.cwd(), "public/gallery-data.json");

async function getImages(): Promise<GalleryImage[]> {
  try {
    const data = await readFile(GALLERY_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [
      {
        id: 1,
        src: "/FotosBar/FotoBar1.png",
        title: "Los Camioneros Rubi",
        description: "Disfruta de un ambiente rústico y acogedor",
        badge: "Principal",
      },
      {
        id: 2,
        src: "/FotosBar/FotoBar2.jpg",
        title: "Rincon Familiar",
        description: "Donde las historias y las buenas bebidas se encuentran",
        badge: "Popular",
      },
      {
        id: 3,
        src: "/FotosBar/FotoBar3.jpg",
        title: "Espacio Acogedor",
        description: "El lugar perfecto para compartir nuestra comida casera",
        badge: "Favorito",
      },
      {
        id: 4,
        src: "/FotosBar/FotosBar4.jpg",
        title: "Ambiente Único",
        description: "",
        badge: "Favorito",
      },
    ];
  }
}

async function saveImages(images: GalleryImage[]) {
  await writeFile(GALLERY_FILE, JSON.stringify(images, null, 2));
}

export async function GET() {
  try {
    const images = await getImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const image = await request.json();
    const images = await getImages();

    const index = images.findIndex((i) => i.id === image.id);
    if (index !== -1) {
      images[index] = image;
    } else {
      images.push(image);
    }

    await saveImages(images);

    // Log the action
    await fetch(new URL("/api/adminCamioneros/audit-log", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: "admin",
        action: `${index !== -1 ? "Editó" : "Creó"} foto: ${image.title}`,
        type: index !== -1 ? "update" : "create",
      }),
    }).catch(() => {});

    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error("Error updating gallery:", error);
    return NextResponse.json(
      { error: "Failed to update gallery" },
      { status: 500 }
    );
  }
}
