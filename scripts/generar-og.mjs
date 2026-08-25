/**
 * Genera public/og-image.png — la imagen que se ve al compartir el sitio en
 * WhatsApp, LinkedIn, Slack o X.
 *
 * Se renderiza con Chrome en modo headless en vez de dibujarla con una librería
 * de imágenes, y esa es la decisión clave: así la tipografía y los colores salen
 * de las MISMAS fuentes web y los mismos tokens que usa el sitio. El generador
 * anterior (_legacy/generar_og.py) pintaba con PIL usando fuentes de Windows y
 * rutas absolutas de otra máquina, así que en la práctica no se podía volver a
 * correr: por eso la imagen quedó dos rediseños atrás, con el logo del átomo y
 * la paleta verde.
 *
 * El logotipo se incrusta desde src/assets/logo-buffo-blanco.png — el original
 * del diseñador, la variante monocroma blanca, que es la que corresponde sobre
 * el azul noche de esta tarjeta. Cuando cambie el logo se vuelve a correr
 * `importar-logo.mjs` y esta imagen lo hereda sin tocar nada más.
 *
 *   node scripts/generar-og.mjs [--abrir]
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ── Configuración ──────────────────────────────────────────────────────────────
// Lo que cambia por campaña o por rediseño se edita acá. Los colores son los
// tokens del tema oscuro de src/styles/global.css; si allá cambian, cambian acá.
const CONFIG = {
  salida: join(RAIZ, 'public', 'og-image.png'),
  logo: join(RAIZ, 'src', 'assets', 'logo-buffo-blanco.png'),

  // 1200×630 es la proporción 1.91:1 que piden Open Graph y Twitter. WhatsApp
  // usa la tarjeta grande solo si la imagen respeta esa forma.
  ancho: 1200,
  alto: 630,

  colores: {
    fondo: '#072033',        // --c-background (oscuro)
    texto: '#E9F2F6',        // --c-on-surface
    apagado: '#A0B8C6',      // --c-on-surface-variant
    marca: '#19D3C5',        // --c-primary
    punto: 'rgba(233,242,246,.055)',
    badgeFondo: 'rgba(25,211,197,.10)',
    badgeBorde: 'rgba(25,211,197,.35)',
  },

  texto: {
    badge: 'Inteligencia artificial aplicada al negocio',
    titulo1: 'Consultoría en',
    titulo2: 'Inteligencia Artificial',
    bajada: 'Convertimos tus datos en decisiones.',
    cuerpo:
      'Dashboards ejecutivos, modelamiento de datos, automatización de procesos y agentes IA.',
    pie: 'buffoconsulting.cl',
  },
};

// ── Motor ──────────────────────────────────────────────────────────────────────

/** Chrome headless: la única dependencia externa, y ya está en las dos máquinas. */
function buscarChrome() {
  const candidatos = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);
  const hallado = candidatos.find((c) => existsSync(c));
  if (!hallado) {
    throw new Error(
      'No encontré Chrome. Instálalo o exportá CHROME_PATH con la ruta al ejecutable.'
    );
  }
  return hallado;
}

function plantilla({ colores: c, texto: t, ancho, alto }, logoDataUri) {
  return `<!doctype html>
<html lang="es-CL"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:${ancho}px; height:${alto}px; }
  body {
    background:${c.fondo};
    /* La grilla de puntos es la textura del hero del sitio. */
    background-image: radial-gradient(${c.punto} 1.5px, transparent 1.5px);
    background-size: 28px 28px;
    font-family:'Inter', -apple-system, system-ui, sans-serif;
    color:${c.texto};
    padding:64px 80px;
    display:flex; flex-direction:column;
    position:relative; overflow:hidden;
  }
  /* Halo turquesa: la misma luz que el hero, para que la tarjeta no sea un rectángulo plano. */
  body::after {
    content:''; position:absolute; right:-180px; top:-220px;
    width:760px; height:760px; border-radius:50%;
    background: radial-gradient(circle, rgba(25,211,197,.14) 0%, rgba(25,211,197,0) 62%);
  }
  .capa { position:relative; z-index:1; display:flex; flex-direction:column; height:100%; }
  /* El logotipo ya trae su color adentro: es el PNG del diseñador, no un trazo
     que se pueda teñir. Por eso acá va la variante blanca y no una regla de
     color, que sobre una imagen no haría nada. */
  .logo { height:78px; }
  .logo img { height:100%; width:auto; display:block; }
  .badge {
    align-self:flex-start; margin-top:38px;
    font-size:15px; font-weight:600; letter-spacing:.14em; text-transform:uppercase;
    color:${c.marca}; background:${c.badgeFondo};
    border:1px solid ${c.badgeBorde}; border-radius:6px; padding:8px 14px;
  }
  h1 { margin-top:24px; font-size:66px; line-height:1.06; font-weight:800; letter-spacing:-.022em; }
  h1 .marca { color:${c.marca}; }
  .bajada { margin-top:20px; font-size:29px; font-weight:600; letter-spacing:-.01em; }
  .cuerpo { margin-top:12px; font-size:23px; font-weight:400; line-height:1.45; color:${c.apagado}; max-width:940px; }
  .pie { margin-top:auto; padding-top:20px; display:flex; align-items:center; gap:14px;
         font-size:20px; font-weight:600; color:${c.apagado}; letter-spacing:.01em; }
  .pie .raya { width:44px; height:2px; background:${c.marca}; border-radius:2px; }
</style></head>
<body><div class="capa">
  <div class="logo"><img src="${logoDataUri}" alt=""></div>
  <span class="badge">${t.badge}</span>
  <h1>${t.titulo1}<br><span class="marca">${t.titulo2}</span></h1>
  <p class="bajada">${t.bajada}</p>
  <p class="cuerpo">${t.cuerpo}</p>
  <div class="pie"><span class="raya"></span>${t.pie}</div>
</div></body></html>`;
}

// El PNG va incrustado como data URI y no como <img src="file://...">: así el
// HTML temporal no depende de rutas relativas al directorio del sistema.
const logoDataUri = `data:image/png;base64,${readFileSync(CONFIG.logo).toString('base64')}`;
const dir = mkdtempSync(join(tmpdir(), 'buffo-og-'));
const html = join(dir, 'og.html');
writeFileSync(html, plantilla(CONFIG, logoDataUri));

execFileSync(
  buscarChrome(),
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--screenshot=${CONFIG.salida}`,
    `--window-size=${CONFIG.ancho},${CONFIG.alto}`,
    // Sin esto la captura sale antes de que lleguen las fuentes web y el texto
    // aparece en la tipografía de respaldo del sistema.
    '--virtual-time-budget=8000',
    `file://${html}`,
  ],
  { stdio: 'pipe' }
);

console.log(`OK → ${CONFIG.salida}  (${CONFIG.ancho}×${CONFIG.alto})`);
if (process.argv.includes('--abrir')) execFileSync('open', [CONFIG.salida]);
