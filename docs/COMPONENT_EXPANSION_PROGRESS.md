# UIVEX component expansion progress

Last audited: 2026-10-13

The registry began this expansion with 100 unique components and no duplicate slugs or titles. The target is at least 30 implemented components in every existing category. “All” is a filter, not a category.

| Category | Baseline | Target | Remaining |
| --- | ---: | ---: | ---: |
| Buttons | 11 | 30 | 19 |
| Forms | 14 | 30 | 16 |
| Cards | 12 | 30 | 18 |
| Navigation | 10 | 30 | 20 |
| Feedback | 11 | 30 | 19 |
| Loaders | 8 | 30 | 22 |
| Overlays | 5 | 30 | 25 |
| Effects | 6 | 30 | 24 |
| Data | 10 | 30 | 20 |
| Media | 8 | 30 | 22 |
| Layouts | 5 | 30 | 25 |
| **Total** | **100** | **330** | **230** |

## Completed work

- Audited registry metadata, slugs, titles, preview routing, and code generation.
- Confirmed zero duplicate slugs and zero duplicate titles at baseline.
- Removed Collections navigation, pages, detail routes, footer link, and collection data.
- Added a compatibility redirect from `/collections/*` to `/explore`.
- Replaced the homepage Collections promotion with direct category discovery links.

## Batch rules

- Re-run duplicate-slug and duplicate-title checks after every batch.
- A component counts only after it has registry metadata, a live interactive preview, accurate export source, responsive behavior, and accessibility/reduced-motion handling where applicable.
- Update this table using actual registry counts after each verified batch.
