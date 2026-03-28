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

// Mapping from old tags to new MECE tags
const TAG_MAPPING = {
  // Pediatric Dentistry
  'Kids & Growth': 'Pediatric Dentistry',
  'Children\'s Dentistry': 'Pediatric Dentistry',
  'Childrens Dentistry': 'Pediatric Dentistry', // Handle missing apostrophe
  'Pediatric Dentistry': 'Pediatric Dentistry',
  
  // Orthodontics
  'Orthodontics': 'Orthodontics',
  
  // Myofunctional Orthodontics
  'Myofunctional': 'Myofunctional Orthodontics',
  'Myofunctional Orthodontics': 'Myofunctional Orthodontics',
  'Airway Health': 'Myofunctional Orthodontics',
  'Early Intervention': 'Myofunctional Orthodontics',
  'LM Activator': 'Myofunctional Orthodontics',
  
  // Clear Aligners
  'Clear Aligners': 'Clear Aligners',
  'Invisalign': 'Clear Aligners',
  
  // Traditional Braces
  'Braces': 'Traditional Braces',
  'Traditional Braces': 'Traditional Braces',
  
  // Cosmetic Dentistry
  'Veneers': 'Cosmetic Dentistry',
  'Teeth Whitening': 'Cosmetic Dentistry',
  'Cosmetic Dentistry': 'Cosmetic Dentistry',
  
  // Restorative Dentistry
  'Dental Crowns': 'Restorative Dentistry',
  'Dental Implants': 'Restorative Dentistry',
  'Restorative Dentistry': 'Restorative Dentistry',
  
  // Oral Surgery
  'Wisdom Teeth': 'Oral Surgery',
  'Root Canal': 'Oral Surgery',
  'Oral Surgery': 'Oral Surgery',
  
  // Oral Health
  'Oral Health': 'Oral Health',
  'Gum Health': 'Oral Health'
};

function standardizeTags(oldTags) {
  if (!oldTags || !Array.isArray(oldTags)) return [];
  
  const standardized = new Set();
  
  oldTags.forEach(tag => {
    const mappedTag = TAG_MAPPING[tag];
    if (mappedTag) {
      standardized.add(mappedTag);
    } else {
      console.warn(`⚠️  Unmapped tag: "${tag}" - adding as-is`);
      standardized.add(tag);
    }
  });
  
  // Return sorted array
  return Array.from(standardized).sort();
}

function updateBlogPost(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      console.log(`❌ No frontmatter found in ${filePath}`);
      return false;
    }
    
    const frontmatter = frontmatterMatch[1];
    const lines = frontmatter.split('\n');
    let inTags = false;
    let tagsStart = -1;
    let tagsEnd = -1;
    let oldTags = [];
    
    // Find tags section
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('tags:')) {
        inTags = true;
        tagsStart = i;
        
        // Check if tags are on same line
        if (line.includes('[')) {
          const tagMatch = line.match(/tags:\s*\[(.*?)\]/);
          if (tagMatch) {
            const tagString = tagMatch[1];
            oldTags = tagString.split(',').map(t => t.trim().replace(/['"]/g, '')).filter(t => t);
            tagsEnd = i;
            inTags = false;
          } else {
            // Multi-line tags
            oldTags = [];
            let j = i + 1;
            while (j < lines.length && lines[j].trim().startsWith('-')) {
              const tagLine = lines[j].trim();
              const tagMatch = tagLine.match(/^-\s*['"]?(.*?)['"]?$/);
              if (tagMatch) {
                oldTags.push(tagMatch[1]);
              }
              j++;
            }
            tagsEnd = j - 1;
            inTags = false;
          }
        }
      }
    }
    
    if (tagsStart === -1) {
      console.log(`⚠️  No tags found in ${filePath}`);
      return false;
    }
    
    // Standardize tags
    const newTags = standardizeTags(oldTags);
    
    if (newTags.length === 0) {
      console.log(`⚠️  No standardized tags for ${filePath}`);
      return false;
    }
    
    // Create new tags section
    let newTagsSection;
    if (newTags.length === 1) {
      newTagsSection = `tags: ['${newTags[0]}']`;
    } else {
      newTagsSection = `tags:\n${newTags.map(tag => `- "${tag}"`).join('\n')}`;
    }
    
    // Replace tags section
    const newLines = [...lines];
    newLines.splice(tagsStart, (tagsEnd - tagsStart + 1), newTagsSection);
    
    // Reconstruct frontmatter and content
    const newFrontmatter = newLines.join('\n');
    const newContent = content.replace(frontmatterMatch[0], `---\n${newFrontmatter}\n---`);
    
    // Write back
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`✅ Updated ${path.basename(filePath)}`);
    console.log(`   Old: ${oldTags.join(', ')}`);
    console.log(`   New: ${newTags.join(', ')}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
function main() {
  const blogDir = path.join(__dirname, '..', 'content', 'blog');
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  
  console.log('=== Standardizing Blog Post Tags ===');
  console.log(`Found ${files.length} blog posts\n`);
  
  let updated = 0;
  let failed = 0;
  
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    if (updateBlogPost(filePath)) {
      updated++;
    } else {
      failed++;
    }
  });
  
  console.log(`\n=== Summary ===`);
  console.log(`Updated: ${updated} posts`);
  console.log(`Failed: ${failed} posts`);
  console.log(`\n=== MECE Tag List (12 tags) ===`);
  MECE_TAGS.forEach((tag, i) => {
    console.log(`${i + 1}. ${tag}`);
  });
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { standardizeTags, MECE_TAGS, TAG_MAPPING };