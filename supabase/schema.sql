-- ============================================================
-- VigiParl — Tables Supabase
-- À exécuter dans l'éditeur SQL de https://pmnlfzwfolqeoxaottit.supabase.co
-- ============================================================

-- 1. Sessions OTP (vérification email)
CREATE TABLE IF NOT EXISTS vigiparl_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL,
  email_type   TEXT NOT NULL CHECK (email_type IN ('an', 'senat', 'europarl', 'ancien')),
  otp_code     TEXT NOT NULL,
  expires_at   TIMESTAMPTZ NOT NULL,
  verified     BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vigiparl_sessions_email ON vigiparl_sessions(email);
CREATE INDEX idx_vigiparl_sessions_created ON vigiparl_sessions(created_at);

-- RLS : pas de lecture publique, écriture via service_role uniquement
ALTER TABLE vigiparl_sessions ENABLE ROW LEVEL SECURITY;

-- 2. Soumissions de questionnaires
CREATE TABLE IF NOT EXISTS vigiparl_submissions (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id                UUID REFERENCES vigiparl_sessions(id) ON DELETE SET NULL,
  elu_id                    INTEGER REFERENCES elus(id) ON DELETE CASCADE,
  elu_chambre               TEXT NOT NULL CHECK (elu_chambre IN ('AN', 'SENAT', 'EUROPARL')),

  -- Notes (1 à 5)
  score_conditions_travail  SMALLINT CHECK (score_conditions_travail BETWEEN 1 AND 5),
  score_relations_elu       SMALLINT CHECK (score_relations_elu BETWEEN 1 AND 5),
  score_contenu_travail     SMALLINT CHECK (score_contenu_travail BETWEEN 1 AND 5),
  score_remuneration        SMALLINT CHECK (score_remuneration BETWEEN 1 AND 5),
  score_ambiance            SMALLINT CHECK (score_ambiance BETWEEN 1 AND 5),
  score_global              SMALLINT CHECK (score_global BETWEEN 1 AND 5),

  -- Texte libre
  points_positifs           TEXT,
  points_ameliorer          TEXT,
  recommande                BOOLEAN,

  -- Contexte du poste
  periode_debut             TEXT,   -- ex: "2022-01"
  periode_fin               TEXT,   -- ex: "2024-06" ou "en cours"
  duree_mois                SMALLINT,
  temps_plein               BOOLEAN,
  teletravail_jours         SMALLINT,  -- jours/semaine

  -- Validation manuelle (admin)
  submitted_at              TIMESTAMPTZ DEFAULT NOW(),
  validated                 BOOLEAN DEFAULT FALSE,
  validated_at              TIMESTAMPTZ,
  validated_by              TEXT
);

CREATE INDEX idx_vigiparl_sub_elu ON vigiparl_submissions(elu_id);
CREATE INDEX idx_vigiparl_sub_validated ON vigiparl_submissions(validated);

ALTER TABLE vigiparl_submissions ENABLE ROW LEVEL SECURITY;

-- Lecture publique uniquement des soumissions validées (données agrégées)
CREATE POLICY "lecture_validated" ON vigiparl_submissions
  FOR SELECT USING (validated = true);

-- 3. Scores agrégés par élu (mis à jour via trigger)
CREATE TABLE IF NOT EXISTS vigiparl_elu_scores (
  elu_id                    INTEGER PRIMARY KEY REFERENCES elus(id) ON DELETE CASCADE,
  contributions_count       INTEGER DEFAULT 0,
  score_conditions_travail  NUMERIC(3,2),
  score_relations_elu       NUMERIC(3,2),
  score_contenu_travail     NUMERIC(3,2),
  score_remuneration        NUMERIC(3,2),
  score_ambiance            NUMERIC(3,2),
  score_global              NUMERIC(3,2),
  recommande_pct            SMALLINT,   -- % qui recommandent (0-100)
  last_updated              TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE vigiparl_elu_scores ENABLE ROW LEVEL SECURITY;

-- Lecture publique des scores (uniquement si contributions_count >= 5)
CREATE POLICY "lecture_scores_publiques" ON vigiparl_elu_scores
  FOR SELECT USING (contributions_count >= 5);

-- 4. Trigger : recalcul des scores après validation manuelle
CREATE OR REPLACE FUNCTION recalculate_elu_scores()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO vigiparl_elu_scores (
    elu_id,
    contributions_count,
    score_conditions_travail,
    score_relations_elu,
    score_contenu_travail,
    score_remuneration,
    score_ambiance,
    score_global,
    recommande_pct,
    last_updated
  )
  SELECT
    elu_id,
    COUNT(*)::INTEGER,
    ROUND(AVG(score_conditions_travail)::NUMERIC, 2),
    ROUND(AVG(score_relations_elu)::NUMERIC, 2),
    ROUND(AVG(score_contenu_travail)::NUMERIC, 2),
    ROUND(AVG(score_remuneration)::NUMERIC, 2),
    ROUND(AVG(score_ambiance)::NUMERIC, 2),
    ROUND(AVG(score_global)::NUMERIC, 2),
    ROUND(100.0 * SUM(CASE WHEN recommande = true THEN 1 ELSE 0 END) / NULLIF(COUNT(recommande), 0))::SMALLINT,
    NOW()
  FROM vigiparl_submissions
  WHERE elu_id = NEW.elu_id AND validated = true
  GROUP BY elu_id
  ON CONFLICT (elu_id) DO UPDATE SET
    contributions_count       = EXCLUDED.contributions_count,
    score_conditions_travail  = EXCLUDED.score_conditions_travail,
    score_relations_elu       = EXCLUDED.score_relations_elu,
    score_contenu_travail     = EXCLUDED.score_contenu_travail,
    score_remuneration        = EXCLUDED.score_remuneration,
    score_ambiance            = EXCLUDED.score_ambiance,
    score_global              = EXCLUDED.score_global,
    recommande_pct            = EXCLUDED.recommande_pct,
    last_updated              = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_recalc_scores
  AFTER UPDATE OF validated ON vigiparl_submissions
  FOR EACH ROW
  WHEN (NEW.validated = true AND OLD.validated = false)
  EXECUTE FUNCTION recalculate_elu_scores();
