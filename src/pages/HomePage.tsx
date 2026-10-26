import { useEffect, useRef } from 'react'
import { ArrowRight, Braces, Check, Code2, Heart, Play, Search, SlidersHorizontal } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'motion/react'
import { componentRegistry } from '../data/componentRegistry'
import { CatalogPreview } from '../components/catalog/CatalogPreview'
import { useWorkspace } from '../app/UivexContext'
import { LiquidChromeScene } from '../components/visuals/LiquidChromeScene'
import '../styles/home-redesign.css'
import '../styles/chrome-home.css'

gsap.registerPlugin(ScrollTrigger)
const featuredSlugs = ['command-button', 'clear-search', 'signal-toggle', 'rail-tabs', 'profile-brief']

export default function HomePage() {
  const page = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  useEffect(() => {
    const pageRoot = page.current
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const context = gsap.context(() => {
      if (!reduced) {
        const silver = gsap.utils.toArray<HTMLElement>('.hero-line.silver .cinematic-letter')
        const cyan = gsap.utils.toArray<HTMLElement>('.hero-line.cyan .cinematic-letter')
        const hero = page.current?.querySelector<HTMLElement>('.cinematic-hero')
        gsap.set([...silver, ...cyan], { transformOrigin: '50% 72%', transformPerspective: 900 })
        gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => hero?.classList.add('is-ready') })
          .fromTo(silver, { yPercent: 112, z: -170, rotateX: -68, rotateY: (index) => index % 2 ? 16 : -16, opacity: 0 }, { yPercent: 0, z: 0, rotateX: 0, rotateY: 0, opacity: 1, duration: 1.05, stagger: .025 }, .08)
          .fromTo('.hero-line.silver .hero-line-glint', { xPercent: -42, opacity: 0 }, { xPercent: 42, opacity: 1, duration: .7, stagger: .1, ease: 'power2.inOut' }, .92)
          .to('.hero-line.silver .hero-line-glint', { opacity: 0, duration: .28 }, 1.46)
          .fromTo(cyan, { yPercent: 130, z: -220, rotateX: -72, scale: .88, opacity: 0 }, { yPercent: 0, z: 0, rotateX: 0, scale: 1, opacity: 1, duration: .92, stagger: .055, ease: 'back.out(1.35)' }, 1.12)
          .fromTo('.hero-line.cyan .hero-line-glint', { xPercent: -45, opacity: 0 }, { xPercent: 42, opacity: 1, duration: .72, ease: 'power2.inOut' }, 1.62)
          .to('.hero-line.cyan .hero-line-glint', { opacity: 0, duration: .3 }, 2.16)
          .fromTo('.hero-period-ripple', { scale: .1, opacity: .8 }, { scale: 3.8, opacity: 0, duration: .7, ease: 'power2.out' }, 1.95)
          .fromTo('.cinematic-hero-actions a', { y: 18, opacity: 0, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: .5, stagger: .1 }, 1.92)
          .set([...silver, ...cyan], { clearProps: 'transform,opacity' }, 2.65)

        gsap.utils.toArray<HTMLElement>('[data-scroll-reveal]').forEach((element) => gsap.from(element, { scrollTrigger: { trigger: element, start: 'top 88%', once: true }, y: 24, opacity: 0, duration: .65, ease: 'power2.out' }))
        gsap.from('.home-feature-card', { scrollTrigger: { trigger: '.home-feature-grid', start: 'top 86%', once: true }, y: 24, opacity: 0, stagger: .08, duration: .55, ease: 'power2.out' })
      } else {
        page.current?.querySelector('.cinematic-hero')?.classList.add('is-ready')
      }
    }, page)
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(refresh)
      gsap.killTweensOf(pageRoot?.querySelectorAll('.cinematic-letter') ?? [])
      context.revert()
    }
  }, [])
  const search = (value: FormDataEntryValue | string | null) => { const query = String(value ?? '').trim(); navigate(query ? `/explore?q=${encodeURIComponent(query)}` : '/explore') }
  return <div className="reference-home" ref={page}>
    <LiquidChromeScene className="home-chrome-wave"/>
    <div className="home-atmosphere" aria-hidden="true"><i/><i/><i/></div>
    <section className="reference-hero cinematic-hero container" onPointerMove={animateLettersNearPointer} onPointerLeave={resetHeroLetters}>
      <div className="cinematic-hero-inner">
        <h1 className="cinematic-title" aria-label="Build modern interfaces, faster."><HeroLine text="Build modern" tone="silver"/><HeroLine text="interfaces," tone="silver"/><HeroLine text="faster." tone="cyan"/></h1>
        <div className="reference-hero-actions cinematic-hero-actions"><Link className="ref-button primary cinematic-primary" to="/explore">Explore components</Link><Link className="ref-button secondary" to="/playground"><Play/> Try Playground</Link></div>
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

function HeroLine({text,tone}:{text:string;tone:'silver'|'cyan'}) {
  return <span className={`hero-line ${tone}`} aria-hidden="true"><span className="hero-line-letters">{Array.from(text).map((character,index)=><span className={`cinematic-letter${character==='.'?' final-period':''}`} key={`${character}-${index}`}>{character===' '?'\u00a0':character}{character==='.'&&<i className="hero-period-ripple"/>}</span>)}</span><span className="hero-line-glint">{text}</span></span>
}

function animateLettersNearPointer(event:React.PointerEvent<HTMLElement>) {
  if(!event.currentTarget.classList.contains('is-ready')||event.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches)return
  event.currentTarget.querySelectorAll<HTMLElement>('.cinematic-letter').forEach((letter)=>{const box=letter.getBoundingClientRect();const dx=event.clientX-(box.left+box.width/2);const dy=event.clientY-(box.top+box.height/2);const distance=Math.hypot(dx,dy);const influence=Math.max(0,1-distance/175);gsap.to(letter,{x:dx*.045*influence,y:dy*.035*influence,z:28*influence,rotateX:-dy*.025*influence,rotateY:dx*.03*influence,duration:.38,ease:'power2.out',overwrite:'auto'})})
}

function resetHeroLetters(event:React.PointerEvent<HTMLElement>) {
  gsap.to(event.currentTarget.querySelectorAll('.cinematic-letter'),{x:0,y:0,z:0,rotateX:0,rotateY:0,duration:.65,ease:'elastic.out(1,.55)',overwrite:'auto'})
}

function FeaturedCard({slug}:{slug:string}){const item=componentRegistry.find(x=>x.slug===slug)!;const {favorites,toggleFavorite}=useWorkspace();const liked=favorites.includes(slug);return <motion.article className="home-feature-card" whileHover={{y:-4}} transition={{duration:.18}}><div className="home-card-preview"><CatalogPreview slug={slug} config={item.defaultConfig} compact/><button onClick={()=>toggleFavorite(slug)} aria-label={`${liked?'Remove':'Add'} ${item.title} ${liked?'from':'to'} favorites`} className={liked?'liked':''}><Heart fill={liked?'currentColor':'none'}/></button></div><div className="home-card-copy"><small>{item.category}</small><h3>{item.title}</h3><p>{item.description}</p></div><footer><Link to={`/components/${slug}`}>Preview</Link><Link to={`/playground/${slug}`}><Code2/> Code <ArrowRight/></Link></footer></motion.article>}
function CollectionTile({large=false,to,title,count,description,type}:{large?:boolean;to:string;title:string;count:string;description:string;type:string}){return <Link to={to} className={`collection-tile ${large?'large':''}`}><CollectionArtwork type={type}/><div><span>{count}</span><h3>{title}</h3><p>{description}</p></div><b><ArrowRight/></b></Link>}
function CollectionArtwork({type}:{type:string}){
  if(type==='dashboard')return <div className="collection-art dashboard" aria-hidden="true"><div className="dash-shell"><aside><i/><i/><i/><i/><i/></aside><main><header><span>OVERVIEW</span><b/><b/></header><div className="dash-kpis"><article><small>REVENUE</small><strong>$84.2k</strong><em>+12%</em></article><article><small>SESSIONS</small><strong>12,840</strong><em>+8%</em></article><article><small>CONVERSION</small><strong>4.8%</strong><em>+1.2</em></article></div><section className="dash-data"><div className="dash-chart"><span>Performance</span><svg viewBox="0 0 180 62"><path d="M4 53L34 40L63 46L94 20L124 31L151 11L176 17"/><path className="dash-fill" d="M4 53L34 40L63 46L94 20L124 31L151 11L176 17V62H4Z"/></svg></div><div className="dash-activity"><span>Activity</span>{['Design review','Export ready','Tokens synced'].map((x,i)=><p key={x}><i/>{x}<small>{i+2}m</small></p>)}</div></section></main></div></div>
  if(type==='auth')return <div className="collection-art auth" aria-hidden="true"><div className="auth-orbit"><section className="auth-panel auth-login"><header><i>U</i><span>Welcome back<small>Sign in to continue</small></span></header><label>Email address<b/></label><label>Password<b/><em>••••••••</em></label><button>Sign in <ArrowRight/></button></section><section className="auth-panel auth-otp"><span>VERIFY ACCESS</span><strong>Enter your code</strong><div>{[1,2,3,4].map(x=><i key={x}>{x<4?'•':''}</i>)}</div><small>Code sent securely</small></section><section className="auth-status"><Check/><span>Identity verified<small>Redirecting to workspace</small></span></section></div></div>
  return <div className="collection-art marketing" aria-hidden="true"><div className="marketing-page"><header><strong>VEX/01</strong><nav><i/><i/><i/></nav><button>Launch</button></header><section className="marketing-hero"><small>DESIGN SYSTEM / 2026</small><h4>Build the next<br/><em>clear idea.</em></h4><p/><p/><button>Explore kit <ArrowRight/></button><div className="marketing-visual"><i/><i/><b>↗</b></div></section><footer><article><b>48</b><span>Sections</span></article><article><b>12</b><span>Layouts</span></article><blockquote>“A sharper way to ship.”</blockquote></footer></div></div>
}
function WorkflowStep({number,icon,title,text}:{number:string;icon:React.ReactNode;title:string;text:string}){return <article><small>{number}</small><span>{icon}</span><div><h3>{title}</h3><p>{text}</p></div></article>}
