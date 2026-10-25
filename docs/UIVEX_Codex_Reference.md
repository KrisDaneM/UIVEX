# UIVEX — Website Product, UI/UX & Engineering Blueprint

> Machine-readable companion to `UIVEX_Website_Blueprint.docx`; the Word document remains the presentation copy.

PRODUCT REQUIREMENTS  /  UI/UX SYSTEM  /  CODEX HANDOFF

> UIVEX  /  
> INTERACTIVE UI COMPONENT DESIGN STUDIO  
> Design. Customize. Create.

Project blueprint for implementation with Codex

Version 1.0   |   Prepared 12 October 2026   |   Format: implementation-ready requirements

> PRODUCT IN ONE SENTENCE  A polished, original, frontend-only gallery where anyone can discover real working UI components, experiment with their states, adapt them to a brand, and copy accurate, usable code—without creating an account.

### Locked project decisions

| Product | Decision |
| --- | --- |
| Name | UIVEX (not VEX or ComponentLab). Wordmark can appear as UIVEX or uivex. |
| Palette | Deep Navy & Ice Cyan: #101820 / #202D38 / #80E5E0 / #F3F7F8 / #93A5AF. |
| Architecture | Static frontend only. No login, no registration, no database, no server-side API, no AI, no paid service. |
| Core stack | React + Vite + Tailwind CSS; GSAP and/or Motion used selectively; Lucide React; Vercel. |
| Navigation | Explore · Playground · Collections · Workspace · Guide. Logo opens Home. |
| Personality | Distinctive editorial developer tool; dense but breathable; creative without visual clutter or generic AI/SaaS styling. |

This document defines intended functionality. Screenshots/concept art are mood references only: do not copy their accidental Sign in controls, fake usage statistics, excessive glow, or glass-like treatments.

## 01  Product purpose, users & guardrails

UIVEX is a free, privacy-conscious UI component discovery and experimentation tool. Its value is not the number of static snippets, but how quickly a user can find, inspect, test, customize, and integrate a component into a real project.

### User groups

| Audience | Typical job to be done | Meaningful value |
| --- | --- | --- |
| Frontend students | Find a functional component and understand how it is built. | Readable code and dependency notes; keyboard/state previews. |
| Working developers | Find, edit, test, and paste a component into an existing React project. | High-quality code; responsive behavior; reliable copy/export. |
| Designers / UI enthusiasts | Experiment with colors, shapes, timing, and interactions. | Visual controls; palettes; side-by-side comparison. |
| Freelancers | Assemble cohesive interfaces with limited time. | Curated collections and reusable design tokens. |

### Non-negotiable constraints

- No user authentication, accounts, profile pages, subscriptions, payment, ratings, online submissions, public uploads, moderation, or cloud synchronization.

- No MongoDB, SQL, Firebase, Supabase, serverless backend, LLM API, external API keys, or any required network-based API. Static assets and dependency package downloads at development time are fine.

- All previews use locally bundled source and component metadata; search, filtering, and favorites operate locally.

- Saved presets, theme, recent items, and favorites use localStorage only if enabled; export/import JSON is the portability mechanism. Browser clearing resets local data.

- Every visible feature must function. No dummy buttons, dead navigation, fake component counts, pretend code converters, misleading accessibility scores, or placeholder testimonial/traffic metrics.

- Original component implementations and original visual identity. Do not copy UIverse branding, layouts, proprietary designs, or snippets verbatim.

### Success journey

Explore → inspect a live preview → open detail → customize in Playground → test breakpoints and interaction states → copy production-usable code → optionally save locally or export a preset. Every step must work without signing in.

## 02  Brand system & color tokens

### Brand identity

Product name: UIVEX. Public descriptor: “Interactive UI Component Design Studio”. Optional brand expansion: UI + Visual Experience & eXploration. Tone: precise, inventive, useful—not overhyped. Tagline: “Design. Customize. Create.”

### Core palette (locked)

| Token | Hex | Use / rule |
| --- | --- | --- |
| navy-950 | #101820 | App shell / dark background. |
| navy-850 | #202D38 | Navigation, control panels, dark cards. |
| ice-cyan | #80E5E0 | Primary actions and selection; pair with dark text. |
| ice-white | #F3F7F8 | Primary text on dark; light-theme base. |
| slate-muted | #93A5AF | Secondary text/icons; verify contrast for small text. |
| dark-border | #344550 | Thin separators; deliberately restrained. |
| light-surface | #FFFFFF | Light-mode panels and reading areas. |
| light-text | #202D38 | Primary light-mode text; also text on cyan buttons. |
| light-accent-ink | #07646E | Readable links, outlines and selected text on light backgrounds. |

### Theme rules

- Default dark theme follows the five selected hex values. Full light mode is supported, with #F3F7F8 background, white surfaces, and deep navy text.

- The gallery shell theme is separate from each component preview canvas; preview may toggle Light / Dark / Checkerboard when appropriate.

- Use cyan as a focused accent rather than a universal glow. Buttons, active navigation, focus indicators, sliders, and small highlights may be cyan.

- Do not use bright cyan as a text color over white. Prefer #07646E for light-theme links, and #202D38 on cyan-filled buttons.

- Semantic colors (error, warning, success) are allowed only where genuinely needed; they must not replace brand hierarchy.

## 03  Visual direction: deliberate, not AI-slop

| DO | AVOID |
| --- | --- |
| Typography-led hierarchy; distinctive restrained wordmark; precise alignment. | Interchangeable SaaS hero phrases and generic template typography. |
| Compact information architecture, modular grids, purposeful negative space. | Huge dead zones, giant empty hero banners, cramped cards. |
| Flat matte surfaces, subtle tonal variations, 1px borders, clear icons. | Glassmorphism, frosted cards, oversized luminous orbs, gradient overload. |
| Authentic live examples as the visual hero; refined microinteractions. | Fake 3D visuals, animation everywhere, irrelevant decoration. |
| Consistent radii 8–14px, balanced 4/8px spacing system. | Random radius, inconsistent shadows, uneven component heights. |
| Visible responsive behavior and keyboard support. | Desktop-only design; horizontal overflow; hover-only actions. |

### Layout standards

Use a centered page grid with max-width about 1440px; 24–32px desktop gutters, 16–24px tablet, 12–16px compact mobile. Main application content should use available width efficiently. Prefer narrow editorial introductions over large marketing sections.

Typography: Aptos/Inter/Geist-like clean sans-serif (use a project-licensed or system font). Headline 40–64px responsive; page titles 28–36px; body 14–16px; detail metadata 12–13px minimum when critical. No microtype for technology labels.

## 04  Navigation, sitemap & routing

### Primary top navigation (five items only)

| Label | Path | Behavior |
| --- | --- | --- |
| Explore | /explore | Default discovery destination, prominent active state. |
| Playground | /playground | Shows searchable selector/last-opened entry; never a blank editor. |
| Collections | /collections | Groups of coherent component families and recipes. |
| Workspace | /workspace | Favorites and saved presets stored locally. |
| Guide | /guide | Usage, installation, accessibility, troubleshooting. |

The UIVEX logo opens /. Right-side utilities: Cmd/Ctrl+K search, theme toggle, optional GitHub link only if there is a real repository. No Sign in / Join / Get Pro button.

### Supporting routes

| Route | Purpose |
| --- | --- |
| / | Compact homepage with featured components, direct search, categories and featured workflows. |
| /components/:slug | Functional component overview, demos, description, variants, dependencies and direct Customize action. |
| /playground/:slug | Selected component with property editor, state simulation, viewport controls and live code. |
| /collections/:slug | Collection detail with ordered, directly openable components and usage guidance. |
| /about | Short, honest project purpose, privacy/local data policy and credits. |
| /changelog | Real dated release notes only. |
| /* | Helpful 404 with Explore and Home links. |

### Responsive navigation behavior

Desktop: compact horizontal top bar with brand on the left, five links center/left, search/theme utilities right. Tablet: condense spacing; move low-priority utilities into menu before links overlap. Mobile: persistent compact top bar with brand, search, and menu button; accessible full-height or appropriately sized overlay with the same five links and close action. Avoid horizontally scrolling tabs in primary navigation.

## 05  Page-by-page structure

### 5.1 Home — /

Purpose: immediately explain the product and help users discover a component, not market a nonexistent SaaS.

- Slim header/navigation → short brand introduction (“Design without limits” or a specific helpful line) → one primary search → two meaningful CTAs: Explore Components and Open Playground.

- Featured components: 6–8 working live previews drawn from the real registry. Every card links correctly.

- Category shortcuts (Buttons, Cards, Forms, Loaders, Navigation, Effects) and one curated “Start building” collection.

- A compact 3-step “Explore / Customize / Copy” explainer; useful footer with Guide, About, Changelog, and privacy note.

- No fabricated “300+ components”, “50+ templates”, usage claims, social proof, or dummy statistics. Derive all counts from actual content.

### 5.2 Explore — /explore

- Page header with component total computed from registry; focused keyword search; category chips/sidebar; tags, complexity, animation, and React/Tailwind-ready filters as supported.

- Cards render the real component or an intentional generated preview; display title, category, descriptive tags and favorite icon, with View Details and Customize accessible on focus/click.

- Sort Newest, Name A–Z, and categories that have real metadata; URL query parameters hold search/filter state when practical.

- Provide friendly empty result state with clear filters and suggestions; skeletons only for real async work (not static data).

### 5.3 Component detail — /components/:slug

- Breadcrumb and truthful title; hero-sized live preview; Light/Dark background toggle; responsive width control; state examples when relevant.

- Variant gallery, function and interaction notes, keyboard behavior, dependencies, props, usage instructions.

- Working actions: Customize in Playground, Copy code, Download supported files, Favorite.

- Below fold: composable similar components drawn from registry, not generic placeholders.

### 5.4 Playground — /playground and /playground/:slug

Desktop: workspace-oriented layout: library/variant picker (optional left rail), dominant live preview (center), compact inspector (right), and collapsible code panel (bottom or docked tab). Controls remain reachable without huge gaps; right panel scrolls separately only when necessary.

- Inspector controls based on actual component capabilities (label, variant, color, radius, padding, font weight, border, shadow, animation speed, icons). Unsupported props are hidden, not fake.

- Interaction states: default, hover, focus-visible, pressed, disabled, loading, error, success where supported. Accessible state toggles and labels.

- Responsive preview widths: 320, 375, 390, 768, 1024, 1440px plus custom slider / input. Explicit canvas scale or scroll at small widths.

- Code tabs only for real supported outputs; React JSX + Tailwind baseline. HTML/CSS only on components with correctly maintained equivalents.

- Undo / redo (where implemented), Reset, Before / After, Save preset locally, Copy code and Download; copied code must match selected properties.

- No executing arbitrary pasted code or unsafe eval. Render a safe internal component registry with validated property values.

### 5.5 Collections + collection detail

Collections show curated groups with a practical purpose: Authentication UI (visual forms only, not real authentication), Navigation, Dashboard Essentials, Landing Sections, Feedback/States, Commerce UI (visual only). Each collection lists included components and use cases, with no misleading functional backend behavior. Collection details have previews and optional preset application.

### 5.6 Workspace — /workspace

Organize locally stored favorites, custom variants, and recently opened components. Include export all to JSON, import JSON with schema validation, remove/delete confirmation, storage warning and an informative first-time empty state. Never suggest cross-device sync. If storage is blocked, fall back to in-session state and explain that changes will not persist.

### 5.7 Guide — /guide

Searchable internal documentation: Quick start; Install dependencies; React/Tailwind usage; copy/export; editing components; variants and states; responsive and accessibility principles; local storage & privacy; troubleshooting. Include accurate snippets, package versions and “what to do after copying” instructions.

### 5.8 About, changelog, 404

About: product purpose and honest no-account privacy story. Changelog: reflect real releases from static data. 404: not-found explanation, back button, Explore action. Keep these secondary footer routes, not navbar clutter.

## 06  Component gallery content strategy

Launch target: 30–50 carefully built, distinct original components. Prioritize fidelity, actual interactivity and useful code over reaching a large artificial count. First milestone can ship 12–18 complete components, then expand. Each component needs live rendering, at least one purposeful variation, readable snippets, tested responsive behavior and keyboard behavior.

| Category | Examples (plan, not a claim of already-built inventory) |
| --- | --- |
| Buttons & actions | Primary, secondary, icon, split, loading, destructive confirmation, animated underline. |
| Forms & controls | Text input, search field, password visibility, checkbox, radio, toggle, segmented control, select. |
| Cards & content | Profile summary, feature card, pricing card (visual only), expandable content card, media card. |
| Navigation | Top navigation, breadcrumbs, tabs, pagination, accordion, mobile menu. |
| Feedback | Toast, status badge, progress bar, skeleton, spinner, empty state, tooltip. |
| Overlays | Modal/dialog, popover, drawer, context menu. |
| Motion & visuals | Reveal on scroll, animated text treatment, decorative loader, hover tilt (reduced-motion aware). |

### Mandatory component metadata

Each registry entry must have stable slug and category, accurate short description, tags, complexity, supported controls and states, importable preview component, code generator/template, dependency manifest and accessibility notes. New additions should require data and source, not updates in multiple unrelated pages.

```text
src/components/catalog/GlowButton.tsx  # real renderable component
src/components/catalog/GlowButton.export.ts  # export source
src/data/componentRegistry.ts  # names/tags/categories/props
src/data/collections.ts  # curated membership
src/data/searchAliases.ts  # local synonyms and keywords
```

## 07  Differentiating features & delivery priority

| Feature | Required outcome | Phase |
| --- | --- | --- |
| Live component playground | Controls change rendered component and generated code together. | MVP |
| Responsive preview studio | Preset/mobile/custom widths and overflow detection where reliable. | MVP |
| Component state simulator | Test supported hover/focus/loading/disabled states. | MVP |
| Local favorites / workspace | Browser persistence + reliable export/import of presets. | MVP |
| Smart local finder | Search by name, tags, use-case keywords, synonyms; no AI/API. | MVP |
| Code export studio | Faithful React + Tailwind output with dependencies. | MVP |
| Brand theme generator | Create/edit shared design tokens, apply to compatible components. | Next |
| Before/after comparison | Show original and edited versions side by side. | Next |
| Component recipes | Curated compatible sets with one-click open/apply. | Next |
| Animation timeline editor | Adjust duration/delay/easing for animations that support it. | Advanced |
| Accessibility inspector | Real contrast/focus/touch target checks with limited scope clearly stated. | Advanced |
| Component mixer | Arrange compatible sections and export responsive page composition. | Advanced |

> HONESTY RULE  Accessibility tools may evaluate defined heuristics; never claim complete WCAG certification. Responsive overflow checks must be performed on actual content and clearly report what was inspected. AI-like search suggestions must be implemented with local keywords, not pretend intelligence.

## 08  Interaction, motion & microanimation

### Motion philosophy

Motion should communicate focus, causality, transitions and feedback. UI responsiveness comes before visual flourish. Favor transform and opacity; avoid layout-thrashing animations.

| Interaction | Specification |
| --- | --- |
| Page transitions | Subtle 140–240ms fade/slide, optionally 280ms on landing hero; content never blocked. |
| Hover / press | 100–180ms transitions, subtle 1–2px movement or contrast; do not overuse scale/glow. |
| Gallery cards | Reveal minimal details on hover; all actions remain usable via keyboard and touch. |
| Navigation | Clear selected state and compact animated underline; mobile overlay traps focus and closes on Escape. |
| Modal / drawer | Short exit/enter transitions, scroll lock when necessary, focus restoration. |
| Playground updates | Immediate live updates; debounce heavy optional exports, not core typing feedback. |
| GSAP ScrollTrigger | Reserve for genuinely valuable home storytelling; no compulsory effects in docs or editors. |
| Reduced motion | Honor prefers-reduced-motion: reduce/disable nonessential movement and smooth-scroll. |
| Smooth scrolling | Optional Lenis only if it does not break native accessibility, anchors or performance. |

### Performance safeguards

- Lazy-load detail pages and heavyweight demos; avoid mounting 50 active continuous animations at once.

- Pause motion offscreen; avoid autoplay effects in all component cards if costly.

- Keep GSAP and Motion use purposeful: prefer CSS transitions for simple UI feedback.

- Clean up listeners, observers, timelines; no memory leaks on route changes.

## 09  Responsiveness & layout acceptance

Mobile-first from 320px to ultra-wide desktop. Test at least 320, 360, 375, 390, 430, 667×375 landscape, 768, 834, 1024, 1280, 1440 and 1920px. The UI must not introduce horizontal page scroll.

| Viewport | Expected layout |
| --- | --- |
| ≥ 1280 desktop | 5-link navbar, 3–4 gallery columns (by min width), multi-panel Playground, independent inspector. |
| 768–1279 tablet | 2–3 gallery columns, condensed navbar, Playground 2-panel or collapsible inspector. |
| ≤ 767 mobile | 1–2 gallery columns based on genuine card minimum width; menu drawer; Playground tabbed panels. |
| 320–390 small mobile | Single column when needed; 44×44px tap targets; controls wrap/stack; code can scroll inside block only. |
| Landscape phone | Short viewport navigation fits; preview does not block the inspector/code switcher. |

### Specific responsive rules

- Use CSS grid minmax and container queries where beneficial; do not switch to one-column too early on tablet.

- No clipping or overlapping navigation links, tags, titles, component previews or right inspector.

- Mobile Playground tabs: Preview | Controls | Code; a sticky action row for Copy/Save only when space permits. All controls remain accessible.

- Honor safe-area insets for fixed mobile controls; keyboard-visible form interactions should not hide Save/Copy actions.

- Use correct device viewport inside preview and avoid confusing the preview iframe/canvas width with the actual screen width.

## 10  Accessibility, usability & quality bars

- Meet WCAG 2.2 AA practices wherever applicable: semantic landmarks/headings, accessible names, meaningful button semantics, contrast and logical focus order.

- Every actionable UI works with keyboard; visible focus rings; Escape closes overlays; dialogs manage focus and return it on close.

- Contrast-check small text and secondary labels in both themes. Cyan fills should use dark foreground. Do not rely on color alone for state.

- Minimum touch targets around 44×44px for primary mobile controls; labels, tooltips and code actions should be perceivable.

- Announce copy success / save success through accessible live-region feedback; announce empty results and invalid imports clearly.

- Images and illustrated previews need helpful alt text where needed; purely decorative assets have empty alt.

- Include tests for search, routes, preview updates, generator consistency, local persistence, clipboard failure, bad import, 404 and mobile widths.

## 11  Data handling, privacy & safe local execution

### No database or external API

The complete experience must work after static deployment from bundled JS/CSS/assets (apart from obtaining the initial page). No Express service, auth provider, serverless API route, analytics collector, external avatar endpoint, hosted snippet service, or app backend is required. Deployment on Vercel is static.

### Browser storage contract

| Stored locally | Expected behavior |
| --- | --- |
| theme | Dark/light preference; sensible default when unset. |
| favorites | Array of known component IDs/slugs, validated against registry. |
| saved presets | Versioned JSON of component slug + safe supported property values. |
| recent components | Bounded list of opened component slugs. |
| design tokens | Optional named global theme/palette presets. |

Use namespaced keys like uivex:v1:favorites. Validate parsed objects, enforce limits, handle unavailable storage gracefully, provide clear/remove all controls. Never upload personal content or store passwords. User data persists only in this device/browser.

### Safety of component previews

Only render trusted components compiled into the project. Do not accept executable React/JS from visitors. Do not use eval, new Function, dangerouslySetInnerHTML with untrusted content, or import arbitrary remote scripts. If a code editing feature is proposed in a later version, isolate it securely; omit it from MVP.

## 12  Technical architecture & project structure

Recommended implementation: React + Vite + Tailwind CSS + React Router + Lucide React; Motion for React and/or GSAP where needed; localStorage; optional pdf or image export libraries only if new features truly require them. Do not install a broad UI kit that makes the site visually generic. Use JavaScript or TypeScript consistently; TypeScript preferred for safe component configuration.

```text
src/
  app/                 # router, theme provider, app shell
  components/
    ui/                # app's own primitives
    catalog/           # original demo components + export templates
    preview/           # safe preview renderer and state controls
    playground/        # inspectors, viewport switcher, code panel
  data/                # componentRegistry, collections, guides, aliases
  features/            # search, favorites, presets, code export
  hooks/               # storage, resize, reduced motion
  pages/               # Home, Explore, Details, Playground...
  styles/              # tokens, globals, responsive rules
  utils/               # validators, clipboard, exports, a11y helpers
  tests/               # unit, interaction and responsive checks
public/                # locally bundled preview/documentation assets
docs/                  # UIVEX_Website_Blueprint.docx
```

### Key engineering rules

- One source of truth for metadata, supported props, preview components, exported snippets, and collection references.

- Changes in inspector controls must update both preview and the exact copy/export output. Favor functions that generate source from a validated config, with tests.

- Show installation instructions that match package imports and Tailwind version. Export formats not maintained as true equivalents must not appear as clickable options.

- Component IDs stable and versioned for migration; broken saved presets should fail gently rather than crash the app.

- No artificial loading delays. Code-split heavy functionality, defer optional animations and test production build.

- Use only free local icons/fonts/assets with appropriate licenses and attribution as required.

## 13  Priority roadmap & Codex execution gates

| Phase | Deliverables | Completion gate |
| --- | --- | --- |
| 0 / Foundation | Repo setup; Vite, router, tokens, theme, responsive shell, lint and test setup. | No errors; all five navs route correctly; dark/light toggle works. |
| 1 / Core product | Homepage, Explore, details, real catalog (12–18), local search/filter, modal/error/empty states. | Working previews, links, keyboard and responsive behavior. |
| 2 / Playground MVP | Property inspector, states, widths, live React/Tailwind source, copy, reset, favorites/presets. | Preview/code parity, clipboard feedback, local save/load. |
| 3 / Content & polish | Grow catalog toward 30–50 originals, Collections, Workspace, Guide, about/changelog, import/export. | No fake inventory; real component descriptions and metadata. |
| 4 / Differentiators | Tokens, comparisons, recipes; then timeline/accessibility/mixer only after core is stable. | Each advanced tool has specific tests and authentic results. |
| 5 / QA & ship | Full keyboard, light/dark, reduced motion, 320→1920, tests, static build and Vercel setup. | No dead interactions, clipping, console errors or missing routes. |

### Implementation workflow for Codex

1. Inspect the repository, understand existing code and dependencies, then map this specification to existing files. Do not overwrite unrelated work.

1. Write a concise task checklist and implement the next coherent, testable phase; do not attempt the entire advanced roadmap in one unstable change.

1. Run install, lint, typecheck (if TS), build and relevant tests; use Playwright or browser checks for real interactions if available.

1. At each phase report routes/features completed, important files changed, test results, and next steps. Do not claim a feature is working without verifying it.

1. When visual changes are made, compare at desktop/tablet/mobile and correct spacing/overflow, not only hero aesthetics.

## 14  Final QA acceptance checklist

- ☐  Brand always says UIVEX and correct dark palette is applied consistently.

- ☐  Exactly five main navs; logo home; no sign-in or user-account CTA anywhere.

- ☐  No database connection, backend routes, external APIs or secrets are required.

- ☐  All Explore filters return correct component cards; query clear, sort and empty states work.

- ☐  Every advertised component demo actually renders; tap/keyboard interactions work.

- ☐  Customization controls match actual capabilities and update rendered preview.

- ☐  Responsive preview includes width presets and respects narrow canvases.

- ☐  Copied code corresponds to editor controls and includes correct dependencies.

- ☐  Favorites and presets work offline within the browser; JSON import handles malformed input.

- ☐  Collections and Guide contain accurate, useful examples and functional internal links.

- ☐  Dark/light schemes readable; keyboard focus visible; modals and menu escape properly.

- ☐  No horizontal document overflow at 320, 360, 375, 390, 768, 1024 or 1920px.

- ☐  Reduced motion is respected; animations smooth and performance does not degrade with scrolling.

- ☐  No fabricated metrics, dummy buttons, copied competitor UI or misleading accessibility claims.

- ☐  Production build passes and Vercel deep routes resolve with correct SPA fallback.

## 15  Design wireframes (structure, not screenshot imitation)

### Desktop home composition

```text
[ UIVEX ] [ Explore Playground Collections Workspace Guide ] [ Search ][ Theme ]
--------------------------------------------------------------------------
[ Focused hero title + purpose + primary actions ] [ Featured live preview ]
[ Search all components ------------------------------------------------ ]
[ Browse by category: Buttons | Cards | Forms | ... ]
[ Featured real components: responsive cards, consistent preview height   ]
[ One useful curated collection + short three-step workflow             ]
[ Footer: About | Guide | Changelog | privacy note ]
```

### Desktop Playground composition

```text
[ UIVEX global header ------------------------------------------------- ]
[ Back / Breadcrumb ] [ Component title ] [ Favorite | Reset | Copy ]
[ Component list ] [ Live preview canvas -------------- ] [ Inspector ]
[ Component list ] [ Viewport presets | state controls -] [ Props     ]
[ Component list ] [ Live preview canvas -------------- ] [ Props     ]
[ Code tabs: React + Tailwind | deps ] [ Copy | Download ]
[ Mobile: Preview / Controls / Code tabs instead of three columns ]
```

## 16  Practical end-to-end user scenarios

These examples define what “helpful in real life” means for this product. Treat them as acceptance tests, not decorative demo flows.

- Find and use: a student searches “loading submit button”, finds an actual component, sees focus and loading states, copies JSX and sees documented imports.

- Customize correctly: a developer changes text, padding, radius and color; all changes appear immediately, and pasted code reproduces the preview.

- Check mobile: a freelancer previews the component at 320px and 390px, adjusts spacing, and sees whether labels remain readable without overflow.

- Create consistent branding: a designer chooses a navy/cyan token set; compatible components share those tokens, while unrelated preview themes remain independent.

- Work privately: someone favorites six components, saves two variants, closes the tab, returns, and sees the same locally saved selections.

- Move between devices manually: a user exports workspace JSON, imports it in another browser and receives a clear success message with preserved valid presets.

- Use keyboard and reduced motion: a user tabs through controls, opens and closes a dialog using keyboard, and sees nonessential motion suppressed by OS preference.

- Recover from errors: blocked clipboard, localStorage disabled, unknown component URL, missing dependencies and invalid preset JSON each show a helpful recovery action.

## 17  Content, empty states & launch rules

- Use truthful category names and specific descriptions: “Input with clear action and keyboard focus” is better than “Amazing futuristic input”.

- Every component detail explains what it is good for, how to install it, which states are provided, and which dependencies are required.

- Empty states should guide action (“No components match your filters. Clear filters.”), not simply show a blank surface.

- Use unobtrusive feedback for Save, Copy and Export. If Copy fails, make the code selectable and describe the fallback.

- Never ship a category full of placeholder cards or a button that opens an empty page. Hide incomplete features until ready.

- Treat the imported visual mockup as palette inspiration only; UIVEX logo/name, five navs, and frontend-only rules override it.
