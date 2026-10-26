import type { CatalogItem, ComponentConfig, PreviewState } from '../types'
import { extendedCode } from '../components/catalog/ExtendedPreview'
import { studioCode } from '../components/catalog/StudioPreview'
import { batchOneCode } from '../components/catalog/BatchOnePreview'
import { batchTwoCode } from '../components/catalog/BatchTwoPreview'
import { batchThreeCode } from '../components/catalog/BatchThreePreview'

export function generateCode(item:CatalogItem, c:ComponentConfig, state:PreviewState='default'){
  const batchThree = batchThreeCode(item.slug,c)
  if(batchThree) return batchThree
  const batchTwo = batchTwoCode(item.slug,c)
  if(batchTwo) return batchTwo
  const batchOne = batchOneCode(item.slug,c)
  if(batchOne) return batchOne
  const studio = studioCode(item.slug,c)
  if(studio) return studio
  const maintainedExtended = extendedCode(item.slug,c)
  if(maintainedExtended) return maintainedExtended
  const disabled=state==='disabled'
  const loading=state==='loading'
  const label=JSON.stringify(loading?'Working…':c.label)
  const icon=c.icon?`import { ArrowRight } from 'lucide-react'\n\n`:''
  const shadow=c.shadow?` shadow-[0_10px_28px_${c.accent}35]`:''
  const visual=c.variant==='solid'?`bg-[${c.accent}] text-[#101820]`:`border border-[${c.accent}] text-[${c.accent}]`
  if(item.category==='Buttons') return `${icon}export function ${toName(item.slug)}() {\n  return (\n    <button\n      type="button"\n      ${disabled||loading?'disabled\n      ':''}className="inline-flex items-center gap-2 ${visual}${shadow} transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2"\n      style={{ borderRadius: ${c.radius}, padding: '${Math.max(9,c.padding-3)}px ${c.padding+6}px', fontWeight: ${c.weight} }}\n    >\n      ${c.icon?'<ArrowRight aria-hidden="true" size={17} />\n      ':''}<span>{${label}}</span>\n    </button>\n  )\n}`
  return `export function ${toName(item.slug)}() {\n  return (\n    <section\n      className="border border-slate-600 bg-[#202D38] text-[#F3F7F8]"\n      style={{ borderRadius: ${c.radius}, padding: ${c.padding}, '--accent': '${c.accent}' } as React.CSSProperties}\n      aria-label={${JSON.stringify(item.title)}}\n    >\n      <strong style={{ color: '${c.accent}', fontWeight: ${c.weight} }}>${escapeHtml(c.label)}</strong>\n      <p>${escapeHtml(item.description)}</p>\n    </section>\n  )\n}`
}
function toName(slug:string){return slug.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join('')}
function escapeHtml(s:string){return s.replace(/[<>&]/g,x=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[x]!))}
export async function copyText(text:string){if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(text)}
export function downloadText(name:string,text:string,type='text/plain'){const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}
