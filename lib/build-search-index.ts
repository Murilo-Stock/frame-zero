import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type {
  Item,
  ModelResource,
  Playbook,
  PlaybooksIndex,
  ResourcesIndex,
  PromptEntry,
} from './types';

export type SearchKind =
  | 'playbook'
  | 'model'
  | 'repo'
  | 'video'
  | 'course'
  | 'tool'
  | 'paper'
  | 'agency'
  | 'prompt'
  | 'item';

export type SearchItem = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle?: string;
  href: string;
  external?: boolean;
  keywords: string[];
};

const CAP = 1000;

function read<T>(rel: string): T {
  return JSON.parse(readFileSync(resolve(process.cwd(), rel), 'utf-8')) as T;
}

function uniqPush(seen: Set<string>, list: SearchItem[], entry: SearchItem) {
  if (seen.has(entry.id)) return;
  seen.add(entry.id);
  list.push(entry);
}

function playbookEntries(p: Playbook): SearchItem[] {
  if (p.status === 'stub') {
    return [
      {
        id: `pb:${p.id}`,
        kind: 'playbook',
        title: p.name,
        subtitle: `${p.tagline} · coming soon`,
        href: `/playbooks/${p.id}`,
        keywords: [p.id, p.tagline, p.icp ?? '', 'playbook'].filter(Boolean),
      },
    ];
  }
  return [
    {
      id: `pb:${p.id}`,
      kind: 'playbook',
      title: p.name,
      subtitle: p.tagline,
      href: `/playbooks/${p.id}`,
      keywords: [p.id, p.tagline, p.icp ?? '', 'playbook'].filter(Boolean),
    },
  ];
}

function modelEntries(m: ModelResource): SearchItem[] {
  return [
    {
      id: `model:${m.id}`,
      kind: 'model',
      title: m.name,
      subtitle: `${m.tagline} · ${m.vendor}`,
      href: `/#models`,
      keywords: [m.id, m.vendor, m.release, ...m.strengths],
    },
  ];
}

function resourceEntries(
  origin: string,
  res:
    | Playbook['resources']
    | { repos: ModelResource['repos']; videos: ModelResource['videos']; courses: ModelResource['courses']; tools: ModelResource['tools']; papers?: ModelResource['papers']; agencies?: ModelResource['agencies'] }
    | undefined
): SearchItem[] {
  if (!res) return [];
  const out: SearchItem[] = [];
  (res.repos ?? []).forEach((r) => {
    out.push({
      id: `repo:${origin}:${r.url}`,
      kind: 'repo',
      title: r.name,
      subtitle: `${origin} · repo${r.stars ? ` · ★${r.stars}` : ''}`,
      href: r.url,
      external: true,
      keywords: [r.description ?? '', r.language ?? '', r.topic ?? '', origin],
    });
  });
  (res.videos ?? []).forEach((v) => {
    out.push({
      id: `video:${origin}:${v.url}`,
      kind: 'video',
      title: v.title,
      subtitle: `${origin} · ${v.channel}`,
      href: v.url,
      external: true,
      keywords: [v.channel, v.topic ?? '', origin],
    });
  });
  (res.courses ?? []).forEach((c) => {
    out.push({
      id: `course:${origin}:${c.url}`,
      kind: 'course',
      title: c.title,
      subtitle: `${origin} · ${c.provider} · ${c.price}`,
      href: c.url,
      external: true,
      keywords: [c.provider, c.topic ?? '', c.level ?? '', origin],
    });
  });
  (res.tools ?? []).forEach((t) => {
    out.push({
      id: `tool:${origin}:${t.url}`,
      kind: 'tool',
      title: t.name,
      subtitle: `${origin} · ${t.kind}${t.free ? ' · free' : ''}`,
      href: t.url,
      external: true,
      keywords: [t.description ?? '', t.kind, origin],
    });
  });
  (res.papers ?? []).forEach((p) => {
    out.push({
      id: `paper:${origin}:${p.arxivId}`,
      kind: 'paper',
      title: p.title,
      subtitle: `${origin} · arXiv:${p.arxivId} · ${p.year}`,
      href: `https://arxiv.org/abs/${p.arxivId}`,
      external: true,
      keywords: [p.relevance ?? '', String(p.year), origin],
    });
  });
  (res.agencies ?? []).forEach((a) => {
    out.push({
      id: `agency:${origin}:${a.url}`,
      kind: 'agency',
      title: a.name,
      subtitle: `${origin} · ${a.specialty}`,
      href: a.url,
      external: true,
      keywords: [a.specialty, a.notable, origin],
    });
  });
  return out;
}

function promptEntries(p: Playbook): SearchItem[] {
  if (!p.prompts) return [];
  return p.prompts.map((pr: PromptEntry, i) => ({
    id: `prompt:${p.id}:${i}`,
    kind: 'prompt' as const,
    title: pr.title,
    subtitle: `${p.name} · ${pr.model} · ${pr.aspect}`,
    href: `/playbooks/${p.id}#prompts`,
    keywords: [...(pr.tags ?? []), pr.model, p.id, 'prompt'],
  }));
}

function itemEntries(items: Item[]): SearchItem[] {
  return items.map((it) => ({
    id: `item:${it.id}`,
    kind: 'item' as const,
    title: it.title,
    subtitle: `${it.useCase} · ${it.model} · ${it.kind}`,
    href: `/#gallery`,
    keywords: [it.useCase, it.subCategory, it.model, it.sourceRepo],
  }));
}

export function buildSearchIndex(): SearchItem[] {
  const seen = new Set<string>();
  const out: SearchItem[] = [];

  const playbooksJson = read<PlaybooksIndex>('public/data/playbooks.json');
  const resourcesJson = read<ResourcesIndex>('public/data/resources.json');
  const items = read<Item[]>('public/data/items.json');

  // Playbooks (high priority)
  playbooksJson.playbooks.forEach((p) => {
    playbookEntries(p).forEach((e) => uniqPush(seen, out, e));
  });

  // Models
  resourcesJson.models.forEach((m) => {
    modelEntries(m).forEach((e) => uniqPush(seen, out, e));
  });

  // Prompts (cross-playbook, high signal)
  playbooksJson.playbooks.forEach((p) => {
    promptEntries(p).forEach((e) => uniqPush(seen, out, e));
  });

  // Playbook resources
  playbooksJson.playbooks.forEach((p) => {
    resourceEntries(p.name, p.resources).forEach((e) => uniqPush(seen, out, e));
  });

  // Model resources
  resourcesJson.models.forEach((m) => {
    resourceEntries(m.name, {
      repos: m.repos,
      videos: m.videos,
      courses: m.courses,
      tools: m.tools,
      papers: m.papers,
      agencies: m.agencies,
    }).forEach((e) => uniqPush(seen, out, e));
  });

  // Items (lowest priority, but indexed)
  itemEntries(items).forEach((e) => uniqPush(seen, out, e));

  return out.slice(0, CAP);
}
