# UIVEX 500-component expansion

Last verified batch: 2026-10-23 · Batch 02

## Status

- Verified registry target after Batch 02: **147 components**
- Remaining to 500: **353 components**
- Duplicate slugs at audit: **0**
- Duplicate titles at audit: **0**
- New dependencies: **none**
- WebGL/Three.js components: **not introduced yet**; schedule them only after isolated lazy-canvas infrastructure is ready.

| Category | Baseline | Batch 01 | Batch 02 | Current | Minimum 30 remaining |
| --- | ---: | ---: | ---: | ---: | ---: |
| Buttons | 11 | 2 | 3 | 16 | 14 |
| Forms | 14 | 2 | 3 | 19 | 11 |
| Cards | 12 | 2 | 2 | 16 | 14 |
| Navigation | 10 | 2 | 2 | 14 | 16 |
| Feedback | 11 | 2 | 2 | 15 | 15 |
| Loaders | 8 | 2 | 3 | 13 | 17 |
| Overlays | 5 | 2 | 3 | 10 | 20 |
| Effects | 6 | 2 | 3 | 11 | 19 |
| Data | 10 | 2 | 2 | 14 | 16 |
| Media | 8 | 2 | 1 | 11 | 19 |
| Layouts | 5 | 2 | 1 | 8 | 22 |

## Batch 01 — 22 components

- Buttons: `drag-confirm-action` — Drag Confirm Action; `countdown-action` — Countdown Action
- Forms: `smart-autocomplete` — Smart Autocomplete; `character-limit-field` — Character Limit Field
- Cards: `reorder-task-card` — Reorder Task Card; `event-rsvp-card` — Event RSVP Card
- Navigation: `scrollspy-pills` — Scrollspy Pills; `context-navigation` — Context Navigation
- Feedback: `reconnect-banner` — Reconnect Banner; `error-recovery-panel` — Error Recovery Panel
- Loaders: `numeric-loader` — Numeric Loader; `grid-skeleton-loader` — Grid Skeleton Loader
- Overlays: `responsive-bottom-sheet` — Responsive Bottom Sheet; `floating-edit-toolbar` — Floating Edit Toolbar
- Effects: `cursor-trail-label` — Cursor Trail Label; `image-mask-reveal` — Image Mask Reveal
- Data: `comparison-bars` — Comparison Bars; `status-matrix` — Status Matrix
- Media: `video-chapter-player` — Video Chapter Player; `album-selector` — Album Selector
- Layouts: `adaptive-split-pane` — Adaptive Split Pane; `collapsible-dashboard` — Collapsible Dashboard

## Batch 02 — 25 components

- Buttons: `direction-aware-action` — Direction Aware Action; `copy-feedback-button` — Copy Feedback Button; `save-state-button` — Save State Button
- Forms: `date-range-selector` — Date Range Selector; `file-upload-queue` — File Upload Queue; `password-requirements` — Password Requirements
- Cards: `product-variant-card` — Product Variant Card; `testimonial-rotator` — Testimonial Rotator
- Navigation: `draggable-tab-bar` — Draggable Tab Bar; `floating-section-nav` — Floating Section Navigator
- Feedback: `status-monitor` — Interactive Status Monitor; `staged-confirmation` — Staged Confirmation
- Loaders: `file-transfer-loader` — File Transfer Loader; `processing-timeline` — Processing Timeline; `shape-sequence-loader` — Shape Sequence Loader
- Overlays: `action-popover` — Contextual Action Popover; `keyboard-dialog` — Keyboard Accessible Dialog; `notification-center` — Notification Center
- Effects: `split-text-reveal` — Split Text Reveal; `interactive-depth-layers` — Interactive Depth Layers; `elastic-expansion` — Elastic Content Expansion
- Data: `sortable-data-table` — Sortable Data Table; `column-visibility` — Column Visibility Controller
- Media: `image-annotation-tool` — Image Annotation Tool
- Layouts: `reorder-dashboard` — Reorder Dashboard Widgets

## Architecture

- Batch metadata: `src/data/batchOneExpansion.ts`
- Interactive previews and per-component source exports: `src/components/catalog/BatchOnePreview.tsx`
- Batch preview styling and reduced-motion rules: `src/styles/batch-one-catalog.css`
- Batch 02 metadata: `src/data/batchTwoExpansion.ts`
- Batch 02 interactive previews and component-specific exports: `src/components/catalog/BatchTwoPreview.tsx`
- Batch 02 responsive, theme-aware styles: `src/styles/batch-two-catalog.css`
- Existing registry, Explore filters, details, Playground, favorites, presets, Copy, and Download automatically consume the typed registry entries.

## Verification checklist

- TypeScript: passed (`tsc -b`)
- ESLint: passed with five non-blocking Fast Refresh warnings caused by colocated preview registry/code exports
- Registry audit: 147 total, zero duplicate slugs, zero duplicate titles
- Production build: passed
- Browser production render: all 22 detail routes rendered their live preview and component-specific exported source
- Responsive browser sampling: alternating 1440px/390px detail checks, plus 390px Explore category view; zero document overflow
- Explore integration: Layouts filter reported and rendered 7 components
- Interaction tests authored: drag confirmation and context navigation
- Vitest execution: blocked before test discovery by the existing Windows Tailwind native-module `spawn EPERM` / unreadable oxide binary failure
- Batch 02 browser production render: all 25 new detail routes rendered the correct title, fit strategy, live preview, and component-specific source export (1.3–1.6 KB each)
- Batch 02 responsive/theme sampling: new routes alternated across 390px, 768px, and 1440px in light and dark themes; zero document overflow
- Batch 02 Explore integration: 147 cards rendered at 390px with the total visible and zero document overflow
- Batch 02 interaction sampling: contextual popover opened with correct `aria-expanded` state and rendered its semantic menu
- Batch 02 tests authored: registry count/uniqueness, password requirement evaluation, contextual popover behavior, and all-preview render coverage

## Known limitations / next work

- Batch 03 should prioritize Layouts, Overlays, Effects, Media, and Loaders because they have the largest deficits to 30.
- Heavy 3D previews still require a lazy, single-canvas lifecycle wrapper with visibility pausing, DPR limiting, cleanup, and an accessible static fallback.
- Do not create an `Advanced` category until there is a plan to supply its full category target; sophisticated patterns should remain in the closest existing category meanwhile.
