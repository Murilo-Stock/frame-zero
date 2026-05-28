import type { Metadata } from 'next';
import { TopNav } from '@/components/TopNav';
import { RevealOnScroll } from '@/components/RevealOnScroll';
import { Credits } from '@/components/Credits';
import { CopyBlock } from '@/components/CopyBlock';

export const metadata: Metadata = {
  title: 'License — Frame Zero',
  description: 'Open code (MIT). Cited curation (CC BY 4.0).',
};

const MIT_LICENSE = `MIT License

Copyright (c) 2026 Murilo Stock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

export default function LicensePage() {
  return (
    <>
      <TopNav />
      <main>
        {/* Hero */}
        <RevealOnScroll as="section">
          <section className="px-6 md:px-10 pt-20 pb-12 border-b border-rule">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
              <p className="font-mono text-xs uppercase tracking-caps text-amber">
                Frame Zero · legal
              </p>
              <h1 className="font-display text-6xl md:text-7xl text-ink tracking-tight leading-none">
                License
              </h1>
              <p className="text-xl md:text-2xl text-ink-mute max-w-3xl leading-snug">
                Open code. Cited curation.
              </p>
              <div className="h-px w-24 bg-amber mt-4" aria-hidden="true" />
            </div>
          </section>
        </RevealOnScroll>

        {/* Two columns */}
        <RevealOnScroll as="section">
          <section className="px-6 md:px-10 py-20 border-b border-rule">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* LEFT — MIT */}
              <article className="flex flex-col gap-4">
                <p className="font-mono text-xs uppercase tracking-caps text-amber">
                  Code · MIT
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-ink leading-tight">
                  Code (MIT)
                </h2>
                <p className="text-base text-ink-mute leading-relaxed">
                  All code in the Frame Zero repo is MIT-licensed. Fork it.
                  Build on it. Ship your own version.
                </p>
                <CopyBlock text={MIT_LICENSE} label="Copy MIT" />
              </article>

              {/* RIGHT — CC BY 4.0 */}
              <article className="flex flex-col gap-4">
                <p className="font-mono text-xs uppercase tracking-caps text-amber">
                  Curation · CC BY 4.0
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-ink leading-tight">
                  Curation (CC BY 4.0)
                </h2>
                <p className="text-base text-ink-mute leading-relaxed">
                  Curated lists of prompts, cases, repos, videos, courses,
                  tools, papers, and agencies are licensed CC BY 4.0. Cite
                  Frame Zero (
                  <a
                    href="https://github.com/Murilo-Stock/frame-zero"
                    target="_blank"
                    rel="noopener"
                    data-cursor="amber"
                    className="text-amber hover:text-amber-hot underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded"
                  >
                    github.com/Murilo-Stock/frame-zero
                  </a>
                  ) when you reuse the curation.
                </p>
                <div className="bg-canvas-2 border border-rule p-6 flex flex-col gap-4">
                  <p className="font-mono text-[11px] uppercase tracking-caps text-amber">
                    Attribution example
                  </p>
                  <pre className="text-[11px] leading-relaxed text-ink-mute font-mono whitespace-pre-wrap">{`Curation: Frame Zero · Murilo Stock · 2026
https://github.com/Murilo-Stock/frame-zero
Licensed under CC BY 4.0.`}</pre>
                  <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noopener"
                    data-cursor="amber"
                    className="font-mono text-[10px] uppercase tracking-caps text-amber hover:text-amber-hot self-start border border-rule hover:border-amber px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                  >
                    Full CC BY 4.0 text →
                  </a>
                </div>
              </article>
            </div>
          </section>
        </RevealOnScroll>

        {/* What's NOT mine */}
        <RevealOnScroll as="section">
          <section className="px-6 md:px-10 py-20">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              <p className="font-mono text-xs uppercase tracking-caps text-amber">
                Caveat · third-party media
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-ink leading-tight">
                What&apos;s NOT mine
              </h2>
              <p className="text-lg text-ink-mute leading-relaxed">
                All preview images and videos in the gallery remain property of
                their original authors (YouMind-OpenLab and individual
                contributors). This site is a curatorial showcase under
                fair-use / educational purposes. If you&apos;re an author and
                want your work removed, email{' '}
                <a
                  href="mailto:stockh2oh@gmail.com"
                  data-cursor="amber"
                  className="text-amber hover:text-amber-hot underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded"
                >
                  stockh2oh@gmail.com
                </a>
                .
              </p>
            </div>
          </section>
        </RevealOnScroll>

        <Credits />
      </main>
    </>
  );
}
