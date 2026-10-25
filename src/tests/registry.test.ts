import { describe, expect, it } from 'vitest'
import { categories, componentRegistry, getComponent } from '../data/componentRegistry'
import { generateCode } from '../utils/code'

describe('component registry', () => {
  it('has unique stable slugs and complete metadata', () => {
    expect(componentRegistry.length).toBeGreaterThanOrEqual(147)
    expect(new Set(componentRegistry.map((item) => item.slug)).size).toBe(componentRegistry.length)
    expect(categories).toContain('Buttons')
    componentRegistry.forEach((item) => {
      expect(item.states.length).toBeGreaterThan(0)
      expect(item.controls.length).toBeGreaterThan(0)
      expect(item.accessibility.length).toBeGreaterThan(20)
    })
  })

  it('includes the verified first 500-component expansion batch', () => {
    expect(getComponent('drag-confirm-action')).toBeDefined()
    expect(getComponent('collapsible-dashboard')).toBeDefined()
    expect(componentRegistry.filter((item) => item.added === '2026-10-14').length).toBeGreaterThanOrEqual(84)
  })

  it('includes 25 distinct components in expansion batch two', () => {
    const batch = componentRegistry.filter((item) => item.added === '2026-10-23')
    expect(batch).toHaveLength(25)
    expect(getComponent('direction-aware-action')).toBeDefined()
    expect(getComponent('reorder-dashboard')).toBeDefined()
    expect(new Set(batch.map((item) => item.slug)).size).toBe(25)
  })

})

describe('code generation', () => {
  it('reflects configured label, accent, radius, weight, and state', () => {
    const item = getComponent('command-button')!
    const config = { ...item.defaultConfig, label: 'Deploy now', accent: '#123456', radius: 18, weight: 800 }
    const code = generateCode(item, config, 'disabled')
    expect(code).toContain('Deploy now')
    expect(code).toContain('#123456')
    expect(code).toContain('borderRadius: 18')
    expect(code).toContain('fontWeight: 800')
    expect(code).toContain('disabled')
  })

  it('exports configurable source for the expanded component set', () => {
    const item = getComponent('magnetic-button')!
    const config = { ...item.defaultConfig, label: 'Attract', accent: '#22d3ee', radius: 17 }
    const code = generateCode(item, config, 'default')
    expect(code).toContain('MagneticButton')
    expect(code).toContain('Attract')
    expect(code).toContain('#22d3ee')
    expect(code).toContain('borderRadius: 17')
  })

  it('generates source for every registered component', () => {
    componentRegistry.forEach((item) => {
      const code = generateCode(item, item.defaultConfig, item.states[0])
      expect(code.length, `Missing export for ${item.slug}`).toBeGreaterThan(120)
      expect(code, `Unnamed export for ${item.slug}`).toContain('export function')
    })
  })
})
