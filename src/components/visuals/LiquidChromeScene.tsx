import { useEffect, useRef, useState } from 'react'

const vertex=`#version 300 es
in vec2 position;out vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`
const fragment=`#version 300 es
precision highp float;in vec2 uv;out vec4 outColor;uniform vec2 resolution;uniform float time;uniform float lightMode;
float ridge(float distanceToFold,float width){return exp(-distanceToFold*distanceToFold/width);}
float surface(vec2 p,float t){
 float drift=t*.13;
 float upper=p.y-(.62+p.x*.19+sin(p.x*.82+drift)*.20+sin(p.x*1.7-drift*.7)*.045);
 float middle=p.y-(.05-p.x*.08+sin(p.x*.56-drift+1.2)*.31+sin(p.x*1.34+drift*.6)*.06);
 float lower=p.y-(-.70+p.x*.055+sin(p.x*.68+drift+2.4)*.20+sin(p.x*1.7-drift*.45)*.045);
 return ridge(upper,.052)*.90+ridge(middle,.105)*1.08+ridge(lower,.070)*.86;
}
void main(){vec2 p=uv*2.-1.;float aspect=resolution.x/max(resolution.y,1.);p.x*=clamp(aspect*.72,1.05,1.65);float e=.0045,h=surface(p,time);vec2 g=vec2(surface(p+vec2(e,0),time)-surface(p-vec2(e,0),time),surface(p+vec2(0,e),time)-surface(p-vec2(0,e),time))/(2.*e);vec3 n=normalize(vec3(-g*.78,1));vec3 view=normalize(vec3(p*.10,1));vec3 key=normalize(vec3(-.52,.62,.58)),rim=normalize(vec3(.74,-.22,.64)),fill=normalize(vec3(.08,.82,.56));float fres=pow(1.-max(dot(n,view),0.),2.15);float s=pow(max(dot(reflect(-key,n),view),0.),30.);float s2=pow(max(dot(reflect(-rim,n),view),0.),16.);float s3=pow(max(dot(reflect(-fill,n),view),0.),46.);float folds=smoothstep(.025,.38,h);float core=smoothstep(.30,.98,h);float reflection=clamp(s*1.42+s2*.82+s3*.58+fres*.34,0.,1.);vec3 graphite=mix(vec3(.003,.007,.010),vec3(.045,.068,.082),core);vec3 silver=mix(vec3(.075,.105,.12),vec3(.96,.975,.99),reflection);vec3 color=mix(graphite,silver,folds*clamp(.12+reflection,0.,1.));color+=vec3(.34,.39,.42)*pow(core,2.4)*s2*.42;if(lightMode>.5){vec3 pale=mix(vec3(.975,.98,.985),vec3(.69,.73,.76),core*.72);color=mix(pale,vec3(.995,1.,1.),reflection*.78);color-=vec3(.10,.09,.075)*core*(1.-reflection)*.48;}float vignette=mix(.67,1.,smoothstep(1.65,.18,length(p*vec2(.34,.62))));outColor=vec4(color*vignette,clamp(.18+folds*.82,0.,1.));}`

function makeShader(gl:WebGL2RenderingContext,type:number,source:string){const value=gl.createShader(type);if(!value)return null;gl.shaderSource(value,source);gl.compileShader(value);if(!gl.getShaderParameter(value,gl.COMPILE_STATUS)){gl.deleteShader(value);return null}return value}

export function LiquidChromeScene({className=''}:{className?:string}){
 const canvas=useRef<HTMLCanvasElement>(null),[fallback,setFallback]=useState(false)
 useEffect(()=>{const node=canvas.current;if(!node)return;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,gl=node.getContext('webgl2',{alpha:true,antialias:false,powerPreference:'low-power'});if(!gl){setFallback(true);return}
  const vs=makeShader(gl,gl.VERTEX_SHADER,vertex),fs=makeShader(gl,gl.FRAGMENT_SHADER,fragment),program=gl.createProgram();if(!vs||!fs||!program){setFallback(true);return}gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS)){setFallback(true);return}
  const buffer=gl.createBuffer(),position=gl.getAttribLocation(program,'position'),resolution=gl.getUniformLocation(program,'resolution'),clock=gl.getUniformLocation(program,'time'),mode=gl.getUniformLocation(program,'lightMode');gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);gl.useProgram(program);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0)
  let frame=0,visible=true,disposed=false,lightMode=document.documentElement.classList.contains('light')?1:0;const start=performance.now();const syncSize=()=>{const box=node.getBoundingClientRect();if(box.width<2||box.height<2)return false;const dpr=Math.min(devicePixelRatio,box.width<700?1:1.5),w=Math.max(2,Math.round(box.width*dpr)),h=Math.max(2,Math.round(box.height*dpr));if(node.width!==w||node.height!==h){node.width=w;node.height=h}gl.viewport(0,0,w,h);gl.uniform2f(resolution,w,h);return true};const draw=(now:number)=>{frame=0;if(disposed||!visible)return;if(!syncSize()){frame=requestAnimationFrame(draw);return}gl.uniform1f(clock,reduce?1.7:(now-start)/1000);gl.uniform1f(mode,lightMode);gl.drawArrays(gl.TRIANGLES,0,3);if(!reduce)frame=requestAnimationFrame(draw)};const requestDraw=()=>{if(!frame&&!disposed&&visible)frame=requestAnimationFrame(draw)}
  const resizeObserver=new ResizeObserver(()=>requestDraw());resizeObserver.observe(node);const handleViewportChange=()=>requestDraw();window.addEventListener('resize',handleViewportChange,{passive:true});document.addEventListener('fullscreenchange',handleViewportChange);const themeObserver=new MutationObserver(()=>{lightMode=document.documentElement.classList.contains('light')?1:0;requestDraw()});themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class']});const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)requestDraw();else if(frame){cancelAnimationFrame(frame);frame=0}},{rootMargin:'120px'});observer.observe(node);requestDraw();const lost=(event:Event)=>{event.preventDefault();if(frame)cancelAnimationFrame(frame);frame=0;setFallback(true)};node.addEventListener('webglcontextlost',lost)
  return()=>{disposed=true;observer.disconnect();resizeObserver.disconnect();themeObserver.disconnect();window.removeEventListener('resize',handleViewportChange);document.removeEventListener('fullscreenchange',handleViewportChange);if(frame)cancelAnimationFrame(frame);node.removeEventListener('webglcontextlost',lost);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs)}
 },[])
 return <canvas ref={canvas} className={`liquid-chrome-canvas ${fallback?'is-fallback':''} ${className}`} aria-hidden="true"/>
}
