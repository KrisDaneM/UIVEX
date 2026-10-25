import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { seoForPath, siteOrigin, SITE_NAME } from '../../config/seo'

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let node = document.head.querySelector<HTMLMetaElement>(selector)
  if (!node) { node = document.createElement('meta'); document.head.append(node) }
  Object.entries(attributes).forEach(([key, value]) => node!.setAttribute(key, value))
}

function upsertLink(rel: string, href: string) {
  let node = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!node) { node = document.createElement('link'); node.rel = rel; document.head.append(node) }
  node.href = href
}

export function SeoManager() {
  const { pathname } = useLocation()
  useEffect(() => {
    const seo = seoForPath(pathname)
    const origin = siteOrigin()
    const canonical = `${origin}${seo.path === '/' ? '' : seo.path}`
    const image = `${origin}/uivex-social.png`
    document.title = seo.title
    upsertMeta('meta[name="description"]', { name: 'description', content: seo.description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: seo.robots ?? 'index, follow, max-image-preview:large' })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: seo.type ?? 'website' })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' })
    upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })
    upsertLink('canonical', canonical)
    let script = document.head.querySelector<HTMLScriptElement>('script[data-uivex-seo]')
    if (!script) { script = document.createElement('script'); script.type = 'application/ld+json'; script.dataset.uivexSeo = ''; document.head.append(script) }
    script.textContent = JSON.stringify(seo.jsonLd)
  }, [pathname])
  return null
}
