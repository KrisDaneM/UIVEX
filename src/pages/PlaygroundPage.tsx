import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Check, ChevronDown, ChevronRight, Clipboard, Download, Heart, Redo2, RotateCcw, Save, Search, Undo2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useUivex } from '../app/UivexContext'
import { CatalogPreview } from '../components/catalog/CatalogPreview'
import { componentRegistry, defaultComponent, getComponent } from '../data/componentRegistry'
import type { ComponentConfig, PreviewState } from '../types'
import { copyText, downloadText, generateCode } from '../utils/code'

type History = { past: ComponentConfig[]; present: ComponentConfig; future: ComponentConfig[] }
type Action = { type: 'set'; key: keyof ComponentConfig; value: unknown } | { type: 'reset'; value: ComponentConfig } | { type: 'undo' } | { type: 'redo' }
type Panel = 'components' | 'preview' | 'controls' | 'code'

function reducer(state: History, action: Action): History {
  if (action.type === 'undo' && !state.past.length || action.type === 'redo' && !state.future.length) return state
  if (action.type === 'undo') return { past: state.past.slice(0, -1), present: state.past.at(-1)!, future: [state.present, ...state.future] }
  if (action.type === 'redo') return { past: [...state.past, state.present], present: state.future[0], future: state.future.slice(1) }
  if (action.type === 'reset') return { past: [...state.past, state.present], present: action.value, future: [] }
  return { past: [...state.past.slice(-29), state.present], present: { ...state.present, [action.key]: action.value }, future: [] }
}

export default function PlaygroundPage() {
  const { slug } = useParams(); const item = getComponent(slug) || defaultComponent
  const [history, dispatch] = useReducer(reducer, { past: [], present: item.defaultConfig, future: [] })
  const [previewState, setPreviewState] = useState<PreviewState>('default'); const [viewportWidth, setViewportWidth] = useState(768)
  const [panel, setPanel] = useState<Panel>('preview'); const [compare, setCompare] = useState(false); const [copied, setCopied] = useState(false)
  const [fit, setFit] = useState(true); const [query, setQuery] = useState(''); const [category, setCategory] = useState('All')
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => new Set([item.category]))
  const canvasRef = useRef<HTMLDivElement>(null); const frameRef = useRef<HTMLDivElement>(null)
  const [measure, setMeasure] = useState({ available: 768, height: 260 })
  const { favorites, toggleFavorite, savePreset, addRecent, announce } = useUivex()

  // Route changes intentionally reset the editor session to the selected component defaults.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { dispatch({ type: 'reset', value: item.defaultConfig }); setPreviewState('default'); setOpenCategories((current) => new Set(current).add(item.category)); addRecent(item.slug) }, [item.slug, item.category, item.defaultConfig, addRecent])
  useLayoutEffect(() => {
    const update = () => { const next = { available: canvasRef.current?.clientWidth ?? 768, height: Math.max(260, frameRef.current?.scrollHeight ?? 260) }; setMeasure((current) => current.available === next.available && current.height === next.height ? current : next) }
    update(); if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update); if (canvasRef.current) observer.observe(canvasRef.current); if (frameRef.current) observer.observe(frameRef.current)
    return () => observer.disconnect()
  }, [item.slug, compare, previewState, history.present])

  const categories = useMemo(() => ['All', ...Array.from(new Set(componentRegistry.map((component) => component.category))).sort()], [])
  const filteredItems = useMemo(() => { const search = query.trim().toLowerCase(); return componentRegistry.filter((component) => (category === 'All' || component.category === category) && (!search || `${component.title} ${component.category} ${component.description}`.toLowerCase().includes(search))) }, [category, query])
  const groupedItems = useMemo(() => { const groups = new Map<string, typeof componentRegistry>(); filteredItems.forEach((component) => groups.set(component.category, [...(groups.get(component.category) || []), component])); return Array.from(groups.entries()) }, [filteredItems])
  const scale = fit ? Math.min(1, Math.max(.5, (measure.available - 24) / viewportWidth)) : 1
  const code = useMemo(() => generateCode(item, history.present, previewState), [item, history.present, previewState])
  const copy = async () => { try { await copyText(code); setCopied(true); announce('Current code copied'); window.setTimeout(() => setCopied(false), 1500) } catch { announce('Clipboard blocked. Select the code manually.') } }
  const toggleCategory = (name: string) => setOpenCategories((current) => { const next = new Set(current); if(next.has(name)) next.delete(name); else next.add(name); return next })

  return <div className="studio">
    <header className="studio-head container"><div><p className="eyebrow">Playground / trusted preview</p><h1>{item.title}</h1></div><div className="studio-head-actions"><button className="icon-btn" onClick={() => toggleFavorite(item.slug)} aria-label="Toggle favorite"><Heart fill={favorites.includes(item.slug) ? 'currentColor' : 'none'} /></button><button className="btn btn-primary" onClick={copy}>{copied ? <Check /> : <Clipboard />}{copied ? 'Copied' : 'Copy code'}</button></div></header>
    <nav className="studio-mobile-tabs container" aria-label="Playground panels">{(['components', 'preview', 'controls', 'code'] as const).map((name) => <button className={panel === name ? 'active' : ''} onClick={() => setPanel(name)} key={name}>{name === 'controls' ? 'Customize' : name}</button>)}</nav>
    <div className="studio-grid container">
      <aside className={`studio-library surface ${panel === 'components' ? 'mobile-show' : ''}`}>
        <header className="library-tools"><label className="library-search"><Search aria-hidden="true" /><span className="sr-only">Search components</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search components" /></label><label><span className="sr-only">Filter by category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((name) => <option key={name}>{name}</option>)}</select></label></header>
        <div className="library-list">{!groupedItems.length && <p className="library-empty">No matching components.</p>}{groupedItems.map(([name, components]) => { const open = openCategories.has(name) || category !== 'All' || Boolean(query); return <section className="library-group" key={name}><button className="library-group-toggle" onClick={() => toggleCategory(name)} aria-expanded={open}>{open ? <ChevronDown /> : <ChevronRight />}<span>{name}</span><small>{components.length}</small></button>{open && <div>{components.map((component) => <Link className={component.slug === item.slug ? 'active' : ''} to={`/playground/${component.slug}`} key={component.slug}><span>{component.title}</span>{favorites.includes(component.slug) && <Heart aria-label="Favorite" fill="currentColor" />}</Link>)}</div>}</section> })}</div>
      </aside>
      <main className={`studio-main ${panel === 'preview' ? 'mobile-show' : ''}`}>
        <div className="canvas-toolbar surface"><div className="viewport-presets" aria-label="Preview viewport width">{[320, 375, 390, 768, 1024, 1440].map((value) => <button className={viewportWidth === value ? 'active' : ''} onClick={() => setViewportWidth(value)} key={value}>{value}</button>)}</div><div className="canvas-size-controls"><button className={fit ? 'active' : ''} onClick={() => setFit((value) => !value)}>{fit ? 'Fit' : '1:1'}</button><label><span className="sr-only">Custom preview width</span><input type="number" min="280" max="1440" value={viewportWidth} onChange={(event) => setViewportWidth(Math.min(1440, Math.max(280, Number(event.target.value))))} /><span>px</span></label></div></div>
        <div className="studio-canvas surface"><div className="canvas-scroll" ref={canvasRef}><div className="canvas-stage" style={{ width: fit ? viewportWidth * scale : viewportWidth, height: measure.height * scale }}><div className="canvas-frame" ref={frameRef} style={{ width: viewportWidth, transform: `scale(${scale})` }}>{compare && <div className="comparison-label">Original</div>}{compare && <CatalogPreview slug={item.slug} config={item.defaultConfig} state="default" />}<div className="comparison-label">{compare ? 'Edited' : 'Live preview'}</div><CatalogPreview slug={item.slug} config={history.present} state={previewState} /></div></div></div><footer><span>{viewportWidth}px · {Math.round(scale * 100)}%</span><button onClick={() => setCompare((value) => !value)}>{compare ? 'Single view' : 'Before / after'}</button></footer></div>
        <div className="state-row surface" aria-label="Component interaction state">{item.states.map((state) => <button key={state} className={previewState === state ? 'active' : ''} onClick={() => setPreviewState(state)}>{state}</button>)}</div>
      </main>
      <aside className={`inspector surface ${panel === 'controls' ? 'mobile-show' : ''}`}><header><div><p className="eyebrow">Inspector</p><h2>{item.title}</h2><span>{item.category}</span></div><div className="history-actions"><button disabled={!history.past.length} onClick={() => dispatch({ type: 'undo' })} aria-label="Undo"><Undo2 /></button><button disabled={!history.future.length} onClick={() => dispatch({ type: 'redo' })} aria-label="Redo"><Redo2 /></button><button onClick={() => dispatch({ type: 'reset', value: item.defaultConfig })} aria-label="Reset"><RotateCcw /></button></div></header><div className="inspector-scroll"><Controls item={item} config={history.present} set={(key, value) => dispatch({ type: 'set', key, value })} /><button className="btn btn-primary save-preset" onClick={() => savePreset(item.slug, history.present)}><Save /> Save preset</button></div></aside>
      <section className={`studio-code surface ${panel === 'code' ? 'mobile-show' : ''}`}><header><div className="code-meta"><strong>React + Tailwind</strong><span>{item.dependencies.length ? `Requires ${item.dependencies.join(', ')}` : 'No extra dependency'}</span></div><div className="code-actions"><button onClick={copy} aria-label="Copy generated code">{copied ? <Check /> : <Clipboard />}<span>{copied ? 'Copied' : 'Copy'}</span></button><button onClick={() => downloadText(`${item.slug}.tsx`, code)} aria-label="Download generated code"><Download /><span>Download</span></button></div></header><pre className="code studio-code-content" tabIndex={0}><code>{code}</code></pre></section>
    </div>
  </div>
}

function Controls({ item, config, set }: { item: Exclude<ReturnType<typeof getComponent>, undefined>; config: ComponentConfig; set: (key: keyof ComponentConfig, value: unknown) => void }) {
  const has = (key: keyof ComponentConfig) => item.controls.includes(key)
  return <div className="controls">
    {(has('label') || has('variant')) && <fieldset><legend>Content</legend>{has('label') && <label><span>Label</span><input value={config.label} maxLength={48} onChange={(event) => set('label', event.target.value)} /></label>}{has('variant') && <label><span>Variant</span><select value={config.variant} onChange={(event) => set('variant', event.target.value)}>{item.variants.map((value) => <option key={value}>{value}</option>)}</select></label>}</fieldset>}
    {(['radius', 'padding', 'weight'] as const).some(has) && <fieldset><legend>Appearance</legend>{(['radius', 'padding', 'weight'] as const).filter(has).map((name) => <RangeControl key={name} name={name} config={config} set={set} />)}</fieldset>}
    {has('speed') && <fieldset><legend>Animation</legend><RangeControl name="speed" config={config} set={set} /></fieldset>}
    {has('accent') && <fieldset><legend>Colors</legend><label><span>Accent</span><div className="color-control"><input type="color" value={config.accent} onChange={(event) => set('accent', event.target.value)} /><input value={config.accent} aria-label="Accent hex value" onChange={(event) => /^#[0-9a-fA-F]{6}$/.test(event.target.value) && set('accent', event.target.value)} /></div></label></fieldset>}
    {(['shadow', 'icon'] as const).some(has) && <fieldset><legend>Advanced</legend>{(['shadow', 'icon'] as const).filter(has).map((name) => <label className="check-control" key={name}><span>{capitalize(name)}</span><input type="checkbox" checked={config[name]} onChange={(event) => set(name, event.target.checked)} /></label>)}</fieldset>}
  </div>
}

function RangeControl({ name, config, set }: { name: 'radius' | 'padding' | 'weight' | 'speed'; config: ComponentConfig; set: (key: keyof ComponentConfig, value: unknown) => void }) {
  const min = name === 'weight' ? 400 : name === 'speed' ? 100 : 0; const max = name === 'weight' ? 900 : name === 'speed' ? 1200 : name === 'padding' ? 30 : 28
  return <label><span>{capitalize(name)} <output>{config[name]}{name === 'speed' ? 'ms' : name === 'weight' ? '' : 'px'}</output></span><input type="range" min={min} max={max} step={name === 'weight' ? 100 : 1} value={config[name]} onChange={(event) => set(name, Number(event.target.value))} /></label>
}

function capitalize(value: string) { return value.charAt(0).toUpperCase() + value.slice(1) }
