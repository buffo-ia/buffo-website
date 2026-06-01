// Función serverless (Vercel) para el formulario de contacto.
// Envía 2 correos vía Resend reutilizando el dominio raíz verificado buffoconsulting.cl:
//   1. Notificación interna a Buffo con los datos del lead.
//   2. Confirmación al visitante ("gracias, te responderemos").
// No usa la librería resend: la API HTTP + fetch nativo de Node alcanzan.

const CONFIG = {
  contactEmail: 'contacto@buffoconsulting.cl',
  fromName: 'Buffo Consulting',
  fromEmail: 'contacto@buffoconsulting.cl', // dominio raíz verificado en Resend
  siteName: 'Buffo Consulting',
  siteUrl: 'https://buffoconsulting.cl',
};

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const MAX = { name: 120, email: 160, company: 160, message: 4000 };

const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  // Fallback: leer el stream manualmente
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return {}; }
}

async function sendEmail(apiKey, payload) {
  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend ${res.status}: ${detail}`);
  }
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY no configurada');
    return res.status(500).json({ success: false, error: 'Servidor no configurado' });
  }

  const body = await readBody(req);

  // Honeypot anti-spam: si viene relleno, fingimos éxito y descartamos.
  if (body.botcheck) return res.status(200).json({ success: true });

  const name = (body.name || '').toString().trim().slice(0, MAX.name);
  const email = (body.email || '').toString().trim().slice(0, MAX.email);
  const company = (body.company || '').toString().trim().slice(0, MAX.company);
  const message = (body.message || '').toString().trim().slice(0, MAX.message);

  if (!name || !isEmail(email) || !message) {
    return res.status(400).json({ success: false, error: 'Faltan datos o el email es inválido.' });
  }

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    company: escapeHtml(company) || '—',
    message: escapeHtml(message).replace(/\n/g, '<br>'),
  };

  // 1. Notificación interna a Buffo
  const notify = {
    from: `${CONFIG.fromName} <${CONFIG.fromEmail}>`,
    to: [CONFIG.contactEmail],
    reply_to: email,
    subject: `Nuevo contacto desde el sitio: ${name}`,
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0D0E10;max-width:560px;margin:0 auto;">
        <h2 style="margin:0 0 16px;font-size:18px;">Nuevo mensaje desde buffoconsulting.cl</h2>
        <p style="margin:4px 0;"><strong>Nombre:</strong> ${safe.name}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>
        <p style="margin:4px 0;"><strong>Empresa:</strong> ${safe.company}</p>
        <p style="margin:16px 0 4px;"><strong>Mensaje:</strong></p>
        <div style="background:#f5f5f5;padding:14px;border-radius:6px;line-height:1.6;">${safe.message}</div>
      </div>`,
  };

  // 2. Confirmación al visitante
  const confirm = {
    from: `${CONFIG.fromName} <${CONFIG.fromEmail}>`,
    to: [email],
    reply_to: CONFIG.contactEmail,
    subject: 'Recibimos tu mensaje — Buffo Consulting',
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0D0E10;max-width:560px;margin:0 auto;">
        <h2 style="margin:0 0 16px;font-size:18px;">¡Gracias por escribirnos, ${safe.name}!</h2>
        <p style="line-height:1.6;margin:0 0 14px;">
          Recibimos tu mensaje y te responderemos a la brevedad. En Buffo Consulting
          aplicamos inteligencia artificial a la gestión de tu empresa.
        </p>
        <p style="line-height:1.6;margin:0 0 14px;">Para referencia, esto fue lo que nos enviaste:</p>
        <div style="background:#f5f5f5;padding:14px;border-radius:6px;line-height:1.6;">${safe.message}</div>
        <p style="line-height:1.6;margin:18px 0 4px;">
          Si quieres adelantar la conversación, puedes
          <a href="${CONFIG.siteUrl}/contacto" style="color:#16B66B;">agendar una llamada</a>.
        </p>
        <p style="line-height:1.6;margin:14px 0 0;color:#666;font-size:13px;">— Equipo Buffo Consulting</p>
      </div>`,
  };

  try {
    // La notificación interna es la crítica; la confirmación es best-effort.
    await sendEmail(apiKey, notify);
    try {
      await sendEmail(apiKey, confirm);
    } catch (err) {
      console.error('Confirmación al visitante falló (no crítico):', err.message);
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Envío de notificación falló:', err.message);
    return res.status(502).json({ success: false, error: 'No se pudo enviar el mensaje.' });
  }
}
