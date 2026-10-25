/* eslint-disable react-refresh/only-export-components -- registry helpers intentionally share this renderer's slug contract */
import { useState } from 'react'
import { ArrowRight, Bell, Check, ChevronDown, ChevronRight, Command, Heart, Menu, Plus, Search, Send, Sparkles, X } from 'lucide-react'
import type { ComponentConfig, PreviewState } from '../../types'

export const extendedSlugs = new Set(['magnetic-button','morphing-button','expanding-search','animated-tab-rail','interactive-profile','waveform-loader','radial-action-menu','animated-notification','spotlight-cta','floating-label-input','multi-step-progress','command-palette','animated-accordion','swipeable-cards','animated-badge','skeleton-card','floating-action-menu','gradient-checkbox','kinetic-counter','smart-tooltip'])
const wide = new Set(['expanding-search','animated-tab-rail','interactive-profile','spotlight-cta','multi-step-progress','command-palette','swipeable-cards','skeleton-card'])
const tall = new Set(['radial-action-menu','animated-notification','animated-accordion','floating-action-menu','smart-tooltip'])
export const previewFitFor=(slug:string):'compact'|'wide'|'tall'|'overlay-safe'=>slug.includes('menu')||slug==='smart-tooltip'?'overlay-safe':tall.has(slug)?'tall':wide.has(slug)?'wide':'compact'

export function ExtendedPreview({slug,config,state}:{slug:string;config:ComponentConfig;state:PreviewState}){
  const [active,setActive]=useState(0);const [open,setOpen]=useState(false);const [liked,setLiked]=useState(false);const [checked,setChecked]=useState(false);const [query,setQuery]=useState('');const disabled=state==='disabled'
  const accent={['--x-accent' as string]:config.accent,['--x-speed' as string]:`${config.speed}ms`,borderRadius:config.radius} as React.CSSProperties
  if(slug==='magnetic-button')return <button className="x-magnetic" style={accent} disabled={disabled}><Sparkles/> {config.label}</button>
  if(slug==='morphing-button')return <button className={`x-morph ${state==='loading'?'loading':''}`} style={accent} onClick={()=>setOpen(!open)}><span>{open?<Check/>:<Send/>}</span>{open?'Sent':config.label}</button>
  if(slug==='expanding-search')return <label className={`x-search ${query?'expanded':''}`} style={accent}><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={config.label}/>{query&&<button onClick={()=>setQuery('')} aria-label="Clear"><X/></button>}</label>
  if(slug==='animated-tab-rail')return <div className="x-tabs" style={accent} role="tablist">{['Canvas','Layers','Export'].map((x,i)=><button key={x} role="tab" aria-selected={active===i} className={active===i?'active':''} onClick={()=>setActive(i)}>{x}</button>)}</div>
  if(slug==='interactive-profile')return <article className="x-profile" style={accent}><div className="x-avatar">MN<i/></div><div><strong>Mina North</strong><small>Product engineer</small></div><button onClick={()=>setLiked(!liked)} aria-label="Follow Mina">{liked?<Check/>:<Plus/>}{liked?'Following':'Follow'}</button></article>
  if(slug==='waveform-loader')return <div className="x-wave" role="status" aria-label={config.label}>{[1,2,3,4,5,6,7].map(i=><i key={i} style={{animationDelay:`${i*55}ms`,background:config.accent}}/>)}<span>{config.label}</span></div>
  if(slug==='radial-action-menu')return <div className={`x-radial ${open?'open':''}`} style={accent}>{[Heart,Bell,Send].map((Icon,i)=><button key={i} aria-label={['Favorite','Notify','Send'][i]}><Icon/></button>)}<button className="main" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label="Toggle actions"><Plus/></button></div>
  if(slug==='animated-notification')return <button className={`x-notification ${open?'open':''}`} style={accent} onClick={()=>setOpen(!open)}><Bell/><span><strong>{open?'All caught up':config.label}</strong><small>{open?'No unread updates':'3 new workspace updates'}</small></span><i>3</i></button>
  if(slug==='spotlight-cta')return <article className="x-spotlight" style={accent}><Sparkles/><div><small>NEW WORKFLOW</small><strong>{config.label}</strong></div><button>Open <ArrowRight/></button></article>
  if(slug==='floating-label-input')return <label className="x-float" style={accent}><input placeholder=" " defaultValue=""/><span>{config.label}</span><i/></label>
  if(slug==='multi-step-progress')return <div className="x-steps" style={accent}>{['Brief','Build','Ship'].map((x,i)=><button key={x} className={i<=active?'done':''} onClick={()=>setActive(i)}><i>{i<active?<Check/>:i+1}</i><span>{x}</span></button>)}</div>
  if(slug==='command-palette')return <div className="x-command" style={accent}><label><Command/><input placeholder="Type a command…"/></label>{['Open playground','Browse favorites','Export workspace'].map((x,i)=><button key={x} className={active===i?'active':''} onMouseEnter={()=>setActive(i)}><span>{x}</span><kbd>↵</kbd></button>)}</div>
  if(slug==='animated-accordion')return <div className="x-accordion" style={accent}>{['Can I customize it?','Does it work offline?'].map((x,i)=><section key={x}><button onClick={()=>setActive(active===i?-1:i)} aria-expanded={active===i}>{x}<ChevronDown/></button>{active===i&&<p>{i?'Yes. All data stays in this browser.':'Yes. Preview and exported code update together.'}</p>}</section>)}</div>
  if(slug==='swipeable-cards')return <div className="x-swipe" style={accent}>{['Research','Prototype','Polish'].map((x,i)=><button key={x} onClick={()=>setActive(i)} className={active===i?'active':''} style={{transform:`translateX(${(i-active)*62}px) rotate(${(i-active)*4}deg)`,zIndex:active===i?3:1}}><small>0{i+1}</small><strong>{x}</strong></button>)}</div>
  if(slug==='animated-badge')return <button className="x-badge" style={accent}><i/><span>{config.label}</span><b>12</b></button>
  if(slug==='skeleton-card')return <article className="x-skeleton" style={accent}><i/><div><b/><b/><b/></div></article>
  if(slug==='floating-action-menu')return <div className={`x-fab ${open?'open':''}`} style={accent}>{[Search,Bell,Heart].map((Icon,i)=><button key={i} aria-label={['Search','Alerts','Favorites'][i]}><Icon/></button>)}<button className="main" onClick={()=>setOpen(!open)} aria-expanded={open}><Menu/></button></div>
  if(slug==='gradient-checkbox')return <label className="x-check" style={accent}><input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)}/><i>{checked&&<Check/>}</i><span>{config.label}</span></label>
  if(slug==='kinetic-counter')return <button className="x-counter" style={accent} onClick={()=>setActive(active+1)}><small>{config.label}</small><strong key={active}>{String(active).padStart(2,'0')}</strong><span>Click to increment</span></button>
  return <span className="x-tooltip-wrap" style={accent}><button onClick={()=>setOpen(!open)} aria-describedby="tip">Hover or focus</button><span id="tip" role="tooltip" className={open?'show':''}>{config.label}<ChevronRight/></span></span>
}

export function extendedCode(slug:string,config:ComponentConfig){
  if(!extendedSlugs.has(slug))return null
  const name=slug.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join('')
  return `import { useState } from 'react'\n\nexport function ${name}() {\n  const [active, setActive] = useState(false)\n  return (\n    <button\n      type="button"\n      aria-pressed={active}\n      onClick={() => setActive(!active)}\n      className="inline-flex items-center gap-2 border transition-transform hover:-translate-y-0.5 focus-visible:outline-2"\n      style={{ color: '${config.accent}', borderColor: '${config.accent}', borderRadius: ${config.radius}, padding: ${config.padding}, fontWeight: ${config.weight} }}\n    >\n      <span>{active ? 'Active' : ${JSON.stringify(config.label)}}</span>\n    </button>\n  )\n}`
}
