import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        slatebg: '#0F172A',
        primary: '#1D4ED8',
        accent: '#10B981',
        offwhite: '#F9FAFB',
      }
    }
  },
  plugins: []
}
export default config

