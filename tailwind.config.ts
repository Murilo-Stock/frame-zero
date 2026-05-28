import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0a0a0a',
        'canvas-2': '#131311',
        ink: '#f4ede0',
        'ink-mute': '#8a8276',
        amber: '#d4a574',
        'amber-hot': '#e8b87a',
        rule: 'rgba(244, 237, 224, 0.08)',
      },
      fontFamily: {
        display: ['"PP Editorial Old"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: { 'caps': '0.18em' },
    },
  },
  plugins: [],
};

export default config;
