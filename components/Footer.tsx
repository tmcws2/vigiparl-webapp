import Link from 'next/link'

const Shield = () => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden>
    <path d="M14 2L4 6v8c0 6 4.5 10.5 10 12 5.5-1.5 10-6 10-12V6L14 2z"
      fill="none" stroke="#e8b84b" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M10 14l3 3 5-5" stroke="#e8b84b" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="page-container py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield />
              <span className="font-spectral font-bold text-white">VigieParl</span>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Observatoire indépendant des cabinets parlementaires.
              Données agrégées et anonymisées.
            </p>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-3">Navigation</p>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/" className="hover:text-white transition-colors">Observatoire</Link></li>
              <li><Link href="/contribuer" className="hover:text-white transition-colors">Contribuer</Link></li>
              <li><Link href="/pourquoi" className="hover:text-white transition-colors">Pourquoi VigieParl</Link></li>
              <li><a href="https://cavaparlement.eu" target="_blank" rel="noopener" className="hover:text-white transition-colors">Cavaparlement.eu ↗</a></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-3">Légal</p>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/confidentialite" className="hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="/confidentialite" className="hover:text-white transition-colors">CGU</Link></li>
              <li><Link href="/confidentialite" className="hover:text-white transition-colors">Licences et réutilisation</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-3">Engagements</p>
            <ul className="space-y-1.5 text-sm text-muted">
              <li>🔒 Anonymat garanti</li>
              <li>📋 Témoignages modérés</li>
              <li>📊 Min. 5 contributions par fiche</li>
              <li>🛡️ Données agrégées uniquement</li>
            </ul>
            <p className="text-xs text-muted mt-3">
              DPO :{' '}
              <a href="mailto:dpo.vigiparl@cavaparlement.eu"
                className="text-or hover:underline">
                dpo.vigiparl@cavaparlement.eu
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-muted text-xs">
            © 2026 VigieParl — Un projet cavaparlement.eu · Données publiques &amp; contributions anonymes
          </p>
        </div>
      </div>
    </footer>
  )
}
