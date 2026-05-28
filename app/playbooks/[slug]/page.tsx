import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { PlaybooksIndex, Item } from '@/lib/types';
import { PlaybookPanel } from '@/components/playbook/PlaybookPanel';
import { TopNav } from '@/components/TopNav';

function loadPlaybooks(): PlaybooksIndex {
  return JSON.parse(
    readFileSync(resolve(process.cwd(), 'public/data/playbooks.json'), 'utf-8')
  );
}

function loadItemsById(): Record<string, Item> {
  try {
    const items: Item[] = JSON.parse(
      readFileSync(resolve(process.cwd(), 'public/data/items.json'), 'utf-8')
    );
    return Object.fromEntries(items.map((i) => [i.id, i]));
  } catch {
    return {};
  }
}

export function generateStaticParams() {
  const json = loadPlaybooks();
  return json.playbooks.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const json = loadPlaybooks();
  const p = json.playbooks.find((pb) => pb.id === slug);
  if (!p) return { title: 'Frame Zero · Playbook' };
  return {
    title: `${p.name} · Frame Zero playbook`,
    description: p.tagline,
    openGraph: {
      title: `${p.name} · Frame Zero`,
      description: p.tagline,
      type: 'article',
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const json = loadPlaybooks();
  const playbook = json.playbooks.find((p) => p.id === slug);
  if (!playbook) notFound();
  const itemsById = loadItemsById();
  return (
    <>
      <TopNav />
      <PlaybookPanel playbook={playbook} itemsById={itemsById} />
    </>
  );
}
