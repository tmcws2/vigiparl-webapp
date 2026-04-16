# 🏛️ VigiParl

**Observatoire des conditions de travail parlementaires**  
Sous-domaine : `vigiparl.cavaparlement.eu`  
Projet de [CavaParlement](https://cavaparlement.eu)

---

## Fonctionnalités

- **Authentification email + OTP** : vérification par code à 6 chiffres (15 min), rate-limiting 3 tentatives/heure
- **Emails institutions acceptés** : `@assemblee-nationale.fr`, `@senat.fr`, `@europarl.europa.eu` pour collabs actifs — tout email valide pour anciens collabs
- **Questionnaire sécurisé** : 6 critères notés (1-5★), texte libre, contexte du poste
- **Email de confirmation** automatique via Resend après soumission
- **Validation manuelle** : aucun témoignage publié sans approbation
- **Seuil de publication** : scores visibles uniquement à partir de 5 contributions validées par élu
- **Annuaire élus** : recherche + filtres chambre, photos depuis GitHub, scores en anneaux SVG
- **Recalcul automatique** des scores via trigger Supabase à chaque validation

---

## Stack

| Élément | Choix |
|---------|-------|
| Framework | Next.js 14 App Router, TypeScript |
| Style | Tailwind CSS, Playfair Display, Source Serif 4 |
| Base de données | Supabase (projet existant `pmnlfzwfolqeoxaottit`) |
| Emails | Resend |
| Hébergement | Vercel (compte `tmcws2`) |
| DNS | Infomaniak → sous-domaine `vigiparl.cavaparlement.eu` |

---

## Installation

```bash
cd vigiparl
npm install
cp .env.example .env.local
# Remplir .env.local avec les vraies valeurs
npm run dev
```

---

## Configuration Supabase

### 1. Régénérer la service_role key ⚠️
L'ancienne clé a été exposée. Dans Supabase → Settings → API → Regenerate service_role key.

### 2. Exécuter le schéma SQL
Dans l'éditeur SQL de Supabase :
```
supabase/schema.sql
```
Ce script crée :
- `vigiparl_sessions` — stockage des OTP avec expiration
- `vigiparl_submissions` — soumissions avec validation manuelle
- `vigiparl_elu_scores` — scores agrégés par élu (recalculés automatiquement)
- Trigger `trigger_recalc_scores` — met à jour les scores à chaque validation

### 3. RLS configuré
- `vigiparl_sessions` : accès service_role uniquement (pas de lecture publique)
- `vigiparl_submissions` : lecture publique des validées uniquement
- `vigiparl_elu_scores` : lecture publique si `contributions_count >= 5`

---

## Configuration Resend

1. Créer un compte sur [resend.com](https://resend.com)
2. Aller dans **Domains** → **Add Domain** → `cavaparlement.eu`
3. Ajouter les enregistrements DNS sur Infomaniak :
   - 1 enregistrement MX
   - 2 enregistrements TXT (SPF + DKIM)
4. Vérifier le domaine
5. Créer une **API Key** avec les permissions d'envoi
6. Copier la clé dans `RESEND_API_KEY`

Les emails sont envoyés depuis `no-reply@cavaparlement.eu`.

---

## Déploiement Vercel

### Nouveau projet
```bash
# Installer Vercel CLI si besoin
npm i -g vercel

# Dans le dossier vigiparl/
vercel
# Suivre les instructions, choisir le compte tmcws2
```

### Variables d'environnement Vercel
Dans Vercel → Project Settings → Environment Variables, ajouter :
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
```

### Domaine personnalisé
Dans Vercel → Domains → Add → `vigiparl.cavaparlement.eu`

Puis sur Infomaniak DNS :
```
CNAME  vigiparl  cname.vercel-dns.com
```

---

## Validation manuelle des témoignages

Pour valider un témoignage depuis Supabase Studio :

```sql
-- Voir les soumissions en attente
SELECT s.id, e.prenom, e.nom, e.chambre,
       s.score_global, s.submitted_at
FROM vigiparl_submissions s
JOIN elus e ON e.id = s.elu_id
WHERE s.validated = false
ORDER BY s.submitted_at DESC;

-- Valider une soumission (déclenche le recalcul des scores)
UPDATE vigiparl_submissions
SET validated = true,
    validated_at = NOW(),
    validated_by = 'admin'
WHERE id = '...uuid...';

-- Rejeter (supprimer)
DELETE FROM vigiparl_submissions WHERE id = '...uuid...';
```

---

## Structure des fichiers

```
vigiparl/
├── app/
│   ├── layout.tsx              # Layout global + métadonnées
│   ├── globals.css             # Design system (variables CSS, animations)
│   ├── page.tsx                # Landing page
│   ├── questionnaire/
│   │   └── page.tsx            # Formulaire complet (email → OTP → notes → submit)
│   ├── elus/
│   │   └── page.tsx            # Annuaire avec recherche et scores
│   ├── confidentialite/
│   │   └── page.tsx            # Politique de confidentialité
│   └── api/
│       ├── send-otp/route.ts   # POST → génère et envoie l'OTP
│       ├── verify-otp/route.ts # POST → vérifie l'OTP
│       ├── submit-questionnaire/route.ts  # POST → sauvegarde + confirmation email
│       └── elus/route.ts       # GET → recherche élus + scores
├── components/
│   ├── StarRating.tsx          # Sélecteur étoiles interactif
│   └── ScoreRing.tsx           # Anneau SVG avec score (1-5)
├── lib/
│   ├── supabase.ts             # Clients Supabase + détection type email
│   └── emails.ts               # Templates HTML emails (OTP + confirmation)
├── supabase/
│   └── schema.sql              # Script SQL pour les 3 nouvelles tables
├── .env.example                # Variables à configurer
└── README.md
```

---

## Lien avec le projet existant

Ce projet utilise la même base Supabase que `tmcws2/cavaparlement-webapp` :
- Table `elus` (1577 élus migrés le 13/04)
- Relation `vigiparl_elu_scores.elu_id → elus.id`
- Photos depuis `cavaparlement/cavaparlement-bot` sur GitHub raw

Les scores VigiParl pourront être intégrés à terme sur `cavaparlement.eu/elus` via les mêmes données Supabase.
