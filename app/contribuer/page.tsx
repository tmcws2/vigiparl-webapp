'use client'
import dynamic from 'next/dynamic'
const Turnstile = dynamic(() => import('@/components/Turnstile'), { ssr: false })
import { useState, useRef } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

type Elu = { id: number; nom: string; prenom: string; chambre: string; groupe_sigle: string | null }

const STEPS = ['Profil', 'Élu·e', 'Identité', 'Notation', 'Questions', 'Témoignage']

const CRITERES = [
  { key: 'conditions', label: 'Conditions de travail' },
  { key: 'charge',     label: 'Charge de travail' },
  { key: 'management', label: 'Management' },
  { key: 'ambiance',   label: 'Ambiance' },
  { key: 'equilibre',  label: 'Equilibre vie pro / perso' },
] as const
type CritereKey = typeof CRITERES[number]['key']

export default function ContribuerPage() {
  // Step
  const [step, setStep] = useState(0)
  // Profil
  const [profil, setProfil] = useState<'actuel' | 'ancien' | null>(null)
  // Elu
  const [elu, setElu] = useState<Elu | null>(null)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<Elu[]>([])
  const [searching, setSearching] = useState(false)
  // Identité
  const [prenom, setPrenom] = useState(''); const [nom, setNom] = useState('')
  const [email, setEmail] = useState(''); const [tranche, setTranche] = useState(''); const [genre, setGenre] = useState('')
  const [sessionId, setSessionId] = useState(''); const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  // Notation
  const [notes, setNotes] = useState<Record<CritereKey, number>>({ conditions: 0, charge: 0, management: 0, ambiance: 0, equilibre: 0 })
  // Questions
  const [recommande, setRecommande] = useState<boolean | null>(null)
  const [duree, setDuree] = useState(''); const [salaire, setSalaire] = useState('')
  // Témoignage
  const [temoignage, setTemoignage] = useState('')
  // State
  const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const [done, setDone] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')

  async function searchElus(q: string) {
    setSearch(q); if (!q) { setElu(null); setResults([]); return }
    if (q.length < 2) return
    setSearching(true)
    try { const r = await fetch(`/api/elus?q=${encodeURIComponent(q)}&limit=8`); const d = await r.json(); setResults(d.elus || []) }
    finally { setSearching(false) }
  }

  async function sendOtp() {
    setError(''); setLoading(true)
    try {
      const r = await fetch('/api/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, turnstileToken }) })
      const d = await r.json()
      if (!r.ok) { setError(d.error); return }
      setSessionId(d.sessionId); setOtpSent(true)
    } catch { setError('Erreur réseau') } finally { setLoading(false) }
  }

  async function verifyOtp() {
    setError(''); setLoading(true)
    const code = otp.join('')
    try {
      const r = await fetch('/api/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, code }) })
      const d = await r.json()
      if (!r.ok) { setError(d.error); return }
      setStep(3)
    } catch { setError('Erreur réseau') } finally { setLoading(false) }
  }

  async function submit() {
    setError(''); setLoading(true)
    try {
      const r = await fetch('/api/submit-questionnaire', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId, eluId: elu?.id, eluNom: `${elu?.prenom} ${elu?.nom}`, eluChambre: elu?.chambre,
          scoreConditions: notes.conditions, scoreManagement: notes.management, scoreCharge: notes.charge,
          scoreAmbiance: notes.ambiance, scoreEquilibre: notes.equilibre,
          temoignage, recommande, dureesMois: duree === '< 6 mois' ? 3 : duree === '6-12 mois' ? 9 : duree === '1-2 ans' ? 18 : 30
        })
      })
      const d = await r.json()
      if (!r.ok) { setError(d.error); return }
      setDone(true)
    } catch { setError('Erreur réseau') } finally { setLoading(false) }
  }

  if (done) return (
    <div className="min-h-screen bg-navy">
      <Nav active="contribuer" />
      <div className="page-container max-w-xl py-16">
        <div className="card text-center py-12">
          <div className="text-6xl mb-5">✅</div>
          <h2 className="h2 mb-3">Contribution envoyée !</h2>
          <p className="text-muted mb-1">Témoignage pour <strong className="text-white">{elu?.prenom} {elu?.nom}</strong></p>
          <p className="text-muted text-sm mb-6">Confirmation envoyée à <strong className="text-white">{email}</strong></p>
          <div className="info-box text-left text-sm text-muted mb-6">
            <p>📋 Votre témoignage sera examiné avant publication</p>
            <p className="mt-1.5">🔒 Publication après 5 contributions min.</p>
            <p className="mt-1.5">📊 Seules les données agrégées seront visibles</p>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/elus" className="btn btn-gold btn-md">Explorer les fiches →</Link>
            <Link href="/" className="btn btn-outline btn-md">← Accueil</Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-navy">
      <Nav active="contribuer" />
      <div className="page-container max-w-2xl py-8 pb-16">

        {/* Info box */}
        <div className="info-box text-sm text-muted mb-6">
          <p className="text-white font-semibold mb-2">📋 À propos de ce formulaire</p>
          <p className="mb-2">VigieParl est un <strong className="text-white">observatoire des cabinets parlementaires</strong> qui vise à apporter de la transparence sur les conditions de travail en cabinet. Les contributions permettent de constituer des données agrégées, fiables et anonymisées.</p>
          <p className="mb-2"><strong className="text-white">Biais potentiels :</strong> les résultats reflètent les contributions reçues et ne constituent pas un échantillon statistiquement représentatif. Les personnes ayant vécu des expériences négatives peuvent être sur-représentées.</p>
          <p><strong className="text-white">Fonctionnement :</strong> vos notes sont agrégées avec celles des autres contributeurs. Une fiche n&apos;est publiée qu&apos;à partir de 5 contributions minimum. Aucun témoignage individuel n&apos;est publié sur le site.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center mb-1.5">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center" style={{ flex: i < STEPS.length - 1 ? 1 : undefined }}>
              <div className="flex flex-col items-center">
                <div className={`step-dot ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="hidden sm:block text-xs mt-1"
                  style={{ color: i === step ? '#e8b84b' : i < step ? '#d4a030' : '#7a90a8' }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-2 mb-5 h-0.5"
                  style={{ background: i < step ? '#d4a030' : '#1f2d42' }} />
              )}
            </div>
          ))}
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-border rounded-full mb-7">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${step / (STEPS.length - 1) * 100}%`, background: 'linear-gradient(to right, #d4a030, #e8b84b)' }} />
        </div>

        {error && (
          <div className="warn-box text-sm text-red-300 mb-5">⚠️ {error}</div>
        )}

        {/* ── ÉTAPE 1 : PROFIL ── */}
        {step === 0 && (
          <div className="card anim">
            <h2 className="h2 mb-1">Votre profil</h2>
            <p className="text-muted text-sm mb-5">Vos réponses sont totalement anonymes.</p>
            <div className="space-y-3">
              {[
                { val: 'actuel', title: 'Collaborateur·rice actuel·le', desc: 'Vous travaillez actuellement en cabinet parlementaire' },
                { val: 'ancien', title: 'Ancien·ne collaborateur·rice', desc: 'Vous avez travaillé en cabinet parlementaire par le passé' },
              ].map(o => (
                <button key={o.val} onClick={() => setProfil(o.val as 'actuel' | 'ancien')}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${profil === o.val ? 'card-selected border-or bg-navy3' : 'bg-card border-border hover:border-muted'}`}>
                  <p className="text-white font-medium">{o.title}</p>
                  <p className="text-muted text-sm mt-0.5">{o.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button className="btn btn-gold btn-md" onClick={() => setStep(1)} disabled={!profil}>Suivant →</button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 2 : ÉLU ── */}
        {step === 1 && (
          <div className="card anim">
            <h2 className="h2 mb-1">Choisissez un·e élu·e</h2>
            <p className="text-muted text-sm mb-5">Sélectionnez le ou la parlementaire pour lequel vous souhaitez contribuer.</p>
            <div className="relative mb-3">
              <input className="input pl-10" placeholder="Rechercher par nom ou groupe politique..."
                value={search} onChange={e => searchElus(e.target.value)} />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">🔍</span>
            </div>
            {results.length > 0 && (
              <div className="bg-navy2 border border-border rounded-xl overflow-hidden mb-3">
                {results.map(e => (
                  <button key={e.id}
                    onClick={() => { setElu(e); setSearch(`${e.prenom} ${e.nom}`); setResults([]) }}
                    className="w-full flex items-center justify-between px-4 py-3 text-left border-b border-border last:border-0 hover:bg-navy3 transition-colors">
                    <div>
                      <p className="text-white text-sm font-medium">{e.prenom} {e.nom}</p>
                      <p className="text-muted text-xs mt-0.5">
                        {e.groupe_sigle && `${e.groupe_sigle} · `}
                        {e.chambre === 'AN' ? 'Assemblée nationale' : e.chambre === 'SENAT' ? 'Sénat' : 'Parlement européen'}
                      </p>
                    </div>
                    <span className="badge badge-green text-xs">En exercice</span>
                  </button>
                ))}
              </div>
            )}
            {searching && <p className="text-muted text-sm text-center py-3">⏳ Recherche…</p>}
            <div className="flex justify-between mt-6">
              <button className="btn btn-ghost" onClick={() => setStep(0)}>← Retour</button>
              <button className="btn btn-gold btn-md" onClick={() => setStep(2)} disabled={!elu}>Suivant →</button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 3 : IDENTITÉ ── */}
        {step === 2 && !otpSent && (
          <div className="card anim">
            <h2 className="h2 mb-1">Vos informations</h2>
            <p className="text-muted text-sm mb-2">
              Ces informations ne seront <strong className="text-white">jamais publiées</strong>. Elles nous permettent de :
            </p>
            <ul className="text-muted text-sm mb-4 pl-4 space-y-1 leading-relaxed list-disc">
              <li><strong className="text-white">Authentifier votre contribution</strong> pour garantir la fiabilité des données de l&apos;observatoire (lutte contre les doublons et les faux avis).</li>
              <li><strong className="text-white">Vous permettre d&apos;exercer vos droits RGPD</strong> : suppression, rectification ou accès à vos données à tout moment.</li>
            </ul>
            <div className="alert-or text-xs text-muted mb-5">
              🛡️ Vos données personnelles sont chiffrées et stockées dans une base de données sécurisée hébergée en Europe. Elles ne sont accessibles qu&apos;à l&apos;équipe de Ça va Parlement et ne sont jamais communiquées à des tiers ni aux élu·es concerné·es. Pour toute demande : <strong className="text-or">dpo.vigiparl@cavaparlement.eu</strong>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div><label className="input-label">Prénom *</label><input className="input" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} /></div>
              <div><label className="input-label">Nom *</label><input className="input" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} /></div>
            </div>
            <div className="mb-3">
              <label className="input-label">Email *</label>
              <input className="input" type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              <p className="text-muted text-xs mt-1">Un email de confirmation vous sera envoyé pour valider votre contribution.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label">Tranche d&apos;âge *</label>
                <select className="input" value={tranche} onChange={e => setTranche(e.target.value)}>
                  <option value="">Sélectionner</option>
                  <option>18-25 ans</option><option>26-30 ans</option><option>31-35 ans</option><option>36-45 ans</option><option>+45 ans</option>
                </select>
              </div>
              <div>
                <label className="input-label">Genre *</label>
                <select className="input" value={genre} onChange={e => setGenre(e.target.value)}>
                  <option value="">Sélectionner</option>
                  <option>Femme</option><option>Homme</option><option>Non-binaire</option><option>Préfère ne pas dire</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Retour</button>
              <button className="btn btn-gold btn-md" onClick={sendOtp}
                disabled={loading || !email || !prenom || !nom || !tranche || !genre}>
                <Turnstile onVerify={(t) => setTurnstileToken(t)} onExpire={() => setTurnstileToken('')} />{loading ? 'Envoi…' : 'Suivant →'}
              </button>
            </div>
          </div>
        )}

        {step === 2 && otpSent && (
          <div className="card anim">
            <h2 className="h2 mb-2">Code de vérification</h2>
            <p className="text-muted text-sm">Un code à 6 chiffres a été envoyé à <strong className="text-white">{email}</strong>. Valable 15 minutes.</p>
            <div className="flex gap-2.5 justify-center my-7">
              {otp.map((d, i) => (
                <input key={i} ref={el => { otpRefs.current[i] = el }}
                  className="otp-input" type="text" inputMode="numeric" maxLength={1} value={d}
                  onChange={e => {
                    if (!/^\d*$/.test(e.target.value)) return
                    const n = [...otp]; n[i] = e.target.value.slice(-1); setOtp(n)
                    if (e.target.value && i < 5) otpRefs.current[i + 1]?.focus()
                  }}
                  onKeyDown={e => { if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus() }}
                />
              ))}
            </div>
            <button className="btn btn-gold btn-md w-full justify-center" onClick={verifyOtp}
              disabled={loading || otp.join('').length < 6}>
              {loading ? 'Vérification…' : 'Valider le code →'}
            </button>
            <button className="btn btn-ghost w-full justify-center mt-3 text-sm"
              onClick={() => { setOtpSent(false); setOtp(['', '', '', '', '', '']) }}>
              ← Changer d&apos;email
            </button>
          </div>
        )}

        {/* ── ÉTAPE 4 : NOTATION ── */}
        {step === 3 && (
          <div className="card anim">
            <h2 className="h2 mb-1">Notation</h2>
            <p className="text-muted text-sm mb-6">Évaluez de 1 à 5 chaque critère. Tous les champs sont obligatoires.</p>
            <div className="space-y-6">
              {CRITERES.map(({ key, label }) => (
                <div key={key}>
                  <p className="text-white text-sm font-medium mb-2">{label}</p>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setNotes(n => ({ ...n, [key]: s }))}
                        className={`star-btn ${notes[key] >= s ? 'on' : ''}`}>★</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <button className="btn btn-ghost" onClick={() => setStep(2)}>← Retour</button>
              <button className="btn btn-gold btn-md" onClick={() => setStep(4)}
                disabled={Object.values(notes).some(v => v === 0)}>Suivant →</button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 5 : QUESTIONS ── */}
        {step === 4 && (
          <div className="card anim">
            <h2 className="h2 mb-1">Questions complémentaires</h2>
            <p className="text-muted text-sm mb-6">Quelques informations supplémentaires.</p>

            <div className="mb-6">
              <p className="text-white text-sm font-medium mb-3">Recommanderiez-vous ce cabinet ? *</p>
              <div className="grid grid-cols-2 gap-3">
                {([{ label: 'Oui', val: true }, { label: 'Non', val: false }] as const).map(o => (
                  <button key={String(o.val)} onClick={() => setRecommande(o.val)}
                    className={`py-3 rounded-xl border font-medium transition-all ${recommande === o.val ? 'border-or bg-or/10 text-or' : 'border-border text-muted hover:border-muted'}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-white text-sm font-medium mb-3">Durée d&apos;expérience *</p>
              <div className="grid grid-cols-2 gap-3">
                {['< 6 mois', '6-12 mois', '1-2 ans', '+ 2 ans'].map(d => (
                  <button key={d} onClick={() => setDuree(d)}
                    className={`py-3 rounded-xl border text-sm transition-all ${duree === d ? 'border-or bg-or/10 text-or' : 'border-border text-muted hover:border-muted'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white text-sm font-medium mb-1">
                Salaire annuel brut <span className="text-muted font-normal">(optionnel)</span>
              </p>
              <p className="text-muted text-xs mb-2">Cette information est facultative et sera uniquement utilisée à des fins statistiques agrégées.</p>
              <div className="relative">
                <input className="input" type="number" placeholder="Ex : 32000" value={salaire} onChange={e => setSalaire(e.target.value)} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">€ brut / an</span>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button className="btn btn-ghost" onClick={() => setStep(3)}>← Retour</button>
              <button className="btn btn-gold btn-md" onClick={() => setStep(5)}
                disabled={recommande === null || !duree}>Suivant →</button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 6 : TÉMOIGNAGE ── */}
        {step === 5 && (
          <div className="card anim">
            <h2 className="h2 mb-1">
              Témoignage <span className="text-muted font-sans text-base font-normal">(optionnel)</span>
            </h2>
            <p className="text-muted text-sm mb-5 leading-relaxed">
              Votre témoignage ne sera <strong className="text-white">jamais publié sur le site VigieParl</strong>. Il sera modéré et pourra alimenter les données internes de cavaparlement.eu, ainsi que la publication éventuelle d&apos;un <strong className="text-or">rapport annuel sur les cabinets parlementaires</strong>.
            </p>
            <textarea className="input resize-none mb-1" style={{ minHeight: '140px' }}
              placeholder="Décrivez votre expérience en quelques mots..."
              value={temoignage} onChange={e => setTemoignage(e.target.value)} maxLength={1000} />
            <p className="text-muted text-xs text-right mb-4">{temoignage.length}/1000</p>
            <div className="info-box text-sm text-muted space-y-1">
              <p>⚠️ Interdictions : accusations directes, noms de personnes, faits non vérifiables.</p>
              <p>🔒 Votre témoignage n&apos;est jamais publié individuellement sur le site. Il alimente uniquement les données internes de cavaparlement.eu.</p>
              <p>📊 Les témoignages servent de base à la publication éventuelle d&apos;un rapport annuel sur les cabinets parlementaires.</p>
            </div>
            <div className="flex justify-between mt-8">
              <button className="btn btn-ghost" onClick={() => setStep(4)}>← Retour</button>
              <button className="btn btn-gold btn-md" onClick={submit} disabled={loading}>
                {loading ? 'Envoi…' : 'Envoyer ✓'}
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-muted text-xs mt-5">
          🛡️ Anonymat garanti · Données agrégées uniquement · Modération stricte
        </p>
      </div>
    </div>
  )
}
