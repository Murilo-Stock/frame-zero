// @ts-check
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseYouMind } from './parsers/youmind.mjs';
import { parseMuriloLocal } from './parsers/murilo-local.mjs';
import { curate } from './curate.mjs';

const SOURCES = [
  { repo: 'YouMind-OpenLab/awesome-gpt-image-2', model: 'gpt-image-2', readme: 'README.md' },
  { repo: 'YouMind-OpenLab/awesome-nano-banana-pro-prompts', model: 'nano-banana-pro', readme: 'README.md' },
  { repo: 'YouMind-OpenLab/awesome-seedance-2-prompts', model: 'seedance-2', readme: 'README.md' },
];

const MURILO_LOCAL = process.env.MURILO_OS_PATH
  ? resolve(process.env.MURILO_OS_PATH, 'vault/research/2026-05-18-gpt-image-2-skill/02-prompts.json')
  : 'C:\\Users\\Murilo Stock\\Documents\\murilo-os\\vault\\research\\2026-05-18-gpt-image-2-skill\\02-prompts.json';

const CACHE_DIR = resolve('cache');

async function fetchReadme(repo, readme) {
  const cachePath = join(CACHE_DIR, `${repo.replace('/', '__')}__${readme}`);
  if (existsSync(cachePath)) {
    console.log(`  cache hit · ${repo}`);
    return readFileSync(cachePath, 'utf-8');
  }
  const url = `https://raw.githubusercontent.com/${repo}/main/${readme}`;
  console.log(`  fetching · ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const text = await res.text();
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cachePath, text, 'utf-8');
  return text;
}

async function main() {
  console.log('Frame Zero · scrape-and-curate');
  console.log('==============================');

  const allRaws = [];

  for (const src of SOURCES) {
    console.log(`\n[${src.model}] ${src.repo}`);
    const md = await fetchReadme(src.repo, src.readme);
    const raws = parseYouMind(md, {
      model: src.model,
      sourceRepo: src.repo,
      sourceLicense: 'NOASSERTION · attribution per source repo',
    });
    console.log(`  parsed ${raws.length} raw items`);
    allRaws.push(...raws);
  }

  // Murilo local
  console.log(`\n[murilo] ${MURILO_LOCAL}`);
  if (existsSync(MURILO_LOCAL)) {
    const json = JSON.parse(readFileSync(MURILO_LOCAL, 'utf-8'));
    const muriloRaws = parseMuriloLocal(json);
    console.log(`  parsed ${muriloRaws.length} Murilo items`);
    allRaws.push(...muriloRaws);
  } else {
    console.warn(`  WARN: Murilo local not found at ${MURILO_LOCAL} · proceeding without`);
  }

  console.log(`\nTotal raw: ${allRaws.length}`);
  const { items, log } = curate(allRaws);

  const outDir = resolve('public/data');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'items.json'), JSON.stringify(items, null, 2));
  writeFileSync(join(outDir, 'curation-log.json'), JSON.stringify(log, null, 2));

  console.log(`\nCurated: ${items.length}`);
  console.log(`  visual: ${items.filter((i) => i.useCase === 'visual').length}`);
  console.log(`  ads: ${items.filter((i) => i.useCase === 'ads').length}`);
  console.log(`  ugc: ${items.filter((i) => i.useCase === 'ugc').length}`);
  console.log(`  architecture: ${items.filter((i) => i.useCase === 'architecture').length}`);
  console.log(`  broll: ${items.filter((i) => i.useCase === 'broll').length}`);
  console.log(`  experimental: ${items.filter((i) => i.useCase === 'experimental').length}`);
  console.log(`Log entries: ${log.length}`);
  console.log(`\n→ public/data/items.json (${items.length} items)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
