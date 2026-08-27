/**
 * Long-form service-page body copy, keyed by page path.
 *
 * Why this exists: /services/* pages used to prerender little more than an <h1>
 * and the meta description (~160 rendered words), because the only copy the
 * build-time prerenderer had was src/data/serviceSeo.js. This module is the
 * place the long-form copy lives, and vite-plugin-blog-ssg.js renders it into
 * the crawlable #ssg-content block.
 *
 * Each page module default-exports:
 *
 *   {
 *     path: 'services/children',
 *     sections: [ { heading: 'string', body: 'plain text\n\nparagraphs' } ],
 *     faqs: [ { q: 'string', a: 'string' } ],
 *   }
 *
 * `body` is PLAIN TEXT, not HTML — the renderer escapes it and splits on blank
 * lines into <p> elements. Do not put markup in it.
 *
 * FAQs here are merged with (and de-duplicated against) the FAQs already in
 * serviceSeo.js; serviceSeo.js wins on a duplicate question.
 *
 * The page modules are owned by the content workstream. Anything malformed is
 * dropped rather than allowed to break the build — see normalise() below.
 */

import children from './children.js';
import straighten from './straighten.js';
import replace from './replace.js';
import enhance from './enhance.js';

const asString = (v) => (typeof v === 'string' ? v.trim() : '');

function normalise(page) {
  if (!page || typeof page !== 'object') return null;
  const path = asString(page.path);
  if (!path) return null;

  const sections = (Array.isArray(page.sections) ? page.sections : [])
    .map((s) => ({ heading: asString(s && s.heading), body: asString(s && s.body) }))
    .filter((s) => s.heading || s.body);

  const faqs = (Array.isArray(page.faqs) ? page.faqs : [])
    .map((f) => ({ q: asString(f && f.q), a: asString(f && f.a) }))
    .filter((f) => f.q && f.a);

  return { path, sections, faqs };
}

export const SERVICE_CONTENT = Object.fromEntries(
  [children, straighten, replace, enhance]
    .map(normalise)
    .filter(Boolean)
    .map((p) => [p.path, p])
);

/** Long-form content for a page path, or an empty shape when there is none. */
export function serviceContentFor(path) {
  return SERVICE_CONTENT[path] || { path, sections: [], faqs: [] };
}

export default SERVICE_CONTENT;
