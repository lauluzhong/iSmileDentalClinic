#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve('content/blog');
const ALLOWED_TAGS = [
  'Myofunctional Orthodontics',
  'Clear Aligners',
  'Traditional Braces',
  'Orthodontics',
  'Pediatric Dentistry',
  'Restorative Dentistry',
  'Cosmetic Dentistry',
  'Oral Surgery',
  'Emergency Dental',
  'Preventive Care',
  'Oral Health',
  'Dental Technology'
];
const TAG_PRIORITY = Object.fromEntries(ALLOWED_TAGS.map((tag, i) => [tag, i]));

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = match[1];
  const lines = fm.split('\n');

  const data = {};
  data.content_type = 'educational';
  data.tags = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (line.startsWith('title:')) {
      data.title = line.replace(/^title:\s*/, '').trim().replace(/^['"]|['"]$/g, '');
      continue;
    }

    if (line.startsWith('content_type:')) {
      data.content_type = line.replace(/^content_type:\s*/, '').trim().replace(/^['"]|['"]$/g, '');
      continue;
    }

    if (line.startsWith('tags:')) {
      const remainder = line.replace(/^tags:\s*/, '').trim();
      if (remainder.startsWith('[') && remainder.endsWith(']')) {
        data.tags = remainder
          .slice(1, -1)
          .split(',')
          .map(t => t.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
      } else {
        const collected = [];
        for (let j = i + 1; j < lines.length; j += 1) {
          const tagLine = lines[j];
          if (/^\s*-\s+/.test(tagLine)) {
            collected.push(tagLine.replace(/^\s*-\s+/, '').trim().replace(/^['"]|['"]$/g, ''));
          } else if (/^\S/.test(tagLine)) {
            break;
          }
        }
        data.tags = collected;
      }
      continue;
    }
  }

  return data;
}

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
const violations = [];
let checkedEducational = 0;

files.forEach(filename => {
  const slug = filename.replace('.md', '');
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8');
  const frontmatter = parseFrontmatter(raw);
  const isEducational = (frontmatter.content_type || 'educational') === 'educational';
  if (!isEducational) return;

  checkedEducational += 1;
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
  const postErrors = [];

  if (tags.length < 1) {
    postErrors.push('must have at least 1 tag');
  }
  if (tags.length > 2) {
    postErrors.push('must have at most 2 tags');
  }

  const uniqueTags = new Set(tags);
  if (uniqueTags.size !== tags.length) {
    postErrors.push('contains duplicate tags');
  }

  const invalidTags = tags.filter(tag => !ALLOWED_TAGS.includes(tag));
  if (invalidTags.length > 0) {
    postErrors.push(`contains invalid tags: ${invalidTags.join(', ')}`);
  }

  for (let i = 1; i < tags.length; i += 1) {
    const prev = tags[i - 1];
    const curr = tags[i];
    if (TAG_PRIORITY[prev] > TAG_PRIORITY[curr]) {
      const expected = [...tags].sort((a, b) => TAG_PRIORITY[a] - TAG_PRIORITY[b]).join(', ');
      postErrors.push(`tags must follow canonical order (expected: ${expected})`);
      break;
    }
  }

  if (postErrors.length > 0) {
    violations.push({
      slug,
      title: frontmatter.title || slug,
      tags,
      errors: postErrors
    });
  }
});

console.log('=== Tag Validation ===');
console.log(`Checked educational posts: ${checkedEducational}`);
console.log(`Allowed tags: ${ALLOWED_TAGS.join(', ')}`);

if (violations.length === 0) {
  console.log('\n✅ All educational posts passed tag validation.');
  process.exit(0);
}

console.error(`\n❌ Found ${violations.length} post(s) with tag violations:\n`);
violations.forEach(v => {
  console.error(`- ${v.slug} (${v.title})`);
  console.error(`  Tags: ${v.tags.join(', ') || '(none)'}`);
  v.errors.forEach(err => console.error(`  • ${err}`));
});
process.exit(1);
