// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}", // Adjust paths to match your project structure
  ],
  theme: {
    extend: {
      fontFamily: {
        // Guardian-inspired headline serif
        serifHeadline: ['"Merriweather"', ...defaultTheme.fontFamily.serif],
        // Guardian-inspired body sans
        sansBody: ['"Open Sans"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Optional: subtle Guardian-like palette
        primary: '#052962', // deep blue
        secondary: '#005689', // accent blue
        neutral: '#333333',   // dark gray text
      },
    },
  },
  plugins: [],
};
