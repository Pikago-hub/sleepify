# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev           # Start development server (Next.js on port 3000)
bun run build     # Production build
bun start         # Start production server
bun lint          # Run ESLint (next lint)
```

Package manager is **bun**. No test framework is configured.

## Architecture

This is a **Next.js 15 + React 19 single-page marketing site** for "Sleepify" — a Progressive Web App (PWA) that processes YouTube audio for better sleep listening. Users paste a YouTube URL and Sleepify removes background music, normalizes volume, filters sound effects, adjusts speaking pace, and lowers voice pitch. It uses the App Router.

### Content-Driven Design

All site content (features, pricing tiers, testimonials, FAQs, links) is centralized in `src/lib/config.tsx` via the `siteConfig` object. To change copy or add sections, edit this file rather than individual components.

### Page Composition

`src/app/page.tsx` composes 12 section components in sequence: Header, Hero, FeatureScroll, FeatureHighlight, BentoGrid, Benefits, Features, Testimonials, Pricing, FAQ, CTA, Footer.

### Component Organization

- `src/components/sections/` — Page-level section components (hero, pricing, etc.). These are client components using `"use client"` for Framer Motion animations.
- `src/components/ui/` — Reusable primitives following **shadcn/ui "new-york" style** (Button, Card, Accordion, Drawer, Input, Label, Marquee). Add new components via the shadcn CLI.
- `src/components/section.tsx` — Shared wrapper providing scroll-triggered Framer Motion animations (opacity, y-transform) to all sections.

### Styling

- **Tailwind CSS v4** with inline `@theme` configuration in `src/app/globals.css` (no separate tailwind.config.ts for theme)
- Colors use **oklch** CSS variables with light/dark mode variants (Happy Hues Palette 12: dark navy #232946, lavender #b8c1ec, soft pink #eebbc3)
- Dark mode is the default theme, set via `next-themes` with class strategy
- Animations: Framer Motion for scroll/page animations; CSS `@keyframes` for marquee, border-beam, accordion

### Path Aliases

`@/*` maps to `src/*` (configured in tsconfig.json). Import as `@/components/...`, `@/lib/...`, etc.

### Key Libraries

- **framer-motion** — Scroll-triggered animations, parallax effects, page transitions
- **@radix-ui** — Accessible primitives (Accordion, Label, Slot)
- **class-variance-authority** — Component variant patterns (used in Button)
- **vaul** — Mobile drawer component
- **next-themes** — Dark/light mode toggle
- **geist** — Default font family

### Utilities (`src/lib/`)

- `utils.ts` — `cn()` for Tailwind class merging, `constructMetadata()` for Next.js SEO metadata, `absoluteUrl()`
- `animation.ts` — Shared cubic-bezier easing curves for Framer Motion
- `fonts.ts` — Google Fonts setup (Inter, JetBrains Mono)

### Environment Variables

`NEXT_PUBLIC_APP_URL` — Base URL for SEO/metadata (defaults to `http://localhost:3000`).

### Image Configuration

`next.config.mjs` configures remote image patterns for `localhost` and `randomuser.me`. Transpiles the `geist` package. Static assets (device screenshots, OG image) live in `public/`.
