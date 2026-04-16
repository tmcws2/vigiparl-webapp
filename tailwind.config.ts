import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:   '#0d1117',
        navy2:  '#131922',
        navy3:  '#1a2333',
        card:   '#161e2d',
        border: '#1f2d42',
        muted:  '#7a90a8',
        or:     '#e8b84b',
        or2:    '#d4a030',
      },
      fontFamily: {
        spectral: ['Spectral', 'Georgia', 'serif'],
        sans:     ['DM Sans', 'system-ui', 'sans-serif'],
        mono:     ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
