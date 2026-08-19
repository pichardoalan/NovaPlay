/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        novaBlack: '#141414',
        novaBlue: '#0080FF',
        novaDarkGray: '#181818',
        novaLightGray: '#2F2F2F',
      },
    },
  },
  plugins: [],
}