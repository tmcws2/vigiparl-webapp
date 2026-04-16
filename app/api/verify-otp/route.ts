export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyOtpSchema } from '@/lib/validators'

export async function POST(req: NextRequest) {
  try {
    // Point 7 : Validation Zod
    const body = await req.json()
    const parsed = verifyOtpSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const { sessionId, code } = parsed.data

    const db = supabaseAdmin()
    const { data: session } = await db
      .from('vigiparl_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (!session) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
    }

    if (session.verified) {
      return NextResponse.json({ success: true })
    }

    if (session.otp_code === 'EXPIRED' || new Date(session.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Code expiré. Demandez un nouveau code.' }, { status: 410 })
    }

    // Point 2 : Comparer avec bcrypt (timing-safe)
    const isValid = await bcrypt.compare(code, session.otp_code)
    if (!isValid) {
      return NextResponse.json({ error: 'Code incorrect' }, { status: 401 })
    }

    await db
      .from('vigiparl_sessions')
      .update({ verified: true })
      .eq('id', sessionId)

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('verify-otp error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
