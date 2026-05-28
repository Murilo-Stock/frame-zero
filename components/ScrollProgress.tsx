'use client';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Fixed 2px amber progress bar at the very top of the viewport.
 * Tracks document scroll. Hides in print and respects reduced-motion (Framer handles it).
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
    restDelta: 0.001,
  });
  return (
    <motion.div
      aria-hidden="true"
      data-print="hide"
      style={{
        scaleX,
        transformOrigin: '0% 50%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background:
          'linear-gradient(to right, rgba(212,165,116,0.85), rgba(232,184,122,1))',
        zIndex: 10002,
        pointerEvents: 'none',
      }}
    />
  );
}
