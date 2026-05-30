/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#16B66B',
        'on-primary': '#000000',
        background: '#0D0E10',
        'on-background': '#E3E2E6',
        surface: '#121316',
        'on-surface': '#E3E2E6',
        'surface-variant': '#222428',
        'on-surface-variant': '#C4C6CF',
        outline: '#8E9099',
        'outline-variant': '#44474E',
        'surface-container-lowest': '#08090B',
        'surface-container-low': '#1A1B1F',
        'surface-container': '#1E1F23',
        'surface-container-high': '#282A2F',
        'surface-container-highest': '#33353A',
        error: '#FFB4AB',
      },
      borderRadius: { DEFAULT: '0px', lg: '0px', xl: '0px', full: '9999px' },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
