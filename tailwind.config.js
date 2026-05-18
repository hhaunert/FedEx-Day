/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#fc4040',
          black: '#000000',
          white: '#ffffff',
          'gray-light': '#fafafa',
          'gray-lighter': '#efeff0',
          'gray-border': '#d7d8d9',
          'gray-mid': '#9d9fa2',
          'gray-mid-dark': '#747578',
          'gray-dark': '#555658',
          'gray-darker': '#212122',
          // Shorthand aliases used in globals.css
          darker: '#212122',
          dark: '#555658',
          mid: '#747578',
          border: '#d7d8d9',
          light: '#fafafa',
          lighter: '#efeff0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
