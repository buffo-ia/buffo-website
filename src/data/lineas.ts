// Las cuatro líneas de servicio (borrador de Comercial, 12-oct-2026). Fuente
// única del texto para el home (components/v2/corp/Corporativa.astro) y para
// /servicios: los enlaces de cada tarjeta los pone cada página, porque no son
// los mismos.
export interface Linea {
  en: string; // nombre en inglés, va de rótulo
  nombre: string;
  frase: string;
  recibe: string[]; // tres entregables
}

export const LINEAS: Linea[] = [
  {
    en: 'Business Intelligence Consulting',
    nombre: 'Consultoría en inteligencia de negocios',
    frase: 'Revisamos su negocio con mirada estratégica y foco en el ROI: dónde se genera el resultado, dónde se pierde y qué priorizar.',
    recibe: ['Revisión del estado de resultados, con cada cifra trazada a su origen', 'Rentabilidad por línea de negocio, producto, cliente y sucursal', 'Objetivos y ruta al EBITDA, con seguimiento mensual junto a su gerencia'],
  },
  {
    en: 'Decision Solutions with AI',
    nombre: 'Decisiones de negocio con IA',
    frase: 'Tomamos una decisión que se repite, como precio, surtido, metas o cobranza, y la dejamos resuelta con un modelo que su equipo usa todos los meses.',
    recibe: ['Diagnóstico de la decisión y de los datos disponibles', 'Caso de negocio con el retorno esperado', 'Modelo o herramienta de decisión, construido con sus datos'],
  },
  {
    en: 'Business Analytics with AI',
    nombre: 'Analítica de negocio con IA',
    frase: 'El negocio completo en un solo lugar, con una sola definición de cada número y con la lectura de qué atender primero.',
    recibe: ['Integración de sus fuentes de datos sin cambiar sistemas', 'Modelo de datos con definiciones acordadas con su equipo', 'Informes de gestión que se actualizan solos, con la lectura de lo que se salió de lo esperado'],
  },
  {
    en: 'Agentic Workflows for Business',
    nombre: 'Flujos de trabajo con agentes',
    frase: 'Diseñamos e implementamos flujos donde agentes de IA apoyan a su equipo en tareas de seguimiento, preparación y alerta.',
    recibe: ['Levantamiento del proceso y de dónde se pierden las horas', 'Diseño del flujo, con un responsable de su equipo en cada uno', 'Implementación y operación sobre sus sistemas actuales'],
  },
];
