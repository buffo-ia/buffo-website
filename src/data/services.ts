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
  nameEn: string; // acento en inglés — va en el badge, nunca en el H1 ni el metaTitle
  h1: string; // titular con keyword + Chile
  // ⚠️ 4-sep-2026: donde el nombre de producto cambió, el H1 lleva LOS DOS:
  // "Inteligencia de Gestión: dashboards ejecutivos para empresas en Chile".
  // El nombre nuevo presenta el producto, la keyword vieja conserva el
  // posicionamiento. Sacar "dashboards ejecutivos" del H1 habría botado el
  // término por el que la gente llega, y ese término está indexado.
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
    navTitle: 'Inteligencia de Gestión',
    nameEn: 'AI Business Analytics',
    h1: 'Inteligencia de Gestión: dashboards ejecutivos para empresas en Chile',
    metaTitle: 'Dashboards Ejecutivos en Chile | Buffo IA Consulting',
    metaDescription:
      'Diseñamos dashboards ejecutivos para empresas en Chile: sus ventas, finanzas y operación en tiempo real, sin reportería manual. Visualizaciones para decidir, no solo para mirar.',
    lead: 'Un dashboard ejecutivo es un tablero que reúne los indicadores clave de su empresa en una sola vista y en tiempo real. En Buffo IA los diseñamos para gerentes en Chile que necesitan decidir rápido: en vez de esperar el reporte del mes, ve el estado del negocio cuando lo necesita y sabe dónde actuar primero.',
    sections: [
      {
        heading: '¿Por qué el reporte siempre llega tarde?',
        body: [
          'La mayoría de las empresas no tiene un problema de datos: tiene un problema de tiempo. La información existe, pero está repartida en planillas, sistemas y reportes que alguien tiene que consolidar a mano cada semana. Cuando el reporte por fin llega, ya pasó la oportunidad de corregir.',
          'Un dashboard ejecutivo elimina ese trabajo manual. Conectamos sus fuentes una sola vez y la información se actualiza sola, lista para leer en segundos.',
        ],
      },
      // Ojo: acá NO va un "cómo trabajamos". Esta página tiene su propio
      // bloque de pasos (ServiceSteps) y el diagrama de drill-down; repetirlo
      // en prosa seria decir dos veces lo mismo en la misma pantalla.
      {
        heading: '¿Qué datos necesita y de dónde salen?',
        body: [
          'Los que ya tiene. Lo habitual es partir con lo que existe: el sistema de ventas, el ERP, las planillas de control de gestión, la base del punto de venta. No hace falta un proyecto de datos previo ni cambiar de software para empezar a ver resultados.',
          'Cuando las fuentes no coinciden entre sí —y casi nunca coinciden— esa diferencia se resuelve como parte del trabajo: se acuerdan definiciones únicas para cada indicador, de modo que "venta" signifique lo mismo en comercial que en finanzas. Ese acuerdo es la mitad del valor del proyecto, aunque no se vea en la pantalla.',
        ],
      },
      {
        heading: '¿Cuánto demora la implementación?',
        body: [
          'El trabajo se ordena por etapas para que el resultado se note desde el principio. Primero se conecta la fuente más importante y se levanta la primera vista útil; después se suman las demás. Nadie espera meses para ver la primera pantalla funcionando.',
          'Ese orden también protege la inversión: si algo del alcance cambia a mitad de camino, lo ya entregado sigue sirviendo. Es la misma lógica con la que se aborda cualquier proyecto en una empresa en Chile que no puede detener su operación para implementar un sistema.',
        ],
      },
      {
        heading: '¿Qué lo hace distinto de comprar una herramienta de BI?',
        body: [
          'Buffo IA nació en las áreas comerciales, no en TI. Eso significa que el dashboard habla el idioma del negocio: vendedores, canales, presupuesto, quiebres de stock, margen. No tiene que traducir tecnicismos para entenderlo.',
          'Una licencia de una herramienta de visualización le entrega un lienzo en blanco y el problema sigue siendo suyo: qué medir, cómo definirlo y qué hacer cuando el número se sale de rango. Acá lo que se entrega es el criterio, y la herramienta es solo el medio.',
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
        a: 'Acceso a sus fuentes de datos actuales (Excel, ERP, sistema de ventas o base de datos). Nosotros nos encargamos de conectarlas y estructurarlas; su equipo no tiene que cargar nada manualmente.',
      },
      {
        q: '¿En cuánto tiempo veo el primer dashboard?',
        a: 'Las primeras visualizaciones pueden estar operativas en pocos días. Proyectos con varias fuentes se diseñan por etapas para entregar valor desde el inicio.',
      },
      {
        q: '¿Sirve para una pyme o es solo para empresas grandes?',
        a: 'Sirve para ambas, y en una pyme suele notarse antes. Mientras menos personas hay para consolidar información a mano, más pesa cada hora que se libera. El alcance se ajusta al tamaño: una empresa pequeña parte con una vista y crece desde ahí.',
      },
      {
        q: '¿Puedo verlo desde el celular?',
        a: 'Sí. Los dashboards se diseñan para leerse en el teléfono, que es donde un gerente revisa cómo va el mes cuando está fuera de la oficina. La vista de celular no es la de escritorio achicada: muestra primero lo que se mira de pasada.',
      },
      {
        q: '¿Quién lo mantiene después de la implementación?',
        a: 'Una vez conectadas las fuentes, el dashboard se actualiza solo y no requiere trabajo manual del equipo. Los cambios posteriores —un indicador nuevo, una vista distinta cuando cambia la estructura comercial— se acuerdan como mantención.',
      },
      {
        q: '¿Y si mi información está toda en Excel?',
        a: 'Es el punto de partida más frecuente y no es un impedimento. Las planillas se conectan igual que cualquier otra fuente. Lo que sí conviene es aprovechar el proyecto para dejar de depender de que alguien recuerde actualizar el archivo correcto.',
      },
    ],
  },
  {
    slug: 'modelamiento-predictivo',
    icon: 'schema',
    navTitle: 'Modelamiento de Datos',
    nameEn: 'Data Modeling & Integration',
    h1: 'Modelamiento y análisis de datos para empresas en Chile',
    metaTitle: 'Modelamiento de Datos y Forecasting en Chile | Buffo IA',
    metaDescription:
      'Conectamos y estructuramos las fuentes de datos de su empresa en Chile para generar inteligencia accionable: forecasting de ventas, presupuestos y alertas. Del caos de planillas a decisiones.',
    lead: 'El modelamiento de datos consiste en conectar las distintas fuentes de su empresa y darles una estructura coherente para poder analizarlas y proyectarlas. En Buffo IA transformamos el caos de planillas dispersas en un modelo único que permite forecasting de ventas, preparación de presupuestos y alertas tempranas, pensado para la realidad de las empresas en Chile.',
    sections: [
      {
        heading: '¿Por qué las cifras no cuadran entre sistemas?',
        body: [
          'Cuando cada área guarda sus datos a su manera, comparar y proyectar se vuelve imposible. Las cifras no cuadran entre sistemas, cada reporte usa una definición distinta y nadie confía del todo en los números.',
          'El modelamiento ordena ese desorden: una sola fuente de verdad, con definiciones consistentes, sobre la que se puede analizar y predecir.',
          'Casi siempre el desacuerdo no es técnico sino de criterio. Comercial cuenta la venta cuando se emite la orden y finanzas cuando se factura; los dos tienen razón dentro de su lógica. Hasta que esa definición no se acuerda y se escribe, ningún sistema va a poder resolverlo.',
        ],
      },
      {
        heading: '¿Cómo se construye un modelo de datos?',
        body: [
          'Integramos sus fuentes — ventas, inventario, finanzas, marketing — y las estructuramos para que la información fluya hacia la rentabilidad. Sobre esa base construimos proyecciones de demanda, presupuestos y modelos de quiebre de stock.',
          'No es estadística por la estadística: cada modelo se construye con criterio comercial, de modo que las proyecciones tengan sentido para quien toma las decisiones.',
        ],
      },
      {
        heading: '¿Qué tan confiable es un forecast de ventas?',
        body: [
          'Un pronóstico no es una promesa: es un rango con supuestos explícitos. Lo útil no es acertar el número exacto sino saber con cuánta holgura se está trabajando y qué tendría que pasar para que el escenario cambie.',
          'Por eso cada proyección se entrega con sus supuestos a la vista y se contrasta contra lo que efectivamente ocurrió. Un modelo que nadie revisa contra la realidad envejece rápido; uno que se ajusta cada período mejora solo.',
          'También importa reconocer los límites. Hay quiebres que ningún modelo anticipa porque dependen de información que la empresa no registra en ninguna parte. Decirlo a tiempo vale más que entregar una cifra con falsa precisión.',
        ],
      },
      {
        heading: '¿Necesito tener los datos ordenados antes de empezar?',
        body: [
          'No. Encontrar las fuentes desordenadas es lo normal, no la excepción, y ordenarlas es parte del trabajo. Esperar a "tener los datos listos" es la forma más común de no empezar nunca.',
          'Lo que sí conviene tener claro antes de partir es qué decisión se quiere mejorar. Con esa pregunta definida, el modelo se construye hacia ella y no se convierte en un proyecto sin fin de limpiar información que nadie va a usar.',
        ],
      },
      {
        heading: '¿Qué lo hace distinto?',
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
      {
        q: '¿Cuánta historia necesito para proyectar?',
        a: 'Depende de qué se quiera proyectar. Un comportamiento con estacionalidad marcada necesita al menos un par de ciclos completos para distinguir la temporada de la tendencia. Cuando hay menos historia, igual se puede trabajar, pero el resultado se entrega como rango y no como cifra cerrada.',
      },
      {
        q: '¿Esto reemplaza a mi ERP?',
        a: 'No. El ERP es donde ocurre la operación; el modelo es la capa que lee esa operación y la deja comparable con el resto de las fuentes. Se construye sobre lo que ya tiene, sin pedirle cambiar de sistema.',
      },
      {
        q: '¿Quién decide qué significa cada indicador?',
        a: 'La empresa, con nuestro acompañamiento. Nosotros ponemos las preguntas sobre la mesa y proponemos una definición, pero el criterio final es del negocio: es la única forma de que después nadie discuta el número en una reunión.',
      },
    ],
  },
  {
    slug: 'automatizacion-procesos',
    icon: 'precision_manufacturing',
    navTitle: 'Automatización de Procesos',
    nameEn: 'Process Automation',
    h1: 'Automatización de procesos con IA para empresas en Chile',
    metaTitle: 'Automatización de Procesos con IA en Chile | Buffo IA',
    metaDescription:
      'Automatizamos tareas repetitivas en empresas de Chile: reportería, consolidación de datos y flujos manuales. Libera el tiempo de su equipo para lo que genera valor.',
    lead: 'La automatización de procesos consiste en delegar a un sistema las tareas repetitivas que hoy consumen el tiempo de su equipo: consolidar planillas, armar reportes, mover datos entre sistemas. En Buffo IA diseñamos estos flujos para empresas en Chile, de modo que el trabajo manual desaparezca y las personas se enfoquen en lo que sí genera valor.',
    sections: [
      {
        heading: '¿Cuánto tiempo se va en tareas que no requieren talento?',
        body: [
          'Mucho talento se pierde en tareas que no requieren talento: copiar y pegar entre planillas, descargar reportes, rearmar el mismo informe cada semana. Es trabajo necesario, pero invisible y agotador.',
          'Automatizar esos flujos no solo ahorra horas: reduce errores y libera a las personas para pensar, no para operar.',
          'El costo mayor rara vez son las horas. Es que el proceso depende de una persona: cuando esa persona se enferma, sale de vacaciones o cambia de trabajo, el informe simplemente no sale. Automatizar es también sacar ese riesgo de encima del equipo.',
        ],
      },
      {
        heading: '¿Por dónde conviene empezar?',
        body: [
          'Identificamos las tareas repetitivas de mayor carga y diseñamos flujos que las ejecutan solos. La reportería que antes tomaba un día se genera sin intervención; los datos viajan entre sistemas sin que nadie los mueva a mano.',
          'Priorizamos por impacto: empezamos por el proceso que más tiempo libera, para que el resultado se note rápido.',
          'Un buen primer candidato cumple tres condiciones: se repite con frecuencia conocida, sigue reglas que se pueden escribir y hoy le cuesta horas a alguien. Si además el resultado lo espera otra persona, mejor todavía: el beneficio se ve el primer día.',
        ],
      },
      {
        heading: '¿Qué procesos NO conviene automatizar?',
        body: [
          'Los que todavía están cambiando. Automatizar un proceso que se va a redefinir el mes que viene es fijar en código algo que aún no está decidido, y sale más caro deshacerlo que haberlo dejado manual.',
          'Tampoco conviene cuando la tarea exige criterio en cada caso. Ahí la ganancia está en darle mejor información a la persona que decide, no en sacarla del circuito. Parte del trabajo es decir cuál es cuál antes de empezar.',
        ],
      },
      {
        heading: '¿Qué pasa si un flujo automático falla?',
        body: [
          'Se diseña asumiendo que va a fallar alguna vez, porque los sistemas de los que depende cambian. Cada flujo avisa cuando algo no corrió como debía, en vez de quedarse callado — un proceso automático que falla en silencio es peor que uno manual.',
          'Y siempre queda la vía manual disponible. La automatización se hace encima de las herramientas que la empresa ya usa, así que ante un problema el equipo puede seguir operando como antes mientras se corrige.',
        ],
      },
      {
        heading: '¿Qué lo hace distinto?',
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
        a: 'No necesariamente. Lo habitual es automatizar sobre las herramientas que ya usa, conectándolas entre sí en lugar de reemplazarlas.',
      },
      {
        q: '¿Qué diferencia hay con los Agentes IA?',
        a: 'La automatización ejecuta un flujo definido. Un agente IA además decide y monitorea de forma autónoma. Muchas veces se combinan.',
      },
      {
        q: '¿Mi equipo tiene que aprender a programar?',
        a: 'No. Los flujos quedan corriendo solos y el equipo sigue trabajando con las mismas herramientas de siempre. Lo que cambia es que el archivo aparece listo en vez de tener que armarlo.',
      },
      {
        q: '¿Esto significa que voy a despedir gente?',
        a: 'No es el objetivo ni lo que ocurre en la práctica. Lo que se automatiza son las horas que hoy nadie quiere hacer y que no aportan criterio. En equipos pequeños —el caso más común en Chile— esas horas se reinvierten en trabajo comercial o de análisis que estaba postergado.',
      },
      {
        q: '¿Cómo sé cuánto tiempo estoy ganando realmente?',
        a: 'Antes de automatizar se estima con el equipo cuánto toma hoy la tarea y con qué frecuencia se repite. Esa cifra es del cliente, no nuestra, y sirve después para contrastar si el flujo entregó lo que se esperaba.',
      },
    ],
  },
  {
    slug: 'agentes-ia',
    icon: 'smart_toy',
    navTitle: 'Agentes de Negocio',
    nameEn: 'AI Agents',
    h1: 'Agentes de Negocio: agentes de inteligencia artificial para empresas en Chile',
    metaTitle: 'Agentes IA para Empresas en Chile | Buffo IA Consulting',
    metaDescription:
      'Desarrollamos agentes de IA para empresas en Chile: software que trabaja solo, monitorea sus datos, detecta lo importante y ejecuta tareas sin que se las pidan. IA proactiva, no reactiva.',
    lead: 'Un agente de IA es un software que trabaja por su cuenta: monitorea sus datos de forma continua, detecta lo que importa y ejecuta tareas sin que nadie se lo pida. A diferencia de un asistente que solo responde cuando usted le pregunta, un agente actúa de manera proactiva. En Buffo IA los desarrollamos para empresas en Chile sobre infraestructura propia y segura.',
    sections: [
      {
        heading: '¿Qué diferencia hay entre un asistente y un agente?',
        body: [
          'Un asistente espera su pregunta para responder. Un agente, en cambio, vigila el negocio todo el tiempo y se adelanta: revisa el pipeline comercial cada mañana, detecta una cobranza en riesgo, alerta de un quiebre de stock antes de que ocurra o prepara un resumen sin que nadie lo pida.',
          'Ese cambio —de reactivo a proactivo— es lo que convierte la IA en un miembro más del equipo que nunca se distrae.',
        ],
      },
      {
        heading: '¿Cómo se construye un agente?',
        body: [
          'Diseñamos cada agente alrededor de una tarea concreta y de alto valor: monitoreo, alertas, resúmenes o ejecución de acciones. El agente corre solo —por horario o ante un evento— y avisa por el canal que su equipo ya usa.',
          'Lo construimos sobre la infraestructura de Buffo, con los datos de cada empresa aislados y bajo control. No es una demo: es software en operación.',
          'Un agente que hace una cosa bien vale más que uno que promete hacerlo todo. Por eso el alcance se define estrecho al principio y se amplía cuando el equipo ya confía en lo que el agente hace sin supervisión.',
        ],
      },
      {
        heading: '¿Qué decide solo y qué consulta antes de actuar?',
        body: [
          'Eso se define al principio y queda explícito, porque es la pregunta que de verdad importa. Hay acciones que un agente puede ejecutar sin preguntar —armar un resumen, avisar de un indicador fuera de rango— y otras que siempre pasan por una persona, como enviar algo a un cliente o mover una cifra en un sistema.',
          'El criterio que usamos es simple: mientras más difícil sea deshacer una acción, más arriba está el permiso que necesita. Un aviso interno equivocado se corrige con otro aviso; un correo enviado a un cliente por error, no.',
        ],
      },
      {
        heading: '¿Cómo se evita que el agente inunde de notificaciones?',
        body: [
          'Un agente que avisa de todo termina ignorado, y en ese momento deja de servir aunque técnicamente funcione. Por eso el diseño define primero qué merece interrumpir a alguien y qué puede esperar al resumen del día.',
          'Nuestros agentes nacen de la experiencia comercial: saben qué es relevante en un negocio y qué es ruido. No lo inundan de notificaciones; le avisan cuando de verdad hay que actuar.',
        ],
      },
      {
        heading: '¿Qué pasa con la seguridad de la información?',
        body: [
          'Los agentes corren sobre infraestructura controlada por Buffo, con los datos de cada empresa separados de los del resto. El acceso se limita a lo que el agente necesita para su tarea y nada más.',
          'Es una pregunta que conviene hacer siempre, a nosotros y a cualquier proveedor: dónde quedan los datos, quién puede verlos y qué pasa con ellos si mañana termina la relación. Si la respuesta es vaga, es una respuesta.',
        ],
      },
    ],
    deliverables: [
      'Agentes de monitoreo continuo de indicadores',
      'Alertas proactivas (cobranza, stock, pipeline, metas)',
      'Resúmenes y reportes generados automáticamente',
      'Ejecución autónoma de tareas por horario o por evento',
      'Notificaciones en el canal que su equipo ya usa',
      'Agentes a medida según el proceso de su negocio',
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
      {
        q: '¿Qué pasa si el agente se equivoca?',
        a: 'Las acciones que no se pueden deshacer requieren aprobación humana, así que un error queda contenido antes de salir. Además cada agente deja registro de lo que hizo y por qué, de modo que se puede revisar y corregir el criterio.',
      },
      {
        q: '¿Necesito tener dashboards antes de poner un agente?',
        a: 'No es obligatorio, pero ayuda. Un agente necesita datos ordenados para saber qué es normal y qué no; si ese trabajo ya está hecho, se avanza más rápido. Cuando no está, se hace la parte mínima necesaria para el agente en cuestión.',
      },
      {
        q: '¿Por qué canal avisa?',
        a: 'Por el que su equipo ya usa: correo, WhatsApp o la herramienta de chat interna. La idea es no agregar una aplicación más que alguien tenga que acordarse de abrir.',
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
        desc: 'Vigila sus KPI y avisa solo cuando un indicador se sale de lo esperado.',
      },
    ],
  },
];

export function getService(slug: string) {
  return SERVICES_CONTENT.find((s) => s.slug === slug);
}
