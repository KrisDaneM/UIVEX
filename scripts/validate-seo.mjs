import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'

const dist = join(process.cwd(), 'dist')
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
if (urls.length !== 153 || new Set(urls).size !== urls.length) throw new Error(`Expected 153 unique sitemap URLs; found ${urls.length}.`)

for (const file of ['index.html', 'explore/index.html', 'guide/index.html', 'components/magnetic-button/index.html']) {
  const html = await readFile(join(dist, file), 'utf8')
  for (const marker of ['rel="canonical"', 'property="og:title"', 'name="twitter:card"', 'type="application/ld+json"', '<h1>']) {
    if (!html.includes(marker)) throw new Error(`${file} is missing ${marker}.`)
  }
  const match = html.match(/<script type="application\/ld\+json" data-uivex-seo>(.*?)<\/script>/s)
  if (!match) throw new Error(`${file} has no SEO JSON-LD block.`)
  JSON.parse(match[1])
}

const robots = await readFile(join(dist, 'robots.txt'), 'utf8')
if (!robots.includes('Sitemap: ') || !robots.includes('Disallow: /workspace')) throw new Error('robots.txt is incomplete.')
if ((await stat(join(dist, 'uivex-social.png'))).size < 10_000) throw new Error('The social preview image is missing or unexpectedly small.')
console.log(`SEO validation passed: ${urls.length} unique sitemap URLs; static metadata, robots, social image, and JSON-LD are valid.`)
