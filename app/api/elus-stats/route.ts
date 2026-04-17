export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAnon } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const eluId = new URL(req.url).searchParams.get('id')
  if (!eluId) return NextResponse.json({ error: 'id requis' }, { status: 400 })
  const db = supabaseAnon()
  const { data: mandats } = await db.from('mandats_collaborateurs').select('collaborateur_id,date_debut,date_fin,duree_jours,collaborateurs(genre)').eq('elu_id', eluId)
  const dateRef = new Date(Date.now() - 365*24*60*60*1000).toISOString().split('T')[0]
  const { data: mouvements } = await db.from('mouvements').select('type,date,genre').eq('elu_id', eluId).gte('date', dateRef)
  const { count: totalMouvements } = await db.from('mouvements').select('*', { count: 'exact', head: true }).eq('elu_id', eluId)
  if (!mandats) return NextResponse.json({ error: 'Données indisponibles' }, { status: 500 })

  const mandatsActifs = mandats.filter((m: Record<string, unknown>) => !m.date_fin)
  const tailleActuelle = mandatsActifs.length
  const durees = mandatsActifs.map((m: Record<string, unknown>) => m.duree_jours as number|undefined).filter((d): d is number => typeof d === 'number' && d > 0)
  const ancienneteMoyenneMois = durees.length > 0 ? Math.round(durees.reduce((a,b) => a+b, 0)/durees.length/30) : null

  const genres = mandatsActifs.map((m: Record<string, unknown>) => {
    const c = m.collaborateurs as Record<string,string>|Record<string,string>[]|null
    if (!c) return null
    if (Array.isArray(c)) return c[0]?.genre || null
    return c.genre || null
  }).filter((g): g is string => typeof g === 'string')

  const femmes = genres.filter(g => g === 'F' || g === 'f' || g === 'femme').length
  const hommes = genres.filter(g => g === 'M' || g === 'm' || g === 'homme').length
  const total_genre = femmes + hommes
  const pctFemmes = total_genre > 0 ? Math.round(femmes/total_genre*100) : null

  const departs = mouvements?.filter((m: Record<string,string>) => m.type==='depart'||m.type==='fin').length || 0
  const arrivees = mouvements?.filter((m: Record<string,string>) => m.type==='arrivee'||m.type==='debut').length || 0
  const turnover12m = tailleActuelle > 0 ? Math.round(departs/Math.max(tailleActuelle,1)*100) : null

  return NextResponse.json({ tailleActuelle, ancienneteMoyenneMois, pctFemmes, femmes, hommes, turnover12m, arrivees12m: arrivees, departs12m: departs, totalMouvementsHistorique: totalMouvements||0 })
}
