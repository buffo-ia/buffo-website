// Levanta Astro y el servidor de /api juntos, en Mac y en Windows.
// Sin dependencias: `concurrently` no hace falta para dos procesos.

import { spawn } from 'node:child_process';

const argumentos = process.argv.slice(2);
const opciones = { stdio: 'inherit', shell: process.platform === 'win32' };

const procesos = [
  spawn('node', ['scripts/dev-api.mjs', ...argumentos], opciones),
  spawn('npx', ['astro', 'dev'], opciones),
];

const cerrarTodo = () => procesos.forEach((p) => !p.killed && p.kill());
process.on('SIGINT', cerrarTodo);
process.on('SIGTERM', cerrarTodo);
procesos.forEach((p) => p.on('exit', cerrarTodo));
