import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const DISHES_FILE = join(process.cwd(), "public/dishes-data.json");

async function getDishes() {
  try {
    const data = await readFile(DISHES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveDishes(dishes: any) {
  await writeFile(DISHES_FILE, JSON.stringify(dishes, null, 2), "utf-8");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const dishes = await getDishes();
    const filtered = dishes.filter((d: any) => d.id !== id);

    await saveDishes(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Error deleting dish:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete dish" },
      { status: 500 }
    );
  }
}
