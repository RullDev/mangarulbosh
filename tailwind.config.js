
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
          DEFAULT: "#8b5cf6",
          dark: "#6d28d9",
        },
        secondary: {
          light: "#fb923c",
          DEFAULT: "#f97316",
          dark: "#ea580c",
        },
        background: {
          light: "#f8fafc",
          dark: "#000000",
        },
        text: {
          light: "#1e293b",
          dark: "#e2e8f0",
        },
        accent: {
          light: "#f59e0b",
          dark: "#d97706",
        },
        neutral: {
          750: "#2a2a2a",
          850: "#1a1a1a",
        }
      }
    },
  },
  plugins: [],
}
