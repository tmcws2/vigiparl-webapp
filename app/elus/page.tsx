'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

type Elu = {
  id: number; nom: string; prenom: string; chambre: string
  groupe_sigle: string | null; groupe_label: string | null
  famille_politique: string | null; departement: string | null
  an_id: string | null; matricule: string | null; ep_id: string | null
  vigiparl_elu_scores: {
    contributions_count: number; score_global: number
    score_conditions_travail: number; score_relations_elu: number
    score_contenu_travail: number; score_remuneration: number
    score_ambiance: number; recommande_pct: number
  } | null
}

const CHAMBRE_LABEL: Record<string, string> = { AN: 'Assemblée nationale', SENAT: 'Sénat', EUROPARL: 'Parlement européen' }

function photoUrl(e: Elu) {
  const base = 'https://raw.githubusercontent.com/cavaparlement/cavaparlement-bot/main/photos'
  if (e.chambre === 'AN' && e.an_id) return `${base}/assemblee/${e.an_id}.jpg`
  if (e.chambre === 'SENAT' && e.matricule) return `${base}/senat/${e.matricule}.jpg`
  if (e.chambre === 'EUROPARL' && e.ep_id) return `${base}/europarl/${e.ep_id}.jpg`
  return null
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-white">{label}</span>
        <span className="text-or font-mono">{score.toFixed(1)}/5</span>
      </div>
      <div className="score-bar"><div className="score-bar-fill" style={{ width: `${score / 5 * 100}%` }} /></div>
    </div>
  )
}

export default function ElusPage() {
  const [q, setQ] = useState(''); const [chambre, setChambre] = useState('')
  const [elus, setElus] = useState<Elu[]>([]); const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1); const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Elu | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(`/api/elus?q=${encodeURIComponent(q)}&chambre=${chambre}&page=${page}`)
      const d = await r.json()
      setElus(d.elus || []); setTotal(d.total || 0)
    } finally { setLoading(false) }
  }, [q, chambre, page])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [q, chambre])

  const pages = Math.ceil(total / 20)

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Nav active="observatoire" />
      <div className="flex flex-1">
        {/* List */}
        <div className={`flex flex-col border-r border-border ${selected ? 'hidden lg:flex lg:w-2/5' : 'flex-1'}`}>
          <div className="px-5 py-5 border-b border-border">
            <h1 className="h2 mb-0.5">Annuaire des élu·es</h1>
            <p className="text-muted text-sm">{total > 0 ? `${total.toLocaleString('fr-FR')} élu·es` : '—'} · scores visibles à partir de 5 contributions</p>
          </div>
          <div className="px-5 py-4 border-b border-border space-y-3">
            <input className="input" placeholder="Rechercher un·e élu·e…" value={q} onChange={e => setQ(e.target.value)} />
            <div className="flex gap-2">
              {['', 'AN', 'SENAT', 'EUROPARL'].map(c => (
                <button key={c} onClick={() => setChambre(c)}
                  className={`flex-1 py-1.5 text-xs font-mono rounded-lg border transition-colors ${chambre === c ? 'border-or text-or bg-or/10' : 'border-border text-muted hover:border-muted'}`}>
                  {c || 'Toutes'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading && <p className="text-muted text-sm text-center py-12">Chargement…</p>}
            {!loading && elus.length === 0 && <p className="text-muted text-sm text-center py-12">Aucun résultat</p>}
            {!loading && elus.map(e => {
              const sc = e.vigiparl_elu_scores
              const photo = photoUrl(e)
              return (
                <button key={e.id} onClick={() => setSelected(selected?.id === e.id ? null : e)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 border-b border-border hover:bg-navy2 transition-colors text-left ${selected?.id === e.id ? 'bg-navy2 border-l-2 border-l-or' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-navy3 flex-shrink-0 overflow-hidden flex items-center justify-center text-sm text-muted font-medium">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt="" className="w-full h-full object-cover"
                        onError={ev => { (ev.target as HTMLImageElement).style.display = 'none' }} />
                    ) : `${e.prenom[0]}${e.nom[0]}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{e.prenom} {e.nom}</p>
                    <p className="text-muted text-xs truncate mt-0.5">{e.groupe_sigle && `${e.groupe_sigle} · `}{e.departement || CHAMBRE_LABEL[e.chambre]}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    {sc ? (
                      <><p className="text-or font-mono text-sm font-medium">{sc.score_global.toFixed(1)}</p>
                      <p className="text-muted text-xs">{sc.contributions_count} avis</p></>
                    ) : (
                      <span className={`badge text-xs ${e.chambre === 'AN' ? 'badge-an' : e.chambre === 'SENAT' ? 'badge-senat' : 'badge-pe'}`}>{e.chambre}</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          {pages > 1 && (
            <div className="px-5 py-4 border-t border-border flex items-center justify-between">
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Préc.</button>
              <span className="text-muted text-sm font-mono">{page} / {pages}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>Suiv. →</button>
            </div>
          )}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-6 border-b border-border flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-navy3 flex-shrink-0 overflow-hidden flex items-center justify-center text-xl text-muted font-medium">
                {photoUrl(selected) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoUrl(selected)!} alt="" className="w-full h-full object-cover"
                    onError={ev => { (ev.target as HTMLImageElement).style.display = 'none' }} />
                ) : `${selected.prenom[0]}${selected.nom[0]}`}
              </div>
              <div className="flex-1">
                <h2 className="font-spectral font-bold text-white text-2xl">{selected.prenom} {selected.nom}</h2>
                <p className="text-muted text-sm mt-1">{CHAMBRE_LABEL[selected.chambre]}</p>
                {selected.famille_politique && <span className="badge badge-or mt-2">{selected.famille_politique}</span>}
              </div>
              <button onClick={() => setSelected(null)} className="text-muted hover:text-white text-2xl lg:hidden">×</button>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { l: 'Chambre',          v: CHAMBRE_LABEL[selected.chambre] },
                  { l: 'Groupe',           v: selected.groupe_label || selected.groupe_sigle || '—' },
                  { l: 'Famille pol.',     v: selected.famille_politique || '—' },
                  { l: 'Département',      v: selected.departement || '—' },
                ].map(it => (
                  <div key={it.l} className="card">
                    <p className="text-muted text-xs uppercase tracking-wide mb-1">{it.l}</p>
                    <p className="text-white text-sm">{it.v}</p>
                  </div>
                ))}
              </div>

              {selected.vigiparl_elu_scores ? (
                <>
                  <h3 className="h3 mb-1">Évaluations des collaborateurs</h3>
                  <p className="text-muted text-sm mb-6">Basé sur {selected.vigiparl_elu_scores.contributions_count} témoignages validés</p>

                  <div className="card mb-5 flex items-center gap-5">
                    <div className="text-center flex-shrink-0">
                      <p className="font-spectral font-bold text-or text-4xl">{selected.vigiparl_elu_scores.score_global.toFixed(1)}</p>
                      <p className="text-muted text-xs mt-1">/ 5</p>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Note globale</p>
                      {selected.vigiparl_elu_scores.recommande_pct !== null && (
                        <p className="text-muted text-sm mt-1">
                          <strong className="text-white">{selected.vigiparl_elu_scores.recommande_pct}%</strong> recommanderaient ce poste
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="card space-y-4 mb-5">
                    {[
                      { label: 'Conditions de travail', key: 'score_conditions_travail' },
                      { label: "Relations avec l'élu·e", key: 'score_relations_elu' },
                      { label: 'Contenu du travail', key: 'score_contenu_travail' },
                      { label: 'Rémunération', key: 'score_remuneration' },
                      { label: 'Ambiance', key: 'score_ambiance' },
                    ].map(it => (
                      <ScoreBar key={it.key} label={it.label}
                        score={selected.vigiparl_elu_scores![it.key as keyof typeof selected.vigiparl_elu_scores] as number} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="card text-center py-10">
                  <span className="text-4xl block mb-3">📋</span>
                  <h3 className="h3 mb-2">Pas encore de données</h3>
                  <p className="text-muted text-sm mb-5 max-w-xs mx-auto">Les scores s&apos;affichent dès que 5 contributions validées ont été collectées.</p>
                  <Link href="/contribuer" className="btn btn-gold btn-md">📝 Déposer un témoignage</Link>
                </div>
              )}

              <Link href="/contribuer" className="btn btn-outline btn-md w-full justify-center mt-2">
                📝 Contribuer pour {selected.prenom} {selected.nom}
              </Link>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center text-center px-12">
            <div>
              <span className="text-5xl block mb-3">👈</span>
              <p className="text-muted">Sélectionnez un·e élu·e pour voir ses évaluations</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
