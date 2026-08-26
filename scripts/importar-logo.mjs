/**
 * Importa el logotipo oficial desde los originales del diseñador.
 *
 * Los archivos de Milo (milogotipo.cl, entregados el 25-ago-2026) vienen en un
 * lienzo cuadrado de 2250×2250 con el arte ocupando 1452×594 en el medio. Si se
 * usan tal cual, el <img> mide el cuadrado completo y el logo aparece diminuto
 * dentro de un marco de aire. Por eso acá se recortan al contenido real.
 *
 * ⚠️ Y se genera una variante que Milo NO entregó en PNG transparente: el
 * colibrí turquesa con la palabra en BLANCO, que es la que corresponde sobre
 * fondo oscuro. Él la mandó solo como JPG con el negro quemado (ORIGINAL_BUFFO-01),
 * inservible sobre cualquier otro fondo. Las alternativas eran peores: la
 * monocroma blanca deja la marca sin su único color, y ponerle una placa blanca
 * detrás al logo de palabra negra se ve como un sticker pegado encima.
 *
 * La reconstrucción no interpreta nada. El archivo de palabra negra tiene
 * exactamente DOS colores opacos —negro puro y #20C2BC, el turquesa que declara
 * el manual—, así que repintar de blanco lo que no es turquesa reproduce la
 * variante oficial pixel por pixel, con el mismo trazo y el mismo antialias.
 * No es un logo nuevo: es el que ya está en la guía de uso sobre negro.
 *
 * Además escribe los DERIVADOS de public/: el favicon, el icono de iOS, el logo
 * que lee Google (schema.org) y el de la portada del informe del diagnóstico.
 * Todos salían antes de scripts distintos y por eso se quedaban atrás de a uno;
 * hasta agosto de 2026 el logo del schema.org seguía con el átomo, dos rediseños
 * atrás.
 *
 *   node scripts/importar-logo.mjs ["ruta/a/la/carpeta Marca"]
 */
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const CONFIG = {
  // Carpeta con los originales. Vive en OneDrive, fuera del repo, porque son
  // 22 MB de material que el sitio no necesita versionar.
  origen:
    process.argv[2] ??
    join(process.env.USERPROFILE ?? process.env.HOME ?? '', 'OneDrive', 'S-Lab', 'Buffo Consulting', 'Marca'),
  subcarpeta: '03 Logo - PNG fondo transparente',
  destino: join(RAIZ, 'src', 'assets'),
  publico: join(RAIZ, 'public'),
};

const carpeta = join(CONFIG.origen, CONFIG.subcarpeta);
if (!existsSync(carpeta)) {
  console.error(`No encuentro los originales en:\n  ${carpeta}\n\nPasá la ruta como argumento.`);
  process.exit(1);
}

const original = (n) => join(carpeta, n);
const asset = (n) => join(CONFIG.destino, n);
const pub = (n) => join(CONFIG.publico, n);

/** Recorta al arte. threshold 1 para no comerse el antialias del borde del ave. */
const recortado = (ruta) => sharp(ruta).trim({ threshold: 1 });

/**
 * Repinta de blanco todo lo que no sea el turquesa de marca, respetando el
 * canal alfa. Se decide por canal verde y no por igualdad exacta de color
 * porque los píxeles del borde vienen con alfa parcial: ahí el turquesa sigue
 * siendo turquesa (verde muy por encima del rojo) pero ya no es #20C2BC clavado.
 */
async function palabraEnBlanco(entrada) {
  const { data, info } = await recortado(entrada).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  for (let i = 0; i < width * height; i++) {
    const p = i * channels;
    if (data[p + 3] === 0) continue;
    const esTurquesa = data[p + 1] > data[p] + 20;
    if (!esTurquesa) {
      data[p] = 255;
      data[p + 1] = 255;
      data[p + 2] = 255;
    }
  }
  return sharp(data, { raw: { width, height, channels } });
}

// ── Assets del sitio ──────────────────────────────────────────────────────────

const ASSETS = [
  {
    salida: 'logo-sobre-claro.png',
    para: 'fondo claro — colibrí turquesa, palabra negra (la barra del header y el pie en tema claro)',
    hacer: () => recortado(original('ORIGINAL_BUFFO-02.png')),
  },
  {
    salida: 'logo-sobre-oscuro.png',
    para: 'fondo oscuro — colibrí turquesa, palabra blanca (el pie en tema oscuro y la tarjeta al compartir)',
    hacer: () => palabraEnBlanco(original('ORIGINAL_BUFFO-02.png')),
  },
  {
    salida: 'isotipo-buffo.png',
    para: 'el colibrí solo — favicon y avatares, donde el logo completo no se lee',
    hacer: () => recortado(original('ORIGINAL_BUFFO-07.png')),
  },
];

for (const a of ASSETS) {
  const info = await (await a.hacer()).png({ compressionLevel: 9 }).toFile(asset(a.salida));
  console.log(`  ✓ ${a.salida.padEnd(24)} ${info.width}×${info.height}  — ${a.para}`);
}

// ── Derivados de public/ ──────────────────────────────────────────────────────
// Se generan a partir de lo que acaba de quedar en src/assets, no de los
// originales, para que no haya dos caminos por los que el logo pueda llegar
// distinto a dos lugares.

const DERIVADOS = [
  {
    salida: 'logo.png',
    para: 'el `logo` del schema.org Organization — lo que Google lee para el panel de conocimiento',
    // Google pide 112 px de lado como mínimo; se genera holgado para que sirva
    // también de logo en correos y presentaciones.
    hacer: () => sharp(asset('logo-sobre-claro.png')).resize({ width: 1200 }),
  },
  {
    salida: 'logo-firma.png',
    para: 'la portada del informe del diagnóstico, que se imprime sobre papel blanco',
    hacer: () => sharp(asset('logo-sobre-claro.png')).resize({ width: 900 }),
  },
  {
    salida: 'favicon.png',
    para: 'la pestaña del navegador — va el colibrí solo: el logo completo a 32 px es una mancha',
    hacer: () =>
      sharp(asset('isotipo-buffo.png')).resize({
        width: 192,
        height: 192,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      }),
  },
  {
    salida: 'apple-touch-icon.png',
    para: 'el icono de la pantalla de inicio en iOS',
    // Acá NO va transparente: iOS compone el icono contra negro y el colibrí
    // turquesa perdería el contraste. Fondo blanco, que es uso autorizado.
    hacer: () =>
      sharp(asset('isotipo-buffo.png'))
        .resize({
          width: 132,
          height: 132,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .extend({
          top: 24, bottom: 24, left: 24, right: 24,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .flatten({ background: '#ffffff' }),
  },
];

console.log('');
for (const d of DERIVADOS) {
  const info = await d.hacer().png({ compressionLevel: 9 }).toFile(pub(d.salida));
  console.log(`  ✓ public/${d.salida.padEnd(24)} ${info.width}×${info.height}  — ${d.para}`);
}
