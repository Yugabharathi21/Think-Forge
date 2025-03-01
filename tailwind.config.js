/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
          light: '#a5b4fc',
        },
        secondary: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#6ee7b7',
        },
        dark: {
          DEFAULT: '#1e1e2e',
          lighter: '#2a2b3d',
          darker: '#181825',
        },
        accent: '#f43f5e',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};