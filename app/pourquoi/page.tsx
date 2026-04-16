import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function PourquoiPage() {
  return (
    <div className="min-h-screen bg-navy">
      <Nav active="pourquoi" />
      <div className="page-container max-w-3xl py-16">

        <span className="badge badge-or mb-6 inline-flex">🛡️ Notre mission</span>

        <h1 className="font-spectral font-bold text-white leading-tight mb-12"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          Pourquoi nous avons lancé VigieParl
        </h1>

        {[
          {
            title: 'Un angle mort démocratique',
            body: `Les cabinets parlementaires sont au cœur de la démocratie représentative. Ce sont les collaborateur·rices parlementaires qui préparent les amendements, analysent les textes de loi, gèrent les agendas et font le lien entre les citoyen·nes et leurs représentant·es.

Pourtant, on ne sait presque rien de leurs conditions de travail. Pas de données publiques sur le management, la charge de travail, le turnover réel ou l'ambiance dans les cabinets. C'est un <strong class="text-white">angle mort démocratique</strong>.`,
          },
          {
            title: 'Ce que fait déjà Cavaparlement',
            body: `Depuis sa création, <a href="https://cavaparlement.eu" class="text-or hover:underline">cavaparlement.eu</a> recense les mouvements de collaborateur·rices à partir des sources publiques (Bulletin officiel, Journal officiel, sites institutionnels). Grâce à la base de données <strong class="text-white">dataparl.io</strong>, nous détectons les embauches, les départs, les renouvellements et nous produisons des indicateurs de turnover et de stabilité des cabinets.

Mais les données publiques ne disent rien sur le <strong class="text-white">vécu</strong> des collaborateur·rices. Elles ne mesurent pas la qualité du management, le respect de l'équilibre vie pro/perso, ou l'ambiance de travail.`,
          },
          {
            title: 'VigieParl : compléter le tableau',
            body: `VigieParl est né de cette conviction : <strong class="text-white">il faut croiser les données publiques avec le feedback structuré des premiers concernés</strong> — les collaborateur·rices eux-mêmes.`,
          },
        ].map(s => (
          <div key={s.title} className="mb-10">
            <h2 className="font-spectral font-bold text-white text-xl mb-3">{s.title}</h2>
            <div className="text-muted leading-relaxed text-sm space-y-3"
              dangerouslySetInnerHTML={{
                __html: s.body.split('\n\n').map(p => `<p>${p}</p>`).join('')
              }} />
          </div>
        ))}

        {/* 4 pilliers */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {[
            { icon: '📊', title: 'Données structurées',    desc: 'Pas de commentaires bruts à la Glassdoor. Des notations précises sur 5 critères, exploitables statistiquement.' },
            { icon: '🔒', title: 'Anonymat total',         desc: 'Aucune donnée personnelle publiée. Les identités servent uniquement à authentifier les contributions et exercer les droits RGPD.' },
            { icon: '👁️', title: 'Transparence maîtrisée', desc: 'Minimum 5 contributions pour afficher une fiche. Aucun témoignage individuel publié sur le site.' },
            { icon: '👥', title: 'Intelligence collective', desc: 'Chaque contribution enrichit l&apos;observatoire. Plus il y a de participants, plus les données sont fiables.' },
          ].map(c => (
            <div key={c.title} className="card">
              <span className="text-or text-2xl block mb-3">{c.icon}</span>
              <h3 className="text-white font-semibold mb-1.5">{c.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="font-spectral font-bold text-white text-xl mb-3">Nos limites et biais</h2>
        <p className="text-muted text-sm mb-3">Nous sommes transparents sur les limites de l&apos;outil :</p>
        <ul className="text-muted text-sm leading-relaxed list-disc pl-5 space-y-2 mb-12">
          <li>Les contributions ne constituent pas un échantillon statistiquement représentatif. Les personnes ayant vécu des expériences marquantes (positives ou négatives) peuvent être sur-représentées.</li>
          <li>Le système repose sur la bonne foi des contributeurs. L&apos;authentification par email et les mécanismes anti-doublons limitent les abus, mais ne les éliminent pas totalement.</li>
          <li>Les scores affichés sont des moyennes et ne reflètent pas la diversité des expériences individuelles au sein d&apos;un même cabinet.</li>
        </ul>

        <h2 className="font-spectral font-bold text-white text-xl mb-3">Notre ambition</h2>
        <p className="text-muted text-sm leading-relaxed mb-2">
          VigieParl vise à devenir un <strong className="text-white">standard de référence sur la vie parlementaire interne</strong> — un outil utile pour les collaborateur·rices actuels et futurs, pour les journalistes, pour les chercheurs et pour toute personne soucieuse de la qualité de notre démocratie.
        </p>
        <p className="text-muted text-sm leading-relaxed mb-10">
          Nous croyons que la transparence sur les conditions de travail en cabinet n&apos;est pas un luxe : c&apos;est une condition pour que notre démocratie fonctionne mieux.
        </p>

        <div className="text-center">
          <Link href="/contribuer" className="btn btn-gold btn-lg">
            Contribuer à l&apos;observatoire →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
