export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAnon } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const p = new URL(req.url).searchParams
  const q = p.get('q') || ''
  const chambre = p.get('chambre') || ''
  const page = parseInt(p.get('page') || '1')
  const limit = parseInt(p.get('limit') || '20')
  const db = supabaseAnon()

  let query = db.from('elus')
    .select('id,nom,prenom,chambre,groupe,groupe_label,famille_politique,departement,an_id,matricule,ep_id,en_exercice,vigiparl_elu_scores(contributions_count,score_global,score_conditions_travail,score_relations_elu,score_contenu_travail,score_remuneration,score_ambiance,recommande_pct)', { count: 'exact' })
    .eq('en_exercice', true)
    .range((page - 1) * limit, page * limit - 1)
    .order('nom')

  if (q) query = query.or(`nom.ilike.%${q}%,prenom.ilike.%${q}%`)
  if (chambre) query = query.eq('chambre', chambre.toLowerCase())

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ elus: data, total: count, page, limit })
}
