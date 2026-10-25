import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CatalogPreview } from '../components/catalog/CatalogPreview'
import { componentRegistry, getComponent } from '../data/componentRegistry'
import { UivexProvider } from '../app/UivexContext'

const renderPreview = (item: NonNullable<ReturnType<typeof getComponent>>) => render(<UivexProvider><CatalogPreview slug={item.slug} config={item.defaultConfig} /></UivexProvider>)

describe('interactive catalog previews', () => {
  it('clears the search field', async () => {
    const item = getComponent('clear-search')!
    renderPreview(item)
    const input = screen.getByPlaceholderText('Search components')
    await userEvent.type(input, 'dialog')
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(input).toHaveValue('')
  })

  it('exposes toggle state semantically', async () => {
    const item = getComponent('signal-toggle')!
    renderPreview(item)
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('opens expanded radial actions without clipping semantics', async () => {
    const item = getComponent('radial-action-menu')!
    renderPreview(item)
    const trigger = screen.getByRole('button', { name: 'Toggle actions' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Favorite' })).toBeInTheDocument()
  })

  it('labels each preview with its component-specific fit strategy', () => {
    const item = getComponent('command-palette')!
    const { container } = renderPreview(item)
    expect(container.querySelector('[data-preview-fit="wide"]')).toBeInTheDocument()
  })

  it('supports the new drag-confirm interaction', async () => {
    const item = getComponent('drag-confirm-action')!
    renderPreview(item)
    const slider = screen.getByRole('slider', { name: 'Slide to archive' })
    fireEvent.change(slider, { target: { value: '100' } })
    expect(screen.getByText('Archived')).toBeInTheDocument()
  })

  it('opens the new contextual navigation menu', async () => {
    const item = getComponent('context-navigation')!
    renderPreview(item)
    const trigger = screen.getByRole('button', { name: /Project \/ Components/ })
    await userEvent.click(trigger)
    expect(screen.getByRole('button', { name: 'Inspect source' })).toBeInTheDocument()
  })

  it('validates password requirements as the user types', async () => {
    const item = getComponent('password-requirements')!
    renderPreview(item)
    await userEvent.type(screen.getByLabelText('Create password'), 'Secure123')
    expect(screen.getByText('8 or more characters').closest('li')).toHaveClass('ok')
    expect(screen.getByText('One uppercase letter').closest('li')).toHaveClass('ok')
    expect(screen.getByText('One number').closest('li')).toHaveClass('ok')
  })

  it('opens and dismisses the contextual action popover', async () => {
    const item = getComponent('action-popover')!
    renderPreview(item)
    const trigger = screen.getByRole('button', { name: /Project actions/ })
    await userEvent.click(trigger)
    expect(screen.getByRole('menuitem', { name: 'Export source' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Export source' }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('renders every registered preview without throwing', () => {
    componentRegistry.forEach((item) => {
      const { container } = renderPreview(item)
      expect(container.querySelector('[data-preview-fit]'), `Missing preview for ${item.slug}`).toBeInTheDocument()
      cleanup()
    })
  })
})
