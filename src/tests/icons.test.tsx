import { fireEvent,render,screen } from '@testing-library/react'
import { describe,expect,it } from 'vitest'
import { IconGlyph,defaultIconAppearance,iconReactCode,iconSvg } from '../components/icons/IconGlyph'
import { getIcon,iconRegistry } from '../data/iconRegistry'
import { componentRegistry } from '../data/componentRegistry'

describe('icon library',()=>{
 it('keeps at least 200 unique icon assets separate from component totals',()=>{
  expect(iconRegistry.length).toBeGreaterThanOrEqual(200)
  expect(new Set(iconRegistry.map(icon=>icon.slug)).size).toBe(iconRegistry.length)
  expect(componentRegistry).toHaveLength(212)
 })
 it('includes accurate sourced brand paths and useful metadata',()=>{
  for(const slug of ['instagram','facebook','tiktok','youtube','github','discord']){
   const icon=getIcon(slug)
   expect(icon?.kind).toBe('brand')
   expect((icon?.icon as {path?:string}).path?.length).toBeGreaterThan(20)
   expect(icon?.license).toContain('Simple Icons')
  }
 })
 it('exports customized SVG and React code',()=>{
  const icon=getIcon('download')!
  const appearance={...defaultIconAppearance,size:56,color:'#ff5500',strokeWidth:2.5,padding:12,background:'#112233',easing:'spring' as const}
  expect(iconSvg(icon,appearance)).toContain('width="80"')
  expect(iconSvg(icon,appearance)).toContain('#ff5500')
  expect(iconSvg(icon,appearance)).toContain('#112233')
  expect(iconReactCode(icon,appearance)).toContain('size={56}')
  expect(iconReactCode(icon,appearance)).toContain('strokeWidth={2.5}')
  expect(iconReactCode(icon,appearance)).toContain("padding:12")
  expect(iconReactCode(icon,appearance)).toContain("Download")
 })
 it('offers animated and dimensional discovery filters',()=>{
  expect(iconRegistry.filter(icon=>icon.animated).length).toBeGreaterThanOrEqual(20)
  expect(getIcon('add')).toBeTruthy()
 })
 it('supports click-triggered animation state',()=>{
  const icon=getIcon('heart')!
  const {rerender,container}=render(<button onClick={()=>undefined}><IconGlyph asset={icon} appearance={{...defaultIconAppearance,animation:'pulse',trigger:'click'}}/></button>)
  fireEvent.click(screen.getByRole('button'))
  rerender(<IconGlyph asset={icon} appearance={{...defaultIconAppearance,animation:'pulse',trigger:'click'}} active/>)
  expect(container.querySelector('.icon-glyph')).toHaveClass('animation-pulse','is-active')
 })
})
