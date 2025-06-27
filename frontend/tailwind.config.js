/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8A0000", // Dark red
          hover: "#790000",
          light: "#aa0000"
        },
        secondary: {
          DEFAULT: "#FF7D29", // Orange
          hover: "#f26a10",
          light: "#ff9a5a"
        },
        dark: {
          DEFAULT: "#212121", // Very dark gray
          light: "#383838",
          lightest: "#4d4d4d"
        },
        light: {
          DEFAULT: "#F4E7E1", // Light beige/cream
          dark: "#ecdcd3",
          darkest: "#e3cec3"
        }
      }
    },
  },
  plugins: [],
} 