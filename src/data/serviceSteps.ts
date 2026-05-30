// Pasos "Cómo trabajamos" por servicio (los de dashboards viven en su propia página).
export interface Step {
  icon: string;
  title: string;
  body: string;
}

export const STEPS: Record<string, { title: string; steps: Step[] }> = {
  'modelamiento-predictivo': {
    title: 'Cómo construimos tu modelo de datos',
    steps: [
      {
        icon: 'cable',
        title: 'Conectamos tus fuentes',
        body: 'Integramos planillas, ERP, ventas e inventario en un solo lugar. Dejamos de tener cifras que no cuadran entre sistemas.',
      },
      {
        icon: 'dataset',
        title: 'Estructuramos y limpiamos',
        body: 'Damos una definición consistente a cada dato para crear una sola fuente de verdad sobre la que sí se puede confiar y proyectar.',
      },
      {
        icon: 'insights',
        title: 'Proyectamos con criterio',
        body: 'Construimos forecasting de ventas, presupuestos y alertas con sentido comercial — modelos que el gerente entiende y puede defender.',
      },
    ],
  },
  'automatizacion-procesos': {
    title: 'Cómo automatizamos tus procesos',
    steps: [
      {
        icon: 'search',
        title: 'Identificamos lo repetitivo',
        body: 'Mapeamos las tareas manuales de mayor carga: consolidar planillas, armar reportes, mover datos entre sistemas.',
      },
      {
        icon: 'precision_manufacturing',
        title: 'Diseñamos el flujo',
        body: 'Construimos un proceso que se ejecuta solo, por horario o por evento, sobre las herramientas que ya usas. Sin reemplazar tus sistemas.',
      },
      {
        icon: 'verified',
        title: 'Priorizamos por impacto',
        body: 'Empezamos por el proceso que más tiempo libera, para que el resultado se note rápido y reduzca errores desde el primer día.',
      },
    ],
  },
  'agentes-ia': {
    title: 'Cómo desplegamos tu agente IA',
    steps: [
      {
        icon: 'target',
        title: 'Definimos la misión',
        body: 'Cada agente nace alrededor de una tarea concreta y de alto valor: monitorear cobranza, vigilar el pipeline, alertar quiebres o resumir resultados.',
      },
      {
        icon: 'radar',
        title: 'Lo ponemos a vigilar',
        body: 'El agente corre solo, de forma continua, sobre infraestructura controlada por Buffo con los datos de tu empresa aislados y seguros.',
      },
      {
        icon: 'notifications_active',
        title: 'Actúa y te avisa',
        body: 'Cuando detecta algo relevante, ejecuta la acción y notifica por el canal que tu equipo ya usa. Sin inundarte: avisa cuando de verdad hay que actuar.',
      },
    ],
  },
};
