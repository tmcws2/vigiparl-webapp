export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin, detectEmailType, emailTypeLabel } from '@/lib/supabase'
import { otpEmail } from '@/lib/emails'

function genOtp() { return Math.floor(100000 + Math.random() * 900000).toString() }

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    const type = detectEmailType(email)
    if (!type) return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 })
    const db = supabaseAdmin()
    const { count } = await db.from('vigiparl_sessions').select('*', { count: 'exact', head: true })
      .eq('email', email.toLowerCase()).gte('created_at', new Date(Date.now() - 3600000).toISOString())
    if ((count ?? 0) >= 3) return NextResponse.json({ error: 'Trop de tentatives. Réessayez dans 1h.' }, { status: 429 })
    const code = genOtp()
    await db.from('vigiparl_sessions').update({ otp_code: 'EXPIRED' }).eq('email', email.toLowerCase()).eq('verified', false)
    const { data: s, error } = await db.from('vigiparl_sessions')
      .insert({ email: email.toLowerCase(), email_type: type, otp_code: code, expires_at: new Date(Date.now() + 15 * 60000).toISOString(), verified: false })
      .select('id').single()
    if (error) return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: 'VigieParl <no-reply@cavaparlement.eu>', to: email,
      subject: `[VigieParl] Code : ${code}`, html: otpEmail(code, emailTypeLabel(type))
    })
    return NextResponse.json({ success: true, sessionId: s.id, emailType: type })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
