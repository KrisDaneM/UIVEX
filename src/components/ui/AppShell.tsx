import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, Moon, Search, Sun, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useUivex } from '../../app/UivexContext'
import { SearchDialog } from './SearchDialog'
import { SeoManager } from '../seo/SeoManager'
import '../../styles/shell.css'

const nav=[['Explore','/explore'],['Playground','/playground'],['Workspace','/workspace'],['Guide','/guide']]
export function AppShell(){
  const {theme,setTheme}=useUivex();const [menu,setMenu]=useState(false);const [search,setSearch]=useState(false);const location=useLocation();const closeRef=useRef<HTMLButtonElement>(null)
  useEffect(()=>{const previous=history.scrollRestoration;history.scrollRestoration='manual';return()=>{history.scrollRestoration=previous}},[])
  useLayoutEffect(()=>{window.scrollTo({top:0,left:0,behavior:'auto'})},[location.pathname])
  useEffect(()=>{const fn=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearch(true)}if(e.key==='Escape'){setMenu(false);setSearch(false)}};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[])
  useEffect(()=>{document.body.style.overflow=menu?'hidden':'';if(menu)setTimeout(()=>closeRef.current?.focus(),30);return()=>{document.body.style.overflow=''}},[menu])
  return <div className="app-shell"><SeoManager/>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="container header-inner">
      <Link to="/" className="brand" aria-label="UIVEX home" onPointerEnter={()=>void import('../../pages/HomePage')} onFocus={()=>void import('../../pages/HomePage')}><span>UI</span>VEX<i/></Link>
      <nav className="desktop-nav" aria-label="Primary">{nav.map(([label,to])=><NavLink key={to} to={to} className={({isActive})=>isActive?'active':''}>{label}</NavLink>)}</nav>
      <div className="header-tools"><button className="search-trigger" onClick={()=>setSearch(true)}><Search size={17}/><span>Search components…</span><kbd>⌘ K</kbd></button><button className="icon-btn theme-button" onClick={()=>setTheme(theme==='dark'?'light':'dark')} aria-label={`Switch to ${theme==='dark'?'light':'dark'} theme`}>{theme==='dark'?<Sun size={19}/>:<Moon size={19}/>}</button><button className="icon-btn menu-button" onClick={()=>setMenu(true)} aria-label="Open navigation"><Menu size={20}/></button></div>
    </div></header>
    <AnimatePresence>{menu&&<><motion.div className="menu-scrim" onClick={()=>setMenu(false)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}/><motion.aside className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{duration:.2}}><div><span className="brand"><span>UI</span>VEX<i/></span><button ref={closeRef} className="icon-btn" onClick={()=>setMenu(false)} aria-label="Close navigation"><X/></button></div><nav>{nav.map(([label,to],i)=><NavLink key={to} to={to} onClick={()=>setMenu(false)}><small>0{i+1}</small>{label}</NavLink>)}</nav><p>Design. Customize. Create.<br/><span>Private by default, stored locally.</span></p></motion.aside></>}</AnimatePresence>
    <main id="main"><motion.div key={location.pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.18}}><Suspense fallback={<div className="route-loading" role="status" aria-label="Loading page"><span/></div>}><Outlet/></Suspense></motion.div></main>
    <Footer/><SearchDialog open={search} onClose={()=>setSearch(false)}/>
  </div>
}
function Footer(){return <footer className="site-footer"><div className="container footer-grid"><div><Link to="/" className="brand"><span>UI</span>VEX<i/></Link><p>Interactive UI Component Design Studio.<br/>No account. No tracking. Your workspace stays local.</p></div><nav aria-label="Footer"><Link to="/explore">Explore</Link><Link to="/playground">Playground</Link><Link to="/workspace">Workspace</Link><Link to="/guide">Guide</Link></nav><p className="footer-mark">© 2026 UIVEX<br/><span>Design better interfaces.</span></p></div></footer>}
