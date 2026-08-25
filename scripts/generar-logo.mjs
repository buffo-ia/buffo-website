/**
 * Genera public/logo.png a partir de src/assets/logo-buffo.svg.
 *
 * Ese PNG no se muestra en ninguna página: es el `logo` del schema.org
 * Organization que declara BaseLayout.astro, o sea el archivo que Google lee
 * para el panel de conocimiento y los resultados enriquecidos. Por eso vivía
 * desactualizado sin que nadie lo notara — hasta agosto de 2026 seguía con el
 * logo del átomo, dos rediseños atrás.
 *
 * El texto "Buffo" del SVG usa currentColor, así que hay que fijarlo antes de
 * rasterizar: sin eso sale negro puro, que no es el color de la marca.
 *
 *   node scripts/generar-logo.mjs
 */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const CONFIG = {
  entrada: join(RAIZ, 'src', 'assets', 'logo-buffo.svg'),
  salida: join(RAIZ, 'public', 'logo.png'),
  // Ancho final. Google pide un mínimo de 112 px de lado; se genera holgado
  // para que sirva también como logo de correo o de presentación.
  ancho: 1200,
  // --c-on-surface del tema claro. Sobre fondo transparente el consumidor casi
  // siempre compone contra blanco, así que el texto va oscuro, no al revés.
  colorTexto: '#06202E',
  // Densidad de rasterizado: por debajo de esto los bordes del ave se pixelan.
  densidad: 300,
};

const svg = readFileSync(CONFIG.entrada, 'utf8').replace(
  /^<svg /,
  `<svg style="color:${CONFIG.colorTexto}" `
);

const info = await sharp(Buffer.from(svg), { density: CONFIG.densidad })
  .resize({ width: CONFIG.ancho })
  .png({ compressionLevel: 9 })
  .toFile(CONFIG.salida);

console.log(`OK → ${CONFIG.salida}  (${info.width}×${info.height})`);
