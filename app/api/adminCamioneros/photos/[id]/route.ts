import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, unlink } from "fs/promises";
import { join } from "path";

interface PhotoMetadata {
  id: string;
  filename: string;
  path: string;
  uploadedAt: string;
  type: "menu" | "gallery";
}

const METADATA_FILE = join(process.cwd(), "public/uploads/metadata.json");

async function getMetadata(): Promise<PhotoMetadata[]> {
  try {
    const data = await readFile(METADATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveMetadata(metadata: PhotoMetadata[]) {
  try {
    await writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
  } catch (error) {
    console.error("Error saving metadata:", error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const metadata = await getMetadata();

    const photo = metadata.find((p) => p.id === id);
    if (!photo) {
      return NextResponse.json(
        { error: "Photo not found" },
        { status: 404 }
      );
    }

    // Delete file from disk
    try {
      const filepath = join(process.cwd(), "public", photo.path);
      await unlink(filepath);
    } catch (error) {
      console.error("Error deleting file:", error);
    }

    // Remove from metadata
    const updatedMetadata = metadata.filter((p) => p.id !== id);
    await saveMetadata(updatedMetadata);

    return NextResponse.json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
