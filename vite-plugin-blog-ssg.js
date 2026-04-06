import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://ismile.com.my';

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

      // Location pages to generate
      const locationPages = [
        {
          slug: 'damansara-jaya',
          path: 'services/locations/damansara-jaya',
          title: 'Dentist in Damansara Jaya | iSmile Dental Clinic',
          description: 'Your trusted family dentist in Damansara Jaya. Comprehensive dental care with a gentle touch.',
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
            ratingValue: '4.8',
            reviewCount: '84'
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
        const safeTitle = escapeHtml(post.title);
        const safeExcerpt = escapeHtml(post.excerpt || '');
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

        const cssLink = entryCss ? '  <link rel="stylesheet" href="' + entryCss + '" />' : '';
        const imgTag = post.img ? '    <img src="' + escapeHtml(post.img) + '" alt="' + safeTitle + '" style="max-width:100%;height:auto;border-radius:12px;margin:20px 0" />' : '';
        const categorySpan = safeCategory ? ' &middot; ' + safeCategory : '';
        const scriptTag = entryScript ? '  <script type="module" src="' + entryScript + '"><\/script>' : '';

        const html = [
          '<!doctype html>',
          '<html lang="en">',
          '<head>',
          '  <meta charset="UTF-8" />',
          '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
          '  <meta name="facebook-domain-verification" content="76cn9giu5poxaecud7uc1atvnejnjc" />',
          '',
          '  <title>' + safeTitle + ' | iSmile Dental Clinic</title>',
          '  <meta name="description" content="' + safeExcerpt + '" />',
          '  <link rel="canonical" href="' + canonicalUrl + '" />',
          '',
          '  <!-- Open Graph / Facebook -->',
          '  <meta property="og:type" content="article" />',
          '  <meta property="og:url" content="' + canonicalUrl + '" />',
          '  <meta property="og:title" content="' + safeTitle + '" />',
          '  <meta property="og:description" content="' + safeExcerpt + '" />',
          '  <meta property="og:image" content="' + ogImage + '" />',
          '  <meta property="og:site_name" content="iSmile Dental Clinic" />',
          '  <meta property="article:published_time" content="' + post.date + '" />',
          '  <meta property="article:section" content="' + safeCategory + '" />',
          '',
          '  <!-- Twitter Card -->',
          '  <meta name="twitter:card" content="summary_large_image" />',
          '  <meta name="twitter:title" content="' + safeTitle + '" />',
          '  <meta name="twitter:description" content="' + safeExcerpt + '" />',
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
          '  <!-- BlogPosting JSON-LD -->',
          '  <script type="application/ld+json">' + jsonLd + '<\/script>',
          '',
          '  <!-- Google Tag Manager -->',
          '  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':',
          '  new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],',
          '  j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=',
          '  \'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);',
          '  })(window,document,\'script\',\'dataLayer\',\'GTM-NR9PQ2H7\');<\/script>',
          '  <!-- End Google Tag Manager -->',
          '</head>',
          '<body>',
          '  <!-- Google Tag Manager (noscript) -->',
          '  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NR9PQ2H7"',
          '  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>',
          '  <!-- End Google Tag Manager (noscript) -->',
          '',
          '  <!-- Pre-rendered blog content for SEO — removed once React mounts -->',
          '  <article id="ssg-content" style="max-width:800px;margin:80px auto;padding:0 20px;font-family:Inter,system-ui,sans-serif">',
          '    <h1>' + safeTitle + '</h1>',
          '    <p><time datetime="' + post.date + '">' + post.date + '</time>' + categorySpan + '</p>',
          imgTag,
          '    <div>' + (post.content || '') + '</div>',
          '  </article>',
          '',
          '  <!-- React SPA mount point -->',
          '  <div id="root"></div>',
          scriptTag,
          '',
          '  <!-- Remove static content once React renders into #root -->',
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
          '</body>',
          '</html>'
        ].join('\n');

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
            "https://www.facebook.com/ismiledentalclinic",
            "https://www.instagram.com/ismiledentalclinic"
          ]
        });

        const cssLink = entryCss ? '  <link rel="stylesheet" href="' + entryCss + '" />' : '';
        const scriptTag = entryScript ? '  <script type="module" src="' + entryScript + '"><\/script>' : '';

        const html = [
          '<!doctype html>',
          '<html lang="en">',
          '<head>',
          '  <meta charset="UTF-8" />',
          '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
          '  <meta name="facebook-domain-verification" content="76cn9giu5poxaecud7uc1atvnejnjc" />',
          '',
          '  <title>' + safeTitle + '</title>',
          '  <meta name="description" content="' + safeDescription + '" />',
          '  <link rel="canonical" href="' + canonicalUrl + '" />',
          '',
          '  <!-- Open Graph / Facebook -->',
          '  <meta property="og:type" content="website" />',
          '  <meta property="og:url" content="' + canonicalUrl + '" />',
          '  <meta property="og:title" content="' + safeTitle + '" />',
          '  <meta property="og:description" content="' + safeDescription + '" />',
          '  <meta property="og:image" content="' + SITE_URL + '/logo.png" />',
          '  <meta property="og:site_name" content="iSmile Dental Clinic" />',
          '',
          '  <!-- Twitter Card -->',
          '  <meta name="twitter:card" content="summary_large_image" />',
          '  <meta name="twitter:title" content="' + safeTitle + '" />',
          '  <meta name="twitter:description" content="' + safeDescription + '" />',
          '  <meta name="twitter:image" content="' + SITE_URL + '/logo.png" />',
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
          '  <!-- LocalBusiness JSON-LD -->',
          '  <script type="application/ld+json">' + jsonLd + '<\/script>',
          '',
          '  <!-- Google Tag Manager -->',
          '  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':',
          '  new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],',
          '  j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=',
          '  \'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);',
          '  })(window,document,\'script\',\'dataLayer\',\'GTM-NR9PQ2H7\');<\/script>',
          '  <!-- End Google Tag Manager -->',
          '</head>',
          '<body>',
          '  <!-- Google Tag Manager (noscript) -->',
          '  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NR9PQ2H7"',
          '  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>',
          '  <!-- End Google Tag Manager (noscript) -->',
          '',
          '  <!-- Pre-rendered location content for SEO — removed once React mounts -->',
          '  <article id="ssg-content" style="max-width:800px;margin:80px auto;padding:0 20px;font-family:Inter,system-ui,sans-serif">',
          '    <h1>' + safeTitle + '</h1>',
          '    <p>' + safeDescription + '</p>',
          '    <address>' + safeAddress + '</address>',
          '    <p>Phone: ' + safeTelephone + '</p>',
          '    <p>Hours: ' + location.openingHours.join(', ') + '</p>',
          '  </article>',
          '',
          '  <!-- React SPA mount point -->',
          '  <div id="root"></div>',
          scriptTag,
          '',
          '  <!-- Remove static content once React renders into #root -->',
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
          '</body>',
          '</html>'
        ].join('\n');

        const outDir = path.resolve(distDir, location.path);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.resolve(outDir, 'index.html'), html, 'utf-8');
        locationGenerated++;
      }

      if (locationGenerated > 0) {
        console.log('[blog-ssg] ✓ Generated ' + locationGenerated + ' location pages.');
      }

    }
  };
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
