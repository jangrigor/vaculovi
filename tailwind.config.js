/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        'instrument-serif': ['"Instrument Serif"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        soil: '#2E2A1F',
        wheat: '#F5EFDD',
        grain: '#C9A227',
        sprout: '#4B5E3A',
      },
    },
  },
  plugins: [],
}
