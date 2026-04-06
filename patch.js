const fs = require('fs');

// Patch scripts/build-blog.js
let buildBlog = fs.readFileSync('scripts/build-blog.js', 'utf8');
buildBlog = buildBlog.replace(
  '      category: frontmatter.category,',
  '      categories: frontmatter.categories || (frontmatter.category ? [frontmatter.category] : []), // migrated category field'
);
buildBlog = buildBlog.replace(
  '    category: frontmatter.category,',
  '    categories: frontmatter.categories || (frontmatter.category ? [frontmatter.category] : []), // migrated category field'
);
fs.writeFileSync('scripts/build-blog.js', buildBlog);

// Patch vite-plugin-blog-ssg.js
let pluginSSG = fs.readFileSync('vite-plugin-blog-ssg.js', 'utf8');
pluginSSG = pluginSSG.replace(
  "const safeCategory = escapeHtml(post.category || '');",
  "const safeCategory = escapeHtml((post.categories && post.categories[0]) || post.category || '');\n        const articleSection = post.categories ? post.categories.join(', ') : (post.category || '');"
);
pluginSSG = pluginSSG.replace(
  '"articleSection": post.category',
  '"articleSection": articleSection'
);
fs.writeFileSync('vite-plugin-blog-ssg.js', pluginSSG);

console.log('Patched JS files successfully.');
