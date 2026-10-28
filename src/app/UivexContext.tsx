import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { componentRegistry } from '../data/componentRegistry'
import type { ComponentConfig, SavedPreset } from '../types'

type Theme = 'dark' | 'light'
interface StoreData { favorites: string[]; presets: SavedPreset[]; recent: string[] }
interface WorkspaceContextValue extends StoreData {
  storageAvailable: boolean; notice: string
  toggleFavorite: (slug: string) => void
  addRecent: (slug: string) => void; savePreset: (slug: string, config: ComponentConfig, name?: string) => void
  deletePreset: (id: string) => void; clearAll: () => void; importWorkspace: (text: string) => {ok:boolean;message:string}
  exportWorkspace: () => string; announce: (message: string) => void
}
const validSlugs = new Set(componentRegistry.map((x)=>x.slug))
const ThemeCtx = createContext<{theme:Theme;setTheme:(theme:Theme)=>void}|null>(null)
const WorkspaceCtx = createContext<WorkspaceContextValue | null>(null)
const keys = { theme:'uivex:v1:theme', favorites:'uivex:v1:favorites', presets:'uivex:v1:presets', recent:'uivex:v1:recent' }

function safeRead<T>(key:string, fallback:T):T { try { const value=localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback } catch { return fallback } }
function canStore(){ try { localStorage.setItem('uivex:test','1'); localStorage.removeItem('uivex:test'); return true } catch { return false } }
function applyDarkTheme(){const root=document.documentElement;root.classList.remove('light');root.dataset.theme='dark';document.querySelector('meta[name="theme-color"]')?.setAttribute('content','#101820')}

export function UivexProvider({children}:{children:React.ReactNode}){
  const [storageAvailable] = useState(canStore)
  const theme:Theme = 'dark'
  const [favorites,setFavorites] = useState<string[]>(()=>safeRead<string[]>(keys.favorites,[]).filter(x=>validSlugs.has(x)))
  const [presets,setPresets] = useState<SavedPreset[]>(()=>safeRead<SavedPreset[]>(keys.presets,[]).filter(x=>validSlugs.has(x.slug)).slice(0,100))
  const [recent,setRecent] = useState<string[]>(()=>safeRead<string[]>(keys.recent,[]).filter(x=>validSlugs.has(x)).slice(0,12))
  const [notice,setNotice] = useState('')
  const announce=useCallback((message:string)=>{setNotice('');setTimeout(()=>setNotice(message),10)},[])
  useLayoutEffect(()=>applyDarkTheme(),[])
  useEffect(()=>{try{localStorage.setItem(keys.theme,JSON.stringify('dark'))}catch{/* session fallback */}},[])
  useEffect(()=>{try{localStorage.setItem(keys.favorites,JSON.stringify(favorites));localStorage.setItem(keys.presets,JSON.stringify(presets));localStorage.setItem(keys.recent,JSON.stringify(recent))}catch{/* session fallback */}},[favorites,presets,recent])
  const setTheme=useCallback((_value:Theme)=>applyDarkTheme(),[])
  const toggleFavorite=useCallback((slug:string)=>{if(!validSlugs.has(slug))return;setFavorites(current=>{const removing=current.includes(slug);announce(removing?'Removed from favorites':'Added to favorites');return removing?current.filter(value=>value!==slug):[...current,slug]})},[announce])
  const addRecent=useCallback((slug:string)=>{if(validSlugs.has(slug))setRecent(x=>[slug,...x.filter(v=>v!==slug)].slice(0,12))},[])
  const savePreset=useCallback((slug:string,config:ComponentConfig,name?:string)=>{if(!validSlugs.has(slug))return;setPresets(current=>{const preset={id:crypto.randomUUID?.()??`${Date.now()}`,name:name?.trim()||`Preset ${current.length+1}`,slug,config,createdAt:new Date().toISOString()};return[preset,...current].slice(0,100)});announce('Preset saved locally')},[announce])
  const deletePreset=useCallback((id:string)=>{setPresets(x=>x.filter(p=>p.id!==id));announce('Preset removed')},[announce])
  const clearAll=useCallback(()=>{setFavorites([]);setPresets([]);setRecent([]);announce('Local workspace cleared')},[announce])
  const exportWorkspace=useCallback(()=>JSON.stringify({schema:'uivex-workspace',version:1,exportedAt:new Date().toISOString(),favorites,presets,recent},null,2),[favorites,presets,recent])
  const importWorkspace=useCallback((text:string)=>{try{const x=JSON.parse(text);if(x?.schema!=='uivex-workspace'||x?.version!==1||!Array.isArray(x.favorites)||!Array.isArray(x.presets)||!Array.isArray(x.recent))throw new Error();const f=x.favorites.filter((s:unknown)=>typeof s==='string'&&validSlugs.has(s));const r=x.recent.filter((s:unknown)=>typeof s==='string'&&validSlugs.has(s)).slice(0,12);const p=x.presets.filter((v:any)=>v&&typeof v.id==='string'&&typeof v.name==='string'&&validSlugs.has(v.slug)&&v.config&&typeof v.config.label==='string').slice(0,100);setFavorites(f);setRecent(r);setPresets(p);announce(`Imported ${f.length} favorites and ${p.length} presets`);return{ok:true,message:'Workspace imported successfully.'}}catch{return{ok:false,message:'That file is not a valid UIVEX workspace export. Your current data was not changed.'}}},[announce])
  const themeValue=useMemo(()=>({theme,setTheme}),[theme,setTheme])
  const workspaceValue=useMemo(()=>({toggleFavorite,favorites,presets,recent,storageAvailable,notice,addRecent,savePreset,deletePreset,clearAll,importWorkspace,exportWorkspace,announce}),[toggleFavorite,favorites,presets,recent,storageAvailable,notice,addRecent,savePreset,deletePreset,clearAll,importWorkspace,exportWorkspace,announce])
  return <ThemeCtx.Provider value={themeValue}><WorkspaceCtx.Provider value={workspaceValue}>{children}<div className="sr-only" aria-live="polite">{notice}</div></WorkspaceCtx.Provider></ThemeCtx.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(){const ctx=useContext(ThemeCtx);if(!ctx)throw new Error('useTheme must be used inside UivexProvider');return ctx}
// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspace(){const ctx=useContext(WorkspaceCtx);if(!ctx)throw new Error('useWorkspace must be used inside UivexProvider');return ctx}
// Backward-compatible aggregate hook for external consumers and existing tests.
// eslint-disable-next-line react-refresh/only-export-components
export function useUivex(){return {...useTheme(),...useWorkspace()}}
