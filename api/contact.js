// AFFRANCHI — endpoint /api/contact
// Reçoit les soumissions du formulaire "OUVRIR LE DOSSIER" et envoie un mail
// au destinataire via Resend.
//
// Variables d'environnement (configurer sur Vercel → Settings → Environment Variables):
//   RESEND_API_KEY  obligatoire — clé API Resend (Dashboard → API Keys)
//   RESEND_FROM     optionnel — adresse "from" (défaut: onboarding@resend.dev en dev,
//                   à remplacer par 'AFFRANCHI <noreply@affranchi.io>' une fois le
//                   domaine vérifié dans Resend)
//   CONTACT_EMAIL   optionnel — destinataire (défaut: contact@affranchi.io)
//
// Note Resend dev mode : avec onboarding@resend.dev comme expéditeur, on ne peut
// envoyer QU'À l'email du compte Resend. Pour envoyer ailleurs, il faut vérifier
// un domaine dans Resend (SPF/DKIM DNS records).

import { Resend } from 'resend';

const RESEND_FROM = process.env.RESEND_FROM || 'AFFRANCHI <onboarding@resend.dev>';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@affranchi.io';

export default async function handler(req, res) {
  // Méthode
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Body parsing : Vercel parse auto si Content-Type: application/json
  const body = req.body || {};
  const { nom, entreprise, effectif, email, telephone, brief, website } = body;

  // Honeypot anti-spam : si le champ caché "website" est rempli, c'est un bot
  if (typeof website === 'string' && website.trim().length > 0) {
    // Retourne 200 silencieusement pour ne pas signaler au bot qu'il est détecté
    return res.status(200).json({ ok: true, dossier: '0000/0000' });
  }

  // Validation champs obligatoires
  if (!isString(nom) || !isString(entreprise) || !isString(email) || !isString(brief)) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  // Validation longueurs (anti-payload abuse)
  if (
    nom.length === 0 || nom.length > 100 ||
    entreprise.length === 0 || entreprise.length > 200 ||
    brief.length === 0 || brief.length > 5000 ||
    (telephone && telephone.length > 40) ||
    (effectif && effectif.length > 20)
  ) {
    return res.status(400).json({ error: 'Champ trop long ou vide' });
  }

  // Validation email
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  // Resend
  if (!process.env.RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY manquant');
    return res.status(500).json({ error: 'Configuration serveur incomplète' });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Numéro dossier : YYYY/séquence basée timestamp (pas de DB requise)
  const now = new Date();
  const dossier = `${now.getFullYear()}/${String(Date.now()).slice(-6)}`;

  try {
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `[DOSSIER ${dossier}] ${entreprise} — ${nom}`,
      html: buildHtml({ dossier, nom, entreprise, effectif, email, telephone, brief, ip: req.headers['x-forwarded-for'] || '—' }),
      text: buildText({ dossier, nom, entreprise, effectif, email, telephone, brief }),
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return res.status(502).json({ error: 'Service de messagerie indisponible' });
    }

    return res.status(200).json({ ok: true, dossier });
  } catch (err) {
    console.error('[contact] Exception:', err);
    return res.status(500).json({ error: 'Erreur interne — réessayez' });
  }
}

// --- Helpers ---

function isString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isValidEmail(e) {
  if (typeof e !== 'string' || e.length > 200) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtml({ dossier, nom, entreprise, effectif, email, telephone, brief, ip }) {
  return `<!DOCTYPE html>
<html><body style="font-family:'Courier New',monospace;background:#000;color:#fff;padding:24px;margin:0;">
  <div style="max-width:680px;margin:0 auto;border:2px solid #fff;padding:24px;background:#000;">
    <p style="font-size:11px;letter-spacing:0.2em;color:#aaa;text-transform:uppercase;margin:0 0 16px;">
      AFFRANCHI.IO · OUVERTURE DE DOSSIER
    </p>
    <h1 style="font-family:Impact,sans-serif;font-size:32px;letter-spacing:0.02em;text-transform:uppercase;color:#fff;margin:0 0 8px;">
      DOSSIER №&nbsp;${escapeHtml(dossier)}
    </h1>
    <p style="font-size:12px;color:#B30000;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 24px;font-weight:bold;">
      Nouvelle requête reçue · répondre sous 48h
    </p>

    <table cellpadding="10" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:18px;">
      <tr><td style="font-size:10px;letter-spacing:0.2em;color:#aaa;text-transform:uppercase;border-bottom:1px dotted #555;width:35%;">NOM</td><td style="border-bottom:1px dotted #555;color:#fff;">${escapeHtml(nom)}</td></tr>
      <tr><td style="font-size:10px;letter-spacing:0.2em;color:#aaa;text-transform:uppercase;border-bottom:1px dotted #555;">ENTREPRISE</td><td style="border-bottom:1px dotted #555;color:#fff;">${escapeHtml(entreprise)}</td></tr>
      <tr><td style="font-size:10px;letter-spacing:0.2em;color:#aaa;text-transform:uppercase;border-bottom:1px dotted #555;">EFFECTIF</td><td style="border-bottom:1px dotted #555;color:#fff;">${escapeHtml(effectif || '—')}</td></tr>
      <tr><td style="font-size:10px;letter-spacing:0.2em;color:#aaa;text-transform:uppercase;border-bottom:1px dotted #555;">EMAIL</td><td style="border-bottom:1px dotted #555;color:#fff;"><a href="mailto:${escapeHtml(email)}" style="color:#B30000;">${escapeHtml(email)}</a></td></tr>
      <tr><td style="font-size:10px;letter-spacing:0.2em;color:#aaa;text-transform:uppercase;border-bottom:1px dotted #555;">TÉLÉPHONE</td><td style="border-bottom:1px dotted #555;color:#fff;">${escapeHtml(telephone || '—')}</td></tr>
    </table>

    <p style="font-size:10px;letter-spacing:0.2em;color:#aaa;text-transform:uppercase;margin:24px 0 8px;">BRIEF</p>
    <div style="border-left:4px solid #8B0000;padding-left:16px;color:#fff;white-space:pre-wrap;font-family:'Courier New',monospace;font-size:14px;line-height:1.6;">${escapeHtml(brief)}</div>

    <p style="font-size:9px;letter-spacing:0.2em;color:#555;text-transform:uppercase;border-top:1px solid #555;padding-top:14px;margin-top:32px;">
      IP source : ${escapeHtml(String(ip))}<br/>
      Réponse : utiliser "Reply" — l'expéditeur est défini sur l'email du demandeur.
    </p>
  </div>
</body></html>`;
}

function buildText({ dossier, nom, entreprise, effectif, email, telephone, brief }) {
  return [
    `AFFRANCHI.IO — OUVERTURE DE DOSSIER`,
    `DOSSIER № ${dossier}`,
    `Nouvelle requête reçue · répondre sous 48h`,
    ``,
    `NOM         ${nom}`,
    `ENTREPRISE  ${entreprise}`,
    `EFFECTIF    ${effectif || '—'}`,
    `EMAIL       ${email}`,
    `TÉLÉPHONE   ${telephone || '—'}`,
    ``,
    `BRIEF`,
    `-----`,
    brief,
    ``,
  ].join('\n');
}
