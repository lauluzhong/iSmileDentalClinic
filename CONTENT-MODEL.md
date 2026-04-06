# Content Model

This document describes the content structure for the iSmile Dental Clinic website.

## Blog Posts

Blog posts are stored as Markdown files in `/content/blog/`. Each post includes frontmatter metadata and content.

### Frontmatter Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `title` | string | Post title | Yes |
| `date` | string | Publication date (YYYY-MM-DD) | Yes |
| `categories` | array | Topic categories (deprecated, use `tags`) | No |
| `category` | string | Single category (legacy) | No |
| `tags` | array | Tags for filtering and classification | No |
| `img` | string | Featured image path | No |
| `excerpt` | string | Short summary for listings | No |
| `featured` | boolean | Whether to feature in blog listing | No |
| `faq` | array | FAQ items (objects with `q`, `a`) | No |
| `content_type` | string | `educational` (default) or `locality` | No |
| `priority` | string | SEO priority (P0-P2) | No |
| `tier` | string | SEO tier (T0-T2) | No |
| `parent_page` | string | URL of parent page for breadcrumbs | No |
| `cluster` | string | SEO cluster name | No |
| `keyword` | string | Primary target keyword | No |
| `created_at` | string | Internal creation date | No |

### Content Types

The `content_type` field controls how a blog post is displayed in the Learning Centre (blog listing):

- **`educational`** (default): Educational content about dental health, treatments, and patient education. These posts appear in the Learning Centre listing and are intended to inform and attract organic search traffic.

- **`locality`**: Location‑specific marketing content (e.g., “Why Choose iSmile Dental Clinic in Damansara Jaya”). These posts are **excluded** from the Learning Centre listing but remain accessible via direct URL and are indexed by Google. They target local search intent.

### Implementation Notes

- The blog listing (`src/pages/Blog.jsx`) filters posts with `content_type: 'educational'`.
- The `build-blog.js` script adds a default `content_type: 'educational'` if the field is missing.
- Existing posts have been updated to include `content_type: 'educational'`; the Damansara Jaya post is marked `content_type: 'locality'`.
- The classification ensures that the Learning Centre remains a pure educational resource while locality‑focused posts can still rank in search engines.

### CTA Button Placement

Each blog post now includes **two identical CTA buttons**:

1. **Above the FAQ section** – provides an immediate action opportunity before readers encounter detailed questions.
2. **In the post footer** – a second chance after the FAQ section.

Both buttons use the same `openBooking` call with the post’s title as the topic. The button above the FAQ is styled identically and appears inside a centered `<div>` with `marginTop: '60px'`.

This duplication improves conversion by reducing drop‑off between the content and the FAQ section.

## Changelog

- 2026‑04‑06: Added `content_type` field and CTA button above FAQ section.