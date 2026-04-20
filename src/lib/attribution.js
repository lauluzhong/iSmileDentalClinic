/**
 * Attribution utility for GA4 event tracking.
 * Captures landing page, UTM parameters, and provides consistent attribution data.
 */

const ATTRIBUTION_STORAGE_KEY = 'ismile_attribution';

/**
 * Get attribution data from sessionStorage or initialize from current URL.
 * Returns object with:
 * - landing_page: first page visited in this session
 * - source_medium: utm_medium or 'direct'
 * - utm_source, utm_campaign, utm_term, utm_content (if present)
 * - current_path: current page path (should be passed separately)
 */
export function getAttributionData() {
  // Try to load from sessionStorage
  const stored = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
  let attribution = stored ? JSON.parse(stored) : null;

  // Parse UTM parameters from current URL
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmTerm = urlParams.get('utm_term');
  const utmContent = urlParams.get('utm_content');

  const hasUtm = utmSource || utmMedium || utmCampaign || utmTerm || utmContent;

  // If no stored attribution or UTM parameters are present (new session with UTM), (re)initialize
  if (!attribution || hasUtm) {
    attribution = {
      landing_page: window.location.pathname,
      source_medium: utmMedium || 'direct',
      utm_source: utmSource || null,
      utm_campaign: utmCampaign || null,
      utm_term: utmTerm || null,
      utm_content: utmContent || null,
      // Timestamp for debugging
      initialized_at: new Date().toISOString(),
    };
    sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  }

  return attribution;
}

/**
 * Enrich GA4 event with attribution parameters.
 * @param {Object} eventData - Base event data (will be extended)
 * @param {string} ctaLocation - CTA location identifier (e.g., 'header-booking', 'footer-whatsapp')
 * @returns {Object} Enriched event data ready for dataLayer.push
 */
export function enrichEvent(eventData, ctaLocation = null) {
  const attribution = getAttributionData();
  const enriched = {
    ...eventData,
    current_path: window.location.pathname,
    landing_page: attribution.landing_page,
    source_medium: attribution.source_medium,
    utm_source: attribution.utm_source,
    utm_campaign: attribution.utm_campaign,
    utm_term: attribution.utm_term,
    utm_content: attribution.utm_content,
  };
  if (ctaLocation) {
    enriched.cta_location = ctaLocation;
  }
  return enriched;
}

/**
 * Initialize attribution on first page load.
 * Should be called once when the app mounts.
 */
export function initAttribution() {
  // Ensure attribution is stored for this session
  getAttributionData();
}