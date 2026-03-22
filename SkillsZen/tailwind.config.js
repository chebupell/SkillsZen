import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 1. All Keyframes in one place
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1.25)' },
          '50%': { transform: 'translateY(-10px) scale(1.3)' },
        },
        'progress-loading': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      // 2. All Animations in one place
      animation: {
        float: 'float 4s ease-in-out infinite',
        'progress-loading': 'progress-loading 1.5s infinite linear',
        'bounce-slow': 'bounce 3s infinite',
      },
      // 3. Typography settings
      typography: {
        DEFAULT: {
          css: {
            color: '#d4d4d4',
            a: {
              color: '#fbbf24',
              '&:hover': { color: '#f59e0b' },
            },
            h1: { color: '#ffffff' },
            h2: { color: '#ffffff' },
            h3: { color: '#ffffff' },
            strong: { color: '#ffffff' },
            code: {
              color: '#fbbf24',
              backgroundColor: '#2d2d2d',
              padding: '2px 4px',
              borderRadius: '4px',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
      },
    },
  },
  plugins: [typography],
}
