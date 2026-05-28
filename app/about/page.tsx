import type { Metadata } from 'next';
import { TopNav } from '@/components/TopNav';
import { RevealOnScroll } from '@/components/RevealOnScroll';
import { Credits } from '@/components/Credits';

export const metadata: Metadata = {
  title: 'About — Frame Zero',
  description: 'What Frame Zero is. Why it exists. How to use it.',
};

const SOCIAL = [
  {
    label: 'GitHub',
    href: 'https://github.com/Murilo-Stock',
    handle: '@Murilo-Stock',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/search/results/people/?keywords=Murilo%20Stock',
    handle: 'Murilo Stock',
  },
  {
    label: 'Email',
    href: 'mailto:stockh2oh@gmail.com',
    handle: 'stockh2oh@gmail.com',
  },
];

const USAGE: { label: string; body: string }[] = [
  {
    label: 'Filter the gallery',
    body: 'Pick a use-case in /#gallery to inspire a shot list — every preview links to its source prompt.',
  },
  {
    label: 'Open a Playbook',
    body: 'Each /playbooks/<vertical> is a copy-ready workflow: math, stack, prompts, verified cases, ROI.',
  },
  {
    label: 'Open a Model panel',
    body: 'Tap a card in /#models to deep-dive that model — repos, papers, agencies, courses.',
  },
  {
    label: 'Press ⌘K',
    body: 'Fuzzy-search across everything: models, playbooks, verticals, cases.',
  },
  {
    label: 'Vim-style nav',
    body: 'Press g g (top) · g p (playbooks) · g m (models) · g a (about) · ? (shortcuts overlay).',
  },
  {
    label: 'Fork the repo',
    body: 'github.com/Murilo-Stock/frame-zero — MIT for code, CC BY 4.0 for the curation. Remix for your stack.',
  },
];

export default function AboutPage() {
  return (
    <>
      <TopNav />
      <main>
        {/* Hero strip */}
        <RevealOnScroll as="section">
          <section className="px-6 md:px-10 pt-20 pb-12 border-b border-rule">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
              <p className="font-mono text-xs uppercase tracking-caps text-amber">
                Frame Zero · v2
              </p>
              <h1 className="font-display text-6xl md:text-7xl text-ink tracking-tight leading-none">
                About Frame Zero
              </h1>
              <p className="text-xl md:text-2xl text-ink-mute max-w-3xl leading-snug">
                What this is. Why it exists. How to use it.
              </p>
              <div className="h-px w-24 bg-amber mt-4" aria-hidden="true" />
            </div>
          </section>
        </RevealOnScroll>

        {/* 1. What Frame Zero is */}
        <RevealOnScroll as="section">
          <section className="px-6 md:px-10 py-20 border-b border-rule">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              <p className="font-mono text-xs uppercase tracking-caps text-amber">
                01 · Definition
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">
                What Frame Zero is
              </h2>
              <div className="max-w-2xl text-lg text-ink-mute leading-relaxed flex flex-col gap-4">
                <p>
                  Frame Zero is a curated reference for AI-generated visual production.
                  Three frontier image models — GPT Image 2, Nano Banana Pro, Flux Kontext.
                  One frontier video model — Seedance 2. Eleven revenue verticals,
                  each with a copy-ready workflow.
                </p>
                <p>
                  Built solo by a 20-year-old AI operator. Not a SaaS. Not a CMS.
                  Not a paywall. A public operating system for anyone learning to ship
                  cinematic AI work.
                </p>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        {/* 2. Why it exists */}
        <RevealOnScroll as="section">
          <section className="px-6 md:px-10 py-20 border-b border-rule">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              <p className="font-mono text-xs uppercase tracking-caps text-amber">
                02 · Origin
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">
                Why it exists
              </h2>
              <div className="max-w-2xl text-lg text-ink-mute leading-relaxed flex flex-col gap-4">
                <p>
                  Murilo runs Fábrica de Vídeo — a B2B real-estate video pipeline
                  serving BH and SP. Every new model release fragments the playbook
                  again. Frame Zero is the dossier he wishes existed.
                </p>
                <p>
                  Every prompt copy-ready. Every case verified. Every workflow
                  diagrammed. Built so he opens it before a job and ships faster.
                  Open-sourced so anyone learning can stand on it.
                </p>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        {/* 3. How to use it */}
        <RevealOnScroll as="section">
          <section className="px-6 md:px-10 py-20 border-b border-rule">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              <p className="font-mono text-xs uppercase tracking-caps text-amber">
                03 · Usage
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">
                How to use it
              </h2>
              <ul className="max-w-2xl flex flex-col divide-y divide-rule">
                {USAGE.map((u) => (
                  <li key={u.label} className="py-5 flex flex-col gap-1">
                    <p className="font-mono text-[11px] uppercase tracking-caps text-amber">
                      {u.label}
                    </p>
                    <p className="text-lg text-ink-mute leading-snug">{u.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </RevealOnScroll>

        {/* 4. Made by */}
        <RevealOnScroll as="section">
          <section className="px-6 md:px-10 py-20 border-b border-rule">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              <p className="font-mono text-xs uppercase tracking-caps text-amber">
                04 · Made by
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">
                Made by
              </h2>
              <div className="max-w-2xl border-l-2 border-amber pl-6 flex flex-col gap-3">
                <p className="font-display text-4xl text-ink leading-tight">
                  Murilo Stock
                </p>
                <p className="text-base text-ink-mute leading-snug">
                  Solo founder · Fábrica de Vídeo · Skema BBA · 20 years old · BH/SP, Brasil
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  {SOCIAL.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target={s.href.startsWith('http') ? '_blank' : undefined}
                        rel={s.href.startsWith('http') ? 'noopener' : undefined}
                        data-cursor="amber"
                        className="block border border-rule hover:border-amber p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                      >
                        <p className="font-mono text-[10px] uppercase tracking-caps text-amber">
                          {s.label}
                        </p>
                        <p className="text-sm text-ink mt-1 break-all">{s.handle}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        {/* CTA — bridge to Fábrica de Vídeo */}
        <RevealOnScroll as="section">
          <section className="px-6 md:px-10 py-20">
            <div className="max-w-3xl mx-auto bg-amber text-canvas p-10 md:p-14 flex flex-col gap-5">
              <p className="font-mono text-xs uppercase tracking-caps text-canvas/70">
                For businesses
              </p>
              <h2 className="font-display text-3xl md:text-4xl leading-tight">
                Want a custom AI-cinematic pipeline for your business?
              </h2>
              <p className="text-lg text-canvas/80 leading-snug">
                Fábrica de Vídeo builds bespoke production stacks — real estate,
                ads, brand content. Solo operator, 72h SLA, R$1M+ ticket clients.
              </p>
              <div>
                <a
                  href="https://github.com/Murilo-Stock"
                  target="_blank"
                  rel="noopener"
                  data-cursor="amber"
                  className="inline-block font-mono text-sm uppercase tracking-caps bg-canvas text-amber px-6 py-3 hover:bg-canvas-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas focus-visible:ring-offset-2 focus-visible:ring-offset-amber"
                >
                  Fábrica de Vídeo →
                </a>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        <Credits />
      </main>
    </>
  );
}
