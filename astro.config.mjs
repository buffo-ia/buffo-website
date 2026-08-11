import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Sitio público de Buffo IA Consulting
export default defineConfig({
  site: 'https://buffoconsulting.cl',
  integrations: [tailwind(), sitemap()],
  vite: {
    server: {
      // En local, /api lo atiende scripts/dev-api.mjs (Astro no sirve las
      // funciones de Vercel). En producción no aplica: es un sitio estático.
      proxy: { '/api': { target: 'http://localhost:4322', changeOrigin: true } },
    },
  },
});
