# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

iSmile Dental Clinic website — a React SPA for a dental clinic in Petaling Jaya, Malaysia. Deployed on Vercel.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

No test framework is configured.

## Tech Stack

- **React 18** with Vite 6 (JavaScript, no TypeScript)
- **React Router v6** for client-side routing
- **Framer Motion** for animations and page transitions
- **React Helmet Async** for SEO/meta tags
- **Lucide React** for icons
- **Custom CSS** with CSS variables (no Tailwind) — inline styles in components
- Deployed on **Vercel** with SPA rewrite (`vercel.json`)

## Architecture

### Routing

Routes are defined in `src/App.jsx`. Key structure:

- `/` → Home
- `/about`, `/reviews`, `/blog`, `/contact`, `/faq` → standalone pages
- `/services` → ServicesLanding (overview of all categories)
- `/services/:category` → Services hub (ServiceHub) for a category
- `/services/:category/:specialty` → Individual specialty pages

Service categories: `protect`, `straighten`, `replace`, `enhance`, `children`.

### Layout & Navigation

`src/components/Layout.jsx` wraps all pages with Header + Footer. `PageTransition.jsx` provides Framer Motion page enter/exit animations using `location.key`.

### State Management

Single context: `src/context/BookingContext.jsx` — manages booking modal open/close state and prefill data. No Redux or other state libraries.

### Data Layer

- `src/data/servicesData.jsx` — all service categories, their services, tier1 spotlights, and metadata
- `src/data/blogPosts.js` — blog post content (HTML strings with metadata)

### Styling

CSS variables defined in `src/index.css`:
- Colors: `--color-primary-teal` (#4FA3C2), `--color-sky-blue`, `--color-pastel-blue`, `--color-tint-blue`, `--color-bg-cream`, `--color-text-charcoal`, `--color-text-grey`
- Fonts: `--font-heading` (Outfit), `--font-body` (Inter)
- Glassmorphism: `--glass-bg`, `--glass-blur` — used extensively across components

Most styling is inline in components, not in separate CSS files.

### External Integrations

- **Google Tag Manager** (GTM-NR9PQ2H7) in `index.html`
- **N8N webhook** for booking form submissions (in BookingModal.jsx)
- **WhatsApp** CTA links (phone: +60163638135)
- **Google Fonts**: Inter, Outfit loaded in `index.html`

### SEO

Each page sets its own title/description via React Helmet. Schema.org JSON-LD structured data is in `index.html`. Open Graph and Twitter Card meta tags are set per page.

## Key Patterns

### Whitespace in prose JSX (patient reviews, testimonials, body copy)

JSX **strips any whitespace that contains a newline**. When wrapping part of a
sentence in `<strong>`/`<em>`/`<a>`, a line break at the boundary silently
deletes the space:

```jsx
// WRONG — renders "ourfamily dentist"
She has been our
<strong>family dentist for more than 10 years</strong>

// RIGHT
She has been our{" "}
<strong>family dentist for more than 10 years</strong>
```

The same applies in reverse, when a line ends in `</strong>` and the next line
starts with a word. Rule: if a line break falls between a word and an inline
tag, end the line with `{" "}`.

**When transcribing real Google reviews, the text is quoted verbatim — never
"correct" it. If the rendered page shows a run-together word, assume it is this
JSX whitespace bug, not a typo in the review, and fix the markup.**

- Specialty pages live in `src/pages/specialties/` and are individually routed
- The `Reveal` component (`src/components/Reveal.jsx`) handles scroll-triggered fade-in animations
- Header has complex mobile navigation with sliding submenus (Framer Motion)
- Blog posts use slug-based routing derived from `blogPosts.js` data
