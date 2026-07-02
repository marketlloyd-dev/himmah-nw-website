/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palet dari moodboard "Emerald & Gold" -> disesuaikan utk identitas HIMMAH NW
        emerald: {
          DEFAULT: '#0B3D2E',
          dark: '#082B20',
          light: '#145C46',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8CA6B',
          dark: '#A9861F',
        },
        cream: '#F6F4EE',
        ink: '#12211E',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
