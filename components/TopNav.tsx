import Link from 'next/link';
import { TopNavCmdK } from './TopNavCmdK';

type NavItem = { label: string; href: string };

const ITEMS: NavItem[] = [
  { label: 'Models', href: '/#models' },
  { label: 'Playbooks', href: '/playbooks' },
  { label: 'Gallery', href: '/#gallery' },
];

export function TopNav() {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-canvas/80 border-b border-rule">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
        <Link
          href="/"
          data-cursor="amber"
          className="font-display text-xl tracking-tight text-ink hover:text-amber transition-colors"
        >
          Frame Zero
        </Link>
        <ul className="flex items-center gap-6 md:gap-8">
          {ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href as never}
                data-cursor="amber"
                className="font-mono text-[11px] uppercase tracking-caps text-ink-mute hover:text-amber transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <TopNavCmdK />
          </li>
        </ul>
      </div>
    </nav>
  );
}
