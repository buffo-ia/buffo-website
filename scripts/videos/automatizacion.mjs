// Video de Automatización: «La cartera por cobrar, actualizada cada mañana sin planillas.»
// Guion de Comercial: S-Lab/Buffo Consulting/Sitio 2.0/GUIONES_videos_borrador.md
// Uso: node scripts/videos/automatizacion.mjs /ruta/de/salida/nombre
import { abrir, grabar } from './lib.mjs';
const a = await abrir();
const { p, esperar } = a;
// Fuera de cuadro: días de venta en la calle, mora sobre 60 días y el gráfico de
// días de cobro (la simulación los deja raros; acordado con Comercial).
await p.addStyleTag({ content: `
  #p-cobranza > .encabezado, #p-cobranza > .seccion:not(#s-cb-resumen):not(#s-cb-antiguedad){display:none!important}
  #cb-kpis > :nth-child(n+3), .tarjeta:has(#ch-cb-dso){display:none!important}
  #cb-kpis{grid-template-columns:1fr 1fr!important}
  #s-cb-resumen .rej:has(#ch-cb-tramos){grid-template-columns:1fr!important}
  #p-cobranza{max-width:900px}
  #s-cb-antiguedad{margin-top:300px}
  #s-cb-antiguedad .seccion-tit, #pag-cb-cli{display:none}
  #tb-cb-clientes :is(th,td):is(:nth-child(2),:nth-child(5),:nth-child(6),:nth-child(7),:nth-child(10)){display:none}
  #cb-kpis > *{transition:transform .7s ease, box-shadow .7s ease, border-color .7s ease!important}
  #fuentes{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:99980;display:flex;align-items:center;gap:22px;
    background:#0F1417;color:#fff;border-radius:22px;padding:28px 38px;font-family:var(--fuente);box-shadow:0 30px 70px -20px rgba(16,24,40,.5)}
  #fuentes i{width:18px;height:18px;border-radius:50%;background:#20C2BC;box-shadow:0 0 0 8px rgba(32,194,188,.22)}
  #fuentes b{display:block;font-size:34px;font-weight:720;letter-spacing:-.01em}
  #fuentes span{display:block;font-size:22px;color:#A9B4BD;margin-top:4px}` });
await a.js(() => { ir('cobranza'); document.querySelector('.contenido').style.opacity = 0; }); await esperar(1200);
await a.js(() => {
  // El indicador de la barra lateral, llevado al centro: es lo único de ella que entra al video.
  const f = document.createElement('div'); f.id = 'fuentes';
  f.innerHTML = `<i></i><div><b>${document.querySelector('#sincro-txt').textContent}</b><span>${document.querySelector('#sincro-sub').textContent}</span></div>`;
  document.body.appendChild(f);
  window.fuentesSale = (e) => { f.style.opacity = 1 - e; f.style.transform = `translate(-50%,-50%) scale(${1 - 0.08 * e})`; };
});
await a.cam(['#cb-kpis', '#ch-cb-tramos'], { pad: 24, ms: 0 });
const T = '#tb-cb-clientes';
await grabar(a, process.argv[2], async () => {
  // 0 a 3: las fuentes conectadas y la hora de la última carga.
  await esperar(2200);
  a.anima('fuentesSale', 400);
  await a.fundido(true);
  // 3 a 7: cartera por cobrar, vencido y el gráfico por tramo.
  await a.cursorA('#cb-kpis > :nth-child(1)', { fy: 0.5, ms: 800 });
  await a.cursorA('#cb-kpis > :nth-child(2)', { fy: 0.5, ms: 800, curva: -0.1 });
  await esperar(500);
  await a.cursorA('#ch-cb-tramos', { fx: 0.36, fy: 0.62, ms: 1000 });
  await esperar(1100);
  // 7 a 11: la deuda por cliente.
  await a.fundido(false);
  await a.cam([`${T} thead`, `${T} tbody tr:nth-child(6)`], { pad: 22, ms: 0 });
  await a.fundido(true, false);
  await a.cursorA(`${T} tbody tr:nth-child(1) td:nth-child(8)`, { ms: 800 });
  for (const f of [3, 5]) await a.cursorA(`${T} tbody tr:nth-child(${f}) td:nth-child(8)`, { ms: 650, curva: 0.05 });
  await esperar(300);
  // 11 a 15: el botón Cobrar, sin clic, y el aviso del agente.
  await a.cam([`${T} tbody tr:nth-child(1) td:nth-child(8)`, `${T} tbody tr:nth-child(3) td:last-child`], { pad: 34, ms: 1000 });
  await a.cursorA(`${T} tbody tr:nth-child(1) td:last-child .btn`, { fy: 0.6, ms: 800 });
  await esperar(700);
  await a.aviso({ tema: 'Cobranza', texto: 'Hay <strong>137 facturas vencidas</strong> por $229.140.647. Dejé listos los recordatorios de cobro para su aprobación.', botones: ['Revisar propuesta', 'Más tarde'] });
  await esperar(3300);
  a.avisoFuera(300);
  await a.fundido(false);
});
await a.b.close();
