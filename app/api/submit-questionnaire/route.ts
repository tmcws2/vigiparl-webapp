export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import { confirmEmail } from '@/lib/emails'

export async function POST(req: NextRequest) {
  try {
    const b = await req.json()
    const db = supabaseAdmin()

    // Vérifier session
    const { data: s } = await db
      .from('vigiparl_sessions')
      .select('*')
      .eq('id', b.sessionId)
      .eq('verified', true)
      .single()
    if (!s) return NextResponse.json({ error: 'Session non authentifiée' }, { status: 401 })

    // Anti-doublon
    const { count } = await db
      .from('vigiparl_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', b.sessionId)
      .eq('elu_id', b.eluId)
    if ((count ?? 0) > 0)
      return NextResponse.json({ error: 'Témoignage déjà soumis pour cet élu.' }, { status: 409 })

    // Enregistrement
    const scoreGlobal = Math.round(
      (b.scoreConditions + b.scoreManagement + b.scoreAmbiance + b.scoreEquilibre + b.scoreCharge) / 5
    )
    const { error } = await db.from('vigiparl_submissions').insert({
      session_id: b.sessionId,
      elu_id: b.eluId,
      elu_chambre: b.eluChambre,
      score_conditions_travail: b.scoreConditions,
      score_relations_elu: b.scoreManagement,
      score_contenu_travail: b.scoreCharge,
      score_remuneration: b.scoreSalaire,
      score_ambiance: b.scoreAmbiance,
      score_global: scoreGlobal,
      points_positifs: b.temoignage || null,
      recommande: b.recommande ?? null,
      duree_mois: b.dureesMois || null,
      validated: false,
    })
    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: "Erreur d'enregistrement: " + error.message }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Email de confirmation au collab
    await resend.emails.send({
      from: 'VigieParl <no-reply@vigiparl.cavaparlement.eu>',
      to: s.email,
      subject: '[VigieParl] Votre témoignage a bien été reçu',
      html: confirmEmail(b.eluNom),
    })

    // Notification admin
    await resend.emails.send({
      from: 'VigieParl <no-reply@vigiparl.cavaparlement.eu>',
      to: 'hello@cavaparlement.eu',
      subject: `[VigieParl] Nouveau témoignage — ${b.eluNom}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:40px auto;background:#161e2d;border:1px solid #1f2d42;border-radius:12px;overflow:hidden">
          <div style="background:#e8b84b;padding:20px 28px">
            <h2 style="margin:0;color:#0d1117;font-size:1.1rem">🛡️ VigieParl — Nouveau témoignage</h2>
          </div>
          <div style="padding:28px;color:#f0f4f8">
            <p><strong>Élu·e :</strong> ${b.eluNom} (${b.eluChambre})</p>
            <p><strong>Note globale :</strong> ${scoreGlobal}/5</p>
            <p><strong>Conditions :</strong> ${b.scoreConditions}/5 · <strong>Management :</strong> ${b.scoreManagement}/5 · <strong>Ambiance :</strong> ${b.scoreAmbiance}/5</p>
            <p><strong>Recommande :</strong> ${b.recommande ? 'Oui ✅' : 'Non ❌'}</p>
            <p><strong>Durée :</strong> ${b.dureesMois ? b.dureesMois + ' mois' : 'non renseignée'}</p>
            ${b.temoignage ? `<p><strong>Témoignage :</strong><br/><em style="color:#7a90a8">${b.temoignage}</em></p>` : ''}
            <div style="margin-top:20px">
              <a href="https://supabase.com/dashboard/project/pmnlfzwfolqeoxaottit/editor" 
                style="background:#e8b84b;color:#0d1117;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
                Valider dans Supabase →
              </a>
            </div>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('submit error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
