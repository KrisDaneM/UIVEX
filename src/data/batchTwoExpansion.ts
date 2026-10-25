import type { CatalogItem, ComponentConfig, Complexity } from '../types'

const base:ComponentConfig={label:'Interact',accent:'#80e5e0',radius:12,padding:14,weight:700,speed:320,variant:'default',shadow:false,icon:true}
type Row=[string,string,string,string,string[],Complexity,boolean,CatalogItem['previewFit'],string?]
const rows:Row[]=[
['direction-aware-action','Direction Aware Action','Buttons','A call-to-action whose fill enters from the pointer approach edge.',['button','direction','hover'],'Advanced',true,'compact','Open project'],
['copy-feedback-button','Copy Feedback Button','Buttons','Copies a local value and transitions through honest success feedback.',['copy','clipboard','feedback'],'Intermediate',true,'compact','Copy token'],
['save-state-button','Save State Button','Buttons','Communicates dirty, saving, and saved states in one compact action.',['save','state','progress'],'Intermediate',true,'compact','Save changes'],
['date-range-selector','Date Range Selector','Forms','Accessible paired-date control with range validation and duration feedback.',['date','range','validation'],'Intermediate',true,'wide','Project window'],
['file-upload-queue','File Upload Queue','Forms','Local multi-file queue with progress simulation, retry, and removal controls.',['upload','files','queue'],'Advanced',true,'tall','Add sample files'],
['password-requirements','Password Requirements','Forms','Password field with live, semantic requirement evaluation.',['password','validation','checklist'],'Intermediate',true,'wide','Create password'],
['product-variant-card','Product Variant Card','Cards','Product card with selectable finishes, stock-aware actions, and CSS depth.',['product','variants','commerce'],'Advanced',true,'wide'],
['testimonial-rotator','Testimonial Rotator','Cards','Controlled testimonial carousel with readable navigation and pause-free transitions.',['testimonial','carousel','content'],'Intermediate',true,'wide'],
['draggable-tab-bar','Draggable Tab Bar','Navigation','Reorderable workspace tabs with keyboard move alternatives.',['tabs','drag','reorder'],'Advanced',true,'wide'],
['floating-section-nav','Floating Section Navigator','Navigation','Compact section controller with explicit current-location feedback.',['sections','floating','navigation'],'Intermediate',true,'wide'],
['status-monitor','Interactive Status Monitor','Feedback','Service health monitor with inspectable incidents and recovery actions.',['status','monitor','incident'],'Advanced',true,'wide'],
['staged-confirmation','Staged Confirmation','Feedback','Two-stage confirmation that prevents accidental destructive actions.',['confirm','safety','feedback'],'Intermediate',true,'wide'],
['file-transfer-loader','File Transfer Loader','Loaders','Transfer progress with pause, resume, and deterministic completion states.',['file','transfer','progress'],'Intermediate',true,'wide'],
['processing-timeline','Processing Timeline','Loaders','Step-by-step processing status with retryable failure handling.',['timeline','processing','steps'],'Advanced',true,'tall'],
['shape-sequence-loader','Shape Sequence Loader','Loaders','Reduced-motion geometric loader advancing through meaningful phases.',['shape','sequence','loader'],'Intermediate',true,'compact'],
['action-popover','Contextual Action Popover','Overlays','Anchored action menu with selection feedback and explicit dismissal.',['popover','actions','context'],'Intermediate',true,'overlay-safe'],
['keyboard-dialog','Keyboard Accessible Dialog','Overlays','Modal workflow with Escape close behavior and focus-return semantics.',['dialog','keyboard','modal'],'Advanced',true,'overlay-safe'],
['notification-center','Notification Center','Overlays','Filterable notification panel with read state and batch clearing.',['notifications','drawer','filter'],'Advanced',true,'tall'],
['split-text-reveal','Split Text Reveal','Effects','Replayable word-by-word headline reveal with reduced-motion fallback.',['text','reveal','kinetic'],'Intermediate',true,'wide'],
['interactive-depth-layers','Interactive Depth Layers','Effects','Pointer-controlled CSS perspective stack with a touch-friendly reset.',['depth','perspective','pointer'],'Advanced',true,'wide'],
['elastic-expansion','Elastic Content Expansion','Effects','Directly controlled disclosure using spring-like scale and opacity.',['elastic','expand','disclosure'],'Intermediate',true,'wide'],
['sortable-data-table','Sortable Data Table','Data','Compact data grid with deterministic column sorting and accessible headers.',['table','sort','data'],'Advanced',true,'wide'],
['column-visibility','Column Visibility Controller','Data','Data view with user-controlled columns and protected required fields.',['columns','visibility','table'],'Advanced',true,'wide'],
['image-annotation-tool','Image Annotation Tool','Media','Local annotation surface where pointer clicks place and remove numbered notes.',['image','annotation','tool'],'Advanced',true,'wide'],
['reorder-dashboard','Reorder Dashboard Widgets','Layouts','Dashboard grid with draggable widgets plus accessible move controls.',['dashboard','drag','layout'],'Advanced',true,'wide'],
]
const controls:Record<string,(keyof ComponentConfig)[]>={Buttons:['label','accent','radius','speed','shadow'],Forms:['label','accent','radius','padding'],Cards:['accent','radius','shadow','speed'],Navigation:['accent','radius','speed'],Feedback:['accent','radius','speed'],Loaders:['accent','radius','speed'],Overlays:['accent','radius','speed','shadow'],Effects:['label','accent','radius','speed'],Data:['accent','radius','padding'],Media:['accent','radius','speed'],Layouts:['accent','radius','padding','speed']}
export const batchTwoExpansion:CatalogItem[]=rows.map(([slug,title,category,description,tags,complexity,animated,previewFit,label])=>({slug,title,category,description,tags,complexity,animated,previewFit,added:'2026-10-23',variants:['default','compact'],states:['default','focus','disabled'],controls:controls[category],dependencies:['lucide-react'],keyboard:'Tab reaches every control; Enter or Space activates buttons. Reorderable patterns include explicit move controls in addition to pointer dragging.',accessibility:'Uses semantic controls, visible focus, accessible names and status output. Motion respects the site reduced-motion rule.',defaultConfig:{...base,label:label??title}}))
