// app/api/adminCamioneros/audit-log/route.ts
import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const KEY = "audit_log";

export async function GET() {
  try {
    const logs = (await kv.get(KEY)) || [];
    return NextResponse.json({ success: true, logs: logs.reverse() });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, type, details, username } = await request.json();
    const now = new Date();

    const newEntry = {
      id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      timestamp: now.toISOString(),
      date: now.toLocaleDateString("es-ES"),
      time: now.toLocaleTimeString("es-ES"),
      username: username || "admin",
      action,
      type,
      details,
    };

    const existing = (await kv.get(KEY)) || [];
    await kv.set(KEY, [newEntry, ...existing]);

    return NextResponse.json({ success: true, entry: newEntry });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE() {
  await kv.del(KEY);
  return NextResponse.json({ success: true });
}
