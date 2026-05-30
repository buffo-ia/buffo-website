import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Sitio público de Buffo IA Consulting
export default defineConfig({
  site: 'https://buffoconsulting.cl',
  integrations: [tailwind(), sitemap()],
});
