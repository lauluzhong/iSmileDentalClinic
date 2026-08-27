/**
 * Maps each service / specialty page to the blog posts worth reading next.
 *
 * The reverse direction already exists: src/data/blogServiceLinks.js sends blog
 * readers to treatment pages. This file closes the loop. Service pages ended at
 * the "Ready for a healthier smile?" CTA with nothing below it, so a visitor who
 * was not ready to book had nowhere to go, and 40+ articles sat unlinked from
 * the pages that rank for the commercial terms.
 *
 * Two inputs per page:
 *   pinned  — editorial order, always first. This is the knob to turn.
 *   tags    — matched (case-insensitive) against a post's tags AND categories,
 *             so a new article surfaces on the right page without anyone
 *             editing this file. Fills whatever pinned leaves empty.
 *
 * Keys are the page path without a leading slash, matching src/data/serviceSeo.js
 * so the React pages and the build-time prerenderer can share one lookup.
 */

export const SERVICE_BLOG_TOPICS = {
  // ── Category hubs ──────────────────────────────────────────────────────
  'services/protect': {
    pinned: [
      'why-do-my-gums-bleed',
      'dental-crowns-vs-fillings',
      'damansara-jaya-dental-visit-patient-checklist',
    ],
    tags: ['Preventive Care', 'Oral Health', 'Restorative Dentistry'],
  },
  'services/straighten': {
    pinned: [
      'clear-aligners-vs-braces',
      'government-vs-private-braces',
      'how-to-choose-orthodontist-petaling-jaya',
    ],
    tags: ['Orthodontics', 'Traditional Braces', 'Clear Aligners'],
  },
  'services/replace': {
    pinned: [
      'dental-implants-malaysia-explained',
      'dental-implant-consultation-damansara-jaya',
      'dental-crowns-malaysia',
    ],
    tags: ['Dental Implants', 'Restorative Dentistry'],
  },
  'services/enhance': {
    pinned: [
      'composite-vs-porcelain-veneers',
      'is-teeth-whitening-safe',
      'cosmetic-dentistry-at-ismile-damansara-jaya',
    ],
    tags: ['Cosmetic Dentistry'],
  },
  'services/children': {
    // 'preparing-child-first-dental-visit' rather than the shorter
    // 'your-childs-first-dental-visit': the two cover the same ground, and the
    // shorter one is already pinned on /services/children/pediatric-dentistry,
    // so pinning the longer one here gives each an inbound link of its own
    // instead of pointing both pages at the same article.
    pinned: [
      'preparing-child-first-dental-visit',
      'why-baby-teeth-matter',
      'early-orthodontic-assessment-children',
    ],
    tags: ['Pediatric Dentistry', 'Kids & Growth', 'Myofunctional Orthodontics'],
  },

  // ── Specialty (featured) pages ─────────────────────────────────────────
  'services/protect/wisdom-tooth': {
    pinned: [
      'wisdom-tooth-surgery',
      'wisdom-tooth-removal-damansara-jaya-guide',
      'emergency-dental-care-damansara-jaya',
    ],
    tags: ['Oral Surgery', 'Emergency Dental'],
  },
  'services/protect/root-canal': {
    pinned: [
      'root-canal-treatment-damansara-jaya',
      'dental-crowns-vs-fillings',
      'dental-crowns-malaysia',
    ],
    tags: ['Endodontics', 'Restorative Dentistry'],
  },
  'services/straighten/clear-aligners': {
    pinned: [
      'clear-aligners-vs-braces',
      'invisalign-malaysia-explained',
      'clear-aligner-treatment-complexity',
    ],
    tags: ['Clear Aligners', 'Orthodontics'],
  },
  'services/replace/dental-implants': {
    pinned: [
      'dental-implants-malaysia-explained',
      'dental-implant-consultation-damansara-jaya',
      'dental-crowns-malaysia',
    ],
    tags: ['Dental Implants', 'Restorative Dentistry'],
  },
  'services/enhance/teeth-whitening': {
    pinned: [
      'is-teeth-whitening-safe',
      'teeth-whitening-sensitive-teeth',
      'cosmetic-dentistry-at-ismile-damansara-jaya',
    ],
    tags: ['Cosmetic Dentistry'],
  },
  'services/enhance/cosmetic-dentistry': {
    pinned: [
      'composite-vs-porcelain-veneers',
      'cosmetic-dentistry-at-ismile-damansara-jaya',
      'is-teeth-whitening-safe',
    ],
    tags: ['Cosmetic Dentistry'],
  },
  'services/children/myofunctional': {
    // 'myofunctional-therapy-exercises-kids-home' answers the question this
    // page leaves open (what the therapy actually involves day to day), and it
    // had no inbound link from anywhere in the service tree.
    // 'myofunctional-therapy-before-after-braces' keeps its link from
    // /blog/child-candidate-myofunctional-orthodontics.
    pinned: [
      'mouth-breathing-in-children',
      'child-candidate-myofunctional-orthodontics',
      'myofunctional-therapy-exercises-kids-home',
    ],
    tags: ['Myofunctional Orthodontics'],
  },
  'services/children/pediatric-dentistry': {
    // Not 'preparing-child-first-dental-visit': it shares both its topic and
    // its hero image with your-childs-first-dental-visit, so the row rendered
    // as the same photo twice.
    pinned: [
      'your-childs-first-dental-visit',
      'why-baby-teeth-matter',
      'when-should-children-stop-sucking-thumb',
    ],
    tags: ['Pediatric Dentistry', 'Kids & Growth'],
  },

  // ── Services overview ──────────────────────────────────────────────────
  'services': {
    pinned: [
      'damansara-jaya-dental-clinic-what-to-ask',
      'family-dental-care-damansara-jaya-all-ages',
      'damansara-jaya-dental-visit-patient-checklist',
    ],
    tags: ['Preventive Care', 'Oral Health'],
  },
};

/** Normalise "/services/straighten/" -> "services/straighten". */
export function normalizeServiceKey(pathname = '') {
  return String(pathname).replace(/^\/+/, '').replace(/\/+$/, '');
}

/**
 * Posts to show under a service page, pinned first then tag matches by date.
 *
 * Takes the blog index as an argument rather than importing it: the Vite SSG
 * plugin runs in plain Node and reads src/data/blog-index.json off disk, while
 * the React pages get it through Vite's JSON import. One code path, two callers.
 */
export function pickRelatedPosts(blogIndex, pathname, limit = 3) {
  const topic = SERVICE_BLOG_TOPICS[normalizeServiceKey(pathname)];
  if (!topic || !Array.isArray(blogIndex)) return [];

  const bySlug = new Map(blogIndex.map((p) => [p.slug, p]));
  const chosen = [];
  const seen = new Set();

  for (const slug of topic.pinned || []) {
    const post = bySlug.get(slug);
    if (post && !seen.has(slug)) {
      seen.add(slug);
      chosen.push(post);
    }
  }
  if (chosen.length >= limit) return chosen.slice(0, limit);

  const wanted = new Set((topic.tags || []).map((t) => t.toLowerCase()));
  const matches = blogIndex
    .filter((p) => {
      if (seen.has(p.slug)) return false;
      const labels = [...(p.tags || []), ...(p.categories || [])];
      return labels.some((l) => wanted.has(String(l).trim().toLowerCase()));
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return [...chosen, ...matches].slice(0, limit);
}
