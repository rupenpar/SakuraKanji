/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sakura: {
          50: '#FFF8F8',
          100: '#FDECEF',
          200: '#F8D7DA',
          300: '#E8CFCF',
        },
        ink: {
          900: '#241B1B',
          700: '#4A3D3D',
        },
      },
      fontFamily: {
        serifJp: [
          '"Zen Old Mincho"',
          '"Shippori Mincho"',
          '"Noto Serif JP"',
          'ui-serif',
          'Georgia',
          'serif',
        ],
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.95' },
          '50%': { transform: 'scale(1.02)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        floatY: 'floatY 6s ease-in-out infinite',
        breathe: 'breathe 5.5s ease-in-out infinite',
        shimmer: 'shimmer 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

