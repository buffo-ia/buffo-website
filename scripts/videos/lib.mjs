// Grabador de la demo Distribuye: cámara (acercamientos), cursor dibujado y
// captura por screencast de Chrome. No modifica la demo: todo se inyecta al abrirla.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const require = createRequire('/Users/simon-angel/Dev/buffo-platform-3/');
const { chromium } = require('playwright');
// La demo que se graba. Por defecto, la copia preparada para los videos (fecha al
// día, catálogo y proveedores genéricos); DEMO=/ruta/Distribuye.html usa otra.
export const SRC = 'file://' + (process.env.DEMO || '/Users/simon-angel/Library/CloudStorage/OneDrive-Personal/S-Lab/Buffo Consulting/Sitio 2.0/demo-videos/Distribuye.html');
export const W = 1280, H = 720;
const real = (ms) => new Promise((r) => setTimeout(r, ms));
export const FPS = 30;
// Mientras se graba, «esperar» no espera: saca una foto por cada 1/30 de segundo
// de video. La cámara, el cursor y los fundidos se mueven desde acá, un paso por
// cuadro, así el video sale parejo aunque cada foto demore. (Detener el reloj de
// la página con el tiempo virtual de Chrome se probó y deja la foto colgada al
// agrandar el contenido.)
const G = { cdp: null, dir: '', n: 0, resto: 0 };
const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
async function cuadro() {
  const t1 = Date.now();
  if (G.cam) {
    const c = G.cam, t = Math.min(1, (G.n + 1 - c.n0) / c.pasos), e = suave(t);
    const m = (k) => c.de[k] + (c.a[k] - c.de[k]) * e;
    await G.p.evaluate((v) => camPon(v), { x: m('x'), y: m('y'), s: m('s') });
    if (t >= 1) G.cam = null;
  }
  if (G.fun) {
    const f = G.fun, t = Math.min(1, (G.n + 1 - f.n0) / f.pasos);
    await G.p.evaluate((o) => { document.querySelector('.contenido').style.opacity = o; }, f.de + (f.a - f.de) * t);
    if (t >= 1) G.fun = null;
  }
  // Animaciones propias del guion: una función de la página que recibe el avance (0 a 1).
  if (G.ani) {
    const an = G.ani, t = Math.min(1, (G.n + 1 - an.n0) / an.pasos);
    await G.p.evaluate(({ f, e }) => window[f](e), { f: an.f, e: 1 - Math.pow(1 - t, 3) });
    if (t >= 1) G.ani = null;
  }
  const { data } = await G.cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 93 });
  fs.writeFileSync(`${G.dir}/${String(G.n++).padStart(5, '0')}.jpg`, Buffer.from(data, 'base64'));
  if (process.env.TRAZA) console.log(G.n, Date.now() - t1);
}
const esperar = async (ms) => {
  if (!G.cdp) return real(ms);
  G.resto += ms; while (G.resto >= 1000 / FPS) { G.resto -= 1000 / FPS; await cuadro(); }
};

export async function abrir({ acento = '#20C2BC', dsf = 2 } = {}) {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: dsf });
  await ctx.addInitScript(() => { try { localStorage.setItem('distribuye-tema', 'claro'); } catch {} });
  const p = await ctx.newPage();
  await p.goto(SRC); await p.waitForTimeout(1200);
  await p.evaluate(() => ir('configuracion')); await p.waitForTimeout(300);
  await p.click(`#cfg-acentos [data-c="${acento}"]`); await p.waitForTimeout(300);
  await p.addStyleTag({ content: `
    html,body{overflow:hidden!important;scroll-behavior:auto!important}
    #lateral,.superior{display:none!important}
    .principal{margin-left:0!important}
    .contenido{transform-origin:0 0;}
    #cur{position:fixed;left:0;top:0;z-index:99999;pointer-events:none;width:26px;height:26px;transform:translate(-200px,-200px);filter:drop-shadow(0 2px 3px rgba(0,0,0,.28))}
  ` });
  await p.evaluate(() => {
    const c = document.createElement('div'); c.id = 'cur';
    c.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M4 2.5v17l4.6-4.3 3 6.6 2.9-1.3-3-6.5h6.3z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    document.body.appendChild(c);
    addEventListener('mousemove', (e) => { c.style.transform = `translate(${e.clientX - 4}px,${e.clientY - 2}px)`; }, true);
    // El punto medio entre frases no va en el sitio: se cambia por coma en lo que se ve.
    const limpiar = (n) => { const w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); let t; while ((t = w.nextNode())) if (t.nodeValue.includes(' · ')) t.nodeValue = t.nodeValue.replaceAll(' · ', ', '); };
    limpiar(document.body);
    new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) limpiar(n); else if (n.nodeType === 3 && n.nodeValue.includes(' · ')) n.nodeValue = n.nodeValue.replaceAll(' · ', ', '); }))).observe(document.body, { childList: true, subtree: true });
    const cont = document.querySelector('.contenido');
    window.__cam = { x: 0, y: 0, s: 1 };
    // Encuadra un rectángulo dado en coordenadas del contenido sin transformar.
    window.camRect = (r, ms = 900) => {
      const s = Math.min(1280 / r.w, 720 / r.h);
      const x = -(r.x - (1280 / s - r.w) / 2) * s, y = -(r.y - (720 / s - r.h) / 2) * s;
      return { x, y, s };
    };
    window.camPon = (c) => { window.__cam = c; cont.style.transform = `translate(${c.x}px,${c.y}px) scale(${c.s})`; };
    // Rectángulo de un elemento en coordenadas del contenido sin transformar.
    window.rectDe = (sel, pad = 0) => {
      const e = typeof sel === 'string' ? document.querySelector(sel) : sel;
      const a = e.getBoundingClientRect(), c = window.__cam;
      return { x: (a.left - c.x) / c.s - pad, y: (a.top - c.y) / c.s - pad, w: a.width / c.s + pad * 2, h: a.height / c.s + pad * 2 };
    };
  });
  let pos = { x: -60, y: 300 };
  const api = {
    b, p, esperar,
    js: (f, a) => p.evaluate(f, a),
    // Encuadra elemento(s): une los rectángulos y agrega margen; `ancho` fija el ancho mínimo de la vista.
    async cam(sels, { pad = 24, ms = 900, ancho = 0, espera = true } = {}) {
      const dest = await p.evaluate(({ sels, pad, ms, ancho }) => {
        const rs = [].concat(sels).map((s) => rectDe(s));
        let x = Math.min(...rs.map((r) => r.x)) - pad, y = Math.min(...rs.map((r) => r.y)) - pad;
        let w = Math.max(...rs.map((r) => r.x + r.w)) + pad - x, h = Math.max(...rs.map((r) => r.y + r.h)) + pad - y;
        if (ancho && w < ancho) { x -= (ancho - w) / 2; w = ancho; }
        return camRect({ x, y, w, h }, ms);
      }, { sels, pad, ms, ancho });
      await api.camA(dest, ms, espera);
    },
    async vista(y = 0, ms = 900, espera = true) { await api.camA(await p.evaluate((y) => camRect({ x: 0, y, w: 1280, h: 720 }), y), ms, espera); },
    async camA(dest, ms, espera) {
      const de = await p.evaluate(() => window.__cam);
      if (!G.cdp || ms <= 0) { G.cam = null; await p.evaluate((v) => camPon(v), dest); return; }
      G.cam = { de, a: dest, n0: G.n, pasos: Math.max(1, Math.round(ms / (1000 / FPS))) };
      if (espera) await esperar(ms + 40);
    },
    // Mueve el cursor en curva hasta un punto de pantalla.
    async cursor(x, y, ms = 800, curva = 0.18) {
      const a = { ...pos }, dx = x - a.x, dy = y - a.y;
      const c = { x: a.x + dx / 2 - dy * curva, y: a.y + dy / 2 + dx * curva };
      const pasos = Math.max(1, Math.round(ms / (1000 / FPS)));
      for (let i = 1; i <= pasos; i++) {
        const t = i / pasos; const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const px = (1 - e) * (1 - e) * a.x + 2 * (1 - e) * e * c.x + e * e * x, py = (1 - e) * (1 - e) * a.y + 2 * (1 - e) * e * c.y + e * e * y;
        await p.mouse.move(px, py); pos = { x: px, y: py };
        await esperar(1000 / FPS);
      }
    },
    // Mueve el cursor al centro (o a una fracción) de un elemento, donde esté ahora en pantalla.
    async cursorA(sel, { fx = 0.5, fy = 0.5, ms = 800, curva = 0.18 } = {}) {
      const r = await p.evaluate((s) => { const a = document.querySelector(s).getBoundingClientRect(); return { x: a.left, y: a.top, w: a.width, h: a.height }; }, sel);
      await api.cursor(r.x + r.w * fx, r.y + r.h * fy, ms, curva);
    },
    // Llama a window[f](avance) en cada cuadro durante `ms` de video.
    anima(f, ms) { G.ani = { f, n0: G.n, pasos: Math.max(1, Math.round(ms / (1000 / FPS))) }; },
    async fundido(on, espera = true, ms = 360) {
      const a = on ? 1 : 0;
      if (!G.cdp) { await p.evaluate((o) => { document.querySelector('.contenido').style.opacity = o; }, a); return; }
      G.fun = { de: 1 - a, a, n0: G.n, pasos: Math.max(1, Math.round(ms / (1000 / FPS))) };
      if (espera) await esperar(ms + 40);
    },
  };
  return api;
}

// Graba lo que haga `guion` y deja <salida>.mp4, .webm y .jpg (póster).
export async function grabar(api, salida, guion) {
  const { p } = api, dir = salida + '_cuadros';
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const cdp = await p.context().newCDPSession(p);
  Object.assign(G, { cdp, dir, n: 0, resto: 0, p, cam: null, fun: null, ani: null });
  const t0 = Date.now();
  await guion(api);
  G.cdp = null;
  const comun = ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${dir}/%05d.jpg`, '-vf', `scale=${W}:${H}:flags=lanczos`, '-an'];
  execFileSync('ffmpeg', [...comun, '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', salida + '.mp4']);
  execFileSync('ffmpeg', [...comun, '-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0', '-row-mt', '1', salida + '.webm']);
  console.log(`${salida}: ${G.n} cuadros = ${(G.n / FPS).toFixed(1)} s de video (grabado en ${((Date.now() - t0) / 1000).toFixed(0)} s), mp4 ${(fs.statSync(salida + '.mp4').size / 1024).toFixed(0)} KB, webm ${(fs.statSync(salida + '.webm').size / 1024).toFixed(0)} KB`);
}
