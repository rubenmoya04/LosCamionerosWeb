import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";

interface PhotoMetadata {
  id: string;
  filename: string;
  path: string;
  uploadedAt: string;
  type: "menu" | "gallery";
}

const UPLOAD_DIR = join(process.cwd(), "public/uploads");
const METADATA_FILE = join(process.cwd(), "public/uploads/metadata.json");

async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating upload directory:", error);
  }
}

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

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir();

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const type = formData.get("type") as "menu" | "gallery";

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    if (!type || (type !== "menu" && type !== "gallery")) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const uploadedPhotos: PhotoMetadata[] = [];
    const metadata = await getMetadata();

    for (const file of files) {
      try {
        const buffer = await file.arrayBuffer();
        const photoId = randomBytes(8).toString("hex");
        const ext = file.name.split(".").pop() || "jpg";
        const filename = `${photoId}.${ext}`;
        const filepath = join(UPLOAD_DIR, filename);

        await writeFile(filepath, Buffer.from(buffer));

        const photoMeta: PhotoMetadata = {
          id: photoId,
          filename: file.name,
          path: `/uploads/${filename}`,
          uploadedAt: new Date().toISOString(),
          type,
        };

        metadata.push(photoMeta);
        uploadedPhotos.push(photoMeta);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }

    await saveMetadata(metadata);

    return NextResponse.json(
      {
        message: "Files uploaded successfully",
        photos: uploadedPhotos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
