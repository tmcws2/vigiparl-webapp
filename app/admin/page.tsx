'use client'
import { useState, useEffect, useCallback } from 'react'

type Submission = {
  id: string
  submitted_at: string
  validated: boolean
  validated_at: string | null
  elu_chambre: string
  score_conditions_travail: number
  score_relations_elu: number
  score_contenu_travail: number
  score_remuneration: number
  score_ambiance: number
  score_global: number
  recommande: boolean | null
  duree_mois: number | null
  points_positifs: string | null
  elus: { nom: string; prenom: string; groupe: string | null; departement: string | null } | null
  vigiparl_sessions: { email: string; email_type: string } | null
}

const CHAMBRE_LABEL: Record<string, string> = {
  assemblee: 'Assemblée nationale',
  senat: 'Sénat',
  europarl: 'Parlement européen',
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 4 ? '#68d391' : score >= 3 ? '#e8b84b' : '#fc8181'
  return (
    <span style={{
      background: `${color}20`, color, border: `1px solid ${color}40`,
      padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600
    }}>
      {score}/5
    </span>
  )
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'pending' | 'validated'>('pending')
  const [selected, setSelected] = useState<Submission | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [stats, setStats] = useState({ pending: 0, validated: 0 })

  const load = useCallback(async (pw: string, f: string) => {
    setLoading(true)
    try {
      const r = await fetch(`/api/admin?status=${f}`, {
        headers: { Authorization: `Bearer ${pw}` }
      })
      if (r.status === 401) { setAuthed(false); return }
      const d = await r.json()
      setSubmissions(d.submissions || [])
    } finally { setLoading(false) }
  }, [])

  async function loadStats(pw: string) {
    const [r1, r2] = await Promise.all([
      fetch('/api/admin?status=pending', { headers: { Authorization: `Bearer ${pw}` } }),
      fetch('/api/admin?status=validated', { headers: { Authorization: `Bearer ${pw}` } }),
    ])
    const [d1, d2] = await Promise.all([r1.json(), r2.json()])
    setStats({ pending: d1.submissions?.length || 0, validated: d2.submissions?.length || 0 })
  }

  async function login() {
    setAuthError('')
    const r = await fetch('/api/admin?status=pending', {
      headers: { Authorization: `Bearer ${password}` }
    })
    if (r.status === 401) { setAuthError('Mot de passe incorrect'); return }
    const d = await r.json()
    setSubmissions(d.submissions || [])
    setAuthed(true)
    loadStats(password)
  }

  useEffect(() => {
    if (authed) load(password, filter)
  }, [authed, filter, load, password])

  async function action(id: string, act: 'validate' | 'reject') {
    setActionLoading(id + act)
    try {
      await fetch('/api/admin', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${password}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: act })
      })
      setSubmissions(s => s.filter(x => x.id !== id))
      if (selected?.id === id) setSelected(null)
      loadStats(password)
    } finally { setActionLoading(null) }
  }

  const nav: React.CSSProperties = {
    background: 'rgba(13,17,23,0.97)', borderBottom: '1px solid #1f2d42',
    padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50
  }

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#161e2d', border: '1px solid #1f2d42', borderRadius: 12, padding: '2.5rem', width: 360 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L4 6v8c0 6 4.5 10.5 10 12 5.5-1.5 10-6 10-12V6L14 2z" stroke="#e8b84b" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
            <path d="M10 14l3 3 5-5" stroke="#e8b84b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>VigieParl Admin</span>
        </div>
        <label style={{ color: '#7a90a8', fontSize: '0.875rem', display: 'block', marginBottom: 6 }}>Mot de passe</label>
        <input
          type="password"
          style={{ width: '100%', background: '#0d1117', border: '1px solid #1f2d42', color: 'white', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.95rem', marginBottom: 12, boxSizing: 'border-box' }}
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          placeholder="••••••••"
          autoFocus
        />
        {authError && <p style={{ color: '#fc8181', fontSize: '0.8rem', marginBottom: 12 }}>⚠️ {authError}</p>}
        <button
          onClick={login}
          style={{ width: '100%', background: '#e8b84b', color: '#0d1117', border: 'none', padding: '0.75rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>
          Accéder au back office
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: 'white' }}>
      {/* Nav */}
      <nav style={nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L4 6v8c0 6 4.5 10.5 10 12 5.5-1.5 10-6 10-12V6L14 2z" stroke="#e8b84b" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
            <path d="M10 14l3 3 5-5" stroke="#e8b84b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: 'Georgia,serif', fontWeight: 700, color: 'white' }}>VigieParl</span>
          <span style={{ color: '#e8b84b', fontSize: '0.75rem', background: 'rgba(232,184,75,0.1)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(232,184,75,0.3)' }}>Admin</span>
        </div>
        <button onClick={() => setAuthed(false)} style={{ background: 'transparent', border: '1px solid #2a3d57', color: '#7a90a8', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem' }}>
          Deconnexion
        </button>
      </nav>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <div style={{ width: selected ? '420px' : '100%', maxWidth: selected ? 420 : '100%', borderRight: '1px solid #1f2d42', display: 'flex', flexDirection: 'column' }}>

          {/* Stats + filters */}
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1f2d42' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: '1rem' }}>
              <div style={{ background: '#161e2d', border: '1px solid #1f2d42', borderRadius: 10, padding: '12px 20px', flex: 1, textAlign: 'center' }}>
                <p style={{ color: '#e8b84b', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{stats.pending}</p>
                <p style={{ color: '#7a90a8', fontSize: '0.75rem', margin: '2px 0 0' }}>En attente</p>
              </div>
              <div style={{ background: '#161e2d', border: '1px solid #1f2d42', borderRadius: 10, padding: '12px 20px', flex: 1, textAlign: 'center' }}>
                <p style={{ color: '#68d391', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{stats.validated}</p>
                <p style={{ color: '#7a90a8', fontSize: '0.75rem', margin: '2px 0 0' }}>Validees</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['pending', 'validated'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${filter === f ? '#e8b84b' : '#1f2d42'}`, background: filter === f ? 'rgba(232,184,75,0.1)' : 'transparent', color: filter === f ? '#e8b84b' : '#7a90a8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
                  {f === 'pending' ? '⏳ En attente' : '✅ Validees'}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading && <p style={{ color: '#7a90a8', textAlign: 'center', padding: '3rem', fontSize: '0.875rem' }}>Chargement...</p>}
            {!loading && submissions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ fontSize: '2rem', marginBottom: 12 }}>{filter === 'pending' ? '✅' : '📭'}</p>
                <p style={{ color: '#7a90a8', fontSize: '0.875rem' }}>
                  {filter === 'pending' ? 'Aucune contribution en attente' : 'Aucune contribution validee'}
                </p>
              </div>
            )}
            {submissions.map(s => (
              <button key={s.id} onClick={() => setSelected(selected?.id === s.id ? null : s)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', textAlign: 'left', background: selected?.id === s.id ? '#1a2333' : 'transparent', borderBottom: '1px solid #1f2d42', border: 'none', borderLeft: selected?.id === s.id ? '3px solid #e8b84b' : '3px solid transparent', cursor: 'pointer', transition: 'background 0.15s' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
                    {s.elus ? `${s.elus.prenom} ${s.elus.nom}` : 'Elu inconnu'}
                  </p>
                  <p style={{ color: '#7a90a8', fontSize: '0.75rem', margin: '3px 0 0', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span>{CHAMBRE_LABEL[s.elu_chambre] || s.elu_chambre}</span>
                    {s.elus?.groupe && <><span>·</span><span>{s.elus.groupe}</span></>}
                    <span>·</span>
                    <span>{new Date(s.submitted_at).toLocaleDateString('fr-FR')}</span>
                  </p>
                </div>
                <ScoreBadge score={s.score_global} />
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: '1.5rem', margin: '0 0 4px', color: 'white' }}>
                  {selected.elus ? `${selected.elus.prenom} ${selected.elus.nom}` : 'Elu inconnu'}
                </h2>
                <p style={{ color: '#7a90a8', fontSize: '0.875rem', margin: 0 }}>
                  {CHAMBRE_LABEL[selected.elu_chambre]} · {selected.elus?.groupe || ''}
                </p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: '#7a90a8', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            {/* Contributeur */}
            <div style={{ background: '#161e2d', border: '1px solid #1f2d42', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1rem' }}>
              <p style={{ color: '#7a90a8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Contributeur</p>
              <p style={{ color: 'white', fontSize: '0.875rem', margin: 0 }}>
                {selected.vigiparl_sessions?.email}
                <span style={{ marginLeft: 8, background: '#1a3326', color: '#6fc49a', padding: '1px 6px', borderRadius: 4, fontSize: '0.7rem' }}>
                  {selected.vigiparl_sessions?.email_type}
                </span>
              </p>
              <p style={{ color: '#7a90a8', fontSize: '0.75rem', margin: '4px 0 0' }}>
                Soumis le {new Date(selected.submitted_at).toLocaleDateString('fr-FR')} a {new Date(selected.submitted_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Notes */}
            <div style={{ background: '#161e2d', border: '1px solid #1f2d42', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1rem' }}>
              <p style={{ color: '#7a90a8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Notes</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Global', score: selected.score_global },
                  { label: 'Conditions', score: selected.score_conditions_travail },
                  { label: 'Management', score: selected.score_relations_elu },
                  { label: 'Charge', score: selected.score_contenu_travail },
                  { label: 'Ambiance', score: selected.score_ambiance },
                  { label: 'Remuneration', score: selected.score_remuneration },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#7a90a8', fontSize: '0.8rem' }}>{item.label}</span>
                    <ScoreBadge score={item.score} />
                  </div>
                ))}
              </div>
            </div>

            {/* Contexte */}
            <div style={{ background: '#161e2d', border: '1px solid #1f2d42', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1rem' }}>
              <p style={{ color: '#7a90a8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Contexte</p>
              <p style={{ color: 'white', fontSize: '0.875rem', margin: '0 0 4px' }}>
                <strong style={{ color: '#7a90a8' }}>Recommande :</strong> {selected.recommande === true ? '✅ Oui' : selected.recommande === false ? '❌ Non' : '—'}
              </p>
              <p style={{ color: 'white', fontSize: '0.875rem', margin: 0 }}>
                <strong style={{ color: '#7a90a8' }}>Duree :</strong> {selected.duree_mois ? `${selected.duree_mois} mois` : '—'}
              </p>
            </div>

            {/* Temoignage */}
            {selected.points_positifs && (
              <div style={{ background: '#161e2d', border: '1px solid #1f2d42', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1rem' }}>
                <p style={{ color: '#7a90a8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Temoignage</p>
                <p style={{ color: 'white', fontSize: '0.875rem', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
                  "{selected.points_positifs}"
                </p>
              </div>
            )}

            {/* Actions */}
            {!selected.validated && (
              <div style={{ display: 'flex', gap: 12, marginTop: '1.5rem' }}>
                <button
                  onClick={() => action(selected.id, 'validate')}
                  disabled={actionLoading !== null}
                  style={{ flex: 1, background: '#e8b84b', color: '#0d1117', border: 'none', padding: '12px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', opacity: actionLoading ? 0.6 : 1 }}>
                  {actionLoading === selected.id + 'validate' ? 'Validation...' : '✅ Valider'}
                </button>
                <button
                  onClick={() => action(selected.id, 'reject')}
                  disabled={actionLoading !== null}
                  style={{ flex: 1, background: 'rgba(252,129,129,0.1)', color: '#fc8181', border: '1px solid rgba(252,129,129,0.3)', padding: '12px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', opacity: actionLoading ? 0.6 : 1 }}>
                  {actionLoading === selected.id + 'reject' ? 'Suppression...' : '🗑️ Rejeter'}
                </button>
              </div>
            )}
            {selected.validated && (
              <div style={{ background: 'rgba(104,211,145,0.08)', border: '1px solid rgba(104,211,145,0.25)', borderRadius: 10, padding: '12px 16px', marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: '#68d391', margin: 0, fontSize: '0.875rem' }}>
                  ✅ Validee le {selected.validated_at ? new Date(selected.validated_at).toLocaleDateString('fr-FR') : ''}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
