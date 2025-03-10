
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#9f7aea",
          DEFAULT: "#7c3aed",
          dark: "#6d28d9",
        },
        secondary: {
          light: "#6366f1",
          DEFAULT: "#4f46e5",
          dark: "#4338ca",
        },
        background: {
          light: "#f8fafc",
          dark: "#171923",
        },
        text: {
          light: "#1e293b",
          dark: "#e2e8f0",
        },
        accent: {
          light: "#f59e0b",
          dark: "#d97706",
        }
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-primary/90',
    'hover:bg-primary/90',
    'dark:bg-primary-dark/90',
    'dark:hover:bg-primary-dark/90',
    'bg-secondary/90',
    'hover:bg-secondary/90',
    'dark:bg-secondary-dark/90',
    'dark:hover:bg-secondary-dark/90'
  ]
}
