/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        wc: {
          dark: '#07090F',
          navy: '#0C1220',
          card: '#101828',
          border: '#1E2D45',
          gold: '#C9973F',
          accent: '#F0B429',
          lite: '#F7CC6B',
        },
      },
    },
  },
  plugins: [],
}
