/* eslint-disable react-refresh/only-export-components -- renderer and matching export helpers share the icon contract */
import { renderToStaticMarkup } from 'react-dom/server'
import type { CSSProperties } from 'react'
import type { IconAnimation,IconAsset } from '../../data/iconRegistry'

export interface IconAppearance {size:number;color:string;strokeWidth:number;opacity:number;rotation:number;background:string;shape:'none'|'rounded'|'circle'|'square';finish:'outline'|'solid'|'duotone'|'metallic'|'embossed'|'gradient'|'floating';padding:number;radius:number;animation:IconAnimation;speed:number;easing:'smooth'|'spring'|'linear';trigger:'hover'|'click'|'always'}
export const defaultIconAppearance:IconAppearance={size:40,color:'#80e5e0',strokeWidth:2,opacity:1,rotation:0,background:'#101820',shape:'rounded',finish:'outline',padding:14,radius:14,animation:'none',speed:650,easing:'smooth',trigger:'hover'}

export function IconGlyph({asset,appearance,active=false,decorative=false}:{asset:IconAsset;appearance:IconAppearance;active?:boolean;decorative?:boolean}){
 const style={'--icon-color':appearance.color,'--icon-size':`${appearance.size}px`,'--icon-speed':`${appearance.speed}ms`,'--icon-easing':easingValue(appearance.easing),'--icon-rotation':`${appearance.rotation}deg`,'--icon-bg':appearance.background,'--icon-padding':`${appearance.padding}px`,'--icon-radius':appearance.shape==='circle'?'50%':appearance.shape==='square'?'0px':`${appearance.radius}px`,opacity:appearance.opacity} as CSSProperties
 const className=`icon-glyph shape-${appearance.shape} finish-${appearance.finish} trigger-${appearance.trigger} animation-${appearance.animation}${active?' is-active':''}`
 return <span className={className} style={style} role={decorative?undefined:'img'} aria-hidden={decorative||undefined} aria-label={decorative?undefined:asset.name}>
  {asset.kind==='brand'?<svg viewBox="0 0 24 24" fill="currentColor" width={appearance.size} height={appearance.size}><path d={(asset.icon as import('simple-icons').SimpleIcon).path}/></svg>:(()=>{const Glyph=asset.icon as import('lucide-react').LucideIcon;return <Glyph size={appearance.size} strokeWidth={appearance.strokeWidth} aria-hidden="true"/>})()}
 </span>
}

export function iconSvg(asset:IconAsset,appearance:IconAppearance){
 const motion=animationCss(appearance)
 const padding=appearance.shape==='none'?0:appearance.padding,total=appearance.size+padding*2
 const radius=appearance.shape==='circle'?total/2:appearance.shape==='square'?0:appearance.radius
 const background=appearance.shape==='none'?'':`<rect width="${total}" height="${total}" rx="${radius}" fill="${appearance.background}"/>`
 if(asset.kind==='brand')return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}" viewBox="0 0 ${total} ${total}" role="img" aria-label="${asset.name}">${motion}${background}<svg class="uivex-icon" x="${padding}" y="${padding}" width="${appearance.size}" height="${appearance.size}" viewBox="0 0 24 24" fill="${appearance.color}" opacity="${appearance.opacity}" style="transform:rotate(${appearance.rotation}deg);transform-origin:center"><path d="${(asset.icon as import('simple-icons').SimpleIcon).path}"/></svg></svg>`
 const Glyph=asset.icon as import('lucide-react').LucideIcon
 const glyph=renderToStaticMarkup(<Glyph className="uivex-icon" x={padding} y={padding} width={appearance.size} height={appearance.size} color={appearance.color} strokeWidth={appearance.strokeWidth} opacity={appearance.opacity} style={{transform:`rotate(${appearance.rotation}deg)`,transformOrigin:'center'}} aria-hidden="true"/>)
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}" viewBox="0 0 ${total} ${total}" role="img" aria-label="${asset.name}">${motion}${background}${glyph}</svg>`
}

export function iconReactCode(asset:IconAsset,appearance:IconAppearance){
 const animation=appearance.animation==='none'?'none':`uivexIcon ${appearance.speed}ms ${easingValue(appearance.easing)}`
 const keyframes=animationFrames(appearance.animation)
 const radius=appearance.shape==='circle'?'50%':appearance.shape==='square'?'0':`${appearance.radius}px`
 const wrapper=appearance.shape==='none'?'{}':`{display:'inline-grid',placeItems:'center',padding:${appearance.padding},borderRadius:'${radius}',background:'${appearance.background}'}`
 if(asset.kind==='brand')return `export function ${safeName(asset.name)}Icon() {\n  return (\n    <span style={${wrapper}}>\n      <style>{\`@keyframes uivexIcon{${keyframes}}\`}</style>\n      <svg width={${appearance.size}} height={${appearance.size}} viewBox="0 0 24 24" fill="${appearance.color}" role="img" aria-label="${asset.name}" style={{opacity:${appearance.opacity},transform:'rotate(${appearance.rotation}deg)',transformOrigin:'center',animation:'${animation}'}}>\n        <path d="${(asset.icon as import('simple-icons').SimpleIcon).path}" />\n      </svg>\n    </span>\n  )\n}`
 const importName=(asset.icon as import('lucide-react').LucideIcon&{displayName?:string}).displayName??safeName(asset.name)
 return `import { ${importName} } from 'lucide-react'\n\nexport function ${safeName(asset.name)}Icon() {\n  return (\n    <span style={${wrapper}}>\n      <style>{\`@keyframes uivexIcon{${keyframes}}\`}</style>\n      <${importName} size={${appearance.size}} color="${appearance.color}" strokeWidth={${appearance.strokeWidth}} aria-label="${asset.name}" style={{opacity:${appearance.opacity},transform:'rotate(${appearance.rotation}deg)',transformOrigin:'center',animation:'${animation}'}} />\n    </span>\n  )\n}`
}
function safeName(name:string){return name.replace(/[^a-zA-Z0-9]+(.)/g,(_,char)=>char.toUpperCase()).replace(/^[a-z]/,char=>char.toUpperCase())}
function easingValue(easing:IconAppearance['easing']){return easing==='spring'?'cubic-bezier(.2,1.35,.35,1)':easing==='linear'?'linear':'cubic-bezier(.2,.8,.2,1)'}
function animationCss(appearance:IconAppearance){return appearance.animation==='none'?'':`<style>.uivex-icon{transform-origin:center;animation:uivexIcon ${appearance.speed}ms ${easingValue(appearance.easing)}}@keyframes uivexIcon{${animationFrames(appearance.animation)}}</style>`}
function animationFrames(animation:IconAnimation){
 const frames:Partial<Record<IconAnimation,string>>={pulse:'50%{transform:scale(1.2)}',bounce:'45%{transform:translateY(-18%)}',spin:'to{transform:rotate(360deg)}',draw:'0%{stroke-dasharray:80;stroke-dashoffset:80}to{stroke-dasharray:80;stroke-dashoffset:0}',ring:'25%{transform:rotate(-14deg)}50%{transform:rotate(14deg)}75%{transform:rotate(-7deg)}',morph:'50%{transform:rotate(90deg) scale(.82)}',burst:'50%{transform:scale(1.3)}',send:'60%{transform:translate(20%,-20%);opacity:.25}',download:'60%{transform:translateY(20%)}',upload:'60%{transform:translateY(-20%)}',success:'50%{transform:scale(1.18)}',waves:'50%{transform:scaleX(1.18)}',cart:'40%{transform:translateX(18%) rotate(-5deg)}',lock:'50%{transform:translateY(-10%) scaleY(1.12)}',copy:'45%{transform:translate(10%,-10%)}',search:'50%{transform:scale(1.18) translateX(6%)}',theme:'50%{transform:rotate(180deg)}',expand:'50%{transform:scale(1.28)}',refresh:'to{transform:rotate(360deg)}',wiggle:'25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}',flip:'50%{transform:rotateY(180deg)}'}
 return frames[animation]??''
}
