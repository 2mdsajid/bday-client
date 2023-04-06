/** @type {import('tailwindcss').Config} */


const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'dark': '#212121', // Dark theme background color
        'card': '#303030', // Dark theme card background color
        'light': '#F5F5F5', // Light theme background color
        'card-light': '#FFFFFF', // Light theme card background color
      },
      textColor: {
        'white': '#FFFFFF', // White text color
        'dark-gray': '#333333', // Dark gray text color
      },
      borderColor: {
        'yellow': '#FFC107', // Yellow border color for countdown timer
        'green': '#4CAF50', // Green border color for buttons
        'orange': '#FF5722', // Orange border color for accent
        'blue': '#2196F3', // Blue border color for countdown timer
        'pink': '#E91E63', // Pink border color for buttons
        'teal': '#009688', // Teal border color for accent
      },
    },
  },
  plugins: [],
}

