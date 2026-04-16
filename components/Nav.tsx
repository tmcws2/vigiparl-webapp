import Link from 'next/link'

const Shield = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
    <path d="M14 2L4 6v8c0 6 4.5 10.5 10 12 5.5-1.5 10-6 10-12V6L14 2z"
      fill="none" stroke="#e8b84b" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M10 14l3 3 5-5" stroke="#e8b84b" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

type NavProps = { active?: 'observatoire' | 'contribuer' | 'pourquoi' }

export default function Nav({ active }: NavProps) {
  return (
    <nav className="navbar">
      <div className="page-container w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          <Shield />
          <div className="flex items-baseline gap-2">
            <span className="nav-logo">VigieParl</span>
            <span className="text-muted text-xs hidden sm:inline">par cavaparlement.eu</span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/"
            className={`nav-link ${active === 'observatoire' ? 'active' : ''}`}>
            Observatoire
          </Link>
          <Link href="/contribuer"
            className={`btn btn-md ${active === 'contribuer' ? 'btn-gold' : 'btn-gold opacity-90'}`}>
            Contribuer
          </Link>
          <Link href="/pourquoi"
            className={`nav-link ${active === 'pourquoi' ? 'active' : ''}`}>
            Pourquoi VigieParl
          </Link>
        </div>
      </div>
    </nav>
  )
}
