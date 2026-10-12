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
  #fuentes{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:99980;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:22px;width:980px;
    background:#0F1417;color:#fff;border-radius:22px;padding:28px 38px;font-family:var(--fuente);box-shadow:0 30px 70px -20px rgba(16,24,40,.5)}
  #fuentes i{width:18px;height:18px;border-radius:50%;background:#20C2BC;box-shadow:0 0 0 8px rgba(32,194,188,.22)}
  #fuentes b{display:block;font-size:34px;font-weight:720;letter-spacing:-.01em}
  #fuentes span{display:block;font-size:22px;color:#A9B4BD;margin-top:4px}
  #fuentes ul{grid-column:1 / -1;list-style:none;margin:14px 0 0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
  #fuentes li{background:#fff;border-radius:16px;padding:20px 10px 14px;text-align:center}
  #fuentes li img{height:54px;width:54px;object-fit:contain;display:block;margin:0 auto 10px}
  #fuentes li em{font-style:normal;font-size:19px;font-weight:650;color:#1D2939}` });
await a.js(() => { ir('cobranza'); document.querySelector('.contenido').style.opacity = 0; }); await esperar(1200);
// Logos de las fuentes conectadas (Simón, 12-oct-2026: «quiero los logos de las empresas, eso impacta»).
const LOGOS = [{ n: 'ERP SAP', src: 'data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+U0FQPC90aXRsZT48cGF0aCBkPSJNMCA2LjA2NHYxMS44NzJoMTIuMTNMMjQgNi4wNjR6bTMuMjY0IDIuMjA4aC4wMDVjLjg2My4wMDEgMS45MTUuMjQ1IDIuNjc2LjYzM2wtLjgyIDEuNDNjLS44MzUtLjQwNC0xLjI1NS0uNDQyLTEuNzMtLjQ2Ny0uNzA4LS4wMzgtMS4wNjQuMjE1LTEuMDY5LjQ4OC0uMDA3LjMzMi42NjkuNjMzIDEuMzA1LjgzOC45NjQuMzA2IDIuMTkuNzE1IDIuMzc3IDEuOUw3Ljc3IDguNDM3aDIuMDQ2bDIuMDY0IDUuNTc2LS4wMDctNS41NzVoMi4zN2MyLjI1NyAwIDMuMzE4Ljc2NCAzLjMxOCAyLjUxOSAwIDEuNTc1LTEuMDkgMi41MTQtMi45MzYgMi41MTRoLS43NjNsLS4wMSAyLjA5NC0zLjU4OC0uMDAzLS4yNS0uOTA4Yy0uMzcuMTIyLS43ODcuMTg5LTEuMjMuMTg5LS40NTYgMC0uODg1LS4wNzEtMS4yNjMtLjJsLS4zNTguOTE5LTIgLjAwNi4wOS0uNDYyYy0uMDI5LjAyNS0uMDU3LjA1LS4wODcuMDc0LS41MzUuNDMtMS4yMDguNjI5LTIuMDM3LjY0NGwtLjIxMy4wMDJhNS4wNzUgNS4wNzUgMCAwIDEtMi41ODEtLjY3NWwuNzMtMS40NDhjLjc5LjQ2NyAxLjI4Ni41NzIgMS45NTYuNTU4LjM0Ny0uMDA3LjU5OC0uMDcuNzYxLS4yMzlhLjU1Ny41NTcgMCAwIDAgLjE1Ni0uMzY5Yy4wMDctLjM3Ni0uNTMtLjU1My0xLjE4NS0uNzU2LS41MzEtLjE2NC0xLjEzNS0uMzg5LTEuNjA2LS43MzUtLjU1OS0uNDEtLjgyNS0uOTI0LS44MTItMS42NWExLjk5IDEuOTkgMCAwIDEgLjU2Ni0xLjM3N2MuNTE5LS41MzcgMS4zNTctLjg2MyAyLjM2My0uODYzem0xMC41OTcgMS42N3YxLjkwNGguNTIxYy42OTQgMCAxLjI0Ny0uMjMgMS4yNDgtLjk2NCAwLS43MDktLjU1NC0uOTQtMS4yNDgtLjk0em0tNS4wODcuNzY3bC0uNzQ4IDIuMzYyYy4yMjMuMDg1LjQ4MS4xMzMuNzU3LjEzMy4yNjggMCAuNTItLjA0Ny43NDItLjEyNmwtLjczNi0yLjM3eiIvPjwvc3ZnPg==' }, { n: 'Odoo', src: 'data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+T2RvbzwvdGl0bGU+PHBhdGggZD0iTTIxLjEwMDIgMTUuNzk1N2MtMS42MDE1IDAtMi44OTk3LTEuMjk4My0yLjg5OTctMi44OTk4czEuMjk4My0yLjg5OTcgMi44OTk3LTIuODk5N2MxLjYwMTUgMCAyLjg5OTggMS4yOTgyIDIuODk5OCAyLjg5OTcgMCAxLjU5OTktMS4yOTc5IDIuODk5OC0yLjg5OTggMi44OTk4em0wLTEuMmMuOTM4OC4wMDA2IDEuNzAwMy0uNzYwMSAxLjcwMDgtMS42OTg5LjAwMDQtLjkzODgtLjc2MDItMS43MDAzLTEuNjk5LTEuNzAwN2gtLjAwMThjLS45Mzg4LjAwMDQtMS42OTk0Ljc2MTktMS42OTkgMS43MDA3LjAwMDUuOTM4MS43NjEgMS42OTg1IDEuNjk5IDEuNjk5em0tNi4wNjU1IDEuMmMtMS42MDE0IDAtMi44OTk3LTEuMjk4My0yLjg5OTctMi44OTk4czEuMjk4My0yLjg5OTcgMi44OTk3LTIuODk5N2MxLjYwMTUgMCAyLjg5OTggMS4yOTgyIDIuODk5OCAyLjg5OTcgMCAxLjU5OTktMS4yOTk5IDIuODk5OC0yLjg5OTggMi44OTk4em0wLTEuMmMuOTM4OS4wMDA2IDEuNzAwMy0uNzYwMSAxLjcwMDgtMS42OTg5LjAwMDUtLjkzODgtLjc2MDItMS43MDAzLTEuNjk5LTEuNzAwN2gtLjAwMThjLS45Mzg4LjAwMDQtMS42OTk0Ljc2MTktMS42OTkgMS43MDA3LjAwMDUuOTM4MS43NjEgMS42OTg1IDEuNjk5IDEuNjk5ek0xMS44NjUgMTIuODU4YzAgMS42MTk5LTEuMjk3OSAyLjkzNzgtMi44OTc3IDIuOTM3OHMtMi44OTk4LTEuMzE0LTIuODk5OC0yLjkzNTggMS4xNzk5LTIuODU5NyAyLjg5OTgtMi44NTk3Yy42MzU5IDAgMS4yMjM5LjEzNCAxLjY5OTguNDg0di0xLjY4YS42LjYgMCAwIDEgMS4yIDB2NC4wNTM3aC0uMDAyem0tMi44OTc3IDEuNzM5OWMuOTM4OC4wMDA1IDEuNzAwMi0uNzYwMiAxLjcwMDctMS42OTkuMDAwNS0uOTM4OC0uNzYwMi0xLjcwMDMtMS42OTktMS43MDA3aC0uMDAxN2MtLjkzODkuMDAwNC0xLjY5OTUuNzYxOS0xLjY5OSAxLjcwMDcuMDAwNC45MzgxLjc2MDggMS42OTg1IDEuNjk5IDEuNjk5em0tNi4wNjc1IDEuMTk3OUMxLjI5ODMgMTUuNzk1NyAwIDE0LjQ5NzQgMCAxMi44OTU5czEuMjk4My0yLjg5OTcgMi44OTk4LTIuODk5NyAyLjg5OTcgMS4yOTgyIDIuODk5NyAyLjg5OTdjMCAxLjU5OTktMS4yOTk5IDIuODk5OC0yLjg5OTcgMi44OTk4em0wLTEuMmMuOTM4OC4wMDA2IDEuNzAwMi0uNzYwMSAxLjcwMDctMS42OTkuMDAwNS0uOTM4Ny0uNzYwMi0xLjcwMDItMS42OTktMS43MDA2aC0uMDAxN2MtLjkzODguMDAwNC0xLjY5OTUuNzYxOS0xLjY5OSAxLjcwMDcuMDAwNC45MzgxLjc2MDggMS42OTg1IDEuNjk5IDEuNjk5eiIvPjwvc3ZnPg==' }, { n: 'Google Sheets', src: 'data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R29vZ2xlIFNoZWV0czwvdGl0bGU+PHBhdGggZD0iTTExLjMxOCAxMi41NDVINy45MXYtMS45MDloMy40MXYxLjkxek0xNC43MjggMHY2aDZsLTYtNnptMS4zNjMgMTAuNjM2aC0zLjQxdjEuOTFoMy40MXYtMS45MXptMCAzLjI3M2gtMy40MXYxLjkxaDMuNDF2LTEuOTF6TTIwLjcyNyA2LjV2MTUuODY0YzAgLjkwNC0uNzMyIDEuNjM2LTEuNjM2IDEuNjM2SDQuOTA5YTEuNjM2IDEuNjM2IDAgMCAxLTEuNjM2LTEuNjM2VjEuNjM2QzMuMjczLjczMiA0LjAwNSAwIDQuOTA5IDBoOS4zMTh2Ni41aDYuNXptLTMuMjczIDIuNzczSDYuNTQ1djcuOTA5aDEwLjkxdi03Ljkxem0tNi4xMzYgNC42MzZINy45MXYxLjkxaDMuNDF2LTEuOTF6Ii8+PC9zdmc+' }, { n: 'Google Ads', src: 'data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R29vZ2xlIEFkczwvdGl0bGU+PHBhdGggZD0iTTMuOTk5OCAyMi45MjkxQzEuNzkwOCAyMi45MjkxIDAgMjEuMTM4MyAwIDE4LjkyOTNzMS43OTA4LTMuOTk5OCAzLjk5OTgtMy45OTk4IDMuOTk5OCAxLjc5MDggMy45OTk4IDMuOTk5OC0xLjc5MDggMy45OTk4LTMuOTk5OCAzLjk5OTh6bTE5LjQ2NDMtNi4wMDA0TDE1LjQ2MzIgMy4wNzJDMTQuMzU4NiAxLjE1ODcgMTEuOTEyMS41MDI4IDkuOTk4OCAxLjYwNzRTNy40Mjk1IDUuMTU4NSA4LjUzNDEgNy4wNzE4bDguMDAwOSAxMy44NTY3YzEuMTA0NiAxLjkxMzMgMy41NTExIDIuNTY3OSA1LjQ2NDQgMS40NjQ2IDEuOTEzNC0xLjEwNDYgMi41NjgtMy41NTExIDEuNDY0Ny01LjQ2NDR6TTcuNTEzNyA0Ljg0MzhMMS41NjQ1IDE1LjE0ODRBNC41IDQuNSAwIDAgMSA0IDE0LjQyOTdjMi41NTk3LS4wMDc1IDQuNjI0OCAyLjE1ODUgNC40OTQxIDQuNzE0OGwzLjIxNjgtNS41NzIzLTMuNjA5NC02LjI1Yy0uNDQ5OS0uNzc5My0uNjMyMi0xLjYzOTQtLjU4NzgtMi40Nzg0eiIvPjwvc3ZnPg==' }, { n: 'Meta', src: 'data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+TWV0YTwvdGl0bGU+PHBhdGggZD0iTTYuOTE1IDQuMDNjLTEuOTY4IDAtMy42ODMgMS4yOC00Ljg3MSAzLjExM0MuNzA0IDkuMjA4IDAgMTEuODgzIDAgMTQuNDQ5YzAgLjcwNi4wNyAxLjM2OS4yMSAxLjk3M2E2LjYyNCA2LjYyNCAwIDAgMCAuMjY1Ljg2IDUuMjk3IDUuMjk3IDAgMCAwIC4zNzEuNzYxYy42OTYgMS4xNTkgMS44MTggMS45MjcgMy41OTMgMS45MjcgMS40OTcgMCAyLjYzMy0uNjcxIDMuOTY1LTIuNDQ0Ljc2LTEuMDEyIDEuMTQ0LTEuNjI2IDIuNjYzLTQuMzJsLjc1Ni0xLjMzOS4xODYtLjMyNWMuMDYxLjEuMTIxLjE5Ni4xODMuM2wyLjE1MiAzLjU5NWMuNzI0IDEuMjEgMS42NjUgMi41NTYgMi40NyAzLjMxNCAxLjA0Ni45ODcgMS45OTIgMS4yMiAzLjA2IDEuMjIgMS4wNzUgMCAxLjg3Ni0uMzU1IDIuNDU1LS44NDNhMy43NDMgMy43NDMgMCAwIDAgLjgxLS45NzNjLjU0Mi0uOTM5Ljg2MS0yLjEyNy44NjEtMy43NDUgMC0yLjcyLS42ODEtNS4zNTctMi4wODQtNy40NS0xLjI4Mi0xLjkxMi0yLjk1Ny0yLjkzLTQuNzE2LTIuOTMtMS4wNDcgMC0yLjA4OC40NjctMy4wNTMgMS4zMDgtLjY1Mi41Ny0xLjI1NyAxLjI5LTEuODIgMi4wNS0uNjktLjg3NS0xLjMzNS0xLjU0Ny0xLjk1OC0yLjA1Ni0xLjE4Mi0uOTY2LTIuMzE1LTEuMzAzLTMuNDU0LTEuMzAzem0xMC4xNiAyLjA1M2MxLjE0NyAwIDIuMTg4Ljc1OCAyLjk5MiAxLjk5OSAxLjEzMiAxLjc0OCAxLjY0NyA0LjE5NSAxLjY0NyA2LjQgMCAxLjU0OC0uMzY4IDIuOS0xLjgzOSAyLjktLjU4IDAtMS4wMjctLjIzLTEuNjY0LTEuMDA0LS40OTYtLjYwMS0xLjM0My0xLjg3OC0yLjgzMi00LjM1OGwtLjYxNy0xLjAyOGE0NC45MDggNDQuOTA4IDAgMCAwLTEuMjU1LTEuOThjLjA3LS4xMDkuMTQxLS4yMjQuMjExLS4zMjcgMS4xMi0xLjY2NyAyLjExOC0yLjYwMiAzLjM1OC0yLjYwMnptLTEwLjIwMS41NTNjMS4yNjUgMCAyLjA1OC43OTEgMi42NzUgMS40NDYuMzA3LjMyNy43MzcuODcxIDEuMjM0IDEuNTc5bC0xLjAyIDEuNTY2Yy0uNzU3IDEuMTYzLTEuODgyIDMuMDE3LTIuODM3IDQuMzM4LTEuMTkxIDEuNjQ5LTEuODEgMS44MTctMi40ODYgMS44MTctLjUyNCAwLTEuMDM4LS4yMzctMS4zODMtLjc5NC0uMjYzLS40MjYtLjQ2NC0xLjEzLS40NjQtMi4wNDYgMC0yLjIyMS42My00LjUzNSAxLjY2LTYuMDg4LjQ1NC0uNjg3Ljk2NC0xLjIyNiAxLjUzMy0xLjUzM2EyLjI2NCAyLjI2NCAwIDAgMSAxLjA4OC0uMjg1eiIvPjwvc3ZnPg==' }];
await a.js((LOGOS) => {
  // El indicador de la barra lateral, llevado al centro: es lo único de ella que entra al video.
  const f = document.createElement('div'); f.id = 'fuentes';
  f.innerHTML = `<i></i><div><b>${document.querySelector('#sincro-txt').textContent}</b><span>${document.querySelector('#sincro-sub').textContent}</span></div><ul>${LOGOS.map((l) => `<li><img src="${l.src}" alt=""><em>${l.n}</em></li>`).join('')}</ul>`;
  document.body.appendChild(f);
  window.fuentesSale = (e) => { f.style.opacity = 1 - e; f.style.transform = `translate(-50%,-50%) scale(${1 - 0.08 * e})`; };
  // Los logos se encienden de a uno.
  window.logosEntran = (e) => f.querySelectorAll('li').forEach((li, k) => { const t = Math.max(0, Math.min(1, e * 5 - k * 0.8)); li.style.opacity = t; li.style.transform = `translateY(${(1 - t) * 14}px)`; });
  window.logosEntran(0);
}, LOGOS);
await a.cam(['#cb-kpis', '#ch-cb-tramos'], { pad: 24, ms: 0 });
const T = '#tb-cb-clientes';
await grabar(a, process.argv[2], async () => {
  // 0 a 3: las fuentes conectadas y la hora de la última carga.
  a.anima('logosEntran', 1500);
  await esperar(3000);
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
  await a.aviso({ tema: 'Cobranza', texto: 'Hay <strong>301 facturas vencidas</strong> por $743.384.537. Dejé listos los recordatorios de cobro para su aprobación.', botones: ['Revisar propuesta', 'Más tarde'] });
  await esperar(3300);
  a.avisoFuera(300);
  await a.fundido(false);
});
await a.b.close();
