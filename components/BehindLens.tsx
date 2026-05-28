'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Item } from '@/lib/types';
import { Card } from './Card';
import { Lightbox } from './Lightbox';

export function BehindLens({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<Item | null>(null);
  if (items.length === 0) return null;
  return (
    <motion.section
      id="behind-lens"
      className="bg-[#f4ede0] text-canvas py-24 px-8 my-24"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-caps text-canvas/60 mb-4">Behind the lens · Murilo Stock</p>
        <h2 className="font-display text-5xl md:text-7xl tracking-tight mb-8 leading-none">
          The room where the prompts are written.
        </h2>
        <p className="text-canvas/70 max-w-2xl mb-12 text-lg leading-relaxed">
          Curating a frontier-model gallery is half the work. The other half is using it.
          Below: real-estate prompts from the Fábrica de Vídeo pipeline (PT-BR · for properties in BH/SP),
          plus out-of-the-box experiments from the personal lab — each rendered as the script that birthed it.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((it) => (
            <Card key={it.id} item={it} onOpen={() => setOpen(it)} />
          ))}
        </div>
      </div>
      <Lightbox item={open} onClose={() => setOpen(null)} />
    </motion.section>
  );
}
