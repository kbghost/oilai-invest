import { NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, Users, ArrowDownCircle, ArrowUpCircle, Zap } from 'lucide-react'

const ITEMS = [
  { to:'/admin',             label:'Dashboard',   icon:LayoutDashboard },
  { to:'/admin/users',       label:'Users',       icon:Users },
  null,
  { to:'/admin/deposits',    label:'Dépôts',      icon:ArrowDownCircle },
  { to:'/admin/withdrawals', label:'Retraits',    icon:ArrowUpCircle },
]

export default function AdminBottomNav() {
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item, i) => {
        if (!item) return (
          <div key="cta" style={{ display:'flex',alignItems:'center',justifyContent:'center',flex:1 }}>
            <Link to="/dashboard" className="bottom-nav-cta" style={{ background:'linear-gradient(135deg,#a78bfa,#7c3aed)' }}>
              <Zap size={20} color="#fff" />
            </Link>
          </div>
        )
        const Icon = item.icon
        return (
          <NavLink key={item.to} to={item.to} end={item.to==='/admin'} className={({isActive}) => 'bottom-nav-item'+(isActive?' active':'')}>
            {({ isActive }) => (<>
              <div className="nav-icon-wrap" style={{ background:isActive?'rgba(167,139,250,0.15)':'transparent' }}>
                <Icon size={18} strokeWidth={isActive?2.5:1.8} color={isActive?'#a78bfa':undefined} />
              </div>
              <span style={{ color:isActive?'#a78bfa':undefined }}>{item.label}</span>
            </>)}
          </NavLink>
        )
      })}
    </nav>
  )
}
