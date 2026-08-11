// Banco de preguntas del diagnóstico de 3 minutos.
//
// Estructura: TRONCO (6 preguntas que responde todo el mundo, dan la puntuación
// comparable entre empresas) + un RAMAL de 5 preguntas según el dolor que elige
// el visitante + una pregunta abierta final.
//
// El selector de ramal se formula como DOLOR, nunca como producto: si el cliente
// supiera qué necesita no necesitaría el diagnóstico. El mapeo dolor -> servicio
// vive acá y no se le muestra.
//
// Los puntos van de 0 (opera a ciegas) a 3 (bajo control). El motor de cálculo
// normaliza contra el máximo, así que se pueden agregar o sacar preguntas sin
// tocar código.

export type Opcion = {
  valor: string;
  texto: string;
  puntos: number;
  /** Rango [min, max] de horas al mes. Solo en la pregunta de trabajo repetitivo. */
  horasMes?: [number, number];
};

export type Pregunta = {
  id: string;
  texto: string;
  /** Rótulo corto de la dimensión que mide. Solo en el tronco: alimenta las barras del resultado. */
  dimension?: string;
  opciones: Opcion[];
};

export type Ramal = {
  id: string;
  /** Lo que ve el visitante en el selector: su dolor, no el producto. */
  dolor: string;
  /** Subtítulo del selector. */
  detalle: string;
  /** Servicio de Buffo al que mapea. Uso interno: alimenta el análisis, no la UI. */
  servicio: string;
  icono: string;
  preguntas: Pregunta[];
};

export const INTRO = {
  titulo: 'Qué tan ciega está su operación',
  bajada:
    'Doce preguntas, tres minutos. Al final recibe un diagnóstico con lo que detectamos, qué se puede resolver y qué no podemos decirle sin conocerlos mejor.',
  promesa: 'Sin costo, sin presentación de ventas.',
};

/** Las contesta todo el mundo. Es la parte comparable entre empresas. */
export const TRONCO: Pregunta[] = [
  {
    id: 'latencia',
    dimension: 'Rapidez del dato',
    texto: '¿Cuánto se demora en tener la foto real de cómo va el mes?',
    opciones: [
      { valor: 'inmediato', texto: 'La veo en el momento, cuando quiera', puntos: 3 },
      { valor: 'dia', texto: 'Al día siguiente', puntos: 2 },
      { valor: 'semana', texto: 'Una semana, más o menos', puntos: 1 },
      { valor: 'cierre', texto: 'Recién al cierre de mes', puntos: 0 },
    ],
  },
  {
    id: 'origen',
    dimension: 'Origen del dato',
    texto: 'Esa información, ¿de dónde sale?',
    opciones: [
      { valor: 'sistema', texto: 'Un sistema la calcula solo', puntos: 3 },
      { valor: 'excel', texto: 'Alguien arma un Excel', puntos: 1 },
      { valor: 'persona', texto: 'Se la pido a una persona', puntos: 1 },
      { valor: 'estimacion', texto: 'La estimamos', puntos: 0 },
    ],
  },
  {
    id: 'fragmentacion',
    dimension: 'Fuentes dispersas',
    texto: '¿Cuántos sistemas o planillas distintas hay que abrir para armarla?',
    opciones: [
      { valor: 'uno', texto: 'Uno solo', puntos: 3 },
      { valor: 'dos_tres', texto: 'Dos o tres', puntos: 2 },
      { valor: 'cuatro_cinco', texto: 'Cuatro o cinco', puntos: 1 },
      { valor: 'muchos', texto: 'Más de cinco', puntos: 0 },
    ],
  },
  {
    id: 'dependencia',
    dimension: 'Dependencia de personas',
    texto: '¿Qué pasa cuando la persona que la arma sale de vacaciones?',
    opciones: [
      { valor: 'igual', texto: 'Todo sigue igual', puntos: 3 },
      { valor: 'otro', texto: 'Otra persona lo hace, con esfuerzo', puntos: 2 },
      { valor: 'atrasa', texto: 'Se atrasa', puntos: 1 },
      { valor: 'para', texto: 'Se deja de hacer hasta que vuelve', puntos: 0 },
    ],
  },
  {
    id: 'confiabilidad',
    dimension: 'Confiabilidad',
    texto: '¿Han tomado alguna decisión con un dato que después resultó estar malo?',
    opciones: [
      { valor: 'nunca', texto: 'No que recuerde', puntos: 3 },
      { valor: 'una_vez', texto: 'Alguna vez', puntos: 2 },
      { valor: 'seguido', texto: 'Pasa seguido', puntos: 0 },
    ],
  },
  {
    id: 'costo_manual',
    dimension: 'Trabajo manual',
    // No se le pide que juzgue qué podría hacer una máquina — eso es trabajo
    // nuestro. Solo que cuente las horas repetitivas, que sí las conoce.
    // El "en total" es clave: los tramos son de equipo, no de una persona. Sin
    // esa palabra todos marcan el tramo más bajo pensando en sí mismos y el
    // cálculo de costo queda en nada.
    texto: '¿Cuántas horas al mes se van, en total, en trabajo repetitivo?',
    // horasMes alimenta el cálculo de plata del informe. Lo hace el código y no
    // el modelo: es aritmética, y así el número nunca depende de que el modelo
    // multiplique bien.
    opciones: [
      { valor: 'pocas', texto: 'Menos de 20', puntos: 3, horasMes: [5, 20] },
      { valor: 'medias', texto: 'Entre 20 y 60', puntos: 2, horasMes: [20, 60] },
      { valor: 'muchas', texto: 'Entre 60 y 150', puntos: 1, horasMes: [60, 150] },
      { valor: 'muchisimas', texto: 'Más de 150', puntos: 0, horasMes: [150, 300] },
    ],
  },
];

/**
 * Base del cálculo de costo del trabajo repetitivo.
 *
 * ANTES se usaba el sueldo mínimo, por indiscutible. Estaba mal: nadie que
 * consolida planillas gana el mínimo, y eso subestimaba el costo a la mitad.
 * Ahora la base es un sueldo administrativo más leyes sociales — sigue siendo
 * conservador (este trabajo lo suele hacer alguien que gana más) pero es realista.
 * El supuesto va impreso en el informe, a la vista, para que se pueda discutir.
 *
 * El mínimo se conserva solo como referencia documental.
 */
export const COSTO_HORA = {
  sueldoBase: 900000, // administrativo con algo de experiencia
  leyesSociales: 1.3, // ~30% de recargo para el empleador
  horasSemana: 42, // jornada legal desde abril 2026 (Ley 21.561)
  sueldoMinimo: 553553, // IMM desde mayo 2026; ya no se usa para calcular
};

export const valorHora = () =>
  Math.round(
    (COSTO_HORA.sueldoBase * COSTO_HORA.leyesSociales) / (COSTO_HORA.horasSemana * 4.333)
  );

/**
 * La propuesta del informe.
 *
 * Esto es CONFIGURACIÓN y no lo escribe el modelo, a propósito: plazos y alcance
 * son compromiso comercial. Si el modelo los inventara, cada prospecto recibiría
 * una promesa distinta y habría que cumplirla. El modelo solo escribe el párrafo
 * de por qué este frente le corresponde a ESTA empresa.
 *
 * Tampoco van precios: se conversan en la reunión. Ver project_noviembre_4.
 */
export const PROPUESTA: Record<string, { titular: string; entregables: string[] }> = {
  'Dashboards ejecutivos': {
    titular: 'Una vista única de su negocio, actualizada sola',
    entregables: [
      'El estado del mes en una pantalla, sin que nadie arme nada',
      'Avance contra meta por persona, sucursal o línea',
      'Margen real por producto y por cliente',
      'Alertas cuando un número se sale de lo normal',
    ],
  },
  'Modelamiento de datos': {
    titular: 'Un solo número, y que ese número aguante ser revisado',
    entregables: [
      'Maestro único de clientes, productos y precios',
      'Sus sistemas conectados, sin exportar ni importar a mano',
      'Historia ordenada y comparable hacia atrás',
      'Cuadratura automática entre fuentes, con las diferencias a la vista',
    ],
  },
  'Automatización de procesos': {
    titular: 'Que el trabajo repetitivo deje de ocurrir',
    entregables: [
      'La consolidación que hoy es manual, corriendo sola',
      'Documentos y reportes que se emiten y se envían solos',
      'Validaciones que atajan el error antes de que llegue al informe',
      'El proceso sigue funcionando aunque la persona esté de vacaciones',
    ],
  },
  'Agentes IA': {
    titular: 'Algo que vigila su operación mientras usted hace otra cosa',
    entregables: [
      'Vigilancia continua de cobranza, stock, ventas y clientes',
      'Aviso apenas algo se sale del patrón, no al cierre de mes',
      'Reglas escritas de qué hacer en cada caso, iguales para todos',
      'Un resumen de lo que pasó y de lo que requiere su decisión',
    ],
  },
};

/** Va en todas las propuestas: es lo que la plataforma trae de fábrica. */
export const INCLUYE_SIEMPRE = [
  'Acceso con usuario y contraseña para cada persona',
  'Perfiles por rol: cada uno ve solo lo que le corresponde',
  'Actualización automática, sin cargar nada a mano',
  'Hosting, respaldos y monitoreo por nuestra cuenta',
  'Reunión periódica de revisión y ajuste',
];

/**
 * Plazos reales, no aspiracionales.
 *
 * OJO con la fase 3: NO dice "un desarrollo nuevo al mes". Ese es el retainer de
 * Preserva y describe otro negocio. El modelo de Buffo es construir el sistema y
 * después acompañarlo — mejora continua sobre lo que aparece en el uso. El monto
 * del acompañamiento no va en el informe: se conversa en la reunión.
 */
export const FASES = [
  { plazo: 'Semanas 1 y 2', que: 'Levantamiento y conexión', detalle: 'Vemos sus fuentes reales y las conectamos.' },
  { plazo: 'Semanas 3 y 4', que: 'Primera vista funcionando', detalle: 'Con sus datos, no con una demostración.' },
  {
    plazo: 'Mes 3 en adelante',
    que: 'Optimización continua',
    detalle: 'Recogemos lo que aparece en el uso y evaluamos qué otro proceso conviene atacar.',
  },
];

/**
 * Da credibilidad: no es software casero. Los logos son SVG monocromos
 * (simple-icons) en public/stack/, insertados en línea para que impriman como
 * vector y tomen el color por CSS.
 */
export const STACK = [
  { nombre: 'Supabase', archivo: 'supabase' },
  { nombre: 'Vercel', archivo: 'vercel' },
  { nombre: 'Anthropic', archivo: 'anthropic' },
  { nombre: 'Cloudflare', archivo: 'cloudflare' },
  { nombre: 'GitHub', archivo: 'github' },
];

export const RAMALES: Ramal[] = [
  {
    id: 'visibilidad',
    dolor: 'No tengo la foto de cómo va el negocio',
    detalle: 'Decido sin ver los números, o los veo cuando ya pasó el mes',
    servicio: 'Dashboards ejecutivos',
    icono: 'monitoring',
    preguntas: [
      {
        id: 'vis_metas',
        // Incluye al que contesta, no solo a "los vendedores": muchas empresas
        // no tienen fuerza de ventas y el dolor igual les aplica.
        texto: '¿Usted y su equipo saben cómo van contra su meta sin preguntarle a nadie?',
        opciones: [
          { valor: 'solos', texto: 'Sí, cada uno lo ve por su cuenta', puntos: 3 },
          { valor: 'envian', texto: 'Alguien lo prepara y lo reparte', puntos: 2 },
          { valor: 'preguntan', texto: 'Hay que preguntar', puntos: 1 },
          { valor: 'no_saben', texto: 'No lo sabemos', puntos: 0 },
        ],
      },
      {
        id: 'vis_margen',
        texto: 'Si le pregunto ahora el margen del producto que más vende, ¿en cuánto lo tiene?',
        opciones: [
          { valor: 'minutos', texto: 'En minutos', puntos: 3 },
          { valor: 'horas', texto: 'En unas horas', puntos: 2 },
          { valor: 'dias', texto: 'En días', puntos: 1 },
          { valor: 'imposible', texto: 'No se puede sacar', puntos: 0 },
        ],
      },
      {
        id: 'vis_fuga',
        texto: 'Cuando un cliente deja de comprar, ¿cuánto pasa antes de que alguien lo note?',
        opciones: [
          { valor: 'dias', texto: 'Días', puntos: 3 },
          { valor: 'semanas', texto: 'Semanas', puntos: 2 },
          { valor: 'meses', texto: 'Meses', puntos: 1 },
          { valor: 'tarde', texto: 'Nos enteramos cuando ya se fue', puntos: 0 },
        ],
      },
      {
        id: 'vis_fuente',
        texto: 'Los números que ve gerencia y los que ve el vendedor, ¿salen de la misma fuente?',
        opciones: [
          { valor: 'si', texto: 'Sí, la misma', puntos: 3 },
          { valor: 'no_se', texto: 'No estoy seguro', puntos: 1 },
          { valor: 'no_cuadran', texto: 'No, y a veces no cuadran', puntos: 0 },
        ],
      },
      {
        id: 'vis_anticipacion',
        texto: '¿Sabe hoy si va a cumplir la meta del mes, o lo sabe el día 30?',
        opciones: [
          { valor: 'semanas', texto: 'Lo sé con semanas de anticipación', puntos: 3 },
          { valor: 'intuyo', texto: 'Lo intuyo, sin números', puntos: 1 },
          { valor: 'dia_30', texto: 'Lo sé el día 30', puntos: 0 },
        ],
      },
    ],
  },
  {
    id: 'datos',
    dolor: 'Mis datos son un desorden',
    detalle: 'Están en mil partes, no cuadran entre sí, o no me fío de ellos',
    servicio: 'Modelamiento de datos',
    icono: 'schema',
    preguntas: [
      {
        id: 'dat_maestro',
        texto: 'El mismo producto o cliente, ¿aparece escrito distinto según el sistema?',
        opciones: [
          { valor: 'nunca', texto: 'No, está estandarizado', puntos: 3 },
          { valor: 'a_veces', texto: 'A veces', puntos: 1 },
          { valor: 'siempre', texto: 'Sí, es un problema conocido', puntos: 0 },
        ],
      },
      {
        id: 'dat_cuadratura',
        texto: 'Cuando dos reportes no cuadran, ¿cuánto toma saber cuál está bien?',
        opciones: [
          { valor: 'minutos', texto: 'Minutos', puntos: 3 },
          { valor: 'horas', texto: 'Horas', puntos: 2 },
          { valor: 'dias', texto: 'Días', puntos: 1 },
          { valor: 'se_elige', texto: 'Se elige uno y se sigue', puntos: 0 },
        ],
      },
      {
        id: 'dat_integracion',
        texto: '¿Su ERP conversa con lo demás, o todo pasa por exportar e importar a mano?',
        opciones: [
          { valor: 'integrado', texto: 'Está integrado', puntos: 3 },
          { valor: 'parcial', texto: 'Algunas cosas sí, otras a mano', puntos: 1 },
          { valor: 'manual', texto: 'Todo a mano', puntos: 0 },
        ],
      },
      {
        id: 'dat_fuente_unica',
        texto: '¿Existe UN lugar donde esté la versión correcta de productos, clientes y precios?',
        opciones: [
          { valor: 'si', texto: 'Sí, y se respeta', puntos: 3 },
          { valor: 'existe', texto: 'Existe, pero no todos lo usan', puntos: 1 },
          { valor: 'no', texto: 'No, cada área tiene el suyo', puntos: 0 },
        ],
      },
      {
        id: 'dat_historia',
        texto: 'Si necesita analizar los últimos tres años, ¿tiene esa historia disponible?',
        opciones: [
          { valor: 'limpia', texto: 'Sí, y está limpia', puntos: 3 },
          { valor: 'arreglar', texto: 'Sí, pero hay que arreglarla', puntos: 2 },
          { valor: 'parcial', texto: 'Solo una parte', puntos: 1 },
          { valor: 'no', texto: 'No la tenemos', puntos: 0 },
        ],
      },
    ],
  },
  {
    id: 'procesos',
    dolor: 'Mi equipo pierde horas en cosas repetitivas',
    detalle: 'Trabajo manual que se repite todos los meses y no agrega valor',
    servicio: 'Automatización de procesos',
    icono: 'precision_manufacturing',
    preguntas: [
      {
        id: 'pro_tarea',
        texto: '¿Cuál es la tarea repetitiva que más horas consume?',
        // Cinco opciones y no cuatro: si la tarea real no está en la lista, el
        // que contesta marca la menos mala y el análisis después la cita como
        // un hecho. Una frase falsa en el primer hallazgo hunde todo el informe.
        opciones: [
          { valor: 'consolidar', texto: 'Consolidar planillas', puntos: 1 },
          { valor: 'documentos', texto: 'Emitir documentos o facturas', puntos: 1 },
          { valor: 'revisar', texto: 'Revisar y validar información', puntos: 1 },
          { valor: 'consultas', texto: 'Responder las mismas consultas', puntos: 1 },
          { valor: 'traspaso', texto: 'Pasar datos de un sistema a otro', puntos: 0 },
        ],
      },
      {
        id: 'pro_frecuencia',
        texto: 'Esa tarea, ¿cuántas veces se hace al mes?',
        opciones: [
          { valor: 'una', texto: 'Una vez', puntos: 3 },
          { valor: 'semanal', texto: 'Todas las semanas', puntos: 2 },
          { valor: 'diaria', texto: 'Todos los días', puntos: 1 },
          { valor: 'constante', texto: 'Varias veces al día', puntos: 0 },
        ],
      },
      {
        id: 'pro_manos',
        texto: '¿Cuántas personas tocan el mismo dato antes de que quede listo?',
        opciones: [
          { valor: 'una', texto: 'Una', puntos: 3 },
          { valor: 'dos', texto: 'Dos', puntos: 2 },
          { valor: 'tres_mas', texto: 'Tres o más', puntos: 0 },
        ],
      },
      {
        id: 'pro_errores',
        texto: '¿Con qué frecuencia hay que rehacer algo por un error de tipeo o de copiado?',
        opciones: [
          { valor: 'casi_nunca', texto: 'Casi nunca', puntos: 3 },
          { valor: 'mensual', texto: 'Alguna vez al mes', puntos: 2 },
          { valor: 'semanal', texto: 'Todas las semanas', puntos: 1 },
          { valor: 'constante', texto: 'Es parte del día', puntos: 0 },
        ],
      },
      {
        id: 'pro_liberado',
        texto: 'Si esa tarea desapareciera mañana, ¿en qué se usaría ese tiempo?',
        opciones: [
          { valor: 'vender', texto: 'Vender más', puntos: 3 },
          { valor: 'clientes', texto: 'Atender mejor a los clientes', puntos: 3 },
          { valor: 'analizar', texto: 'Analizar en vez de recopilar', puntos: 3 },
          { valor: 'nada', texto: 'La verdad, no sé', puntos: 1 },
        ],
      },
    ],
  },
  {
    id: 'vigilancia',
    dolor: 'Me entero tarde de los problemas',
    detalle: 'Las cosas se detectan cuando ya son un problema, no antes',
    servicio: 'Agentes IA',
    icono: 'notifications_active',
    preguntas: [
      {
        id: 'vig_revision',
        texto: '¿Hay algo que hoy se revisa a mano todos los días solo para chequear que esté bien?',
        opciones: [
          { valor: 'no', texto: 'No, el sistema avisa solo', puntos: 3 },
          { valor: 'una', texto: 'Una cosa', puntos: 1 },
          { valor: 'varias', texto: 'Varias', puntos: 0 },
        ],
      },
      {
        id: 'vig_deteccion',
        texto:
          'Cuando algo se sale de lo normal (un cliente que no paga, un stock que se acaba), ¿cómo se entera?',
        opciones: [
          { valor: 'alerta', texto: 'Me llega una alerta automática', puntos: 3 },
          { valor: 'persona', texto: 'Alguien lo detecta a tiempo', puntos: 2 },
          { valor: 'reporte', texto: 'Lo vemos en el reporte del mes', puntos: 1 },
          { valor: 'tarde', texto: 'Nos enteramos cuando ya es un problema', puntos: 0 },
        ],
      },
      {
        id: 'vig_reaccion',
        texto: '¿Cuánto pasa entre que algo ocurre y alguien reacciona?',
        opciones: [
          { valor: 'mismo_dia', texto: 'El mismo día', puntos: 3 },
          { valor: 'semana', texto: 'Esa semana', puntos: 2 },
          { valor: 'mes', texto: 'Ese mes', puntos: 1 },
          { valor: 'indefinido', texto: 'No hay una reacción definida', puntos: 0 },
        ],
      },
      {
        id: 'vig_reglas',
        texto: '¿Hay reglas escritas de "si pasa X se hace Y", o depende del criterio de quien esté?',
        opciones: [
          { valor: 'escritas', texto: 'Están escritas y se siguen', puntos: 3 },
          { valor: 'algunas', texto: 'Algunas', puntos: 1 },
          { valor: 'persona', texto: 'Depende de la persona', puntos: 0 },
        ],
      },
      {
        id: 'vig_deseo',
        texto: '¿Qué le gustaría que alguien vigilara por usted mientras duerme?',
        opciones: [
          { valor: 'cobranza', texto: 'La cobranza y los pagos', puntos: 1 },
          { valor: 'ventas', texto: 'Las ventas y las metas', puntos: 1 },
          { valor: 'stock', texto: 'El stock y el abastecimiento', puntos: 1 },
          { valor: 'clientes', texto: 'Los clientes que se están yendo', puntos: 1 },
        ],
      },
    ],
  },
];

/** La última pregunta. Es texto libre y es la que entrega el argumento de venta. */
export const PREGUNTA_ABIERTA = {
  id: 'deseo',
  texto: 'Si mañana pudiera resolver una sola cosa que hoy no puede, ¿cuál sería?',
  ayuda: 'Una línea basta. Es la pregunta que más nos sirve.',
};

/** Tramos de madurez sobre el puntaje del tronco (0-100). */
export const TRAMOS = [
  { hasta: 35, etiqueta: 'A ciegas', resumen: 'Las decisiones se toman con información que llega tarde o no llega.' },
  { hasta: 60, etiqueta: 'Con esfuerzo', resumen: 'La información existe, pero cuesta caro sacarla y depende de personas.' },
  { hasta: 80, etiqueta: 'Ordenado', resumen: 'Hay control sobre lo importante; quedan focos manuales que se pueden cerrar.' },
  { hasta: 100, etiqueta: 'Bajo control', resumen: 'La operación es visible y confiable. El siguiente paso es anticipar, no mirar.' },
];

export function tramoDe(puntaje: number) {
  return TRAMOS.find((t) => puntaje <= t.hasta) ?? TRAMOS[TRAMOS.length - 1];
}

export const TOTAL_PREGUNTAS = TRONCO.length + 5 + 1;
