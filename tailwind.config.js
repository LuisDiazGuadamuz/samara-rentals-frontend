/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#C79A2B', // dorado arena
          sand: '#C79A2B',
          'sand-light': '#E7D9A8',
        },
        ocean: {
          DEFAULT: '#2C9AB7',
        },
        tropical: {
          DEFAULT: '#3F7D58',
        },
        bg: '#F8F5EF',
        text: '#1F2933',
        'soft-black': '#1E1E1E',
        card: '#FFFFFF',
        border: '#E7DED2',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 14px 28px -16px rgba(29, 29, 31, 0.35)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(140deg, #c7a24a 0%, #e3cb8a 45%, #c7a24a 100%)',
      },
    },
  },
  plugins: [],
}

