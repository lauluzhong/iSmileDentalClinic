/**
 * One place that knows which lazy page chunk each URL needs.
 *
 * App.jsx builds its React.lazy() components from these same loader
 * functions, so calling a loader here warms exactly the chunk the route will
 * ask for: Vite splits by module, and a dynamic import of a module that is
 * already in flight or cached resolves without a second request.
 *
 * Two prefetch moments, both free to the visitor:
 *   - intent: pointer over / focus on / touch of any in-site link
 *   - idle:   a few seconds after load, the pages the header links to
 * Together they mean the route loading indicator (see Loader.jsx) almost
 * never gets a chance to show.
 */

export const pageLoaders = {
  about: () => import('../pages/About'),
  services: () => import('../pages/Services'),
  reviews: () => import('../pages/Reviews'),
  blog: () => import('../pages/Blog'),
  blogPost: () => import('../pages/BlogPost'),
  contact: () => import('../pages/Contact'),
  faq: () => import('../pages/FAQ'),
  recall: () => import('../pages/Recall'),
  careers: () => import('../pages/Careers'),
  careersDentists: () => import('../pages/CareersDentists'),
  careersTeam: () => import('../pages/CareersTeam'),
  careersJob: () => import('../pages/CareersJob'),
  dentists: () => import('../pages/Dentists'),
  notFound: () => import('../pages/NotFound'),
};

// Specialty pages nested under /services/* (lazy inside Services.jsx).
export const specialtyLoaders = {
  'protect/wisdom-tooth': () => import('../pages/specialties/WisdomToothSurgery'),
  'protect/root-canal': () => import('../pages/specialties/RootCanalTreatment'),
  'straighten/clear-aligners': () => import('../pages/specialties/ClearAligners'),
  'replace/dental-implants': () => import('../pages/specialties/DentalImplants'),
  'enhance/teeth-whitening': () => import('../pages/specialties/TeethWhitening'),
  'enhance/cosmetic-dentistry': () => import('../pages/specialties/CosmeticDentistry'),
  'children/myofunctional': () => import('../pages/specialties/MyofunctionalOrthodontics'),
  'children/pediatric-dentistry': () => import('../pages/specialties/PediatricDentistry'),
  'locations/damansara-jaya': () => import('../pages/locations/DamansaraJaya'),
};

const started = new Set();

function run(key, loader) {
  if (!loader || started.has(key)) return;
  started.add(key);
  // A failed prefetch is not an error the visitor should hear about; the
  // real navigation will retry the import itself.
  loader().catch(() => started.delete(key));
}

/** Warm the chunk(s) a pathname will need. Safe to call repeatedly. */
export function prefetchRoute(pathname) {
  if (typeof pathname !== 'string') return;
  const path = pathname.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  if (path === '/') return;

  const [, first, ...rest] = path.split('/');
  switch (first) {
    case 'about': return run('about', pageLoaders.about);
    case 'reviews': return run('reviews', pageLoaders.reviews);
    case 'contact': return run('contact', pageLoaders.contact);
    case 'faq': return run('faq', pageLoaders.faq);
    case 'recall': return run('recall', pageLoaders.recall);
    case 'join-us': return run('careersDentists', pageLoaders.careersDentists);
    case 'careers':
      run('careers', pageLoaders.careers);
      if (rest[0] === 'dentists') run('careersDentists', pageLoaders.careersDentists);
      else if (rest[0] === 'team') run('careersTeam', pageLoaders.careersTeam);
      else if (rest.length) run('careersJob', pageLoaders.careersJob);
      return;
    case 'dentists': return run('dentists', pageLoaders.dentists);
    case 'blog':
      run('blog', pageLoaders.blog);
      if (rest.length) run('blogPost', pageLoaders.blogPost);
      return;
    case 'services': {
      run('services', pageLoaders.services);
      const sub = rest.join('/');
      if (specialtyLoaders[sub]) run(`services/${sub}`, specialtyLoaders[sub]);
      return;
    }
    default:
      return;
  }
}

function visitorPrefersLightPayloads() {
  const c = typeof navigator !== 'undefined' && navigator.connection;
  if (!c) return false;
  return !!c.saveData || /(^|-)2g$/.test(c.effectiveType || '');
}

/**
 * Wire the two prefetch moments. Returns a cleanup function.
 * Delegated listeners: the header re-renders its links often, and the body
 * copy links to pages too, so one listener on the document beats wiring
 * every <Link>.
 */
export function installRoutePrefetch() {
  if (typeof window === 'undefined') return () => {};
  if (visitorPrefersLightPayloads()) return () => {};

  const fromEvent = (e) => {
    const a = e.target?.closest?.('a[href]');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('/') || href.startsWith('//')) return;
    prefetchRoute(href);
  };
  const opts = { passive: true, capture: true };
  document.addEventListener('mouseover', fromEvent, opts);
  document.addEventListener('touchstart', fromEvent, opts);
  document.addEventListener('focusin', fromEvent, opts);

  // Idle: the pages one tap away from any header, in the order the nav lists
  // them. Deferred past first paint and the LCP image so it never competes
  // with the page the visitor is actually reading.
  const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 2500));
  const cancelIdle = window.cancelIdleCallback || window.clearTimeout;
  const handle = idle(() => {
    ['/services', '/about', '/dentists', '/reviews', '/blog', '/careers', '/contact', '/faq']
      .forEach(prefetchRoute);
  }, { timeout: 6000 });

  return () => {
    cancelIdle(handle);
    document.removeEventListener('mouseover', fromEvent, opts);
    document.removeEventListener('touchstart', fromEvent, opts);
    document.removeEventListener('focusin', fromEvent, opts);
  };
}
