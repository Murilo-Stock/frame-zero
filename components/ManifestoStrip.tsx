import { RevealOnScroll } from './RevealOnScroll';

export function ManifestoStrip({ total }: { total: number }) {
  return (
    <RevealOnScroll as="section" className="border-y border-rule py-12 px-8">
      <p className="max-w-4xl mx-auto font-display text-2xl md:text-4xl text-ink leading-tight tracking-tight">
        Six use-cases. Three models.{' '}
        <span className="font-mono text-xl md:text-3xl text-amber">{total}</span> frames.{' '}
        <span className="text-amber">One arsenal.</span>
      </p>
    </RevealOnScroll>
  );
}
