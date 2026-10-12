// Video de Modelamiento: «La proyección de los próximos seis meses, ajustable por su equipo.»
// Guion de Comercial: S-Lab/Buffo Consulting/Sitio 2.0/GUIONES_videos_borrador.md
// Uso: node scripts/videos/modelamiento.mjs /ruta/de/salida/nombre
import { abrir, grabar } from './lib.mjs';
const a = await abrir();
const { p, esperar } = a;
await p.addStyleTag({ content: `
  #p-forecast > .encabezado h1, #p-forecast > .encabezado p, #fc-subtitulo{display:none!important}
  #p-forecast > .seccion:not(#s-fc-proyeccion){display:none!important}
  #p-forecast{max-width:1040px}
  #fc-kpis > *{transition:transform .7s ease, box-shadow .7s ease, border-color .7s ease!important}` });
await a.js(() => { ir('forecast'); document.querySelector('.contenido').style.opacity = 0; }); await esperar(1200);
await a.js(() => {
  const el = document.querySelector('#fc-ajuste');
  window.desliza = (e) => { const v = String(Math.round(9 * e)); if (el.value !== v) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); } };
});
await a.cam(['#fc-kpis', '#ch-fc'], { pad: 22, ms: 0 });
await grabar(a, process.argv[2], async () => {
  // 0 a 3: la historia y la línea del modelo.
  await a.fundido(true, false);
  await a.cursorA('#ch-fc', { fx: 0.55, fy: 0.45, ms: 1000 });
  await a.cursorA('#ch-fc', { fx: 0.82, fy: 0.4, ms: 900, curva: -0.1 });
  await esperar(500);
  // 3 a 7: el equipo ajusta la proyección; la cifra cambia.
  await a.cam(['#fc-ajuste', '#fc-kpis > :nth-child(2)'], { pad: 40, ms: 1000, espera: false });
  await esperar(500);
  await a.cursorA('#fc-ajuste', { fx: 0.5, ms: 800 });
  await esperar(300);
  a.anima('desliza', 1500);
  await a.cursorA('#fc-ajuste', { fx: 0.72, ms: 1500, curva: 0 });
  await esperar(400);
  // 7 a 10: la tarjeta «Mi proyección» con el ajuste.
  await a.cursorA('#fc-kpis > :nth-child(2)', { fy: 0.5, ms: 800 });
  await esperar(1700);
  // 10 a 13: de pesos a unidades; el gráfico se redibuja.
  await a.cam(['#fc-modo', '#ch-fc'], { pad: 22, ms: 1000, espera: false });
  await esperar(600);
  await a.cursorA('#fc-modo .chip:nth-child(2)', { ms: 800 });
  await esperar(300);
  await p.click('#fc-modo .chip:nth-child(2)');
  await esperar(2300);
  await a.fundido(false);
});
await a.b.close();
