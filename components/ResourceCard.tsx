'use client';
import { useState } from 'react';
import type { Repo, Video, Course, Tool, Paper, Agency } from '@/lib/types';

type Kind = 'repos' | 'videos' | 'courses' | 'tools' | 'papers' | 'agencies';

type Props =
  | { kind: 'repos'; items: Repo[] }
  | { kind: 'videos'; items: Video[] }
  | { kind: 'courses'; items: Course[] }
  | { kind: 'tools'; items: Tool[] }
  | { kind: 'papers'; items: Paper[] }
  | { kind: 'agencies'; items: Agency[] };

const HEADERS: Record<Kind, string> = {
  repos: 'Repositories',
  videos: 'Videos',
  courses: 'Courses',
  tools: 'Tools',
  papers: 'Papers',
  agencies: 'Agencies',
};

const PREVIEW_LIMIT = 5;

export function ResourceCard(props: Props) {
  const { kind } = props;
  const [expanded, setExpanded] = useState(false);
  const total = props.items.length;
  const visible = expanded ? total : Math.min(PREVIEW_LIMIT, total);
  const hasMore = total > PREVIEW_LIMIT;

  return (
    <div className="bg-canvas-2 border border-rule rounded-sm p-6 flex flex-col gap-4">
      <header className="flex items-baseline justify-between border-b border-rule pb-3">
        <h3 className="font-mono text-sm uppercase tracking-caps text-amber">{HEADERS[kind]}</h3>
        <span className="font-mono text-[10px] uppercase tracking-caps text-ink-mute">{total} total</span>
      </header>
      <ul className="flex flex-col gap-3">
        {props.kind === 'repos' &&
          props.items.slice(0, visible).map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-2 rounded-sm p-1 -m-1"
              >
                <div className="flex items-center gap-2 font-mono text-xs text-ink">
                  <span className="text-amber">★ {formatStars(r.stars)}</span>
                  <span className="group-hover:underline group-hover:decoration-amber group-hover:underline-offset-2 truncate">
                    {r.name}
                  </span>
                  <span className="text-amber opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
                {r.description && (
                  <div className="text-xs text-ink-mute line-clamp-2 pl-1">{r.description}</div>
                )}
              </a>
            </li>
          ))}
        {props.kind === 'videos' &&
          props.items.slice(0, visible).map((v) => (
            <li key={v.url}>
              <a
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-2 rounded-sm p-1 -m-1"
              >
                <span className="font-mono text-xs text-amber whitespace-nowrap pt-px">
                  ▶ {v.durationMin ? `${v.durationMin}min` : '—'}
                </span>
                <span className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm text-ink group-hover:underline group-hover:decoration-amber group-hover:underline-offset-2 line-clamp-2">
                    {v.title}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-caps text-ink-mute">
                    {v.channel}
                  </span>
                </span>
              </a>
            </li>
          ))}
        {props.kind === 'courses' &&
          props.items.slice(0, visible).map((c) => (
            <li key={c.url}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-2 rounded-sm p-1 -m-1"
              >
                <div className="font-mono text-[10px] uppercase tracking-caps text-amber flex items-center gap-2 flex-wrap">
                  <span>{c.provider}</span>
                  <span className="text-ink-mute">·</span>
                  <span>{c.price}</span>
                  {c.lengthHours !== undefined && (
                    <>
                      <span className="text-ink-mute">·</span>
                      <span>{c.lengthHours}h</span>
                    </>
                  )}
                  <span className="text-ink-mute">·</span>
                  <span>{c.level}</span>
                </div>
                <div className="text-sm text-ink group-hover:underline group-hover:decoration-amber group-hover:underline-offset-2 line-clamp-2">
                  {c.title} <span className="text-amber opacity-0 group-hover:opacity-100">→</span>
                </div>
              </a>
            </li>
          ))}
        {props.kind === 'tools' &&
          props.items.slice(0, visible).map((t) => (
            <li key={t.url}>
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-2 rounded-sm p-1 -m-1"
              >
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-amber uppercase tracking-caps text-[10px]">{t.kind}</span>
                  <span className="text-ink group-hover:underline group-hover:decoration-amber group-hover:underline-offset-2">
                    {t.name}
                  </span>
                  <span
                    className={`ml-auto font-mono text-[10px] uppercase tracking-caps ${t.free ? 'text-amber' : 'text-ink-mute'}`}
                  >
                    {t.free ? 'free' : 'paid'}
                  </span>
                </div>
                <div className="text-xs text-ink-mute line-clamp-2 pl-1">{t.description}</div>
              </a>
            </li>
          ))}
        {props.kind === 'papers' &&
          props.items.slice(0, visible).map((p) => (
            <li key={p.arxivId}>
              <a
                href={`https://arxiv.org/abs/${p.arxivId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-2 rounded-sm p-1 -m-1"
              >
                <div className="flex items-center gap-2 font-mono text-xs text-ink">
                  <span className="text-amber whitespace-nowrap">arXiv:{p.arxivId}</span>
                  <span className="text-ink-mute">·</span>
                  <span className="text-ink-mute">{p.year}</span>
                  <span className="text-amber opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
                <div className="text-sm text-ink group-hover:underline group-hover:decoration-amber group-hover:underline-offset-2 line-clamp-2">
                  {p.title}
                </div>
                {p.relevance && (
                  <div className="text-xs text-ink-mute line-clamp-2 pl-1">{p.relevance}</div>
                )}
              </a>
            </li>
          ))}
        {props.kind === 'agencies' &&
          props.items.slice(0, visible).map((a) => (
            <li key={a.url}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-2 rounded-sm p-1 -m-1"
              >
                <div className="flex items-center gap-2 font-mono text-xs text-ink">
                  <span className="text-ink group-hover:underline group-hover:decoration-amber group-hover:underline-offset-2">
                    {a.name}
                  </span>
                  <span className="text-ink-mute">·</span>
                  <span className="text-ink-mute truncate">{a.specialty}</span>
                  <span className="text-amber opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
                {a.notable && (
                  <div className="text-xs text-ink-mute line-clamp-2 pl-1">{a.notable}</div>
                )}
              </a>
            </li>
          ))}
      </ul>
      {hasMore && (
        <button
          onClick={() => setExpanded((x) => !x)}
          className="font-mono text-[10px] uppercase tracking-caps text-amber hover:text-amber-hot transition self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-2 rounded-sm"
        >
          {expanded ? `Show less ↑` : `+ ${total - PREVIEW_LIMIT} more →`}
        </button>
      )}
    </div>
  );
}

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
