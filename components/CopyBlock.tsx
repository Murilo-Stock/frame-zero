'use client';
import { useState } from 'react';
import { copyToClipboard } from '@/lib/copyToClipboard';

type Props = {
  label?: string;
  text: string;
  className?: string;
};

/**
 * Renders a <pre> with the supplied text and a "Copy" button that pushes
 * the same text to the clipboard. Shows a transient "Copied" affordance
 * for ~1.5s. Used on /license for the MIT block.
 */
export function CopyBlock({ label = 'Copy', text, className }: Props) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-end mb-2">
        <button
          type="button"
          onClick={onClick}
          data-cursor="amber"
          className="font-mono text-[10px] uppercase tracking-caps text-amber hover:text-amber-hot border border-rule hover:border-amber px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
          aria-label={copied ? 'Copied to clipboard' : `${label} to clipboard`}
        >
          {copied ? 'Copied ✓' : label}
        </button>
      </div>
      <pre className="bg-canvas-2 border border-rule p-4 text-[11px] leading-relaxed text-ink-mute font-mono overflow-x-auto whitespace-pre-wrap break-words max-h-[420px] overflow-y-auto">
        {text}
      </pre>
    </div>
  );
}
