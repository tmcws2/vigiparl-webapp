import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VigieParl — Observatoire des cabinets parlementaires',
  description: 'Données publiques et feedback structuré des collaborateur·rices pour une transparence fiable sur la vie interne des cabinets parlementaires.',
  openGraph: {
    title: 'VigieParl',
    description: 'Observatoire des cabinets parlementaires',
    url: 'https://vigiparl.cavaparlement.eu',
    siteName: 'VigieParl',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
