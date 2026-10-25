import { ArrowLeft, Compass } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
export default function NotFoundPage(){const nav=useNavigate();return <div className="page container not-found"><span>404 / OFF THE GRID</span><Compass/><h1>This route isn’t in the system.</h1><p>The link may be outdated, but the component index is close by.</p><div><button className="btn" onClick={()=>nav(-1)}><ArrowLeft/> Go back</button><Link className="btn btn-primary" to="/explore">Explore components</Link></div></div>}
