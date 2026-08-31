import fs from 'fs';
import path from 'path';
import { SERVICE_CATEGORIES, SERVICE_SPECIALTIES } from './src/data/serviceSeo.js';
import { CORE_PAGES } from './src/data/corePagesSeo.js';
import dentists, { dentistSeo } from './src/data/dentists.js';
import { relatedServices } from './src/data/blogServiceLinks.js';
import { pickRelatedPosts } from './src/data/serviceBlogLinks.js';
import { SERVICE_CONTENT } from './src/data/serviceContent/index.js';
import { servicesData } from './src/data/servicesData.jsx';
import imageVariants from './src/data/image-variants.json' with { type: 'json' };

const SITE_URL = 'https://ismile.com.my';

// Mirrors <ResponsiveImage> for the pre-rendered shell. Without this the static
// HTML requests the full-size original before React hydrates, which is exactly
// the byte weight the responsive variants exist to avoid.
const IMG_STYLE = 'max-width:100%;height:auto;border-radius:12px;margin:20px 0';
const IMG_SIZES = '(max-width: 900px) 100vw, 900px';

function responsiveImgTag(src, safeTitle) {
  const entry = imageVariants[src];
  if (!entry || !entry.variants || entry.variants.length === 0) {
    return '    <img src="' + escapeHtml(src) + '" alt="' + safeTitle + '" style="' + IMG_STYLE + '" />';
  }
  const set = (key) => entry.variants.map(v => v[key] + ' ' + v.w + 'w').join(', ');
  return [
    '    <picture>',
    '      <source type="image/avif" srcset="' + set('avif') + '" sizes="' + IMG_SIZES + '" />',
    '      <source type="image/webp" srcset="' + set('webp') + '" sizes="' + IMG_SIZES + '" />',
    '      <source type="' + entry.fallbackType + '" srcset="' + set('raster') + '" sizes="' + IMG_SIZES + '" />',
    '      <img src="' + escapeHtml(src) + '" srcset="' + set('raster') + '" sizes="' + IMG_SIZES + '" alt="' + safeTitle + '" width="' + entry.width + '" height="' + entry.height + '" style="' + IMG_STYLE + '" />',
    '    </picture>',
  ].join('\n');
}


const GTM_HEAD = [
  '  <!-- Google Tag Manager -->',
  '  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':',
  '  new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],',
  '  j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=',
  '  \'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);',
  '  })(window,document,\'script\',\'dataLayer\',\'GTM-NR9PQ2H7\');<\/script>',
  '  <!-- End Google Tag Manager -->',
].join('\n');

const GTM_BODY = [
  '  <!-- Google Tag Manager (noscript) -->',
  '  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NR9PQ2H7"',
  '  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>',
  '  <!-- End Google Tag Manager (noscript) -->',
].join('\n');

// Strips the pre-rendered block once React has mounted, so crawlers get static
// content while users get the SPA.
const HYDRATION_SWAP = [
  '  <script>',
  '    (function(){',
  '      var o=new MutationObserver(function(){',
  '        var r=document.getElementById(\'root\');',
  '        if(r&&r.children.length>0){',
  '          var s=document.getElementById(\'ssg-content\');',
  '          if(s)s.remove();',
  '          o.disconnect();',
  '        }',
  '      });',
  '      var r=document.getElementById(\'root\');',
  '      if(r)o.observe(r,{childList:true});',
  '    })();',
  '  <\/script>',
].join('\n');

// Homepage-only guard. dist/index.html is BOTH the prerendered "/" document and
// the fallback shell that vercel.json rewrites every unmatched route to (e.g.
// /recall, trailing-slash variants, 404s). Without this, those routes would show
// homepage markup until React booted — the exact flash-of-wrong-content we are
// trying to avoid. This runs in <head>, before the body is parsed, so the block
// is display:none from its very first layout on any non-home path; HOME_SWAP
// then deletes it outright. On "/" nothing happens and the content paints.
const HOME_PATH_GUARD = [
  '  <script>',
  '    (function(){',
  '      var p=location.pathname;',
  '      if(p===\'/\'||p===\'\'||p===\'/index.html\')return;',
  '      var s=document.createElement(\'style\');',
  '      s.textContent=\'#ssg-content{display:none!important}\';',
  '      document.head.appendChild(s);',
  '      document.addEventListener(\'DOMContentLoaded\',function(){',
  '        var e=document.getElementById(\'ssg-content\');',
  '        if(e)e.remove();',
  '      });',
  '    })();',
  '  <\/script>',
].join('\n');

// The 2026-07-29 link audit found that Header.jsx and Footer.jsx only render
// after React mounts, so every prerendered page shipped ZERO outgoing links —
// a crawler's first fetch of a service page saw a dead end, and the whole
// 44-post blog cluster hung off /blog, which nothing linked to. This static
// nav goes inside #ssg-content, so HYDRATION_SWAP removes it when the real
// header takes over and users never see two navs.
const STATIC_NAV_LINKS = [
  ['/', 'Home'],
  ['/about', 'About Us'],
  ['/dentists', 'Our Dentists'],
  ['/services', 'Services'],
  ['/services/protect', 'Protect Your Teeth'],
  ['/services/straighten', 'Straighten Your Teeth'],
  ['/services/replace', 'Replace Missing Teeth'],
  ['/services/enhance', 'Enhance Your Smile'],
  ['/services/children', "Children's Dentistry"],
  ['/services/locations/damansara-jaya', 'Dentist in Damansara Jaya'],
  ['/blog', 'Blog'],
  ['/reviews', 'Patient Reviews'],
  ['/faq', 'FAQs'],
  ['/contact', 'Contact'],
];

function staticNav(currentPath) {
  const items = STATIC_NAV_LINKS
    .filter(([href]) => href !== currentPath)
    .map(([href, label]) => '<li><a href="' + href + '">' + escapeHtml(label) + '</a></li>')
    .join('');
  return '    <nav aria-label="Site"><ul>' + items + '</ul></nav>';
}

/**
 * Assemble one pre-rendered page. Shared by blog posts, location pages and
 * service pages so the head/GTM/hydration boilerplate lives in exactly one place.
 */
function buildPage({ title, ogTitle, description, canonicalUrl, ogType, ogImage,
                     extraMeta = [], jsonLd = [], body, cssLink, scriptTag,
                     currentPath = '' }) {
  // Social cards use the bare headline; only <title> carries the site suffix.
  const social = ogTitle || title;
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '  <meta name="facebook-domain-verification" content="76cn9giu5poxaecud7uc1atvnejnjc" />',
    '',
    '  <title>' + title + '</title>',
    '  <meta name="description" content="' + description + '" />',
    '  <link rel="canonical" href="' + canonicalUrl + '" />',
    '',
    '  <!-- Open Graph / Facebook -->',
    '  <meta property="og:type" content="' + ogType + '" />',
    '  <meta property="og:url" content="' + canonicalUrl + '" />',
    '  <meta property="og:title" content="' + social + '" />',
    '  <meta property="og:description" content="' + description + '" />',
    '  <meta property="og:image" content="' + ogImage + '" />',
    '  <meta property="og:site_name" content="iSmile Dental Clinic" />',
    ...extraMeta,
    '',
    '  <!-- Twitter Card -->',
    '  <meta name="twitter:card" content="summary_large_image" />',
    '  <meta name="twitter:title" content="' + social + '" />',
    '  <meta name="twitter:description" content="' + description + '" />',
    '  <meta name="twitter:image" content="' + ogImage + '" />',
    '',
    '  <!-- Fonts -->',
    '  <link rel="preconnect" href="https://fonts.googleapis.com">',
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">',
    '',
    '  <link rel="icon" type="image/png" href="/favicon.png" />',
    '  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
    '  <link rel="manifest" href="/manifest.json" />',
    cssLink,
    '',
    ...jsonLd.map(j => '  <script type="application/ld+json">' + j + '<\/script>'),
    '',
    GTM_HEAD,
    '</head>',
    '<body>',
    GTM_BODY,
    '',
    '  <!-- Pre-rendered content for SEO — removed once React mounts -->',
    '  <article id="ssg-content" style="max-width:800px;margin:80px auto;padding:0 20px;font-family:Inter,system-ui,sans-serif">',
    body,
    staticNav(currentPath),
    '  </article>',
    '',
    '  <!-- React SPA mount point -->',
    '  <div id="root"></div>',
    scriptTag,
    '',
    '  <!-- Remove static content once React renders into #root -->',
    HYDRATION_SWAP,
    '</body>',
    '</html>',
  ].filter(Boolean).join('\n');
}

/**
 * Vite plugin that generates static HTML files for each blog post at build time.
 * Runs in the closeBundle hook — after Vite has finished writing dist/.
 */
export default function blogSSG() {
  let isSsrBuild = false;

  return {
    name: 'vite-plugin-blog-ssg',
    apply: 'build',

    configResolved(config) {
      isSsrBuild = !!config.build.ssr;
    },

    closeBundle() {
      // The SSR pass emits dist-ssr/ for scripts/prerender-home.js. It shares
      // this config, so without the guard it would regenerate every static
      // page a second time from the server bundle.
      if (isSsrBuild) return;

      const root = process.cwd();
      const distDir = path.resolve(root, 'dist');

      // Single source of truth for the Google review count/rating —
      // kept in sync with the live GBP figures by the review_stats_sync cron.
      const reviewStats = JSON.parse(
        fs.readFileSync(path.resolve(root, 'src/data/review-stats.json'), 'utf-8')
      );

      // Location pages to generate
      const locationPages = [
        {
          slug: 'damansara-jaya',
          path: 'services/locations/damansara-jaya',
          title: 'Dentist in Damansara Jaya, PJ | iSmile Dental Clinic',
          description: 'Family dentist in Damansara Jaya, Petaling Jaya — check-ups, braces, implants & kids\' dentistry since 2006. Open Mon–Sat. WhatsApp us to book.',
          address: {
            streetAddress: '75 & 75A, Jalan SS 22/23',
            addressLocality: 'Damansara Jaya, Petaling Jaya',
            addressRegion: 'Selangor',
            postalCode: '47400',
            addressCountry: 'MY'
          },
          geo: {
            latitude: '3.12583430',
            longitude: '101.61623380'
          },
          openingHours: [
            'Mo-Fr 09:30-17:30',
            'Sa 09:30-15:30',
            'Su off'
          ],
          telephone: '+6016-322-2135',
          rating: {
            ratingValue: String(reviewStats.rating),
            reviewCount: String(reviewStats.count)
          }
        }
      ];

      const indexPath = path.resolve(root, 'src/data/blog-index.json');
      if (!fs.existsSync(indexPath)) {
        console.warn('[blog-ssg] src/data/blog-index.json not found — skipping.');
        return;
      }
      const blogIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
      console.log('[blog-ssg] Generating static HTML for ' + blogIndex.length + ' blog posts…');

      // Resolve hashed entry script and CSS from dist/assets/
      let entryScript = '';
      let entryCss = '';
      const assetsDir = path.resolve(distDir, 'assets');
      if (fs.existsSync(assetsDir)) {
        const files = fs.readdirSync(assetsDir);
        const jsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
        const cssFile = files.find(f => f.startsWith('index-') && f.endsWith('.css'));
        if (jsFile) entryScript = '/assets/' + jsFile;
        if (cssFile) entryCss = '/assets/' + cssFile;
      }

      let generated = 0;
      let skipped = 0;

      for (const entry of blogIndex) {
        const slug = entry.slug;
        const contentPath = path.resolve(root, 'public/blog-content/' + slug + '.json');

        if (!fs.existsSync(contentPath)) {
          console.warn('[blog-ssg]   ⚠ Skipping "' + slug + '" — content file not found.');
          skipped++;
          continue;
        }

        const post = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
        const canonicalUrl = SITE_URL + '/blog/' + slug;
        const ogImage = post.img && post.img.startsWith('http') ? post.img : SITE_URL + post.img;
        // seo_title/seo_description are SERP-only overrides; the on-page <h1>
        // and listing blurb keep using title/excerpt.
        const safeTitle = escapeHtml(post.title);
        const safeSeoTitle = escapeHtml(post.seo_title || post.title);
        const safeExcerpt = escapeHtml(post.seo_description || post.excerpt || '');
        const safeCategory = escapeHtml((post.categories && post.categories[0]) || post.category || '');
        const articleSection = post.categories ? post.categories.join(', ') : (post.category || '');

        const jsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "image": ogImage,
          "datePublished": post.date,
          "dateModified": post.date,
          "author": {
            "@type": "Organization",
            "name": "iSmile Dental Clinic",
            "url": SITE_URL
          },
          "publisher": {
            "@type": "Organization",
            "name": "iSmile Dental Clinic",
            "logo": { "@type": "ImageObject", "url": SITE_URL + "/logo.png" }
          },
          "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
          "articleSection": articleSection
        });

        // The React FAQ block renders as an accordion, so the answers only exist
        // once JS runs. Mirror them into the pre-rendered HTML (plain text + a
        // FAQPage graph) so crawlers that don't execute JS still read them.
        const faq = Array.isArray(post.faq) ? post.faq : [];
        const faqJsonLd = faq.length ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faq.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }) : '';
        const relatedHtml = (() => {
          const svcs = relatedServices(post.categories);
          if (!svcs.length) return '';
          return '    <section><h2>Related treatments</h2><ul>' +
            svcs.map(v => '<li><a href="' + v.path + '">' + escapeHtml(v.label) + '</a></li>').join('') +
            '</ul></section>';
        })();
        const faqHtml = faq.length
          ? '    <section><h2>Frequently Asked Questions</h2>' +
            faq.map(f => '<h3>' + escapeHtml(f.q) + '</h3><p>' + escapeHtml(f.a) + '</p>').join('') +
            '</section>'
          : '';

        const cssLink = entryCss ? '  <link rel="stylesheet" href="' + entryCss + '" />' : '';
        const imgTag = post.img ? responsiveImgTag(post.img, safeTitle) : '';
        const categorySpan = safeCategory ? ' &middot; ' + safeCategory : '';
        const scriptTag = entryScript ? '  <script type="module" src="' + entryScript + '"><\/script>' : '';

        const html = buildPage({
          title: safeSeoTitle + ' | iSmile Dental Clinic',
          ogTitle: safeTitle,
          description: safeExcerpt,
          canonicalUrl,
          currentPath: canonicalUrl.replace(SITE_URL, ''),
          ogType: 'article',
          ogImage,
          extraMeta: [
            '  <meta property="article:published_time" content="' + post.date + '" />',
            '  <meta property="article:section" content="' + safeCategory + '" />',
          ],
          jsonLd: faqJsonLd ? [jsonLd, faqJsonLd] : [jsonLd],
          body: [
            '    <h1>' + safeTitle + '</h1>',
            '    <p><time datetime="' + post.date + '">' + formatDate(post.date) + '</time>' + categorySpan + '</p>',
            imgTag,
            '    <div>' + (post.content || '') + '</div>',
            relatedHtml,
            faqHtml,
          ].filter(Boolean).join('\n'),
          cssLink,
          scriptTag,
        });

        const outDir = path.resolve(distDir, 'blog', slug);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.resolve(outDir, 'index.html'), html, 'utf-8');
        generated++;
      }

      console.log('[blog-ssg] ✓ Generated ' + generated + ' blog pages' + (skipped ? ', skipped ' + skipped : '') + '.');

      // Generate location pages
      let locationGenerated = 0;
      for (const location of locationPages) {
        const canonicalUrl = SITE_URL + '/' + location.path;
        const safeTitle = escapeHtml(location.title);
        const safeDescription = escapeHtml(location.description);
        const safeAddress = escapeHtml(location.address.streetAddress + ', ' + location.address.addressLocality + ', ' + location.address.addressRegion + ' ' + location.address.postalCode + ', ' + location.address.addressCountry);
        const safeTelephone = escapeHtml(location.telephone);

        // LocalBusiness JSON-LD
        const jsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "iSmile Dental Clinic - " + location.title,
          "description": location.description,
          "image": SITE_URL + "/logo.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": location.address.streetAddress,
            "addressLocality": location.address.addressLocality,
            "addressRegion": location.address.addressRegion,
            "postalCode": location.address.postalCode,
            "addressCountry": location.address.addressCountry
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": location.geo.latitude,
            "longitude": location.geo.longitude
          },
          "openingHours": location.openingHours,
          "telephone": location.telephone,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": location.rating.ratingValue,
            "reviewCount": location.rating.reviewCount,
            "bestRating": "5",
            "worstRating": "1"
          },
          "priceRange": "$$",
          "url": canonicalUrl,
          "sameAs": [
            "https://www.facebook.com/share/18RSFR4Zww/?mibextid=wwXIfr",
            "https://www.instagram.com/ismiledentalclinicmy"
          ]
        });

        const cssLink = entryCss ? '  <link rel="stylesheet" href="' + entryCss + '" />' : '';
        const scriptTag = entryScript ? '  <script type="module" src="' + entryScript + '"><\/script>' : '';

        const html = buildPage({
          title: safeTitle,
          description: safeDescription,
          canonicalUrl,
          currentPath: canonicalUrl.replace(SITE_URL, ''),
          ogType: 'website',
          ogImage: SITE_URL + '/logo.png',
          jsonLd: [jsonLd],
          body: [
            '    <h1>' + safeTitle + '</h1>',
            '    <p>' + safeDescription + '</p>',
            '    <address>' + safeAddress + '</address>',
            '    <p>Phone: ' + safeTelephone + '</p>',
            '    <p>Hours: ' + location.openingHours.join(', ') + '</p>',
          ].join('\n'),
          cssLink,
          scriptTag,
        });

        const outDir = path.resolve(distDir, location.path);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.resolve(outDir, 'index.html'), html, 'utf-8');
        locationGenerated++;
      }

      if (locationGenerated > 0) {
        console.log('[blog-ssg] ✓ Generated ' + locationGenerated + ' location pages.');
      }

      // ── Service pages ────────────────────────────────────────────────────
      // Without these, every /services/* URL served the bare SPA shell: Google
      // saw a duplicate of the homepage, and AI crawlers (which don't run JS)
      // saw nothing at all. Copy comes from src/data/serviceSeo.js, which the
      // React pages also read, so the static and rendered versions can't drift.
      const fillStats = (str) => str
        .replace(/\$\{RATING\}/g, String(reviewStats.rating))
        .replace(/\$\{COUNT\}/g, String(reviewStats.count));

      // Escape + fill stats in one step. Every string that reaches the HTML
      // goes through this, including the long-form copy from serviceContent/.
      const safe = (str) => escapeHtml(fillStats(String(str == null ? '' : str)));

      let serviceGenerated = 0;
      for (const page of [...SERVICE_CATEGORIES, ...SERVICE_SPECIALTIES]) {
        const canonicalUrl = page.canonical || SITE_URL + '/' + page.path;
        const safeTitle = escapeHtml(fillStats(page.title));
        const safeDescription = escapeHtml(fillStats(page.description));

        // Long-form body copy (src/data/serviceContent/). serviceSeo.js stays
        // the source of truth for the head/meta and the original FAQ set; this
        // only adds body sections and extra questions on top.
        const longForm = SERVICE_CONTENT[page.path] || { sections: [], faqs: [] };
        // serviceSeo.js wins on a duplicate question, so the FAQPage graph and
        // the visible list can't disagree.
        const faqs = mergeFaqs(page.faqs, longForm.faqs);

        const jsonLd = [JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          "name": fillStats(page.h1 || page.title),
          "description": fillStats(page.description),
          "provider": {
            "@type": "Dentist",
            "name": "iSmile Dental Clinic",
            "url": SITE_URL
          },
          "areaServed": { "@type": "Place", "name": "Petaling Jaya, Selangor" },
          "url": canonicalUrl
        })];

        if (faqs.length) {
          jsonLd.push(JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(f => ({
              "@type": "Question",
              "name": fillStats(f.q),
              "acceptedAnswer": { "@type": "Answer", "text": fillStats(f.a) }
            }))
          }));
        }

        // Breadcrumbs — the audit found none site-wide.
        const crumbs = page.path.split('/');
        jsonLd.push(JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": crumbs.map((_, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": crumbs[i].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            "item": SITE_URL + '/' + crumbs.slice(0, i + 1).join('/')
          }))
        }));

        // Service -> blog links. The React page renders the same list via
        // <RelatedReading>, but crawlers that don't run JS only ever see this
        // shell, so the internal links have to exist here too.
        const reading = pickRelatedPosts(blogIndex, page.path, 3);

        // The treatment list for a category hub (src/data/servicesData.jsx —
        // the same list the React page renders). Only the hubs get it; on a
        // specialty page it would just repeat its parent.
        const crumbSegments = page.path.split('/');
        const categoryKey = crumbSegments.length === 2 ? crumbSegments[1] : '';
        const category = categoryKey ? servicesData[categoryKey] : null;
        const categoryServices = (category && Array.isArray(category.services))
          ? category.services : [];

        // page.intro is the preferred long-form opener; page.lead is what the
        // specialty entries actually carry today. The meta description is only
        // repeated on pages that have neither, so it stays the one visible
        // paragraph on an otherwise bare hub rather than duplicating the intro.
        const intro = page.intro || page.lead || '';

        const body = [
          '    <h1>' + escapeHtml(fillStats(page.h1 || page.title)) + '</h1>',
          intro ? renderParagraphs(intro, safe) : '',
          !intro || page.description !== intro ? '    <p>' + safeDescription + '</p>' : '',
          ...longForm.sections.map(s => [
            '    <section>',
            s.heading ? '      <h2>' + safe(s.heading) + '</h2>' : '',
            renderParagraphs(s.body, safe, '      '),
            '    </section>',
          ].filter(Boolean).join('\n')),
          Array.isArray(page.facts) && page.facts.length
            ? '    <ul>' + page.facts.map(f => '<li>' + safe(f) + '</li>').join('') + '</ul>'
            : '',
          faqs.length
            ? '    <section><h2>Frequently Asked Questions</h2>' +
              faqs.map(f => '<h3>' + safe(f.q) + '</h3><p>' + safe(f.a) + '</p>').join('') +
              '</section>'
            : '',
          categoryServices.length
            ? '    <section><h2>' + safe(category.displayTitle || categoryKey) + ' treatments</h2><ul>' +
              categoryServices.map(s => '<li>' +
                (s.path ? '<a href="' + escapeHtml(s.path) + '">' + safe(s.name) + '</a>' : '<strong>' + safe(s.name) + '</strong>') +
                (s.desc ? ' &ndash; ' + safe(s.desc) : '') +
              '</li>').join('') +
              '</ul></section>'
            : '',
          reading.length
            ? '    <section><h2>Dental Education</h2><ul>' +
              reading.map(p => '<li><a href="' + SITE_URL + '/blog/' + escapeHtml(p.slug) + '">' +
                               escapeHtml(p.title) + '</a></li>').join('') +
              '</ul></section>'
            : '',
        ].filter(Boolean).join('\n');

        const html = buildPage({
          title: safeTitle,
          description: safeDescription,
          canonicalUrl,
          currentPath: canonicalUrl.replace(SITE_URL, ''),
          ogType: 'website',
          ogImage: SITE_URL + '/logo.png',
          jsonLd,
          body,
          cssLink: entryCss ? '  <link rel="stylesheet" href="' + entryCss + '" />' : '',
          scriptTag: entryScript ? '  <script type="module" src="' + entryScript + '"><\/script>' : '',
        });

        const outDir = path.resolve(distDir, page.path);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.resolve(outDir, 'index.html'), html, 'utf-8');
        serviceGenerated++;
      }
      console.log('[blog-ssg] ✓ Generated ' + serviceGenerated + ' service pages.');

      // ── Core pages ───────────────────────────────────────────────────────
      // /contact, /faq, /reviews, /about, /blog had the same problem as the
      // service pages: SPA shell only, so no crawlable content and (per the
      // audit) react-helmet's meta never applied. Content: src/data/corePagesSeo.js
      let coreGenerated = 0;
      for (const page of CORE_PAGES) {
        const canonicalUrl = SITE_URL + '/' + page.path;
        const safeTitle = escapeHtml(fillStats(page.title));
        const safeDescription = escapeHtml(fillStats(page.description));

        const jsonLd = [];
        const flatFaqs = (page.faqSections || []).flatMap(s => s.questions);
        if (flatFaqs.length) {
          jsonLd.push(JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": flatFaqs.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
          }));
        }
        jsonLd.push(JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
            { "@type": "ListItem", "position": 2, "name": page.h1, "item": canonicalUrl }
          ]
        }));

        const parts = [
          '    <h1>' + escapeHtml(fillStats(page.h1)) + '</h1>',
          '    <p>' + escapeHtml(fillStats(page.intro)) + '</p>',
        ];

        if (page.facts) {
          parts.push('    <ul>' +
            page.facts.map(f => '<li>' + escapeHtml(fillStats(f)) + '</li>').join('') +
            '</ul>');
        }

        for (const section of page.faqSections || []) {
          parts.push('    <section><h2>' + escapeHtml(section.category) + '</h2>' +
            section.questions.map(f => '<h3>' + escapeHtml(f.q) + '</h3><p>' +
                                        escapeHtml(f.a) + '</p>').join('') +
            '</section>');
        }

        // /services carries the same Dental Education strip as the hubs below it.
        const coreReading = pickRelatedPosts(blogIndex, page.path, 3);
        if (coreReading.length) {
          parts.push('    <section><h2>Dental Education</h2><ul>' +
            coreReading.map(p => '<li><a href="' + SITE_URL + '/blog/' + escapeHtml(p.slug) + '">' +
                                 escapeHtml(p.title) + '</a></li>').join('') +
            '</ul></section>');
        }

        // Link every post from /blog so crawlers can reach the ones the audit
        // found as "Discovered — currently not indexed" / never crawled.
        if (page.listsBlogIndex) {
          parts.push('    <ul>' + blogIndex.map(p =>
            '<li><a href="/blog/' + p.slug + '">' + escapeHtml(p.title) + '</a></li>'
          ).join('') + '</ul>');
        }

        const html = buildPage({
          title: safeTitle,
          description: safeDescription,
          canonicalUrl,
          currentPath: canonicalUrl.replace(SITE_URL, ''),
          ogType: 'website',
          ogImage: SITE_URL + '/logo.png',
          jsonLd,
          body: parts.join('\n'),
          cssLink: entryCss ? '  <link rel="stylesheet" href="' + entryCss + '" />' : '',
          scriptTag: entryScript ? '  <script type="module" src="' + entryScript + '"><\/script>' : '',
        });

        const outDir = path.resolve(distDir, page.path);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.resolve(outDir, 'index.html'), html, 'utf-8');
        coreGenerated++;
      }
      console.log('[blog-ssg] ✓ Generated ' + coreGenerated + ' core pages.');

      // ── Dentist pages ────────────────────────────────────────────────────
      // Doctor-name queries are the best-converting traffic the site has
      // ("dr jean ong" 41.7% CTR against a 0.23% site average) and had nowhere
      // to land: "dr ling dentist" drew 157 impressions at position 9.5 with
      // zero clicks. These pages are also rendered by src/pages/Dentists.jsx —
      // prerendering alone is not enough, because the #ssg-content block below
      // is deleted the moment React mounts.
      //
      // Person/Dentist schema is emitted here so it survives without JS. The
      // protected title "Specialist" is deliberately absent — see dentists.js.
      let dentistGenerated = 0;
      const dentistIndexPath = path.resolve(distDir, 'dentists');
      fs.mkdirSync(dentistIndexPath, { recursive: true });
      fs.writeFileSync(path.resolve(dentistIndexPath, 'index.html'), buildPage({
        title: escapeHtml('Our Dentists in Damansara Jaya, Petaling Jaya | iSmile Dental Clinic'),
        description: escapeHtml('Meet the dentists at iSmile Dental Clinic in Damansara Jaya, Petaling Jaya. Eight dental surgeons with 14 to 34 years in practice across general, paediatric, orthodontic and restorative care.'),
        canonicalUrl: SITE_URL + '/dentists',
        currentPath: '/dentists',
        ogType: 'website',
        ogImage: SITE_URL + '/logo.png',
        jsonLd: [JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: dentists.map((d, i) => ({
            '@type': 'ListItem', position: i + 1, name: d.knownAs,
            url: SITE_URL + '/dentists/' + d.slug,
          })),
        })],
        body: [
          '    <h1>Our dentists</h1>',
          '    <p>Our team in Damansara Jaya covers general, paediatric, orthodontic and restorative care between them, with 14 to 34 years in practice each.</p>',
          '    <ul>' + dentists.map(d =>
            '<li><a href="/dentists/' + d.slug + '">' + escapeHtml(d.knownAs) + '</a> — ' +
            escapeHtml(d.role) + '. ' + escapeHtml(d.qualifications) + '</li>').join('') + '</ul>',
        ].join('\n'),
        cssLink: entryCss ? '  <link rel="stylesheet" href="' + entryCss + '" />' : '',
        scriptTag: entryScript ? '  <script type="module" src="' + entryScript + '"><\/script>' : '',
      }), 'utf-8');
      dentistGenerated++;

      for (const d of dentists) {
        const seo = dentistSeo(d);
        const canonicalUrl = SITE_URL + '/dentists/' + d.slug;
        const html = buildPage({
          title: escapeHtml(seo.title),
          description: escapeHtml(seo.description),
          canonicalUrl,
          currentPath: '/dentists/' + d.slug,
          ogType: 'profile',
          ogImage: SITE_URL + d.img,
          jsonLd: [
            JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Dentist',
              name: d.name,
              alternateName: d.knownAs,
              image: SITE_URL + d.img,
              url: canonicalUrl,
              knowsLanguage: d.languages.split(',').map(x => x.trim()),
              worksFor: {
                '@type': 'Dentist', name: 'iSmile Dental Clinic', url: SITE_URL,
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '75 & 75A, Jalan SS 22/23, Damansara Jaya',
                  addressLocality: 'Petaling Jaya', addressRegion: 'Selangor',
                  postalCode: '47400', addressCountry: 'MY',
                },
              },
            }),
            JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Our Dentists', item: SITE_URL + '/dentists' },
                { '@type': 'ListItem', position: 3, name: d.knownAs, item: canonicalUrl },
              ],
            }),
          ],
          body: [
            '    <h1>' + escapeHtml(d.knownAs) + '</h1>',
            '    <p>' + escapeHtml(d.role + (d.founder ? ', and founder of iSmile Dental Clinic' : '') +
                ', Damansara Jaya, Petaling Jaya.') + '</p>',
            '    <p>' + escapeHtml(d.bio) + '</p>',
            '    <ul>' +
              '<li>Qualifications: ' + escapeHtml(d.qualifications) + '</li>' +
              '<li>In practice: ' + escapeHtml(d.years) + '</li>' +
              '<li>Languages: ' + escapeHtml(d.languages) + '</li>' +
              (d.keyCompetency ? '<li>Areas of focus: ' + escapeHtml(d.keyCompetency) + '</li>' : '') +
            '</ul>',
            '    <section><h2>Book with ' + escapeHtml(d.knownAs) + '</h2><p>' +
              escapeHtml('We are at 75 & 75A, Jalan SS 22/23, Damansara Jaya, 47400 Petaling Jaya. Call or WhatsApp +60163222135 and mention ' + d.knownAs + ' when you book.') +
            '</p></section>',
            '    <section><h2>Other dentists at the clinic</h2><ul>' +
              dentists.filter(o => o.slug !== d.slug).map(o =>
                '<li><a href="/dentists/' + o.slug + '">' + escapeHtml(o.knownAs) + '</a></li>').join('') +
            '</ul></section>',
          ].join('\n'),
          cssLink: entryCss ? '  <link rel="stylesheet" href="' + entryCss + '" />' : '',
          scriptTag: entryScript ? '  <script type="module" src="' + entryScript + '"><\/script>' : '',
        });
        const outDir = path.resolve(distDir, 'dentists', d.slug);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.resolve(outDir, 'index.html'), html, 'utf-8');
        dentistGenerated++;
      }
      console.log('[blog-ssg] ✓ Generated ' + dentistGenerated + ' dentist pages.');

      // ── Homepage ─────────────────────────────────────────────────────────
      // "/" is NOT handled here. It used to get a hand-written #ssg-content
      // block injected into dist/index.html, but that block was markup React
      // then deleted and rebuilt on mount — visible as a ~1s flash of a
      // not-quite-right page on every cold-cache load.
      //
      // It is now genuinely server-rendered from the real components and
      // hydrated, by scripts/prerender-home.js running after the SSR build.
      // See package.json's build script.
    }
  };
}

/** Escape HTML special chars for safe insertion into attributes/text nodes */
/** Format ISO date string to human-readable format (e.g., "Apr 6, 2026") */
function formatDate(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Render a plain-text block (blank-line separated) as escaped <p> elements.
 * The serviceContent modules hold text, never markup, so nothing here may be
 * passed through raw — `esc` is the escape-and-fill-stats helper.
 */
function renderParagraphs(text, esc, indent = '    ') {
  return String(text || '')
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => indent + '<p>' + esc(p.replace(/\s*\n\s*/g, ' ')) + '</p>')
    .join('\n');
}

/**
 * Merge two FAQ lists, de-duplicated by question (case/punctuation-insensitive).
 * Earlier lists win, so serviceSeo.js stays authoritative.
 */
function mergeFaqs(...lists) {
  const seen = new Set();
  const out = [];
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const f of list) {
      if (!f || !f.q || !f.a) continue;
      const key = String(f.q).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(f);
    }
  }
  return out;
}

/** Escape HTML special chars for safe insertion into attributes/text nodes */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
