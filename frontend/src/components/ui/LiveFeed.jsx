import { useState, useEffect } from 'react'
import { TrendingUp, ArrowDownCircle } from 'lucide-react'

// ─── Pool d'activités simulées (sans indexation de pays) ──────────────────────
const ACTIVITIES = [
  { type:'earn',    name:'Koffi A.',     amount:30.00,  plan:'Performance' },
  { type:'deposit', name:'Fatou D.',     amount:500,    plan:null },
  { type:'earn',    name:'Ibrahim S.',   amount:80.00,  plan:'Patrimoine' },
  { type:'earn',    name:'Adama K.',     amount:3.00,   plan:'Découverte' },
  { type:'deposit', name:'Marie C.',     amount:1000,   plan:null },
  { type:'earn',    name:'Moussa B.',    amount:11.25,  plan:'Standard' },
  { type:'deposit', name:'Afi T.',       amount:250,    plan:null },
  { type:'earn',    name:'Serge N.',     amount:250.00, plan:'VIP Exec' },
  { type:'earn',    name:'Aminata L.',   amount:30.00,  plan:'Performance' },
  { type:'deposit', name:'Jean-Paul M.', amount:2500,   plan:null },
  { type:'earn',    name:'Christelle R.',amount:3.00,   plan:'Découverte' },
  { type:'earn',    name:'Oumar D.',     amount:600.00, plan:'Club Privé' },
  { type:'deposit', name:'Adjoua K.',    amount:5000,   plan:null },
  { type:'earn',    name:'Éric F.',      amount:11.25,  plan:'Standard' },
  { type:'deposit', name:'Bénédicte A.', amount:500,    plan:null },
]

const MIN_INTERVAL = 4500
const MAX_INTERVAL = 9000

export default function LiveFeed() {
  const [notifications, setNotifications] = useState([])
  const [idx, setIdx] = useState(Math.floor(Math.random() * ACTIVITIES.length))

  const addNotif = () => {
    const activity = ACTIVITIES[idx % ACTIVITIES.length]
    const id = Date.now()
    setNotifications(prev => [...prev.slice(-2), { ...activity, id }])
    setIdx(i => i + 1)
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5200)
  }

  useEffect(() => {
    const first = setTimeout(addNotif, 3000)
    return () => clearTimeout(first)
  }, [])

  useEffect(() => {
    if (document.hidden) return
    const rand = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL)
    const timer = setTimeout(() => {
      if (!document.hidden) addNotif()
    }, rand)
    return () => clearTimeout(timer)
  }, [idx])

  return (
    <div style={{
      position:'fixed', bottom: 104, left: 16, zIndex: 48,
      display:'flex', flexDirection:'column', gap:10, pointerEvents:'none',
      maxWidth: 'calc(100vw - 32px)'
    }} id="live-feed-wrap">
{notifications.map(notif => (
        <div key={notif.id} className="notif-popup" style={{
          display:'flex', alignItems:'center', gap:12,
          padding:'0.8rem 1rem',
          background:'var(--bg-card)', border:'1px solid var(--border)',
          borderLeft:`3px solid ${notif.type==='earn'?'var(--green)':'var(--accent)'}`,
          borderRadius:16, boxShadow:'0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter:'blur(12px)', minWidth:240, maxWidth:300, pointerEvents:'auto'
        }}>
          <div style={{ width:36,height:36,borderRadius:11,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center', background: notif.type==='earn' ? 'rgba(45,212,191,0.12)' : 'var(--accent-glow)' }}>
            {notif.type==='earn' ? <TrendingUp size={17} color="var(--green)" /> : <ArrowDownCircle size={17} color="var(--accent)" />}
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:12.5, fontWeight:700, color:'var(--text-primary)', marginBottom:2 }}>
              {notif.type==='earn'
                ? <><span style={{ color:'var(--green)' }}>+${notif.amount.toFixed(2)}</span> gagné</>
                : <><span style={{ color:'var(--accent)' }}>${notif.amount.toLocaleString()}</span> déposé</>}
            </p>
            <p style={{ fontSize:11, color:'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {notif.name}{notif.plan && <> · Plan <span style={{ color:'var(--text-primary)', fontWeight:600 }}>{notif.plan}</span></>}
            </p>
          </div>
          <div style={{ position:'relative', width:8, height:8, flexShrink:0 }}>
            <div style={{ position:'absolute', inset:0, borderRadius:'50%', background: notif.type==='earn' ? 'var(--green)' : 'var(--accent)', animation:'pulseRing 1.2s ease-out infinite' }} />
            <div style={{ position:'absolute', inset:2, borderRadius:'50%', background: notif.type==='earn' ? 'var(--green)' : 'var(--accent)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
