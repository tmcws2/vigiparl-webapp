"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ScoreRing from "@/components/ScoreRing";

type EluWithScores = {
  id: number;
  nom: string;
  prenom: string;
  chambre: "AN" | "SENAT" | "EUROPARL";
  groupe_sigle: string | null;
  groupe_label: string | null;
  famille_politique: string | null;
  departement: string | null;
  an_id: string | null;
  matricule: string | null;
  ep_id: string | null;
  vigiparl_elu_scores: {
    contributions_count: number;
    score_global: number;
    score_conditions_travail: number;
    score_relations_elu: number;
    score_contenu_travail: number;
    score_remuneration: number;
    score_ambiance: number;
    recommande_pct: number;
  } | null;
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

const FAMILLE_COLORS: Record<string, string> = {
  "Identitaires & souverainistes": "#c0392b",
  "Démocrates-chrétiens & droite classique": "#2980b9",
  "Libéraux & centristes": "#f39c12",
  "Socialistes & progressistes": "#e91e63",
  "Écologistes": "#27ae60",
  "Gauche radicale": "#8e44ad",
};

function photoUrl(elu: EluWithScores): string | null {
  if (elu.chambre === "AN" && elu.an_id)
    return `https://raw.githubusercontent.com/cavaparlement/cavaparlement-bot/main/photos/assemblee/${elu.an_id}.jpg`;
  if (elu.chambre === "SENAT" && elu.matricule)
    return `https://raw.githubusercontent.com/cavaparlement/cavaparlement-bot/main/photos/senat/${elu.matricule}.jpg`;
  if (elu.chambre === "EUROPARL" && elu.ep_id)
    return `https://raw.githubusercontent.com/cavaparlement/cavaparlement-bot/main/photos/europarl/${elu.ep_id}.jpg`;
  return null;
}

export default function ElusPage() {
  const [query, setQuery] = useState("");
  const [chambre, setChambre] = useState("");
  const [elus, setElus] = useState<EluWithScores[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<EluWithScores | null>(null);

  const fetchElus = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        page: String(page),
        ...(chambre && { chambre }),
      });
      const res = await fetch(`/api/elus?${params}`);
      const data = await res.json();
      setElus(data.elus || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [query, chambre, page]);

  useEffect(() => {
    fetchElus();
  }, [fetchElus]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [query, chambre]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-[#2d3748] px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-encre/95 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-xl">🏛️</span>
          <span className="font-display font-semibold text-parchemin">VigiParl</span>
        </Link>
        <Link href="/questionnaire" className="btn-primary text-sm">📝 Témoigner</Link>
      </nav>

      <div className="flex flex-1">
        {/* Left panel: search + list */}
        <div className={`flex flex-col ${selected ? "hidden lg:flex lg:w-1/2 xl:w-2/5" : "flex-1"} border-r border-[#2d3748]`}>
          {/* Header */}
          <div className="px-6 py-6 border-b border-[#2d3748]">
            <h1 className="font-display text-2xl text-parchemin mb-1">Annuaire des élus</h1>
            <p className="text-acier text-sm font-sans">
              {total > 0 ? `${total.toLocaleString("fr-FR")} élus` : "Recherche…"}
              {" · Scores visibles à partir de 5 contributions"}
            </p>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-[#2d3748] space-y-3">
            <input
              type="search"
              className="input-dark"
              placeholder="Rechercher un élu par nom…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex gap-2">
              {["", "AN", "SENAT", "EUROPARL"].map((c) => (
                <button
                  key={c}
                  onClick={() => setChambre(c)}
                  className={`flex-1 py-1.5 text-xs font-mono rounded border transition-colors ${
                    chambre === c
                      ? "border-brique text-brique bg-brique/10"
                      : "border-[#2d3748] text-acier hover:border-acier"
                  }`}
                >
                  {c || "Toutes"}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-16 text-acier">
                <span className="font-mono text-sm">Chargement…</span>
              </div>
            )}
            {!loading && elus.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-acier">
                <span className="text-4xl mb-3">🔍</span>
                <p className="text-sm font-sans">Aucun élu trouvé</p>
              </div>
            )}
            {!loading && elus.map((elu) => {
              const scores = elu.vigiparl_elu_scores;
              const photo = photoUrl(elu);
              const isSelected = selected?.id === elu.id;

              return (
                <button
                  key={elu.id}
                  onClick={() => setSelected(isSelected ? null : elu)}
                  className={`w-full flex items-center gap-4 px-6 py-4 border-b border-[#2d3748] hover:bg-encre2 transition-colors text-left ${
                    isSelected ? "bg-encre2 border-l-2 border-l-brique" : ""
                  }`}
                >
                  {/* Photo */}
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2d3748] flex-shrink-0">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-acier text-lg">
                        {elu.prenom[0]}{elu.nom[0]}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-parchemin text-sm font-sans font-medium truncate">
                      {elu.prenom} {elu.nom}
                    </p>
                    <p className="text-acier text-xs mt-0.5 truncate">
                      {elu.groupe_sigle && <span className="mr-2">{elu.groupe_sigle}</span>}
                      {elu.departement}
                    </p>
                  </div>

                  {/* Score or badge */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {scores ? (
                      <div className="text-right">
                        <p className="text-or font-mono text-sm font-medium">{scores.score_global.toFixed(1)}</p>
                        <p className="text-acier text-xs">{scores.contributions_count} avis</p>
                      </div>
                    ) : (
                      <span className={`text-xs px-2 py-0.5 rounded font-mono ${CHAMBRE_BADGE[elu.chambre]}`}>
                        {elu.chambre}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[#2d3748] flex items-center justify-between">
              <button
                className="btn-ghost text-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Précédent
              </button>
              <span className="text-acier text-sm font-mono">
                {page} / {totalPages}
              </span>
              <button
                className="btn-ghost text-sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Suivant →
              </button>
            </div>
          )}
        </div>

        {/* Right panel: detail */}
        {selected && (
          <div className="flex-1 lg:flex flex-col overflow-y-auto">
            <div className="px-6 py-6 border-b border-[#2d3748] flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#2d3748] flex-shrink-0">
                  {photoUrl(selected) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoUrl(selected)!}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-acier">
                      {selected.prenom[0]}{selected.nom[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="font-display text-2xl text-parchemin">{selected.prenom} {selected.nom}</h2>
                  <p className="text-acier text-sm mt-1">{CHAMBRE_LABEL[selected.chambre]}</p>
                  {selected.famille_politique && (
                    <span
                      className="inline-block text-xs px-2 py-0.5 rounded-full mt-2 font-sans"
                      style={{
                        background: `${FAMILLE_COLORS[selected.famille_politique] || "#4a5568"}20`,
                        color: FAMILLE_COLORS[selected.famille_politique] || "#8b9ab0",
                        border: `1px solid ${FAMILLE_COLORS[selected.famille_politique] || "#4a5568"}40`,
                      }}
                    >
                      {selected.famille_politique}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-acier hover:text-parchemin text-2xl leading-none lg:hidden"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-6">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { label: "Chambre", value: CHAMBRE_LABEL[selected.chambre] },
                  { label: "Groupe", value: selected.groupe_label || selected.groupe_sigle || "—" },
                  { label: "Famille politique", value: selected.famille_politique || "—" },
                  { label: "Département", value: selected.departement || "—" },
                ].map((item) => (
                  <div key={item.label} className="bg-encre2 border border-[#2d3748] rounded-lg p-3">
                    <p className="text-acier text-xs font-mono uppercase tracking-wide mb-1">{item.label}</p>
                    <p className="text-parchemin text-sm font-sans">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Scores section */}
              {selected.vigiparl_elu_scores ? (
                <>
                  <h3 className="font-display text-xl text-parchemin mb-1">Évaluations des collaborateurs</h3>
                  <p className="text-acier text-sm font-sans mb-6">
                    Basé sur {selected.vigiparl_elu_scores.contributions_count} témoignages validés
                  </p>

                  {/* Global score + recommend */}
                  <div className="flex items-center gap-6 mb-8 bg-encre2 border border-[#2d3748] rounded-xl p-5">
                    <ScoreRing score={selected.vigiparl_elu_scores.score_global} size="lg" />
                    <div>
                      <p className="text-parchemin font-display text-lg mb-1">Note globale</p>
                      <p className="text-acier text-sm font-sans">
                        {selected.vigiparl_elu_scores.recommande_pct !== null && (
                          <>
                            <span className="text-parchemin font-medium">{selected.vigiparl_elu_scores.recommande_pct}%</span> recommanderaient ce poste
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Detailed scores */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    {[
                      { label: "Conditions", key: "score_conditions_travail", icon: "⏰" },
                      { label: "Relations", key: "score_relations_elu", icon: "🤝" },
                      { label: "Contenu", key: "score_contenu_travail", icon: "💼" },
                      { label: "Rémunération", key: "score_remuneration", icon: "💶" },
                      { label: "Ambiance", key: "score_ambiance", icon: "👥" },
                    ].map((item) => {
                      const score = selected.vigiparl_elu_scores![item.key as keyof typeof selected.vigiparl_elu_scores] as number;
                      return (
                        <div key={item.key} className="bg-encre2 border border-[#2d3748] rounded-lg p-4 flex flex-col items-center gap-2">
                          <span className="text-xl">{item.icon}</span>
                          <ScoreRing score={score} size="sm" />
                          <p className="text-acier text-xs font-sans text-center">{item.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="bg-encre2 border border-[#2d3748] rounded-xl p-8 text-center">
                  <span className="text-4xl mb-4 block">📋</span>
                  <h3 className="font-display text-xl text-parchemin mb-2">Pas encore de données</h3>
                  <p className="text-acier text-sm font-sans mb-6 max-w-xs mx-auto">
                    Les scores s&apos;afficheront dès que 5 contributions validées auront été collectées pour cet élu.
                  </p>
                  <Link href="/questionnaire" className="btn-primary inline-block">
                    📝 Déposer un témoignage
                  </Link>
                </div>
              )}

              <div className="mt-4">
                <Link href="/questionnaire" className="btn-ghost w-full text-center block">
                  📝 Contribuer pour {selected.prenom} {selected.nom}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Empty state when no selection on desktop */}
        {!selected && (
          <div className="hidden lg:flex flex-1 items-center justify-center text-center px-12">
            <div>
              <span className="text-5xl mb-4 block">👈</span>
              <p className="text-acier font-sans">Sélectionnez un élu pour voir ses évaluations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
