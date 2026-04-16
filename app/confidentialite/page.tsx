import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Nav />
      <div className="page-container max-w-2xl py-16 flex-1">
        <h1 className="font-spectral font-bold text-white text-4xl mb-2">Politique de confidentialité</h1>
        <p className="text-muted mb-10">Dernière mise à jour : avril 2026</p>
        <div className="space-y-8 text-muted text-sm leading-relaxed">
          {[
            { t: 'Données collectées', c: 'Lors de la soumission d\'un témoignage, nous collectons votre adresse email (pour l\'authentification et l\'envoi de confirmation), le type de collaborateur, les notes et témoignages textuels, et le contexte du poste (période, temps partiel, télétravail).' },
            { t: 'Ce qui est publié', c: 'Uniquement les données agrégées : notes moyennes par critère, pourcentage de recommandation, nombre de contributions. Les témoignages textuels bruts ne sont jamais publiés. Votre adresse email n\'est jamais rendue publique.' },
            { t: 'Seuil de publication', c: 'Les données d\'un élu ne s\'affichent qu\'à partir de 5 contributions validées. Ce seuil protège l\'anonymat de chaque témoignage individuel.' },
            { t: 'Validation manuelle', c: 'Chaque soumission est examinée manuellement par l\'équipe VigieParl avant toute publication. Les témoignages diffamatoires, hors-sujet ou contenant des noms de tiers sont rejetés.' },
            { t: 'Stockage et sécurité', c: 'Les données sont stockées sur Supabase (région Europe). Les sessions OTP expirent automatiquement après 15 minutes.' },
            { t: 'Vos droits', c: 'Vous pouvez demander la suppression de votre témoignage à tout moment en écrivant à dpo.vigiparl@cavaparlement.eu.' },
          ].map(s => (
            <div key={s.t}>
              <h2 className="font-spectral font-bold text-white text-xl mb-2">{s.t}</h2>
              <p>{s.c}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-8 border-t border-border">
          <Link href="/" className="btn btn-ghost">← Retour à l&apos;accueil</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
