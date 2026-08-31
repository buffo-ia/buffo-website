// Servidor local para las funciones de /api.
//
// `astro dev` no sirve las funciones serverless de Vercel, así que este puente
// levanta las mismas funciones en otro puerto y `astro.config.mjs` le redirige
// /api. Corre el MISMO archivo que va a producción: no hay una copia de la
// lógica que se pueda desincronizar.
//
//   node scripts/dev-api.mjs              -> sin enviar correos (por defecto)
//   node scripts/dev-api.mjs --con-correo -> envía los correos de verdad
//
// Lo levanta `npm run dev` junto con Astro.

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUERTO = Number(process.env.PUERTO_API || 4322);
const conCorreo = process.argv.includes('--con-correo');

// Cargar el .env a mano: no vale la pena una dependencia para esto.
if (existsSync(join(raiz, '.env'))) {
  for (const linea of readFileSync(join(raiz, '.env'), 'utf8').split('\n')) {
    const m = linea.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

if (!conCorreo) {
  delete process.env.RESEND_API_KEY; // la función lo registra y sigue; nadie recibe nada
}

// Adapta el `res` de Node a lo que esperan las funciones de Vercel.
function adaptar(res) {
  res.status = (codigo) => {
    res.statusCode = codigo;
    return res;
  };
  res.json = (dato) => {
    if (!res.headersSent) res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(dato));
    return res;
  };
  return res;
}

const servidor = createServer(async (req, res) => {
  const ruta = new URL(req.url, `http://localhost:${PUERTO}`).pathname;
  const archivo = join(raiz, 'api', `${ruta.replace(/^\/api\//, '')}.js`);

  if (!ruta.startsWith('/api/') || !existsSync(archivo)) {
    res.statusCode = 404;
    return res.end('No existe esa función.');
  }

  adaptar(res);
  const inicio = Date.now();
  try {
    // La ruta va convertida a file:// SIEMPRE. En Windows `archivo` es
    // C:\Dev\..., y el cargador de módulos lee "c:" como si fuera el esquema de
    // una URL: falla con "Only URLs with a scheme in: file, data, and node are
    // supported". O sea la API local no corría en Windows, en ninguna función.
    // El ?v= sigue estando para que recargue al editar, ahora como parámetro.
    const modulo = pathToFileURL(archivo);
    modulo.searchParams.set('v', String(Date.now()));
    const { default: handler } = await import(modulo.href);
    await handler(req, res);
  } catch (err) {
    console.error(`✗ ${ruta}`, err);
    if (!res.headersSent) res.status(500).json({ success: false, error: err.message });
    else res.end();
  }
  console.log(`  ${ruta} → ${res.statusCode} en ${((Date.now() - inicio) / 1000).toFixed(1)}s`);
});

servidor.listen(PUERTO, () => {
  console.log(`  API local en http://localhost:${PUERTO}`);
  console.log(`  correos: ${conCorreo ? 'SE ENVÍAN' : 'desactivados (--con-correo para activarlos)'}`);
});
