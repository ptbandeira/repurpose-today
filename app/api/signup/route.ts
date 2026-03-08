import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, situation, type } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    if (type === "persona_update") {
      const { error } = await supabase
        .from("rt_signups")
        .update({ situation, persona_updated_at: new Date().toISOString() })
        .eq("email", email);

      if (error) {
        console.error("Persona update error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
      }
    } else {
      const { error } = await supabase.from("rt_signups").upsert(
        {
          email,
          situation: situation || null,
          source: "website",
        },
        { onConflict: "email" }
      );

      if (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Signup failed" }, { status: 500 });
      }
    }

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
  const { data, error } = await supabase
    .from("rt_signups")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    total: data?.length ?? 0,
    signups: data,
  });
}
