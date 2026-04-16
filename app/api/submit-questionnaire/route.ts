export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase";
import { confirmationEmailHtml } from "@/lib/emails";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, eluId, eluNom, eluChambre, scoreConditionsTravail, scoreRelationsElu, scoreContenuTravail, scoreRemuneration, scoreAmbiance, scoreGlobal, pointsPositifs, recommande, dureesMois } = body;
    if (!sessionId || !eluId) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    const supabase = createAdminClient();
    const { data: session, error: sessionError } = await supabase.from("vigiparl_sessions").select("*").eq("id", sessionId).eq("verified", true).single();
    if (sessionError || !session) return NextResponse.json({ error: "Session non authentifiée" }, { status: 401 });
    const { count: existing } = await supabase.from("vigiparl_submissions").select("*", { count: "exact", head: true }).eq("session_id", sessionId).eq("elu_id", eluId);
    if ((existing ?? 0) > 0) return NextResponse.json({ error: "Vous avez déjà soumis un témoignage pour cet élu." }, { status: 409 });
    const { error: insertError } = await supabase.from("vigiparl_submissions").insert({ session_id: sessionId, elu_id: eluId, elu_chambre: eluChambre, score_conditions_travail: scoreConditionsTravail, score_relations_elu: scoreRelationsElu, score_contenu_travail: scoreContenuTravail, score_remuneration: scoreRemuneration, score_ambiance: scoreAmbiance, score_global: scoreGlobal, points_positifs: pointsPositifs || null, recommande: recommande ?? null, duree_mois: dureesMois || null, validated: false });
    if (insertError) return NextResponse.json({ error: "Erreur d'enregistrement" }, { status: 500 });
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: "VigieParl <no-reply@cavaparlement.eu>", to: session.email, subject: "[VigieParl] Votre témoignage a bien été reçu", html: confirmationEmailHtml(eluNom) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
