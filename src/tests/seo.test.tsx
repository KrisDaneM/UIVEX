import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { SeoManager } from '../components/seo/SeoManager'
import { seoForPath } from '../config/seo'

afterEach(() => {
  cleanup()
  document.head.querySelectorAll('link[rel="canonical"], script[data-uivex-seo]').forEach((node) => node.remove())
})

describe('route SEO metadata', () => {
  it.each([
    ['/', 'UIVEX | Home'],
    ['/explore', 'UIVEX | Explore'],
    ['/playground', 'UIVEX | Playground'],
    ['/playground/command-button', 'UIVEX | Playground'],
    ['/workspace', 'UIVEX | Workspace'],
    ['/guide', 'UIVEX | Guide'],
    ['/about', 'UIVEX | About'],
    ['/changelog', 'UIVEX | Changelog'],
    ['/components/command-button', 'UIVEX | Command Button'],
    ['/missing-route', 'UIVEX | Page Not Found'],
  ])('uses a concise tab title for %s', (path, title) => {
    expect(seoForPath(path).title).toBe(title)
  })

  it('publishes unique component metadata and structured breadcrumbs', async () => {
    render(<MemoryRouter initialEntries={['/components/magnetic-button']}><SeoManager /></MemoryRouter>)
    await waitFor(() => expect(document.title).toBe('UIVEX | Magnetic Button'))
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain('Pointer-responsive action')
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toContain('/components/magnetic-button')
    expect(document.querySelector('script[data-uivex-seo]')?.textContent).toContain('BreadcrumbList')
  })

  it('keeps the private workspace out of search results', async () => {
    render(<MemoryRouter initialEntries={['/workspace']}><SeoManager /></MemoryRouter>)
    await waitFor(() => expect(document.title).toBe('UIVEX | Workspace'))
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow')
  })
})
