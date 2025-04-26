/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors:{
        'custom-red': '#a93928',
        'custom-red_2': '#f6ce9e'
      },
      fontFamily:{
        size_wide_font: [
          'Lucida Bright',
        ]
      }
    },
  },
  plugins: [],
};

