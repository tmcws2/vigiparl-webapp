export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, code } = await req.json();

    if (!sessionId || !code) {
      return NextResponse.json(
        { error: "Session et code requis" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: session, error } = await supabase
      .from("vigiparl_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error || !session) {
      return NextResponse.json({ error: "Session introuvable" }, { status: 404 });
    }

    if (session.verified) {
      return NextResponse.json({ success: true, emailType: session.email_type });
    }

    if (session.otp_code === "EXPIRED" || new Date(session.expires_at) < new Date()) {
      return NextResponse.json({ error: "Code expiré. Demandez un nouveau code." }, { status: 410 });
    }

    if (session.otp_code !== code.trim()) {
      return NextResponse.json({ error: "Code incorrect" }, { status: 401 });
    }

    // Mark as verified
    await supabase
      .from("vigiparl_sessions")
      .update({ verified: true })
      .eq("id", sessionId);

    return NextResponse.json({ success: true, emailType: session.email_type });
  } catch (err) {
    console.error("verify-otp error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
