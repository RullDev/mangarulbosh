
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7c3aed",
        secondary: "#4f46e5",
        dark: "#1e1b4b",
        light: "#f5f3ff"
      }
    },
  },
  plugins: [],
}
