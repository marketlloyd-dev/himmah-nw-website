/** @type {import('tailwindcss').Config} */

// Warna dibaca dari CSS variable (--color-xxx, format "R G B") supaya bisa
// diubah realtime dari admin (lihat SettingsContext.jsx) tanpa perlu rebuild.
function withOpacity(variableName) {
  return ({ opacityValue }) =>
    opacityValue !== undefined
      ? `rgb(var(${variableName}) / ${opacityValue})`
      : `rgb(var(${variableName}))`
}

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Default fallback tetap sama seperti sebelumnya (palet "Emerald & Gold"),
        // nilai aktualnya dioverride lewat CSS variable di src/index.css / SettingsContext.
        emerald: {
          DEFAULT: withOpacity('--color-emerald'),
          dark: withOpacity('--color-emerald-dark'),
          light: withOpacity('--color-emerald-light'),
        },
        gold: {
          DEFAULT: withOpacity('--color-gold'),
          light: withOpacity('--color-gold-light'),
          dark: withOpacity('--color-gold-dark'),
        },
        cream: withOpacity('--color-cream'),
        ink: withOpacity('--color-ink'),
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}