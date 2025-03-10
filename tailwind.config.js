
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
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
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
