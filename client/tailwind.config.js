/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        froozo: {
          brown: '#4A2C17',
          coffee: '#6B3F1F',
          mocha: '#8B5E3C',
          caramel: '#C4843A',
          cream: '#FDF6EC',
          beige: '#F5ECD7',
          sand: '#E8D5B0',
          green: '#2D7D4A',
          'green-light': '#4CAF70',
          orange: '#E8722A',
          'orange-light': '#F5A056',
        }
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
      },
      boxShadow: {
        'warm': '0 4px 24px rgba(74, 44, 23, 0.12)',
        'warm-lg': '0 8px 40px rgba(74, 44, 23, 0.18)',
        'card': '0 2px 12px rgba(74, 44, 23, 0.08)',
      }
    },
  },
  plugins: [],
}
