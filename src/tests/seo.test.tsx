import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { SeoManager } from '../components/seo/SeoManager'

afterEach(() => {
  cleanup()
  document.head.querySelectorAll('link[rel="canonical"], script[data-uivex-seo]').forEach((node) => node.remove())
})

describe('route SEO metadata', () => {
  it('publishes unique component metadata and structured breadcrumbs', async () => {
    render(<MemoryRouter initialEntries={['/components/magnetic-button']}><SeoManager /></MemoryRouter>)
    await waitFor(() => expect(document.title).toBe('Magnetic Button React Component | UIVEX'))
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain('Pointer-responsive action')
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toContain('/components/magnetic-button')
    expect(document.querySelector('script[data-uivex-seo]')?.textContent).toContain('BreadcrumbList')
  })

  it('keeps the private workspace out of search results', async () => {
    render(<MemoryRouter initialEntries={['/workspace']}><SeoManager /></MemoryRouter>)
    await waitFor(() => expect(document.title).toBe('Local Component Workspace | UIVEX'))
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow')
  })
})
