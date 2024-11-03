/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#101010",
        lightText: "#9fa2b4",
        darkText: "#192A3E",
        titleText: "#2E3A59",
        white: "#ffffff",
        red: "#ef4444",
        purple: "#5459EA",
      },
    },
  },
  plugins: [],
};
