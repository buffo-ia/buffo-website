// Video de Agentes: «Qué comprar y cuándo: el sistema propone, su equipo decide.»
// Guion de Comercial: S-Lab/Buffo Consulting/Sitio 2.0/GUIONES_videos_borrador.md
// Uso: node scripts/videos/agentes.mjs /ruta/de/salida/nombre
import { abrir, grabar } from './lib.mjs';
const a = await abrir();
const { p, esperar } = a;
await p.addStyleTag({ content: `
  #p-compras > .encabezado, #p-compras > .seccion:not(#s-c-plan){display:none!important}
  #c-urgencia, #pag-compras{display:none!important}
  #c-kpis{grid-template-columns:1fr 1fr!important;max-width:900px}
  #c-kpis > :nth-child(n+3){display:none!important}
  #c-kpis > *{transition:transform .7s ease, box-shadow .7s ease, border-color .7s ease!important}` });
await a.js(() => { ir('compras'); document.querySelector('.contenido').style.opacity = 0; }); await esperar(1200);
const T = '#tb-compras';
await a.cam(['#c-kpis', `${T} tbody tr:nth-child(3)`], { pad: 22, ms: 0 });
await grabar(a, process.argv[2], async () => {
  // 0 a 4: órdenes para emitir ya y la inversión de los próximos 30 días.
  await a.fundido(true, false);
  await a.cursorA('#c-kpis > :nth-child(2)', { fy: 0.5, ms: 900 });
  await a.cursorA('#c-kpis > :nth-child(1)', { fy: 0.5, ms: 800, curva: -0.1 });
  await a.cam('#c-kpis > :nth-child(1)', { pad: 40, ms: 1000 });
  await esperar(1500);
  // 4 a 9: la tabla con la fecha de quiebre y la fecha en que hay que emitir.
  await a.cam([`${T} thead`, `${T} tbody tr:nth-child(5)`], { pad: 20, ms: 1000, espera: false });
  await esperar(600);
  await a.cursorA(`${T} tbody tr:nth-child(1) td:nth-child(1)`, { fx: 0.3, ms: 800 });
  await a.cursorA(`${T} tbody tr:nth-child(1) td:nth-last-child(4)`, { ms: 1500, curva: 0.02 });
  await esperar(400);
  // 9 a 13: la etiqueta «Comprar ya», sin clic, y el aviso del agente.
  await a.cam([`${T} tbody tr:nth-child(1) td:nth-last-child(6)`, `${T} tbody tr:nth-child(3) td:nth-last-child(3)`], { pad: 34, ms: 1000 });
  await a.cursorA(`${T} tbody tr:nth-child(1) .pill`, { fy: 0.7, ms: 800 });
  await esperar(700);
  await a.aviso({ tema: 'Compras', texto: 'Hay <strong>24 órdenes para emitir</strong> ahora. Ordené la propuesta por fecha de quiebre. Su equipo decide cuáles se emiten.', botones: ['Revisar propuesta', 'Más tarde'] });
  await esperar(3300);
  a.avisoFuera(300);
  await a.fundido(false);
});
await a.b.close();
