"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import StarRating from "@/components/StarRating";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "email" | "otp" | "elu" | "context" | "notes" | "texte" | "done";

type EluResult = {
  id: number;
  nom: string;
  prenom: string;
  chambre: "AN" | "SENAT" | "EUROPARL";
  groupe_sigle: string | null;
  groupe_label: string | null;
  departement: string | null;
};

type FormData = {
  sessionId: string;
  emailType: string;
  elu: EluResult | null;
  periodeDebut: string;
  periodeFin: string;
  tempsPLein: boolean | null;
  teletravailJours: number | null;
  scoreConditionsTravail: number;
  scoreRelationsElu: number;
  scoreContenuTravail: number;
  scoreRemuneration: number;
  scoreAmbiance: number;
  scoreGlobal: number;
  pointsPositifs: string;
  pointsAmeliorer: string;
  recommande: boolean | null;
};

const EMPTY_FORM: Omit<FormData, "sessionId" | "emailType"> = {
  elu: null,
  periodeDebut: "",
  periodeFin: "",
  tempsPLein: null,
  teletravailJours: null,
  scoreConditionsTravail: 0,
  scoreRelationsElu: 0,
  scoreContenuTravail: 0,
  scoreRemuneration: 0,
  scoreAmbiance: 0,
  scoreGlobal: 0,
  pointsPositifs: "",
  pointsAmeliorer: "",
  recommande: null,
};

const CHAMBRE_BADGE: Record<string, string> = {
  AN: "badge-an",
  SENAT: "badge-senat",
  EUROPARL: "badge-pe",
};

const CHAMBRE_LABEL: Record<string, string> = {
  AN: "Assemblée nationale",
  SENAT: "Sénat",
  EUROPARL: "Parlement européen",
};

const STEPS: Step[] = ["email", "otp", "elu", "context", "notes", "texte", "done"];
const STEP_LABELS = ["Email", "Vérification", "Élu concerné", "Contexte", "Notes", "Témoignage", "Envoyé"];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QuestionnairePage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [emailType, setEmailType] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [form, setForm] = useState<FormData>({
    sessionId: "",
    emailType: "",
    ...EMPTY_FORM,
  });
  const [eluSearch, setEluSearch] = useState("");
  const [eluResults, setEluResults] = useState<EluResult[]>([]);
  const [eluSearching, setEluSearching] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const stepIndex = STEPS.indexOf(step);
  const progress = (stepIndex / (STEPS.length - 1)) * 100;

  // ── Email step ──────────────────────────────────────────────────────────────

  async function handleSendOtp() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSessionId(data.sessionId);
      setEmailType(data.emailType);
      setForm((f) => ({ ...f, sessionId: data.sessionId, emailType: data.emailType }));
      setStep("otp");
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  // ── OTP step ─────────────────────────────────────────────────────────────────

  function handleOtpInput(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeydown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerifyOtp() {
    setError("");
    setLoading(true);
    const code = otp.join("");
    if (code.length < 6) { setError("Entrez les 6 chiffres."); setLoading(false); return; }
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setStep("elu");
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  // ── Elu search ────────────────────────────────────────────────────────────────

  async function searchElus(q: string) {
    if (q.length < 2) { setEluResults([]); return; }
    setEluSearching(true);
    try {
      const res = await fetch(`/api/elus?q=${encodeURIComponent(q)}&limit=8`);
      const data = await res.json();
      setEluResults(data.elus || []);
    } finally {
      setEluSearching(false);
    }
  }

  function selectElu(elu: EluResult) {
    setForm((f) => ({ ...f, elu }));
    setEluSearch(`${elu.prenom} ${elu.nom}`);
    setEluResults([]);
    setStep("context");
  }

  // ── Submit ────────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/submit-questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: form.sessionId,
          eluId: form.elu?.id,
          eluNom: `${form.elu?.prenom} ${form.elu?.nom}`,
          eluChambre: form.elu?.chambre,
          scoreConditionsTravail: form.scoreConditionsTravail,
          scoreRelationsElu: form.scoreRelationsElu,
          scoreContenuTravail: form.scoreContenuTravail,
          scoreRemuneration: form.scoreRemuneration,
          scoreAmbiance: form.scoreAmbiance,
          scoreGlobal: form.scoreGlobal,
          pointsPositifs: form.pointsPositifs,
          pointsAmeliorer: form.pointsAmeliorer,
          recommande: form.recommande,
          periodeDebut: form.periodeDebut,
          periodeFin: form.periodeFin,
          tempsPLein: form.tempsPLein,
          teletravailJours: form.teletravailJours,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setStep("done");
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-[#2d3748] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-xl">🏛️</span>
          <span className="font-display font-semibold text-parchemin">VigiParl</span>
        </Link>
        <span className="text-acier text-sm font-sans hidden sm:block">
          Étape {stepIndex + 1} sur {STEPS.length} — {STEP_LABELS[stepIndex]}
        </span>
      </nav>

      {/* Progress */}
      {step !== "done" && (
        <div className="h-[3px] bg-[#2d3748]">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Step tabs (desktop) */}
      {step !== "done" && (
        <div className="hidden sm:flex border-b border-[#2d3748] px-6">
          {STEP_LABELS.slice(0, -1).map((label, i) => (
            <div
              key={label}
              className={`px-4 py-3 text-xs font-mono border-b-2 transition-colors ${
                i === stepIndex
                  ? "border-brique text-brique"
                  : i < stepIndex
                  ? "border-transparent text-acier"
                  : "border-transparent text-[#2d3748]"
              }`}
            >
              {i < stepIndex ? "✓ " : `${i + 1}. `}{label}
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {error && (
            <div className="mb-6 bg-red-950/50 border border-red-800 rounded-lg px-4 py-3 text-red-300 text-sm font-sans">
              ⚠️ {error}
            </div>
          )}

          {/* ── STEP: EMAIL ── */}
          {step === "email" && (
            <div className="fade-up">
              <h1 className="font-display text-3xl text-parchemin mb-2">Votre adresse email</h1>
              <p className="text-acier font-sans mb-8 leading-relaxed">
                Entrez votre email professionnel ou personnel. Un code de vérification vous sera envoyé. <strong className="text-sable">Votre adresse ne sera jamais publiée.</strong>
              </p>

              <div className="space-y-3 mb-6">
                <label className="text-parchemin text-sm font-sans font-medium block">
                  Adresse email
                </label>
                <input
                  type="email"
                  className="input-dark"
                  placeholder="prenom.nom@assemblee-nationale.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  autoFocus
                />
              </div>

              <div className="bg-encre2 border border-[#2d3748] rounded-lg p-4 mb-8">
                <p className="text-acier text-xs font-sans mb-2 font-medium uppercase tracking-wide">Emails acceptés</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="badge-an text-xs px-2 py-0.5 rounded font-mono">@clb-an.fr</span>
                    <span className="text-acier text-xs">Collaborateurs AN actifs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-senat text-xs px-2 py-0.5 rounded font-mono">@clb-senat.fr</span>
                    <span className="text-acier text-xs">Collaborateurs Sénat actifs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-pe text-xs px-2 py-0.5 rounded font-mono">@europarl.europa.eu</span>
                    <span className="text-acier text-xs">Collaborateurs PE actifs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-ancien text-xs px-2 py-0.5 rounded font-mono">Tout email valide</span>
                    <span className="text-acier text-xs">Anciens collaborateurs</span>
                  </div>
                </div>
              </div>

              <button
                className="btn-primary w-full"
                onClick={handleSendOtp}
                disabled={loading || !email}
              >
                {loading ? "Envoi en cours…" : "Recevoir mon code →"}
              </button>
            </div>
          )}

          {/* ── STEP: OTP ── */}
          {step === "otp" && (
            <div className="fade-up">
              <h1 className="font-display text-3xl text-parchemin mb-2">Vérification email</h1>
              <p className="text-acier font-sans mb-8">
                Un code à 6 chiffres a été envoyé à <strong className="text-sable">{email}</strong>. Il est valable 15 minutes.
              </p>

              <div className="flex gap-3 justify-center mb-8">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeydown(i, e)}
                    className="w-12 h-14 text-center text-2xl font-mono bg-encre2 border border-[#2d3748] rounded-lg text-parchemin focus:border-brique focus:outline-none transition-colors"
                  />
                ))}
              </div>

              <button
                className="btn-primary w-full mb-4"
                onClick={handleVerifyOtp}
                disabled={loading || otp.join("").length < 6}
              >
                {loading ? "Vérification…" : "Valider le code →"}
              </button>
              <button
                className="btn-ghost w-full text-sm"
                onClick={() => { setStep("email"); setOtp(["","","","","",""]); }}
              >
                ← Changer d'email
              </button>
            </div>
          )}

          {/* ── STEP: ELU ── */}
          {step === "elu" && (
            <div className="fade-up">
              <h1 className="font-display text-3xl text-parchemin mb-2">Quel élu concerné ?</h1>
              <p className="text-acier font-sans mb-8">
                Recherchez l&apos;élu pour lequel vous souhaitez témoigner.
              </p>

              <div className="relative mb-4">
                <input
                  type="text"
                  className="input-dark pr-10"
                  placeholder="Nom ou prénom de l'élu…"
                  value={eluSearch}
                  onChange={(e) => {
                    setEluSearch(e.target.value);
                    searchElus(e.target.value);
                    if (!e.target.value) setForm((f) => ({ ...f, elu: null }));
                  }}
                  autoFocus
                />
                {eluSearching && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-acier text-sm">⏳</span>
                )}
              </div>

              {eluResults.length > 0 && (
                <div className="bg-encre2 border border-[#2d3748] rounded-lg overflow-hidden mb-4">
                  {eluResults.map((elu) => (
                    <button
                      key={elu.id}
                      onClick={() => selectElu(elu)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1e2738] transition-colors text-left border-b border-[#2d3748] last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-parchemin text-sm font-sans font-medium">
                          {elu.prenom} {elu.nom}
                        </p>
                        <p className="text-acier text-xs mt-0.5">
                          {elu.groupe_sigle && <span className="mr-2">{elu.groupe_sigle}</span>}
                          {elu.departement && <span>{elu.departement}</span>}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded font-mono ${CHAMBRE_BADGE[elu.chambre]}`}>
                        {elu.chambre}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {form.elu && (
                <div className="gradient-border rounded-lg p-4 mb-6">
                  <p className="text-parchemin text-sm font-sans font-medium mb-1">Élu sélectionné</p>
                  <p className="text-brique font-display text-lg">
                    {form.elu.prenom} {form.elu.nom}
                  </p>
                  <p className="text-acier text-xs mt-1">
                    {CHAMBRE_LABEL[form.elu.chambre]}
                    {form.elu.groupe_label && ` · ${form.elu.groupe_label}`}
                  </p>
                </div>
              )}

              <button
                className="btn-primary w-full"
                onClick={() => setStep("context")}
                disabled={!form.elu}
              >
                Continuer →
              </button>
            </div>
          )}

          {/* ── STEP: CONTEXT ── */}
          {step === "context" && (
            <div className="fade-up">
              <h1 className="font-display text-3xl text-parchemin mb-2">Contexte de votre poste</h1>
              <p className="text-acier font-sans mb-8">
                Ces informations nous aident à contextualiser votre témoignage. Répondez à ce que vous souhaitez.
              </p>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-parchemin text-sm font-sans font-medium block mb-2">
                      Début de poste
                    </label>
                    <input
                      type="month"
                      className="input-dark"
                      value={form.periodeDebut}
                      onChange={(e) => setForm((f) => ({ ...f, periodeDebut: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-parchemin text-sm font-sans font-medium block mb-2">
                      Fin de poste
                    </label>
                    <input
                      type="month"
                      className="input-dark"
                      value={form.periodeFin}
                      onChange={(e) => setForm((f) => ({ ...f, periodeFin: e.target.value }))}
                      placeholder="Laissez vide si en cours"
                    />
                    <p className="text-acier text-xs mt-1">Vide = poste en cours</p>
                  </div>
                </div>

                <div>
                  <label className="text-parchemin text-sm font-sans font-medium block mb-3">
                    Type de contrat
                  </label>
                  <div className="flex gap-3">
                    {[
                      { label: "Temps plein", value: true },
                      { label: "Temps partiel", value: false },
                    ].map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, tempsPLein: opt.value }))}
                        className={`flex-1 py-3 rounded-lg border text-sm font-sans transition-colors ${
                          form.tempsPLein === opt.value
                            ? "border-brique text-brique bg-brique/10"
                            : "border-[#2d3748] text-acier hover:border-acier"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-parchemin text-sm font-sans font-medium block mb-3">
                    Télétravail (jours/semaine)
                  </label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, teletravailJours: d }))}
                        className={`flex-1 py-2.5 rounded-lg border text-sm font-mono transition-colors ${
                          form.teletravailJours === d
                            ? "border-brique text-brique bg-brique/10"
                            : "border-[#2d3748] text-acier hover:border-acier"
                        }`}
                      >
                        {d === 0 ? "Aucun" : d === 5 ? "Full" : d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <button className="btn-ghost" onClick={() => setStep("elu")}>← Retour</button>
                <button className="btn-primary flex-1" onClick={() => setStep("notes")}>
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: NOTES ── */}
          {step === "notes" && (
            <div className="fade-up">
              <h1 className="font-display text-3xl text-parchemin mb-2">Vos évaluations</h1>
              <p className="text-acier font-sans mb-8">
                Notez chaque critère de 1 à 5 étoiles. Les 5 premiers sont obligatoires.
              </p>

              <div className="space-y-7">
                <StarRating
                  value={form.scoreConditionsTravail}
                  onChange={(v) => setForm((f) => ({ ...f, scoreConditionsTravail: v }))}
                  label="Conditions de travail"
                  description="Horaires, charge de travail, équipements, lieu"
                  required
                />
                <StarRating
                  value={form.scoreRelationsElu}
                  onChange={(v) => setForm((f) => ({ ...f, scoreRelationsElu: v }))}
                  label="Relations avec l'élu·e"
                  description="Respect, communication, management"
                  required
                />
                <StarRating
                  value={form.scoreContenuTravail}
                  onChange={(v) => setForm((f) => ({ ...f, scoreContenuTravail: v }))}
                  label="Contenu du travail"
                  description="Intérêt des missions, diversité, formation"
                  required
                />
                <StarRating
                  value={form.scoreRemuneration}
                  onChange={(v) => setForm((f) => ({ ...f, scoreRemuneration: v }))}
                  label="Rémunération"
                  description="Salaire, avantages, évolution"
                  required
                />
                <StarRating
                  value={form.scoreAmbiance}
                  onChange={(v) => setForm((f) => ({ ...f, scoreAmbiance: v }))}
                  label="Ambiance d'équipe"
                  description="Cohésion, entraide, atmosphère de travail"
                  required
                />
                <div className="border-t border-[#2d3748] pt-6">
                  <StarRating
                    value={form.scoreGlobal}
                    onChange={(v) => setForm((f) => ({ ...f, scoreGlobal: v }))}
                    label="Note globale"
                    description="Votre appréciation d'ensemble de ce poste"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <button className="btn-ghost" onClick={() => setStep("context")}>← Retour</button>
                <button
                  className="btn-primary flex-1"
                  onClick={() => setStep("texte")}
                  disabled={
                    !form.scoreConditionsTravail ||
                    !form.scoreRelationsElu ||
                    !form.scoreContenuTravail ||
                    !form.scoreRemuneration ||
                    !form.scoreAmbiance ||
                    !form.scoreGlobal
                  }
                >
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: TEXTE ── */}
          {step === "texte" && (
            <div className="fade-up">
              <h1 className="font-display text-3xl text-parchemin mb-2">Votre témoignage</h1>
              <p className="text-acier font-sans mb-8">
                Ces textes sont optionnels mais précieux. Soyez factuel·le — évitez les noms de tiers.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-parchemin text-sm font-sans font-medium block mb-2">
                    Points positifs <span className="text-acier font-normal">(optionnel)</span>
                  </label>
                  <textarea
                    className="input-dark min-h-[100px] resize-none"
                    placeholder="Ce qui fonctionnait bien dans ce poste…"
                    value={form.pointsPositifs}
                    onChange={(e) => setForm((f) => ({ ...f, pointsPositifs: e.target.value }))}
                    maxLength={1000}
                  />
                  <p className="text-acier text-xs mt-1">{form.pointsPositifs.length}/1000</p>
                </div>

                <div>
                  <label className="text-parchemin text-sm font-sans font-medium block mb-2">
                    Points à améliorer <span className="text-acier font-normal">(optionnel)</span>
                  </label>
                  <textarea
                    className="input-dark min-h-[100px] resize-none"
                    placeholder="Ce qui pourrait être amélioré…"
                    value={form.pointsAmeliorer}
                    onChange={(e) => setForm((f) => ({ ...f, pointsAmeliorer: e.target.value }))}
                    maxLength={1000}
                  />
                  <p className="text-acier text-xs mt-1">{form.pointsAmeliorer.length}/1000</p>
                </div>

                <div>
                  <label className="text-parchemin text-sm font-sans font-medium block mb-3">
                    Recommanderiez-vous ce poste ?
                  </label>
                  <div className="flex gap-3">
                    {[
                      { label: "👍 Oui", value: true },
                      { label: "👎 Non", value: false },
                    ].map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, recommande: opt.value }))}
                        className={`flex-1 py-3 rounded-lg border text-sm font-sans transition-colors ${
                          form.recommande === opt.value
                            ? "border-brique text-brique bg-brique/10"
                            : "border-[#2d3748] text-acier hover:border-acier"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary before submit */}
              <div className="mt-8 bg-encre2 border border-[#2d3748] rounded-lg p-5">
                <p className="text-acier text-xs font-mono uppercase tracking-wide mb-3">Récapitulatif</p>
                <p className="text-parchemin text-sm font-sans mb-1">
                  <span className="text-acier">Élu :</span>{" "}
                  {form.elu?.prenom} {form.elu?.nom} ({form.elu?.chambre})
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  {[
                    { label: "Conditions", score: form.scoreConditionsTravail },
                    { label: "Relations", score: form.scoreRelationsElu },
                    { label: "Contenu", score: form.scoreContenuTravail },
                    { label: "Rémunération", score: form.scoreRemuneration },
                    { label: "Ambiance", score: form.scoreAmbiance },
                    { label: "Global", score: form.scoreGlobal },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-1">
                      <span className="text-acier text-xs">{s.label} :</span>
                      <span className="text-or text-xs font-mono">{"★".repeat(s.score)}{"☆".repeat(5 - s.score)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="btn-ghost" onClick={() => setStep("notes")}>← Retour</button>
                <button
                  className="btn-primary flex-1"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Envoi en cours…" : "✅ Soumettre mon témoignage"}
                </button>
              </div>

              <p className="text-acier text-xs text-center mt-4 font-sans">
                En soumettant, vous acceptez la{" "}
                <Link href="/confidentialite" className="underline">politique de confidentialité</Link>.
                Votre email ne sera jamais publié.
              </p>
            </div>
          )}

          {/* ── STEP: DONE ── */}
          {step === "done" && (
            <div className="fade-up text-center">
              <div className="text-7xl mb-6">✅</div>
              <h1 className="font-display text-3xl text-parchemin mb-4">Témoignage reçu !</h1>
              <p className="text-acier font-sans mb-6 leading-relaxed">
                Merci pour votre contribution. Un email de confirmation vous a été envoyé à{" "}
                <strong className="text-sable">{email}</strong>.
              </p>
              <div className="bg-encre2 border border-[#2d3748] rounded-lg p-5 mb-8 text-left">
                <p className="text-parchemin text-sm font-sans font-medium mb-2">Et maintenant ?</p>
                <ul className="text-acier text-sm font-sans space-y-2">
                  <li>📋 Votre témoignage est en attente de validation manuelle</li>
                  <li>🔒 Il ne sera publié que si 5 contributions min. sont collectées pour cet élu</li>
                  <li>📊 Seules les données agrégées (notes moyennes) seront visibles</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/elus" className="btn-primary">
                  🔍 Consulter l&apos;annuaire des élus
                </Link>
                <Link href="/" className="btn-ghost">
                  ← Retour à l&apos;accueil
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
