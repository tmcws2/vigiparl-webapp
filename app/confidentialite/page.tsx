import Link from "next/link";

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-[#2d3748] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-xl">🏛️</span>
          <span className="font-display font-semibold text-parchemin">VigiParl</span>
        </Link>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl text-parchemin mb-2">Politique de confidentialité</h1>
        <p className="text-acier font-sans mb-10">Dernière mise à jour : avril 2026</p>

        <div className="space-y-8 font-body text-sable leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-parchemin mb-3">Données collectées</h2>
            <p>Lors de la soumission d&apos;un témoignage, nous collectons :</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-acier">
              <li>Votre adresse email (pour l&apos;authentification et l&apos;envoi de confirmation)</li>
              <li>Le type de collaborateur (actif AN/Sénat/PE ou ancien)</li>
              <li>Les notes et témoignages textuels que vous soumettez</li>
              <li>Le contexte du poste (période, temps partiel, télétravail)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-parchemin mb-3">Ce qui est publié</h2>
            <p><strong className="text-parchemin">Uniquement les données agrégées</strong> : notes moyennes par critère, pourcentage de recommandation, nombre de contributions.</p>
            <p className="mt-2">Les témoignages textuels bruts ne sont jamais publiés. Votre adresse email n&apos;est jamais rendue publique.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-parchemin mb-3">Seuil de publication</h2>
            <p>Les données d&apos;un élu ne s&apos;affichent qu&apos;à partir de <strong className="text-parchemin">5 contributions validées</strong>. Ce seuil protège l&apos;anonymat de chaque témoignage individuel.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-parchemin mb-3">Validation manuelle</h2>
            <p>Chaque soumission est examinée manuellement par l&apos;équipe VigiParl avant toute publication. Les témoignages diffamatoires, hors-sujet ou contenant des noms de tiers sont rejetés.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-parchemin mb-3">Stockage et sécurité</h2>
            <p>Les données sont stockées sur Supabase (région Europe). Les sessions OTP expirent automatiquement après 15 minutes. Les mots de passe et clés API ne sont jamais stockés côté client.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-parchemin mb-3">Vos droits</h2>
            <p>Vous pouvez demander la suppression de votre témoignage à tout moment en écrivant à <a href="mailto:contact@cavaparlement.eu" className="text-brique underline">contact@cavaparlement.eu</a>.</p>
          </section>
        </div>

        <div className="mt-10 pt-8 border-t border-[#2d3748]">
          <Link href="/" className="btn-ghost">← Retour à l&apos;accueil</Link>
        </div>
      </main>
    </div>
  );
}
