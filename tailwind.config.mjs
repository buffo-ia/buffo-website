/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Los colores viven en src/styles/global.css como variables CSS (canales RGB
      // sueltos, para que Tailwind pueda seguir aplicando opacidad: bg-primary/10).
      // Cambiar de tema = redefinir esas variables, no tocar ninguna página.
      colors: {
        primary: 'rgb(var(--c-primary) / <alpha-value>)',
        'on-primary': 'rgb(var(--c-on-primary) / <alpha-value>)',
        background: 'rgb(var(--c-background) / <alpha-value>)',
        'on-background': 'rgb(var(--c-on-surface) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'on-surface': 'rgb(var(--c-on-surface) / <alpha-value>)',
        'surface-variant': 'rgb(var(--c-surface-variant) / <alpha-value>)',
        'on-surface-variant': 'rgb(var(--c-on-surface-variant) / <alpha-value>)',
        outline: 'rgb(var(--c-outline) / <alpha-value>)',
        'outline-variant': 'rgb(var(--c-outline-variant) / <alpha-value>)',
        'surface-container-lowest': 'rgb(var(--c-container-lowest) / <alpha-value>)',
        'surface-container-low': 'rgb(var(--c-container-low) / <alpha-value>)',
        'surface-container': 'rgb(var(--c-container) / <alpha-value>)',
        'surface-container-high': 'rgb(var(--c-container-high) / <alpha-value>)',
        'surface-container-highest': 'rgb(var(--c-container-highest) / <alpha-value>)',
        error: 'rgb(var(--c-error) / <alpha-value>)',
        // Reemplaza los 99 usos de `white/X`: una línea de 1px que se ve en ambos temas.
        hairline: 'rgb(var(--c-hairline) / <alpha-value>)',
      },
      /* Escala de radios. Antes era 0 en todo, decisión deliberada contra el
         look de plantilla. Simón pidió soltar la mano: la regla nueva es que la
         curva SIGNIFIQUE algo — mientras más grande la pieza, más curva, y lo
         que se toca es píldora. Redondear todo por igual es el tic que se
         estaba evitando. */
      borderRadius: {
        none: '0px',
        sm: '6px',
        DEFAULT: '10px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '28px',
        '3xl': '36px',
        full: '9999px',
      },
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
