import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Simple file-based storage for MVP validation
// Replace with Supabase or Vercel KV when scaling
const DATA_FILE = path.join(process.cwd(), "signups.json");

async function getSignups(): Promise<Array<Record<string, string>>> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, situation, type } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const signups = await getSignups();

    if (type === "persona_update") {
      // Update existing signup with persona selection
      const existing = signups.find((s) => s.email === email);
      if (existing) {
        existing.situation = situation;
        existing.persona_updated_at = new Date().toISOString();
      }
    } else {
      // New signup
      signups.push({
        email,
        situation: situation || "",
        signed_up_at: new Date().toISOString(),
        source: "website",
      });
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(signups, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Simple admin endpoint to check signups
  const signups = await getSignups();
  return NextResponse.json({
    total: signups.length,
    signups,
  });
}
