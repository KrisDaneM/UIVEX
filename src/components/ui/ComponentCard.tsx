import { ArrowUpRight, Code2, Heart, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CatalogPreview } from '../catalog/CatalogPreview'
import type { CatalogItem } from '../../types'
import { useWorkspace } from '../../app/UivexContext'

export function ComponentCard({item}:{item:CatalogItem}){
 const {favorites,toggleFavorite}=useWorkspace();const liked=favorites.includes(item.slug)
 return <article className={`component-card surface card-${item.previewFit??'standard'}`}>
  <div className="card-preview"><CatalogPreview slug={item.slug} config={item.defaultConfig} compact/><button className={`favorite ${liked?'liked':''}`} onClick={()=>toggleFavorite(item.slug)} aria-label={`${liked?'Remove':'Add'} ${item.title} ${liked?'from':'to'} favorites`}><Heart size={18} fill={liked?'currentColor':'none'}/></button></div>
  <div className="card-body">
   <div className="card-meta"><span>{item.category}</span><span>{item.animated?'Motion':'Static'} <i aria-hidden="true">·</i> {item.complexity}</span></div>
   <h3 className="card-title"><Link to={`/components/${item.slug}`}>{item.title}</Link></h3>
   <p className="card-description">{item.description}</p>
   <footer className="card-actions"><Link to={`/components/${item.slug}`}>Details <ArrowUpRight/></Link><Link to={`/playground/${item.slug}`}><SlidersHorizontal/> Customize</Link><Link to={`/components/${item.slug}#code`} aria-label={`View ${item.title} code`}><Code2/> Code</Link></footer>
  </div>
 </article>
}
