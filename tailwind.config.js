/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#FAF5FF",
          100: "#F3E8FF",
          200: "#E9D5FF",
          300: "#D8B4FE",
          400: "#C084FC",
          500: "#A855F7",
          600: "#BA68C8",
          700: "#9C27B0",
          800: "#7B1FA2",
          900: "#581C87",
        },
        purple: {
          light: "#E1BEE7",
          mid:   "#CE93D8",
          deep:  "#BA68C8",
          orb1:  "#CE9BFF",
          orb2:  "#A7D7FF",
        },
        sand: {
          100: "#EDE0D8",
          200: "#E4D8F0",
          300: "#D8DCF4",
        },
        warm: "#FAFAF7",
        accent: "#f59e0b",
      },
    },
  },
  plugins: [],
};
