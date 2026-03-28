#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.resolve('content/blog');

// Read all .md files
const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

console.log('=== Blog Post Tag Audit ===\n');
console.log(`Total posts: ${files.length}\n`);

let postsWithoutTags = [];
let postsWithTags = [];
let allTags = new Set();
let allCategories = new Set();

files.forEach(filename => {
  const slug = filename.replace('.md', '');
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8');
  const { data: frontmatter } = matter(raw);

  const categories = frontmatter.categories || (frontmatter.category ? [frontmatter.category] : []);
  const tags = frontmatter.tags || [];
  
  // Collect all tags and categories
  categories.forEach(cat => allCategories.add(cat));
  tags.forEach(tag => allTags.add(tag));
  
  if (tags.length === 0) {
    postsWithoutTags.push({
      slug,
      title: frontmatter.title,
      categories
    });
  } else {
    postsWithTags.push({
      slug,
      title: frontmatter.title,
      tags,
      tagCount: tags.length
    });
  }
});

// Print results
console.log('=== Posts WITHOUT Tags ===');
if (postsWithoutTags.length === 0) {
  console.log('All posts have tags! ✅\n');
} else {
  console.log(`Found ${postsWithoutTags.length} posts without tags:\n`);
  postsWithoutTags.forEach(post => {
    console.log(`- ${post.slug}`);
    console.log(`  Title: ${post.title}`);
    console.log(`  Categories: ${post.categories.join(', ')}`);
    console.log('');
  });
}

console.log('=== Posts WITH Tags ===');
console.log(`Found ${postsWithTags.length} posts with tags:\n`);
postsWithTags.forEach(post => {
  console.log(`- ${post.slug}`);
  console.log(`  Tags (${post.tagCount}): ${post.tags.join(', ')}`);
});

console.log('\n=== Tag Statistics ===');
console.log(`Total unique tags: ${allTags.size}`);
console.log(`Total unique categories: ${allCategories.size}`);

console.log('\n=== All Unique Tags ===');
console.log(Array.from(allTags).sort().join(', '));

console.log('\n=== All Unique Categories ===');
console.log(Array.from(allCategories).sort().join(', '));

// Check for posts without FAQ sections
console.log('\n=== FAQ Section Check ===');
const postsWithoutFAQ = files.filter(filename => {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8');
  const { data: frontmatter } = matter(raw);
  return !frontmatter.faq || frontmatter.faq.length === 0;
});

console.log(`Posts without FAQ sections: ${postsWithoutFAQ.length}`);
postsWithoutFAQ.forEach(filename => {
  console.log(`- ${filename.replace('.md', '')}`);
});