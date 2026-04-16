'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function login() {
    setError(''); setLoading(true)
    try {
      const r = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const d = await r.json()
      if (!r.ok) { setError(d.error); return }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  const input: React.CSSProperties = {
    width: '100%', background: '#0d1117', border: '1px solid #1f2d42',
    color: 'white', padding: '0.75rem 1rem', borderRadius: 8,
    fontSize: '0.95rem', marginBottom: 12, boxSizing: 'border-box',
    fontFamily: 'DM Sans, sans-serif',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#161e2d', border: '1px solid #1f2d42', borderRadius: 12, padding: '2.5rem', width: 360 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.75rem' }}>
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L4 6v8c0 6 4.5 10.5 10 12 5.5-1.5 10-6 10-12V6L14 2z" stroke="#e8b84b" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
            <path d="M10 14l3 3 5-5" stroke="#e8b84b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: 'white', margin: 0 }}>VigieParl</p>
            <p style={{ color: '#e8b84b', fontSize: '0.7rem', margin: 0 }}>Administration</p>
          </div>
        </div>

        <label style={{ color: '#7a90a8', fontSize: '0.875rem', display: 'block', marginBottom: 6 }}>
          Mot de passe admin
        </label>
        <input
          type="password"
          style={input}
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          placeholder="••••••••"
          autoFocus
        />

        {error && (
          <div style={{ background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
            <p style={{ color: '#fc8181', fontSize: '0.8rem', margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        <button
          onClick={login}
          disabled={loading || !password}
          style={{ width: '100%', background: loading || !password ? '#8a6a20' : '#e8b84b', color: '#0d1117', border: 'none', padding: '0.75rem', borderRadius: 8, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.95rem' }}>
          {loading ? 'Connexion...' : 'Accéder au back office'}
        </button>

        <p style={{ color: '#4a5568', fontSize: '0.72rem', textAlign: 'center', marginTop: 16 }}>
          Accès réservé · Session valable 24h
        </p>
      </div>
    </div>
  )
}
