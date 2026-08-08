/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        meta: {
          blue: '#1877F2',
          lightBg: '#F0F2F5',
          cardBg: '#FFFFFF',
          darkBg: '#0F1419',
          darkCard: '#1E2732',
          accent: '#0064E0',
          borderLight: '#E4E6EB',
          borderDark: '#2F3336',
        },
      },
    },
  },
  plugins: [],
};
