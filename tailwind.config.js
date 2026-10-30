/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f3eee2',
        paper: '#ffffff',
        ink: '#171614',
        muted: '#786f63',
        line: '#d8cbb8',
        accent: '#c5aa87',
      },
      borderRadius: {
        DEFAULT: '20px',
        card: '20px',
      },
      maxWidth: {
        page: '1320px',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    'grid-cols-1',
    'md:grid-cols-2',
    'md:grid-cols-3',
    'md:grid-cols-4',
    'lg:grid-cols-3',
    'lg:grid-cols-4',
    'md:grid-cols-[300px_1fr]',
    'open',
    'active',
    'hidden',
    'flex',
    'bg-[#fdecea]',
    'text-[#c0392b]',
    'bg-[#eaeaea]',
    'text-[#666]',
    'bg-[#e6f4ea]',
    'text-[#1e7e34]',
  ]
};
