// Contenido de las páginas de servicio. Editar acá el texto (no el motor [slug].astro).
// Borradores SEO para que Simón corrija. Sin cifras inventadas.

export interface ServiceSection {
  heading: string;
  body: string[]; // cada string es un párrafo
}

export interface ServiceExample {
  icon: string;
  title: string;
  desc: string;
}

export interface ServiceContent {
  slug: string;
  icon: string; // Material Symbol
  navTitle: string; // título corto para listados
  h1: string; // titular con keyword + Chile
  metaTitle: string;
  metaDescription: string;
  lead: string; // párrafo de respuesta directa (50-80 palabras) — clave para GEO/AEO
  sections: ServiceSection[];
  deliverables: string[]; // lista concreta de entregables
  forWhom: string[]; // a quién va dirigido
  faq: { q: string; a: string }[];
  examples?: ServiceExample[]; // ejemplos concretos (se muestran en el hero)
}

export const SERVICES_CONTENT: ServiceContent[] = [
  {
    slug: 'dashboards-ejecutivos',
    icon: 'dashboard_customize',
    navTitle: 'Dashboards ejecutivos',
    h1: 'Dashboards ejecutivos para empresas en Chile',
    metaTitle: 'Dashboards Ejecutivos en Chile | Buffo IA Consulting',
    metaDescription:
      'Diseñamos dashboards ejecutivos para empresas en Chile: tus ventas, finanzas y operación en tiempo real, sin reportería manual. Visualizaciones para decidir, no solo para mirar.',
    lead: 'Un dashboard ejecutivo es un tablero que reúne los indicadores clave de tu empresa en una sola vista y en tiempo real. En Buffo IA los diseñamos para gerentes en Chile que necesitan decidir rápido: en vez de esperar el reporte del mes, ves el estado del negocio cuando lo necesitas y sabes dónde actuar primero.',
    sections: [
      {
        heading: 'El problema que resuelve',
        body: [
          'La mayoría de las empresas no tiene un problema de datos: tiene un problema de tiempo. La información existe, pero está repartida en planillas, sistemas y reportes que alguien tiene que consolidar a mano cada semana. Cuando el reporte por fin llega, ya pasó la oportunidad de corregir.',
          'Un dashboard ejecutivo elimina ese trabajo manual. Conectamos tus fuentes una sola vez y la información se actualiza sola, lista para leer en segundos.',
        ],
      },
      {
        heading: 'Cómo trabajamos',
        body: [
          'Partimos por entender qué decisiones tomas y con qué frecuencia. Recién entonces definimos qué indicadores importan — no al revés. No llenamos pantallas de gráficos; mostramos lo que mueve el negocio.',
          'Cada dashboard incorpora las sugerencias de Buffo: no solo muestra el número, también señala qué está fuera de lo esperado y qué conviene revisar. Esa lectura nace de años de experiencia comercial real, no de una plantilla genérica.',
        ],
      },
      {
        heading: 'Qué lo hace distinto',
        body: [
          'Buffo IA nació en las áreas comerciales, no en TI. Eso significa que el dashboard habla el idioma del negocio: vendedores, canales, presupuesto, quiebres de stock, margen. No tienes que traducir tecnicismos para entenderlo.',
        ],
      },
    ],
    deliverables: [
      'Reportería de ventas automatizada',
      'Seguimiento por vendedor, canal o sucursal',
      'Dashboard de avance vs. presupuesto',
      'Análisis y tendencias por categoría o marca',
      'Alertas de quiebres de stock',
      'Indicadores financieros y operativos en una sola vista',
    ],
    forWhom: [
      'Gerentes generales que necesitan una vista única del negocio',
      'Gerentes comerciales y de ventas que siguen metas y equipos',
      'Pymes y grandes empresas que hoy consolidan reportes a mano',
    ],
    faq: [
      {
        q: '¿Qué necesito para empezar?',
        a: 'Acceso a tus fuentes de datos actuales (Excel, ERP, sistema de ventas o base de datos). Nosotros nos encargamos de conectarlas y estructurarlas; tu equipo no tiene que cargar nada manualmente.',
      },
      {
        q: '¿En cuánto tiempo veo el primer dashboard?',
        a: 'Las primeras visualizaciones pueden estar operativas en pocos días. Proyectos con varias fuentes se diseñan por etapas para entregar valor desde el inicio.',
      },
    ],
  },
  {
    slug: 'modelamiento-predictivo',
    icon: 'schema',
    navTitle: 'Modelamiento de datos',
    h1: 'Modelamiento y análisis de datos para empresas en Chile',
    metaTitle: 'Modelamiento de Datos y Forecasting en Chile | Buffo IA',
    metaDescription:
      'Conectamos y estructuramos las fuentes de datos de tu empresa en Chile para generar inteligencia accionable: forecasting de ventas, presupuestos y alertas. Del caos de planillas a decisiones.',
    lead: 'El modelamiento de datos consiste en conectar las distintas fuentes de tu empresa y darles una estructura coherente para poder analizarlas y proyectarlas. En Buffo IA transformamos el caos de planillas dispersas en un modelo único que permite forecasting de ventas, preparación de presupuestos y alertas tempranas, pensado para la realidad de las empresas en Chile.',
    sections: [
      {
        heading: 'El problema que resuelve',
        body: [
          'Cuando cada área guarda sus datos a su manera, comparar y proyectar se vuelve imposible. Las cifras no cuadran entre sistemas, cada reporte usa una definición distinta y nadie confía del todo en los números.',
          'El modelamiento ordena ese desorden: una sola fuente de verdad, con definiciones consistentes, sobre la que se puede analizar y predecir.',
        ],
      },
      {
        heading: 'Cómo trabajamos',
        body: [
          'Integramos tus fuentes — ventas, inventario, finanzas, marketing — y las estructuramos para que la información fluya hacia la rentabilidad. Sobre esa base construimos proyecciones de demanda, presupuestos y modelos de quiebre de stock.',
          'No es estadística por la estadística: cada modelo se construye con criterio comercial, de modo que las proyecciones tengan sentido para quien toma las decisiones.',
        ],
      },
      {
        heading: 'Qué lo hace distinto',
        body: [
          'Combinamos la técnica con la experiencia de negocio. Un forecast no sirve si el gerente no puede explicarlo ni confiar en él; por eso traducimos el modelo a parámetros que el equipo entiende y puede defender.',
        ],
      },
    ],
    deliverables: [
      'Integración de múltiples fuentes en un modelo único',
      'Forecasting de ventas y demanda',
      'Preparación y seguimiento de presupuestos',
      'Modelos de quiebre y reposición de stock',
      'Estructuración de datos para análisis confiable',
      'Escenarios y simulaciones para decidir',
    ],
    forWhom: [
      'Empresas con datos repartidos en varios sistemas o planillas',
      'Áreas comerciales que necesitan proyectar ventas y presupuestos',
      'Operaciones y abastecimiento que gestionan inventario',
    ],
    faq: [
      {
        q: '¿Qué diferencia esto de tener reportes?',
        a: 'Un reporte mira hacia atrás; el modelamiento permite mirar hacia adelante. Al estructurar bien los datos podemos proyectar escenarios, no solo describir lo que ya pasó.',
      },
      {
        q: '¿Sirve si mis datos están "sucios"?',
        a: 'Sí. Parte del trabajo es justamente limpiar y estructurar fuentes desordenadas. Es lo habitual, no la excepción.',
      },
    ],
  },
  {
    slug: 'automatizacion-procesos',
    icon: 'precision_manufacturing',
    navTitle: 'Automatización de procesos',
    h1: 'Automatización de procesos con IA para empresas en Chile',
    metaTitle: 'Automatización de Procesos con IA en Chile | Buffo IA',
    metaDescription:
      'Automatizamos tareas repetitivas en empresas de Chile: reportería, consolidación de datos y flujos manuales. Libera el tiempo de tu equipo para lo que genera valor.',
    lead: 'La automatización de procesos consiste en delegar a un sistema las tareas repetitivas que hoy consumen el tiempo de tu equipo: consolidar planillas, armar reportes, mover datos entre sistemas. En Buffo IA diseñamos estos flujos para empresas en Chile, de modo que el trabajo manual desaparezca y las personas se enfoquen en lo que sí genera valor.',
    sections: [
      {
        heading: 'El problema que resuelve',
        body: [
          'Mucho talento se pierde en tareas que no requieren talento: copiar y pegar entre planillas, descargar reportes, rearmar el mismo informe cada semana. Es trabajo necesario, pero invisible y agotador.',
          'Automatizar esos flujos no solo ahorra horas: reduce errores y libera a las personas para pensar, no para operar.',
        ],
      },
      {
        heading: 'Cómo trabajamos',
        body: [
          'Identificamos las tareas repetitivas de mayor carga y diseñamos flujos que las ejecutan solos. La reportería que antes tomaba un día se genera sin intervención; los datos viajan entre sistemas sin que nadie los mueva a mano.',
          'Priorizamos por impacto: empezamos por el proceso que más tiempo libera, para que el resultado se note rápido.',
        ],
      },
      {
        heading: 'Qué lo hace distinto',
        body: [
          'No automatizamos por automatizar. Cada flujo se elige por su retorno en tiempo y calidad, con la mirada de quien conoce cómo opera realmente un área comercial o financiera.',
        ],
      },
    ],
    deliverables: [
      'Reportería automatizada (ventas, finanzas, operación)',
      'Consolidación automática de planillas y fuentes',
      'Flujos de datos entre sistemas sin intervención manual',
      'Alertas automáticas ante eventos del negocio',
      'Eliminación de tareas manuales repetitivas',
      'Envío y distribución automática de informes',
    ],
    forWhom: [
      'Equipos que dedican horas a consolidar reportes',
      'Áreas de control de gestión y finanzas',
      'Empresas que quieren escalar sin sumar trabajo manual',
    ],
    faq: [
      {
        q: '¿Tengo que cambiar mis sistemas actuales?',
        a: 'No necesariamente. Lo habitual es automatizar sobre las herramientas que ya usas, conectándolas entre sí en lugar de reemplazarlas.',
      },
      {
        q: '¿Qué diferencia hay con los Agentes IA?',
        a: 'La automatización ejecuta un flujo definido. Un agente IA además decide y monitorea de forma autónoma. Muchas veces se combinan.',
      },
    ],
  },
  {
    slug: 'agentes-ia',
    icon: 'smart_toy',
    navTitle: 'Agentes IA',
    h1: 'Agentes de inteligencia artificial para empresas en Chile',
    metaTitle: 'Agentes IA para Empresas en Chile | Buffo IA Consulting',
    metaDescription:
      'Desarrollamos agentes de IA para empresas en Chile: software que trabaja solo, monitorea tus datos, detecta lo importante y ejecuta tareas sin que se las pidan. IA proactiva, no reactiva.',
    lead: 'Un agente de IA es un software que trabaja por su cuenta: monitorea tus datos de forma continua, detecta lo que importa y ejecuta tareas sin que nadie se lo pida. A diferencia de un asistente que solo responde cuando le preguntas, un agente actúa de manera proactiva. En Buffo IA los desarrollamos para empresas en Chile sobre infraestructura propia y segura.',
    sections: [
      {
        heading: 'De asistente reactivo a agente proactivo',
        body: [
          'Un asistente espera tu pregunta para responder. Un agente, en cambio, vigila el negocio todo el tiempo y se adelanta: revisa el pipeline comercial cada mañana, detecta una cobranza en riesgo, alerta de un quiebre de stock antes de que ocurra o prepara un resumen sin que nadie lo pida.',
          'Ese cambio —de reactivo a proactivo— es lo que convierte la IA en un miembro más del equipo que nunca se distrae.',
        ],
      },
      {
        heading: 'Cómo trabajamos',
        body: [
          'Diseñamos cada agente alrededor de una tarea concreta y de alto valor: monitoreo, alertas, resúmenes o ejecución de acciones. El agente corre solo —por horario o ante un evento— y avisa por el canal que tu equipo ya usa.',
          'Lo construimos sobre la infraestructura de Buffo, con los datos de cada empresa aislados y bajo control. No es una demo: es software en operación.',
        ],
      },
      {
        heading: 'Qué lo hace distinto',
        body: [
          'Nuestros agentes nacen de la experiencia comercial: saben qué es relevante en un negocio y qué es ruido. No te inundan de notificaciones; te avisan cuando de verdad hay que actuar.',
        ],
      },
    ],
    deliverables: [
      'Agentes de monitoreo continuo de indicadores',
      'Alertas proactivas (cobranza, stock, pipeline, metas)',
      'Resúmenes y reportes generados automáticamente',
      'Ejecución autónoma de tareas por horario o por evento',
      'Notificaciones en el canal que tu equipo ya usa',
      'Agentes a medida según el proceso de tu negocio',
    ],
    forWhom: [
      'Empresas que quieren adelantarse a los problemas, no reaccionar',
      'Áreas comerciales y de cobranza con seguimiento diario',
      'Equipos que reciben demasiada información y poca acción',
    ],
    faq: [
      {
        q: '¿Un agente reemplaza a mi equipo?',
        a: 'No. Se hace cargo del monitoreo constante y de las tareas repetitivas para que las personas se concentren en decidir y en lo que requiere criterio humano.',
      },
      {
        q: '¿Dónde quedan mis datos?',
        a: 'Sobre infraestructura controlada por Buffo, con los datos de cada empresa aislados. La seguridad y la privacidad son parte del diseño.',
      },
    ],
    examples: [
      {
        icon: 'request_quote',
        title: 'Agente de cotizaciones',
        desc: 'Recibe una solicitud, arma la cotización y la envía al cliente.',
      },
      {
        icon: 'payments',
        title: 'Agente de cobranza',
        desc: 'Detecta facturas por vencer y envía el recordatorio automáticamente.',
      },
      {
        icon: 'monitoring',
        title: 'Agente de pipeline',
        desc: 'Revisa las oportunidades cada mañana y avisa cuáles están frías.',
      },
      {
        icon: 'inventory',
        title: 'Agente de stock',
        desc: 'Alerta un quiebre antes de que ocurra y sugiere la reposición.',
      },
      {
        icon: 'summarize',
        title: 'Agente de reportes',
        desc: 'Arma el resumen de resultados del día y lo deja en el chat del equipo.',
      },
      {
        icon: 'notification_important',
        title: 'Agente de alertas',
        desc: 'Vigila tus KPI y avisa solo cuando un indicador se sale de lo esperado.',
      },
    ],
  },
];

export function getService(slug: string) {
  return SERVICES_CONTENT.find((s) => s.slug === slug);
}
