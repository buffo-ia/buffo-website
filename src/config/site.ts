// Configuración central del sitio — datos que cambian se editan acá, no en el código.
export const SITE = {
  name: 'Buffo IA Consulting',
  shortName: 'Buffo IA',
  url: 'https://buffoconsulting.cl',
  email: 'contacto@buffoconsulting.cl',
  calendly: 'https://calendly.com/simon-buffoconsulting/llamada-de-consulta-buffo-ia',
  linkedin: 'https://www.linkedin.com/in/simón-andrés-espinoza/',
  locale: 'es_CL',
  defaultTitle: 'Buffo IA Consulting | Inteligencia Aplicada a la Gestión Empresarial',
  defaultDescription:
    'Consultora chilena especializada en inteligencia artificial para empresas. Dashboards ejecutivos, modelamiento de datos, automatización de procesos y agentes IA. Para pymes y grandes empresas en Chile.',
};

// Líder visible de la empresa — alimenta la página "Sobre nosotros" y será el
// autor (Person schema) que firme los artículos del blog. E-E-A-T.
export const FOUNDER = {
  name: 'Simón Espinoza Carvajal',
  role: 'Fundador y Director',
  education: [
    'Ingeniero Comercial · Universidad Central',
    'Certificado en Análisis de Bases de Datos · PUC',
    'Certificado en Marketing Digital · Google',
    'Diplomado en IA Aplicada a los Negocios · Universidad del Desarrollo',
    'MBA · Universidad del Desarrollo',
  ],
  // Para schema Person.alumniOf (sin duplicar instituciones)
  alumniOf: [
    'Universidad Central',
    'Pontificia Universidad Católica de Chile',
    'Universidad del Desarrollo',
  ],
  linkedin: 'https://www.linkedin.com/in/simón-andrés-espinoza/',
  bio: 'Ingeniero Comercial con MBA de la Universidad del Desarrollo y formación especializada en inteligencia artificial y análisis de datos. Cuenta con más de diez años de experiencia en retail y consumo masivo, en áreas comerciales de grandes marcas, y dos años en consultoría comercial, IA empresarial y automatización de procesos. Esa combinación —negocio y tecnología— es el origen de la mirada de Buffo: la inteligencia artificial al servicio de decisiones de negocio, no de la tecnología por sí misma.',
};

// El formulario de contacto envía a la función serverless /api/contacto.js,
// que despacha los correos vía Resend (dominio raíz verificado buffoconsulting.cl).

// Navegación principal (multipágina).
export const NAV = [
  { label: 'Servicios', href: '/servicios' },
  { label: 'Sobre nosotros', href: '/sobre-nosotros' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contacto' },
];

// Categorías del blog (clusters). Cada una se vincula al servicio relacionado
// para el enlazado interno pilar/cluster que pide el plan SEO.
export const BLOG_CATEGORIES: Record<string, { label: string; service: string | null }> = {
  general: { label: 'Estrategia IA', service: null },
  'dashboards-ejecutivos': { label: 'Dashboards', service: '/servicios/dashboards-ejecutivos' },
  'modelamiento-predictivo': { label: 'Datos', service: '/servicios/modelamiento-predictivo' },
  'automatizacion-procesos': { label: 'Automatización', service: '/servicios/automatizacion-procesos' },
  'agentes-ia': { label: 'Agentes IA', service: '/servicios/agentes-ia' },
};

// Los 4 servicios — fuente única para cards de home, página madre y schema.
export const SERVICES = [
  {
    slug: 'dashboards-ejecutivos',
    icon: 'dashboard_customize',
    title: 'Dashboards ejecutivos',
    short:
      'Su negocio en tiempo real, sin reportes manuales. Visualizaciones diseñadas para la toma de decisiones inmediata.',
  },
  {
    slug: 'modelamiento-predictivo',
    icon: 'schema',
    title: 'Modelamiento de datos',
    short:
      'Conectamos sus fuentes y les damos sentido. Estructuramos el caos para que la información fluya hacia la rentabilidad.',
  },
  {
    slug: 'automatizacion-procesos',
    icon: 'precision_manufacturing',
    title: 'Automatización de procesos',
    short:
      'Elimine tareas que no generan valor. Flujos inteligentes que liberan el talento de su equipo para lo que importa.',
  },
  {
    slug: 'agentes-ia',
    icon: 'smart_toy',
    title: 'Agentes IA',
    short:
      'Software que trabaja solo: monitorea sus datos, detecta lo importante y ejecuta tareas sin que se las pidan.',
  },
];
