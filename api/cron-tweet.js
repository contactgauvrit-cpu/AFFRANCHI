// AFFRANCHI — endpoint /api/cron-tweet
// Déclenché par Vercel Cron selon le schedule défini dans vercel.json
// (Lun-Ven 11h UTC = 12h Paris hiver / 13h Paris été).
// Poste un tweet (ou un thread) rotatif sur @Nolenswaffles via OAuth 1.0a.
//
// Variables d'environnement requises sur Vercel :
//   X_API_KEY                 — Clé Consommateur OAuth 1.0a
//   X_API_SECRET              — Secret Consommateur
//   X_ACCESS_TOKEN            — Jeton d'accès (permissions Read+Write impératif)
//   X_ACCESS_TOKEN_SECRET     — Jeton d'accès Secret
//   CRON_SECRET               — secret aléatoire que Vercel envoie en Bearer header
//   CRON_ENABLED              — "true" pour poster réellement, sinon dry-run (log + 200)
//
// Sélection : index = dayOfYear % TWEETS.length → rotation déterministe, pas de state.
// Format des entrées TWEETS (cf. lib/tweets.js) :
//   { text: "..." }                ← tweet solo
//   { thread: ["...", "...", ...] } ← thread (premier tweet + replies enchaînées)
//
// Sécurité :
//   - Auth Bearer pour bloquer les appels externes
//   - Mode dry-run par défaut tant que CRON_ENABLED !== "true" (anti-flood pendant setup)
//   - Garde-fou si TWEETS array vide

import { TwitterApi } from 'twitter-api-v2';
import { TWEETS } from '../lib/tweets.js';

export default async function handler(req, res) {
  // 1. Auth — bloquer si pas appelé par Vercel Cron
  const auth = req.headers.authorization;
  if (!process.env.CRON_SECRET) {
    console.error('[cron-tweet] CRON_SECRET env var manquante');
    return res.status(500).json({ error: 'Server misconfigured: CRON_SECRET missing' });
  }
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2. Garde-fou : pas de tweets définis
  if (!Array.isArray(TWEETS) || TWEETS.length === 0) {
    console.warn('[cron-tweet] TWEETS array vide — skip');
    return res.status(200).json({ ok: true, skipped: true, reason: 'no tweets defined' });
  }

  // 3. Sélection déterministe par jour-de-l'année + slot (matin vs lunch)
  // Schedule vercel.json : 7h UTC (slot 0 = matin Paris 9h) + 11h UTC (slot 1 = lunch Paris 13h)
  // Formule : index = (dayOfYear × 2 + slot) % TWEETS.length → 2 tweets différents par jour, jamais de doublon
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now - yearStart) / 86400000);
  const slot = now.getUTCHours() < 9 ? 0 : 1; // <9h UTC = matin, sinon lunch ou plus tard
  const index = (dayOfYear * 2 + slot) % TWEETS.length;
  const entry = TWEETS[index];
  const isThread = Array.isArray(entry.thread) && entry.thread.length > 0;
  const previewContent = isThread ? { thread: entry.thread } : { text: entry.text };

  // 3b. Mode debug : ?debug=1 → retourne l'index calculé sans rien poster
  // Utile pour vérifier dayOfYear/slot du runtime sans cramer un tweet
  const url = new URL(req.url, 'https://x');
  if (url.searchParams.get('debug') === '1') {
    return res.status(200).json({
      ok: true,
      debug: true,
      runtime_now_iso: now.toISOString(),
      computed_dayOfYear: dayOfYear,
      computed_slot: slot,
      computed_index: index,
      selected_category: entry.category,
    });
  }

  // 4. Mode dry-run : pas de post réel tant que CRON_ENABLED !== "true"
  if (process.env.CRON_ENABLED !== 'true') {
    console.log('[cron-tweet] DRY RUN — index:', index, '— category:', entry.category, '— content:', previewContent);
    return res.status(200).json({
      ok: true,
      dry_run: true,
      index,
      category: entry.category,
      preview: previewContent,
      hint: 'Set CRON_ENABLED=true on Vercel to activate real posting',
    });
  }

  // 5. Sanity check des credentials X
  const required = ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_TOKEN_SECRET'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error('[cron-tweet] Env vars X manquantes :', missing);
    return res.status(500).json({ error: 'X credentials missing', missing });
  }

  // 6. Post via OAuth 1.0a
  const client = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
  });

  try {
    if (isThread) {
      // Thread : poster le premier tweet, puis enchaîner les replies
      const ids = [];
      let prevId = null;
      for (const text of entry.thread) {
        const result = prevId
          ? await client.v2.reply(text, prevId)
          : await client.v2.tweet(text);
        prevId = result.data.id;
        ids.push(prevId);
      }
      console.log('[cron-tweet] Thread posté — index:', index, '— ids:', ids);
      return res.status(200).json({ ok: true, index, category: entry.category, thread: true, tweet_ids: ids });
    } else {
      // Tweet solo
      const result = await client.v2.tweet(entry.text);
      console.log('[cron-tweet] Posté — index:', index, '— id:', result.data.id);
      return res.status(200).json({ ok: true, index, category: entry.category, tweet_id: result.data.id });
    }
  } catch (err) {
    console.error('[cron-tweet] X API error :', err);
    return res.status(502).json({
      error: 'X API error',
      details: err?.data?.detail || err?.message || String(err),
    });
  }
}
