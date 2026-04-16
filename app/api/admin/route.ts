export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function checkAuth(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  const password = auth.replace('Bearer ', '')
  return password === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const db = supabaseAdmin()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'pending'

  const query = db
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

  if (status === 'pending') query.eq('validated', false)
  if (status === 'validated') query.eq('validated', true)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ submissions: data })
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id, action } = await req.json()
  if (!id || !action) return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })

  const db = supabaseAdmin()

  if (action === 'validate') {
    const { error } = await db
      .from('vigiparl_submissions')
      .update({ validated: true, validated_at: new Date().toISOString(), validated_by: 'admin' })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === 'reject') {
    const { error } = await db
      .from('vigiparl_submissions')
      .delete()
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
}
