import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const alt = 'Frame Zero — Curated AI cinema · 2026';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0a0a0a',
          color: '#f4ede0',
          padding: '72px',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Amber accent ribbon top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(to right, #d4a574, #e8b87a, #d4a574)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 18,
            color: '#d4a574',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          <span>FRAME ZERO</span>
          <span style={{ color: '#8a8276' }}>—</span>
          <span style={{ color: '#8a8276' }}>v2 / 2026</span>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 132,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: '#f4ede0',
            marginTop: 80,
          }}
        >
          Curated AI cinema
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 36,
            lineHeight: 1.2,
            color: '#8a8276',
            marginTop: 40,
            maxWidth: 1000,
          }}
        >
          11 verticals · 282 frames · 283 resources · 4 models
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 64,
            left: 72,
            right: 72,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 18,
            color: '#8a8276',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          <span>GPT IMAGE 2 / NANO BANANA PRO / SEEDANCE 2</span>
          <span style={{ color: '#d4a574' }}>frame-zero-phi.vercel.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
