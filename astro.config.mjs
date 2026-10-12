import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Sitio público de Buffo IA Consulting
export default defineConfig({
  site: 'https://buffoconsulting.cl',
  integrations: [tailwind(), sitemap()],
  // La barra de herramientas de Astro solo existe en desarrollo, pero ahí tapa
  // el centro inferior de la pantalla, justo donde Simón revisa las entregas.
  devToolbar: { enabled: false },
  vite: {
    server: {
      // En local, /api lo atiende scripts/dev-api.mjs (Astro no sirve las
      // funciones de Vercel). En producción no aplica: es un sitio estático.
      proxy: { '/api': { target: 'http://localhost:4322', changeOrigin: true } },
    },
  },
});
