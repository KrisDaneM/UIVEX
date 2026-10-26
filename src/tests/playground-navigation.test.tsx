import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { App } from '../app/App'
import { UivexProvider } from '../app/UivexContext'

vi.mock('../components/visuals/LiquidChromeScene', () => ({ LiquidChromeScene: () => null }))
vi.mock('../components/catalog/CatalogPreview', () => ({ CatalogPreview: ({ slug }: { slug: string }) => <div data-testid="catalog-preview">{slug}</div> }))

afterEach(cleanup)

function HistoryControls() {
  const navigate = useNavigate()
  return <><button onClick={() => navigate(-1)}>Test back</button><button onClick={() => navigate(1)}>Test forward</button></>
}

describe('Playground component navigation', () => {
  it('switches component routes without remounting the editor or resetting its library scroll', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const { container } = render(<MemoryRouter initialEntries={['/playground/command-button']}><UivexProvider><HistoryControls/><App /></UivexProvider></MemoryRouter>)

    expect(await screen.findByRole('heading', { level: 1, name: 'Command Button' })).toBeInTheDocument()
    const library = container.querySelector('.library-list') as HTMLDivElement
    library.scrollTop = 180

    await userEvent.click(within(library).getByRole('button', { name: /Trace Link/i }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Trace Link' })).toBeInTheDocument()
    expect(container.querySelector('.library-list')).toBe(library)
    expect(library.scrollTop).toBe(180)
    expect(screen.getByTestId('catalog-preview')).toHaveTextContent('underline-link')

    await userEvent.click(within(library).getByRole('button', { name: /Magnetic Button/i }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Magnetic Button' })).toBeInTheDocument()
    expect(container.querySelector('.library-list')).toBe(library)
    expect(library.scrollTop).toBe(180)
    await userEvent.click(within(library).getByRole('button', { name: /Morphing Button/i }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Morphing Button' })).toBeInTheDocument()
    await userEvent.click(within(library).getByRole('button', { name: /Command Button/i }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Command Button' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Test back' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Morphing Button' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Test forward' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Command Button' })).toBeInTheDocument()
    expect(container.querySelector('.library-list')).toBe(library)
    expect(library.scrollTop).toBe(180)
    await waitFor(() => expect(scrollTo).toHaveBeenCalledTimes(1))
  }, 15000)
})
