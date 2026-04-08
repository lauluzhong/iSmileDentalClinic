import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve('content/blog');
const INDEX_PATH = path.resolve('src/data/blog-index.json');
const SITEMAP_PATH = path.resolve('public/sitemap.xml');

function readSlugsFromContent() {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  return files.map(f => f.replace('.md', ''));
}

function readSlugsFromIndex() {
  const data = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
  return data.map(post => post.slug);
}

function readSlugsFromSitemap() {
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const matches = xml.matchAll(/https:\/\/ismile\.com\.my\/blog\/([^<]+)/g);
  const slugs = Array.from(matches, m => m[1]);
  return slugs;
}

function compareSets(contentSlugs, indexSlugs, sitemapSlugs) {
  const contentSet = new Set(contentSlugs);
  const indexSet = new Set(indexSlugs);
  const sitemapSet = new Set(sitemapSlugs);

  console.log(`Content directory: ${contentSet.size} posts`);
  console.log(`Blog index: ${indexSet.size} posts`);
  console.log(`Sitemap: ${sitemapSet.size} blog entries`);

  const missingInIndex = contentSlugs.filter(slug => !indexSet.has(slug));
  const missingInSitemap = contentSlugs.filter(slug => !sitemapSet.has(slug));
  const extraInIndex = indexSlugs.filter(slug => !contentSet.has(slug));
  const extraInSitemap = sitemapSlugs.filter(slug => !contentSet.has(slug));

  let hasErrors = false;

  if (missingInIndex.length > 0) {
    console.error(`❌ Posts missing in blog-index.json: ${missingInIndex.join(', ')}`);
    hasErrors = true;
  }
  if (missingInSitemap.length > 0) {
    console.error(`❌ Posts missing in sitemap.xml: ${missingInSitemap.join(', ')}`);
    hasErrors = true;
  }
  if (extraInIndex.length > 0) {
    console.warn(`⚠ Extra entries in blog-index.json not in content: ${extraInIndex.join(', ')}`);
  }
  if (extraInSitemap.length > 0) {
    console.warn(`⚠ Extra blog entries in sitemap.xml not in content: ${extraInSitemap.join(', ')}`);
  }

  if (!hasErrors) {
    console.log('✅ All checks passed: consistency between content, index, and sitemap.');
  }

  return hasErrors;
}

function main() {
  try {
    const contentSlugs = readSlugsFromContent();
    const indexSlugs = readSlugsFromIndex();
    const sitemapSlugs = readSlugsFromSitemap();

    const hasErrors = compareSets(contentSlugs, indexSlugs, sitemapSlugs);
    process.exit(hasErrors ? 1 : 0);
  } catch (error) {
    console.error('Validation failed:', error.message);
    process.exit(1);
  }
}

main();