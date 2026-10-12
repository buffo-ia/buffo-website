// Video de la portada de Agentes: el agente avisa en la plataforma y también por
// mensaje en el teléfono; una persona aprueba. (Simón, 12-oct-2026: «uno que te
// hable en la plataforma y además en tu celular por WhatsApp».)
// Uso: node scripts/videos/agentes-portada.mjs /ruta/de/salida/nombre
import { abrir, grabar } from './lib.mjs';
const a = await abrir();
const { p, esperar } = a;
const CHAT = [
  { de: 'agente', t: 'Alerta de margen: su cliente de mayor venta deja <b>8,3%</b>, bajo el promedio de 9,7%.' },
  { de: 'persona', t: 'Ver detalle' },
  { de: 'agente', t: 'Venta del año: $1.100.770.796. Descuento otorgado: 7,0%. Preparé una revisión de los descuentos de ese cliente. ¿La envío al gerente comercial?' },
  { de: 'persona', t: 'Aprobado' },
  { de: 'agente', t: 'Enviada. Quedó registrada con su aprobación.' },
];
await p.addStyleTag({ content: `
  #p-ventas > .encabezado, #v-filtros, #p-ventas > .seccion:not(#s-v-resumen){display:none!important}
  #v-kpis{max-width:820px}
  #v-kpis > *{transition:transform .7s ease, box-shadow .7s ease, border-color .7s ease!important}
  #fono{position:fixed;right:70px;top:34px;width:500px;height:720px;z-index:99992;opacity:0;border:12px solid #0B0F12;border-bottom:0;border-radius:54px 54px 0 0;
    background:#ECE5DD;overflow:hidden;font-family:var(--fuente);box-shadow:0 40px 80px -24px rgba(16,24,40,.55);display:flex;flex-direction:column}
  #fono .f-cab{background:#0B5D54;color:#fff;display:flex;align-items:center;gap:14px;padding:26px 22px 16px}
  #fono .f-cab i{width:50px;height:50px;border-radius:50%;background:#0B0F12;display:grid;place-items:center;flex:0 0 50px}
  #fono .f-cab img{width:32px;height:32px;object-fit:contain}
  #fono .f-cab b{font-size:23px;font-weight:700;display:block}
  #fono .f-cab span{font-size:16px;opacity:.8}
  #fono .f-msj{flex:1;padding:18px 16px;display:flex;flex-direction:column;gap:12px;justify-content:flex-start}
  #fono .m{max-width:86%;padding:12px 16px;border-radius:16px;font-size:21px;line-height:1.32;color:#111B21;box-shadow:0 1px 1px rgba(0,0,0,.12);opacity:0}
  #fono .m.agente{background:#fff;align-self:flex-start;border-top-left-radius:4px}
  #fono .m.persona{background:#D9FDD3;align-self:flex-end;border-top-right-radius:4px;font-weight:600}` });
await a.js(() => { ir('ventas'); document.querySelector('.contenido').style.opacity = 0; }); await esperar(900);
await a.js((CHAT) => {
  const f = document.createElement('div'); f.id = 'fono';
  f.innerHTML = `<div class="f-cab"><i><img src="${MARCA.colibri}" alt=""></i><div><b>Agente Buffo</b><span>en línea</span></div></div><div class="f-msj">${CHAT.map((m) => `<div class="m ${m.de}">${m.t}</div>`).join('')}</div>`;
  document.body.appendChild(f);
  const av = document.querySelector('#aviso'), velo = document.querySelector('#velo');
  // El aviso se corre a la izquierda y entra el teléfono.
  window.reparte = (e) => { av.style.marginLeft = (-330 - 300 * e) + 'px'; av.style.transform = `scale(${1 - 0.1 * e})`; f.style.opacity = e; f.style.transform = `translateY(${(1 - e) * 60}px)`; };
  window.todoSale = (e) => { av.style.opacity = 1 - e; f.style.opacity = 1 - e; velo.style.opacity = 1 - e; };
  const ms = [...f.querySelectorAll('.m')];
  for (let k = 0; k < ms.length; k++) window['msj' + k] = (e) => { ms[k].style.opacity = e; ms[k].style.transform = `translateY(${(1 - e) * 16}px)`; };
}, CHAT);
await a.cam('#v-kpis', { pad: 30, ms: 0 });
await grabar(a, process.argv[2], async () => {
  await a.fundido(true, false);
  await a.cursorA('#v-kpis > :nth-child(1)', { fy: 0.42, ms: 800 });
  await a.cursorA('#v-kpis > :nth-child(2)', { fy: 0.45, ms: 700, curva: -0.12 });
  await esperar(300);
  // El agente avisa en la plataforma.
  await a.aviso({ tema: 'Alerta de margen', texto: 'Su cliente de mayor venta deja <strong>8,3% de margen</strong>, bajo el promedio de 9,7%.', botones: ['Revisar propuesta', 'Más tarde'] });
  await esperar(2300);
  // Y el mismo aviso llega al teléfono.
  a.anima('reparte', 700); await esperar(1000);
  const pausas = [1700, 1100, 2900, 1100, 2400];
  for (let k = 0; k < pausas.length; k++) { a.anima('msj' + k, 300); await esperar(pausas[k]); }
  a.anima('todoSale', 320);
  await a.fundido(false);
});
await a.b.close();
