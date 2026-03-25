import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONTENT_DIR = path.resolve('content/blog');
const INDEX_OUTPUT = path.resolve('src/data/blog-index.json');
const CONTENT_OUTPUT_DIR = path.resolve('public/blog-content');

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

// Read all .md files
const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

if (files.length === 0) {
  console.warn('Warning: No markdown files found in content/blog/');
  fs.writeFileSync(INDEX_OUTPUT, '[]');
  process.exit(0);
}

const blogIndex = files.map(filename => {
  const slug = filename.replace('.md', '');
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8');
  const { data: frontmatter, content: markdownBody } = matter(raw);

  const htmlContent = marked(markdownBody);

  // Write individual post JSON
  fs.writeFileSync(
    path.join(CONTENT_OUTPUT_DIR, `${slug}.json`),
    JSON.stringify({
      slug,
      title: frontmatter.title,
      categories: frontmatter.categories || (frontmatter.category ? [frontmatter.category] : []),
      tags: frontmatter.tags || [],
      date: frontmatter.date,
      img: frontmatter.img,
      excerpt: frontmatter.excerpt,
      featured: frontmatter.featured || false,
      faq: frontmatter.faq || [],
      content: htmlContent
    })
  );

  // Return metadata only (no content) for the index
  return {
    slug,
    title: frontmatter.title,
    categories: frontmatter.categories || (frontmatter.category ? [frontmatter.category] : []),
    tags: frontmatter.tags || [],
    date: frontmatter.date,
    img: frontmatter.img,
    excerpt: frontmatter.excerpt,
    featured: frontmatter.featured || false
  };
});

// Sort by date descending
blogIndex.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(INDEX_OUTPUT, JSON.stringify(blogIndex, null, 2));

console.log(`Blog build complete: ${blogIndex.length} posts processed.`);
