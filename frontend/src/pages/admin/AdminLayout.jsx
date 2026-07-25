import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../../components/ui/ThemeToggle'
import AdminBottomNav from '../../components/layout/AdminBottomNav'
import { LayoutDashboard, Users, ArrowDownCircle, ArrowUpCircle, LogOut, Shield, Menu, X, ChevronRight, Zap } from 'lucide-react'

const navItems = [
  { to:'/admin',             label:'Dashboard',    icon:LayoutDashboard },
  { to:'/admin/users',       label:'Utilisateurs', icon:Users },
  { to:'/admin/deposits',    label:'Dépôts',       icon:ArrowDownCircle },
  { to:'/admin/withdrawals', label:'Retraits',     icon:ArrowUpCircle },
]

function SidebarContent({ mobile, setOpen }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div style={{ display:'flex',flexDirection:'column',height:'100%' }}>
      <div style={{ padding:'1.25rem 1.1rem',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:9 }}>
        <div style={{ width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#a78bfa,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center' }}><Shield size={16} color="#fff" /></div>
        <div><p style={{ fontFamily:'"Poppins",sans-serif',fontWeight:700,color:'var(--text-primary)',fontSize:'0.95rem',lineHeight:1 }}>Admin</p><p style={{ fontSize:10,color:'var(--text-muted)' }}>OilAI Invest</p></div>
      </div>
      <nav style={{ flex:1,padding:'0.7rem',display:'flex',flexDirection:'column',gap:2 }}>
        {navItems.map(({ to, label, icon:Icon }) => (
          <NavLink key={to} to={to} end={to==='/admin'} onClick={()=>mobile&&setOpen(false)} className={({isActive}) => 'nav-link'+(isActive?' active':'')}>
            {({ isActive }) => (<><Icon size={15} style={{ flexShrink:0,opacity:isActive?1:0.6 }} /><span>{label}</span>{isActive && <ChevronRight size={11} style={{ marginLeft:'auto',opacity:0.4 }} />}</>)}
          </NavLink>
        ))}
        <NavLink to="/dashboard" className="nav-link" style={{ marginTop:6,color:'var(--accent)' }} onClick={()=>mobile&&setOpen(false)}><Zap size={15} /> Dashboard user</NavLink>
      </nav>
      <div style={{ padding:'0.875rem',borderTop:'1px solid var(--border)' }}>
        <div style={{ marginBottom:8 }}><ThemeToggle /></div>
        <button onClick={()=>{ logout(); navigate('/') }} style={{ width:'100%',display:'flex',alignItems:'center',gap:7,padding:'0.55rem 0.75rem',borderRadius:11,background:'rgba(255,75,110,0.08)',border:'1px solid rgba(255,75,110,0.15)',color:'var(--red)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit' }}><LogOut size={13}/> Déconnexion</button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ minHeight:'100vh',background:'var(--bg-base)',display:'flex' }}>
      <aside className="sidebar" id="admin-sb" style={{ width:230,position:'fixed',top:0,bottom:0,left:0,zIndex:20,display:'none',flexDirection:'column' }}>
        <SidebarContent mobile={false} setOpen={setOpen} />
      </aside>
      {open && (
        <div style={{ position:'fixed',inset:0,zIndex:40 }}>
          <div style={{ position:'absolute',inset:0,background:'rgba(0,0,0,0.72)' }} onClick={()=>setOpen(false)} />
          <aside className="sidebar" style={{ position:'absolute',top:0,bottom:0,left:0,width:255,display:'flex',flexDirection:'column',zIndex:50 }}>
            <button onClick={()=>setOpen(false)} style={{ position:'absolute',top:12,right:12,background:'var(--bg-card2)',border:'1px solid var(--border)',borderRadius:8,padding:5,cursor:'pointer',color:'var(--text-secondary)',display:'flex' }}><X size={16}/></button>
            <SidebarContent mobile={true} setOpen={setOpen} />
          </aside>
        </div>
      )}
      <main id="admin-main" style={{ flex:1,minWidth:0,display:'flex',flexDirection:'column' }}>
        <div className="mobile-topbar-compact" id="admin-top">
          <div style={{ display:'flex',alignItems:'center',gap:8 }}><Shield size={15} color="#a78bfa" /><span style={{ fontFamily:'"Poppins",sans-serif',fontWeight:700,color:'var(--text-primary)',fontSize:'0.95rem' }}>Admin</span></div>
          <div style={{ display:'flex',gap:6 }}>
            <ThemeToggle compact />
            <button onClick={()=>setOpen(true)} style={{ width:34,height:34,borderRadius:9,background:'var(--bg-card2)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--text-secondary)' }}><Menu size={16}/></button>
          </div>
        </div>
        <div className="page-content-pad" style={{ flex:1 }}>
          <Outlet />
        </div>
      </main>
      <AdminBottomNav />
    </div>
  )
}
