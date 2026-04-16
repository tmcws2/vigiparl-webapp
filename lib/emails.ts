const base = `background:#0d1117;font-family:'DM Sans',system-ui,sans-serif`

export function otpEmail(code: string, typeLabel: string) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/><title>Code VigieParl</title></head>
<body style="${base};margin:0;padding:0">
<div style="max-width:540px;margin:40px auto;background:#161e2d;border:1px solid #1f2d42;border-radius:12px;overflow:hidden">
  <div style="background:#131922;border-bottom:1px solid #1f2d42;padding:24px 32px;display:flex;align-items:center;gap:10px">
    <span style="font-size:1.1rem;font-weight:700;color:white;font-family:Georgia,serif">🛡️ VigieParl</span>
  </div>
  <div style="padding:32px">
    <p style="color:#7a90a8;font-size:14px;margin:0 0 8px">Contribution en tant que <strong style="color:white">${typeLabel}</strong></p>
    <p style="color:#7a90a8;font-size:14px;margin:0 0 20px">Votre code de vérification à usage unique :</p>
    <div style="background:#0d1117;border:1px solid #1f2d42;border-radius:10px;padding:24px;text-align:center;margin:0 0 20px">
      <span style="font-family:'JetBrains Mono',monospace;font-size:40px;font-weight:500;color:#f0f4f8;letter-spacing:10px">${code}</span>
      <p style="color:#7a90a8;font-size:11px;text-transform:uppercase;letter-spacing:.1em;margin:8px 0 0">Valable 15 minutes</p>
    </div>
    <div style="background:rgba(232,184,75,.07);border:1px solid rgba(232,184,75,.2);border-radius:8px;padding:12px 16px">
      <p style="color:#e8b84b;font-size:13px;margin:0">⚠️ Si vous n'avez pas initié cette demande, ignorez cet email.</p>
    </div>
  </div>
  <div style="padding:16px 32px;border-top:1px solid #1f2d42">
    <p style="color:#4a5568;font-size:12px;margin:0">VigieParl · <a href="https://vigiparl.cavaparlement.eu" style="color:#7a90a8">vigiparl.cavaparlement.eu</a></p>
  </div>
</div>
</body></html>`
}

export function confirmEmail(eluNom: string) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/><title>Contribution reçue</title></head>
<body style="${base};margin:0;padding:0">
<div style="max-width:540px;margin:40px auto;background:#161e2d;border:1px solid #1f2d42;border-radius:12px;overflow:hidden">
  <div style="background:#131922;border-bottom:1px solid #1f2d42;padding:24px 32px">
    <span style="font-size:1.1rem;font-weight:700;color:white;font-family:Georgia,serif">🛡️ VigieParl — Contribution reçue</span>
  </div>
  <div style="padding:32px;text-align:center">
    <span style="font-size:48px;display:block;margin-bottom:16px">✅</span>
    <h2 style="color:white;font-family:Georgia,serif;font-size:1.4rem;margin:0 0 12px">Merci pour votre témoignage</h2>
    <p style="color:#7a90a8;font-size:14px;margin:0 0 20px">Votre contribution concernant <strong style="color:white">${eluNom}</strong> a bien été reçue.</p>
    <div style="background:#1a2333;border:1px solid #1f2d42;border-radius:10px;padding:16px 20px;text-align:left;margin:0 0 24px">
      <p style="color:#7a90a8;font-size:13px;line-height:1.8;margin:0">📋 En attente de validation manuelle<br/>🔒 Publication après 5 contributions min.<br/>📊 Seules les données agrégées sont publiques</p>
    </div>
    <a href="https://vigiparl.cavaparlement.eu/elus" style="display:inline-block;background:#e8b84b;color:#0d1117;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Consulter l'annuaire →</a>
  </div>
</div>
</body></html>`
}
