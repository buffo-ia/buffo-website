// Función serverless del diagnóstico de 3 minutos.
//
// Flujo: valida -> limita por IP -> transmite el análisis de Claude en vivo al
// navegador -> guarda el lead y el costo real en Supabase -> despacha 2 correos.
//
// El análisis se TRANSMITE (no se espera): el prospecto ve el texto aparecer
// mientras se genera. Eso elimina la espera muerta de ~25 s y evita que la
// función muera por tiempo de espera, que era el riesgo técnico real.
//
// El modelo devuelve texto plano con marcadores "### seccion", no JSON. Es lo
// único que se puede renderizar progresivamente, y si el modelo se desvía del
// formato el front igual muestra el texto en vez de reventar.

import Anthropic from '@anthropic-ai/sdk';
import { createHash } from 'node:crypto';

export const maxDuration = 60;

const CONFIG = {
  // Sonnet 5: la mitad del costo de Opus 5 y ~20 s más rápido, que importa
  // contra el techo de 60 s de Vercel. El análisis queda un escalón por debajo
  // (más notorio en "lo que más nos llama la atención" y en "los límites").
  // Para volver a Opus: cambiar esta línea y el precio de abajo.
  modelo: 'claude-sonnet-5',
  esfuerzo: 'medium', // sube a 'high' si el análisis queda flojo; cuesta más salida
  maxTokens: 8000,
  // Precio por millón de tokens. Sonnet 5 está a precio de introducción
  // ($2/$10) hasta el 2026-08-31; después queda en $3/$15.
  precio: { entrada: 3, salida: 15 },
  limitePorIpEn24h: 3,
  contacto: 'contacto@buffoconsulting.cl',
  remitente: 'Buffo Consulting <contacto@buffoconsulting.cl>',
  sitio: 'https://buffoconsulting.cl',
  calendly: 'https://calendly.com/simon-buffoconsulting/llamada-de-consulta-buffo-ia',
};

// Un BOM invisible al inicio de una env var revienta fetch al armar cabeceras
// HTTP. PowerShell lo mete solo y es invisible en el panel de Vercel; tumbó la
// narrativa de Pulso cinco semanas en silencio. Nunca leer process.env directo.
const env = (nombre) =>
  (process.env[nombre] || '').replace(/^﻿/, '').trim();

const MAX = { nombre: 120, empresa: 160, email: 160, telefono: 40, abierta: 1500 };
const esEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const recortar = (v, n) => String(v ?? '').trim().slice(0, n);

const escaparHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );

async function leerCuerpo(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  const partes = [];
  for await (const parte of req) partes.push(parte);
  if (!partes.length) return {};
  try { return JSON.parse(Buffer.concat(partes).toString('utf8')); } catch { return {}; }
}

const hashIp = (req) => {
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'desconocida';
  return createHash('sha256').update(ip).digest('hex').slice(0, 32);
};

// --- Supabase por API REST: no vale la pena la librería para 3 llamadas ---

async function supabase(ruta, opciones = {}) {
  const url = env('SUPABASE_URL');
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return null;
  const res = await fetch(`${url}/rest/v1/${ruta}`, {
    ...opciones,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...opciones.headers,
    },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text().catch(() => '')}`);
  return res.status === 204 ? null : res.json();
}

async function superaLimite(ipHash) {
  try {
    const n = await supabase('rpc/diagnosticos_recientes_por_ip', {
      method: 'POST',
      body: JSON.stringify({ p_ip_hash: ipHash }),
    });
    return typeof n === 'number' && n >= CONFIG.limitePorIpEn24h;
  } catch (err) {
    // Si Supabase no responde, no bloqueamos al prospecto: el tope de gasto del
    // workspace de Anthropic sigue siendo el cortafuegos duro.
    console.error('No se pudo verificar el límite por IP:', err.message);
    return false;
  }
}

// --- El prompt: es el producto, no un detalle de implementación ---

const SISTEMA = `Eres el analista senior de Buffo Consulting, una consultora chilena de inteligencia artificial aplicada a la gestión. Escribes el diagnóstico que recibe un ejecutivo después de contestar un cuestionario de doce preguntas sobre su operación.

QUIÉN TE LEE
Un dueño o gerente de una empresa mediana chilena. Sabe de su negocio, no de tecnología. Nunca ha oído hablar de ETL, data warehouse, pipelines ni APIs, y no le interesan. Le interesa saber qué le está costando plata y qué se puede hacer.

CÓMO ESCRIBES
- Español de Chile, tratando de "usted". Prosa, no viñetas sueltas.
- Lenguaje de negocio. Si necesitas nombrar algo técnico, explícalo en la misma frase.
- Directo y específico. Cita las respuestas que dio: "usted dijo que el margen lo tiene en días" pesa mil veces más que "se detectan oportunidades de mejora".
- Sin adulación, sin relleno, sin "en el mundo actual de los negocios".

REGLA DURA SOBRE LAS CIFRAS
No inventes números. Nunca digas "ahorraría un 70%" ni "USD 15.000 al año" si eso no sale de lo que él respondió. Una cifra inventada destruye la credibilidad del diagnóstico completo, que es lo único que tenemos.

Sí puedes hacer aritmética sobre lo que él mismo declaró, diciendo de dónde sale. Si dijo "entre 20 y 40 horas al mes", multiplicar por doce y decir "entre 240 y 480 horas al año, según lo que usted declaró" no es inventar: es su propio dato mirado de otra forma, y suele ser la parte del diagnóstico que más impresiona. Hazlo siempre que haya un número declarado con el cual trabajar.

QUÉ VENDE BUFFO (no lo nombres como catálogo, oriéntate con esto)
Dashboards ejecutivos, modelamiento de datos, automatización de procesos y agentes que vigilan y actúan solos. Todo a medida, no licencias de software de terceros.

DÓNDE SE LEE CADA COSA
En pantalla se muestran SOLO los titulares. Todo lo demás vive en el PDF que él descarga. Escribe los titulares sabiendo que son el anzuelo: son lo único que va a leer antes de decidir si abre el documento.

FORMATO DE SALIDA
Devuelve texto plano con estos marcadores exactos, cada uno en su propia línea, en este orden. Sin markdown, sin negritas, sin viñetas, sin numerar.

### titulares
Cuatro o cinco líneas, cada una empezando con "- ". Una frase por línea, corta y concreta, con lo más importante que saltó de sus respuestas. Cada una tiene que citar algo que él respondió, no ser genérica. Sin repetir la misma idea dos veces. Es lo único que se ve en pantalla: si no dan ganas de abrir el informe, no sirven.

### resumen
Dos o tres frases. El patrón de fondo que se ve en sus respuestas, y el giro: casi siempre el problema no es falta de tecnología nueva sino que la información que ya tienen no llega a tiempo ni se puede confiar en ella.

### hallazgo
VAN TRES BLOQUES "### hallazgo" SEPARADOS, no uno solo. Tres marcadores, tres hallazgos distintos, ordenados del más grave al menos grave. Cada uno con estos cuatro campos:
titulo: (una frase corta y concreta)
vemos: (qué respondió él que revela esto, citándolo)
resolvemos: (cómo se ataca, en lenguaje de negocio)
beneficio: (qué cambia en su día a día)

Antes de seguir a la sección siguiente, cuenta: tienen que haber salido tres "### hallazgo".

### horas
Un párrafo corto sobre el costo del trabajo repetitivo, anclado en las horas que él declaró y llevadas al año. Di explícitamente de dónde sale ("según lo que usted declaró"). Cierra señalando qué haría ese equipo con ese tiempo de vuelta, usando lo que él respondió.

NO conviertas las horas a pesos ni menciones sueldos: debajo de tu párrafo el informe agrega un cuadro que hace esa conversión con el sueldo mínimo vigente. Si tú también la haces, los dos números se contradicen. Habla de horas y de qué se deja de hacer por falta de tiempo.

Y no presentes las horas como si fueran el problema principal. Casi nunca lo son: lo caro es lo que se decide mal con información que llega tarde. Las horas son la parte visible y contable; el resto no se puede cuantificar con doce respuestas pero pesa mucho más. Deja eso dicho.

### vistazo
Una frase de entrada: qué tendría delante cada mañana si esto estuviera resuelto.
Después exactamente cuatro líneas con este formato, sin numerar:
tarjeta: Nombre corto del indicador :: Qué muestra y para qué sirve, en una frase
Los cuatro indicadores tienen que salir de SU negocio y de lo que él pidió, no de una lista genérica. No pongas cifras: se renderizan como ejemplo ilustrativo.

### atencion
Un párrafo. Lo que más te llama la atención: la contradicción, el riesgo silencioso o el dato que quizás él no notó al contestar. Si eligió un dolor pero sus respuestas apuntan a otro más grave, dilo acá. Es la parte que hace que quiera conversar.

### limites
Un párrafo honesto sobre lo que NO se puede afirmar con doce preguntas y qué habría que mirar de verdad. Sin falsa modestia y sin sonar a venta. Esta sección es la que justifica la llamada.

### propuesta
Dos o tres frases: por qué el frente de trabajo que le corresponde es el indicado para ESTA empresa, amarrado a lo que él respondió. Habla del cambio concreto en su operación, no de tecnología.

NO inventes plazos, precios, porcentajes de ahorro ni nombres de producto. Debajo de tu párrafo el informe agrega el detalle de qué incluye y en cuántas semanas, que es información fija de la empresa. Tú solo escribes el porqué.

### pasos
Tres líneas, sin numerar, con este formato:
paso: Qué se hace :: En una frase, qué sale de ahí
El primero tiene que ser la conversación de treinta minutos. Los otros dos, lo que vendría después en su caso concreto.`;

function armarPrompt(d) {
  const linea = (r) => `- ${r.pregunta}\n  Respondió: ${r.respuesta}`;
  const tronco = d.respuestas.filter((r) => r.bloque === 'tronco').map(linea).join('\n');
  const ramal = d.respuestas.filter((r) => r.bloque === 'ramal').map(linea).join('\n');

  return `Empresa: ${d.empresa || 'no la declaró'}
Contacto: ${d.nombre}
Puntaje de visibilidad: ${d.puntaje.tronco} de 100
Dolor que eligió: ${d.ramal.dolor}
Frente de trabajo que le corresponde (uso interno, no lo nombres como producto): ${d.ramal.servicio}

SOBRE SU OPERACIÓN EN GENERAL
${tronco}

SOBRE EL DOLOR QUE ELIGIÓ
${ramal}

LO QUE PIDIÓ RESOLVER SI PUDIERA ELEGIR UNA SOLA COSA
${d.abierta || 'No contestó esta pregunta.'}

Escribe el diagnóstico.`;
}

// --- Correos ---

async function enviarCorreo(payload) {
  const key = env('RESEND_API_KEY');
  if (!key) throw new Error('RESEND_API_KEY no configurada');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text().catch(() => '')}`);
  return res.json();
}

function correoAlProspecto(d, texto) {
  const secciones = texto.split(/^### /m).filter(Boolean);
  const cuerpo = secciones
    .map((s) => {
      const salto = s.indexOf('\n');
      const nombre = s.slice(0, salto).trim();
      const contenido = escaparHtml(s.slice(salto + 1).trim()).replace(/\n/g, '<br>');
      const rotulos = {
        titulares: 'Lo que salta a la vista',
        resumen: 'Resumen',
        hallazgo: 'Lo que detectamos',
        horas: 'Lo que cuesta el trabajo repetitivo',
        vistazo: 'Cómo se vería su información',
        propuesta: 'Lo que proponemos',
        atencion: 'Lo que más nos llama la atención',
        limites: 'Lo que no podemos decirle sin conocerlos mejor',
        pasos: 'Próximos pasos',
      };
      return `<h3 style="margin:28px 0 8px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#16B66B;">${rotulos[nombre] || nombre}</h3>
              <div style="line-height:1.65;color:#333;">${contenido}</div>`;
    })
    .join('');

  return {
    from: CONFIG.remitente,
    to: [d.email],
    reply_to: CONFIG.contacto,
    subject: `Su diagnóstico — ${d.empresa || d.nombre}`,
    html: `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:620px;margin:0 auto;color:#0D0E10;">
      <p style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#16B66B;margin:0;">Diagnóstico</p>
      <h2 style="margin:8px 0 4px;font-size:24px;">${escaparHtml(d.empresa || d.nombre)}</h2>
      <p style="margin:0;color:#666;">Visibilidad de su operación: <strong>${d.puntaje.tronco} de 100</strong></p>
      ${cuerpo}
      <div style="margin:36px 0 0;padding:24px;border:1px solid #ddd;">
        <p style="margin:0 0 14px;line-height:1.6;">Si quiere revisarlo con nosotros, son treinta minutos y no hay presentación de ventas.</p>
        <a href="${CONFIG.calendly}" style="display:inline-block;background:#16B66B;color:#000;padding:12px 24px;text-decoration:none;font-weight:600;">Agendar una conversación</a>
      </div>
      <p style="margin:24px 0 0;font-size:13px;color:#888;">— Equipo Buffo Consulting · ${CONFIG.sitio}</p>
    </div>`,
  };
}

function correoInterno(d, texto, uso) {
  return {
    from: CONFIG.remitente,
    to: [CONFIG.contacto],
    reply_to: d.email,
    subject: `Nuevo diagnóstico: ${d.empresa || d.nombre} (${d.puntaje.tronco}/100)`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:620px;margin:0 auto;">
      <h2 style="font-size:18px;margin:0 0 16px;">Diagnóstico completado</h2>
      <p style="margin:4px 0;"><strong>${escaparHtml(d.nombre)}</strong> — ${escaparHtml(d.empresa || 'sin empresa')}</p>
      <p style="margin:4px 0;"><a href="mailto:${escaparHtml(d.email)}">${escaparHtml(d.email)}</a>${d.telefono ? ` · <a href="tel:${escaparHtml(d.telefono)}">${escaparHtml(d.telefono)}</a>` : ""}</p>
      <p style="margin:4px 0;">Puntaje ${d.puntaje.tronco}/100 · Dolor: ${escaparHtml(d.ramal.dolor)} · Frente: ${escaparHtml(d.ramal.servicio)}</p>
      <p style="margin:16px 0 4px;"><strong>Lo que pidió resolver:</strong></p>
      <div style="background:#f5f5f5;padding:14px;line-height:1.6;">${escaparHtml(d.abierta || '(no contestó)')}</div>
      <p style="margin:16px 0 4px;"><strong>Diagnóstico entregado:</strong></p>
      <pre style="background:#f5f5f5;padding:14px;white-space:pre-wrap;font-family:inherit;line-height:1.6;">${escaparHtml(texto)}</pre>
      <p style="margin:16px 0 0;font-size:12px;color:#888;">${uso.entrada} tokens de entrada · ${uso.salida} de salida · USD ${uso.costo.toFixed(4)}</p>
    </div>`,
  };
}

// --- Handler ---

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const apiKey = env('ANTHROPIC_API_KEY');
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY no configurada');
    return res.status(500).json({ success: false, error: 'Servidor no configurado.' });
  }

  const cuerpo = await leerCuerpo(req);

  // Honeypot: si viene relleno es un bot. Fingimos éxito y no gastamos un token.
  if (cuerpo.botcheck) return res.status(200).json({ success: true });

  const d = {
    nombre: recortar(cuerpo.nombre, MAX.nombre),
    empresa: recortar(cuerpo.empresa, MAX.empresa),
    email: recortar(cuerpo.email, MAX.email),
    telefono: recortar(cuerpo.telefono, MAX.telefono),
    abierta: recortar(cuerpo.abierta, MAX.abierta),
    ramal: cuerpo.ramal || {},
    puntaje: cuerpo.puntaje || {},
    dimensiones: cuerpo.dimensiones || {},
    respuestas: Array.isArray(cuerpo.respuestas) ? cuerpo.respuestas.slice(0, 20) : [],
  };

  if (!d.nombre || !esEmail(d.email) || !d.respuestas.length || !d.ramal.dolor) {
    return res.status(400).json({ success: false, error: 'Faltan datos o el correo es inválido.' });
  }

  const ipHash = hashIp(req);
  if (await superaLimite(ipHash)) {
    return res.status(429).json({
      success: false,
      error: 'Ya generamos varios diagnósticos desde esta conexión hoy. Escríbanos a contacto@buffoconsulting.cl.',
    });
  }

  // El lead se guarda ANTES de llamar al modelo. Generar tarda ~48 s contra un
  // techo de 60 en Vercel: si la función muere a mitad, el prospecto igual vio su
  // texto (va transmitido) pero el lead se perdería. Con la fila ya creada, lo
  // peor que pasa es un diagnóstico incompleto con el contacto intacto.
  let idLead = null;
  try {
    const fila = await supabase('diagnostico_leads', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        nombre: d.nombre,
        empresa: d.empresa || null,
        email: d.email,
        telefono: d.telefono || null,
        ramal: d.ramal.id,
        servicio: d.ramal.servicio,
        puntaje_general: d.puntaje.tronco,
        dimensiones: d.dimensiones,
        respuestas: d.respuestas,
        abierta: d.abierta || null,
        modelo: CONFIG.modelo,
        ip_hash: ipHash,
      }),
    });
    idLead = fila?.[0]?.id ?? null;
  } catch (err) {
    console.error('No se pudo pre-guardar el lead:', err.message);
  }

  // A partir de acá la respuesta es un flujo de texto, no JSON.
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Accel-Buffering', 'no');

  const cliente = new Anthropic({ apiKey });
  let texto = '';
  let uso = { entrada: 0, salida: 0, costo: 0 };

  try {
    const flujo = cliente.beta.messages.stream({
      model: CONFIG.modelo,
      max_tokens: CONFIG.maxTokens,
      output_config: { effort: CONFIG.esfuerzo },
      // Respaldo automático si los clasificadores de seguridad rechazan la
      // petición. Solo existe en la familia Opus; Sonnet lo rechaza con un 400.
      ...(CONFIG.modelo.startsWith('claude-opus')
        ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }
        : {}),
      system: SISTEMA,
      messages: [{ role: 'user', content: armarPrompt(d) }],
    });

    // BetaMessageStream no expone textStream (a diferencia del stream normal):
    // los fragmentos llegan por el evento 'text' y finalMessage() espera el cierre.
    flujo.on('text', (fragmento) => {
      texto += fragmento;
      res.write(fragmento);
    });

    const mensaje = await flujo.finalMessage();

    if (mensaje.stop_reason === 'refusal') {
      console.error('Diagnóstico rechazado por los clasificadores:', mensaje.stop_details);
      if (!texto) res.write('No pudimos generar el diagnóstico automáticamente. Le escribimos a la brevedad.');
    }

    uso = {
      entrada: mensaje.usage.input_tokens,
      salida: mensaje.usage.output_tokens,
      costo:
        (mensaje.usage.input_tokens * CONFIG.precio.entrada +
          mensaje.usage.output_tokens * CONFIG.precio.salida) /
        1_000_000,
    };
  } catch (err) {
    console.error('Falló la generación del diagnóstico:', err.message);
    if (!texto) {
      res.write('__ERROR__No pudimos generar el diagnóstico en este momento. Reintente en un minuto.');
    }
    return res.end();
  }

  // OJO: esto va ANTES de res.end(). En Vercel la función puede congelarse en
  // cuanto la respuesta termina, así que cualquier trabajo posterior se pierde
  // sin aviso — y perder el lead es mucho peor que un segundo más de espera.
  // El prospecto ya tiene todo el texto en pantalla; lo único que se retrasa es
  // que aparezcan los botones del final.
  if (idLead) {
    try {
      await supabase(`diagnostico_leads?id=eq.${idLead}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({
          diagnostico: texto,
          tokens_entrada: uso.entrada,
          tokens_salida: uso.salida,
          costo_usd: Number(uso.costo.toFixed(5)),
        }),
      });
    } catch (err) {
      console.error('No se pudo completar el lead:', err.message);
    }
  }

  // Los dos correos en paralelo: la falla de uno no arrastra al otro.
  const correos = await Promise.allSettled([
    enviarCorreo(correoInterno(d, texto, uso)),
    enviarCorreo(correoAlProspecto(d, texto)),
  ]);
  correos.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`Falló el correo ${i === 0 ? 'interno' : 'al prospecto'}:`, r.reason?.message);
    }
  });

  res.end();
}
