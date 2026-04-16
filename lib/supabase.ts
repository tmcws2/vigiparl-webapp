import { createClient } from '@supabase/supabase-js'

export type EmailType = 'an' | 'senat' | 'europarl' | 'ancien'

export function supabaseAnon() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export function detectEmailType(email: string): EmailType | null {
  const e = email.toLowerCase().trim()
  if (e.endsWith('@clb-an.fr'))          return 'an'
  if (e.endsWith('@clb-senat.fr'))        return 'senat'
  if (e.endsWith('@europarl.europa.eu'))  return 'europarl'
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return 'ancien'
  return null
}

export function emailTypeLabel(t: EmailType) {
  return { an: 'Collaborateur Assemblée nationale', senat: 'Collaborateur Sénat', europarl: 'Collaborateur Parlement européen', ancien: 'Ancien collaborateur' }[t]
}
