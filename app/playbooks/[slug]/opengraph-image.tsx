import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { PlaybooksIndex } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const alt = 'Frame Zero playbook';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function loadPlaybooks(): PlaybooksIndex {
  return JSON.parse(
    readFileSync(resolve(process.cwd(), 'public/data/playbooks.json'), 'utf-8')
  );
}

export function generateStaticParams() {
  const json = loadPlaybooks();
  return json.playbooks.map((p) => ({ slug: p.id }));
}

export default async function OG({ params }: { params: { slug: string } }) {
  const json = loadPlaybooks();
  const p =
    json.playbooks.find((pb) => pb.id === params.slug) ?? json.playbooks[0];
  const color = p.color ?? '#d4a574';

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
        {/* Color accent ribbon */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: color,
          }}
        />
        {/* Soft tint background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, ${color}18 0%, transparent 60%)`,
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 18,
            color: color,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          <span>FRAME ZERO — PLAYBOOK</span>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 140,
            marginTop: 32,
          }}
        >
          {p.icon}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 96,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: '#f4ede0',
            marginTop: 24,
            maxWidth: 1050,
          }}
        >
          {p.name}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 30,
            lineHeight: 1.25,
            color: '#8a8276',
            marginTop: 28,
            maxWidth: 1050,
          }}
        >
          {p.tagline}
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
          <span>{p.icp ?? 'B2B production system'}</span>
          <span style={{ color }}>FRAME ZERO</span>
        </div>
      </div>
    ),
    { ...size, emoji: 'twemoji' }
  );
}
