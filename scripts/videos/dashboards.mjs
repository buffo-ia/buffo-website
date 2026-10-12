// Video de Dashboards ejecutivos: «El cumplimiento de la meta, al día de hoy y por vendedor.»
// Guion de Comercial: S-Lab/Buffo Consulting/Sitio 2.0/GUIONES_videos_borrador.md
// Uso: node scripts/videos/dashboards.mjs /ruta/de/salida/nombre
import { abrir, grabar } from './lib.mjs';
const a = await abrir();
const { p, esperar } = a;
await p.addStyleTag({ content: `
  #p-equipo > .encabezado, #p-equipo > .seccion:not(#s-e-tablero):not(#s-e-cartera){display:none!important}
  #s-e-cartera > .rej{display:none!important}
  #s-e-cartera .seccion-tit{display:none}
  #e-cards{max-width:960px}
  #s-e-cartera{max-width:1000px;margin-top:400px}
  .v-card{transition:transform .7s ease, box-shadow .7s ease, border-color .7s ease!important}
  #tb-inactivos :is(th,td):is(:nth-child(2),:nth-child(3),:nth-child(7)){display:none}
  #pag-inact, #e-inact-filtro{display:none}` });
await a.js(() => { ir('equipo'); document.querySelector('.contenido').style.opacity = 0; }); await esperar(900);
const C = (n) => `#e-cards > :nth-child(${n})`;
await a.cam([C(1), C(3)], { pad: 26, ms: 0 });
await grabar(a, process.argv[2], async () => {
  // 0 a 4: las tarjetas por vendedor; el cursor recorre dos.
  await a.fundido(true, false);
  await a.cursorA(C(3), { fy: 0.3, ms: 900 });
  await a.cursorA(C(2), { fy: 0.34, ms: 800, curva: -0.1 });
  await a.cursorA(C(1), { fy: 0.3, ms: 800, curva: -0.1 });
  await esperar(500);
  // 4 a 8: acercamiento al medidor de la vendedora bajo la meta y a lo que le tocaba.
  await a.cam([`${C(1)} .v-top`, `${C(1)} .v-ref`], { pad: 22, ms: 1100, espera: false });
  await esperar(600);
  await a.cursorA(`${C(1)} .v-ref`, { fx: 0.3, fy: 0.6, ms: 800 });
  await esperar(1900);
  // 8 a 12: baja a los clientes sin comprar y abre la cartera en riesgo.
  await a.cam([`${C(1)} .v-ref`, `${C(1)} .v-fila:last-child`], { pad: 24, ms: 900, espera: false });
  await esperar(500);
  await a.cursorA(`${C(1)} .v-fila:last-child b`, { ms: 800 });
  await esperar(900);
  await a.fundido(false);
  await a.cam(['#s-e-cartera .t-cab', '#tb-inactivos tbody tr:nth-child(6)'], { pad: 22, ms: 0 });
  await a.fundido(true, false);
  await a.cursorA('#e-inactivos-sub', { fx: 0.2, ms: 800 });
  await esperar(900);
  // 12 a 15: acercamiento a los clientes de mayor riesgo.
  await a.cam(['#tb-inactivos thead th:nth-child(4)', '#tb-inactivos tbody tr:nth-child(3) td:nth-child(6)'], { pad: 30, ms: 1000, espera: false });
  await esperar(500);
  await a.cursorA('#tb-inactivos tbody tr:nth-child(1) td:nth-child(6)', { fy: 0.7, ms: 800 });
  await esperar(1900);
  await a.fundido(false);
});
await a.b.close();
