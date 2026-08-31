// Medición del sitio — GA4 + Google Ads.
//
// Config separada del motor: cuando lleguen los identificadores que faltan se
// editan ACÁ y en ningún otro lado. No hay ningún ID escrito dentro del código.
//
// ⛔ Lo que se mide como conversión es EL DIAGNÓSTICO COMPLETADO: el informe
// pedido a la API, recibido y transmitido entero. No el clic en el botón ni la
// carga de /diagnostico. Marcarlo antes le enseña a Google a comprar el
// tráfico equivocado, porque cuenta como cliente a quien nunca vio el informe.

export const MEDICION = {
  /** GA4, propiedad "Buffo Consulting - Sitio" (flujo web 15515399905). */
  ga4: 'G-VSCTQ7SXXL',

  ads: {
    // ⏳ Cuenta 373-390-4052, hoy en BORRADOR: Google no entrega el AW- ni las
    // etiquetas mientras no haya facturación cargada. Formato: 'AW-123456789'.
    id: '',

    // Se pega el valor "send_to" COMPLETO tal como lo entrega Google al crear
    // la conversión ('AW-123456789/AbC-dEf_1234567890'), sin recortarlo: así no
    // hay que acordarse de armar la barra a mano. Vacío = no se manda a Ads,
    // pero el evento igual queda registrado en GA4.
    etiquetas: {
      diagnostico_completado: '',
      contacto_enviado: '',
    } as Record<string, string>,
  },

  /** Solo se mide en el sitio real. Las previews de rama y localhost no ensucian los datos. */
  dominios: ['buffoconsulting.cl', 'www.buffoconsulting.cl'],

  /** ?medicion=debug fuerza la medición fuera del dominio y activa DebugView de GA4. */
  parametroDebug: 'medicion',
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Registra un evento en GA4 y, si esa conversión ya tiene etiqueta de Ads, lo
 * reporta también como conversión.
 *
 * Es deliberadamente silencioso: si la medición no se cargó (localhost, preview,
 * bloqueador de anuncios), no hace nada y no rompe el flujo del usuario. Ningún
 * llamado a `medir()` debe poder impedir que alguien reciba su informe.
 */
export function medir(evento: string, params: Record<string, unknown> = {}): void {
  try {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', evento, params);

    const sendTo = MEDICION.ads.etiquetas[evento];
    if (sendTo) window.gtag('event', 'conversion', { send_to: sendTo, ...params });
  } catch {
    /* la medición nunca interrumpe al usuario */
  }
}
