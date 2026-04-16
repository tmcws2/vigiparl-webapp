import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const SCORES = [
  { label: 'Conditions de travail', score: 3.2 },
  { label: 'Management',            score: 2.8 },
  { label: 'Charge de travail',     score: 2.4 },
  { label: 'Ambiance',              score: 3.5 },
  { label: 'Équilibre vie pro/perso', score: 2.1 },
  { label: 'Salaire',               score: 2.6 },
]

const TENDANCES = [
  { text: 'Charge de travail globalement élevée', color: '#fc8181', bg: 'rgba(252,129,129,.12)', border: 'rgba(252,129,129,.3)' },
  { text: 'Écarts importants entre cabinets',     color: '#fbd38d', bg: 'rgba(251,211,141,.1)',  border: 'rgba(251,211,141,.25)' },
  { text: 'Ambiance jugée positivement',          color: '#68d391', bg: 'rgba(104,211,145,.1)',  border: 'rgba(104,211,145,.25)' },
  { text: 'Turnover en hausse',                   color: '#fc8181', bg: 'rgba(252,129,129,.12)', border: 'rgba(252,129,129,.3)' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-navy">
      <Nav active="observatoire" />

      {/* ── HERO ── */}
      <section className="section text-center">
        <div className="page-container flex flex-col items-center">
          <span className="badge badge-or mb-6 anim anim-1">
            🛡️ Observatoire indépendant
          </span>

          <h1 className="h1 anim anim-2 mb-2">Observatoire</h1>
          <h1 className="h1 anim anim-3 text-or mb-5">
            des cabinets parlementaires
          </h1>

          <p className="lead max-w-xl anim anim-4 mb-8">
            Données publiques, feedback structuré des collaborateur·rices et analyse
            agrégée pour une transparence fiable sur la vie interne des cabinets.
          </p>

          <div className="flex flex-wrap gap-3 justify-center anim anim-5">
            <Link href="/contribuer" className="btn btn-gold btn-lg">
              Contribuer anonymement →
            </Link>
            <Link href="/elus" className="btn btn-outline btn-lg">
              Explorer les données
            </Link>
          </div>
        </div>
      </section>

      {/* ── KPI CARDS ── */}
      <section className="pb-16">
        <div className="page-container grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '📊', value: '3.2',     label: 'Note moyenne',      sub: 'conditions de travail' },
            { icon: '🔄', value: '34%',     label: 'Turnover moyen',    sub: 'sur 12 mois' },
            { icon: '👥', value: '2.8',     label: 'Taille moyenne',    sub: 'collaborateurs / cabinet' },
            { icon: '📅', value: '14 mois', label: 'Ancienneté moyenne', sub: 'des collaborateurs' },
          ].map(kpi => (
            <div key={kpi.label} className="card text-center">
              <span className="text-3xl block mb-3">{kpi.icon}</span>
              <p className="font-spectral font-bold text-2xl text-or">{kpi.value}</p>
              <p className="text-white text-sm font-medium mt-1">{kpi.label}</p>
              <p className="text-muted text-xs mt-0.5">{kpi.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OBSERVATOIRE NATIONAL ── */}
      <section className="section bg-navy2">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="h2 mb-2">Observatoire national</h2>
            <p className="lead">Moyennes agrégées sur l&apos;ensemble des contributions — mise à jour continue.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Moyennes */}
            <div className="card">
              <h3 className="h3 mb-5">Moyennes nationales</h3>
              <div className="space-y-4">
                {SCORES.map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-white text-sm">{s.label}</span>
                      <span className="text-or font-mono text-sm">{s.score}/5</span>
                    </div>
                    <div className="score-bar">
                      <div className="score-bar-fill" style={{ width: `${s.score / 5 * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {/* Tendances */}
              <div className="card">
                <h3 className="h3 mb-4">Tendances &amp; insights</h3>
                <div className="flex flex-wrap gap-2">
                  {TENDANCES.map(t => (
                    <span key={t.text} className="text-xs px-3 py-1.5 rounded-full"
                      style={{ background: t.bg, color: t.color, border: `1px solid ${t.border}` }}>
                      {t.text}
                    </span>
                  ))}
                </div>
                <p className="text-muted text-xs mt-4">
                  Basé sur les contributions agrégées · Minimum 5 réponses par fiche
                </p>
              </div>

              {/* Comparaisons */}
              <div className="card">
                <h3 className="h3 mb-4">Comparaisons</h3>
                {[
                  { label: 'Assemblée nationale', score: '3.1/5' },
                  { label: 'Sénat',               score: '3.4/5' },
                  { label: 'Parlement européen',  score: '3.7/5' },
                ].map(c => (
                  <div key={c.label}
                    className="flex justify-between items-center py-2.5 border-b border-border last:border-0">
                    <span className="text-white text-sm">{c.label}</span>
                    <span className="text-or font-mono font-medium">{c.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="section">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="h2 mb-2">Comment ça marche ?</h2>
            <p className="lead">VigieParl combine données publiques et feedback structuré pour une vision complète.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: '📊', title: 'Données publiques',   desc: 'Turnover, taille des cabinets, ancienneté — via Cavaparlement.eu et dataparl.io' },
              { icon: '💬', title: 'Feedback structuré',  desc: 'Collaborateur·rices notent anonymement leur expérience en cabinet' },
              { icon: '👁️', title: 'Analyse agrégée',    desc: 'Fiches parlementaires avec scores, insights et tendances' },
            ].map(c => (
              <div key={c.title} className="card text-center">
                <span className="text-3xl text-or block mb-4">{c.icon}</span>
                <h3 className="h3 mb-2">{c.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS ── */}
      <section className="section bg-navy2">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="text-3xl text-or block mb-4">🔒</span>
            <h2 className="h2 mb-2">Nos engagements</h2>
            <p className="lead">Observatoire basé sur des données agrégées et anonymisées.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              { icon: '🔒', title: 'Anonymat total',      desc: 'Aucune donnée personnelle visible, aucune identification possible.' },
              { icon: '📋', title: 'Modération stricte',  desc: "Tous les témoignages sont relus. Aucun verbatim n'est publié sur le site." },
              { icon: '⚠️', title: 'Aucune accusation',   desc: "Pas de noms, pas de faits non vérifiables, pas d'accusations directes." },
              { icon: '📊', title: 'Seuil minimum',       desc: 'Minimum 5 contributions pour afficher une fiche parlementaire.' },
            ].map(e => (
              <div key={e.title} className="card flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{e.icon}</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">{e.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIGIPARL ≠ GLASSDOOR ── */}
      <section className="section">
        <div className="page-container">
          <h2 className="h2 text-center mb-10">VigieParl ≠ Glassdoor</h2>
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <div className="card text-center">
              <span className="text-3xl block mb-4">💬</span>
              <h3 className="h3 mb-2">Glassdoor</h3>
              <p className="text-muted text-sm leading-relaxed">Opinions brutes, non vérifiées, souvent biaisées.</p>
            </div>
            <div className="card text-center border-or">
              <span className="text-3xl block mb-4">📊</span>
              <h3 className="text-or font-spectral font-semibold text-lg mb-2">VigieParl</h3>
              <p className="text-muted text-sm leading-relaxed">Data structurée + analyse agrégée + anonymisation complète.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section bg-navy2 text-center">
        <div className="page-container">
          <h2 className="h2 mb-3">Vous êtes collaborateur·rice parlementaire ?</h2>
          <p className="lead mb-8">Contribuez anonymement en 2 minutes. Votre expérience compte.</p>
          <Link href="/contribuer" className="btn btn-gold btn-lg">
            Contribuer maintenant →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
