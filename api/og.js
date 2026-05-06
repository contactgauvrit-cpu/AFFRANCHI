// AFFRANCHI — Open Graph image generator
// Génère dynamiquement la preview card 1200×630 affichée sur WhatsApp, X, LinkedIn,
// iMessage, Slack, Discord quand quelqu'un colle l'URL affranchi.io
//
// Routes utilisées :
//   /api/og               → version FR (default)
//   /api/og?lang=en       → version EN
//   /api/og?lang=es       → version ES
//
// Edge Runtime (requis par @vercel/og)

import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const CONTENT = {
  fr: {
    pretitle: 'AFFRANCHI.IO · DIAGNOSTIC BRUTAL',
    title1: 'VOTRE BOÎTE',
    title2: 'VOUS ÉCRASE',
    subtitle: 'Audit · Automatisation IA · Transition RH',
  },
  en: {
    pretitle: 'AFFRANCHI.IO · BRUTAL DIAGNOSIS',
    title1: 'YOUR COMPANY',
    title2: 'IS CRUSHING YOU',
    subtitle: 'Audit · AI Automation · HR Transition',
  },
  es: {
    pretitle: 'AFFRANCHI.IO · DIAGNÓSTICO BRUTAL',
    title1: 'TU EMPRESA',
    title2: 'TE APLASTA',
    subtitle: 'Auditoría · Automatización IA · Transición RR.HH.',
  },
};

// Helper for creating React element-style objects (no JSX needed)
const el = (type, props, ...children) => ({
  type,
  props: {
    ...(props || {}),
    children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children,
  },
});

export default async function handler(req) {
  const url = new URL(req.url);
  const lang = url.searchParams.get('lang') || 'fr';
  const c = CONTENT[lang] || CONTENT.fr;

  return new ImageResponse(
    el(
      'div',
      {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#000000',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        },
      },
      // Pretitle
      el('div', {
        style: {
          color: '#888888',
          fontSize: 20,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontWeight: 700,
        },
      }, c.pretitle),

      // Red separator bar
      el('div', {
        style: {
          marginTop: 20,
          width: 96,
          height: 4,
          background: '#B30000',
        },
      }),

      // Big brutalist title (2 lines)
      el(
        'div',
        {
          style: {
            marginTop: 64,
            display: 'flex',
            flexDirection: 'column',
            color: '#FFFFFF',
            fontSize: 116,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          },
        },
        el('div', null, c.title1),
        el(
          'div',
          { style: { display: 'flex' } },
          c.title2,
          el('span', { style: { color: '#B30000' } }, '.')
        )
      ),

      // Subtitle
      el('div', {
        style: {
          marginTop: 'auto',
          color: '#B30000',
          fontSize: 24,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 700,
        },
      }, c.subtitle),

      // Bottom brand
      el('div', {
        style: {
          marginTop: 32,
          color: '#888888',
          fontSize: 18,
          letterSpacing: '0.3em',
          fontWeight: 700,
        },
      }, 'AFFRANCHI.IO')
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
