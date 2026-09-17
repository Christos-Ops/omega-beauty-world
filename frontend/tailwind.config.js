/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep royal purples
        royal: {
          50: '#f6f3fb',
          100: '#ece5f7',
          200: '#d8c8ef',
          300: '#bfa3e3',
          400: '#a87fd4',
          500: '#8e5fbf',
          600: '#7a47a3',
          700: '#633782',
          800: '#4e2c66',
          900: '#3b2250',
          950: '#261633',
        },
        // Rich gold accents
        gold: {
          50: '#fdfbf3',
          100: '#faf3d8',
          200: '#f5e7ad',
          300: '#eed574',
          400: '#e7c14a',
          500: '#d4a82f',
          600: '#b88a22',
          700: '#93681c',
          800: '#79501e',
          900: '#66411d',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};
