import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Ban, Box, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleDot, Clipboard, Code2, Download, Focus, Heart, Info, LoaderCircle, Maximize2, Monitor, MousePointer2, MousePointerClick, Redo2, RotateCcw, Save, Search, SlidersHorizontal, Smartphone, Tablet, Undo2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useWorkspace } from '../app/UivexContext'
import { CatalogPreview } from '../components/catalog/CatalogPreview'
import { LiquidChromeScene } from '../components/visuals/LiquidChromeScene'
import { componentRegistry, defaultComponent, getComponent } from '../data/componentRegistry'
import type { ComponentConfig, PreviewState } from '../types'
import { copyText, downloadText, generateCode } from '../utils/code'
import '../styles/playground.css'

type History = { past: ComponentConfig[]; present: ComponentConfig; future: ComponentConfig[] }
type Action = { type: 'set'; key: keyof ComponentConfig; value: unknown } | { type: 'reset'; value: ComponentConfig } | { type: 'select'; value: ComponentConfig } | { type: 'undo' } | { type: 'redo' }
type Panel = 'components' | 'preview' | 'controls' | 'code'
type Device = 'desktop' | 'tablet' | 'mobile'

function reducer(state: History, action: Action): History {
  if (action.type === 'undo' && !state.past.length || action.type === 'redo' && !state.future.length) return state
  if (action.type === 'undo') return { past: state.past.slice(0, -1), present: state.past.at(-1)!, future: [state.present, ...state.future] }
  if (action.type === 'redo') return { past: [...state.past, state.present], present: state.future[0], future: state.future.slice(1) }
  if (action.type === 'select') return { past: [], present: action.value, future: [] }
  if (action.type === 'reset') return { past: [...state.past, state.present], present: action.value, future: [] }
  return { past: [...state.past.slice(-29), state.present], present: { ...state.present, [action.key]: action.value }, future: [] }
}

const stateIcons: Partial<Record<PreviewState, React.ReactNode>> = { default: <CircleDot />, hover: <MousePointer2 />, focus: <Focus />, pressed: <MousePointerClick />, disabled: <Ban />, loading: <LoaderCircle /> }

export default function PlaygroundPage() {
  const { slug } = useParams(); const navigate = useNavigate(); const item = getComponent(slug) || defaultComponent
  const [history, dispatch] = useReducer(reducer, { past: [], present: item.defaultConfig, future: [] })
  const [previewState, setPreviewState] = useState<PreviewState>('default'); const [device, setDevice] = useState<Device>('desktop'); const [viewportWidth, setViewportWidth] = useState(1024)
  const [panel, setPanel] = useState<Panel>('preview'); const [compare, setCompare] = useState(false); const [copied, setCopied] = useState(false)
  const [fit, setFit] = useState(true); const [zoom, setZoom] = useState(1); const [query, setQuery] = useState(''); const [category, setCategory] = useState('All')
  const [libraryCollapsed, setLibraryCollapsed] = useState(false); const [inspectorTab, setInspectorTab] = useState<'controls' | 'info'>('controls')
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => new Set([item.category]))
  const canvasRef = useRef<HTMLDivElement>(null); const frameRef = useRef<HTMLDivElement>(null); const canvasPanelRef = useRef<HTMLDivElement>(null); const libraryListRef = useRef<HTMLDivElement>(null)
  const [measure, setMeasure] = useState({ available: 768, height: 250 })
  const { favorites, toggleFavorite, savePreset, addRecent, announce } = useWorkspace()

  // Route changes intentionally reset the editor session to the selected component defaults.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { dispatch({ type: 'select', value: item.defaultConfig }); setPreviewState('default'); setOpenCategories((current) => new Set(current).add(item.category)); addRecent(item.slug) }, [item.slug, item.category, item.defaultConfig, addRecent])
  useLayoutEffect(() => {
    const update = () => { const next = { available: canvasRef.current?.clientWidth ?? 768, height: Math.max(250, frameRef.current?.scrollHeight ?? 250) }; setMeasure((current) => current.available === next.available && current.height === next.height ? current : next) }
    update(); if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update); if (canvasRef.current) observer.observe(canvasRef.current); if (frameRef.current) observer.observe(frameRef.current)
    return () => observer.disconnect()
  }, [item.slug, compare, previewState, history.present])

  const categories = useMemo(() => ['All', ...Array.from(new Set(componentRegistry.map((component) => component.category))).sort()], [])
  const filteredItems = useMemo(() => { const search = query.trim().toLowerCase(); return componentRegistry.filter((component) => (category === 'All' || component.category === category) && (!search || `${component.title} ${component.category} ${component.description}`.toLowerCase().includes(search))) }, [category, query])
  const groupedItems = useMemo(() => { const groups = new Map<string, typeof componentRegistry>(); filteredItems.forEach((component) => groups.set(component.category, [...(groups.get(component.category) || []), component])); return Array.from(groups.entries()) }, [filteredItems])
  const availableScale = Math.min(1, Math.max(.45, (measure.available - 28) / viewportWidth)); const scale = fit ? Math.min(zoom, availableScale) : zoom
  const code = useMemo(() => generateCode(item, history.present, previewState), [item, history.present, previewState])
  const copy = async () => { try { await copyText(code); setCopied(true); announce('Current code copied'); window.setTimeout(() => setCopied(false), 1500) } catch { announce('Clipboard blocked. Select the code manually.') } }
  const toggleCategory = (name: string) => setOpenCategories((current) => { const next = new Set(current); if(next.has(name)) next.delete(name); else next.add(name); return next })
  const selectComponent = (nextSlug: string) => {
    if (nextSlug === item.slug) return
    navigate(`/playground/${nextSlug}`)
  }
  const chooseDevice = (nextDevice: Device, width: number) => { setDevice(nextDevice); setViewportWidth(width); setFit(true) }
  const enterFullscreen = async () => { try { await canvasPanelRef.current?.requestFullscreen() } catch { announce('Fullscreen preview is unavailable in this browser.') } }
  const showControls = () => { setInspectorTab('controls'); setPanel('controls') }
  const showInfo = () => { setInspectorTab('info'); setPanel('controls') }
  const contentTabs = <MobileContentTabs panel={panel} inspectorTab={inspectorTab} setPanel={setPanel} showControls={showControls} showInfo={showInfo}/>

  return <div className="studio studio-v2">
    <LiquidChromeScene className="studio-chrome-wave"/>
    <header className="studio-head container"><div className="studio-heading-copy"><p className="studio-breadcrumb"><Link to="/playground">Playground</Link><ChevronRight/><span>{item.category}</span></p><div><Link className="studio-back" to={`/components/${item.slug}`} aria-label={`Preview ${item.title}`}>Preview</Link><span><h1>{item.title}</h1><p>{item.description}</p></span></div></div><div className="studio-head-actions"><button className="icon-btn" onClick={() => toggleFavorite(item.slug)} aria-label="Toggle favorite"><Heart fill={favorites.includes(item.slug) ? 'currentColor' : 'none'} /></button><button className="btn btn-primary" onClick={copy}>{copied ? <Check /> : <Clipboard />}{copied ? 'Copied' : 'Copy code'}</button></div></header>
    <nav className="studio-tablet-tabs container" aria-label="Playground panels">{(['components', 'preview', 'controls', 'code'] as const).map((name) => <button className={panel === name ? 'active' : ''} onClick={() => name === 'controls' ? showControls() : setPanel(name)} key={name}>{name === 'controls' ? 'Customize' : capitalize(name)}</button>)}</nav>
    <div className={`studio-grid container ${libraryCollapsed ? 'library-collapsed' : ''}`}>
      <aside className={`studio-library surface ${panel === 'components' ? 'mobile-show' : ''}`}>
        <div className="library-title"><strong><Box/> <span>Components</span></strong><button onClick={() => setLibraryCollapsed((value) => !value)} aria-label={libraryCollapsed ? 'Expand component browser' : 'Collapse component browser'}><ChevronLeft/></button></div>
        <div className="library-tools"><label className="library-search"><Search aria-hidden="true" /><span className="sr-only">Search components</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search components…" /></label><label><span className="sr-only">Filter by category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="All">All components</option>{categories.slice(1).map((name) => <option key={name}>{name}</option>)}</select></label></div>
        <div className="library-list" ref={libraryListRef}>{!groupedItems.length && <p className="library-empty">No matching components.</p>}{groupedItems.map(([name, components]) => { const open = openCategories.has(name) || category !== 'All' || Boolean(query); return <section className="library-group" key={name}><button className="library-group-toggle" onClick={() => toggleCategory(name)} aria-expanded={open}>{open ? <ChevronDown /> : <ChevronRight />}<span>{name}</span><small>{components.length}</small></button>{open && <div>{components.map((component) => <button type="button" className={`library-component${component.slug === item.slug ? ' active' : ''}`} onClick={() => selectComponent(component.slug)} aria-current={component.slug === item.slug ? 'page' : undefined} key={component.slug}><Box/><span>{component.title}</span>{favorites.includes(component.slug) && <Heart aria-label="Favorite" fill="currentColor" />}</button>)}</div>}</section> })}</div>
      </aside>

      <main className={`studio-main ${panel === 'preview' ? 'mobile-show' : ''}`}>
        <div className="canvas-toolbar surface"><div className="viewport-presets" aria-label="Preview device"><button className={device === 'desktop' ? 'active' : ''} onClick={() => chooseDevice('desktop', 1024)}><Monitor/> Desktop</button><button className={device === 'tablet' ? 'active' : ''} onClick={() => chooseDevice('tablet', 768)}><Tablet/> Tablet</button><button className={device === 'mobile' ? 'active' : ''} onClick={() => chooseDevice('mobile', 375)}><Smartphone/> Mobile</button></div><div className="canvas-size-controls"><label><span className="sr-only">Preview dimensions</span><select value={viewportWidth} onChange={(event) => setViewportWidth(Number(event.target.value))}><option value="375">375 × 667</option><option value="390">390 × 844</option><option value="768">768 × 402</option><option value="1024">1024 × 576</option><option value="1440">1440 × 810</option></select></label><label><span className="sr-only">Preview zoom</span><select value={zoom} onChange={(event) => setZoom(Number(event.target.value))}><option value="0.5">50%</option><option value="0.75">75%</option><option value="1">100%</option></select></label><button className="expand-preview" onClick={enterFullscreen} aria-label="Open fullscreen preview"><Maximize2/></button></div></div>
        <div className="studio-canvas surface" ref={canvasPanelRef}><div className="canvas-scroll" ref={canvasRef}><div className="canvas-stage" style={{ width: viewportWidth * scale, height: measure.height * scale }}><div className="canvas-frame" ref={frameRef} style={{ width: viewportWidth, transform: `scale(${scale})` }}>{compare && <><div className="comparison-label">Original</div><CatalogPreview key={`${item.slug}-original`} slug={item.slug} config={item.defaultConfig} state="default" /></>}<div className="comparison-label">{compare ? 'Edited' : 'Live preview'}</div><CatalogPreview key={`${item.slug}-edited`} slug={item.slug} config={history.present} state={previewState} /></div></div></div><footer><span>{viewportWidth}px · {Math.round(scale * 100)}%</span><div><button onClick={() => setFit((value) => !value)}>{fit ? 'Fit canvas' : 'Actual size'}</button><button onClick={() => setCompare((value) => !value)}>{compare ? 'Single view' : 'Before / after'}</button></div></footer></div>
        <div className="state-row surface" aria-label="Component interaction state">{item.states.map((state) => <button key={state} className={previewState === state ? 'active' : ''} onClick={() => setPreviewState(state)}>{stateIcons[state] ?? <CircleDot/>}<span>{capitalize(state)}</span></button>)}</div>
        {contentTabs}
      </main>

      <aside className={`inspector surface ${panel === 'controls' ? 'mobile-show' : ''}`}>
        {contentTabs}
        <div className="inspector-tabs" role="tablist"><button role="tab" aria-selected={inspectorTab === 'controls'} className={inspectorTab === 'controls' ? 'active' : ''} onClick={() => setInspectorTab('controls')}>Inspector</button><button role="tab" aria-selected={inspectorTab === 'info'} className={inspectorTab === 'info' ? 'active' : ''} onClick={() => setInspectorTab('info')}>Component Info</button></div>
        <header><div className="inspector-identity"><span><Code2/></span><div><h2>{item.title}</h2><p>Customize and see changes in real time.</p></div></div><div className="history-actions"><button disabled={!history.past.length} onClick={() => dispatch({ type: 'undo' })} aria-label="Undo"><Undo2 /></button><button disabled={!history.future.length} onClick={() => dispatch({ type: 'redo' })} aria-label="Redo"><Redo2 /></button><button onClick={() => dispatch({ type: 'reset', value: item.defaultConfig })} aria-label="Reset"><RotateCcw /></button></div></header>
        <div className="inspector-scroll">{inspectorTab === 'controls' ? <><Controls item={item} config={history.present} set={(key, value) => dispatch({ type: 'set', key, value })} /><button className="btn btn-primary save-preset" onClick={() => savePreset(item.slug, history.present)}><Save /> Save preset</button></> : <ComponentInfo item={item}/>}</div>
      </aside>

      <section className={`studio-code surface ${panel === 'code' ? 'mobile-show' : ''}`}>{contentTabs}<header><div className="code-meta"><strong>React + Tailwind</strong><span>{item.dependencies.length ? `Requires ${item.dependencies.join(', ')}` : 'No extra dependency'}</span></div><div className="code-actions"><button onClick={copy} aria-label="Copy generated code">{copied ? <Check /> : <Clipboard />}<span>{copied ? 'Copied' : 'Copy code'}</span></button><button onClick={() => downloadText(`${item.slug}.tsx`, code)} aria-label="Download generated code"><Download /><span>Download</span></button></div></header><div className="studio-code-content" tabIndex={0} aria-label={`${item.title} source code`}><ol>{code.split('\n').map((line, index) => <li key={`${index}-${line}`}><code>{line || ' '}</code></li>)}</ol></div><footer><span>{item.dependencies.length ? `Requires ${item.dependencies.join(', ')}` : 'React only'}</span><span>TypeScript (TSX)</span></footer></section>
    </div>
    <nav className="studio-mobile-bottom" aria-label="Mobile Playground navigation"><button className={panel==='components'?'active':''} onClick={()=>setPanel('components')}><Box/><span>Components</span></button><button className={panel==='preview'?'active':''} onClick={()=>setPanel('preview')}><Monitor/><span>Preview</span></button><button className={panel==='code'?'active':''} onClick={()=>setPanel('code')}><Code2/><span>Code</span></button><button className={panel==='controls'&&inspectorTab==='controls'?'active':''} onClick={showControls}><SlidersHorizontal/><span>Customize</span></button></nav>
  </div>
}

function MobileContentTabs({panel,inspectorTab,setPanel,showControls,showInfo}:{panel:Panel;inspectorTab:'controls'|'info';setPanel:(panel:Panel)=>void;showControls:()=>void;showInfo:()=>void}){return <nav className="studio-content-tabs" aria-label="Playground content"><button className={panel==='code'?'active':''} onClick={()=>setPanel('code')}>Code</button><button className={panel==='controls'&&inspectorTab==='controls'?'active':''} onClick={showControls}>Customize</button><button className={panel==='controls'&&inspectorTab==='info'?'active':''} onClick={showInfo}>Component Info</button></nav>}

function Controls({ item, config, set }: { item: Exclude<ReturnType<typeof getComponent>, undefined>; config: ComponentConfig; set: (key: keyof ComponentConfig, value: unknown) => void }) {
  const has = (key: keyof ComponentConfig) => item.controls.includes(key)
  return <div className="controls">
    {(has('label') || has('variant')) && <ControlSection title="Content" open>{has('label') && <label><span>Label</span><input value={config.label} maxLength={48} onChange={(event) => set('label', event.target.value)} /></label>}{has('variant') && <label><span>Variant</span><select value={config.variant} onChange={(event) => set('variant', event.target.value)}>{item.variants.map((value) => <option key={value}>{value}</option>)}</select></label>}</ControlSection>}
    {(['radius', 'padding', 'weight'] as const).some(has) && <ControlSection title="Appearance" open>{(['radius', 'padding', 'weight'] as const).filter(has).map((name) => <RangeControl key={name} name={name} config={config} set={set} />)}</ControlSection>}
    {has('accent') && <ControlSection title="Colors"><label><span>Accent</span><div className="color-control"><input type="color" value={config.accent} onChange={(event) => set('accent', event.target.value)} /><input value={config.accent} aria-label="Accent hex value" onChange={(event) => /^#[0-9a-fA-F]{6}$/.test(event.target.value) && set('accent', event.target.value)} /></div></label></ControlSection>}
    {has('shadow') && <ControlSection title="Effects"><label className="check-control"><span>Shadow</span><input type="checkbox" checked={config.shadow} onChange={(event) => set('shadow', event.target.checked)} /></label></ControlSection>}
    {has('speed') && <ControlSection title="Animation"><RangeControl name="speed" config={config} set={set} /></ControlSection>}
    {has('icon') && <ControlSection title="Advanced"><label className="check-control"><span>Show icon</span><input type="checkbox" checked={config.icon} onChange={(event) => set('icon', event.target.checked)} /></label></ControlSection>}
  </div>
}

function ControlSection({ title, open = false, children }: { title: string; open?: boolean; children: React.ReactNode }) { const [expanded, setExpanded] = useState(open); return <section className="control-section"><button onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}><strong>{title}</strong>{expanded ? <ChevronUp/> : <ChevronRight/>}</button>{expanded && <div>{children}</div>}</section> }
function ComponentInfo({ item }: { item: Exclude<ReturnType<typeof getComponent>, undefined> }) { return <div className="component-info"><Info/><h3>{item.title}</h3><p>{item.description}</p><dl><div><dt>Category</dt><dd>{item.category}</dd></div><div><dt>Complexity</dt><dd>{item.complexity}</dd></div><div><dt>Variants</dt><dd>{item.variants.join(', ')}</dd></div><div><dt>Keyboard</dt><dd>{item.keyboard}</dd></div><div><dt>Dependencies</dt><dd>{item.dependencies.join(', ') || 'React only'}</dd></div></dl></div> }
function RangeControl({ name, config, set }: { name: 'radius' | 'padding' | 'weight' | 'speed'; config: ComponentConfig; set: (key: keyof ComponentConfig, value: unknown) => void }) { const min = name === 'weight' ? 400 : name === 'speed' ? 100 : 0; const max = name === 'weight' ? 900 : name === 'speed' ? 1200 : name === 'padding' ? 30 : 28; return <label><span>{capitalize(name)} <output>{config[name]}{name === 'speed' ? 'ms' : name === 'weight' ? '' : 'px'}</output></span><input type="range" min={min} max={max} step={name === 'weight' ? 100 : 1} value={config[name]} onChange={(event) => set(name, Number(event.target.value))} /></label> }
function capitalize(value: string) { return value.charAt(0).toUpperCase() + value.slice(1) }
