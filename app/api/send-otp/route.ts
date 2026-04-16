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

export async function POST(req: NextRequest) {
  try {
    // Point 7 : Validation Zod
    const body = await req.json()
    const parsed = sendOtpSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const { email } = parsed.data
    const emailLower = email.toLowerCase().trim()

    const type = detectEmailType(emailLower)
    if (!type) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 })
    }

    const db = supabaseAdmin()

    // Point 2 : Rate limiting strict (3 OTP/heure/email)
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
    const { count } = await db
      .from('vigiparl_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('email', emailLower)
      .gte('created_at', oneHourAgo)
    if ((count ?? 0) >= 3) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Attendez 1 heure avant de réessayer.' },
        { status: 429 }
      )
    }

    const otp = genOtp()
    const expiresAt = new Date(Date.now() + 15 * 60000).toISOString()

    // Point 2 : Hasher l'OTP avant stockage (bcrypt)
    const otpHash = await bcrypt.hash(otp, 10)

    // Invalider les anciens OTP
    await db
      .from('vigiparl_sessions')
      .update({ otp_code: 'EXPIRED' })
      .eq('email', emailLower)
      .eq('verified', false)

    // Insérer la session avec l'OTP hashé
    const { data: session, error } = await db
      .from('vigiparl_sessions')
      .insert({
        email: emailLower,
        email_type: type,
        otp_code: otpHash,
        expires_at: expiresAt,
        verified: false,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Session insert error:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }

    // Envoyer l'OTP en clair par email (jamais stocké en clair)
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error: emailError } = await resend.emails.send({
      from: 'VigieParl <no-reply@vigiparl.cavaparlement.eu>',
      to: email,
      subject: `[VigieParl] Code : ${otp}`,
      html: otpEmail(otp, emailTypeLabel(type)),
    })

    if (emailError) {
      console.error('Email error:', emailError)
      return NextResponse.json({ error: "Impossible d'envoyer l'email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, sessionId: session.id, emailType: type })
  } catch (e) {
    console.error('send-otp error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
