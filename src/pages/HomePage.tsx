import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Braces, Check, ChevronRight, Clipboard, Code2, ExternalLink, Heart, LayoutGrid, MonitorCog, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { componentRegistry } from '../data/componentRegistry'
import { CatalogPreview } from '../components/catalog/CatalogPreview'
import { useUivex } from '../app/UivexContext'
import { copyText } from '../utils/code'
import { LiquidChromeScene } from '../components/visuals/LiquidChromeScene'
import '../styles/home-redesign.css'
import '../styles/chrome-home.css'

gsap.registerPlugin(ScrollTrigger)
const featuredSlugs = ['command-button', 'clear-search', 'signal-toggle', 'rail-tabs', 'profile-brief']

export default function HomePage() {
  const page = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = gsap.context(() => {
      gsap.from('[data-hero-reveal]', { y: 22, opacity: 0, duration: .72, stagger: .09, ease: 'power3.out' })
      gsap.from('.hero-editor-wrap', { x: 38, y: 18, rotateY: -6, opacity: 0, duration: 1, delay: .22, ease: 'power3.out' })
      gsap.from('.hero-orbit path', { strokeDashoffset: 800, duration: 1.8, delay: .35, ease: 'power2.out' })
      gsap.utils.toArray<HTMLElement>('[data-scroll-reveal]').forEach((element) => gsap.from(element, { scrollTrigger: { trigger: element, start: 'top 88%', once: true }, y: 24, opacity: 0, duration: .65, ease: 'power2.out' }))
      gsap.from('.home-feature-card', { scrollTrigger: { trigger: '.home-feature-grid', start: 'top 86%', once: true }, y: 24, opacity: 0, stagger: .08, duration: .55, ease: 'power2.out' })
    }, page)
    const refresh = requestAnimationFrame(() => { ScrollTrigger.clearScrollMemory('manual'); ScrollTrigger.refresh(); window.scrollTo({ top: 0, left: 0, behavior: 'auto' }) })
    return () => { cancelAnimationFrame(refresh); context.revert() }
  }, [])
  const search = (value: FormDataEntryValue | string | null) => { const query = String(value ?? '').trim(); navigate(query ? `/explore?q=${encodeURIComponent(query)}` : '/explore') }
  return <div className="reference-home" ref={page}>
    <LiquidChromeScene className="home-chrome-wave"/>
    <div className="home-atmosphere" aria-hidden="true"><i/><i/><i/></div>
    <section className="reference-hero container">
      <div className="reference-hero-copy">
        <div className="hero-pill" data-hero-reveal>UI Component Design Studio</div>
        <h1 data-hero-reveal>Build modern<br/>interfaces,<br/><em>faster.</em></h1>
        <div className="reference-hero-actions" data-hero-reveal><Link className="ref-button primary" to="/explore">Explore components <ArrowRight/></Link><Link className="ref-button secondary" to="/playground"><SlidersHorizontal/> Try Playground</Link></div>
      </div>
      <div className="reference-hero-visual">
        <svg className="hero-orbit" viewBox="0 0 760 570" fill="none" aria-hidden="true"><path d="M32 328C126 114 359 11 693 122C794 156 742 409 553 497C360 586 128 507 32 328Z"/><path d="M64 198C259 70 536 64 720 244C588 341 371 388 101 342"/><path d="M93 442C248 271 467 194 702 207"/></svg>
        <div className="hero-particles" aria-hidden="true">{Array.from({length:18},(_,i)=><i key={i}/>)}</div>
        <HeroEditor />
      </div>
    </section>
    <section className="reference-search container" data-scroll-reveal>
      <form onSubmit={(event)=>{event.preventDefault();search(new FormData(event.currentTarget).get('q'))}}><label><Search/><span className="sr-only">Search components</span><input name="q" placeholder="Search components, e.g. button, card, navigation..."/><button aria-label="Submit component search"><ArrowRight/></button></label><div><span>Popular:</span>{['button','card','modal','navigation','input'].map(tag=><button type="button" key={tag} onClick={()=>search(tag)}>{tag}</button>)}</div></form>
    </section>
    <section className="reference-featured container" data-scroll-reveal>
      <header className="reference-section-head"><div><p className="ref-eyebrow"><i/> Featured <strong>components</strong></p><h2>Beautiful building blocks.</h2></div><Link to="/explore">View all components <ArrowRight/></Link></header>
      <div className="home-feature-grid">{featuredSlugs.map(slug=><FeaturedCard key={slug} slug={slug}/>)}</div>
    </section>
    <section className="reference-collections container" data-scroll-reveal>
      <div className="collection-copy"><p className="ref-eyebrow">Explore by category</p><h2>Find the right pattern,<br/>then make it yours.</h2><p>Jump into focused component families, compare real interactions, and open any pattern directly in the Playground.</p><Link className="ref-button primary" to="/explore">Browse all categories <ArrowRight/></Link></div>
      <div className="collection-showcase"><CollectionTile large to="/explore?category=Data" title="Data Interfaces" count={`${componentRegistry.filter(item=>item.category==='Data').length} components`} description="Charts, metrics, timelines, and interactive analysis patterns." type="dashboard"/><div className="collection-stack-ref"><CollectionTile to="/explore?category=Forms" title="Forms & Inputs" count={`${componentRegistry.filter(item=>item.category==='Forms').length} components`} description="Accessible input, validation, selection, and editing controls." type="auth"/><CollectionTile to="/explore?category=Layouts" title="Layouts" count={`${componentRegistry.filter(item=>item.category==='Layouts').length} components`} description="Responsive content systems and adaptable interface structures." type="marketing"/></div></div>
    </section>
    <section className="reference-workflow" data-scroll-reveal><div className="container"><header><div><p className="ref-eyebrow">A simple, clean flow</p><h2>From discovery to usable source.</h2></div><p>Everything you need in three simple steps.<br/>No account. No tracking. Just great components.</p></header><div className="workflow-steps"><WorkflowStep number="01" icon={<Search/>} title="Explore" text="Find components by name, category, use case, or visual style."/><WorkflowStep number="02" icon={<SlidersHorizontal/>} title="Customize" text="Test real states, tweak props, and make it match your design."/><WorkflowStep number="03" icon={<Braces/>} title="Copy" text="Get clean, ready-to-use code for your project."/></div></div></section>
  </div>
}

function HeroEditor(){
  const reduceMotion=useReducedMotion();const tiltX=useSpring(useMotionValue(0),{stiffness:150,damping:22,mass:.45});const tiltY=useSpring(useMotionValue(0),{stiffness:150,damping:22,mass:.45})
  const [variant,setVariant]=useState<'Primary'|'Outline'>('Primary');const [size,setSize]=useState<'Small'|'Medium'|'Large'>('Large');const [icon,setIcon]=useState(true);const [position,setPosition]=useState<'Left'|'Right'>('Left');const [radius,setRadius]=useState(12);const [panel,setPanel]=useState<'Customize'|'Code'>('Customize');const [codeTab,setCodeTab]=useState<'React'|'TypeScript'>('React');const [copied,setCopied]=useState(false)
  const code=useMemo(()=>`${codeTab==='TypeScript'?"type Props = { onClick?: () => void }\n\n":""}export function GetStarted${codeTab==='TypeScript'?'({ onClick }: Props)':'()'} {\n  return (\n    <button${codeTab==='TypeScript'?' onClick={onClick}':''} className="${variant==='Primary'?'bg-[#E8EFF4] text-[#101820]':'border border-[#BFCAD3] text-[#E8EFF4]'} ${size==='Large'?'px-6 py-3':size==='Medium'?'px-5 py-2.5':'px-4 py-2'}"\n      style={{ borderRadius: ${radius} }}>\n      ${icon&&position==='Left'?'→ ':''}Get started${icon&&position==='Right'?' →':''}\n    </button>\n  )\n}`,[variant,size,icon,position,radius,codeTab])
  const copy=async()=>{try{await copyText(code);setCopied(true);setTimeout(()=>setCopied(false),1400)}catch{/* visible source remains selectable */}}
  const point=(event:React.PointerEvent<HTMLDivElement>)=>{if(reduceMotion||event.pointerType==='touch')return;const box=event.currentTarget.getBoundingClientRect();tiltY.set(((event.clientX-box.left)/box.width-.5)*5);tiltX.set(-((event.clientY-box.top)/box.height-.5)*3.5)}
  const reset=()=>{tiltX.set(0);tiltY.set(0)}
  return <motion.div className="hero-editor-wrap" whileHover={reduceMotion?undefined:{y:-3}} transition={{duration:.25}} onPointerMove={point} onPointerLeave={reset}><motion.div className="hero-editor-tilt" style={{rotateX:tiltX,rotateY:tiltY}}><div className="editor-back-layer"/><div className="hero-editor">
    <aside className="editor-library"><div className="editor-logo-tabs"><button className="active">Preview</button><button>Code</button><button>Props</button></div>{[['Button',Sparkles],['Input',Code2],['Toggle',MonitorCog],['Tabs',LayoutGrid],['Card',LayoutGrid],['Navigation',LayoutGrid],['Toast',ExternalLink],['Dialog',LayoutGrid]].map(([label,Icon]:any,i)=><button className={i===0?'selected':''} key={label}><Icon/>{label}</button>)}<Link to="/explore"><b>+</b> More components</Link></aside>
    <section className="editor-stage"><header><span>Button / Primary</span><button>React <ChevronRight/></button></header><div className="editor-grid"><motion.button layout className={variant==='Primary'?'editor-live-button':'editor-live-button outline'} style={{borderRadius:radius,padding:size==='Large'?'14px 24px':size==='Medium'?'11px 20px':'8px 16px'}}>{icon&&position==='Left'&&<ArrowRight/>}<span>Get started</span>{icon&&position==='Right'&&<ArrowRight/>}</motion.button></div></section>
    <aside className="editor-controls"><nav><button className={panel==='Customize'?'active':''} onClick={()=>setPanel('Customize')}>Customize</button><button className={panel==='Code'?'active':''} onClick={()=>setPanel('Code')}>Code</button></nav>{panel==='Customize'?<div className="editor-fields"><label>Variant<select value={variant} onChange={e=>setVariant(e.target.value as 'Primary'|'Outline')}><option>Primary</option><option>Outline</option></select></label><label>Size<select value={size} onChange={e=>setSize(e.target.value as 'Small'|'Medium'|'Large')}><option>Small</option><option>Medium</option><option>Large</option></select></label><label className="switch-field"><span>Icon</span><input type="checkbox" checked={icon} onChange={e=>setIcon(e.target.checked)}/></label><label>Icon position<select value={position} onChange={e=>setPosition(e.target.value as 'Left'|'Right')}><option>Left</option><option>Right</option></select></label><label>Radius <output>{radius}</output><input type="range" min="2" max="24" value={radius} onChange={e=>setRadius(+e.target.value)}/></label></div>:<pre>{code}</pre>}</aside>
    <section className="editor-code"><header><div><button className={codeTab==='React'?'active':''} onClick={()=>setCodeTab('React')}>React</button><button className={codeTab==='TypeScript'?'active':''} onClick={()=>setCodeTab('TypeScript')}>TS</button></div><button onClick={copy}>{copied?<Check/>:<Clipboard/>}{copied?'Copied':'Copy'}</button></header><pre><code>{code}</code></pre></section>
  </div></motion.div></motion.div>
}

function FeaturedCard({slug}:{slug:string}){const item=componentRegistry.find(x=>x.slug===slug)!;const {favorites,toggleFavorite}=useUivex();const liked=favorites.includes(slug);return <motion.article className="home-feature-card" whileHover={{y:-4}} transition={{duration:.18}}><div className="home-card-preview"><CatalogPreview slug={slug} config={item.defaultConfig} compact/><button onClick={()=>toggleFavorite(slug)} aria-label={`${liked?'Remove':'Add'} ${item.title} ${liked?'from':'to'} favorites`} className={liked?'liked':''}><Heart fill={liked?'currentColor':'none'}/></button></div><div className="home-card-copy"><small>{item.category}</small><h3>{item.title}</h3><p>{item.description}</p></div><footer><Link to={`/components/${slug}`}>Preview</Link><Link to={`/playground/${slug}`}><Code2/> Code <ArrowRight/></Link></footer></motion.article>}
function CollectionTile({large=false,to,title,count,description,type}:{large?:boolean;to:string;title:string;count:string;description:string;type:string}){return <Link to={to} className={`collection-tile ${large?'large':''}`}><CollectionArtwork type={type}/><div><span>{count}</span><h3>{title}</h3><p>{description}</p></div><b><ArrowRight/></b></Link>}
function CollectionArtwork({type}:{type:string}){
  if(type==='dashboard')return <div className="collection-art dashboard" aria-hidden="true"><div className="dash-shell"><aside><i/><i/><i/><i/><i/></aside><main><header><span>OVERVIEW</span><b/><b/></header><div className="dash-kpis"><article><small>REVENUE</small><strong>$84.2k</strong><em>+12%</em></article><article><small>SESSIONS</small><strong>12,840</strong><em>+8%</em></article><article><small>CONVERSION</small><strong>4.8%</strong><em>+1.2</em></article></div><section className="dash-data"><div className="dash-chart"><span>Performance</span><svg viewBox="0 0 180 62"><path d="M4 53L34 40L63 46L94 20L124 31L151 11L176 17"/><path className="dash-fill" d="M4 53L34 40L63 46L94 20L124 31L151 11L176 17V62H4Z"/></svg></div><div className="dash-activity"><span>Activity</span>{['Design review','Export ready','Tokens synced'].map((x,i)=><p key={x}><i/>{x}<small>{i+2}m</small></p>)}</div></section></main></div></div>
  if(type==='auth')return <div className="collection-art auth" aria-hidden="true"><div className="auth-orbit"><section className="auth-panel auth-login"><header><i>U</i><span>Welcome back<small>Sign in to continue</small></span></header><label>Email address<b/></label><label>Password<b/><em>••••••••</em></label><button>Sign in <ArrowRight/></button></section><section className="auth-panel auth-otp"><span>VERIFY ACCESS</span><strong>Enter your code</strong><div>{[1,2,3,4].map(x=><i key={x}>{x<4?'•':''}</i>)}</div><small>Code sent securely</small></section><section className="auth-status"><Check/><span>Identity verified<small>Redirecting to workspace</small></span></section></div></div>
  return <div className="collection-art marketing" aria-hidden="true"><div className="marketing-page"><header><strong>VEX/01</strong><nav><i/><i/><i/></nav><button>Launch</button></header><section className="marketing-hero"><small>DESIGN SYSTEM / 2026</small><h4>Build the next<br/><em>clear idea.</em></h4><p/><p/><button>Explore kit <ArrowRight/></button><div className="marketing-visual"><i/><i/><b>↗</b></div></section><footer><article><b>48</b><span>Sections</span></article><article><b>12</b><span>Layouts</span></article><blockquote>“A sharper way to ship.”</blockquote></footer></div></div>
}
function WorkflowStep({number,icon,title,text}:{number:string;icon:React.ReactNode;title:string;text:string}){return <article><small>{number}</small><span>{icon}</span><div><h3>{title}</h3><p>{text}</p></div></article>}
