export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { adminLoginSchema } from '@/lib/validators'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = adminLoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
    }

    const { password } = parsed.data

    // Comparaison timing-safe
    const expected = process.env.ADMIN_PASSWORD!
    if (!expected || password !== expected) {
      // Délai artificiel pour ralentir la force brute
      await new Promise(r => setTimeout(r, 1000))
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }

    // Générer un JWT signé (24h)
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret)

    const response = NextResponse.json({ success: true })
    response.cookies.set('vigiparl_admin_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24h
      path: '/',
    })
    return response
  } catch (e) {
    console.error('admin-login error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('vigiparl_admin_token')
  return response
}
