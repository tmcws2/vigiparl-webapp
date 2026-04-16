import Link from "next/link";
export default function PourquoiPage() {
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(13,17,23,0.95)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)",padding:"0 2rem",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Link href="/" style={{display:"flex",alignItems:"center",gap:"10px",textDecoration:"none"}}>
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 6v8c0 6 4.5 10.5 10 12 5.5-1.5 10-6 10-12V6L14 2z" fill="none" stroke="#e8b84b" strokeWidth="1.8" strokeLinejoin="round"/><path d="M10 14l3 3 5-5" stroke="#e8b84b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{fontFamily:"Spectral,Georgia,serif",fontWeight:700,color:"white",fontSize:"1.1rem"}}>VigieParl</span>
          <span style={{color:"var(--muted)",fontSize:"0.75rem"}}>par cavaparlement.eu</span>
        </Link>
        <div style={{display:"flex",gap:"4px"}}>
          <Link href="/" className="btn-ghost">Observatoire</Link>
          <Link href="/contribuer" style={{background:"var(--or)",color:"#0d1117",padding:"0.5rem 1rem",borderRadius:"8px",fontWeight:600,fontSize:"0.875rem",textDecoration:"none"}}>Contribuer</Link>
          <span style={{background:"rgba(232,184,75,0.1)",color:"var(--or)",padding:"0.5rem 1rem",borderRadius:"8px",fontWeight:600,fontSize:"0.875rem",border:"1px solid rgba(232,184,75,0.3)"}}>Pourquoi VigieParl</span>
        </div>
      </nav>
      <div style={{maxWidth:"760px",margin:"0 auto",padding:"4rem 1.5rem"}}>
        <span style={{background:"rgba(232,184,75,0.1)",color:"var(--or)",padding:"0.3rem 0.9rem",borderRadius:"999px",fontSize:"0.8rem",border:"1px solid rgba(232,184,75,0.3)",display:"inline-flex",alignItems:"center",gap:"6px",marginBottom:"1.5rem"}}>🛡️ Notre mission</span>
        <h1 style={{fontFamily:"Spectral,Georgia,serif",fontWeight:800,color:"white",fontSize:"2.5rem",lineHeight:1.2,marginBottom:"2.5rem"}}>Pourquoi nous avons lancé VigieParl</h1>
        {[
          {title:"Un angle mort démocratique",body:"Les cabinets parlementaires sont au cœur de la démocratie représentative. Ce sont les collaborateur·rices parlementaires qui préparent les amendements, analysent les textes de loi, gèrent les agendas et font le lien entre les citoyen·nes et leurs représentant·es.\n\nPourtant, on ne sait presque rien de leurs conditions de travail. Pas de données publiques sur le management, la charge de travail, le turnover réel ou l'ambiance dans les cabinets. C'est un **angle mort démocratique**."},
          {title:"Ce que fait déjà Cavaparlement",body:"Depuis sa création, [cavaparlement.eu](https://cavaparlement.eu) recense les mouvements de collaborateur·rices à partir des sources publiques (Bulletin officiel, Journal officiel, sites institutionnels). Grâce à la base de données **dataparl.io**, nous détectons les embauches, les départs, les renouvellements et nous produisons des indicateurs de turnover et de stabilité des cabinets.\n\nMais les données publiques ne disent rien sur le **vécu** des collaborateur·rices."},
          {title:"VigieParl : compléter le tableau",body:"VigieParl est né de cette conviction : **il faut croiser les données publiques avec le feedback structuré des premiers concernés** — les collaborateur·rices eux-mêmes."},
        ].map(s=>(
          <div key={s.title} style={{marginBottom:"2.5rem"}}>
            <h2 style={{fontFamily:"Spectral,Georgia,serif",fontWeight:700,color:"white",fontSize:"1.4rem",marginBottom:"0.75rem"}}>{s.title}</h2>
            <p style={{color:"var(--muted)",lineHeight:1.8,fontSize:"0.95rem"}} dangerouslySetInnerHTML={{__html:s.body.replace(/\*\*(.*?)\*\*/g,"<strong style='color:white'>$1</strong>").replace(/\[(.*?)\]\((.*?)\)/g,"<a href='$2' style='color:var(--or)'>$1</a>").replace(/\n\n/g,"</p><p style='color:var(--muted);line-height:1.8;font-size:0.95rem;margin-top:0.75rem'>")}}/>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"2.5rem"}}>
          {[{icon:"📊",title:"Données structurées",desc:"Pas de commentaires bruts à la Glassdoor. Des notations précises sur 5 critères, exploitables statistiquement."},{icon:"🔒",title:"Anonymat total",desc:"Aucune donnée personnelle publiée. Les identités servent uniquement à authentifier les contributions et exercer les droits RGPD."},{icon:"👁️",title:"Transparence maîtrisée",desc:"Minimum 5 contributions pour afficher une fiche. Aucun témoignage individuel publié sur le site."},{icon:"👥",title:"Intelligence collective",desc:"Chaque contribution enrichit l'observatoire. Plus il y a de participants, plus les données sont fiables."}].map(c=>(
            <div key={c.title} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"10px",padding:"1.25rem"}}>
              <span style={{color:"var(--or)",fontSize:"1.4rem",display:"block",marginBottom:"0.75rem"}}>{c.icon}</span>
              <h3 style={{color:"white",fontWeight:600,marginBottom:"0.4rem",fontSize:"0.95rem"}}>{c.title}</h3>
              <p style={{color:"var(--muted)",fontSize:"0.83rem",lineHeight:1.6}}>{c.desc}</p>
            </div>
          ))}
        </div>
        <h2 style={{fontFamily:"Spectral,Georgia,serif",fontWeight:700,color:"white",fontSize:"1.4rem",marginBottom:"0.75rem"}}>Nos limites et biais</h2>
        <p style={{color:"var(--muted)",marginBottom:"0.75rem",fontSize:"0.95rem"}}>Nous sommes transparents sur les limites de l'outil :</p>
        <ul style={{color:"var(--muted)",fontSize:"0.9rem",lineHeight:1.9,paddingLeft:"1.25rem",marginBottom:"2.5rem"}}>
          <li>Les contributions ne constituent pas un échantillon statistiquement représentatif.</li>
          <li>Le système repose sur la bonne foi des contributeurs. L'authentification par email et les mécanismes anti-doublons limitent les abus, mais ne les éliminent pas totalement.</li>
          <li>Les scores affichés sont des moyennes et ne reflètent pas la diversité des expériences individuelles au sein d'un même cabinet.</li>
        </ul>
        <h2 style={{fontFamily:"Spectral,Georgia,serif",fontWeight:700,color:"white",fontSize:"1.4rem",marginBottom:"0.75rem"}}>Notre ambition</h2>
        <p style={{color:"var(--muted)",lineHeight:1.8,fontSize:"0.95rem",marginBottom:"2rem"}}>VigieParl vise à devenir un <strong style={{color:"white"}}>standard de référence sur la vie parlementaire interne</strong> — un outil utile pour les collaborateur·rices actuels et futurs, pour les journalistes, pour les chercheurs et pour toute personne soucieuse de la qualité de notre démocratie.<br/><br/>Nous croyons que la transparence sur les conditions de travail en cabinet n'est pas un luxe : c'est une condition pour que notre démocratie fonctionne mieux.</p>
        <div style={{textAlign:"center",marginBottom:"3rem"}}>
          <Link href="/contribuer" style={{background:"var(--or)",color:"#0d1117",padding:"0.875rem 2rem",borderRadius:"8px",fontWeight:600,fontSize:"1rem",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"8px"}}>Contribuer à l'observatoire →</Link>
        </div>
      </div>
    </div>
  );
}
