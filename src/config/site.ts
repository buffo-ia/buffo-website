// Configuración central del sitio — datos que cambian se editan acá, no en el código.
export const SITE = {
  name: 'Buffo IA Consulting',
  shortName: 'Buffo IA',
  url: 'https://buffoconsulting.cl',
  email: 'simon@buffoconsulting.cl',
  calendly: 'https://calendly.com/simon-buffoconsulting/llamada-de-consulta-buffo-ia',
  linkedin: 'https://www.linkedin.com/in/simón-andrés-espinoza/',
  locale: 'es_CL',
  defaultTitle: 'Buffo IA Consulting | Inteligencia Aplicada a la Gestión Empresarial',
  defaultDescription:
    'Consultora chilena especializada en inteligencia artificial para empresas. Dashboards ejecutivos, modelamiento de datos, automatización de procesos y agentes IA. Para pymes y grandes empresas en Chile.',
};

// Navegación principal (multipágina).
export const NAV = [
  { label: 'Servicios', href: '/servicios' },
  { label: 'Sobre nosotros', href: '/sobre-nosotros' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contacto' },
];

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
