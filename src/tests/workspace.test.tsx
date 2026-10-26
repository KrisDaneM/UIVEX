import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { UivexProvider } from '../app/UivexContext'
import { getComponent } from '../data/componentRegistry'
import WorkspacePage from '../pages/WorkspacePage'

vi.mock('../components/visuals/LiquidChromeScene', () => ({ LiquidChromeScene: () => null }))

const keys = {
  favorites: 'uivex:v1:favorites',
  presets: 'uivex:v1:presets',
  recent: 'uivex:v1:recent',
}

function seedWorkspace() {
  const component = getComponent('command-button')!
  localStorage.setItem(keys.favorites, JSON.stringify([component.slug]))
  localStorage.setItem(keys.recent, JSON.stringify([component.slug]))
  localStorage.setItem(keys.presets, JSON.stringify([{ id: 'preset-1', name: 'Launch action', slug: component.slug, config: component.defaultConfig, createdAt: '2026-10-26T00:00:00.000Z' }]))
}

function renderWorkspace() {
  return render(<MemoryRouter><UivexProvider><WorkspacePage /></UivexProvider></MemoryRouter>)
}

beforeEach(() => {
  localStorage.clear()
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value() { this.setAttribute('open', '') } })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value() { this.removeAttribute('open') } })
})

afterEach(cleanup)

describe('Workspace page', () => {
  it('renders favorites, presets, and recent items from browser storage and supports item removal', async () => {
    seedWorkspace()
    renderWorkspace()

    expect(screen.getAllByText('Command Button').length).toBeGreaterThan(1)
    expect(screen.getByText('Launch action')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Remove Command Button from favorites' }))
    await waitFor(() => expect(JSON.parse(localStorage.getItem(keys.favorites) || '[]')).toEqual([]))

    await userEvent.click(screen.getByRole('button', { name: 'Delete Launch action' }))
    await waitFor(() => expect(JSON.parse(localStorage.getItem(keys.presets) || '[]')).toEqual([]))
  })

  it('rejects invalid imports without changing existing workspace data', async () => {
    seedWorkspace()
    const { container } = renderWorkspace()
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const invalidFile = new File(['{"schema":"wrong"}'], 'invalid.json', { type: 'application/json' })

    await userEvent.upload(input, invalidFile)

    expect(await screen.findByText(/not a valid UIVEX workspace export/i)).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(keys.favorites) || '[]')).toEqual(['command-button'])
    expect(screen.getByRole('button', { name: 'Remove Command Button from favorites' })).toBeInTheDocument()
  })

  it('imports a valid export, persists it across remounts, and starts a JSON download', async () => {
    const component = getComponent('command-button')!
    const payload = { schema: 'uivex-workspace', version: 1, favorites: [component.slug], recent: [component.slug], presets: [{ id: 'portable-1', name: 'Portable preset', slug: component.slug, config: component.defaultConfig, createdAt: '2026-10-26T00:00:00.000Z' }] }
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:workspace-export')
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    const { container, unmount } = renderWorkspace()
    const input = container.querySelector('input[type="file"]') as HTMLInputElement

    await userEvent.upload(input, new File([JSON.stringify(payload)], 'workspace.json', { type: 'application/json' }))
    expect(await screen.findByText('Workspace imported successfully.')).toBeInTheDocument()
    expect(screen.getByText('Portable preset')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /export all/i }))
    expect(createObjectURL).toHaveBeenCalledOnce()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:workspace-export')
    expect(anchorClick).toHaveBeenCalledOnce()

    unmount()
    renderWorkspace()
    expect(screen.getByText('Portable preset')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove Command Button from favorites' })).toBeInTheDocument()
  })

  it('preserves data when clearing is cancelled and removes it after confirmation', async () => {
    seedWorkspace()
    renderWorkspace()

    await userEvent.click(screen.getByRole('button', { name: /clear local workspace/i }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('open')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(dialog).not.toHaveAttribute('open')
    expect(JSON.parse(localStorage.getItem(keys.favorites) || '[]')).toEqual(['command-button'])

    await userEvent.click(screen.getByRole('button', { name: /clear local workspace/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Clear workspace' }))

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem(keys.favorites) || '[]')).toEqual([])
      expect(JSON.parse(localStorage.getItem(keys.presets) || '[]')).toEqual([])
      expect(JSON.parse(localStorage.getItem(keys.recent) || '[]')).toEqual([])
    })
    expect(screen.getByText('Local workspace cleared.')).toBeInTheDocument()
  })
})
