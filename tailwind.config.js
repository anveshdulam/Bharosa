/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F7F0E4',
          50: '#FDFAF5',
          100: '#F7F0E4',
          200: '#EFE0C9',
        },
        forest: {
          DEFAULT: '#14322A',
          50: '#1a4035',
          100: '#14322A',
          200: '#0d2219',
          300: '#091810',
        },
        terracotta: {
          DEFAULT: '#C25B3D',
          50: '#e87a5c',
          100: '#C25B3D',
          200: '#a04830',
        },
        gold: {
          DEFAULT: '#DE9F3D',
          50: '#f0b85a',
          100: '#DE9F3D',
          200: '#b87e28',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 8s ease-in-out 2s infinite',
        'drift': 'drift 20s linear infinite',
        'blob': 'blob 15s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        drift: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 15px) scale(0.95)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(40px, -30px) scale(1.1)' },
          '50%': { transform: 'translate(-20px, 40px) scale(0.9)' },
          '75%': { transform: 'translate(-40px, -10px) scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
