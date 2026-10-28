import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { UivexProvider, useUivex } from '../app/UivexContext'
import { CatalogPreview } from '../components/catalog/CatalogPreview'
import type { ComponentConfig } from '../types'

const previewConfig:ComponentConfig={label:'Continue',accent:'#80E5E0',radius:10,padding:14,weight:700,speed:220,variant:'solid',shadow:true,icon:true}

function ThemeProbe(){
  const {theme,setTheme}=useUivex()
  return <button onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme}</button>
}

describe('application theme',()=>{
  afterEach(()=>{cleanup();localStorage.clear();document.documentElement.classList.remove('light');delete document.documentElement.dataset.theme})

  it('ignores a previously saved light preference and enforces dark mode',()=>{
    localStorage.setItem('uivex:v1:theme',JSON.stringify('light'))
    render(<UivexProvider><ThemeProbe/></UivexProvider>)
    expect(screen.getByRole('button')).toHaveTextContent('dark')
    expect(document.documentElement).not.toHaveClass('light')
    expect(JSON.parse(localStorage.getItem('uivex:v1:theme')!)).toBe('dark')
  })

  it('uses the inherited component accent in permanent dark mode',()=>{
    const {container}=render(<UivexProvider><CatalogPreview slug="magnetic-button" config={previewConfig}/></UivexProvider>)
    expect(document.documentElement).not.toHaveClass('light')
    expect(container.querySelector<HTMLElement>('.x-magnetic')?.style.getPropertyValue('--x-accent')).toBe('var(--component-accent)')
  })

  it('preserves intentional custom preview accents',()=>{
    const {container}=render(<UivexProvider><CatalogPreview slug="magnetic-button" config={{...previewConfig,accent:'#B42318'}}/></UivexProvider>)
    expect(container.querySelector<HTMLElement>('.x-magnetic')?.style.getPropertyValue('--x-accent')).toBe('#B42318')
  })
})
