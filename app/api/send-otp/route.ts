export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import bcrypt from 'bcryptjs'
import { supabaseAdmin, detectEmailType, emailTypeLabel } from '@/lib/supabase'
import { otpEmail } from '@/lib/emails'
import { sendOtpSchema } from '@/lib/validators'

function genOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token, remoteip: ip }),
    })
    const data = await res.json()
    return data.success === true
  } catch { return false }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const turnstileToken = body.turnstileToken
    if (!turnstileToken) return NextResponse.json({ error: 'Vérification anti-bot requise' }, { status: 400 })
    const ip = req.headers.get('x-forwarded-for') || ''
    if (!await verifyTurnstile(turnstileToken, ip)) return NextResponse.json({ error: 'Vérification anti-bot échouée.' }, { status: 403 })
    const parsed = sendOtpSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    const { email } = parsed.data
    const emailLower = email.toLowerCase().trim()
    const type = detectEmailType(emailLower)
    if (!type) return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 })
    const db = supabaseAdmin()
    const { count } = await db.from('vigiparl_sessions').select('*', { count: 'exact', head: true }).eq('email', emailLower).gte('created_at', new Date(Date.now() - 3600000).toISOString())
    if ((count ?? 0) >= 3) return NextResponse.json({ error: 'Trop de tentatives. Attendez 1 heure.' }, { status: 429 })
    const otp = genOtp()
    const otpHash = await bcrypt.hash(otp, 10)
    await db.from('vigiparl_sessions').update({ otp_code: 'EXPIRED' }).eq('email', emailLower).eq('verified', false)
    const { data: session, error } = await db.from('vigiparl_sessions').insert({ email: emailLower, email_type: type, otp_code: otpHash, expires_at: new Date(Date.now() + 15 * 60000).toISOString(), verified: false }).select('id').single()
    if (error) return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    const { error: emailError } = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: 'VigieParl <no-reply@vigiparl.cavaparlement.eu>', to: email, subject: `[VigieParl] Code : ${otp}`, html: otpEmail(otp, emailTypeLabel(type)) })
    if (emailError) return NextResponse.json({ error: "Impossible d'envoyer l'email" }, { status: 500 })
    return NextResponse.json({ success: true, sessionId: session.id, emailType: type })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
