export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { supabaseAnon } from '@/lib/supabase'

export async function GET() {
  try {
    const db = supabaseAnon()
    const { data: scores } = await db.from('vigiparl_elu_scores').select('score_global,score_conditions_travail,score_relations_elu,score_contenu_travail,score_remuneration,score_ambiance,recommande_pct,contributions_count').gte('contributions_count', 5)
    const { data: mandats } = await db.from('mandats_collaborateurs').select('duree_jours').eq('actif', true)
    const { count: mouvementsCount } = await db.from('mouvements').select('*', { count: 'exact', head: true }).gte('date', new Date(Date.now() - 365*24*60*60*1000).toISOString().split('T')[0])
    const { count: elusCount } = await db.from('elus').select('*', { count: 'exact', head: true }).eq('en_exercice', true)
    const { count: collabsCount } = await db.from('mandats_collaborateurs').select('*', { count: 'exact', head: true }).eq('actif', true)
    let noteMoyenne = null, recommandePct = null, totalContributions = 0
    const moyennesParCritere: Record<string, number|null> = { conditions: null, relations: null, contenu: null, remuneration: null, ambiance: null }
    if (scores && scores.length > 0) {
      const globals = scores.map(s => s.score_global).filter(Boolean)
      noteMoyenne = globals.length > 0 ? Math.round(globals.reduce((a,b) => a+b,0)/globals.length*10)/10 : null
      const recs = scores.map(s => s.recommande_pct).filter(v => v !== null)
      recommandePct = recs.length > 0 ? Math.round(recs.reduce((a,b) => a+b,0)/recs.length) : null
      totalContributions = scores.reduce((a,s) => a+(s.contributions_count||0),0)
      const keys: Record<string, string> = { conditions: 'score_conditions_travail', relations: 'score_relations_elu', contenu: 'score_contenu_travail', remuneration: 'score_remuneration', ambiance: 'score_ambiance' }
      Object.entries(keys).forEach(([k, col]) => {
        const vals = scores.map((s: Record<string, number>) => s[col]).filter(Boolean)
        moyennesParCritere[k] = vals.length > 0 ? Math.round(vals.reduce((a,b) => a+b,0)/vals.length*10)/10 : null
      })
    }
    const durees = mandats?.map(m => m.duree_jours).filter(d => d && d > 0) || []
    const ancienneteMoyenneMois = durees.length > 0 ? Math.round(durees.reduce((a,b) => a+b,0)/durees.length/30) : null
    const tailleMoyenne = (elusCount && collabsCount && elusCount > 0) ? Math.round(collabsCount/elusCount*10)/10 : null
    const turnoverMoyen = (mouvementsCount && elusCount && elusCount > 0) ? Math.round(mouvementsCount/elusCount*100)/100 : null
    return NextResponse.json({
      vigiparl: { noteMoyenne, recommandePct, totalContributions, elusAvecScores: scores?.length||0, moyennesParCritere },
      global: { elusActifs: elusCount, collabsActifs: collabsCount, ancienneteMoyenneMois, tailleMoyenne, turnoverMoyen }
    })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
