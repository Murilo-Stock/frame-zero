'use client';
import { motion } from 'framer-motion';
import type { Item } from '@/lib/types';

export function Hero({ featured, total }: { featured: Item[]; total: number }) {
  // Hero only renders direct-playable videos as background; watch-page URLs would silently fail.
  const playable = featured.filter((f) => f.kind !== 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(f.mediaUrl));
  const hero = playable[0] ?? featured[0]; // first playable, fallback to any
  return (
    <section className="relative h-screen overflow-hidden">
      {hero?.kind === 'video' ? (
        <video
          src={hero.mediaUrl}
          aria-label={hero.title}
          autoPlay muted loop playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
      ) : hero ? (
        <motion.img
          src={hero.mediaUrl}
          alt={hero.title}
          fetchPriority="high"
          width={hero.width}
          height={hero.height}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.15 }}
          transition={{ duration: 12, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/30 via-canvas/60 to-canvas" />
      <div className="relative h-full flex flex-col items-center justify-center px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="font-mono text-xs uppercase tracking-caps text-amber mb-6"
        >
          Curated AI cinema · 2026
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="font-display text-7xl md:text-9xl text-ink tracking-tight leading-none"
        >
          Frame Zero
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-8 max-w-2xl text-ink-mute text-lg"
        >
          The moment before the first frame. <span className="font-mono text-amber">{total}</span> prompts across three frontier models.
        </motion.p>
      </div>
    </section>
  );
}
