export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { supabaseAdmin } from '@/lib/supabase'
import { adminActionSchema } from '@/lib/validators'

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('vigiparl_admin_token')?.value
  if (!token) return false
  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const db = supabaseAdmin()
  const status = new URL(req.url).searchParams.get('status') || 'pending'

  let query = db
    .from('vigiparl_submissions')
    .select(`
      id, submitted_at, validated, validated_at,
      elu_chambre, score_conditions_travail, score_relations_elu,
      score_contenu_travail, score_remuneration, score_ambiance,
      score_global, recommande, duree_mois, points_positifs,
      elus ( nom, prenom, groupe, groupe_label, departement ),
      vigiparl_sessions ( email, email_type )
    `)
    .order('submitted_at', { ascending: false })

  if (status === 'pending') query = query.eq('validated', false)
  if (status === 'validated') query = query.eq('validated', true)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ submissions: data })
}

export async function PATCH(req: NextRequest) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = adminActionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }
  const { id, action } = parsed.data

  const db = supabaseAdmin()

  if (action === 'validate') {
    const { error } = await db
      .from('vigiparl_submissions')
      .update({ validated: true, validated_at: new Date().toISOString(), validated_by: 'admin' })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Point 5 : Audit log
    try { await db.from('audit_logs').insert({
      action:      'submission_validated',
      entity_type: 'vigiparl_submissions',
      entity_id:   id,
      ip_address:  req.headers.get('x-forwarded-for'),
    }) } catch {}

    return NextResponse.json({ success: true })
  }

  if (action === 'reject') {
    // Point 5 : Audit log avant suppression
    try { await db.from('audit_logs').insert({
      action:      'submission_rejected',
      entity_type: 'vigiparl_submissions',
      entity_id:   id,
      ip_address:  req.headers.get('x-forwarded-for'),
    }) } catch {}

    const { error } = await db.from('vigiparl_submissions').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
}
