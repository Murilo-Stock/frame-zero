'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Item } from '@/lib/types';

export function Hero({ featured, total }: { featured: Item[]; total: number }) {
  // Hero only renders direct-playable videos as background; watch-page URLs would silently fail.
  // The filter at app/page.tsx already restricts featured to direct-mp4/webm/mov.
  // Defensive: re-filter here in case the page contract drifts.
  const playable = featured.filter(
    (f) => f.kind !== 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(f.mediaUrl),
  );
  // Prefer first video for stability; if multiple, mod the day to vary across sessions.
  const videos = playable.filter((f) => f.kind === 'video');
  const hero =
    videos.length > 0
      ? videos[Math.floor(Date.now() / 86_400_000) % videos.length]
      : playable[0] ?? featured[0];

  // Parallax scroll on background (subtle · 12px max)
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Hover-on-text fades the bg to 30% for legibility
  const [hoverText, setHoverText] = useState(false);
  // Video onError → fall back to posterUrl image
  const [videoBroken, setVideoBroken] = useState(false);
  // Reset video error if hero changes (e.g. HMR)
  useEffect(() => {
    setVideoBroken(false);
  }, [hero?.id]);

  const showVideo = hero?.kind === 'video' && !videoBroken;
  const fallbackImg = videoBroken && hero?.posterUrl ? hero.posterUrl : hero?.mediaUrl;
  const opacityClass = hoverText ? 'opacity-30' : 'opacity-50';

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        {showVideo ? (
          <video
            src={hero.mediaUrl}
            poster={hero.posterUrl}
            aria-label={hero.title}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoBroken(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${opacityClass}`}
          />
        ) : hero && fallbackImg ? (
          <motion.img
            src={fallbackImg}
            alt={hero.title}
            fetchPriority="high"
            width={hero.width}
            height={hero.height}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 12, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${opacityClass}`}
          />
        ) : null}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/30 via-canvas/60 to-canvas" />
      <div
        className="relative h-full flex flex-col items-center justify-center px-8 text-center"
        onMouseEnter={() => setHoverText(true)}
        onMouseLeave={() => setHoverText(false)}
      >
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
