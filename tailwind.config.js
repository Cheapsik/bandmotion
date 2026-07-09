/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        sand: {
          50:  '#FBF8F4',
          100: '#F6F1EA',
          200: '#EEE5D9',
          300: '#DFD2BE',
          400: '#C7B49B',
          500: '#A98F72',
          600: '#8A7159',
          700: '#6B5A47',
          800: '#4A3F33',
          900: '#332A22',
        },
        accent: {
          DEFAULT: '#B08A63',
          light:   '#C7A784',
          dark:    '#8F6F4C',
        },
        glass: {
          white: 'rgba(255,255,255,0.42)',
          border: 'rgba(255,255,255,0.55)',
        },
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top':    'env(safe-area-inset-top)',
      },
      animation: {
        'fade-in':    'fadeIn 0.35s ease-out',
        'slide-up':   'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1)',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:      { from: { opacity: 0 },                   to: { opacity: 1 } },
        slideUp:     { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInRight:{ from: { opacity: 0, transform: 'translateX(16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        pulseSoft:   { '0%,100%': { opacity: 0.75 }, '50%': { opacity: 1 } },
      },
    },
  },
  plugins: [],
}
