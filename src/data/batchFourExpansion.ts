import type { CatalogItem, ComponentConfig, Complexity } from '../types'

const base:ComponentConfig={label:'Motion crafted',accent:'#80e5e0',radius:12,padding:14,weight:750,speed:520,variant:'default',shadow:false,icon:true}
type Row=[string,string,string,string,string[],Complexity,CatalogItem['previewFit']?,string?]
const rows:Row[]=[
 ['letter-depth-assembly','3D Letter Assembly','Effects','Replay a coordinated per-letter depth assembly with stable final typography.',['letters','3d','assembly'],'Advanced','wide','Build in depth'],
 ['liquid-phrase-morph','Liquid Phrase Morph','Effects','Transition between phrases through a controlled fluid distortion state.',['text','morph','liquid'],'Advanced','wide','Shape ideas'],
 ['chrome-reflection-type','Chrome Reflection Text','Effects','Aim a polished reflection across glyph-clipped metallic typography.',['chrome','reflection','text'],'Intermediate','wide','Reflect motion'],
 ['elastic-word-reveal','Elastic Word Reveal','Effects','Expand compressed words into readable rhythm with adjustable spring timing.',['words','elastic','reveal'],'Intermediate','wide','Motion has rhythm'],
 ['perspective-word-flip','Perspective Word Flip','Effects','Rotate complete words through depth while preserving a stable text line.',['words','flip','perspective'],'Advanced','compact','Design'],
 ['magnetic-letter-field','Magnetic Letter Field','Effects','Characters respond locally to pointer proximity and spring back without reflow.',['letters','magnetic','pointer'],'Advanced','wide','Magnetic type'],
 ['kinetic-type-grid','Kinetic Type Grid','Effects','Select typographic tiles to coordinate scale, weight, and directional movement.',['typography','grid','kinetic'],'Intermediate','wide','TYPE SYSTEM'],
 ['wave-baseline-type','Wave Baseline Typography','Effects','Control readable letter displacement along a smooth animated baseline.',['text','wave','baseline'],'Intermediate','wide','Flowing baseline'],
 ['directional-label-reveal','Directional Label Reveal','Buttons','Reveal an alternate action label from the pointer entry direction or keyboard activation.',['text','direction','hover'],'Advanced','compact','Explore motion'],
 ['spotlight-glyph-reveal','Spotlight Glyph Reveal','Effects','Move a soft spotlight across glyphs to expose an alternate metallic fill.',['text','spotlight','mask'],'Advanced','wide','Hidden signal'],
 ['elastic-underline-nav','Elastic Underline Navigation','Navigation','Move a spring-shaped indicator between labels while preserving tab semantics.',['navigation','underline','spring'],'Intermediate','wide','Navigation motion'],
 ['rotating-word-cylinder','Rotating Word Cylinder','Effects','Navigate phrases arranged around a controlled typographic cylinder.',['words','carousel','3d'],'Advanced','compact','Create'],
 ['editorial-line-reveal','Editorial Line Reveal','Effects','Replay directional line masks across a stable editorial composition.',['editorial','lines','reveal'],'Intermediate','wide','Interfaces reward attention'],
 ['text-path-journey','Text Path Journey','Effects','Scrub readable copy along a curved SVG path with forward and reverse controls.',['svg','path','text'],'Advanced','wide','Follow the system'],
 ['depth-parallax-headline','Depth Parallax Headline','Effects','Coordinate multiple headline layers at distinct pointer-responsive depths.',['parallax','headline','depth'],'Advanced','wide','Designed in layers'],
 ['typography-keyframe-timeline','Typography Keyframe Timeline','Effects','Scrub and select typographic keyframes across a visible motion timeline.',['timeline','keyframes','typography'],'Advanced','wide','Motion sequence'],
 ['particle-type-formation','Particle Type Formation','Loaders','Trigger a lightweight particle field that resolves into semantic text.',['particles','text','formation'],'Advanced','wide','Assemble'],
 ['outline-fill-type','Outline to Fill Typography','Effects','Draw an SVG text outline before transitioning into a solid finish.',['svg','outline','fill'],'Intermediate','wide','Outline'],
 ['distortion-lens-type','Text Distortion Lens','Effects','Move a bounded lens across letters to magnify local glyph forms.',['lens','distortion','text'],'Advanced','wide','Focus the signal'],
 ['animated-gradient-type','Animated Gradient Typography','Effects','Adjust a moving glyph gradient by cycling direction and palette states.',['gradient','text','animation'],'Intermediate','wide','Chromatic motion'],
 ['motion-typography-card','Motion Typography Card','Cards','Combine perspective response, hierarchy, and replayable text entrance in one reusable panel.',['card','typography','perspective'],'Advanced','wide','Design moves'],
 ['ribbon-slice-type','Ribbon Slice Typography','Effects','Reassemble horizontal glyph slices into crisp readable typography.',['slice','mask','text'],'Advanced','wide','Cut with purpose'],
 ['hover-echo-type','Hover Echo Typography','Effects','Create controlled trailing glyph echoes that collapse back into the source label.',['echo','hover','letters'],'Intermediate','compact','Signal'],
 ['orbital-caption-type','Orbital Caption Typography','Effects','Rotate supporting captions around a stable central word with direct speed control.',['orbit','caption','type'],'Advanced','compact','CORE'],
 ['weight-sequence-type','Letter Weight Sequencer','Effects','Step a weight emphasis rhythm across characters without changing layout width.',['weight','sequence','letters'],'Intermediate','wide','Variable rhythm'],
]

export const batchFourExpansion:CatalogItem[]=rows.map(([slug,title,category,description,tags,complexity,previewFit,label])=>({
 slug,title,category,description,tags,complexity,previewFit,animated:true,added:'2026-10-27',variants:['default','compact'],states:['default','hover','focus','disabled'],controls:['label','accent','weight','speed'],dependencies:[],keyboard:'Tab focuses interactive previews; Enter or Space replays or advances the effect.',accessibility:'Keeps readable semantic text, visible focus, stable layout, and a reduced-motion presentation.',defaultConfig:{...base,label:label??title},
}))
