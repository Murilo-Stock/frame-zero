import type { Playbook, Paper, Agency } from '@/lib/types';
import { ResourceCard } from '@/components/ResourceCard';

function PapersCard({ items }: { items: Paper[] }) {
  return (
    <div className="bg-canvas-2 border border-rule rounded-sm p-6 flex flex-col gap-4">
      <header className="flex items-baseline justify-between border-b border-rule pb-3">
        <h3 className="font-mono text-sm uppercase tracking-caps text-amber">Papers</h3>
        <span className="font-mono text-[10px] uppercase tracking-caps text-ink-mute">
          {items.length} total
        </span>
      </header>
      <ul className="flex flex-col gap-3">
        {items.slice(0, 5).map((p) => (
          <li key={p.arxivId}>
            <a
              href={`https://arxiv.org/abs/${p.arxivId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded-sm p-1 -m-1"
            >
              <div className="font-mono text-[10px] uppercase tracking-caps text-amber flex items-center gap-2">
                <span>arXiv:{p.arxivId}</span>
                <span className="text-ink-mute">·</span>
                <span>{p.year}</span>
              </div>
              <div className="text-sm text-ink group-hover:underline group-hover:decoration-amber group-hover:underline-offset-2 line-clamp-2">
                {p.title}
              </div>
              <div className="text-xs text-ink-mute line-clamp-2">{p.relevance}</div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AgenciesCard({ items }: { items: Agency[] }) {
  return (
    <div className="bg-canvas-2 border border-rule rounded-sm p-6 flex flex-col gap-4">
      <header className="flex items-baseline justify-between border-b border-rule pb-3">
        <h3 className="font-mono text-sm uppercase tracking-caps text-amber">Agencies</h3>
        <span className="font-mono text-[10px] uppercase tracking-caps text-ink-mute">
          {items.length} total
        </span>
      </header>
      <ul className="flex flex-col gap-3">
        {items.slice(0, 5).map((a) => (
          <li key={a.url}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded-sm p-1 -m-1"
            >
              <div className="font-mono text-[10px] uppercase tracking-caps text-amber">
                {a.specialty}
              </div>
              <div className="text-sm text-ink group-hover:underline group-hover:decoration-amber group-hover:underline-offset-2">
                {a.name}
              </div>
              <div className="text-xs text-ink-mute line-clamp-2">{a.notable}</div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResourcesBlock({ playbook }: { playbook: Playbook }) {
  const r = playbook.resources;
  if (!r) return null;
  const hasRepos = r.repos && r.repos.length > 0;
  const hasVideos = r.videos && r.videos.length > 0;
  const hasCourses = r.courses && r.courses.length > 0;
  const hasTools = r.tools && r.tools.length > 0;
  const hasPapers = r.papers && r.papers.length > 0;
  const hasAgencies = r.agencies && r.agencies.length > 0;
  const anything =
    hasRepos || hasVideos || hasCourses || hasTools || hasPapers || hasAgencies;
  if (!anything) return null;
  return (
    <section className="px-6 md:px-10 py-16 border-b border-rule">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-mono text-xs uppercase tracking-caps text-amber mb-8">
          The Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasRepos && <ResourceCard kind="repos" items={r.repos} />}
          {hasVideos && <ResourceCard kind="videos" items={r.videos} />}
          {hasCourses && <ResourceCard kind="courses" items={r.courses} />}
          {hasTools && <ResourceCard kind="tools" items={r.tools} />}
          {hasPapers && <PapersCard items={r.papers!} />}
          {hasAgencies && <AgenciesCard items={r.agencies!} />}
        </div>
      </div>
    </section>
  );
}
