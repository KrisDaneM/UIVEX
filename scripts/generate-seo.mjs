import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const root = process.cwd()
const dist = join(root, 'dist')
const rawOrigin = process.env.SITE_URL || process.env.VITE_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:4173')
const origin = new URL(rawOrigin).origin
const socialImage = `${origin}/uivex-social.png`
const defaultDescription = 'Discover interactive React UI components with creative animations, live previews, customizable designs, and reusable code. Explore and build with UIVEX.'

const sourceFiles = ['src/data/componentRegistry.ts', 'src/data/studioExpansion.ts', 'src/data/batchOneExpansion.ts', 'src/data/batchTwoExpansion.ts']
const components = []
for (const file of sourceFiles) {
  const source = await readFile(join(root, file), 'utf8')
  const patterns = [
    /item\(\{\s*slug:'((?:\\'|[^'])+)',\s*title:'((?:\\'|[^'])+)',\s*category:'((?:\\'|[^'])+)',\s*description:'((?:\\'|[^'])+)'/g,
    /^\['((?:\\'|[^'])+)','((?:\\'|[^'])+)','((?:\\'|[^'])+)','((?:\\'|[^'])+)'/gm,
  ]
  for (const pattern of patterns) for (const match of source.matchAll(pattern)) components.push({ slug: clean(match[1]), title: clean(match[2]), category: clean(match[3]), description: clean(match[4]) })
}

const bySlug = new Map(components.map((component) => [component.slug, component]))
if (bySlug.size !== components.length) throw new Error(`Duplicate registry slugs detected (${components.length} entries, ${bySlug.size} unique).`)

const pages = [
  { path: '/', title: 'UIVEX — Interactive React UI Components & Design Playground', description: defaultDescription, heading: 'Build modern interfaces, faster.' },
  { path: '/explore', title: 'Explore Interactive React Components | UIVEX', description: `Browse ${components.length} interactive React and TypeScript components with live previews, accessibility notes, responsive states, and reusable source code.`, heading: 'Explore interactive React components.' },
  { path: '/playground', title: 'React Component Playground & Customizer | UIVEX', description: 'Customize React component styles and states in a live responsive playground, then copy or download source code that reflects your settings.', heading: 'Customize React components in the Playground.' },
  { path: '/guide', title: 'UIVEX Guide — React Component Setup & Usage', description: 'Learn how to explore, customize, test, copy, and export UIVEX React components with responsive and accessibility-focused guidance.', heading: 'UIVEX component guide.' },
  { path: '/about', title: 'About UIVEX — Interactive Component Design Studio', description: 'Learn how UIVEX brings working React previews, local customization, accessibility notes, and faithful source export into one frontend studio.', heading: 'About UIVEX.' },
  { path: '/changelog', title: 'UIVEX Changelog — Product Updates & Releases', description: 'Read verified UIVEX release notes covering new interactive components, Playground improvements, accessibility work, and design system updates.', heading: 'UIVEX changelog.' },
  { path: '/workspace', title: 'Local Component Workspace | UIVEX', description: 'Manage favorite components and saved UIVEX presets stored privately in this browser.', heading: 'Your local UIVEX workspace.', robots: 'noindex, nofollow' },
  ...components.map((item) => ({ path: `/components/${item.slug}`, title: `${item.title} React Component | UIVEX`, description: `${item.description} Live preview, customization, and reusable React TypeScript source.`, heading: `${item.title} React component.`, component: item })),
]

const template = await readFile(join(dist, 'index.html'), 'utf8')
for (const page of pages) {
  const html = renderHtml(template, page)
  const destination = page.path === '/' ? join(dist, 'index.html') : join(dist, page.path.slice(1), 'index.html')
  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, html)
}

const sitemapPages = pages.filter((page) => page.path !== '/workspace')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPages.map((page) => `  <url><loc>${xml(`${origin}${page.path === '/' ? '' : page.path}`)}</loc></url>`).join('\n')}\n</urlset>\n`
await writeFile(join(dist, 'sitemap.xml'), sitemap)
const robots = `User-agent: *\nAllow: /\nDisallow: /workspace\nDisallow: /playground/\n\nSitemap: ${origin}/sitemap.xml\n`
await writeFile(join(dist, 'robots.txt'), robots)

console.log(`SEO output: ${pages.length} static route documents, ${sitemapPages.length} sitemap URLs, origin ${origin}`)

function renderHtml(base, page) {
  const canonical = `${origin}${page.path === '/' ? '' : page.path}`
  const structured = page.component ? componentSchema(page, canonical) : page.path === '/' ? homeSchema() : page.path === '/explore' ? exploreSchema() : { '@context': 'https://schema.org', '@type': 'WebPage', name: page.title, description: page.description, url: canonical }
  let html = base
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(page.title)}</title>`)
  html = setMeta(html, 'name', 'description', page.description)
  html = setMeta(html, 'name', 'robots', page.robots || 'index, follow, max-image-preview:large')
  html = setMeta(html, 'property', 'og:title', page.title)
  html = setMeta(html, 'property', 'og:description', page.description)
  html = setMeta(html, 'property', 'og:type', page.component ? 'article' : 'website')
  html = setMeta(html, 'property', 'og:url', canonical)
  html = setMeta(html, 'property', 'og:image', socialImage)
  html = setMeta(html, 'property', 'og:site_name', 'UIVEX')
  html = setMeta(html, 'name', 'twitter:card', 'summary_large_image')
  html = setMeta(html, 'name', 'twitter:title', page.title)
  html = setMeta(html, 'name', 'twitter:description', page.description)
  html = setMeta(html, 'name', 'twitter:image', socialImage)
  html = html.replace('</head>', `    <link rel="canonical" href="${escapeHtml(canonical)}" />\n    <script type="application/ld+json" data-uivex-seo>${safeJson(structured)}</script>\n  </head>`)
  const fallback = `<main style="max-width:72rem;margin:8rem auto;padding:2rem;font-family:system-ui;color:#f3f7f8"><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.description)}</p><p><a href="/explore" style="color:#bfcad3">Explore the UIVEX component library</a></p></main>`
  return html.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`)
}

function setMeta(html, key, value, content) {
  const tag = `<meta ${key}="${escapeHtml(value)}" content="${escapeHtml(content)}" />`
  const pattern = new RegExp(`<meta\\s+${key}=["']${escapeRegExp(value)}["'][^>]*>`, 'i')
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

function homeSchema() {
  return [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'UIVEX', url: origin, description: defaultDescription, potentialAction: { '@type': 'SearchAction', target: `${origin}/explore?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'UIVEX', url: origin, description: defaultDescription, applicationCategory: 'DeveloperApplication', operatingSystem: 'Any modern web browser', browserRequirements: 'Requires JavaScript', isAccessibleForFree: true },
  ]
}
function exploreSchema() { return { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'UIVEX React Component Library', url: `${origin}/explore`, description: pages[1].description, mainEntity: { '@type': 'ItemList', numberOfItems: components.length, itemListElement: components.slice(0, 24).map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.title, url: `${origin}/components/${item.slug}` })) } } }
function componentSchema(page, canonical) { return [
  { '@context': 'https://schema.org', '@type': 'WebPage', name: `${page.component.title} React Component`, description: page.description, url: canonical, isPartOf: { '@type': 'CollectionPage', name: 'UIVEX React Component Library', url: `${origin}/explore` }, about: { '@type': 'SoftwareSourceCode', name: page.component.title, programmingLanguage: ['TypeScript', 'React'], codeSampleType: page.component.category } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: origin }, { '@type': 'ListItem', position: 2, name: 'Explore', item: `${origin}/explore` }, { '@type': 'ListItem', position: 3, name: page.component.title, item: canonical }] },
] }
function clean(value) { return value.replace(/\\'/g, "'") }
function escapeHtml(value) { return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;') }
function xml(value) { return escapeHtml(value).replaceAll("'", '&apos;') }
function safeJson(value) { return JSON.stringify(value).replaceAll('<', '\\u003c') }
function escapeRegExp(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
