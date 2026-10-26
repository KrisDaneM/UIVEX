import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/ui/AppShell'
import '../styles/pages.css'
import '../styles/mobile-fixes.css'
import '../styles/theme-consistency.css'
import '../styles/chrome-system.css'
const Home=lazy(()=>import('../pages/HomePage'));const Explore=lazy(()=>import('../pages/ExplorePage'));const Detail=lazy(()=>import('../pages/DetailPage'));const Playground=lazy(()=>import('../pages/PlaygroundPage'));const Workspace=lazy(()=>import('../pages/WorkspacePage'));const Guide=lazy(()=>import('../pages/GuidePage'));const About=lazy(()=>import('../pages/AboutPage'));const Changelog=lazy(()=>import('../pages/ChangelogPage'));const NotFound=lazy(()=>import('../pages/NotFoundPage'))
export function App(){return <Routes><Route element={<AppShell/>}><Route index element={<Home/>}/><Route path="explore" element={<Explore/>}/><Route path="components/:slug" element={<Detail/>}/><Route path="playground/:slug?" element={<Playground/>}/><Route path="collections/*" element={<Navigate to="/explore" replace/>}/><Route path="workspace" element={<Workspace/>}/><Route path="guide" element={<Guide/>}/><Route path="about" element={<About/>}/><Route path="changelog" element={<Changelog/>}/><Route path="*" element={<NotFound/>}/></Route></Routes>}
