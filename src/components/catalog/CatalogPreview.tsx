import { useState } from 'react'
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Eye, EyeOff, Search, X } from 'lucide-react'
import type { ComponentConfig, PreviewState } from '../../types'
import { ExtendedPreview, extendedSlugs, previewFitFor } from './ExtendedPreview'
import { StudioPreview, studioFit, studioSlugs } from './StudioPreview'
import { BatchOnePreview, batchOneSlugs } from './BatchOnePreview'
import { BatchTwoPreview, batchTwoFit, batchTwoSlugs } from './BatchTwoPreview'
import { useUivex } from '../../app/UivexContext'
import '../../styles/batch-one-catalog.css'
import '../../styles/batch-two-catalog.css'

interface Props { slug: string; config: ComponentConfig; state?: PreviewState; compact?: boolean }

export function CatalogPreview({ slug, config, state = 'default', compact = false }: Props) {
  const { theme } = useUivex()
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [visible, setVisible] = useState(false)
  const [enabled, setEnabled] = useState(true)
  const disabled = state === 'disabled'
  const accent = theme === 'light' && config.accent.toLowerCase() === '#80e5e0' ? '#008C95' : config.accent
  const accentInk = theme === 'light' ? '#FFFFFF' : '#101820'
  const themedConfig = accent === config.accent ? config : {...config, accent}
  const common = { '--demo-accent': accent, '--demo-accent-foreground': accentInk, '--demo-radius': `${config.radius}px`, '--demo-pad': `${Math.max(8, config.padding)}px`, '--demo-speed': `${config.speed}ms` } as React.CSSProperties
  const buttonStyle = { background: config.variant === 'outline' || config.variant === 'quiet' ? 'transparent' : accent, color: config.variant === 'solid' ? accentInk : accent, borderColor: accent, borderRadius: config.radius, padding: `${Math.max(9, config.padding - 3)}px ${config.padding + 6}px`, fontWeight: config.weight, boxShadow: config.shadow ? `0 10px 28px ${accent}35` : 'none' }
  const fit = batchTwoSlugs.has(slug) ? batchTwoFit(slug) : studioSlugs.has(slug) ? studioFit(slug) : previewFitFor(slug)
  const wrap = (child: React.ReactNode) => <div className={`demo demo-${state} demo-fit-${fit} ${compact ? 'demo-compact' : ''}`} data-preview-fit={fit} style={common}>{child}</div>

  if (studioSlugs.has(slug)) return wrap(<StudioPreview slug={slug} config={themedConfig} state={state}/>)
  if (batchOneSlugs.has(slug)) return wrap(<BatchOnePreview slug={slug} config={themedConfig} state={state}/>)
  if (batchTwoSlugs.has(slug)) return wrap(<BatchTwoPreview slug={slug} config={themedConfig} state={state}/>)
  if (extendedSlugs.has(slug)) return wrap(<ExtendedPreview slug={slug} config={themedConfig} state={state}/>)

  if (slug === 'command-button') return wrap(<button className="demo-button" style={buttonStyle} disabled={disabled || state === 'loading'}>{state === 'loading' ? <span className="mini-spinner" /> : config.icon && <ArrowRight size={17}/>}<span>{state === 'loading' ? 'Working…' : config.label}</span></button>)
  if (slug === 'split-action') return wrap(<div className="split-action"><button style={buttonStyle} disabled={disabled}>{config.label}</button><button aria-label="More actions" style={{...buttonStyle, paddingInline:12}} disabled={disabled}><ChevronDown size={17}/></button></div>)
  if (slug === 'underline-link') return wrap(<button className="trace-link" style={{color:accent, fontWeight:config.weight, ['--demo-speed' as string]:`${config.speed}ms`}}>{config.label}<ArrowRight size={16}/></button>)
  if (slug === 'clear-search') return wrap(<label className="demo-field" style={{borderRadius:config.radius, borderColor:state==='focus'?accent:undefined}}><Search size={17}/><span className="sr-only">{config.label}</span><input value={value} onChange={(e)=>setValue(e.target.value)} placeholder={config.label} disabled={disabled}/>{value && <button onClick={()=>setValue('')} aria-label="Clear search"><X size={16}/></button>}<kbd>⌘K</kbd></label>)
  if (slug === 'password-field') return wrap(<div className="field-stack"><label>{config.label}</label><div className="demo-field" style={{borderRadius:config.radius,borderColor:state==='error'?'#ef6a72':state==='success'?'#55d68b':undefined}}><input type={visible?'text':'password'} defaultValue="uivex-studio" disabled={disabled}/><button onClick={()=>setVisible(!visible)} aria-label={visible?'Hide password':'Show password'}>{visible?<EyeOff size={17}/>:<Eye size={17}/>}</button></div>{state==='error'&&<small className="error">Use at least 12 characters.</small>}{state==='success'&&<small className="success">Password strength is good.</small>}</div>)
  if (slug === 'signal-toggle') return wrap(<button className="toggle-row" role="switch" aria-checked={enabled} onClick={()=>setEnabled(!enabled)} disabled={disabled}><span><strong>{config.label}</strong><small>{enabled?'Enabled':'Disabled'}</small></span><i className={enabled?'on':''} style={{background:enabled?accent:undefined}}><b/></i></button>)
  if (slug === 'segmented-mode') return wrap(<div className="segments" style={{borderRadius:config.radius}}>{['Preview','Code','Notes'].map((x,i)=><button key={x} onClick={()=>setActive(i)} className={active===i?'active':''} style={active===i?{background:accent,color:accentInk}:{}}>{x}</button>)}</div>)
  if (slug === 'profile-brief') return wrap(<article className="profile-card" style={{borderRadius:config.radius,padding:config.padding,boxShadow:config.shadow?'0 14px 32px #0003':undefined}}><div className="avatar">AK</div><div><strong>Ari Kim</strong><p>Frontend systems designer</p></div><button style={{color:accent}}>{config.label}</button></article>)
  if (slug === 'metric-card') return wrap(<article className="metric" style={{borderRadius:config.radius,padding:config.padding}}><small>Interaction latency</small><strong style={{color:accent}}>{config.label}</strong><span>↓ 8 ms from last pass</span></article>)
  if (slug === 'expand-card') return wrap(<article className="expand" style={{borderRadius:config.radius}}><button onClick={()=>setOpen(!open)} aria-expanded={open}><span>{config.label}</span><ChevronDown size={18} className={open?'rotate':''}/></button>{open&&<p>Progressive disclosure keeps the first decision clear while detail remains one action away.</p>}</article>)
  if (slug === 'rail-tabs') return wrap(<div className="rail-tabs" role="tablist">{['Overview','States','Usage'].map((x,i)=><button role="tab" aria-selected={active===i} key={x} onClick={()=>setActive(i)} style={active===i?{borderColor:accent,color:accent}:{}}>{x}</button>)}</div>)
  if (slug === 'step-pagination') return wrap(<nav className="pagination" aria-label="Pagination"><button aria-label="Previous page" disabled={active===0} onClick={()=>setActive(Math.max(0,active-1))}><ChevronLeft size={17}/></button>{[1,2,3].map((n,i)=><button key={n} aria-current={active===i?'page':undefined} onClick={()=>setActive(i)} style={active===i?{background:accent,color:accentInk}:{}}>{n}</button>)}<button aria-label="Next page" disabled={active===2} onClick={()=>setActive(Math.min(2,active+1))}><ChevronRight size={17}/></button></nav>)
  if (slug === 'status-toast') return wrap(<div className="toast" role="status" style={{borderRadius:config.radius,borderLeftColor:accent}}><span className="status-dot" style={{background:accent}}/><div><strong>{state==='error'?'Could not save':config.label}</strong><small>{state==='error'?'Try again or export your settings.':'Stored only in this browser.'}</small></div><button aria-label="Dismiss"><X size={16}/></button></div>)
  if (slug === 'progress-track') return wrap(<div className="progress"><div><span>{config.label}</span><strong>{state==='success'?'100%':'68%'}</strong></div><i><b style={{width:state==='success'?'100%':'68%',background:accent,transitionDuration:`${config.speed}ms`}}/></i></div>)
  if (slug === 'orbit-loader') return wrap(<div className="loader-wrap"><span className={`orbit ${config.variant}`} style={{borderColor:`${accent}40`,borderTopColor:accent,animationDuration:`${Math.max(300,config.speed*2)}ms`}}/><span>{config.label}</span></div>)
  if (slug === 'empty-compass') return wrap(<div className="empty-state"><span className="empty-mark" style={{borderColor:accent}}>0</span><strong>No matching components</strong><p>Adjust your search or return to the full library.</p><button style={buttonStyle}>{config.label}</button></div>)
  if (slug === 'confirm-dialog') return wrap(<div className="dialog-demo" role="dialog" aria-modal="true" aria-label="Confirm removal" style={{borderRadius:config.radius,padding:config.padding,boxShadow:config.shadow?'0 20px 50px #0007':undefined}}><span className="dialog-mark"><X/></span><strong>Remove this preset?</strong><p>This deletes the local copy from this browser.</p><div><button>Cancel</button><button style={{background:config.variant==='danger'?'#d95c65':accent,color:config.variant==='danger'?'#101820':accentInk}}>{config.label}</button></div></div>)
  return wrap(<div className={`reveal-tile ${config.variant}`} style={{borderRadius:config.radius,['--demo-speed' as string]:`${config.speed}ms`}}><small>FIELD NOTE / 018</small><strong>{config.label}</strong><span style={{background:accent}}/></div>)
}
