import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Colección de artículos del blog. El frontmatter de cada .md sigue este esquema.
// Esta misma estructura es la que el agente automatizado (Fase 5) deberá completar.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
    title: z.string(),
    description: z.string(), // meta description (155-160 caracteres)
    lead: z.string(), // párrafo de respuesta directa (50-80 palabras) — GEO/AEO
    cover: image(), // imagen de portada (Astro la optimiza a WebP)
    coverAlt: z.string(), // texto alternativo de la portada
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // El cluster al que pertenece (alinea con los slugs de servicio + 'general' para el pilar)
    category: z.enum([
      'general',
      'dashboards-ejecutivos',
      'modelamiento-predictivo',
      'automatizacion-procesos',
      'agentes-ia',
    ]),
    keywords: z.array(z.string()).default([]),
    icon: z.string().default('article'), // Material Symbol para la card (sin imágenes)
    isPilar: z.boolean().default(false), // destaca el artículo madre del cluster
    draft: z.boolean().default(false), // los borradores no se publican en producción
    }),
});

export const collections = { blog };
