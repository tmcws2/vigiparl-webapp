'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

type Stats = {
  vigiparl: { noteMoyenne: number|null; totalContributions: number; elusAvecScores: number; moyennesParCritere: Record<string, number|null> }
  global: { elusActifs: number|null; collabsActifs: number|null; ancienneteMoyenneMois: number|null; tailleMoyenne: number|null; turnoverMoyen: number|null }
}

function ScoreBar({ label, score }: { label: string; score: number|null }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-white text-sm">{label}</span>
        {score !== null ? <span className="text-or font-mono text-sm">{score.toFixed(1)}/5</span> : <span className="text-muted text-xs">en cours</span>}
      </div>
      <div className="score-bar"><div className="score-bar-fill" style={{ width: score ? `${score/5*100}%` : '0%' }} /></div>
    </div>
  )
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats|null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { fetch('/api/stats').then(r=>r.json()).then(setStats).catch(()=>{}).finally(()=>setLoading(false)) }, [])
  const n = stats?.vigiparl.noteMoyenne
  const t = stats?.global.tailleMoyenne
  const a = stats?.global.ancienneteMoyenneMois
  const tv = stats?.global.turnoverMoyen
  const contribs = stats?.vigiparl.totalContributions || 0
  const hasData = contribs >= 10

  const KPI = ({ icon, value, label, sub, prov }: { icon:string; value:string|null; label:string; sub:string; prov?:boolean }) => (
    <div className="card text-center relative">
      {prov && <span className="absolute top-2 right-2 badge badge-or" style={{fontSize:'0.65rem'}}>provisoire</span>}
      <span className="text-3xl block mb-3">{icon}</span>
      {value ? <p className="font-spectral font-bold text-2xl text-or">{value}</p> : <p className="font-spectral font-bold text-lg text-muted">{loading?'…':'En cours'}</p>}
      <p className="text-white text-sm font-medium mt-1">{label}</p>
      <p className="text-muted text-xs mt-0.5">{sub}</p>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-navy">
      <Nav active="observatoire" />

      <section className="section text-center">
        <div className="page-container flex flex-col items-center">
          <span className="badge badge-or mb-6 anim anim-1">🛡️ Observatoire indépendant</span>
          <h1 className="h1 anim anim-2 mb-2">Observatoire</h1>
          <h1 className="h1 anim anim-3 text-or mb-5">des cabinets parlementaires</h1>
          <p className="lead max-w-xl anim anim-4 mb-8">Données publiques, feedback structuré des collaborateur·rices et analyse agrégée pour une transparence fiable sur la vie interne des cabinets.</p>
          <div className="flex flex-wrap gap-3 justify-center anim anim-5">
            <Link href="/contribuer" className="btn btn-gold btn-lg">Contribuer anonymement →</Link>
            <Link href="/elus" className="btn btn-outline btn-lg">Explorer les données</Link>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="page-container grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KPI icon="📊" value={n?`${n}/5`:null} label="Note moyenne" sub="conditions de travail" prov={!hasData&&n!==null} />
          <KPI icon="🔄" value={tv?`${tv} mvt/élu`:null} label="Turnover moyen" sub="sur 12 mois" />
          <KPI icon="👥" value={t?`${t}`:null} label="Taille moyenne" sub="collaborateurs / cabinet" />
          <KPI icon="📅" value={a?`${a} mois`:null} label="Ancienneté moyenne" sub="des collaborateurs" />
        </div>
        {!loading && !hasData && (
          <div className="page-container mt-4">
            <div className="alert-or text-sm text-muted text-center rounded-xl py-3 px-4">
              📊 Les statistiques VigieParl sont en cours de collecte ({contribs} contribution{contribs>1?'s':''} reçue{contribs>1?'s':''}).
              Les données seront affichées à partir de 10 contributions validées.{' '}
              <Link href="/contribuer" className="text-or hover:underline font-medium">Contribuer →</Link>
            </div>
          </div>
        )}
      </section>

      <section className="section bg-navy2">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="h2 mb-2">Observatoire national</h2>
            <p className="lead">Moyennes agrégées sur l&apos;ensemble des contributions — mise à jour continue.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="card">
              <h3 className="h3 mb-5">Moyennes nationales</h3>
              {!loading && hasData ? (
                <div className="space-y-4">
                  {[['conditions','Conditions de travail'],['relations','Management'],['contenu','Charge de travail'],['ambiance','Ambiance'],['remuneration','Rémunération']].map(([k,l]) => (
                    <ScoreBar key={k} label={l} score={stats?.vigiparl.moyennesParCritere[k]??null} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3">⏳</p>
                  <p className="text-muted text-sm mb-4">{loading?'Chargement…':'Les moyennes apparaîtront dès que suffisamment de contributions auront été validées.'}</p>
                  {!loading && <Link href="/contribuer" className="btn btn-gold btn-sm inline-flex">Contribuer →</Link>}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-5">
              <div className="card">
                <h3 className="h3 mb-4">Tendances &amp; insights</h3>
                <p className="text-muted text-sm">Les tendances seront disponibles dès que les données seront suffisantes.</p>
                <p className="text-muted text-xs mt-4">Basé sur les contributions agrégées · Minimum 5 réponses par fiche</p>
              </div>
              <div className="card">
                <h3 className="h3 mb-4">Comparaisons</h3>
                {[{label:'Assemblée nationale',color:'#60a5fa'},{label:'Sénat',color:'#c084fc'},{label:'Parlement européen',color:'#34d399'}].map(c => (
                  <div key={c.label} className="flex justify-between items-center py-2.5 border-b border-border last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{background:c.color}} />
                      <span className="text-white text-sm">{c.label}</span>
                    </div>
                    <span className="text-muted text-sm">—</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="h2 mb-2">Comment ça marche ?</h2>
            <p className="lead">VigieParl combine données publiques et feedback structuré pour une vision complète.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[{icon:'📊',title:'Données publiques',desc:'Turnover, taille des cabinets, ancienneté — via Cavaparlement.eu et dataparl.io'},{icon:'💬',title:'Feedback structuré',desc:'Collaborateur·rices notent anonymement leur expérience en cabinet'},{icon:'👁️',title:'Analyse agrégée',desc:'Fiches parlementaires avec scores, insights et tendances'}].map(c => (
              <div key={c.title} className="card text-center">
                <span className="text-3xl text-or block mb-4">{c.icon}</span>
                <h3 className="h3 mb-2">{c.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-navy2">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="text-3xl text-or block mb-4">🔒</span>
            <h2 className="h2 mb-2">Nos engagements</h2>
            <p className="lead">Observatoire basé sur des données agrégées et anonymisées.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[{icon:'🔒',title:'Anonymat total',desc:'Aucune donnée personnelle visible, aucune identification possible.'},{icon:'📋',title:'Modération stricte',desc:"Tous les témoignages sont relus. Aucun verbatim n'est publié sur le site."},{icon:'⚠️',title:'Aucune accusation',desc:"Pas de noms, pas de faits non vérifiables, pas d'accusations directes."},{icon:'📊',title:'Seuil minimum',desc:'Minimum 5 contributions pour afficher une fiche parlementaire.'}].map(e => (
              <div key={e.title} className="card flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{e.icon}</span>
                <div><h3 className="text-white font-semibold mb-1">{e.title}</h3><p className="text-muted text-sm leading-relaxed">{e.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <h2 className="h2 text-center mb-3">Une approche différente</h2>
          <p className="lead text-center mb-10 max-w-xl mx-auto">Contrairement aux plateformes d&apos;avis en ligne génériques, VigieParl est conçu spécifiquement pour les cabinets parlementaires, avec des garanties d&apos;anonymat et une modération stricte.</p>
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <div className="card text-center">
              <span className="text-3xl block mb-4">💬</span>
              <h3 className="h3 mb-2">Plateformes génériques</h3>
              <p className="text-muted text-sm leading-relaxed">Avis non vérifiés, sans contexte parlementaire, souvent biaisés et sans modération rigoureuse.</p>
            </div>
            <div className="card text-center border-or">
              <span className="text-3xl block mb-4">🛡️</span>
              <h3 className="text-or font-spectral font-semibold text-lg mb-2">VigieParl</h3>
              <p className="text-muted text-sm leading-relaxed">Data structurée + vérification institutionnelle + modération manuelle + anonymisation complète.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-navy2 text-center">
        <div className="page-container">
          <h2 className="h2 mb-3">Vous êtes collaborateur·rice parlementaire ?</h2>
          <p className="lead mb-8">Contribuez anonymement en 2 minutes. Votre expérience compte.</p>
          <Link href="/contribuer" className="btn btn-gold btn-lg">Contribuer maintenant →</Link>
        </div>
      </section>
      <Footer />
    </div>
  )
}
