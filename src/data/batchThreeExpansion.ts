import type { CatalogItem, ComponentConfig, Complexity } from '../types'

const base:ComponentConfig={label:'Interact',accent:'#80e5e0',radius:12,padding:14,weight:700,speed:320,variant:'default',shadow:false,icon:true}
type Row=[string,string,string,string,string[],Complexity,CatalogItem['previewFit']?,string?]

const rows:Row[]=[
['visual-query-builder','Visual Query Builder','Forms','Compose nested AND/OR filters, add rules, and switch operators locally.',['query','filters','rules'],'Advanced','wide','Build query'],
['gradient-stop-editor','Gradient Stop Editor','Forms','Drag gradient stops, edit their color, and copy a usable CSS gradient.',['gradient','color','drag'],'Advanced','wide','Linear gradient'],
['shortcut-recorder','Keyboard Shortcut Recorder','Forms','Capture key combinations and report reserved shortcut conflicts.',['keyboard','shortcut','capture'],'Intermediate','compact','Record shortcut'],
['time-slot-selector','Interactive Time Slot Selector','Forms','Choose available appointment slots with unavailable states and keyboard focus.',['schedule','time','selection'],'Intermediate','wide','Choose a time'],
['font-axis-controller','Font Axis Controller','Forms','Tune variable-font weight, width, and slant with a live specimen.',['font','variable','typography'],'Advanced','wide','Variable type'],
['column-pinning-table','Column Pinning Table','Data','Pin, reorder, and hide columns in a compact operational table.',['table','columns','pinning'],'Advanced','wide','Project table'],
['chart-range-brush','Chart Range Brush','Data','Drag a chart brush to select and inspect a focused data interval.',['chart','brush','range'],'Advanced','wide','Traffic range'],
['interactive-treemap','Interactive Treemap','Data','Drill into nested proportional data blocks and navigate back to the root.',['treemap','hierarchy','drilldown'],'Advanced','wide','Storage map'],
['waterfall-chart','Animated Waterfall Chart','Data','Inspect positive and negative contributions to a calculated total.',['chart','waterfall','finance'],'Advanced','wide','Revenue bridge'],
['comparison-matrix','Comparison Matrix','Data','Compare plans, highlight differences, and filter to decisive capabilities.',['comparison','matrix','filter'],'Advanced','wide','Compare plans'],
['peel-reveal-card','Peel Reveal Card','Cards','Drag or tap a folded corner to uncover contextual content beneath it.',['card','peel','gesture'],'Advanced','compact','Reveal note'],
['palette-harmony-wheel','Palette Harmony Wheel','Cards','Rotate a color harmony wheel and copy coordinated palette values.',['color','palette','wheel'],'Advanced','compact','Harmony palette'],
['expandable-product-compare','Expandable Product Comparison','Cards','Select products and expand a card into a structured feature comparison.',['product','compare','expand'],'Advanced','wide','Compare products'],
['blueprint-card','Interactive Blueprint Card','Cards','Inspect labeled regions of a technical blueprint through hover, focus, or tap.',['blueprint','hotspot','specification'],'Intermediate','wide','Component blueprint'],
['timeline-story-card','Timeline Story Card','Cards','Navigate milestones with synchronized editorial content and progress.',['timeline','story','milestones'],'Intermediate','wide','Product story'],
['dockable-panel-tabs','Dockable Panel Tabs','Navigation','Reorder workspace tabs while retaining independent panel state.',['tabs','dock','reorder'],'Advanced','wide','Workspace tabs'],
['breadcrumb-overflow','Breadcrumb Overflow Navigator','Navigation','Collapse long paths into an accessible contextual path menu.',['breadcrumb','overflow','menu'],'Intermediate','wide','Project path'],
['nested-selection-tree','Nested Selection Tree','Navigation','Select hierarchical items with mixed parent and child checkbox states.',['tree','selection','hierarchy'],'Advanced','tall','Select layers'],
['command-history','Command History Navigator','Navigation','Search and replay a local history of demonstration commands.',['command','history','search'],'Advanced','tall','Command history'],
['resizable-split-view','Resizable Split View','Layouts','Resize adjacent panes by drag or keyboard and restore the default ratio.',['split','resize','panels'],'Advanced','wide','Split workspace'],
['spring-easing-editor','Spring Easing Editor','Effects','Tune spring stiffness and damping while replaying a live motion sample.',['spring','easing','motion'],'Advanced','wide','Spring motion'],
['svg-motion-path-editor','SVG Motion Path Editor','Effects','Move path control points and replay an object along the edited SVG curve.',['svg','path','editor'],'Advanced','wide','Motion path'],
['elastic-grid-selector','Elastic Grid Selector','Effects','Select grid cells with coordinated spring displacement and keyboard movement.',['grid','spring','selection'],'Intermediate','compact','Select cell'],
['perspective-fold-reveal','Perspective Fold Reveal','Effects','Unfold layered information with a controlled dimensional transition.',['fold','perspective','reveal'],'Advanced','compact','Unfold details'],
['interactive-light-surface','Interactive Light Surface','Effects','Aim a directional highlight across a tactile surface using pointer or touch.',['lighting','pointer','surface'],'Intermediate','wide','Light surface'],
['css-clamp-generator','CSS Clamp Generator','Effects','Generate a responsive CSS clamp expression from minimum and maximum values.',['css','clamp','generator'],'Intermediate','wide','Responsive clamp'],
['shadow-layer-composer','Shadow Layer Composer','Effects','Add, reorder, toggle, and tune multiple CSS shadow layers.',['css','shadow','composer'],'Advanced','wide','Shadow stack'],
['contrast-inspector','Contrast Inspector','Data','Calculate WCAG contrast ratios and inspect AA and AAA outcomes locally.',['accessibility','contrast','wcag'],'Intermediate','wide','Contrast check'],
['breakpoint-ruler','Responsive Breakpoint Ruler','Layouts','Test a sample layout against editable viewport breakpoints.',['responsive','breakpoint','ruler'],'Advanced','wide','Breakpoint ruler'],
['spacing-token-explorer','Spacing Token Explorer','Layouts','Edit a spacing scale and compare tokens through proportional visual samples.',['tokens','spacing','design-system'],'Intermediate','wide','Spacing scale'],
['image-hotspot-editor','Image Hotspot Editor','Media','Place, move, label, and remove interactive markers on a local visual canvas.',['image','hotspot','editor'],'Advanced','wide','Image hotspots'],
['focal-point-selector','Focal Point Selector','Media','Drag a focal point and compare its crop across responsive aspect ratios.',['image','crop','focal-point'],'Advanced','wide','Focal point'],
['audio-segment-selector','Audio Segment Selector','Media','Select and preview a bounded segment on a local waveform timeline.',['audio','segment','timeline'],'Advanced','wide','Audio segment'],
['perspective-image-showcase','Perspective Image Showcase','Media','Drag through layered image planes with depth and snap navigation.',['images','perspective','drag'],'Advanced','wide','Image showcase'],
['media-contact-sheet','Media Contact Sheet','Media','Import local images, change thumbnail density, and maintain a selection set.',['media','upload','contact-sheet'],'Advanced','wide','Contact sheet'],
['drag-reorder-checklist','Drag-Reorder Checklist','Layouts','Reorder tasks, toggle completion, and preserve an accessible move alternative.',['tasks','checklist','reorder'],'Advanced','tall','Release checklist'],
['workflow-node-connector','Workflow Node Connector','Layouts','Connect draggable workflow nodes and inspect their directed relationships.',['workflow','nodes','connections'],'Advanced','wide','Workflow graph'],
['offline-action-queue','Offline Action Queue','Feedback','Process local queued actions through retry, success, and failure states.',['offline','queue','retry'],'Advanced','tall','Sync queue'],
['editable-kanban-swimlane','Editable Kanban Swimlane','Layouts','Move editable cards across grouped swimlanes with accessible controls.',['kanban','swimlane','productivity'],'Advanced','wide','Team board'],
['animation-timeline-scrubber','Animation Timeline Scrubber','Effects','Scrub, play, pause, and inspect keyframe progress on a motion timeline.',['animation','timeline','scrubber'],'Advanced','wide','Motion timeline'],
]

const controls:Record<string,(keyof ComponentConfig)[]>={Forms:['label','accent','radius','padding','speed'],Data:['label','accent','radius','speed'],Cards:['label','accent','radius','padding','speed','shadow'],Navigation:['label','accent','radius','padding','speed'],Layouts:['label','accent','radius','padding','speed'],Effects:['label','accent','radius','speed'],Advanced:['label','accent','radius','padding','speed'],Media:['label','accent','radius','padding','speed'],Feedback:['label','accent','radius','padding','speed']}

export const batchThreeExpansion:CatalogItem[]=rows.map(([slug,title,category,description,tags,complexity,previewFit,label])=>({
  slug,title,category,description,tags,complexity,previewFit,animated:true,added:'2026-10-26',variants:['default','compact'],states:['default','focus','disabled'],controls:controls[category]??['accent','radius','speed'],dependencies:[],keyboard:'Tab reaches each control. Arrow keys adjust sliders or directional selection, and Enter or Space activates actions.',accessibility:'Uses native controls, visible focus states, descriptive labels, and reduced-motion-safe transitions.',defaultConfig:{...base,label:label??title},
}))
