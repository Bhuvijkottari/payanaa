/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ include all JS/JSX/TS/TSX files
  ],
  theme: {
    extend: {
      colors: {
        brandDark: "#121212", // ✅ your dark background color
        brandPurple: "#8B5CF6", // optional, for themePurple
        brandPink: "#FF69B4",   // optional, for pink accents
      },
    },
  },
  plugins: [],
};
