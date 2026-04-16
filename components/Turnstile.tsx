'use client'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile: {
      render: (el: HTMLElement, opts: object) => string
      reset: (id: string) => void
      remove: (id: string) => void
    }
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void
  onExpire?: () => void
}

export default function Turnstile({ onVerify, onExpire }: TurnstileProps) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)

  useEffect(() => {
    if (!document.getElementById('cf-turnstile-script')) {
      const script = document.createElement('script')
      script.id = 'cf-turnstile-script'
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      document.head.appendChild(script)
    }
    const interval = setInterval(() => {
      if (ref.current && window.turnstile && !widgetId.current) {
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          theme: 'dark',
          callback: onVerify,
          'expired-callback': () => { widgetId.current = null; onExpire?.() },
        })
        clearInterval(interval)
      }
    }, 100)
    return () => {
      clearInterval(interval)
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current)
        widgetId.current = null
      }
    }
  }, [onVerify, onExpire])

  return <div ref={ref} style={{ margin: '12px 0' }} />
}
