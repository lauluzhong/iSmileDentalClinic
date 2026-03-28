#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MECE Tag List (12 tags)
const MECE_TAGS = [
  'Pediatric Dentistry',
  'Orthodontics',
  'Myofunctional Orthodontics',
  'Clear Aligners',
  'Traditional Braces',
  'Cosmetic Dentistry',
  'Restorative Dentistry',
  'Oral Surgery',
  'Oral Health',
  'Preventive Care',
  'Emergency Dental',
  'Dental Technology'
];

function main() {
  const blogIndexPath = path.join(__dirname, '..', 'src', 'data', 'blog-index.json');
  const blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
  
  console.log('=== Filter Tag Analysis ===\n');
  
  // Count tags in MECE list
  const counts = {};
  
  blogIndex.forEach(post => {
    const tags = post.tags && post.tags.length > 0 ? post.tags : 
                (post.categories && post.categories.length > 0 ? post.categories : 
                (post.category ? [post.category] : []));
    
    tags.forEach(tag => {
      if (MECE_TAGS.includes(tag)) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    });
  });
  
  // Sort by count, then alphabetically
  const sortedTags = Object.entries(counts)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    });
  
  console.log('Filter Bar Tags (sorted by count):');
  console.log('==================================');
  sortedTags.forEach(([tag, count]) => {
    console.log(`${tag}: ${count} posts`);
  });
  
  console.log('\n=== MECE Tags Not Used ===');
  console.log('==========================');
  const usedTags = new Set(Object.keys(counts));
  MECE_TAGS.forEach(tag => {
    if (!usedTags.has(tag)) {
      console.log(`- ${tag} (0 posts)`);
    }
  });
  
  console.log(`\nTotal posts: ${blogIndex.length}`);
  console.log(`Tags in filter: ${sortedTags.length}`);
  console.log(`MECE tags used: ${usedTags.size}/12`);
}

main();