import { componentRegistry, getComponent } from '../data/componentRegistry'

export const SITE_NAME = 'UIVEX'
export const DEFAULT_TITLE = 'UIVEX | Home'
export const DEFAULT_DESCRIPTION = 'Discover interactive React UI components with creative animations, live previews, customizable designs, and reusable code. Explore and build with UIVEX.'

export type SeoPage = { title: string; description: string; path: string; robots?: string; type?: 'website' | 'article'; jsonLd: Record<string, unknown> | Array<Record<string, unknown>> }

const staticPages: Record<string, Omit<SeoPage, 'path' | 'jsonLd'>> = {
  '/': { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, type: 'website' },
  '/explore': { title: 'UIVEX | Explore', description: `Browse ${componentRegistry.length} interactive React and TypeScript components with live previews, accessibility notes, responsive states, and reusable source code.` },
  '/playground': { title: 'UIVEX | Playground', description: 'Customize React component styles and states in a live responsive playground, then copy or download source code that reflects your settings.' },
  '/guide': { title: 'UIVEX | Guide', description: 'Learn how to explore, customize, test, copy, and export UIVEX React components with responsive and accessibility-focused guidance.' },
  '/about': { title: 'UIVEX | About', description: 'Learn how UIVEX brings working React previews, local customization, accessibility notes, and faithful source export into one frontend studio.' },
  '/changelog': { title: 'UIVEX | Changelog', description: 'Read verified UIVEX release notes covering new interactive components, Playground improvements, accessibility work, and design system updates.' },
  '/workspace': { title: 'UIVEX | Workspace', description: 'Manage favorite components and saved UIVEX presets stored privately in this browser.', robots: 'noindex, nofollow' },
}

export function siteOrigin() {
  const configured = import.meta.env.VITE_SITE_URL?.trim()
  const candidate = configured || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173')
  try { return new URL(candidate).origin } catch { return 'http://localhost:5173' }
}

export function seoForPath(pathname: string): SeoPage {
  const path = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/'
  const componentMatch = path.match(/^\/components\/([^/]+)$/)
  if (componentMatch) {
    const item = getComponent(decodeURIComponent(componentMatch[1]))
    if (item) {
      const description = `${item.description} Live preview, customization, and reusable React TypeScript source.`
      return { title: `UIVEX | ${item.title}`, description, path, type: 'article', jsonLd: componentStructuredData(path, item.title, item.category, description) }
    }
  }
  const playgroundMatch = path.match(/^\/playground\/([^/]+)$/)
  if (playgroundMatch) {
    const item = getComponent(decodeURIComponent(playgroundMatch[1]))
    if (item) {
      const description = `Customize ${item.title}, test its supported states and responsive behavior, then copy or download its generated React source.`
      return { title: 'UIVEX | Playground', description, path, robots: 'noindex, follow', jsonLd: pageStructuredData(path, `Customize ${item.title}`, description) }
    }
  }
  const page = staticPages[path]
  if (page) return { ...page, path, jsonLd: path === '/' ? homeStructuredData() : path === '/explore' ? exploreStructuredData() : pageStructuredData(path, page.title, page.description) }
  const description = 'The requested UIVEX page could not be found. Browse the component library to find interactive React patterns and reusable source.'
  return { title: 'UIVEX | Page Not Found', description, path, robots: 'noindex, nofollow', jsonLd: pageStructuredData(path, 'Page Not Found', description) }
}

function pageStructuredData(path: string, name: string, description: string) {
  const origin = siteOrigin()
  return { '@context': 'https://schema.org', '@type': 'WebPage', name, description, url: `${origin}${path === '/' ? '' : path}` }
}

function homeStructuredData() {
  const origin = siteOrigin()
  return [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: origin, description: DEFAULT_DESCRIPTION, potentialAction: { '@type': 'SearchAction', target: `${origin}/explore?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: SITE_NAME, url: origin, description: DEFAULT_DESCRIPTION, applicationCategory: 'DeveloperApplication', operatingSystem: 'Any modern web browser', browserRequirements: 'Requires JavaScript', isAccessibleForFree: true },
  ]
}

function exploreStructuredData() {
  const origin = siteOrigin()
  return { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'UIVEX React Component Library', url: `${origin}/explore`, description: staticPages['/explore'].description, mainEntity: { '@type': 'ItemList', numberOfItems: componentRegistry.length, itemListElement: componentRegistry.slice(0, 24).map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.title, url: `${origin}/components/${item.slug}` })) } }
}

function componentStructuredData(path: string, title: string, category: string, description: string) {
  const origin = siteOrigin()
  return [
    { '@context': 'https://schema.org', '@type': 'WebPage', name: `${title} React Component`, description, url: `${origin}${path}`, isPartOf: { '@type': 'CollectionPage', name: 'UIVEX React Component Library', url: `${origin}/explore` }, about: { '@type': 'SoftwareSourceCode', name: title, programmingLanguage: ['TypeScript', 'React'], codeSampleType: category } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
      { '@type': 'ListItem', position: 2, name: 'Explore', item: `${origin}/explore` },
      { '@type': 'ListItem', position: 3, name: title, item: `${origin}${path}` },
    ] },
  ]
}
