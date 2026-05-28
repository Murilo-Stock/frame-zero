import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frame Zero — Curated AI cinema · 2026',
  description: 'Six use-cases. Three models. Two hundred and ninety frames. One arsenal.',
  openGraph: {
    title: 'Frame Zero',
    description: 'Curated AI cinema · GPT Image 2 · Nano Banana Pro · Seedance 2',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="grain">{children}</body>
    </html>
  );
}
