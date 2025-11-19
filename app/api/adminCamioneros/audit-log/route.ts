import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

interface AuditEntry {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  username: string;
  action: string;
  type: string;
  details: string;
}

const AUDIT_FILE = join(process.cwd(), "public/audit-log.json");

async function ensureDir() {
  try {
    await mkdir(join(process.cwd(), "public"), { recursive: true });
  } catch (error) {
    console.error("[v0] Error creating directory:", error);
  }
}

async function getLogs(): Promise<AuditEntry[]> {
  try {
    const data = await readFile(AUDIT_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveLogs(logs: AuditEntry[]) {
  await ensureDir();
  await writeFile(AUDIT_FILE, JSON.stringify(logs, null, 2), "utf-8");
}

export async function GET() {
  try {
    const logs = await getLogs();
    return NextResponse.json({ 
      success: true, 
      logs: logs.reverse() 
    });
  } catch (error) {
    console.error("[v0] Error fetching audit log:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit log" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, type, details, username } = await request.json();
    const logs = await getLogs();
    const now = new Date();
    
    const userFromRequest = username || "admin";
    
    const newEntry: AuditEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: now.toISOString(),
      date: now.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      time: now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      username: userFromRequest,
      action,
      type,
      details,
    };

    logs.push(newEntry);
    await saveLogs(logs);

    return NextResponse.json({ success: true, entry: newEntry });
  } catch (error) {
    console.error("[v0] Error creating audit log:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create audit log" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await saveLogs([]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Error clearing audit log:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear audit log" },
      { status: 500 }
    );
  }
}
