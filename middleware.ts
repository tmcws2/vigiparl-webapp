import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://raw.githubusercontent.com https://challenges.cloudflare.com; connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; worker-src blob:"
  )

  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    const token = request.cookies.get('vigiparl_admin_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    try {
      const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
      await jwtVerify(token, secret)
    } catch {
      const res = NextResponse.redirect(new URL('/admin/login', request.url))
      res.cookies.delete('vigiparl_admin_token')
      return res
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
