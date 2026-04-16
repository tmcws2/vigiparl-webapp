export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { sessionId, code } = await req.json()
    const db = supabaseAdmin()
    const { data: s } = await db.from('vigiparl_sessions').select('*').eq('id', sessionId).single()
    if (!s) return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
    if (s.verified) return NextResponse.json({ success: true })
    if (s.otp_code === 'EXPIRED' || new Date(s.expires_at) < new Date())
      return NextResponse.json({ error: 'Code expiré. Demandez un nouveau code.' }, { status: 410 })
    if (s.otp_code !== code?.trim())
      return NextResponse.json({ error: 'Code incorrect' }, { status: 401 })
    await db.from('vigiparl_sessions').update({ verified: true }).eq('id', sessionId)
    return NextResponse.json({ success: true })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
