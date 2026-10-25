import type { CatalogItem, ComponentConfig, Complexity } from '../types'

const base:ComponentConfig={label:'Interact',accent:'#80e5e0',radius:12,padding:14,weight:700,speed:320,variant:'default',shadow:false,icon:true}
type Row=[string,string,string,string,string[],Complexity,boolean,CatalogItem['previewFit']?,string?]
const rows:Row[]=[
['drag-confirm-action','Drag Confirm Action','Buttons','Drag a guarded handle to the completion zone before an irreversible action runs.',['drag','confirm','safety'],'Advanced',true,'wide','Slide to archive'],
['countdown-action','Countdown Action','Buttons','Arms a timed action with visible cancellation and completion states.',['countdown','action','cancel'],'Intermediate',true,'compact','Start countdown'],
['smart-autocomplete','Smart Autocomplete','Forms','Keyboard-friendly suggestion field with local matching and explicit selection.',['autocomplete','search','keyboard'],'Advanced',true,'wide','Search cities'],
['character-limit-field','Character Limit Field','Forms','Writing field with live limit feedback and overflow prevention.',['textarea','counter','validation'],'Starter',true,'wide','Write a short note'],
['reorder-task-card','Reorder Task Card','Cards','Priority card with direct move controls and persistent local order feedback.',['task','reorder','productivity'],'Intermediate',true,'wide'],
['event-rsvp-card','Event RSVP Card','Cards','Event summary with capacity-aware attendance states and calendar context.',['event','rsvp','capacity'],'Intermediate',true,'wide'],
['scrollspy-pills','Scrollspy Pills','Navigation','Section navigator with a moving active marker and direct keyboard-safe selection.',['scrollspy','sections','pills'],'Intermediate',true,'wide'],
['context-navigation','Context Navigation','Navigation','Context-sensitive action trail that reveals secondary destinations on demand.',['context','menu','navigation'],'Advanced',true,'overlay-safe'],
['reconnect-banner','Reconnect Banner','Feedback','Connection warning with retry progress, recovery state, and polite announcements.',['connection','retry','status'],'Intermediate',true,'wide'],
['error-recovery-panel','Error Recovery Panel','Feedback','Actionable failure summary that exposes diagnostics only when requested.',['error','recovery','details'],'Intermediate',true,'wide'],
['numeric-loader','Numeric Loader','Loaders','Progress indicator that advances in meaningful numeric increments.',['numeric','progress','loader'],'Starter',true,'compact'],
['grid-skeleton-loader','Grid Skeleton Loader','Loaders','Structured placeholder that mirrors a compact dashboard grid.',['skeleton','grid','loading'],'Intermediate',true,'wide'],
['responsive-bottom-sheet','Responsive Bottom Sheet','Overlays','Touch-friendly sheet with explicit open, close, and snap states.',['sheet','mobile','overlay'],'Advanced',true,'overlay-safe'],
['floating-edit-toolbar','Floating Edit Toolbar','Overlays','Selection toolbar with toggled formatting actions and dismiss behavior.',['toolbar','editing','popover'],'Intermediate',true,'overlay-safe'],
['cursor-trail-label','Cursor Trail Label','Effects','Pointer-following caption that falls back to a tap-driven position on touch.',['cursor','trail','label'],'Intermediate',true,'wide'],
['image-mask-reveal','Image Mask Reveal','Effects','Interactive geometric mask revealing layered local artwork.',['mask','reveal','image'],'Advanced',true,'wide'],
['comparison-bars','Comparison Bars','Data','Selectable comparison bars with exact values and accessible labels.',['bars','comparison','chart'],'Intermediate',true,'wide'],
['status-matrix','Status Matrix','Data','Interactive service matrix with filterable operational states.',['status','matrix','operations'],'Advanced',true,'wide'],
['video-chapter-player','Video Chapter Player','Media','Local media-control mockup with play state and chapter navigation.',['video','chapters','player'],'Advanced',true,'wide'],
['album-selector','Album Selector','Media','Keyboard-friendly album browser with track selection and playback state.',['album','audio','selection'],'Intermediate',true,'wide'],
['adaptive-split-pane','Adaptive Split Pane','Layouts','Adjustable two-pane workspace with bounded proportions and reset control.',['split','resize','workspace'],'Advanced',true,'wide'],
['collapsible-dashboard','Collapsible Dashboard','Layouts','Dashboard shell with independently collapsible analytic regions.',['dashboard','collapse','layout'],'Advanced',true,'wide'],
]
const controls:Record<string,(keyof ComponentConfig)[]>={Buttons:['label','accent','radius','speed'],Forms:['label','accent','radius','padding'],Cards:['accent','radius','shadow'],Navigation:['accent','radius','speed'],Feedback:['label','accent','radius','speed'],Loaders:['accent','radius','speed'],Overlays:['accent','radius','speed','shadow'],Effects:['label','accent','speed'],Data:['accent','radius','speed'],Media:['accent','radius','speed'],Layouts:['accent','radius','padding']}
export const batchOneExpansion:CatalogItem[]=rows.map(([slug,title,category,description,tags,complexity,animated,previewFit,label])=>({slug,title,category,description,tags,complexity,animated,previewFit,added:'2026-10-14',variants:['default','compact'],states:['default','focus','disabled'],controls:controls[category],dependencies:['lucide-react'],keyboard:'Tab reaches every control; Enter or Space activates buttons. Directional controls expose explicit buttons or arrow-key-safe native inputs.',accessibility:'Uses semantic controls, visible focus, accessible names, live status where needed, and reduced-motion-compatible CSS transitions.',defaultConfig:{...base,label:label??title}}))
