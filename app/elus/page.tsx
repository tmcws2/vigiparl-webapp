'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

type Elu = {
  id: string; nom: string; prenom: string; chambre: string
  groupe: string|null; groupe_label: string|null; famille_politique: string|null
  departement: string|null; an_id: string|null; matricule: string|null; ep_id: string|null
  photo_url: string|null; en_exercice: boolean
  vigiparl_elu_scores: { contributions_count: number; score_global: number; score_conditions_travail: number; score_relations_elu: number; score_contenu_travail: number; score_remuneration: number; score_ambiance: number; recommande_pct: number } | null
}

type EluStats = {
  tailleActuelle: number; ancienneteMoyenneMois: number|null; pctFemmes: number|null
  femmes: number; hommes: number; turnover12m: number|null
  arrivees12m: number; departs12m: number; totalMouvementsHistorique: number
}

const CHAMBRE: Record<string, { label: string; short: string; color: string; bg: string }> = {
  assemblee: { label: 'Assemblée nationale', short: 'AN', color: '#60a5fa', bg: 'rgba(96,165,250,.15)' },
  senat:     { label: 'Sénat',               short: 'SE', color: '#c084fc', bg: 'rgba(192,132,252,.15)' },
  europarl:  { label: 'Parlement européen',  short: 'PE', color: '#34d399', bg: 'rgba(52,211,153,.15)' },
}

function Badge({ chambre }: { chambre: string }) {
  const c = CHAMBRE[chambre] || { short: chambre, color: '#7a90a8', bg: 'rgba(122,144,168,.15)' }
  return <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}40`, padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600 }}>{c.short}</span>
}

function Photo({ elu }: { elu: Elu }) {
  const [err, setErr] = useState(false)
  const url = !err && elu.photo_url ? elu.photo_url : null
  return (
    <div style={{ width:'100%', height:'100%', background:'#1a2333', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', borderRadius:'inherit' }}>
      {url ? <img src={url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={() => setErr(true)} />
           : <span style={{ color:'#7a90a8', fontSize:'1rem', fontWeight:600 }}>{elu.prenom?.[0]}{elu.nom?.[0]}</span>}
    </div>
  )
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5"><span className="text-white">{label}</span><span className="text-or font-mono">{score.toFixed(1)}/5</span></div>
      <div className="score-bar"><div className="score-bar-fill" style={{ width:`${score/5*100}%` }} /></div>
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: string; value: string|null; label: string }) {
  return (
    <div className="card text-center py-4">
      <span className="text-2xl block mb-1">{icon}</span>
      <p className="font-spectral font-bold text-or text-xl">{value ?? '—'}</p>
      <p className="text-muted text-xs mt-0.5">{label}</p>
    </div>
  )
}

export default function ElusPage() {
  const [q, setQ] = useState(''); const [chambre, setChambre] = useState('')
  const [elus, setElus] = useState<Elu[]>([]); const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1); const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Elu|null>(null)
  const [eluStats, setEluStats] = useState<EluStats|null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await fetch(`/api/elus?q=${encodeURIComponent(q)}&chambre=${chambre}&page=${page}`); const d = await r.json(); setElus(d.elus||[]); setTotal(d.total||0) }
    finally { setLoading(false) }
  }, [q, chambre, page])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [q, chambre])

  useEffect(() => {
    if (!selected) { setEluStats(null); return }
    setStatsLoading(true); setEluStats(null)
    fetch(`/api/elus-stats?id=${selected.id}`).then(r=>r.json()).then(setEluStats).catch(()=>{}).finally(()=>setStatsLoading(false))
  }, [selected])

  const pages = Math.ceil(total/20)

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Nav active="observatoire" />
      <div className="flex flex-1">
        <div className={`flex flex-col border-r border-border ${selected?'hidden lg:flex lg:w-2/5':'flex-1'}`}>
          <div className="px-5 py-5 border-b border-border">
            <h1 className="h2 mb-0.5">Annuaire des élu·es</h1>
            <p className="text-muted text-sm">{total>0?`${total.toLocaleString('fr-FR')} élu·es`:'—'} · scores visibles à partir de 5 contributions</p>
          </div>
          <div className="px-5 py-4 border-b border-border space-y-3">
            <input className="input" placeholder="Rechercher un·e élu·e…" value={q} onChange={e=>setQ(e.target.value)} />
            <div className="flex gap-2">
              {[{val:'',label:'Tous',color:'#e8b84b'},{val:'assemblee',label:'AN',color:'#60a5fa'},{val:'senat',label:'Sénat',color:'#c084fc'},{val:'europarl',label:'PE',color:'#34d399'}].map(c=>(
                <button key={c.val} onClick={()=>setChambre(c.val)} className="flex-1 py-1.5 text-xs font-mono rounded-lg border transition-colors"
                  style={{ borderColor:chambre===c.val?c.color:'#1f2d42', background:chambre===c.val?`${c.color}15`:'transparent', color:chambre===c.val?c.color:'#7a90a8' }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading&&<p className="text-muted text-sm text-center py-12">Chargement…</p>}
            {!loading&&elus.length===0&&<p className="text-muted text-sm text-center py-12">Aucun résultat</p>}
            {elus.map(e=>(
              <button key={e.id} onClick={()=>setSelected(selected?.id===e.id?null:e)}
                className="w-full flex items-center gap-3 px-5 py-3.5 border-b border-border hover:bg-navy2 transition-colors text-left"
                style={{ borderLeft:selected?.id===e.id?'3px solid #e8b84b':'3px solid transparent', background:selected?.id===e.id?'#1a2333':'transparent' }}>
                <div style={{ width:40,height:40,borderRadius:'50%',flexShrink:0,overflow:'hidden' }}><Photo elu={e} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{e.prenom} {e.nom}</p>
                  <p className="text-muted text-xs truncate mt-0.5">{e.groupe&&`${e.groupe} · `}{e.chambre==='assemblee'?(e.departement||'Assemblée nationale'):e.chambre==='senat'?'Sénat':'Parlement européen'}</p>
                </div>
                <div className="flex-shrink-0">
                  {e.vigiparl_elu_scores
                    ?<div className="text-right"><p className="text-or font-mono text-sm font-medium">{e.vigiparl_elu_scores.score_global.toFixed(1)}</p><p className="text-muted text-xs">{e.vigiparl_elu_scores.contributions_count} avis</p></div>
                    :<Badge chambre={e.chambre} />}
                </div>
              </button>
            ))}
          </div>
          {pages>1&&(
            <div className="px-5 py-4 border-t border-border flex items-center justify-between">
              <button className="btn btn-ghost btn-sm" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>← Préc.</button>
              <span className="text-muted text-sm font-mono">{page} / {pages}</span>
              <button className="btn btn-ghost btn-sm" onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages}>Suiv. →</button>
            </div>
          )}
        </div>

        {selected?(
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-6 border-b border-border flex items-start gap-5">
              <div style={{ width:72,height:72,borderRadius:'50%',flexShrink:0,overflow:'hidden' }}><Photo elu={selected} /></div>
              <div className="flex-1">
                <h2 className="font-spectral font-bold text-white text-2xl">{selected.prenom} {selected.nom}</h2>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge chambre={selected.chambre} />
                  {selected.groupe&&<span className="text-muted text-sm">{selected.groupe_label||selected.groupe}</span>}
                </div>
                {selected.famille_politique&&<span className="badge badge-or mt-2 inline-flex">{selected.famille_politique}</span>}
              </div>
              <button onClick={()=>setSelected(null)} className="text-muted hover:text-white text-2xl lg:hidden" style={{ border:'none',background:'transparent',cursor:'pointer' }}>×</button>
            </div>

            <div className="px-6 py-6">
              <div className={`grid gap-3 mb-8 ${selected.chambre==='europarl'?'grid-cols-2':'grid-cols-2 sm:grid-cols-3'}`}>
                <div className="card"><p className="text-muted text-xs uppercase tracking-wide mb-1">Chambre</p><p className="text-white text-sm font-medium">{CHAMBRE[selected.chambre]?.label||selected.chambre}</p></div>
                <div className="card"><p className="text-muted text-xs uppercase tracking-wide mb-1">Groupe</p><p className="text-white text-sm">{selected.groupe_label||selected.groupe||'—'}</p></div>
                {selected.chambre!=='europarl'&&<div className="card"><p className="text-muted text-xs uppercase tracking-wide mb-1">Département</p><p className="text-white text-sm">{selected.departement||'—'}</p></div>}
                <div className="card"><p className="text-muted text-xs uppercase tracking-wide mb-1">Famille politique</p><p className="text-white text-sm">{selected.famille_politique||'—'}</p></div>
              </div>

              <h3 className="h3 mb-4">Données du cabinet</h3>
              {statsLoading?(
                <div className="card text-center py-6 mb-6"><p className="text-muted text-sm">Chargement des statistiques…</p></div>
              ):eluStats?(
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    <StatCard icon="👥" value={eluStats.tailleActuelle>0?`${eluStats.tailleActuelle}`:null} label="Collabs actifs" />
                    <StatCard icon="📅" value={eluStats.ancienneteMoyenneMois?`${eluStats.ancienneteMoyenneMois} mois`:null} label="Ancienneté moy." />
                    <StatCard icon="🔄" value={eluStats.turnover12m!==null?`${eluStats.turnover12m}%`:null} label="Turnover 12 mois" />
                    <StatCard icon="📋" value={`${eluStats.totalMouvementsHistorique}`} label="Mvts historiques" />
                  </div>
                  {eluStats.pctFemmes!==null&&(
                    <div className="card mb-5">
                      <p className="text-white font-semibold text-sm mb-3">Mixité du cabinet</p>
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span style={{ color:'#f9a8d4' }}>Femmes {eluStats.pctFemmes}%</span>
                          <span style={{ color:'#93c5fd' }}>Hommes {100-eluStats.pctFemmes}%</span>
                        </div>
                        <div style={{ height:8,borderRadius:4,overflow:'hidden',background:'#93c5fd' }}>
                          <div style={{ height:'100%',width:`${eluStats.pctFemmes}%`,background:'#f9a8d4',borderRadius:'4px 0 0 4px' }} />
                        </div>
                        <p className="text-muted text-xs mt-2">{eluStats.femmes} femme{eluStats.femmes>1?'s':''} · {eluStats.hommes} homme{eluStats.hommes>1?'s':''}</p>
                      </div>
                    </div>
                  )}
                  {(eluStats.arrivees12m>0||eluStats.departs12m>0)&&(
                    <div className="card mb-5">
                      <p className="text-white font-semibold text-sm mb-3">Mouvements sur 12 mois</p>
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                          <span style={{ color:'#34d399',fontSize:'1.4rem' }}>↗</span>
                          <div><p style={{ color:'#34d399',fontWeight:700,fontSize:'1.2rem' }}>{eluStats.arrivees12m}</p><p className="text-muted text-xs">arrivée{eluStats.arrivees12m>1?'s':''}</p></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ color:'#fc8181',fontSize:'1.4rem' }}>↘</span>
                          <div><p style={{ color:'#fc8181',fontWeight:700,fontSize:'1.2rem' }}>{eluStats.departs12m}</p><p className="text-muted text-xs">départ{eluStats.departs12m>1?'s':''}</p></div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ):(
                <div className="card text-center py-6 mb-6"><p className="text-muted text-sm">Pas de données disponibles pour ce cabinet.</p></div>
              )}

              <h3 className="h3 mb-1 mt-2">Évaluations VigieParl</h3>
              {selected.vigiparl_elu_scores?(
                <>
                  <p className="text-muted text-sm mb-5">Basé sur {selected.vigiparl_elu_scores.contributions_count} témoignages validés</p>
                  <div className="card mb-5 flex items-center gap-5">
                    <div className="text-center flex-shrink-0">
                      <p className="font-spectral font-bold text-or text-4xl">{selected.vigiparl_elu_scores.score_global.toFixed(1)}</p>
                      <p className="text-muted text-xs mt-1">/ 5</p>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Note globale</p>
                      {selected.vigiparl_elu_scores.recommande_pct!==null&&<p className="text-muted text-sm mt-1"><strong className="text-white">{selected.vigiparl_elu_scores.recommande_pct}%</strong> recommanderaient ce poste</p>}
                    </div>
                  </div>
                  <div className="card space-y-4 mb-5">
                    {[["Conditions de travail","score_conditions_travail"],["Relations avec l'élu·e","score_relations_elu"],["Contenu du travail","score_contenu_travail"],["Rémunération","score_remuneration"],["Ambiance","score_ambiance"]].map(([l,k])=>(
                      <ScoreBar key={k} label={l} score={selected.vigiparl_elu_scores![k as keyof typeof selected.vigiparl_elu_scores] as number} />
                    ))}
                  </div>
                </>
              ):(
                <div className="card text-center py-8 mb-5">
                  <span className="text-4xl block mb-3">📋</span>
                  <h3 className="h3 mb-2">Pas encore de données VigieParl</h3>
                  <p className="text-muted text-sm mb-5 max-w-xs mx-auto">Les scores s&apos;affichent dès que 5 contributions validées ont été collectées.</p>
                  <Link href="/contribuer" className="btn btn-gold btn-md">Déposer un témoignage</Link>
                </div>
              )}
              <Link href="/contribuer" className="btn btn-outline btn-md w-full justify-center mt-2">Contribuer pour {selected.prenom} {selected.nom}</Link>
            </div>
          </div>
        ):(
          <div className="hidden lg:flex flex-1 items-center justify-center text-center px-12">
            <div><span className="text-5xl block mb-3">👈</span><p className="text-muted">Sélectionnez un·e élu·e pour voir ses évaluations</p></div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
