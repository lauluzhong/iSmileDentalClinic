import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://ismile.com.my';
const BLOG_INDEX_PATH = path.resolve('src/data/blog-index.json');
const SITEMAP_OUTPUT_PATH = path.resolve('public/sitemap.xml');

// Static pages with their changefreq and priority
const STATIC_PAGES = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/about', changefreq: 'monthly', priority: '0.8' },
  { loc: '/services', changefreq: 'monthly', priority: '0.9' },
  { loc: '/services/protect', changefreq: 'monthly', priority: '0.8' },
  { loc: '/services/straighten', changefreq: 'monthly', priority: '0.8' },
  { loc: '/services/replace', changefreq: 'monthly', priority: '0.8' },
  { loc: '/services/children', changefreq: 'monthly', priority: '0.8' },
  { loc: '/services/children/myofunctional', changefreq: 'monthly', priority: '0.8' },
  { loc: '/services/enhance', changefreq: 'monthly', priority: '0.8' },
  { loc: '/services/enhance/teeth-whitening', changefreq: 'monthly', priority: '0.8' },
  { loc: '/services/replace/dental-implants', changefreq: 'monthly', priority: '0.8' },
  { loc: '/services/locations/damansara-jaya', changefreq: 'weekly', priority: '0.9' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.7' },
  { loc: '/faq', changefreq: 'monthly', priority: '0.6' },
  { loc: '/reviews', changefreq: 'monthly', priority: '0.7' },
];

function generateUrlBlock({ loc, changefreq, priority }) {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function generateSitemap() {
  // Read blog index
  if (!fs.existsSync(BLOG_INDEX_PATH)) {
    console.error('Blog index not found at', BLOG_INDEX_PATH);
    process.exit(1);
  }
  const blogIndex = JSON.parse(fs.readFileSync(BLOG_INDEX_PATH, 'utf-8'));

  // Generate blog entries
  const blogEntries = blogIndex.map(post => ({
    loc: `/blog/${post.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
  }));

  // Combine static and blog entries
  const allEntries = [...STATIC_PAGES, ...blogEntries];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.map(generateUrlBlock).join('\n')}
</urlset>`;

  // Write to file
  fs.writeFileSync(SITEMAP_OUTPUT_PATH, xml, 'utf-8');
  console.log(`Sitemap generated with ${STATIC_PAGES.length} static pages and ${blogEntries.length} blog posts.`);
}

generateSitemap();