// Video del home: «Dónde se genera el resultado y dónde se pierde.»
// Guion de Comercial: S-Lab/Buffo Consulting/Sitio 2.0/GUIONES_videos_borrador.md
// Uso: node scripts/videos/home.mjs /ruta/de/salida/home   (deja .mp4 y .webm)
import { abrir, grabar } from './lib.mjs';
const sal = process.argv[2];
const a = await abrir({ acento: process.argv[3] || '#20C2BC' });
const { p, esperar } = a;
// Preparación fuera de cámara: las dos pantallas pintadas y la portada en negro.
// La tabla de rentabilidad se graba sola y con las cinco columnas que cuentan la idea.
await p.addStyleTag({ content: `
  #p-margen > :not(#s-mg-cliente){display:none!important}
  #s-mg-cliente{max-width:1000px}
  #tb-mg-cli :is(th,td):is(:nth-child(2),:nth-child(6),:nth-child(7),:nth-child(8)){display:none}
  #pag-mg-cli{display:none}
  /* Ventas parte en las seis cifras: sin título, filtros ni fecha (Comercial, 12-oct). */
  #p-ventas > .encabezado, #v-filtros, #p-ventas > .seccion:not(#s-v-resumen){display:none!important}
  #v-kpis{max-width:820px}
  #v-kpis > *{transition:opacity .12s, transform .7s ease, box-shadow .7s ease, border-color .7s ease!important}
  #v-kpis.foco > :not(:nth-child(3)){opacity:.18}` });
await a.js(() => { ir('margen'); }); await esperar(900);
await a.js(() => { ir('ventas'); document.querySelector('.contenido').style.opacity = 0; }); await esperar(900);
await a.cam('#v-kpis', { pad: 30, ms: 0 });
// La aguja del medidor sube de cero al valor durante el acercamiento.
await a.js(() => { window.aguja = (e) => { const k = document.querySelector('#v-kpis > :nth-child(3)'); k.outerHTML = htmlCumplimiento(window.__cumpl.c * e, window.__cumpl.sub, window.__cumpl.c); }; });
await grabar(a, sal, async () => {
  // 0 a 3: las seis cifras; el cursor las recorre.
  await a.js(() => { alPintar.ventas && alPintar.ventas(); });
  await a.fundido(true, false);
  await a.cursorA('#v-kpis > :nth-child(1)', { fy: 0.42, ms: 900 });
  await a.cursorA('#v-kpis > :nth-child(2)', { fy: 0.45, ms: 650, curva: -0.12 });
  await a.cursorA('#v-kpis > :nth-child(3)', { fy: 0.42, ms: 650, curva: -0.12 });
  await esperar(350);
  // 3 a 6: acercamiento al cumplimiento.
  await a.js(() => document.querySelector('#v-kpis').classList.add('foco'));
  await a.cam('#v-kpis > :nth-child(3)', { pad: 36, ms: 1000, espera: false });
  a.anima('aguja', 1500);
  await esperar(500);
  await a.cursorA('#v-kpis > :nth-child(3)', { fx: 0.8, fy: 0.62, ms: 700 });
  await esperar(1900);
  // 6 a 10: cambio a rentabilidad por cliente.
  await a.fundido(false);
  await a.js(() => { document.querySelector('#v-kpis').classList.remove('foco'); ir('margen'); });
  await a.js(() => { window.scrollTo(0, 0); document.documentElement.scrollTop = 0; });
  await a.cam(['#s-mg-cliente .seccion-tit', '#tb-mg-cli tbody tr:nth-child(8)'], { pad: 22, ms: 0 });
  await a.fundido(true, false);
  await a.cursorA('#tb-mg-cli thead th:nth-child(4)', { fy: 0.6, ms: 800 });
  await esperar(300);
  for (const f of [1, 3, 5]) await a.cursorA(`#tb-mg-cli tbody tr:nth-child(${f}) td:nth-child(4)`, { fx: 0.7, ms: 620, curva: 0.05 });
  await esperar(250);
  // 10 a 14: acercamiento a la primera fila y su etiqueta.
  await a.cam(['#tb-mg-cli thead th:nth-child(3)', '#tb-mg-cli tbody tr:nth-child(3) td:nth-child(9)'], { pad: 34, ms: 1100 });
  await a.cursorA('#tb-mg-cli tbody tr:nth-child(1) td:nth-child(9) .pill', { fx: 0.55, fy: 0.8, ms: 900 });
  await esperar(2200);
  await a.fundido(false);
});
await a.b.close();
