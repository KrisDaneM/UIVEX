import type { LucideIcon } from 'lucide-react'
import {
 Activity, Airplay, Aperture, Archive, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, AtSign,
 BadgeDollarSign, Bell, Bike, Binary, Bookmark, Box, Braces, BriefcaseBusiness, Brush, Bug,
 Building2, Calendar, Camera, ChartBar, ChartLine, Check, ChevronDown, ChevronLeft, ChevronRight,
 ChevronUp, CircleAlert, CircleCheck, CircleHelp, CircleUserRound, CircleX, Clipboard,
 ClipboardCheck, Clock, Cloud, Code2, Coffee, Compass, Contact, Copy, CreditCard, Crosshair,
 Database, Download, Dumbbell, Edit3, Eraser, Expand, ExternalLink, Eye, EyeOff, File, FileCode2,
 FileText, Film, Filter, Fingerprint, Folder, FolderOpen, Forward, Gamepad2, Gauge, Gift, GitBranch,
 GitCommitHorizontal, GitMerge, Globe, Grab, GraduationCap, Grid3X3, Hand, Headphones, Heart, Home,
 Image, Inbox, Info, KeyRound, Layers3, LayoutDashboard, Link2, List, ListFilter, LoaderCircle, Lock,
 LogIn, LogOut, Mail, Map, MapPin, Maximize2, Menu, MessageCircle, MessagesSquare, Mic, Minimize2,
 Minus, Monitor, Moon, MousePointer2, Move, Music, Navigation, Network, Package, PaintBucket, Palette,
 PanelLeft, Paperclip, Pause, PenTool, Pencil, Phone, PieChart, Plane, Play, Plus, Podcast, Printer,
 QrCode, Radio, Receipt, Redo2, RefreshCw, Rocket, RotateCw, Ruler, Save, ScanLine, Scissors,
 Search, Send, Server, Settings, Share2, Shield, ShoppingBag, ShoppingCart, Shrink, Sigma, SlidersHorizontal,
 Smile, Sparkles, Square, Star, Store, Sun, Table2, Tag, Target, Terminal, ThumbsUp, Trash2,
 TrendingDown, TrendingUp, Truck, Undo2, Unlock, Upload, User, UserMinus, UserPlus, UserRound, Users,
 Video, Volume2, VolumeX, Wallet, Wifi, X, Zap
} from 'lucide-react'
import {
 siInstagram,siFacebook,siMessenger,siThreads,siWhatsapp,siTiktok,siYoutube,siX,siSnapchat,
 siPinterest,siReddit,siDiscord,siTelegram,siTwitch,siTumblr,siBluesky,siMastodon,siGithub,
 siGitlab,siBitbucket,siStackoverflow,siCodesandbox,siNpm,siDocker,siVercel,siNetlify,siFigma,
 siReact,siVuedotjs,siAngular,siSvelte,siNextdotjs,siTypescript,siJavascript,siHtml5,siCss,
 siTailwindcss,siNodedotjs,siPython,siOpenjdk,siPhp,siMongodb,siPostgresql,siFirebase,siGoogle,
 siApple,siSpotify,siSteam,siPaypal,siStripe,siNotion,siZoom,siDropbox,siDribbble,siBehance,
 siMedium,siDevdotto,siFramer,siWordpress
} from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'

export type IconGroup='Social Media'|'Brands'|'Developer'|'Navigation'|'Actions'|'Communication'|'User & Security'|'Media'|'Data'|'Commerce'|'Files & Development'|'Objects'
export type IconAnimation='none'|'pulse'|'bounce'|'spin'|'draw'|'ring'|'morph'|'burst'|'send'|'download'|'upload'|'success'|'waves'|'cart'|'lock'|'copy'|'search'|'theme'|'expand'|'refresh'|'wiggle'|'flip'
export interface IconAsset {slug:string;name:string;group:IconGroup;keywords:string[];kind:'lucide'|'brand';icon:LucideIcon|SimpleIcon;brandColor?:string;animated?:IconAnimation;license:string}

const ui=(name:string,group:IconGroup,icon:LucideIcon,keywords:string[]=[],animated?:IconAnimation):IconAsset=>({slug:name.toLowerCase().replaceAll(' ','-'),name,group,keywords,kind:'lucide',icon,animated,license:'Lucide ISC License'})
const brand=(icon:SimpleIcon,group:IconGroup='Brands'):IconAsset=>({slug:icon.slug,name:icon.title,group,keywords:[icon.slug,'logo','platform'],kind:'brand',icon,brandColor:`#${icon.hex}`,license:'Simple Icons CC0-1.0; trademarks belong to their owners'})

const social=[siInstagram,siFacebook,siMessenger,siThreads,siWhatsapp,siTiktok,siYoutube,siX,siSnapchat,siPinterest,siReddit,siDiscord,siTelegram,siTwitch,siTumblr,siBluesky,siMastodon].map(icon=>brand(icon,'Social Media'))
const developer=[siGithub,siGitlab,siBitbucket,siStackoverflow,siCodesandbox,siNpm,siDocker,siVercel,siNetlify,siFigma,siReact,siVuedotjs,siAngular,siSvelte,siNextdotjs,siTypescript,siJavascript,siHtml5,siCss,siTailwindcss,siNodedotjs,siPython,siOpenjdk,siPhp,siMongodb,siPostgresql,siFirebase,siDevdotto].map(icon=>brand(icon,'Developer'))
const brands=[siGoogle,siApple,siSpotify,siSteam,siPaypal,siStripe,siNotion,siZoom,siDropbox,siDribbble,siBehance,siMedium,siFramer,siWordpress].map(icon=>brand(icon))

const navigation=[
 ui('Home','Navigation',Home),ui('Menu','Navigation',Menu,['hamburger'], 'morph'),ui('Search','Navigation',Search,['find'],'search'),ui('Arrow Left','Navigation',ArrowLeft),ui('Arrow Right','Navigation',ArrowRight),ui('Arrow Up','Navigation',ArrowUp),ui('Arrow Down','Navigation',ArrowDown),ui('Chevron Left','Navigation',ChevronLeft),ui('Chevron Right','Navigation',ChevronRight),ui('Chevron Up','Navigation',ChevronUp),ui('Chevron Down','Navigation',ChevronDown),ui('Forward','Navigation',Forward),ui('Panel Left','Navigation',PanelLeft,['sidebar']),ui('External Link','Navigation',ExternalLink),ui('Compass','Navigation',Compass,[],'flip'),ui('Navigation','Navigation',Navigation),ui('Map','Navigation',Map),ui('Map Pin','Navigation',MapPin),ui('Globe','Navigation',Globe),ui('Link','Navigation',Link2),ui('Maximize','Navigation',Maximize2,['fullscreen'],'expand'),ui('Minimize','Navigation',Minimize2),ui('Expand','Navigation',Expand,[],'expand'),ui('Shrink','Navigation',Shrink),ui('Grid','Navigation',Grid3X3),ui('List','Navigation',List),ui('Dashboard','Navigation',LayoutDashboard),ui('Layers','Navigation',Layers3)
]
const actions=[
 ui('Add','Actions',Plus),ui('Remove','Actions',Minus),ui('Edit','Actions',Edit3),ui('Pencil','Actions',Pencil),ui('Delete','Actions',Trash2),ui('Copy','Actions',Copy,[],'copy'),ui('Download','Actions',Download,[],'download'),ui('Upload','Actions',Upload,[],'upload'),ui('Save','Actions',Save),ui('Share','Actions',Share2),ui('Refresh','Actions',RefreshCw,[],'refresh'),ui('Undo','Actions',Undo2),ui('Redo','Actions',Redo2),ui('Check','Actions',Check,[],'success'),ui('Close','Actions',X),ui('Move','Actions',Move),ui('Rotate','Actions',RotateCw,[],'spin'),ui('Sliders','Actions',SlidersHorizontal),ui('Filter','Actions',Filter),ui('List Filter','Actions',ListFilter),ui('Scissors','Actions',Scissors),ui('Clipboard','Actions',Clipboard),ui('Clipboard Check','Actions',ClipboardCheck),ui('Eraser','Actions',Eraser),ui('Brush','Actions',Brush),ui('Palette','Actions',Palette),ui('Paint Bucket','Actions',PaintBucket),ui('Pen Tool','Actions',PenTool),ui('Ruler','Actions',Ruler),ui('Mouse Pointer','Actions',MousePointer2),ui('Hand','Actions',Hand),ui('Grab','Actions',Grab),ui('Target','Actions',Target),ui('Crosshair','Actions',Crosshair)
]
const communication=[ui('Mail','Communication',Mail),ui('Message','Communication',MessageCircle),ui('Messages','Communication',MessagesSquare),ui('Phone','Communication',Phone),ui('Video Call','Communication',Video),ui('Notification Bell','Communication',Bell,[],'ring'),ui('Send','Communication',Send,[],'send'),ui('Inbox','Communication',Inbox),ui('At Sign','Communication',AtSign),ui('Contact','Communication',Contact),ui('Paperclip','Communication',Paperclip),ui('Archive','Communication',Archive)]
const security=[ui('User','User & Security',User),ui('Profile','User & Security',UserRound),ui('Account','User & Security',CircleUserRound),ui('Users','User & Security',Users),ui('Add User','User & Security',UserPlus),ui('Remove User','User & Security',UserMinus),ui('Settings','User & Security',Settings,[],'spin'),ui('Lock','User & Security',Lock,[],'lock'),ui('Unlock','User & Security',Unlock,[],'lock'),ui('Shield','User & Security',Shield),ui('Key','User & Security',KeyRound),ui('Login','User & Security',LogIn),ui('Logout','User & Security',LogOut),ui('Fingerprint','User & Security',Fingerprint),ui('Eye','User & Security',Eye),ui('Eye Off','User & Security',EyeOff)]
const media=[ui('Play','Media',Play),ui('Pause','Media',Pause),ui('Stop','Media',Square),ui('Volume','Media',Volume2,[],'waves'),ui('Mute','Media',VolumeX),ui('Music','Media',Music),ui('Camera','Media',Camera,[],'wiggle'),ui('Image','Media',Image),ui('Film','Media',Film),ui('Microphone','Media',Mic),ui('Headphones','Media',Headphones),ui('Radio','Media',Radio),ui('Podcast','Media',Podcast),ui('Airplay','Media',Airplay),ui('Aperture','Media',Aperture)]
const data=[ui('Bar Chart','Data',ChartBar),ui('Line Chart','Data',ChartLine),ui('Pie Chart','Data',PieChart),ui('Trending Up','Data',TrendingUp),ui('Trending Down','Data',TrendingDown),ui('Activity','Data',Activity,[],'pulse'),ui('Calendar','Data',Calendar),ui('Clock','Data',Clock),ui('Database','Data',Database),ui('Gauge','Data',Gauge),ui('Table','Data',Table2),ui('Sigma','Data',Sigma),ui('Binary','Data',Binary),ui('Network','Data',Network),ui('Wifi','Data',Wifi,[],'waves')]
const commerce=[ui('Shopping Cart','Commerce',ShoppingCart,[],'cart'),ui('Shopping Bag','Commerce',ShoppingBag),ui('Credit Card','Commerce',CreditCard),ui('Wallet','Commerce',Wallet),ui('Tag','Commerce',Tag),ui('Gift','Commerce',Gift,[],'bounce'),ui('Package','Commerce',Package),ui('Shipping','Commerce',Truck),ui('Receipt','Commerce',Receipt),ui('Store','Commerce',Store),ui('Price Badge','Commerce',BadgeDollarSign)]
const files=[ui('Folder','Files & Development',Folder),ui('Open Folder','Files & Development',FolderOpen),ui('File','Files & Development',File),ui('Text File','Files & Development',FileText),ui('Code File','Files & Development',FileCode2),ui('Code','Files & Development',Code2),ui('Terminal','Files & Development',Terminal),ui('Git Branch','Files & Development',GitBranch),ui('Git Commit','Files & Development',GitCommitHorizontal),ui('Git Merge','Files & Development',GitMerge),ui('Cloud','Files & Development',Cloud),ui('Server','Files & Development',Server),ui('Bug','Files & Development',Bug),ui('Braces','Files & Development',Braces),ui('CPU','Files & Development',Box),ui('Printer','Files & Development',Printer)]
const objects=[ui('Heart','Objects',Heart,['favorite'],'pulse'),ui('Star','Objects',Star,['favorite'],'burst'),ui('Bookmark','Objects',Bookmark,[],'bounce'),ui('Thumbs Up','Objects',ThumbsUp),ui('Smile','Objects',Smile),ui('Sparkles','Objects',Sparkles,[],'burst'),ui('Sun','Objects',Sun,['theme'],'theme'),ui('Moon','Objects',Moon,['theme'],'theme'),ui('Help','Objects',CircleHelp),ui('Info','Objects',Info),ui('Warning','Objects',CircleAlert),ui('Alert','Objects',CircleAlert),ui('Success','Objects',CircleCheck,[],'draw'),ui('Error','Objects',CircleX),ui('Loader','Objects',LoaderCircle,[],'spin'),ui('Zap','Objects',Zap),ui('Rocket','Objects',Rocket,[],'send'),ui('Plane','Objects',Plane),ui('Bike','Objects',Bike),ui('Coffee','Objects',Coffee),ui('Briefcase','Objects',BriefcaseBusiness),ui('Building','Objects',Building2),ui('Education','Objects',GraduationCap),ui('Fitness','Objects',Dumbbell),ui('Gamepad','Objects',Gamepad2),ui('QR Code','Objects',QrCode),ui('Scan','Objects',ScanLine),ui('Monitor','Objects',Monitor)]

export const iconRegistry:IconAsset[]=[...social,...developer,...brands,...navigation,...actions,...communication,...security,...media,...data,...commerce,...files,...objects]
export const iconGroups=['All Icons',...Array.from(new Set(iconRegistry.map(icon=>icon.group))),'Animated','3D / Dimensional','Favorites'] as const
export const getIcon=(slug?:string)=>iconRegistry.find(icon=>icon.slug===slug)
