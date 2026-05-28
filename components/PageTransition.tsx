'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

/**
 * Wraps the page subtree in a 280ms crossfade keyed on pathname. Works with the
 * static export (the markup is server-rendered; the fade is purely client-side
 * on subsequent client transitions). Includes an amber sweep line that draws
 * across the viewport on enter — quick cinematic acknowledgement of the route
 * change.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        <motion.div
          key={`sweep-${pathname}`}
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0.9 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            transformOrigin: 'left',
            background: 'linear-gradient(to right, transparent, #d4a574, transparent)',
            pointerEvents: 'none',
            zIndex: 9998,
          }}
        />
      </AnimatePresence>
    </>
  );
}
