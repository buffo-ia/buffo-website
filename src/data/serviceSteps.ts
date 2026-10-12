// Pasos "Cómo trabajamos" por servicio (los de dashboards viven en su propia página).
export interface Step {
  icon: string;
  title: string;
  body: string;
}

export const STEPS: Record<string, { title: string; steps: Step[] }> = {
  'modelamiento-predictivo': {
    title: 'Cómo construimos su modelo de datos',
    steps: [
      {
        icon: 'cable',
        title: 'Conectamos sus fuentes',
        body: 'Integramos planillas, ERP, ventas e inventario en un solo lugar. Dejamos de tener cifras que no cuadran entre sistemas.',
      },
      {
        icon: 'dataset',
        title: 'Estructuramos y limpiamos',
        body: 'Damos una definición consistente a cada dato para crear una sola fuente de verdad en la que sí se puede confiar y sobre la que se puede proyectar.',
      },
      {
        icon: 'insights',
        title: 'Proyectamos con criterio de negocio',
        body: 'Construimos proyecciones de venta, presupuestos y alertas con supuestos explícitos, que su gerencia puede revisar y sostener.',
      },
    ],
  },
  'automatizacion-procesos': {
    title: 'Cómo automatizamos sus procesos',
    steps: [
      {
        icon: 'search',
        title: 'Identificamos lo repetitivo',
        body: 'Mapeamos las tareas manuales de mayor carga: consolidar planillas, armar reportes, mover datos entre sistemas.',
      },
      {
        icon: 'precision_manufacturing',
        title: 'Diseñamos el flujo',
        body: 'Construimos un proceso que se ejecuta solo, por horario o por evento, sobre las herramientas que ya usa. Sin reemplazar sus sistemas.',
      },
      {
        icon: 'verified',
        title: 'Priorizamos por impacto',
        body: 'Empezamos por el proceso que más tiempo libera, para que el resultado se note rápido y reduzca errores desde el primer día.',
      },
    ],
  },
  'agentes-ia': {
    title: 'Cómo desplegamos su agente IA',
    steps: [
      {
        icon: 'target',
        title: 'Definimos el objetivo',
        body: 'Cada agente se diseña para una tarea concreta, de alto valor y con retorno medible.',
      },
      {
        icon: 'radar',
        title: 'Lo implementamos con una persona a cargo',
        body: 'El agente opera sobre los datos de su empresa, con accesos acotados y un responsable de su equipo.',
      },
      {
        icon: 'notifications_active',
        title: 'Propone y deja registro',
        body: 'Cuando detecta algo relevante, prepara la propuesta y la envía por el canal que su equipo ya usa. Cada acción queda registrada.',
      },
    ],
  },
};
