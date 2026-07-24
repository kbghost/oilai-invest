import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Save, User, Mail, Phone, Globe, Sun, Moon, LogOut } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const { toggle, isDark }           = useTheme()
  const navigate                     = useNavigate()

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    phone:     user?.phone     || '',
    country:   user?.country   || '',
  })
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const save = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.patch('/users/profile', form)
      updateUser(data.user)
      toast.success('Profil mis à jour !')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    } finally { setLoading(false) }
  }

  const handleLogout = () => {
    logout()
    toast.success('Déconnecté avec succès')
    navigate('/')
  }

  return (
    <div className="dash-enter" style={{ maxWidth:520, margin:'0 auto', display:'flex', flexDirection:'column', gap:'1rem' }}>

      {/* En-tête */}
      <div>
        <h1 style={{ fontFamily:'"Clash Display",sans-serif', fontSize:'1.5rem', fontWeight:700, color:'var(--text-primary)', marginBottom:3 }}>Mon Profil</h1>
        <p style={{ color:'var(--text-secondary)', fontSize:13 }}>Gérez vos informations</p>
      </div>

      {/* Avatar + infos */}
      <div className="float-card shine-card" style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
        <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,var(--accent),var(--accent-dark))', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Clash Display",sans-serif', fontWeight:700, fontSize:'1.3rem', color:'#fff', flexShrink:0, boxShadow:'0 6px 20px var(--accent-glow)' }}>
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontFamily:'"Clash Display",sans-serif', fontSize:'1.05rem', fontWeight:700, color:'var(--text-primary)', marginBottom:2 }}>{user?.firstName} {user?.lastName}</p>
          <p style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</p>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            <span className="badge-active" style={{ textTransform:'capitalize' }}>{user?.role === 'admin' ? 'Admin' : 'Investisseur'}</span>
            {user?.isVerified && <span className="badge-approved">Vérifié</span>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.6rem' }}>
        {[
          { label:'Solde',   value:'$'+(user?.balance||0).toFixed(2) },
          { label:'Investi', value:'$'+(user?.totalInvested||0).toFixed(2) },
          { label:'Gains',   value:'$'+(user?.totalEarnings||0).toFixed(2) },
        ].map(({ label, value }) => (
          <div key={label} style={{ padding:'0.75rem 0.5rem', background:'var(--bg-card2)', border:'1px solid var(--border)', borderRadius:12, textAlign:'center' }}>
            <p className="dash-stat-value" style={{ color:'var(--accent)', fontSize:'0.9rem', marginBottom:2 }}>{value}</p>
            <p style={{ fontSize:10, color:'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Thème */}
      <div className="card">
        <p style={{ fontWeight:700, color:'var(--text-primary)', marginBottom:'0.875rem', fontSize:'0.9rem' }}>Apparence</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.75rem 0.875rem', background:'var(--bg-card2)', borderRadius:12, border:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            {isDark ? <Moon size={16} color="var(--accent)"/> : <Sun size={16} color="var(--accent)"/>}
            <div>
              <p style={{ fontWeight:600, color:'var(--text-primary)', fontSize:13 }}>{isDark ? 'Mode sombre' : 'Mode clair'}</p>
              <p style={{ fontSize:11, color:'var(--text-muted)' }}>Touchez pour changer</p>
            </div>
          </div>
          <button onClick={toggle} style={{ width:48, height:26, borderRadius:999, background:isDark?'var(--accent)':'var(--bg-card)', border:'2px solid '+(isDark?'var(--accent-dark)':'var(--border)'), cursor:'pointer', position:'relative', transition:'all 0.3s', flexShrink:0 }}>
            <div style={{ position:'absolute', top:1, left:isDark?'calc(100% - 20px)':1, width:18, height:18, borderRadius:'50%', background:isDark?'#fff':'var(--accent)', transition:'all 0.3s' }} />
          </button>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={save} className="card" style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
        <p style={{ fontWeight:700, color:'var(--text-primary)', fontSize:'0.9rem' }}>Informations personnelles</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
          <div>
            <label className="label"><User size={10} style={{ display:'inline', marginRight:3 }}/>Prénom</label>
            <input name="firstName" value={form.firstName} onChange={handle} className="input"/>
          </div>
          <div>
            <label className="label"><User size={10} style={{ display:'inline', marginRight:3 }}/>Nom</label>
            <input name="lastName" value={form.lastName} onChange={handle} className="input"/>
          </div>
        </div>
        <div>
          <label className="label"><Mail size={10} style={{ display:'inline', marginRight:3 }}/>Email</label>
          <input value={user?.email} disabled className="input" style={{ opacity:0.5, cursor:'not-allowed' }}/>
        </div>
        <div>
          <label className="label"><Phone size={10} style={{ display:'inline', marginRight:3 }}/>Téléphone</label>
          <input name="phone" value={form.phone} onChange={handle} className="input" placeholder="+xxx..."/>
        </div>
        <div>
          <label className="label"><Globe size={10} style={{ display:'inline', marginRight:3 }}/>Pays</label>
          <input name="country" value={form.country} onChange={handle} className="input" placeholder="Votre pays"/>
        </div>
        <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', justifyContent:'center' }}>
          {loading
            ? <div style={{ width:17, height:17, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
            : <><Save size={14}/> Enregistrer</>}
        </button>
      </form>

      {/* ═══ DÉCONNEXION MOBILE — toujours visible ═══ */}
      <div className="card" style={{ border:'1.5px solid rgba(255,92,122,0.2)' }}>
        <p style={{ fontWeight:700, color:'var(--text-primary)', marginBottom:'0.875rem', fontSize:'0.9rem' }}>Session</p>
        <button
          onClick={handleLogout}
          style={{
            width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            padding:'0.9rem 1rem',
            borderRadius:14, background:'rgba(255,92,122,0.08)',
            border:'1.5px solid rgba(255,92,122,0.25)',
            color:'var(--red)', fontSize:14, fontWeight:700,
            cursor:'pointer', fontFamily:'inherit',
            transition:'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,92,122,0.16)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(255,92,122,0.08)'}
        >
          <LogOut size={18}/>
          Se déconnecter
        </button>
      </div>

    </div>
  )
}
