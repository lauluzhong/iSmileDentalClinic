import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve('content/blog');
const INDEX_PATH = path.resolve('src/data/blog-index.json');
const SITEMAP_PATH = path.resolve('public/sitemap.xml');
const PUBLIC_DIR = path.resolve('public');
const ALWAYS_REQUIRED_FRONTMATTER_FIELDS = ['title', 'date'];
const NEW_POST_REQUIRED_FRONTMATTER_FIELDS = ['title', 'excerpt', 'date', 'img', 'content_type'];
const NEW_POST_FRONTMATTER_REQUIRED_FROM = '2026-05-04';

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = {};
  const lines = match[1].split('\n');

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const single = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!single) continue;

    const key = single[1];
    const value = single[2].trim();
    if (value) {
      data[key] = value.replace(/^['"]|['"]$/g, '');
      continue;
    }

    const list = [];
    for (let j = i + 1; j < lines.length; j += 1) {
      const item = lines[j].match(/^\s*-\s+(.+)$/);
      if (item) {
        list.push(item[1].trim().replace(/^['"]|['"]$/g, ''));
      } else if (/^\S/.test(lines[j])) {
        break;
      }
    }
    if (list.length) data[key] = list;
  }

  return data;
}

function readSlugsFromContent() {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  return files.map(f => f.replace('.md', ''));
}

function hasFrontmatterValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== '';
}

function shouldUseNewPostContract(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date || '')
    && date >= NEW_POST_FRONTMATTER_REQUIRED_FROM;
}

function validateFrontmatter() {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  const errors = [];

  files.forEach(filename => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8');
    const frontmatter = parseFrontmatter(raw);
    const slug = filename.replace('.md', '');

    ALWAYS_REQUIRED_FRONTMATTER_FIELDS.forEach(field => {
      if (!hasFrontmatterValue(frontmatter[field])) {
        errors.push(`${slug}: missing required frontmatter field "${field}"`);
      }
    });

    if (frontmatter.date && !/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date)) {
      errors.push(`${slug}: date must use YYYY-MM-DD`);
    }

    if (!shouldUseNewPostContract(frontmatter.date)) {
      return;
    }

    NEW_POST_REQUIRED_FRONTMATTER_FIELDS.forEach(field => {
      if (!hasFrontmatterValue(frontmatter[field])) {
        errors.push(`${slug}: missing new-post frontmatter field "${field}"`);
      }
    });

    if (hasFrontmatterValue(frontmatter.img)) {
      const imgPath = String(frontmatter.img).trim();
      if (imgPath.startsWith('/images/')) {
        const publicImagePath = path.join(PUBLIC_DIR, imgPath.replace(/^\//, ''));
        if (!fs.existsSync(publicImagePath)) {
          errors.push(`${slug}: img file not found at public${imgPath}`);
        }
      }
    }

    const hasCategories = hasFrontmatterValue(frontmatter.categories) || hasFrontmatterValue(frontmatter.category);
    if (!hasCategories) {
      errors.push(`${slug}: missing category/categories frontmatter`);
    }
  });

  return errors;
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
  const duplicateSitemapSlugs = sitemapSlugs.filter((slug, index) => sitemapSlugs.indexOf(slug) !== index);

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
  if (duplicateSitemapSlugs.length > 0) {
    console.error(`❌ Duplicate blog entries in sitemap.xml: ${[...new Set(duplicateSitemapSlugs)].join(', ')}`);
    hasErrors = true;
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
    const frontmatterErrors = validateFrontmatter();

    const hasErrors = compareSets(contentSlugs, indexSlugs, sitemapSlugs);
    if (frontmatterErrors.length > 0) {
      console.error('\n❌ Frontmatter validation failed:');
      frontmatterErrors.forEach(error => console.error(`- ${error}`));
    }
    process.exit(hasErrors || frontmatterErrors.length > 0 ? 1 : 0);
  } catch (error) {
    console.error('Validation failed:', error.message);
    process.exit(1);
  }
}

main();
