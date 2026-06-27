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
          bg:      '#06041A',
          surface: '#0E0C2C',
          card:    '#13113A',
          border:  '#2D2A6E',
          purple:  '#7C22E8',
          violet:  '#A855F7',
          magenta: '#DB2777',
          red:     '#E8222E',
          orange:  '#F97316',
          gold:    '#FBBF24',
          blue:    '#3B82F6',
          teal:    '#14B8A6',
        },
      },
      backgroundImage: {
        'wc-gradient': 'linear-gradient(135deg, #7C22E8 0%, #DB2777 35%, #E8222E 60%, #F97316 100%)',
        'wc-gradient-subtle': 'linear-gradient(135deg, rgba(124,34,232,0.15) 0%, rgba(219,39,119,0.10) 50%, rgba(249,115,22,0.08) 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(124,34,232,0.08) 0%, rgba(13,11,42,0) 60%)',
      },
    },
  },
  plugins: [],
}
