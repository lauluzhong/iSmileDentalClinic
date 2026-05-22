import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONTENT_DIR = path.resolve('content/blog');
const INDEX_OUTPUT = path.resolve('src/data/blog-index.json');
const CONTENT_OUTPUT_DIR = path.resolve('public/blog-content');
const SITEMAP_OUTPUT = path.resolve('public/sitemap.xml');
const SITE_URL = 'https://ismile.com.my';

const STATIC_SITEMAP_ENTRIES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/services', changefreq: 'monthly', priority: '0.9' },
  { path: '/services/protect', changefreq: 'monthly', priority: '0.8' },
  { path: '/services/straighten', changefreq: 'monthly', priority: '0.8' },
  { path: '/services/replace', changefreq: 'monthly', priority: '0.8' },
  { path: '/services/enhance', changefreq: 'monthly', priority: '0.8' },
  { path: '/services/children', changefreq: 'monthly', priority: '0.8' },
  { path: '/services/children/myofunctional', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/enhance/teeth-whitening', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/replace/dental-implants', changefreq: 'monthly', priority: '0.7' },
  { path: '/reviews', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog', changefreq: 'weekly', priority: '0.9' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/locations/damansara-jaya', changefreq: 'weekly', priority: '0.9' },
  { path: '/faq', changefreq: 'monthly', priority: '0.6' }
];

// Ensure output directories exist
fs.mkdirSync(CONTENT_OUTPUT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(INDEX_OUTPUT), { recursive: true });

// Custom renderer: wrap images in blog-image-wrapper divs (matches existing CSS)
const renderer = new marked.Renderer();
renderer.image = ({ href, title, text }) => {
  return `<div class="blog-image-wrapper">
    <img src="${href}" alt="${text}" />
    ${title ? `<p class="image-caption">${title}</p>` : ''}
  </div>`;
};

marked.setOptions({ renderer });

function formatDate(date) {
  if (!date) return date;
  if (date instanceof Date) return date.toISOString().slice(0, 10);
  return String(date);
}

// Read all .md files
const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

if (files.length === 0) {
  console.warn('Warning: No markdown files found in content/blog/');
  fs.writeFileSync(INDEX_OUTPUT, '[]');
  writeSitemap([]);
  process.exit(0);
}

const blogIndex = files.map(filename => {
  const slug = filename.replace('.md', '');
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8');
  const { data: frontmatter, content: markdownBody } = matter(raw);
  const content_type = frontmatter.content_type || 'educational';
  const date = formatDate(frontmatter.date);

  const htmlContent = marked(markdownBody);

  // Write individual post JSON
  fs.writeFileSync(
    path.join(CONTENT_OUTPUT_DIR, `${slug}.json`),
    JSON.stringify({
      slug,
      title: frontmatter.title,
      categories: frontmatter.categories || (frontmatter.category ? [frontmatter.category] : []),
      tags: frontmatter.tags || [],
      date,
      img: frontmatter.img,
      excerpt: frontmatter.excerpt,
      featured: frontmatter.featured || false,
      faq: frontmatter.faq || [],
      content_type,
      canonical_url: frontmatter.canonical_url || null,
      content: htmlContent
    })
  );

  // Return metadata only (no content) for the index
  return {
    slug,
    title: frontmatter.title,
    categories: frontmatter.categories || (frontmatter.category ? [frontmatter.category] : []),
    tags: frontmatter.tags || [],
    date,
    img: frontmatter.img,
    excerpt: frontmatter.excerpt,
    featured: frontmatter.featured || false,
    faq: frontmatter.faq || [],
    content_type,
    canonical_url: frontmatter.canonical_url || null
  };
});

// Sort by date descending
blogIndex.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(INDEX_OUTPUT, JSON.stringify(blogIndex, null, 2));

writeSitemap(blogIndex);

console.log(`Blog build complete: ${blogIndex.length} posts processed.`);

function formatSitemapEntry({ loc, changefreq, priority, lastmod }) {
  const lines = [
    '  <url>',
    `    <loc>${loc}</loc>`
  ];

  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
  if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority) lines.push(`    <priority>${priority}</priority>`);

  lines.push('  </url>');
  return lines.join('\n');
}

function normalizeStaticUrl(pathname) {
  return pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname}`;
}

function writeSitemap(posts) {
  const staticEntries = STATIC_SITEMAP_ENTRIES.map(entry => ({
    loc: normalizeStaticUrl(entry.path),
    changefreq: entry.changefreq,
    priority: entry.priority
  }));

  const blogEntries = posts.map(post => ({
    loc: `${SITE_URL}/blog/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: '0.7'
  }));

  const seen = new Set();
  const entries = [...staticEntries, ...blogEntries].filter(entry => {
    if (seen.has(entry.loc)) return false;
    seen.add(entry.loc);
    return true;
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(formatSitemapEntry),
    '</urlset>',
    ''
  ].join('\n');

  fs.writeFileSync(SITEMAP_OUTPUT, xml);
  console.log(`Sitemap build complete: ${entries.length} URLs written (${blogEntries.length} blog posts).`);
}
