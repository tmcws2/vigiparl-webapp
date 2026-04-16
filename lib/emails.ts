export function otpEmailHtml(code: string, emailType: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Votre code VigiParl</title>
  <style>
    body { margin:0; padding:0; background:#0d1117; font-family:'DM Sans',system-ui,sans-serif; }
    .container { max-width:560px; margin:40px auto; background:#161b22; border:1px solid #2d3748; border-radius:12px; overflow:hidden; }
    .header { background:#c0392b; padding:28px 36px; }
    .header h1 { margin:0; color:#fff; font-size:22px; font-weight:600; letter-spacing:-0.02em; }
    .header p { margin:4px 0 0; color:rgba(255,255,255,0.75); font-size:13px; }
    .body { padding:36px; }
    .code-box { background:#0d1117; border:1px solid #2d3748; border-radius:8px; padding:24px; text-align:center; margin:24px 0; }
    .code { font-family:'JetBrains Mono',monospace; font-size:42px; font-weight:500; color:#f5efe6; letter-spacing:12px; display:block; }
    .code-label { font-size:12px; color:#8b9ab0; margin-top:8px; text-transform:uppercase; letter-spacing:0.1em; }
    p { color:#8b9ab0; font-size:14px; line-height:1.6; margin:0 0 12px; }
    .warning { background:#1a1208; border:1px solid #4a3a0a; border-radius:6px; padding:12px 16px; }
    .warning p { color:#d0a840; margin:0; font-size:13px; }
    .footer { padding:20px 36px; border-top:1px solid #2d3748; }
    .footer p { font-size:12px; color:#4a5568; margin:0; }
    a { color:#c0392b; text-decoration:none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏛️ VigiParl</h1>
      <p>Observatoire des conditions de travail parlementaires</p>
    </div>
    <div class="body">
      <p>Vous avez demandé à contribuer à VigiParl en tant que <strong style="color:#f5efe6">${emailType}</strong>.</p>
      <p>Voici votre code de vérification à usage unique :</p>
      <div class="code-box">
        <span class="code">${code}</span>
        <span class="code-label">Valable 15 minutes</span>
      </div>
      <p>Entrez ce code sur la page VigiParl pour continuer. Ne le partagez avec personne.</p>
      <div class="warning">
        <p>⚠️ Si vous n'avez pas initié cette demande, ignorez cet email. Votre adresse n'a pas été enregistrée.</p>
      </div>
    </div>
    <div class="footer">
      <p>VigiParl est un projet de <a href="https://cavaparlement.eu">CavaParlement</a>. Vos données sont traitées de façon confidentielle. <a href="https://vigiparl.cavaparlement.eu/confidentialite">Politique de confidentialité</a></p>
    </div>
  </div>
</body>
</html>`;
}

export function confirmationEmailHtml(eluNom: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Contribution reçue — VigiParl</title>
  <style>
    body { margin:0; padding:0; background:#0d1117; font-family:'DM Sans',system-ui,sans-serif; }
    .container { max-width:560px; margin:40px auto; background:#161b22; border:1px solid #2d3748; border-radius:12px; overflow:hidden; }
    .header { background:#c0392b; padding:28px 36px; }
    .header h1 { margin:0; color:#fff; font-size:22px; font-weight:600; letter-spacing:-0.02em; }
    .body { padding:36px; }
    .check { font-size:48px; text-align:center; margin:0 0 20px; display:block; }
    h2 { color:#f5efe6; font-size:20px; margin:0 0 12px; text-align:center; }
    p { color:#8b9ab0; font-size:14px; line-height:1.6; margin:0 0 12px; }
    .info-box { background:#0d1117; border:1px solid #2d3748; border-radius:8px; padding:16px 20px; margin:20px 0; }
    .info-box p { margin:0; color:#e8dcc8; font-size:13px; }
    a.btn { display:inline-block; background:#c0392b; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-size:14px; font-weight:500; margin-top:8px; }
    .footer { padding:20px 36px; border-top:1px solid #2d3748; }
    .footer p { font-size:12px; color:#4a5568; margin:0; }
    a { color:#c0392b; text-decoration:none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏛️ VigiParl — Contribution enregistrée</h1>
    </div>
    <div class="body">
      <span class="check">✅</span>
      <h2>Merci pour votre témoignage</h2>
      <p>Votre contribution concernant <strong style="color:#f5efe6">${eluNom}</strong> a bien été reçue et sera examinée avant publication.</p>
      <div class="info-box">
        <p>📋 Votre témoignage sera visible sur la page de l'élu une fois validé manuellement et lorsque 5 contributions minimales auront été collectées.</p>
      </div>
      <p>Votre anonymat est garanti : aucune information permettant de vous identifier ne sera publiée. Seules les données agrégées (notes moyennes, tendances) sont rendues publiques.</p>
      <a href="https://vigiparl.cavaparlement.eu/elus" class="btn">Consulter l'annuaire des élus →</a>
    </div>
    <div class="footer">
      <p>VigiParl est un projet de <a href="https://cavaparlement.eu">CavaParlement</a>. Contact : <a href="mailto:contact@cavaparlement.eu">contact@cavaparlement.eu</a></p>
    </div>
  </div>
</body>
</html>`;
}
