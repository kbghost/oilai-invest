import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import ThemeToggle from '../ui/ThemeToggle'
import BottomNav from './BottomNav'
import {
  LayoutDashboard, TrendingUp, ArrowDownCircle, ArrowUpCircle,
  History, User, LogOut, Menu, X, Zap, Shield, ChevronRight, Bell, Gift
} from 'lucide-react'

const navItems = [
  { to:'/dashboard',              label:'Dashboard',   icon:LayoutDashboard },
  { to:'/dashboard/invest',       label:'Invest',      icon:TrendingUp },
  { to:'/dashboard/deposits',     label:'Deposits',    icon:ArrowDownCircle },
  { to:'/dashboard/withdrawals',  label:'Withdrawals', icon:ArrowUpCircle },
  { to:'/dashboard/transactions', label:'History',     icon:History },
  { to:'/dashboard/profile',      label:'Profile',     icon:User },
  { to:'/dashboard/referral',     label:'Referrals',   icon:Gift },
]

function SidebarContent({ mobile, setOpen }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Logo */}
      <div style={{ padding:'1.375rem 1.25rem', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36,height:36,borderRadius:11,background:'linear-gradient(135deg,var(--accent),var(--accent-dark))',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px var(--accent-glow)',flexShrink:0 }}>
            <Zap size={17} color="#fff" />
          </div>
          <div>
            <p style={{ fontFamily:'"Poppins",sans-serif',fontWeight:700,fontSize:'1rem',color:'var(--text-primary)',lineHeight:1 }}>OilAI Invest</p>
            <p style={{ fontSize:10,color:'var(--text-muted)',marginTop:2 }}>AI Investment · Global Platform</p>
          </div>
        </div>
      </div>

      {/* Balance pill */}
      <div style={{ margin:'0.875rem',padding:'1rem',background:'linear-gradient(135deg,rgba(245,166,35,0.18),rgba(245,166,35,0.06))',border:'1px solid rgba(245,166,35,0.25)',borderRadius:16 }}>
        <p style={{ fontSize:10,color:'rgba(245,166,35,0.7)',marginBottom:3,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:700 }}>Available Balance</p>
        <p style={{ fontFamily:'"Poppins",sans-serif',fontSize:'1.35rem',fontWeight:800,color:'var(--accent)' }}>
          ${(user?.balance||0).toLocaleString('en-US',{minimumFractionDigits:2, maximumFractionDigits:2})}
        </p>
      </div>

      {/* Nav links */}
      <nav style={{ flex:1,padding:'0 0.75rem',display:'flex',flexDirection:'column',gap:2 }}>
        {navItems.map(({ to, label, icon:Icon }) => (
          <NavLink key={to} to={to} end={to==='/dashboard'}
            onClick={() => mobile && setOpen(false)}
            className={({ isActive }) => 'nav-link'+(isActive?' active':'')}>
            {({ isActive }) => (<>
              <Icon size={17} style={{ flexShrink:0,opacity:isActive?1:0.6 }} />
              <span>{label}</span>
              {isActive && <ChevronRight size={12} style={{ marginLeft:'auto',opacity:0.4 }} />}
            </>)}
          </NavLink>
        ))}
      </nav>

      {/* Admin */}
      {user?.role==='admin' && (
        <div style={{ padding:'0 0.75rem 0.5rem' }}>
          <NavLink to="/admin" className="nav-link" onClick={() => mobile && setOpen(false)} style={{ color:'#a78bfa',background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.15)' }}>
            <Shield size={16} /> Admin Panel
          </NavLink>
        </div>
      )}

      {/* Bottom: theme + user */}
      <div style={{ padding:'0.875rem',borderTop:'1px solid var(--border)' }}>
        <div style={{ marginBottom:10 }}><ThemeToggle /></div>
        <div style={{ display:'flex',alignItems:'center',gap:10,padding:'0.5rem',borderRadius:12,marginBottom:8,background:'var(--bg-card2)',border:'1px solid var(--border)' }}>
          <div style={{ width:32,height:32,borderRadius:10,background:'linear-gradient(135deg,var(--accent),var(--accent-dark))',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:12,flexShrink:0 }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div style={{ minWidth:0,flex:1 }}>
            <p style={{ fontSize:13,fontWeight:600,color:'var(--text-primary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{user?.firstName} {user?.lastName}</p>
            <p style={{ fontSize:10,color:'var(--text-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={()=>{ logout(); navigate('/') }} style={{ width:'100%',display:'flex',alignItems:'center',gap:8,padding:'0.6rem 0.875rem',borderRadius:12,background:'rgba(255,75,110,0.08)',border:'1px solid rgba(255,75,110,0.15)',color:'var(--red)',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit' }}>
          <LogOut size={14} /> Log Out
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div style={{ minHeight:'100vh',background:'var(--bg-base)',display:'flex' }}>

      {/* ── Desktop Sidebar (≥1024px) ── */}
      <aside className="sidebar" id="desktop-sb" style={{ width:252,position:'fixed',top:0,bottom:0,left:0,zIndex:20,overflowY:'auto',display:'none',flexDirection:'column' }}>
        <SidebarContent mobile={false} setOpen={setOpen} />
      </aside>

      {/* ── Mobile Drawer ── */}
      {open && (
        <div style={{ position:'fixed',inset:0,zIndex:40 }}>
          <div style={{ position:'absolute',inset:0,background:'rgba(0,0,0,0.72)',backdropFilter:'blur(6px)' }} onClick={()=>setOpen(false)} />
          <aside className="sidebar" style={{ position:'absolute',top:0,bottom:0,left:0,width:275,display:'flex',flexDirection:'column',zIndex:50,overflowY:'auto' }}>
            <button onClick={()=>setOpen(false)} style={{ position:'absolute',top:14,right:14,background:'var(--bg-card2)',border:'1px solid var(--border)',borderRadius:8,padding:5,cursor:'pointer',color:'var(--text-secondary)',display:'flex' }}>
              <X size={17} />
            </button>
            <SidebarContent mobile={true} setOpen={setOpen} />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <main id="dash-main" style={{ flex:1,minWidth:0,minHeight:'100vh',display:'flex',flexDirection:'column' }}>

        {/* Mobile topbar */}
        <div className="mobile-topbar-compact" id="mob-top">
          <div style={{ display:'flex',alignItems:'center',gap:9 }}>
            <div style={{ width:30,height:30,borderRadius:9,background:'linear-gradient(135deg,var(--accent),var(--accent-dark))',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Zap size={14} color="#fff" />
            </div>
            <div>
              <span style={{ fontFamily:'"Poppins",sans-serif',fontWeight:700,fontSize:'0.95rem',color:'var(--text-primary)' }}>OilAI</span>
              <span style={{ color:'var(--accent)',fontFamily:'"Poppins",sans-serif',fontWeight:700,fontSize:'0.95rem' }}> Invest</span>
            </div>
          </div>
          <div style={{ display:'flex',gap:6 }}>
            <ThemeToggle compact />
            <button onClick={()=>setOpen(true)} style={{ width:36,height:36,borderRadius:10,background:'var(--bg-card2)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--text-secondary)' }}>
              <Menu size={17} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="page-content-pad" style={{ flex:1 }}>
          <Outlet />
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <BottomNav />
    </div>
  )
}
