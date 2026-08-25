/**
 * Importa el logotipo oficial desde los originales del diseñador.
 *
 * Los archivos de Milo (milogotipo.cl, entregados el 25-ago-2026) vienen en un
 * lienzo cuadrado de 2250×2250 con el arte ocupando 1452×594 en el medio. Si se
 * usan tal cual, el <img> mide el cuadrado completo y el logo aparece diminuto
 * dentro de un marco de aire. Por eso acá se recortan al contenido real — es el
 * único cambio que se les hace: ni se recolorean ni se re-dibujan.
 *
 * Se mantiene como script y no como un recorte hecho a mano porque el manual de
 * marca se va a revisar (queda pendiente confirmar el turquesa: la guía declara
 * #20C2BC pero el .ai trae #00C6BD). Cuando llegue una versión nueva, esto se
 * vuelve a correr y listo.
 *
 * Además de dejar los assets del sitio, escribe los DERIVADOS de public/: el
 * favicon, el icono de iOS, el logo que lee Google (schema.org) y el de la
 * portada del informe del diagnóstico. Todos salían antes de scripts distintos
 * y por eso se quedaban atrás de a uno; hasta agosto de 2026 el logo del
 * schema.org seguía con el átomo, dos rediseños atrás.
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

  // Qué variante de Milo cumple qué oficio en el sitio.
  variantes: [
    {
      archivo: 'ORIGINAL_BUFFO-02.png',
      salida: 'logo-buffo-negro.png',
      para: 'fondo claro — colibrí turquesa con la palabra en negro (la barra del header)',
    },
    {
      archivo: 'ORIGINAL_BUFFO-04.png',
      salida: 'logo-buffo-blanco.png',
      para: 'fondo oscuro — versión monocroma blanca (el pie de página en tema oscuro)',
    },
    {
      archivo: 'ORIGINAL_BUFFO-07.png',
      salida: 'isotipo-buffo.png',
      para: 'el colibrí solo — favicon y avatares, donde el logo completo no se lee',
    },
  ],
};

const carpeta = join(CONFIG.origen, CONFIG.subcarpeta);
if (!existsSync(carpeta)) {
  console.error(`No encuentro los originales en:\n  ${carpeta}\n\nPasá la ruta como argumento.`);
  process.exit(1);
}

for (const v of CONFIG.variantes) {
  const entrada = join(carpeta, v.archivo);
  if (!existsSync(entrada)) {
    console.error(`  ✗ falta ${v.archivo}`);
    process.exit(1);
  }
  const info = await sharp(entrada)
    // threshold 1 para que no se coma el antialias del borde del ave.
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toFile(join(CONFIG.destino, v.salida));
  console.log(`  ✓ ${v.salida.padEnd(24)} ${info.width}×${info.height}  — ${v.para}`);
}

// ── Derivados de public/ ───────────────────────────────────────────────────────
// Se generan a partir de lo que acaba de quedar en src/assets, no de los
// originales, para que no haya dos caminos por los que el logo pueda llegar
// distinto a dos lugares.

const asset = (n) => join(CONFIG.destino, n);
const pub = (n) => join(CONFIG.publico, n);

const DERIVADOS = [
  {
    salida: 'logo.png',
    para: 'el `logo` del schema.org Organization — lo que Google lee para el panel de conocimiento',
    // Google pide 112 px de lado como mínimo; se genera holgado para que sirva
    // también de logo en correos y presentaciones.
    hacer: () => sharp(asset('logo-buffo-negro.png')).resize({ width: 1200 }),
  },
  {
    salida: 'logo-firma.png',
    para: 'la portada del informe del diagnóstico, que se imprime sobre papel blanco',
    hacer: () => sharp(asset('logo-buffo-negro.png')).resize({ width: 900 }),
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
