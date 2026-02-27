---
name: blog-architecture
description: Comprehensive developer guide for publishing new blog posts to the iSmile Dental Clinic website. Use when an automation agent (Zuck) needs to create and publish a new daily blog post, or when a developer needs to understand the blog system architecture.
---

# Blog Architecture Guide

This is the definitive guide for the iSmile Dental Clinic blog system. It covers the complete architecture, file structure, formatting rules, and step-by-step publishing workflow for the daily AI-generated blog pipeline.

---

## Architecture Overview

The blog uses a **Markdown-to-JSON build pipeline**:

1. Blog posts are authored as `.md` files with YAML frontmatter in `content/blog/`
2. A pre-build script (`scripts/build-blog.js`) processes all markdown files at build time
3. It generates a `blog-index.json` (metadata for listing) and per-post `{slug}.json` files (content for individual pages)
4. The React SPA reads the index for the listing page and fetches individual post JSON lazily

```
content/blog/                         # SOURCE: Markdown posts go here
  why-do-my-gums-bleed.md
  clear-aligners-vs-braces.md
  ...

scripts/
  build-blog.js                       # Pre-build: .md -> JSON artifacts

src/data/
  blog-index.json                     # GENERATED (gitignored): metadata array for listing

public/blog-content/
  {slug}.json                         # GENERATED (gitignored): per-post content with HTML

public/sitemap.xml                    # COMMITTED: manually maintained, append new entries

src/pages/
  Blog.jsx                            # Listing page with pagination
  BlogPost.jsx                        # Individual post page with SEO
```

---

## Frontmatter Schema (STRICT)

Every markdown file MUST include this exact frontmatter structure:

```yaml
---
title: "Your Blog Post Title Here"
category: "Category Name"
date: "YYYY-MM-DD"
img: "/images/blog/your-image-filename.png"
excerpt: "A compelling 1-2 sentence summary for SEO and card display."
featured: false
---
```

### Field Rules

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `title` | string | YES | Wrap in double quotes. Max ~70 chars for optimal SEO. |
| `category` | string | YES | Use existing categories: `"Oral Health"`, `"Restorative"`, `"Orthodontics"`, `"Oral Surgery"`, `"Cosmetic"`, `"Kids & Growth"`. New categories are allowed but should be intentional. |
| `date` | string | YES | ISO format `YYYY-MM-DD`. This determines sort order on the listing page. |
| `img` | string | YES | Path to the hero/card image. Must start with `/images/blog/`. |
| `excerpt` | string | YES | 1-2 sentences. Used for meta description, Open Graph, card text. Max ~160 chars for optimal SEO. |
| `featured` | boolean | YES | Set to `true` to make this the featured post on the listing page. Only ONE post should be `featured: true` at a time. |

---

## Markdown Content Rules

### File Naming Convention

The filename (without `.md`) becomes the URL slug. Use kebab-case:

```
content/blog/your-post-title-here.md  ->  /blog/your-post-title-here
```

- Use lowercase letters, numbers, and hyphens only
- No spaces, underscores, or special characters
- Keep it concise but descriptive (good for SEO)

### Content Structure

Write standard Markdown. The build script converts it to HTML using `marked`.

```markdown
### Section Heading

Paragraph text here. Use **bold** for emphasis and *italics* for subtle emphasis.

### Another Section

More content...

**Call to action text here.** Book a consultation with us today.
```

### Heading Rules

- Use `###` (h3) for section headings — NOT `#` or `##`
- The post title is rendered as `<h1>` by the component, so content should start at `###`
- Each post should have 4-7 section headings

### Image Syntax

Standard markdown images are auto-wrapped in the existing `blog-image-wrapper` CSS class:

```markdown
![Alt text describing the image](/images/blog/image-name.png)
```

To add a caption:

```markdown
![Alt text](/images/blog/image-name.png "This caption text appears below the image")
```

This produces:
```html
<div class="blog-image-wrapper">
  <img src="/images/blog/image-name.png" alt="Alt text" />
  <p class="image-caption">This caption text appears below the image</p>
</div>
```

### Image File Requirements

- Place images in `public/images/blog/`
- Preferred formats: `.png`, `.jpg`, `.webp`
- Recommended dimensions: 1200x630px (optimal for both hero display and Open Graph)
- Keep file sizes under 200KB when possible

### Formatting Patterns

- End every post with a bold CTA: `**Ready to take action?** Book a consultation...`
- Use natural, empathetic tone consistent with a dental clinic
- Avoid medical jargon without explanation
- Target 800-1200 words per post

---

## Step-by-Step Publishing Process

### For the Automation Agent (Zuck)

To publish a new blog post, execute these steps in order:

#### Step 1: Create the Markdown File

Create a new file at `content/blog/{slug}.md` with proper frontmatter and markdown content.

Example:
```
content/blog/benefits-of-dental-implants.md
```

#### Step 2: Add the Hero Image

Place the post's hero image at `public/images/blog/{image-name}.png`

If the image is AI-generated or sourced externally, ensure it's placed in the correct directory before proceeding.

#### Step 3: Update the Sitemap

Edit `public/sitemap.xml` — insert a new `<url>` block **before** the closing `</urlset>` tag:

```xml
  <url>
    <loc>https://ismile.com.my/blog/{slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

#### Step 4: Verify the Build

Run the build script to ensure the post processes correctly:

```bash
node scripts/build-blog.js
```

Expected output: `Blog build complete: N posts processed.`

Verify:
- `src/data/blog-index.json` contains the new post metadata
- `public/blog-content/{slug}.json` exists and contains HTML content

#### Step 5: Commit and Push

```bash
git add content/blog/{slug}.md public/images/blog/{image-name}.png public/sitemap.xml
git commit -m "blog: {short description of the post topic}"
git push
```

Vercel will auto-deploy. The `prebuild` hook in `package.json` runs `build-blog.js` during Vercel's build process, so the JSON artifacts are generated on the server.

#### Step 6: (Optional) Update Featured Post

If this post should be the new featured post:
1. Set `featured: true` in the new post's frontmatter
2. Set `featured: false` in the previous featured post's frontmatter
3. Include both files in the commit

---

## Build Pipeline Details

### `scripts/build-blog.js`

- Reads all `.md` files from `content/blog/`
- Parses frontmatter with `gray-matter`
- Converts markdown body to HTML with `marked`
- Custom image renderer wraps images in `<div class="blog-image-wrapper">`
- Outputs `src/data/blog-index.json` (metadata only, sorted by date descending)
- Outputs `public/blog-content/{slug}.json` (full post data with HTML content)

### npm Scripts

| Script | Command | When |
|--------|---------|------|
| `blog:build` | `node scripts/build-blog.js` | Manual: rebuild blog index |
| `prebuild` | `node scripts/build-blog.js` | Auto: runs before `npm run build` |
| `dev` | `node scripts/build-blog.js && vite` | Development: builds blog then starts dev server |
| `build` | `vite build` | Production: Vite build (prebuild runs first) |

### Generated Files (Gitignored)

These files are NOT committed — they're regenerated during every build:

- `src/data/blog-index.json` — Array of post metadata objects
- `public/blog-content/*.json` — Individual post content files

### Committed Files

These files ARE committed and must be maintained:

- `content/blog/*.md` — Source markdown files
- `public/sitemap.xml` — Sitemap with all blog URLs
- `public/images/blog/*` — Blog images

---

## Component Architecture

### Blog.jsx (Listing Page)

- Imports `blog-index.json` statically (Vite resolves at build time)
- Shows a featured post (first post with `featured: true`)
- Displays remaining posts in a responsive grid
- Client-side pagination: 12 posts per page via `useSearchParams`
- URL: `/blog` and `/blog?page=2`

### BlogPost.jsx (Individual Post Page)

- Fetches `/blog-content/{slug}.json` at runtime (lazy loading)
- Shows loading spinner during fetch
- Redirects to `/blog` if post not found
- Full SEO via React Helmet:
  - `<title>` and `<meta name="description">`
  - Open Graph tags (og:title, og:description, og:image, og:type=article)
  - Twitter Card tags (summary_large_image)
  - Canonical URL
  - BlogPosting JSON-LD structured data
- CTA button opens booking modal with post-specific prefill text

---

## Troubleshooting

### Post not appearing on listing page
- Run `node scripts/build-blog.js` and check output
- Verify frontmatter is valid YAML (check for unescaped quotes in title/excerpt)
- Check `src/data/blog-index.json` for the new entry

### Post shows "Loading..." forever
- Verify `public/blog-content/{slug}.json` exists
- Check browser devtools Network tab for 404 on the JSON fetch
- Ensure the filename matches the slug exactly (case-sensitive)

### Images not displaying
- Verify image file exists in `public/images/blog/`
- Check the `img` frontmatter path matches the actual filename
- Ensure markdown image syntax is correct: `![alt](path "optional caption")`

### Build script fails
- Check for syntax errors in frontmatter (missing quotes, incorrect YAML)
- Ensure `gray-matter` and `marked` are installed: `npm install`
- Run with verbose: `node --trace-warnings scripts/build-blog.js`
