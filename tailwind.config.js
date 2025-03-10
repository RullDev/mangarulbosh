
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          light: 'var(--secondary-light)',
          dark: 'var(--secondary-dark)',
        },
        background: {
          light: 'var(--background-light)',
          dark: 'var(--background-dark)',
        },
        text: {
          light: 'var(--text-light)',
          dark: 'var(--text-dark)',
        }
      }
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /bg-(primary|secondary)(-light|-dark)?\/\d+/,
    },
    {
      pattern: /hover:bg-(primary|secondary)(-light|-dark)?\/\d+/,
    }
  ]
}
