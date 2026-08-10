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
    pinned: [
      'your-childs-first-dental-visit',
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
    pinned: [
      'mouth-breathing-in-children',
      'child-candidate-myofunctional-orthodontics',
      'myofunctional-therapy-before-after-braces',
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

/**
 * Stand-in hero images for posts whose frontmatter has none.
 *
 * Every locality post (14 of 44) was written without an `img:`, so an
 * image-led card would show a hole exactly where the commercially useful
 * "<treatment> in Damansara Jaya" articles sit. These are existing clinic
 * photos picked so no two cards on the same page repeat an image.
 *
 * This is a patch at the display layer, not the fix. The real fix is an `img:`
 * in each post's frontmatter, which would also repair the /blog listing — it
 * currently renders a broken <img> for these same 14 posts.
 */
const IMAGE_FALLBACKS = {
  'damansara-jaya-dental-visit-patient-checklist': '/images/blog/dentist_xray.png',
  'damansara-jaya-dental-clinic-what-to-ask': '/images/team_group.jpg',
  'dental-clinic-near-atria-shopping-gallery-checklist': '/images/team_group.jpg',
  'family-dental-care-damansara-jaya-all-ages': '/images/family_hero_three_generations.jpg',
  'family-dental-check-up-planning-damansara-jaya-parents': '/images/family_hero_three_generations.jpg',
  'dental-implant-consultation-damansara-jaya': '/images/bone_loss_hero_1765825236985.png',
  'root-canal-treatment-damansara-jaya': '/images/blog/root_canal_vs_extraction_hero.png',
  'wisdom-tooth-removal-damansara-jaya-guide': '/images/blog/dentist_xray.png',
  'emergency-dental-care-damansara-jaya': '/images/sensitivity_hero_1765825197668.png',
  'cosmetic-dentistry-at-ismile-damansara-jaya': '/images/blog/asian_couple_40s.png',
  'clear-aligner-options-damansara-jaya': '/images/invisalign_hand.png',
  'invisalign-and-clear-aligners-in-damansara-jaya': '/images/invisalign_hand.png',
  'pediatric-dental-care-damansara-jaya-parents-guide': '/images/dentist-child.png',
  'pediatric-dentistry-damansara-jaya-our-approach-to-childrens-dental-health': '/images/dentist-child.png',
};

/** The image to show for a post: its own hero, else the stand-in above. */
export function postImage(post) {
  return post?.img || IMAGE_FALLBACKS[post?.slug] || null;
}

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
