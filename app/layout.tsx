import './globals.css';
import type { Metadata } from 'next';
import { AmberCursor } from '@/components/AmberCursor';
import { PageTransition } from '@/components/PageTransition';
import { CommandPaletteProvider } from '@/components/CommandPalette';
import { buildSearchIndex } from '@/lib/build-search-index';

export const metadata: Metadata = {
  metadataBase: new URL('https://frame-zero-phi.vercel.app'),
  title: 'Frame Zero — Curated AI cinema · 2026',
  description: 'Eleven verticals. Four models. 282 frames. 283 resources. One arsenal.',
  openGraph: {
    title: 'Frame Zero',
    description: 'Curated AI cinema · GPT Image 2 · Nano Banana Pro · Seedance 2',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchItems = buildSearchIndex();
  return (
    <html lang="pt-BR" className="dark">
      <body className="grain">
        <CommandPaletteProvider items={searchItems}>
          <AmberCursor />
          <PageTransition>{children}</PageTransition>
        </CommandPaletteProvider>
      </body>
    </html>
  );
}
