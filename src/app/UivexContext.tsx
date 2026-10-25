import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { componentRegistry } from '../data/componentRegistry'
import type { ComponentConfig, SavedPreset } from '../types'

type Theme = 'dark' | 'light'
interface StoreData { favorites: string[]; presets: SavedPreset[]; recent: string[] }
interface UivexContextValue extends StoreData {
  theme: Theme; storageAvailable: boolean; notice: string
  setTheme: (theme: Theme) => void; toggleFavorite: (slug: string) => void
  addRecent: (slug: string) => void; savePreset: (slug: string, config: ComponentConfig, name?: string) => void
  deletePreset: (id: string) => void; clearAll: () => void; importWorkspace: (text: string) => {ok:boolean;message:string}
  exportWorkspace: () => string; announce: (message: string) => void
}
const validSlugs = new Set(componentRegistry.map((x)=>x.slug))
const Ctx = createContext<UivexContextValue | null>(null)
const keys = { theme:'uivex:v1:theme', favorites:'uivex:v1:favorites', presets:'uivex:v1:presets', recent:'uivex:v1:recent' }

function safeRead<T>(key:string, fallback:T):T { try { const value=localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback } catch { return fallback } }
function initialTheme():Theme { const saved=safeRead<Theme|null>(keys.theme,null);if(saved==='dark'||saved==='light')return saved;return window.matchMedia?.('(prefers-color-scheme: light)').matches?'light':'dark' }
function canStore(){ try { localStorage.setItem('uivex:test','1'); localStorage.removeItem('uivex:test'); return true } catch { return false } }

export function UivexProvider({children}:{children:React.ReactNode}){
  const [storageAvailable] = useState(canStore)
  const [theme,setThemeState] = useState<Theme>(initialTheme)
  const [favorites,setFavorites] = useState<string[]>(()=>safeRead<string[]>(keys.favorites,[]).filter(x=>validSlugs.has(x)))
  const [presets,setPresets] = useState<SavedPreset[]>(()=>safeRead<SavedPreset[]>(keys.presets,[]).filter(x=>validSlugs.has(x.slug)).slice(0,100))
  const [recent,setRecent] = useState<string[]>(()=>safeRead<string[]>(keys.recent,[]).filter(x=>validSlugs.has(x)).slice(0,12))
  const [notice,setNotice] = useState('')
  const announce=useCallback((message:string)=>{setNotice('');setTimeout(()=>setNotice(message),10)},[])
  useEffect(()=>{const root=document.documentElement;root.classList.toggle('light',theme==='light');root.dataset.theme=theme;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='light'?'#F3F7F8':'#101820');try{localStorage.setItem(keys.theme,JSON.stringify(theme))}catch{/* session fallback */}},[theme])
  useEffect(()=>{try{localStorage.setItem(keys.favorites,JSON.stringify(favorites));localStorage.setItem(keys.presets,JSON.stringify(presets));localStorage.setItem(keys.recent,JSON.stringify(recent))}catch{/* session fallback */}},[favorites,presets,recent])
  const setTheme=(value:Theme)=>setThemeState(value)
  const toggleFavorite=(slug:string)=>{if(!validSlugs.has(slug))return;setFavorites(x=>x.includes(slug)?x.filter(v=>v!==slug):[...x,slug]);announce(favorites.includes(slug)?'Removed from favorites':'Added to favorites')}
  const addRecent=useCallback((slug:string)=>{if(validSlugs.has(slug))setRecent(x=>[slug,...x.filter(v=>v!==slug)].slice(0,12))},[])
  const savePreset=(slug:string,config:ComponentConfig,name?:string)=>{if(!validSlugs.has(slug))return;const p={id:crypto.randomUUID?.()??`${Date.now()}`,name:name?.trim()||`Preset ${presets.length+1}`,slug,config,createdAt:new Date().toISOString()};setPresets(x=>[p,...x].slice(0,100));announce('Preset saved locally')}
  const deletePreset=(id:string)=>{setPresets(x=>x.filter(p=>p.id!==id));announce('Preset removed')}
  const clearAll=()=>{setFavorites([]);setPresets([]);setRecent([]);announce('Local workspace cleared')}
  const exportWorkspace=()=>JSON.stringify({schema:'uivex-workspace',version:1,exportedAt:new Date().toISOString(),favorites,presets,recent},null,2)
  const importWorkspace=(text:string)=>{try{const x=JSON.parse(text);if(x?.schema!=='uivex-workspace'||x?.version!==1||!Array.isArray(x.favorites)||!Array.isArray(x.presets)||!Array.isArray(x.recent))throw new Error();const f=x.favorites.filter((s:unknown)=>typeof s==='string'&&validSlugs.has(s));const r=x.recent.filter((s:unknown)=>typeof s==='string'&&validSlugs.has(s)).slice(0,12);const p=x.presets.filter((v:any)=>v&&typeof v.id==='string'&&typeof v.name==='string'&&validSlugs.has(v.slug)&&v.config&&typeof v.config.label==='string').slice(0,100);setFavorites(f);setRecent(r);setPresets(p);announce(`Imported ${f.length} favorites and ${p.length} presets`);return{ok:true,message:'Workspace imported successfully.'}}catch{return{ok:false,message:'That file is not a valid UIVEX workspace export. Your current data was not changed.'}}}
  const value={theme,setTheme,toggleFavorite,favorites,presets,recent,storageAvailable,notice,addRecent,savePreset,deletePreset,clearAll,importWorkspace,exportWorkspace,announce}
  return <Ctx.Provider value={value}>{children}<div className="sr-only" aria-live="polite">{notice}</div></Ctx.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export function useUivex(){const ctx=useContext(Ctx);if(!ctx)throw new Error('useUivex must be used inside UivexProvider');return ctx}
