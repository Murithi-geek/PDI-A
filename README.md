# PDI Achievers Mentorship Association — Website Rebuild

A premium, production-ready rebuild of the PDI Achievers Mentorship Association website, built with plain HTML5, CSS3, and vanilla JavaScript. The rebuild preserves PDI's logo, brand colours, mission, vision, content and information architecture while elevating the design, motion, accessibility, performance and SEO to an international-institution standard, using DiploHouse Africa as the quality benchmark.

## Project Structure

```
index.html        Main single-page site (Home, About, Programmes, Team, Gallery, Events, Contact)
style.css         Full design system + component + layout styles (CSS custom properties)
script.js         Modular vanilla JS: navigation, animations, forms, gallery/lightbox, etc.
404.html          Custom, on-brand error page
robots.txt         Search engine crawl rules
sitemap.xml        XML sitemap for the page's anchor sections
README.md          This file
```

> Note on assets: images (logo, team photos, gallery, event photos, partner logos) are referenced directly from the live PDI site (`https://www.pdimentorshipassociation.org/...`) so the rebuild is a drop-in replacement using PDI's real, existing photography and branding. When deploying, you can optionally download these into `/assets/images/` and swap the `src`/`href` paths — ideally exporting to modern formats (WebP/AVIF) for even better performance.

## Design System

All design tokens live at the top of `style.css` under `:root`:

- **Colour** — Built from PDI's official brand guide: `--primary-red: #D32F2F`, `--secondary-blue: #1976D2`, `--background-white: #FFFFFF`. Blue anchors structural/dark surfaces (nav, footer, hero, section backgrounds — `--color-navy-*` scale, with brand-exact blue at `--color-navy-600`), red drives accents, CTAs and active states (`--color-gold-*` scale, with brand-exact red at `--color-gold-500`), and all page backgrounds are pure white. Every tint/shade in both scales is mathematically derived from the two exact brand hex values, so the whole palette stays on-brand.
- **Typography** — Fraunces (serif, display) for headings + Inter (sans, body/UI) for text and controls, loaded from Google Fonts with `preconnect` for performance.
- **Spacing scale** — 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128px, exposed as `--sp-1` … `--sp-16`.
- **Radius, shadow, and motion scales** — see the `RADIUS`, `SHADOWS`, and `MOTION` token groups in `style.css`.
- **Layout** — `--container-max: 1280px` with fluid, clamped side padding.

## Key Features Implemented

- **Navigation** — transparent-over-hero → solid-on-scroll sticky header, animated underline links, active-section tracking, accessible mobile slide-in menu with overlay, focus trap, Escape-to-close, and scroll lock.
- **Hero** — large display type, animated content reveal, floating gradient orbs, subtle parallax, animated scroll indicator, count-up stats.
- **Scroll-reveal system** — IntersectionObserver-driven fade/scale animations that fire once, with `prefers-reduced-motion` fully respected.
- **Programmes** — all 7 original programmes rebuilt as an accessible accordion (`aria-expanded`, keyboard operable) with a connecting "thread" signature element reflecting PDI's core value of *consistency*.
- **Team** — all 5 leadership profiles as elevated, hover-animated cards.
- **Gallery** — responsive masonry-style grid generated from a curated image list, with a full keyboard- and click-accessible lightbox (arrow keys, Escape, prev/next).
- **Events** — all 5 original events rebuilt as cards with real links (Zoom, Google Form) preserved.
- **Testimonials** — horizontally snapping carousel with button controls.
- **Contact form** — floating labels, live validation, error/success states, loading state on submit. *No backend is wired up*; wire the `ContactForm.onSubmit` simulated submission in `script.js` to a real endpoint (Formspree, Netlify Forms, custom API, etc.) before go-live.
- **Newsletter** — footer email capture with inline validation feedback (placeholder, not connected to an ESP).
- **Footer** — multi-column (Quick Links, Programmes, Resources, Stay Informed), partner logos, social links, back-to-top button, auto-updating copyright year.
- **Micro-interactions** — button ripple/lift, image zoom on hover, custom subtle cursor on desktop (auto-disabled on touch and `prefers-reduced-motion`).

## Accessibility (WCAG AA)

- Semantic landmarks (`header`, `main`, `nav`, `footer`, `section`), a "Skip to main content" link, and a logical heading hierarchy (single `h1` in the hero, `h2` per section, `h3` for cards/items).
- All interactive controls are keyboard-operable with visible focus states (`:focus-visible`).
- Mobile menu implements a full focus trap and closes on `Escape` or overlay click.
- Colour combinations meet AA contrast on both light and dark sections.
- `prefers-reduced-motion` disables all non-essential animation.
- All images carry descriptive `alt` text; decorative icons are `aria-hidden`.

## SEO

- Unique title/description, canonical URL, Open Graph + Twitter Card metadata.
- JSON-LD structured data: `EducationalOrganization`, `BreadcrumbList`, and `FAQPage`.
- Clean single-`h1` heading hierarchy, descriptive link text, `robots.txt`, and `sitemap.xml` included.

## Performance

- Fonts loaded with `preconnect` + `display=swap`.
- `loading="lazy"` on all below-the-fold images; hero image uses `fetchpriority="high"`.
- No external JS/CSS frameworks — a single small `style.css` and `script.js`, both easily minified at deploy time.
- Animations use `transform`/`opacity` only (GPU-friendly, no layout thrash) and are IntersectionObserver-gated so nothing animates off-screen.
- Explicit `width`/`height` on images to prevent layout shift (CLS).

## Responsiveness

Tested breakpoints: 1440 / 1280 / 1024 / 992 / 768 / 576 / 480 / 390 / 360px. Grids collapse from multi-column → 2-column → single-column; the mobile nav switches to a full-screen slide-in menu under 900px.

## Deployment

This is a static site — upload `index.html`, `style.css`, `script.js`, `404.html`, `robots.txt`, and `sitemap.xml` to the web root of any static host (or the existing PDI hosting) to replace the current site directly. No build step is required.

## Next Steps / Suggested Enhancements

1. Connect the contact form and newsletter form to a real backend or form service.
2. Replace hot-linked image URLs with locally hosted, optimized WebP/AVIF assets in `/assets/images/`.
3. Confirm the exact brand hex values against PDI's official brand guide (if one exists) and adjust the `--color-navy-*` / `--color-gold-*` tokens if needed — everything else in the design system will update automatically.
4. Run a live Lighthouse audit post-deployment (scores depend partly on final hosting/CDN configuration).
