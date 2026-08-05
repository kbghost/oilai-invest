import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import {
  LayoutDashboard, TrendingUp, ArrowDownCircle,
  Gift, User, LogOut, X, History, ArrowUpCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/dashboard',          label: 'Home',      icon: LayoutDashboard },
  { to: '/dashboard/invest',   label: 'Invest',    icon: TrendingUp },
  { to: '/dashboard/deposits', label: 'Deposits',  icon: ArrowDownCircle },
  { to: '/dashboard/referral', label: 'Referrals', icon: Gift },
  { to: '/dashboard/profile',  label: 'Profile',   icon: User },
]

export default function BottomNav() {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <>
      {/* ─── Floating Menu (withdrawals, history, logout) ─── */}
      {menuOpen && (
        <div
          style={{
            position:'fixed', inset:0, zIndex:55,
            background:'rgba(0,0,0,0.5)', backdropFilter:'blur(6px)',
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position:'absolute',
              bottom: 80,                    /* right above bottom-nav */
              left: '50%',
              transform: 'translateX(-50%)',
              width: 240,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              boxShadow: '0 -8px 40px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}
          >
            {/* Title */}
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.875rem 1rem',borderBottom:'1px solid var(--border)' }}>
              <p style={{ fontWeight:700, color:'var(--text-primary)', fontSize:14 }}>More Options</p>
              <button onClick={() => setMenuOpen(false)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex' }}><X size={18}/></button>
            </div>

            {/* Items */}
            {[
              { to:'/dashboard/withdrawals',  label:'Withdrawals', icon:ArrowUpCircle, color:'var(--red)' },
              { to:'/dashboard/transactions', label:'History',     icon:History,       color:'var(--blue)' },
            ].map(({ to, label, icon:Icon, color }) => (
              <Link
                key={to} to={to}
                onClick={() => setMenuOpen(false)}
                style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding:'0.875rem 1.25rem',
                  textDecoration:'none', color:'var(--text-primary)',
                  fontSize:14, fontWeight:600,
                  borderBottom:'1px solid var(--border)',
                  transition:'background 0.15s',
                }}
              >
                <div style={{ width:34,height:34,borderRadius:10,background:color+'12',border:`1px solid ${color}20`,display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <Icon size={16} color={color} />
                </div>
                {label}
              </Link>
            ))}

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                width:'100%', display:'flex', alignItems:'center', gap:12,
                padding:'0.875rem 1.25rem',
                background:'none', border:'none', cursor:'pointer',
                color:'var(--red)', fontSize:14, fontWeight:700,
                fontFamily:'inherit',
              }}
            >
              <div style={{ width:34,height:34,borderRadius:10,background:'rgba(255,92,122,0.1)',border:'1px solid rgba(255,92,122,0.2)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <LogOut size={16} color="var(--red)" />
              </div>
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* ─── Fixed Bottom Navigation Bar ─── */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(({ to, label, icon:Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) => 'bottom-nav-item' + (isActive ? ' active' : '')}
          >
            {({ isActive }) => (
              <>
                <div className="nav-icon-wrap">
                  <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
