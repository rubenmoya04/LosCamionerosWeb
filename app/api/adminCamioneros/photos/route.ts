import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") as "menu" | "gallery" | null;

    const metadata = await getMetadata();

    if (type) {
      const filtered = metadata.filter((photo) => photo.type === type);
      return NextResponse.json(filtered);
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error reading metadata:", error);
    return NextResponse.json([], { status: 200 });
  }
}
