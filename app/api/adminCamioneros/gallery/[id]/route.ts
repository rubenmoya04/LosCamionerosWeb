import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { unlink } from "fs/promises";

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
    return [];
  }
}

async function saveImages(images: GalleryImage[]) {
  await writeFile(GALLERY_FILE, JSON.stringify(images, null, 2));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const images = await getImages();
    const imageToDelete = images.find((i) => i.id === id);

    const filteredImages = images.filter((i) => i.id !== id);
    await saveImages(filteredImages);

    // Delete the image file if it exists
    if (imageToDelete?.src && imageToDelete.src.startsWith("/uploads/")) {
      try {
        const filePath = join(process.cwd(), "public", imageToDelete.src);
        await unlink(filePath);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    // Log the action
    await fetch(new URL("/api/adminCamioneros/audit-log", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: "admin",
        action: `Eliminó foto: ${imageToDelete?.title}`,
        type: "delete",
      }),
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}
