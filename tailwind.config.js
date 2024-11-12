/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
],
theme: {
  extend: {
    fontFamily: {
      sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    keyframes: {
      flash: {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0 },
      },
    },
    animation: {
      flash: 'flash 1s infinite',
    },
  },
},
  plugins: [],
}

