'use client';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  /** Override translation distance (default 32px). */
  y?: number;
  /** Override margin for triggering (default '-100px'). */
  margin?: string;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'article';
};

/**
 * Cinematic scroll-triggered fade-in. Fires once, when 100px before entering viewport.
 * Wraps server-rendered sections so they can opt into motion without converting the whole
 * tree to a client component.
 */
export function RevealOnScroll({
  children,
  delay = 0,
  y = 32,
  margin = '-100px',
  className,
  as = 'div',
}: Props) {
  // motion.<tag> is the same component shape under the hood; cast for the dynamic dispatch.
  const Comp = motion[as] as React.ComponentType<HTMLMotionProps<'div'>>;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: margin as `${number}px` }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}
