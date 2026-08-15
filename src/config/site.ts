// Configuración central del sitio — datos que cambian se editan acá, no en el código.
export const SITE = {
  name: 'Buffo IA Consulting',
  shortName: 'Buffo IA',
  url: 'https://buffoconsulting.cl',
  email: 'contacto@buffoconsulting.cl',
  calendly: 'https://calendly.com/simon-buffoconsulting/llamada-de-consulta-buffo-ia',
  linkedin: 'https://www.linkedin.com/in/simón-andrés-espinoza/',
  // ⚠️ Hoy es la línea personal de Simón. Ya es pública (está en el Google
  // Business Profile y en los datos fiscales), así que publicarla acá no la
  // expone más. Cuando llegue la eSIM de negocio, se cambia SOLO acá.
  whatsapp: '56983731652',
  whatsappMensaje: 'Hola, vengo del sitio de Buffo y quiero hacer una consulta.',
  locale: 'es_CL',
  defaultTitle:
    'Consultoría en Inteligencia Artificial aplicada a la gestión · Chile | Buffo IA',
  defaultDescription:
    'Consultora chilena de inteligencia artificial aplicada a la gestión. Dashboards ejecutivos, modelamiento de datos, automatización y agentes IA para que la decisión se tome a tiempo.',
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
  { label: 'Diagnóstico', href: '/diagnostico' },
  { label: 'Sobre nosotros', href: '/sobre-nosotros' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contacto' },
];

// El dolor con el que el cliente entra a cada servicio. Fuente única para la home
// y para /servicios: el dolor manda, el nombre del producto va de eyebrow.
// Mismo texto que el selector de src/data/diagnostico.ts — no divergir.
export const SERVICE_PAINS: Record<string, string> = {
  'dashboards-ejecutivos': 'No tengo la foto de cómo va el negocio',
  'modelamiento-predictivo': 'Mis datos son un desorden',
  'automatizacion-procesos': 'Mi equipo pierde horas en cosas repetitivas',
  'agentes-ia': 'Me entero tarde de los problemas',
};

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
      'Tu negocio en tiempo real, sin reportería manual. Visualizaciones diseñadas para decidir en el momento, no a fin de mes.',
  },
  {
    slug: 'modelamiento-predictivo',
    icon: 'schema',
    title: 'Modelamiento de datos',
    short:
      'Conectamos tus fuentes y les damos sentido. Estructuramos el caos para que la información fluya hacia la rentabilidad.',
  },
  {
    slug: 'automatizacion-procesos',
    icon: 'precision_manufacturing',
    title: 'Automatización de procesos',
    short:
      'Elimina las tareas que no generan valor. Flujos que liberan el talento de tu equipo para lo que sí importa.',
  },
  {
    slug: 'agentes-ia',
    icon: 'smart_toy',
    title: 'Agentes IA',
    short:
      'Software que trabaja solo: monitorea tus datos, detecta lo importante y ejecuta tareas sin que se las pidas.',
  },
];
