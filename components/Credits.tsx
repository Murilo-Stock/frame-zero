const SOURCES = [
  { repo: 'YouMind-OpenLab/awesome-gpt-image-2', label: 'GPT Image 2 prompts (6.7k★)' },
  { repo: 'YouMind-OpenLab/awesome-nano-banana-pro-prompts', label: 'Nano Banana Pro prompts (12.2k★)' },
  { repo: 'YouMind-OpenLab/awesome-seedance-2-prompts', label: 'Seedance 2 prompts (1.2k★)' },
];

export function Credits() {
  return (
    <footer className="border-t border-rule px-8 py-16 mt-24">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
        <div>
          <p className="font-mono text-xs uppercase tracking-caps text-amber mb-4">Sources</p>
          <ul className="space-y-2 text-sm">
            {SOURCES.map((s) => (
              <li key={s.repo}>
                <a href={`https://github.com/${s.repo}`} target="_blank" rel="noopener" className="text-ink hover:text-amber font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded">
                  {s.repo}
                </a>
                <div className="text-ink-mute text-xs">{s.label}</div>
              </li>
            ))}
            <li className="text-xs text-ink-mute pt-2 border-t border-rule mt-4">
              All prompts and preview media remain property of their original authors.
              This gallery is a curatorial showcase under fair-use / educational purposes.
            </li>
          </ul>
        </div>
        <div className="md:text-right">
          <p className="font-mono text-xs uppercase tracking-caps text-amber mb-4">Curated by</p>
          <p className="font-display text-3xl text-ink">Murilo Stock</p>
          <p className="text-ink-mute text-sm mt-2">Fábrica de Vídeo · solo · 2026</p>
          <p className="font-mono text-[10px] text-ink-mute mt-8">
            Built with Next.js · Tailwind · Framer Motion. Deployed on Vercel.
          </p>
        </div>
      </div>
    </footer>
  );
}
