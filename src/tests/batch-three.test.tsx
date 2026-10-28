import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BatchThreePreview, batchThreeSlugs } from '../components/catalog/BatchThreePreview'
import { componentRegistry } from '../data/componentRegistry'

const config=componentRegistry.find(item=>item.slug==='visual-query-builder')!.defaultConfig

describe('batch three interactive previews',()=>{
  it('renders every registered batch preview without falling through',()=>{
    for(const slug of batchThreeSlugs){
      const view=render(<BatchThreePreview slug={slug} config={config} state="default"/>)
      expect(view.container.firstElementChild,slug).not.toBeNull()
      view.unmount()
    }
  })

  it('adds and removes real query-builder rules',()=>{
    render(<BatchThreePreview slug="visual-query-builder" config={config} state="default"/>)
    expect(screen.getAllByLabelText('Field')).toHaveLength(3)
    fireEvent.click(screen.getByRole('button',{name:/add rule/i}))
    expect(screen.getAllByLabelText('Field')).toHaveLength(4)
    fireEvent.click(screen.getAllByRole('button',{name:/remove rule/i})[0])
    expect(screen.getAllByLabelText('Field')).toHaveLength(3)
  })

  it('calculates contrast and reports an accessible result',()=>{
    render(<BatchThreePreview slug="contrast-inspector" config={config} state="default"/>)
    expect(screen.getByText(/AA|AAA/)).toBeInTheDocument()
  })
})
