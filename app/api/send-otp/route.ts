export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient, detectEmailType, emailTypeLabel } from "@/lib/supabase";
import { otpEmailHtml } from "@/lib/emails";

function generateOTP(): string { return Math.floor(100000 + Math.random() * 900000).toString(); }

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });
    const emailType = detectEmailType(email.trim().toLowerCase());
    if (!emailType) return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 });
    const supabase = createAdminClient();
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { count } = await supabase.from("vigiparl_sessions").select("*", { count: "exact", head: true }).eq("email", email.trim().toLowerCase()).gte("created_at", oneHourAgo);
    if ((count ?? 0) >= 3) return NextResponse.json({ error: "Trop de tentatives. Réessayez dans une heure." }, { status: 429 });
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await supabase.from("vigiparl_sessions").update({ otp_code: "EXPIRED" }).eq("email", email.trim().toLowerCase()).eq("verified", false);
    const { data: session, error: insertError } = await supabase.from("vigiparl_sessions").insert({ email: email.trim().toLowerCase(), email_type: emailType, otp_code: code, expires_at: expiresAt, verified: false }).select("id").single();
    if (insertError) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: "VigieParl <no-reply@cavaparlement.eu>", to: email.trim(), subject: `[VigieParl] Votre code de vérification : ${code}`, html: otpEmailHtml(code, emailTypeLabel(emailType)) });
    return NextResponse.json({ success: true, sessionId: session.id, emailType });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
