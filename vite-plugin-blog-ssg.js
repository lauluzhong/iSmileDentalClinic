import fs from 'fs';
import path from 'path';
import { SERVICE_CATEGORIES, SERVICE_SPECIALTIES } from './src/data/serviceSeo.js';
import { CORE_PAGES, HOME_PAGE } from './src/data/corePagesSeo.js';
import { relatedServices } from './src/data/blogServiceLinks.js';
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
  return {
    name: 'vite-plugin-blog-ssg',
    apply: 'build',

    closeBundle() {
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

      let serviceGenerated = 0;
      for (const page of [...SERVICE_CATEGORIES, ...SERVICE_SPECIALTIES]) {
        const canonicalUrl = page.canonical || SITE_URL + '/' + page.path;
        const safeTitle = escapeHtml(fillStats(page.title));
        const safeDescription = escapeHtml(fillStats(page.description));
        const faqs = page.faqs || [];

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

        const body = [
          '    <h1>' + escapeHtml(fillStats(page.h1 || page.title)) + '</h1>',
          page.lead ? '    <p>' + escapeHtml(fillStats(page.lead)) + '</p>' : '',
          '    <p>' + safeDescription + '</p>',
          faqs.length
            ? '    <section><h2>Frequently Asked Questions</h2>' +
              faqs.map(f => '<h3>' + escapeHtml(fillStats(f.q)) + '</h3><p>' +
                            escapeHtml(fillStats(f.a)) + '</p>').join('') +
              '</section>'
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

      // ── Homepage ─────────────────────────────────────────────────────────
      // "/" is the highest-traffic page and was the last one still served as an
      // empty SPA shell: ~54% of its 8s LCP was render delay waiting for React.
      //
      // It cannot use buildPage() like the pages above, because those each write
      // their own dist/<path>/index.html while the homepage's target IS
      // dist/index.html — Vite's own output, which carries the hand-maintained
      // <head> (title, canonical, OG/Twitter, Dentist JSON-LD, hero preloads,
      // GTM, Clarity) and is the shared SPA fallback shell. So instead of
      // regenerating it we INJECT the same #ssg-content block into it and leave
      // the head byte-for-byte untouched — no SEO is rewritten and index.html
      // itself is never edited. HOME_PATH_GUARD keeps the block off every other
      // route that falls through the rewrite.
      const homeIndex = path.resolve(distDir, 'index.html');
      if (!fs.existsSync(homeIndex)) {
        console.warn('[blog-ssg] ⚠ dist/index.html not found — homepage not prerendered.');
        return;
      }
      let homeHtml = fs.readFileSync(homeIndex, 'utf-8');

      if (homeHtml.includes('id="ssg-content"')) {
        console.warn('[blog-ssg] ⚠ dist/index.html already prerendered — skipping.');
        return;
      }

      const hero = HOME_PAGE.hero;
      const heroAlt = escapeHtml(hero.alt);
      const srcset = (base, ext) =>
        base + '-480w.' + ext + ' 480w, ' + base + '-768w.' + ext + ' 768w, ' + base + '.' + ext + ' 1024w';
      // Mirrors the <picture> art direction in Home.jsx AND the two preload
      // links in index.html — if the static markup asked for a different crop,
      // phones would download the preloaded image and then discard it.
      const heroPicture = [
        '      <picture>',
        '        <source media="(max-width: 768px)" type="image/avif" srcset="' + srcset(hero.portraitBase, 'avif') + '" sizes="' + hero.sizes + '" />',
        '        <source media="(max-width: 768px)" type="image/webp" srcset="' + srcset(hero.portraitBase, 'webp') + '" sizes="' + hero.sizes + '" />',
        '        <source media="(max-width: 768px)" type="image/jpeg" srcset="' + srcset(hero.portraitBase, 'jpg') + '" sizes="' + hero.sizes + '" />',
        '        <source type="image/avif" srcset="' + srcset(hero.base, 'avif') + '" sizes="' + hero.sizes + '" />',
        '        <source type="image/webp" srcset="' + srcset(hero.base, 'webp') + '" sizes="' + hero.sizes + '" />',
        '        <img src="' + hero.base + '.jpg" srcset="' + srcset(hero.base, 'jpg') + '" sizes="' + hero.sizes + '" alt="' + heroAlt + '" width="' + hero.width + '" height="' + hero.height + '" fetchpriority="high" decoding="async" />',
        '      </picture>',
      ].join('\n');

      // Styles the shell to LOOK like the real hero so the React mount is a
      // seamless crossfade, not a raw-HTML→design flip (the 1s flash every
      // cold-cache visitor saw). Uses the design tokens from the bundled CSS —
      // it is render-blocking in <head>, so the vars are live before first
      // paint. Values are copied from Home.jsx's hero styles and Header.jsx's
      // immersive mobile header; keep them in step if that design changes.
      // The <style> sits INSIDE the article so HYDRATION_SWAP removes it too.
      const homeStyle = [
        '  <style>',
        '    #ssg-content{margin:0;padding:0;max-width:none;background:var(--color-bg-cream,#f8fafc);color:var(--color-text-charcoal,#15242B);font-family:var(--font-body,Inter,system-ui,sans-serif)}',
        '    #ssg-content h1,#ssg-content h2{font-family:var(--font-heading,Outfit,sans-serif);font-weight:700}',
        '    #ssg-content .ssg-hero{position:relative;min-height:100vh;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden}',
        '    #ssg-content .ssg-hero-media{position:absolute;inset:0;z-index:1}',
        '    #ssg-content .ssg-hero-media picture,#ssg-content .ssg-hero-media img{display:block;width:100%;height:100%}',
        '    #ssg-content .ssg-hero-media img{object-fit:cover;object-position:center 30%}',
        '    #ssg-content .ssg-hero-media::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,35,50,0.30) 0%,rgba(15,35,50,0.05) 32%,rgba(13,42,58,0.42) 56%,rgba(13,42,58,0.88) 70%,rgba(13,42,58,1) 78%)}',
        '    #ssg-content .ssg-logo{position:absolute;top:0;left:0;z-index:3;margin:0;padding:14px 22px}',
        '    #ssg-content .ssg-logo img{height:52px;width:auto;filter:brightness(0) invert(1) drop-shadow(0 1px 6px rgba(10,30,45,0.35))}',
        '    #ssg-content .ssg-hero-copy{position:relative;z-index:2;display:flex;flex-direction:column;align-items:flex-start;padding:110px 22px calc(76px + env(safe-area-inset-bottom))}',
        '    #ssg-content .ssg-eyebrow{display:none;margin:0 0 26px;font-family:var(--font-heading,Outfit,sans-serif);font-weight:600;font-size:0.82rem;letter-spacing:0.04em}',
        '    #ssg-content .ssg-hero-copy h1{margin:0 0 10px;font-size:2.35rem;line-height:1.12;letter-spacing:-0.03em;color:#fff}',
        '    #ssg-content .ssg-intro{margin:0;max-width:540px;line-height:1.6;font-size:1.02rem;color:rgba(255,255,255,0.92)}',
        '    #ssg-content .ssg-intro-desktop{display:none}',
        '    #ssg-content .ssg-trust{order:-1;margin:0 0 12px;font-size:0.85rem;color:rgba(255,255,255,0.95)}',
        '    #ssg-content .ssg-below{max-width:800px;margin:0 auto;padding:48px 22px 56px}',
        '    #ssg-content .ssg-below h2{font-size:1.5rem;margin:32px 0 10px;color:var(--color-text-charcoal,#15242B)}',
        '    #ssg-content .ssg-below p{margin:0;line-height:1.65;color:var(--color-text-slate,#475569)}',
        '    #ssg-content nav ul{list-style:none;margin:40px 0 0;padding:24px 0 0;border-top:1px solid rgba(16,42,51,0.10);display:flex;flex-wrap:wrap;gap:8px 20px}',
        '    #ssg-content nav a{color:var(--color-text-grey,#64748B);font-size:0.85rem;text-decoration:none}',
        '    @media (min-width: 769px){',
        '      #ssg-content .ssg-hero{min-height:92vh;flex-direction:row;align-items:center;justify-content:center;gap:56px;padding:140px 24px 60px}',
        '      #ssg-content .ssg-hero-media{position:relative;inset:auto;order:2;flex:0 0 auto;width:44%;max-width:520px;border-radius:24px;overflow:hidden;box-shadow:0 24px 48px rgba(16,42,51,0.16);transform:rotate(-1.25deg);outline:6px solid #fff;outline-offset:-6px}',
        '      #ssg-content .ssg-hero-media img{aspect-ratio:16/11;height:auto;filter:saturate(0.98) contrast(1.02)}',
        '      #ssg-content .ssg-hero-media::after{background:linear-gradient(180deg,rgba(0,90,118,0) 58%,rgba(0,90,118,0.20) 100%)}',
        '      #ssg-content .ssg-logo{padding:20px 32px}',
        '      #ssg-content .ssg-logo img{height:96px;filter:none}',
        '      #ssg-content .ssg-hero-copy{padding:0;max-width:560px}',
        '      #ssg-content .ssg-eyebrow{display:inline-block;color:var(--color-text-charcoal,#15242B)}',
        '      #ssg-content .ssg-hero-copy h1{font-size:var(--fs-display,3.5rem);line-height:1.05;margin:0 0 22px;color:var(--color-text-charcoal,#15242B)}',
        '      #ssg-content .ssg-intro{font-size:var(--fs-lead,1.15rem);color:var(--color-text-slate,#475569)}',
        '      #ssg-content .ssg-intro-desktop{display:block}',
        '      #ssg-content .ssg-intro-mobile{display:none}',
        '      #ssg-content .ssg-trust{order:0;margin:36px 0 0;font-size:0.95rem;color:var(--color-text-slate,#475569)}',
        '    }',
        '  </style>',
      ].join('\n');

      const homeBody = [
        homeStyle,
        // Mirrors the art direction in Header.jsx: tight wordmark <=1024px, padded
        // square above, each <source> carrying its own intrinsic ratio. Without the
        // media scoping a desktop load fetches BOTH logo files (the preload in
        // index.html plus this shell's hardcoded tight crop); without the per-source
        // width/height the browser reserves a square box for the 3:2 tight crop.
        // Keep this in step with Header.jsx and the logo preloads in index.html.
        '    <p class="ssg-logo">',
        '      <picture>',
        '        <source media="(max-width: 1024px)" type="image/webp" srcset="/logo-tight.webp" width="320" height="215" />',
        '        <source media="(max-width: 1024px)" type="image/png" srcset="/logo-tight.png" width="462" height="310" />',
        '        <source type="image/webp" srcset="/logo.webp" width="320" height="320" />',
        '        <source type="image/png" srcset="/logo.png" width="500" height="500" />',
        '        <img class="site-logo-img" src="/logo.png" alt="iSmile Dental Clinic" width="500" height="500" />',
        '      </picture>',
        '    </p>',
        '    <div class="ssg-hero-media">',
        heroPicture,
        '    </div>',
        '    <div class="ssg-hero-copy">',
        '    <p class="ssg-eyebrow">' + escapeHtml(HOME_PAGE.eyebrow) + '</p>',
        '    <h1>' + escapeHtml(HOME_PAGE.h1) + '</h1>',
        // Same desktop/mobile subtitle swap as Home.jsx — the long intro keeps
        // its SEO value on every viewport (hidden, not removed, on phones).
        '    <p class="ssg-intro ssg-intro-desktop">' + escapeHtml(fillStats(HOME_PAGE.intro)) + '</p>',
        '    <p class="ssg-intro ssg-intro-mobile">The family dentist Petaling Jaya households have stayed with since 2006.</p>',
        '    <p class="ssg-trust">' + escapeHtml(fillStats(HOME_PAGE.trust)) + '</p>',
        '    </div>',
      ].join('\n');

      const homeBelow = [
        '  <div class="ssg-below">',
        ...HOME_PAGE.sections.map(s =>
          '    <section><h2>' + escapeHtml(fillStats(s.h2)) + '</h2><p>' +
          escapeHtml(fillStats(s.p)) + '</p></section>'),
        staticNav('/'),
        '  </div>',
      ].join('\n');

      const homeBlock = [
        '  <!-- Pre-rendered content for SEO + first paint — removed once React mounts.',
        '       Styled to match the real hero (Home.jsx / Header.jsx) so the swap is',
        '       invisible instead of a raw-HTML flash on cold-cache loads. -->',
        '  <article id="ssg-content">',
        '  <section class="ssg-hero">',
        homeBody,
        '  </section>',
        homeBelow,
        '  </article>',
        '',
      ].join('\n');

      homeHtml = homeHtml
        .replace('</head>', HOME_PATH_GUARD + '\n</head>')
        .replace('<div id="root"></div>', homeBlock + '  <div id="root"></div>')
        + '\n';
      // HYDRATION_SWAP has to sit after the module script, same as every other
      // prerendered page, so the observer is installed before React mounts.
      homeHtml = homeHtml.replace('</body>', HYDRATION_SWAP + '\n</body>');

      fs.writeFileSync(homeIndex, homeHtml, 'utf-8');
      console.log('[blog-ssg] ✓ Prerendered the homepage into dist/index.html.');
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

/** Escape HTML special chars for safe insertion into attributes/text nodes */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
