import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{background:"var(--bg)"}}>

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L4 6v8c0 6 4.5 10.5 10 12 5.5-1.5 10-6 10-12V6L14 2z" fill="none" stroke="#e8b84b" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M10 14l3 3 5-5" stroke="#e8b84b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="flex items-baseline gap-1.5">
            <span className="heading font-bold text-white text-xl">VigieParl</span>
            <span className="text-[var(--muted)] text-xs">par cavaparlement.eu</span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/" className="btn-ghost">Observatoire</Link>
          <Link href="/contribuer" className="px-4 py-2 rounded-lg font-medium text-sm" style={{background:"var(--or)",color:"#0d1117"}}>Contribuer</Link>
          <Link href="/pourquoi" className="btn-ghost">Pourquoi VigieParl</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        <div className="fade-up">
          <span className="badge badge-gold mb-6 text-sm px-4 py-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mr-1.5" style={{display:"inline"}}>
              <path d="M12 2L4 5v7c0 5 3.5 9 8 10.5C17.5 21 21 17 21 12V5L12 2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            Observatoire indépendant
          </span>
        </div>
        <h1 className="heading font-bold text-white fade-up delay-1" style={{fontSize:"clamp(2.4rem,6vw,4rem)",lineHeight:1.15,marginBottom:"0.5rem"}}>
          Observatoire
        </h1>
        <h1 className="heading font-bold fade-up delay-2" style={{fontSize:"clamp(2.4rem,6vw,4rem)",lineHeight:1.15,color:"var(--or)",marginBottom:"1.75rem"}}>
          des cabinets parlementaires
        </h1>
        <p className="fade-up delay-3" style={{color:"var(--muted)",fontSize:"1.1rem",maxWidth:"580px",lineHeight:1.65,marginBottom:"2.5rem"}}>
          Données publiques, feedback structuré des collaborateur·rices et analyse agrégée pour une transparence fiable sur la vie interne des cabinets.
        </p>
        <div className="flex flex-wrap gap-3 justify-center fade-up delay-4">
          <Link href="/contribuer" className="btn-gold text-base px-7 py-3.5">
            Contribuer anonymement →
          </Link>
          <Link href="/elus" className="btn-outline text-base px-7 py-3.5">
            Explorer les données
          </Link>
        </div>
      </section>

      {/* STATS CARDS */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {icon:"📊", value:"3.2", label:"Note moyenne", sub:"conditions de travail"},
            {icon:"🔄", value:"34%", label:"Turnover moyen", sub:"sur 12 mois"},
            {icon:"👥", value:"2.8", label:"Taille moyenne", sub:"collaborateurs / cabinet"},
            {icon:"📅", value:"14 mois", label:"Ancienneté moyenne", sub:"des collaborateurs"},
          ].map((s) => (
            <div key={s.label} className="card text-center fade-up delay-2">
              <span className="text-3xl block mb-3">{s.icon}</span>
              <p className="heading font-bold text-2xl" style={{color:"var(--or)"}}>{s.value}</p>
              <p className="text-white text-sm font-medium mt-1">{s.label}</p>
              <p style={{color:"var(--muted)",fontSize:"0.75rem",marginTop:"0.2rem"}}>{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OBSERVATOIRE NATIONAL */}
      <section className="px-6 py-20" style={{background:"var(--bg2)"}}>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="heading font-bold text-white text-3xl mb-3">Observatoire national</h2>
          <p style={{color:"var(--muted)"}}>Moyennes agrégées sur l&apos;ensemble des contributions — mise à jour continue.</p>
        </div>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-5">
          <div className="card">
            <h3 className="heading font-semibold text-white text-lg mb-5">Moyennes nationales</h3>
            {[
              {label:"Conditions de travail", score:3.2},
              {label:"Management", score:2.8},
              {label:"Charge de travail", score:2.4},
              {label:"Ambiance", score:3.5},
              {label:"Équilibre vie pro/perso", score:2.1},
              {label:"Salaire", score:2.6},
            ].map((item) => (
              <div key={item.label} className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span style={{color:"var(--text)",fontSize:"0.9rem"}}>{item.label}</span>
                  <span style={{color:"var(--or)",fontSize:"0.9rem",fontFamily:"'JetBrains Mono',monospace"}}>{item.score}/5</span>
                </div>
                <div className="score-bar-bg">
                  <div className="score-bar-fill" style={{width:`${(item.score/5)*100}%`}}/>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-5">
            <div className="card">
              <h3 className="heading font-semibold text-white text-lg mb-4">Tendances &amp; insights</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  {text:"Charge de travail globalement élevée", color:"#e53e3e", bg:"rgba(229,62,62,0.12)"},
                  {text:"Écarts importants entre cabinets", color:"#d4a030", bg:"rgba(212,160,48,0.12)"},
                  {text:"Ambiance jugée positivement", color:"#38a169", bg:"rgba(56,161,105,0.12)"},
                  {text:"Turnover en hausse", color:"#e53e3e", bg:"rgba(229,62,62,0.12)"},
                ].map((t) => (
                  <span key={t.text} className="text-xs px-3 py-1.5 rounded-full" style={{background:t.bg,color:t.color,border:`1px solid ${t.color}40`}}>{t.text}</span>
                ))}
              </div>
              <p style={{color:"var(--muted)",fontSize:"0.78rem",marginTop:"1rem"}}>Basé sur les contributions agrégées · Minimum 5 réponses par fiche</p>
            </div>
            <div className="card">
              <h3 className="heading font-semibold text-white text-lg mb-4">Comparaisons</h3>
              {[
                {label:"Assemblée nationale", score:"3.1/5"},
                {label:"Sénat", score:"3.4/5"},
                {label:"Parlement européen", score:"3.7/5"},
              ].map((c) => (
                <div key={c.label} className="flex justify-between items-center py-2.5 border-b last:border-0" style={{borderColor:"var(--border)"}}>
                  <span style={{color:"var(--text)",fontSize:"0.9rem"}}>{c.label}</span>
                  <span style={{color:"var(--or)",fontFamily:"'JetBrains Mono',monospace",fontWeight:500}}>{c.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="heading font-bold text-white text-3xl mb-3">Comment ça marche ?</h2>
          <p style={{color:"var(--muted)"}}>VigieParl combine données publiques et feedback structuré pour une vision complète.</p>
        </div>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-5">
          {[
            {icon:"📊", title:"Données publiques", desc:"Turnover, taille des cabinets, ancienneté — via Cavaparlement.eu et dataparl.io"},
            {icon:"💬", title:"Feedback structuré", desc:"Collaborateur·rices notent anonymement leur expérience en cabinet"},
            {icon:"👁️", title:"Analyse agrégée", desc:"Fiches parlementaires avec scores, insights et tendances"},
          ].map((c) => (
            <div key={c.title} className="card text-center">
              <span className="text-3xl block mb-4" style={{color:"var(--or)"}}>{c.icon}</span>
              <h3 className="heading font-semibold text-white text-lg mb-2">{c.title}</h3>
              <p style={{color:"var(--muted)",fontSize:"0.88rem",lineHeight:1.6}}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ENGAGEMENTS */}
      <section className="px-6 py-20" style={{background:"var(--bg2)"}}>
        <div className="max-w-4xl mx-auto text-center mb-10">
          <span className="text-3xl block mb-4" style={{color:"var(--or)"}}>🔒</span>
          <h2 className="heading font-bold text-white text-3xl mb-3">Nos engagements</h2>
          <p style={{color:"var(--muted)"}}>Observatoire basé sur des données agrégées et anonymisées.</p>
        </div>
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
          {[
            {icon:"🔒", title:"Anonymat total", desc:"Aucune donnée personnelle visible, aucune identification possible."},
            {icon:"📋", title:"Modération stricte", desc:"Tous les témoignages sont relus. Aucun verbatim n'est publié sur le site."},
            {icon:"⚠️", title:"Aucune accusation", desc:"Pas de noms, pas de faits non vérifiables, pas d'accusations directes."},
            {icon:"📊", title:"Seuil minimum", desc:"Minimum 5 contributions pour afficher une fiche parlementaire."},
          ].map((e) => (
            <div key={e.title} className="card flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">{e.icon}</span>
              <div>
                <h3 className="text-white font-semibold mb-1">{e.title}</h3>
                <p style={{color:"var(--muted)",fontSize:"0.88rem",lineHeight:1.55}}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIGIPARL ≠ GLASSDOOR */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="heading font-bold text-white text-3xl">VigieParl ≠ Glassdoor</h2>
        </div>
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-5">
          <div className="card text-center">
            <span className="text-3xl mb-4 block">💬</span>
            <h3 className="heading font-semibold text-white text-lg mb-2">Glassdoor</h3>
            <p style={{color:"var(--muted)",fontSize:"0.88rem",lineHeight:1.6}}>Opinions brutes, non vérifiées, souvent biaisées.</p>
          </div>
          <div className="card text-center" style={{borderColor:"var(--or)"}}>
            <span className="text-3xl mb-4 block">📊</span>
            <h3 className="heading font-semibold mb-2" style={{color:"var(--or)",fontSize:"1.1rem"}}>VigieParl</h3>
            <p style={{color:"var(--muted)",fontSize:"0.88rem",lineHeight:1.6}}>Data structurée + analyse agrégée + anonymisation complète.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center" style={{background:"var(--bg2)"}}>
        <h2 className="heading font-bold text-white mb-3" style={{fontSize:"2rem"}}>Vous êtes collaborateur·rice parlementaire ?</h2>
        <p style={{color:"var(--muted)",marginBottom:"2rem"}}>Contribuez anonymement en 2 minutes. Votre expérience compte.</p>
        <Link href="/contribuer" className="btn-gold text-base px-8 py-4">
          Contribuer maintenant →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12 border-t" style={{borderColor:"var(--border)"}}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 6v8c0 6 4.5 10.5 10 12 5.5-1.5 10-6 10-12V6L14 2z" fill="none" stroke="#e8b84b" strokeWidth="1.8" strokeLinejoin="round"/><path d="M10 14l3 3 5-5" stroke="#e8b84b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="heading font-bold text-white">VigieParl</span>
            </div>
            <p style={{color:"var(--muted)",fontSize:"0.83rem",lineHeight:1.6}}>Observatoire indépendant des cabinets parlementaires. Données agrégées et anonymisées.</p>
          </div>
          <div>
            <p className="text-white font-medium text-sm mb-3">Navigation</p>
            <div className="space-y-2 text-sm"><Link href="/">Observatoire</Link><br/><Link href="/contribuer">Contribuer</Link><br/><Link href="/pourquoi">Pourquoi VigieParl</Link><br/><a href="https://cavaparlement.eu" target="_blank" rel="noopener">Cavaparlement.eu ↗</a></div>
          </div>
          <div>
            <p className="text-white font-medium text-sm mb-3">Légal</p>
            <div className="space-y-2 text-sm"><Link href="/confidentialite">Politique de confidentialité</Link><br/><Link href="/confidentialite">CGU</Link><br/><Link href="/confidentialite">Licences et réutilisation</Link></div>
          </div>
          <div>
            <p className="text-white font-medium text-sm mb-3">Engagements</p>
            <div className="space-y-1.5 text-sm" style={{color:"var(--muted)"}}>
              <p>🔒 Anonymat garanti</p><p>📋 Témoignages modérés</p><p>📊 Min. 5 contributions par fiche</p><p>🛡️ Données agrégées uniquement</p>
              <p className="mt-3">DPO : <a href="mailto:dpo.vigiparl@cavaparlement.eu" style={{color:"var(--or)"}}>dpo.vigiparl@cavaparlement.eu</a></p>
            </div>
          </div>
        </div>
        <div className="border-t pt-6 text-center" style={{borderColor:"var(--border)"}}>
          <p style={{color:"var(--muted)",fontSize:"0.82rem"}}>© 2026 VigieParl — Un projet cavaparlement.eu · Données publiques &amp; contributions anonymes</p>
        </div>
      </footer>
    </div>
  );
}
