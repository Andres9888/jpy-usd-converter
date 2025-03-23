/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Japanese themed colors
        'hinomaru': '#BC002D', // Japanese flag red
        'kon': '#24336A',      // Traditional Japanese indigo
        'yamabuki': '#F8B500', // Japanese golden yellow
        'sakura': '#FFB7C5',   // Cherry blossom pink

        // USA themed colors
        'usd-green': '#006400',     // Dollar green
        'usd-dark-green': '#004D00', // Darker shade
        'usd-light-green': '#228B22', // Lighter shade

        // Neutral palette
        'japan-slate': '#4B4B4B',
        'japan-red': '#BC002D',
        'japan-indigo': '#24336A',
      },
      backgroundImage: {
        'sakura-pattern': "url('/src/assets/sakura-pattern.svg')",
        'dollar-pattern': "url('/src/assets/dollar-pattern.svg')",
        'sakura-pattern-light': 'linear-gradient(120deg, #F5F2EB 0%, #FFE4E1 100%)',
        'dollar-pattern-light': 'linear-gradient(120deg, #FBFEF9 0%, #F0FFF0 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out 1.5s infinite',
        'pulse-japan': 'pulseJapan 0.6s ease-in-out',
        'pulse-usd': 'pulseUsd 0.6s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseJapan: {
          '0%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(188, 0, 45, 0.1)' },
          '100%': { backgroundColor: 'transparent' },
        },
        pulseUsd: {
          '0%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(0, 100, 0, 0.1)' },
          '100%': { backgroundColor: 'transparent' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'float': '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        'sans': ['Poppins', 'Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};