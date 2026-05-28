'use client';

/**
 * Print this playbook button. Triggers window.print() which the @media print
 * stylesheet in globals.css renders as a clean ink-on-paper layout.
 */
export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      data-print="hide"
      data-cursor="amber"
      aria-label="Print this playbook"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-amber/40 hover:border-amber bg-canvas-2 text-amber hover:text-amber-hot transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 9V3h12v6" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" rx="1" />
      </svg>
      <span className="font-mono text-[10px] uppercase tracking-caps">
        Print this playbook
      </span>
    </button>
  );
}
