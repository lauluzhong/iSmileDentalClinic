/**
 * Maps blog categories to the treatment pages they relate to.
 *
 * The 2026-07-29 audit found service pages had zero inbound links from the blog
 * and five posts had no internal links at all. Rather than hand-editing article
 * prose, every post gets a "Related treatments" block derived from its category,
 * rendered both in the React page and in the prerendered HTML.
 *
 * Category names in content/blog are inconsistently cased and pluralised, so
 * lookup is case-insensitive and falls back to the services overview.
 */

const BY_CATEGORY = {
  'orthodontics': ['straighten', 'clear-aligners'],
  'myofunctional orthodontics': ['myofunctional'],
  'myofunctional': ['myofunctional'],
  'kids & growth': ['children', 'myofunctional'],
  'pediatric': ['children', 'pediatric-dentistry'],
  'pediatric dentistry': ['children', 'pediatric-dentistry'],
  'oral surgery': ['wisdom-tooth'],
  'endodontics': ['root-canal'],
  'restorative': ['root-canal', 'dental-implants'],
  'restorative dentistry': ['root-canal', 'dental-implants'],
  'cosmetic': ['cosmetic-dentistry', 'teeth-whitening'],
  'cosmetic dentistry': ['cosmetic-dentistry', 'teeth-whitening'],
};

/** key -> { path, label } for the pages we link to. */
const TARGETS = {
  'straighten': { path: '/services/straighten', label: 'Teeth straightening' },
  'clear-aligners': { path: '/services/straighten/clear-aligners', label: 'Clear aligners' },
  'myofunctional': { path: '/services/children/myofunctional', label: 'Myofunctional orthodontics' },
  'children': { path: '/services/children', label: "Children's dentistry" },
  'pediatric-dentistry': { path: '/services/children/pediatric-dentistry', label: 'Pediatric dentistry' },
  'wisdom-tooth': { path: '/services/protect/wisdom-tooth', label: 'Wisdom tooth surgery' },
  'root-canal': { path: '/services/protect/root-canal', label: 'Root canal treatment' },
  'dental-implants': { path: '/services/replace/dental-implants', label: 'Dental implants' },
  'cosmetic-dentistry': { path: '/services/enhance/cosmetic-dentistry', label: 'Cosmetic dentistry' },
  'teeth-whitening': { path: '/services/enhance/teeth-whitening', label: 'Teeth whitening' },
  'services': { path: '/services', label: 'All dental services' },
};

/**
 * Related treatment links for a post's categories.
 * Always returns at least one link so no post is left without an internal link.
 */
export function relatedServices(categories = []) {
  const keys = [];
  for (const c of categories) {
    for (const k of BY_CATEGORY[String(c).trim().toLowerCase()] || []) {
      if (!keys.includes(k)) keys.push(k);
    }
  }
  if (!keys.length) keys.push('services');
  return keys.slice(0, 3).map((k) => TARGETS[k]).filter(Boolean);
}
