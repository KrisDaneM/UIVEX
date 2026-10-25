# UIVEX

UIVEX is a frontend-only interactive React UI component studio. It combines live component previews, responsive state testing, local customization, favorites and presets, and reusable TypeScript source export in a polished metallic interface.

The current registry contains **147 distinct components** across buttons, forms, navigation, cards, feedback, loaders, overlays, effects, data visualization, media, layouts, and advanced interaction patterns. The registry—not a marketing constant—is the source of truth for this count.

## Features

- Searchable and filterable interactive component gallery
- Live component detail previews with responsive canvas controls
- Customization Playground with state simulation, undo/redo, local presets, copy, and download
- Local-only Workspace for favorites, recent components, and preset import/export
- Dark and light themes with reduced-motion support
- Route-specific metadata, structured data, static crawler fallbacks, and registry-generated sitemap entries
- Static Vercel-compatible deployment with no backend, accounts, analytics, or external API requirement

## Technology

React, TypeScript, Vite, Tailwind CSS, Motion for React, GSAP, Lucide React, React Router, Vitest, and ESLint.

## Local development

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Quality checks

```bash
npm run lint
npm run test
npm run build
```

The production build writes route-specific static HTML, `sitemap.xml`, and a production-aware `robots.txt` into `dist/`.

## Production URL and SEO configuration

No verified production website URL is stored in this repository. Configure both variables below to the same canonical HTTPS origin in your deployment environment (without a trailing slash):

```bash
SITE_URL=https://your-production-domain.example
VITE_SITE_URL=https://your-production-domain.example
```

- `SITE_URL` controls build-time canonical URLs, social image URLs, static route metadata, robots, and sitemap output.
- `VITE_SITE_URL` controls client-side metadata after React Router navigation.
- On Vercel, the generator also falls back to `VERCEL_PROJECT_PRODUCTION_URL` when `SITE_URL` is not supplied.

For a local production check:

```bash
npm run build
npm run preview
```

## SEO architecture

- Public routes receive unique titles, descriptions, canonical URLs, Open Graph/Twitter metadata, and truthful JSON-LD.
- Component metadata is generated from the central registry, so additions automatically enter the sitemap and static route output.
- Workspace and component-specific Playground URLs use `noindex` because they represent local or transient user state.
- The keyword research plan is in [`docs/UIVEX_SEO_KEYWORDS.md`](docs/UIVEX_SEO_KEYWORDS.md).
- The social preview is a real 1200 × 630 branded asset at `public/uivex-social.png`.

## Deployment

The app is prepared for static deployment on Vercel. Add the production URL variables, deploy the repository, then submit `/sitemap.xml` in Google Search Console after domain verification.

Repository: <https://github.com/KrisDaneM/UIVEX>

Suggested GitHub topics: `react`, `typescript`, `vite`, `tailwindcss`, `ui-components`, `component-library`, `animations`, `frontend`, `design-system`, `interactive-ui`.

## Privacy

UIVEX requires no account. Favorites, presets, recent components, and theme preferences stay in browser storage unless the user exports a workspace file.
