import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Download, Heart, History, Layers3, PackageOpen, Save, Sparkles, Trash2, Upload, X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useWorkspace } from '../app/UivexContext'
import { LiquidChromeScene } from '../components/visuals/LiquidChromeScene'
import { componentRegistry } from '../data/componentRegistry'
import { downloadText } from '../utils/code'
import '../styles/workspace.css'

export default function WorkspacePage(){
  const store=useWorkspace();const input=useRef<HTMLInputElement>(null);const dialog=useRef<HTMLDialogElement>(null);const reduce=useReducedMotion()
  const [feedback,setFeedback]=useState<{text:string;error:boolean}|null>(null)
  const favorites=componentRegistry.filter(item=>store.favorites.includes(item.slug))
  const recent=store.recent.map(slug=>componentRegistry.find(item=>item.slug===slug)).filter((item):item is NonNullable<typeof item>=>Boolean(item))
  const importFile=async(event:React.ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0];if(!file)return;const result=store.importWorkspace(await file.text());setFeedback({text:result.message,error:!result.ok});event.target.value=''}
  const clearWorkspace=()=>{store.clearAll();dialog.current?.close();setFeedback({text:'Local workspace cleared.',error:false})}
  const reveal=reduce?{}:{initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.55,ease:[.22,1,.36,1] as const}}
  useEffect(()=>{const node=dialog.current;const close=(event:KeyboardEvent)=>{if(event.key==='Escape'&&node?.open)node.close()};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[])
  return <div className="workspace-page">
    <LiquidChromeScene className="workspace-chrome-wave"/>
    <section className="workspace-hero container">
      <motion.div className="workspace-hero-copy" {...reveal}><p className="workspace-kicker"><Sparkles/> Local workspace</p><h1>Your saved<br/><em>building blocks.</em></h1><p>Everything here stays in this browser. Export JSON when you want a portable copy.</p><div className="workspace-actions"><button className="btn" onClick={()=>input.current?.click()}><Upload/> Import JSON</button><input ref={input} className="sr-only" type="file" accept="application/json,.json" onChange={importFile}/><button className="btn btn-primary" onClick={()=>downloadText('uivex-workspace.json',store.exportWorkspace(),'application/json')}><Download/> Export all</button></div></motion.div>
      <motion.div className="workspace-art" aria-hidden="true" initial={reduce?false:{opacity:0,x:26,rotateY:-8}} animate={{opacity:1,x:0,rotateY:0}} transition={{duration:.8,ease:[.22,1,.36,1]}}><i className="workspace-orbit"/><div className="workspace-plate plate-back"><span>UI</span></div><div className="workspace-plate plate-middle"><Layers3/><span>Local system</span></div><div className="workspace-plate plate-front"><b><span>UI</span>VEX</b><small>YOUR COMPONENT WORKSPACE</small><div><i/><i/><i/></div></div></motion.div>
    </section>
    <main className="workspace-content container">
      {!store.storageAvailable&&<div className="workspace-alert warning" role="status">Browser storage is unavailable. Changes remain only for this open session.</div>}
      {feedback&&<div className={`workspace-alert ${feedback.error?'error':'success'}`} role="status"><span>{feedback.text}</span><button onClick={()=>setFeedback(null)} aria-label="Dismiss message"><X/></button></div>}
      <motion.section className="workspace-stats" {...reveal} transition={{duration:.55,delay:.08}} aria-label="Workspace summary"><Stat icon={<Heart/>} value={favorites.length} title="Favorites"/><Stat icon={<Layers3/>} value={store.presets.length} title="Saved presets"/><Stat icon={<History/>} value={recent.length} title="Recently opened"/></motion.section>
      <motion.div className="workspace-card-grid" initial={reduce?false:{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:.62,delay:.14,ease:[.22,1,.36,1]}}>
        <WorkspaceCard icon={<Heart/>} title="Favorites" count={favorites.length}>{favorites.length?<div className="workspace-item-list">{favorites.map(item=><article className="workspace-item" key={item.slug}><span className="workspace-item-icon"><Heart fill="currentColor"/></span><div><small>{item.category}</small><strong>{item.title}</strong></div><div className="workspace-item-actions"><Link to={`/playground/${item.slug}`} aria-label={`Open ${item.title} in Playground`}><ArrowRight/></Link><button onClick={()=>store.toggleFavorite(item.slug)} aria-label={`Remove ${item.title} from favorites`}><X/></button></div></article>)}</div>:<EmptyState type="heart" title="No favorites yet." text="Save components you like for quick access." action="Explore components" to="/explore"/>}</WorkspaceCard>
        <WorkspaceCard icon={<Layers3/>} title="Saved presets" count={store.presets.length}>{store.presets.length?<div className="workspace-item-list">{store.presets.map(preset=>{const item=componentRegistry.find(component=>component.slug===preset.slug);return <article className="workspace-item" key={preset.id}><span className="workspace-item-icon"><Save/></span><div><small>{item?.title??'Component'} · {new Date(preset.createdAt).toLocaleDateString()}</small><strong>{preset.name}</strong></div><div className="workspace-item-actions"><Link to={`/playground/${preset.slug}`} state={{preset}} aria-label={`Open ${preset.name} in Playground`}><ArrowRight/></Link><button onClick={()=>store.deletePreset(preset.id)} aria-label={`Delete ${preset.name}`}><Trash2/></button></div></article>})}</div>:<EmptyState type="layers" title="No saved presets yet." text="Save your customized component settings as presets." action="Open Playground" to="/playground"/>}</WorkspaceCard>
        <WorkspaceCard icon={<History/>} title="Recently opened" count={recent.length}>{recent.length?<div className="workspace-item-list">{recent.map(item=><Link className="workspace-item workspace-recent" key={item.slug} to={`/playground/${item.slug}`}><span className="workspace-item-icon"><PackageOpen/></span><div><small>{item.category}</small><strong>{item.title}</strong></div><ArrowRight/></Link>)}</div>:<EmptyState type="history" title="Nothing opened yet." text="Components you inspect will appear here for a quick return." action="Browse components" to="/explore"/>}</WorkspaceCard>
      </motion.div>
      <div className="clear-workspace"><button disabled={!favorites.length&&!store.presets.length&&!recent.length} onClick={()=>dialog.current?.showModal()}><Trash2/> Clear local workspace</button></div>
    </main>
    <dialog className="workspace-dialog" ref={dialog} aria-labelledby="clear-workspace-title"><form method="dialog"><button type="button" className="workspace-dialog-close" aria-label="Close dialog" onClick={()=>dialog.current?.close()}><X/></button><span><Trash2/></span><h2 id="clear-workspace-title">Clear local workspace?</h2><p>This permanently removes your favorites, saved presets, and recently opened history from this browser. Your components and application settings are not affected.</p><div><button type="button" className="btn" value="cancel" onClick={()=>dialog.current?.close()}>Cancel</button><button type="button" className="btn workspace-danger" value="confirm" onClick={clearWorkspace}>Clear workspace</button></div></form></dialog>
  </div>
}

function Stat({icon,value,title}:{icon:React.ReactNode;value:number;title:string}){return <article><span>{icon}</span><div><strong>{value}</strong><p>{title}<small>{value===1?'item':'items'}</small></p></div></article>}
function WorkspaceCard({icon,title,count,children}:{icon:React.ReactNode;title:string;count:number;children:React.ReactNode}){return <section className="workspace-dashboard-card"><header><span>{icon}</span><h2>{title}</h2><b>{count}</b></header><div className="workspace-card-content">{children}</div></section>}
function EmptyState({type,title,text,action,to}:{type:'heart'|'layers'|'history';title:string;text:string;action:string;to:string}){return <div className="workspace-card-empty"><div className={`workspace-empty-art ${type}`}>{type==='heart'?<Heart/>:type==='layers'?<Layers3/>:<History/>}<i/><i/></div><h3>{title}</h3><p>{text}</p><Link to={to}>{action}<ArrowRight/></Link></div>}
