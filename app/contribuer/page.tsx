"use client";
import { useState, useRef } from "react";
import Link from "next/link";

type EluResult = { id:number; nom:string; prenom:string; chambre:string; groupe_sigle:string|null; };

const STEP_LABELS = ["Profil","Élu·e","Identité","Notation","Questions","Témoignage"];

function NavBar({active}:{active:string}) {
  return (
    <nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(13,17,23,0.95)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)",padding:"0 2rem",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <Link href="/" style={{display:"flex",alignItems:"center",gap:"10px",textDecoration:"none"}}>
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 6v8c0 6 4.5 10.5 10 12 5.5-1.5 10-6 10-12V6L14 2z" fill="none" stroke="#e8b84b" strokeWidth="1.8" strokeLinejoin="round"/><path d="M10 14l3 3 5-5" stroke="#e8b84b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span style={{fontFamily:"Spectral,Georgia,serif",fontWeight:700,color:"white",fontSize:"1.1rem"}}>VigieParl</span>
        <span style={{color:"var(--muted)",fontSize:"0.75rem"}}>par cavaparlement.eu</span>
      </Link>
      <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
        <Link href="/" className="btn-ghost" style={{fontSize:"0.875rem"}}>Observatoire</Link>
        <span style={{background:"var(--or)",color:"#0d1117",padding:"0.5rem 1rem",borderRadius:"8px",fontWeight:600,fontSize:"0.875rem"}}>{active}</span>
        <Link href="/pourquoi" className="btn-ghost" style={{fontSize:"0.875rem"}}>Pourquoi VigieParl</Link>
      </div>
    </nav>
  );
}

export default function ContribuerPage() {
  const [stepIdx, setStepIdx] = useState(0);
  const [profil, setProfil] = useState<"actuel"|"ancien"|null>(null);
  const [elu, setElu] = useState<EluResult|null>(null);
  const [eluSearch, setEluSearch] = useState("");
  const [eluResults, setEluResults] = useState<EluResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [prenom, setPrenom] = useState(""); const [nom, setNom] = useState("");
  const [email, setEmail] = useState(""); const [tranche, setTranche] = useState(""); const [genre, setGenre] = useState("");
  const [sessionId, setSessionId] = useState(""); const [otp, setOtp] = useState(["","","","","",""]);
  const [otpSent, setOtpSent] = useState(false);
  const [notes, setNotes] = useState({conditions:0,charge:0,management:0,ambiance:0,equilibre:0,salaire:0});
  const [recommande, setRecommande] = useState<boolean|null>(null);
  const [duree, setDuree] = useState(""); const [salaire, setSalaire] = useState("");
  const [temoignage, setTemoignage] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const otpRefs = useRef<(HTMLInputElement|null)[]>([]);

  const pct = (stepIdx / (STEP_LABELS.length - 1)) * 100;

  async function searchElus(q:string) {
    if (q.length<2) { setEluResults([]); return; }
    setSearching(true);
    try { const r=await fetch(`/api/elus?q=${encodeURIComponent(q)}&limit=8`); const d=await r.json(); setEluResults(d.elus||[]); } finally { setSearching(false); }
  }

  async function sendOtp() {
    setError(""); setLoading(true);
    try {
      const r=await fetch("/api/send-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});
      const d=await r.json();
      if (!r.ok) { setError(d.error); return; }
      setSessionId(d.sessionId); setOtpSent(true);
    } catch { setError("Erreur réseau"); } finally { setLoading(false); }
  }

  async function verifyOtp() {
    setError(""); setLoading(true);
    const code=otp.join("");
    try {
      const r=await fetch("/api/verify-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId,code})});
      const d=await r.json();
      if (!r.ok) { setError(d.error); return; }
      setStepIdx(3);
    } catch { setError("Erreur réseau"); } finally { setLoading(false); }
  }

  async function handleSubmit() {
    setError(""); setLoading(true);
    try {
      const r=await fetch("/api/submit-questionnaire",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          sessionId,eluId:elu?.id,eluNom:`${elu?.prenom} ${elu?.nom}`,eluChambre:elu?.chambre,
          scoreConditionsTravail:notes.conditions,scoreRelationsElu:notes.management,
          scoreContenuTravail:notes.charge,scoreRemuneration:notes.salaire,
          scoreAmbiance:notes.ambiance,
          scoreGlobal:Math.round((notes.conditions+notes.management+notes.ambiance+notes.equilibre+notes.charge)/5),
          pointsPositifs:temoignage,recommande,
          dureesMois:duree==="< 6 mois"?3:duree==="6-12 mois"?9:duree==="1-2 ans"?18:30,
        })
      });
      const d=await r.json();
      if (!r.ok) { setError(d.error); return; }
      setDone(true);
    } catch { setError("Erreur réseau"); } finally { setLoading(false); }
  }

  const card: React.CSSProperties = {background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",padding:"1.75rem"};
  const btnGold: React.CSSProperties = {background:"var(--or)",color:"#0d1117",padding:"0.7rem 1.5rem",borderRadius:"8px",fontWeight:600,border:"none",cursor:"pointer",fontSize:"0.9rem",display:"inline-flex",alignItems:"center",gap:"6px"};
  const btnGhost: React.CSSProperties = {background:"transparent",color:"var(--muted)",padding:"0.7rem 1rem",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"0.9rem",display:"inline-flex",alignItems:"center",gap:"6px"};

  if (done) return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <NavBar active="Contribuer"/>
      <div style={{maxWidth:"600px",margin:"0 auto",padding:"3rem 1rem",textAlign:"center"}}>
        <div style={card}>
          <div style={{fontSize:"4rem",marginBottom:"1.25rem"}}>✅</div>
          <h2 style={{fontFamily:"Spectral,Georgia,serif",fontWeight:700,color:"white",fontSize:"1.75rem",marginBottom:"0.75rem"}}>Contribution envoyée !</h2>
          <p style={{color:"var(--muted)",marginBottom:"0.5rem"}}>Merci pour votre témoignage concernant <strong style={{color:"white"}}>{elu?.prenom} {elu?.nom}</strong>.</p>
          <p style={{color:"var(--muted)",fontSize:"0.875rem",marginBottom:"1.75rem"}}>Un email de confirmation a été envoyé à <strong style={{color:"white"}}>{email}</strong>.</p>
          <div style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"10px",padding:"1.25rem",textAlign:"left",marginBottom:"1.5rem"}}>
            <p style={{color:"var(--muted)",fontSize:"0.875rem",lineHeight:1.8}}>📋 Votre témoignage sera examiné avant publication<br/>🔒 Les scores s'affichent à partir de 5 contributions<br/>📊 Seules les données agrégées sont publiques</p>
          </div>
          <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
            <Link href="/elus" style={{...btnGold,textDecoration:"none"}}>Explorer les fiches →</Link>
            <Link href="/" style={{...btnGhost,border:"1px solid var(--border2)",textDecoration:"none",color:"var(--text)"}}>← Retour</Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <NavBar active="Contribuer"/>
      <div style={{maxWidth:"660px",margin:"0 auto",padding:"2rem 1rem 4rem"}}>

        {/* Info */}
        <div style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"10px",padding:"1.25rem 1.5rem",marginBottom:"1.5rem",fontSize:"0.85rem",color:"var(--muted)",lineHeight:1.7}}>
          <p style={{color:"white",fontWeight:600,marginBottom:"0.5rem"}}>📋 À propos de ce formulaire</p>
          <p>VigieParl est un <strong style={{color:"white"}}>observatoire des cabinets parlementaires</strong> qui vise à apporter de la transparence sur les conditions de travail en cabinet. Les contributions permettent de constituer des données agrégées, fiables et anonymisées.</p>
          <p style={{marginTop:"0.5rem"}}><strong style={{color:"white"}}>Biais potentiels :</strong> les résultats reflètent les contributions reçues et ne constituent pas un échantillon statistiquement représentatif.</p>
          <p style={{marginTop:"0.5rem"}}><strong style={{color:"white"}}>Fonctionnement :</strong> vos notes sont agrégées avec celles des autres contributeurs. Une fiche n&apos;est publiée qu&apos;à partir de 5 contributions minimum.</p>
        </div>

        {/* Steps */}
        <div style={{display:"flex",alignItems:"center",marginBottom:"0.5rem"}}>
          {STEP_LABELS.map((label,i)=>(
            <div key={label} style={{display:"flex",alignItems:"center",flex:i<STEP_LABELS.length-1?1:undefined}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.85rem",fontWeight:600,flexShrink:0,
                  background:i<stepIdx?"var(--or2)":i===stepIdx?"var(--or)":"var(--bg3)",
                  color:i<=stepIdx?"#0d1117":"var(--muted)",
                  border:i>stepIdx?"1px solid var(--border2)":"none"}}>
                  {i<stepIdx?"✓":i+1}
                </div>
                <span style={{display:"block",fontSize:"0.72rem",marginTop:"4px",color:i===stepIdx?"var(--or)":i<stepIdx?"var(--or2)":"var(--muted)"}}>{label}</span>
              </div>
              {i<STEP_LABELS.length-1&&<div style={{flex:1,height:2,margin:"0 6px",marginBottom:"20px",background:i<stepIdx?"var(--or2)":"var(--border)"}}/>}
            </div>
          ))}
        </div>
        <div style={{height:3,background:"var(--border)",borderRadius:2,marginBottom:"1.75rem"}}>
          <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(to right,var(--or2),var(--or))",borderRadius:2,transition:"width 0.4s ease"}}/>
        </div>

        {error&&<div style={{marginBottom:"1rem",padding:"0.75rem 1rem",borderRadius:"8px",background:"rgba(229,62,62,0.1)",border:"1px solid rgba(229,62,62,0.3)",color:"#fc8181",fontSize:"0.875rem"}}>⚠️ {error}</div>}

        {/* PROFIL */}
        {stepIdx===0&&(
          <div style={card} className="fade-up">
            <h2 style={{fontFamily:"Spectral,Georgia,serif",fontWeight:700,color:"white",fontSize:"1.6rem",marginBottom:"0.25rem"}}>Votre profil</h2>
            <p style={{color:"var(--muted)",marginBottom:"1.5rem",fontSize:"0.875rem"}}>Vos réponses sont totalement anonymes.</p>
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              {[{val:"actuel",title:"Collaborateur·rice actuel·le",desc:"Vous travaillez actuellement en cabinet parlementaire"},{val:"ancien",title:"Ancien·ne collaborateur·rice",desc:"Vous avez travaillé en cabinet parlementaire par le passé"}].map(o=>(
                <button key={o.val} onClick={()=>setProfil(o.val as "actuel"|"ancien")} style={{background:profil===o.val?"var(--bg3)":"var(--card)",border:`1px solid ${profil===o.val?"var(--or)":"var(--border)"}`,borderRadius:"10px",padding:"1rem 1.25rem",textAlign:"left",cursor:"pointer",transition:"all 0.15s"}}>
                  <p style={{color:"white",fontWeight:500,marginBottom:"0.2rem"}}>{o.title}</p>
                  <p style={{color:"var(--muted)",fontSize:"0.83rem"}}>{o.desc}</p>
                </button>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:"1.5rem"}}>
              <button style={{...btnGold,opacity:!profil?0.5:1,cursor:!profil?"not-allowed":"pointer"}} onClick={()=>profil&&setStepIdx(1)} disabled={!profil}>Suivant →</button>
            </div>
          </div>
        )}

        {/* ELU */}
        {stepIdx===1&&(
          <div style={card} className="fade-up">
            <h2 style={{fontFamily:"Spectral,Georgia,serif",fontWeight:700,color:"white",fontSize:"1.6rem",marginBottom:"0.25rem"}}>Choisissez un·e élu·e</h2>
            <p style={{color:"var(--muted)",marginBottom:"1.5rem",fontSize:"0.875rem"}}>Sélectionnez le ou la parlementaire pour lequel vous souhaitez contribuer.</p>
            <div style={{position:"relative",marginBottom:"1rem"}}>
              <input className="input" style={{paddingLeft:"2.5rem"}} placeholder="Rechercher par nom ou groupe politique..." value={eluSearch}
                onChange={e=>{setEluSearch(e.target.value);searchElus(e.target.value);if(!e.target.value)setElu(null);}}/>
              <span style={{position:"absolute",left:"0.75rem",top:"50%",transform:"translateY(-50%)",color:"var(--muted)"}}>🔍</span>
            </div>
            {eluResults.length>0&&(
              <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px",overflow:"hidden",marginBottom:"1rem"}}>
                {eluResults.map(e=>(
                  <button key={e.id} onClick={()=>{setElu(e);setEluSearch(`${e.prenom} ${e.nom}`);setEluResults([]);}} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.875rem 1rem",textAlign:"left",background:"transparent",border:"none",borderBottom:"1px solid var(--border)",cursor:"pointer",transition:"background 0.15s"}}
                    onMouseEnter={ev=>ev.currentTarget.style.background="var(--bg3)"} onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
                    <div>
                      <p style={{color:"white",fontSize:"0.9rem",fontWeight:500}}>{e.prenom} {e.nom}</p>
                      <p style={{color:"var(--muted)",fontSize:"0.78rem",marginTop:"2px"}}>{e.groupe_sigle&&`${e.groupe_sigle} · `}{e.chambre==="AN"?"Assemblée nationale":e.chambre==="SENAT"?"Sénat":"Parlement européen"}</p>
                    </div>
                    <span style={{background:"rgba(56,161,105,0.15)",color:"#6fc49a",padding:"0.15rem 0.6rem",borderRadius:"999px",fontSize:"0.72rem",fontWeight:500}}>En exercice</span>
                  </button>
                ))}
              </div>
            )}
            {searching&&<p style={{color:"var(--muted)",fontSize:"0.85rem",textAlign:"center",padding:"0.75rem"}}>⏳ Recherche…</p>}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:"1.5rem"}}>
              <button style={btnGhost} onClick={()=>setStepIdx(0)}>← Retour</button>
              <button style={{...btnGold,opacity:!elu?0.5:1,cursor:!elu?"not-allowed":"pointer"}} onClick={()=>elu&&setStepIdx(2)} disabled={!elu}>Suivant →</button>
            </div>
          </div>
        )}

        {/* IDENTITE */}
        {stepIdx===2&&(
          <div style={card} className="fade-up">
            {!otpSent?(
              <>
                <h2 style={{fontFamily:"Spectral,Georgia,serif",fontWeight:700,color:"white",fontSize:"1.6rem",marginBottom:"0.25rem"}}>Vos informations</h2>
                <p style={{color:"var(--muted)",marginBottom:"0.75rem",fontSize:"0.875rem"}}>Ces informations ne seront <strong style={{color:"white"}}>jamais publiées</strong>. Elles nous permettent de :</p>
                <ul style={{color:"var(--muted)",fontSize:"0.83rem",marginBottom:"1rem",paddingLeft:"1.25rem",lineHeight:1.75}}>
                  <li><strong style={{color:"white"}}>Authentifier votre contribution</strong> pour garantir la fiabilité des données de l&apos;observatoire (lutte contre les doublons et les faux avis).</li>
                  <li><strong style={{color:"white"}}>Vous permettre d&apos;exercer vos droits RGPD</strong> : suppression, rectification ou accès à vos données à tout moment.</li>
                </ul>
                <div style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"0.875rem 1rem",marginBottom:"1.25rem",fontSize:"0.8rem",color:"var(--muted)"}}>
                  🛡️ Vos données personnelles sont chiffrées et stockées dans une base de données sécurisée hébergée en Europe. Elles ne sont accessibles qu&apos;à l&apos;équipe de Ça va Parlement. Pour toute demande : <strong style={{color:"var(--or)"}}>dpo.vigiparl@cavaparlement.eu</strong>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
                  <div><label style={{color:"white",fontSize:"0.875rem",fontWeight:500,display:"block",marginBottom:"6px"}}>Prénom *</label><input className="input" placeholder="Prénom" value={prenom} onChange={e=>setPrenom(e.target.value)}/></div>
                  <div><label style={{color:"white",fontSize:"0.875rem",fontWeight:500,display:"block",marginBottom:"6px"}}>Nom *</label><input className="input" placeholder="Nom" value={nom} onChange={e=>setNom(e.target.value)}/></div>
                </div>
                <div style={{marginBottom:"12px"}}>
                  <label style={{color:"white",fontSize:"0.875rem",fontWeight:500,display:"block",marginBottom:"6px"}}>Email *</label>
                  <input className="input" type="email" placeholder="votre@email.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                  <p style={{color:"var(--muted)",fontSize:"0.78rem",marginTop:"4px"}}>Un email de confirmation vous sera envoyé pour valider votre contribution.</p>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"4px"}}>
                  <div><label style={{color:"white",fontSize:"0.875rem",fontWeight:500,display:"block",marginBottom:"6px"}}>Tranche d&apos;âge *</label>
                    <select className="input" value={tranche} onChange={e=>setTranche(e.target.value)}><option value="">Sélectionner</option><option>18-25 ans</option><option>26-30 ans</option><option>31-35 ans</option><option>36-45 ans</option><option>+45 ans</option></select></div>
                  <div><label style={{color:"white",fontSize:"0.875rem",fontWeight:500,display:"block",marginBottom:"6px"}}>Genre *</label>
                    <select className="input" value={genre} onChange={e=>setGenre(e.target.value)}><option value="">Sélectionner</option><option>Femme</option><option>Homme</option><option>Non-binaire</option><option>Préfère ne pas dire</option></select></div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:"1.5rem"}}>
                  <button style={btnGhost} onClick={()=>setStepIdx(1)}>← Retour</button>
                  <button style={{...btnGold,opacity:(!email||!prenom||!nom||loading)?0.5:1,cursor:(!email||!prenom||!nom||loading)?"not-allowed":"pointer"}} onClick={sendOtp} disabled={loading||!email||!prenom||!nom}>{loading?"Envoi…":"Suivant →"}</button>
                </div>
              </>
            ):(
              <>
                <h2 style={{fontFamily:"Spectral,Georgia,serif",fontWeight:700,color:"white",fontSize:"1.6rem",marginBottom:"0.5rem"}}>Code de vérification</h2>
                <p style={{color:"var(--muted)",fontSize:"0.875rem"}}>Un code à 6 chiffres a été envoyé à <strong style={{color:"white"}}>{email}</strong>. Valable 15 minutes.</p>
                <div style={{display:"flex",gap:"10px",justifyContent:"center",margin:"1.75rem 0"}}>
                  {otp.map((digit,i)=>(
                    <input key={i} ref={el=>{otpRefs.current[i]=el;}} className="otp-box" type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e=>{if(!/^\d*$/.test(e.target.value))return;const n=[...otp];n[i]=e.target.value.slice(-1);setOtp(n);if(e.target.value&&i<5)otpRefs.current[i+1]?.focus();}}
                      onKeyDown={e=>{if(e.key==="Backspace"&&!otp[i]&&i>0)otpRefs.current[i-1]?.focus();}}/>
                  ))}
                </div>
                <button style={{...btnGold,width:"100%",justifyContent:"center",opacity:(otp.join("").length<6||loading)?0.5:1}} onClick={verifyOtp} disabled={loading||otp.join("").length<6}>{loading?"Vérification…":"Valider le code →"}</button>
                <button style={{...btnGhost,width:"100%",justifyContent:"center",marginTop:"10px",fontSize:"0.85rem"}} onClick={()=>{setOtpSent(false);setOtp(["","","","","",""]);}} >← Changer d&apos;email</button>
              </>
            )}
          </div>
        )}

        {/* NOTATION */}
        {stepIdx===3&&(
          <div style={card} className="fade-up">
            <h2 style={{fontFamily:"Spectral,Georgia,serif",fontWeight:700,color:"white",fontSize:"1.6rem",marginBottom:"0.25rem"}}>Notation</h2>
            <p style={{color:"var(--muted)",marginBottom:"1.75rem",fontSize:"0.875rem"}}>Évaluez de 1 à 5 chaque critère. Tous les champs sont obligatoires.</p>
            <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
              {([{key:"conditions",label:"Conditions de travail"},{key:"charge",label:"Charge de travail"},{key:"management",label:"Management"},{key:"ambiance",label:"Ambiance"},{key:"equilibre",label:"Équilibre vie pro / perso"},{key:"salaire",label:"Salaire"}] as {key:keyof typeof notes,label:string}[]).map(({key,label})=>(
                <div key={key}>
                  <p style={{color:"white",fontSize:"0.9rem",fontWeight:500,marginBottom:"8px"}}>{label}</p>
                  <div style={{display:"flex",gap:"6px"}}>
                    {[1,2,3,4,5].map(s=>(
                      <button key={s} type="button" onClick={()=>setNotes(n=>({...n,[key]:s}))} className={`star${notes[key]>=s?" active":""}`}>★</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:"2rem"}}>
              <button style={btnGhost} onClick={()=>setStepIdx(2)}>← Retour</button>
              <button style={{...btnGold,opacity:Object.values(notes).some(v=>v===0)?0.5:1}} onClick={()=>setStepIdx(4)} disabled={Object.values(notes).some(v=>v===0)}>Suivant →</button>
            </div>
          </div>
        )}

        {/* QUESTIONS */}
        {stepIdx===4&&(
          <div style={card} className="fade-up">
            <h2 style={{fontFamily:"Spectral,Georgia,serif",fontWeight:700,color:"white",fontSize:"1.6rem",marginBottom:"0.25rem"}}>Questions complémentaires</h2>
            <p style={{color:"var(--muted)",marginBottom:"1.75rem",fontSize:"0.875rem"}}>Quelques informations supplémentaires.</p>
            <div style={{marginBottom:"1.5rem"}}>
              <p style={{color:"white",fontSize:"0.9rem",fontWeight:500,marginBottom:"0.75rem"}}>Recommanderiez-vous ce cabinet ? *</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
                {[{label:"Oui",val:true},{label:"Non",val:false}].map(o=>(
                  <button key={String(o.val)} onClick={()=>setRecommande(o.val)} style={{padding:"0.875rem",borderRadius:"8px",border:`1px solid ${recommande===o.val?"var(--or)":"var(--border)"}`,background:recommande===o.val?"rgba(232,184,75,0.1)":"transparent",color:recommande===o.val?"var(--or)":"var(--muted)",fontWeight:500,cursor:"pointer",transition:"all 0.15s"}}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:"1.5rem"}}>
              <p style={{color:"white",fontSize:"0.9rem",fontWeight:500,marginBottom:"0.75rem"}}>Durée d&apos;expérience *</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
                {["< 6 mois","6-12 mois","1-2 ans","+ 2 ans"].map(d=>(
                  <button key={d} onClick={()=>setDuree(d)} style={{padding:"0.875rem",borderRadius:"8px",border:`1px solid ${duree===d?"var(--or)":"var(--border)"}`,background:duree===d?"rgba(232,184,75,0.1)":"transparent",color:duree===d?"var(--or)":"var(--muted)",fontSize:"0.875rem",cursor:"pointer",transition:"all 0.15s"}}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{color:"white",fontSize:"0.9rem",fontWeight:500,marginBottom:"4px"}}>Salaire annuel brut <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></p>
              <p style={{color:"var(--muted)",fontSize:"0.78rem",marginBottom:"0.75rem"}}>Cette information est facultative et sera uniquement utilisée à des fins statistiques agrégées.</p>
              <div style={{position:"relative"}}>
                <input className="input" placeholder="Ex : 32000" value={salaire} onChange={e=>setSalaire(e.target.value)} type="number"/>
                <span style={{position:"absolute",right:"0.875rem",top:"50%",transform:"translateY(-50%)",color:"var(--muted)",fontSize:"0.85rem"}}>€ brut / an</span>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:"2rem"}}>
              <button style={btnGhost} onClick={()=>setStepIdx(3)}>← Retour</button>
              <button style={{...btnGold,opacity:(recommande===null||!duree)?0.5:1}} onClick={()=>setStepIdx(5)} disabled={recommande===null||!duree}>Suivant →</button>
            </div>
          </div>
        )}

        {/* TEMOIGNAGE */}
        {stepIdx===5&&(
          <div style={card} className="fade-up">
            <h2 style={{fontFamily:"Spectral,Georgia,serif",fontWeight:700,color:"white",fontSize:"1.6rem",marginBottom:"0.25rem"}}>Témoignage <span style={{color:"var(--muted)",fontWeight:400,fontSize:"1rem"}}>(optionnel)</span></h2>
            <p style={{color:"var(--muted)",marginBottom:"1.5rem",fontSize:"0.875rem",lineHeight:1.65}}>
              Votre témoignage ne sera <strong style={{color:"white"}}>jamais publié sur le site VigieParl</strong>. Il sera modéré et pourra alimenter les données internes de cavaparlement.eu, ainsi que la publication éventuelle d&apos;un <strong style={{color:"var(--or)"}}>rapport annuel sur les cabinets parlementaires</strong>.
            </p>
            <textarea className="input" style={{minHeight:"140px",resize:"none",marginBottom:"4px"}} placeholder="Décrivez votre expérience en quelques mots..." value={temoignage} onChange={e=>setTemoignage(e.target.value)} maxLength={1000}/>
            <p style={{color:"var(--muted)",fontSize:"0.78rem",textAlign:"right",marginBottom:"1rem"}}>{temoignage.length}/1000</p>
            <div style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"10px",padding:"1rem 1.25rem",fontSize:"0.8rem",color:"var(--muted)",lineHeight:1.75}}>
              <p>⚠️ Interdictions : accusations directes, noms de personnes, faits non vérifiables.</p>
              <p>🔒 Votre témoignage n&apos;est jamais publié individuellement sur le site. Il alimente uniquement les données internes de cavaparlement.eu.</p>
              <p>📊 Les témoignages servent de base à la publication éventuelle d&apos;un rapport annuel sur les cabinets parlementaires.</p>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:"2rem"}}>
              <button style={btnGhost} onClick={()=>setStepIdx(4)}>← Retour</button>
              <button style={{...btnGold,opacity:loading?0.5:1}} onClick={handleSubmit} disabled={loading}>{loading?"Envoi…":"Envoyer ✓"}</button>
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <p style={{textAlign:"center",color:"var(--muted)",fontSize:"0.78rem",marginTop:"1.5rem"}}>🛡️ Anonymat garanti · Données agrégées uniquement · Modération stricte</p>
      </div>
    </div>
  );
}
