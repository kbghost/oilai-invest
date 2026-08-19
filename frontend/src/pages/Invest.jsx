/**
 * Invest.jsx — Page d'investissement
 *
 * MODIFIER LES PLANS AFFICHÉS :
 *   Les plans viennent du backend (investmentController.js → PLANS)
 *   Le frontend les affiche dynamiquement via l'API.
 *
 * MODIFIER LE MINIMUM DE DÉPÔT AFFICHÉ :
 *   Automatique → minAmount dans PLANS côté backend
 */
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { investmentAPI } from '../services/api'
import ClaimButton from '../components/ui/ClaimButton'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import { TrendingUp, Zap, Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

const PLAN_COLORS = {
  decouverte:  { accent: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)' },
  standard:    { accent: 'var(--blue)', bg: 'rgba(59,142,255,0.08)', border: 'rgba(59,142,255,0.25)' },
  performance: { accent: '#eab308', bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.25)' },
  patrimoine:  { accent: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.25)' },
  vip_exec:    { accent: 'var(--accent)', bg: 'var(--accent-glow)', border: 'rgba(34,197,94,0.25)' },
  club_prive:  { accent: 'var(--green)', bg: 'rgba(45,212,191,0.08)', border: 'rgba(45,212,191,0.25)' },
}

export default function Invest() {
  const { user } = useAuth()
  const [plans, setPlans]             = useState({})
  const [investments, setInvestments] = useState([])
  const [selected, setSelected]       = useState(null)
  const [amount, setAmount]           = useState('')
  const [loading, setLoading]         = useState(false)
  const [expanded, setExpanded]       = useState({})

  const load = async () => {
    try {
      const [p, i] = await Promise.all([investmentAPI.getPlans(), investmentAPI.getAll()])
      setPlans(p.data.plans)
      setInvestments(i.data.investments)
    } catch { toast.error('Error loading plans') }
  }

  useEffect(() => { load() }, [])

  const activeInvs    = investments.filter(i => i.status === 'active')
  const completedInvs = investments.filter(i => i.status === 'completed')

  const handleInvest = async e => {
    e.preventDefault()
    if (!selected) return toast.error('Please choose a plan')
    const plan = plans[selected]
    if ((user?.balance || 0) < plan.price) return toast.error('Insufficient balance')
    setLoading(true)
    try {
      await investmentAPI.create({ plan: selected })
      toast.success('Investment started! Claim your earnings every 24 hours.')
      setSelected(null)
      await load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating investment')
    } finally { setLoading(false) }
  }

  return (
    <div className="dash-enter" style={{ maxWidth:720, margin:'0 auto', display:'flex', flexDirection:'column', gap:'1.25rem' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontFamily:'"Poppins",sans-serif', fontSize:'1.5rem', fontWeight:700, color:'var(--text-primary)', marginBottom:3 }}>Invest</h1>
        <p style={{ color:'var(--text-secondary)', fontSize:13 }}>
          Available Balance: <span style={{ fontWeight:700, color:'var(--accent)' }}>${(user?.balance || 0).toFixed(2)}</span>
        </p>
      </div>

      {/* ── Active Investments with Claim button ── */}
      {activeInvs.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
          <p className="dash-card-title" style={{ color:'var(--text-primary)' }}>
            My Active Plans ({activeInvs.length})
          </p>
          {activeInvs.map(inv => {
            const col = PLAN_COLORS[inv.plan] || PLAN_COLORS.starter
            const pct = Math.min((inv.daysCompleted / inv.durationDays) * 100, 100)
            return (
              <div key={inv._id} className="float-card" style={{ border:`1px solid ${col.border}` }}>
                {/* Header plan */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.875rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:11, background:col.bg, border:`1px solid ${col.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Zap size={17} color={col.accent} />
                    </div>
                    <div>
                      <p style={{ fontWeight:800, color:'var(--text-primary)', fontSize:14, textTransform:'capitalize' }}>{inv.plan}</p>
                      <p style={{ fontSize:11, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:3 }}>
                        <Clock size={10} /> {inv.daysCompleted}/{inv.durationDays} days
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontSize:12, color:'var(--text-muted)' }}>Capital</p>
                    <p style={{ fontWeight:800, color:'var(--text-primary)', fontSize:14 }}>${inv.amount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="progress-bar" style={{ marginBottom:'1rem' }}>
                  <div className="progress-fill" style={{ width:`${pct}%`, background:col.accent }} />
                </div>

                {/* Stats */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:'1rem' }}>
                  {[
                    { l:'Daily ROI',      v:`${inv.dailyROI}%`,            c:col.accent },
                    { l:'Total Earnings',v:`$${inv.totalEarned.toFixed(2)}`, c:'var(--green)' },
                    { l:'Pending',        v:`$${(inv.pendingProfit||0).toFixed(2)}`, c:'var(--text-primary)' },
                  ].map(({ l, v, c }) => (
                    <div key={l} style={{ padding:'0.6rem 0.5rem', background:'var(--bg-card2)', borderRadius:10, textAlign:'center' }}>
                      <p style={{ fontWeight:800, color:c, fontSize:13, marginBottom:1 }}>{v}</p>
                      <p style={{ fontSize:9, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em' }}>{l}</p>
                    </div>
                  ))}
                </div>

                {/* ═══ CLAIM BUTTON ═══ */}
                <ClaimButton investment={inv} onClaimed={load} />
                
                {/* ═══ PROFIT HISTORY ═══ */}
                {inv.profitHistory && inv.profitHistory.length > 0 && (
                  <div style={{ marginTop: '0.875rem' }}>
                    <button 
                      onClick={() => setExpanded(p => ({ ...p, [inv._id]: !p[inv._id] }))}
                      style={{ width:'100%', background:'transparent', border:'none', fontSize:12, color:'var(--text-secondary)', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4, padding:'0.5rem' }}
                    >
                      {expanded[inv._id] ? 'Hide earnings history' : 'View earnings history'}
                      {expanded[inv._id] ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    </button>
                    {expanded[inv._id] && (
                      <div style={{ marginTop: '0.5rem', maxHeight:150, overflowY:'auto', background:'var(--bg-card2)', borderRadius:10, padding:'0.5rem' }}>
                        {inv.profitHistory.map((h, i) => (
                          <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'0.4rem', borderBottom: i === inv.profitHistory.length - 1 ? 'none' : '1px solid var(--border)' }}>
                            <span style={{ fontSize:11, color:'var(--text-muted)' }}>{new Date(h.date).toLocaleDateString()} {new Date(h.date).toLocaleTimeString()}</span>
                            <span style={{ fontSize:12, fontWeight:700, color:'var(--green)' }}>+${h.profit.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Choose Plan Form ── */}
      <div className="float-card">
        <p className="dash-card-title" style={{ color:'var(--text-primary)', marginBottom:'1rem' }}>
          Choose a Plan
        </p>

        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {Object.entries(plans).map(([key, plan], idx) => {
            const isSelected = selected === key
            const col = PLAN_COLORS[key] || PLAN_COLORS.starter
            return (
              <div
                key={key}
                className={`dash-enter dash-enter-${idx+1}`}
                onClick={() => setSelected(isSelected ? null : key)}
                style={{
                  padding:'1rem 1.125rem',
                  background: isSelected ? col.bg : 'var(--bg-card2)',
                  border:`2px solid ${isSelected ? col.border : 'var(--border)'}`,
                  borderRadius:16, cursor:'pointer', transition:'all 0.2s',
                }}
              >
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <p style={{ fontFamily:'"Poppins",sans-serif', fontWeight:700, fontSize:'1rem', color:'var(--text-primary)', textTransform:'capitalize' }}>{plan.name}</p>
                      {key === 'pro' && <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', background:'var(--accent)', color:'#fff', borderRadius:999 }}>POPULAR</span>}
                    </div>
                    <p style={{ fontSize:22, fontWeight:900, color:col.accent, fontFamily:'"Poppins",sans-serif' }}>{plan.dailyROI}%<span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:400 }}>/day</span></p>
                    <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>
                      {plan.durationDays} days · Price: ${plan.price.toLocaleString()}
                    </p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>Total ROI</p>
                    <p style={{ fontWeight:800, color:col.accent, fontSize:18 }}>{plan.dailyROI * plan.durationDays}%</p>
                    {isSelected ? <ChevronUp size={16} color={col.accent} style={{ marginTop:6 }} /> : <ChevronDown size={16} color="var(--text-muted)" style={{ marginTop:6 }} />}
                  </div>
                </div>

                {isSelected && (
                  <div style={{ marginTop:'1rem', borderTop:'1px solid var(--border)', paddingTop:'1rem' }}>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:'1rem' }}>
                      {plan.features?.map(f => (
                        <div key={f} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--text-secondary)' }}>
                          <CheckCircle size={12} color="var(--green)" /> {f}
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleInvest}>
                      <div style={{ padding:'0.75rem', background:col.bg, borderRadius:10, marginBottom:'0.75rem', fontSize:12 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                          <span style={{ color:'var(--text-muted)' }}>Est. daily profit</span>
                          <span style={{ fontWeight:700, color:col.accent }}>+${(plan.price*plan.dailyROI/100).toFixed(2)}</span>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between' }}>
                          <span style={{ color:'var(--text-muted)' }}>Est. net total profit</span>
                          <span style={{ fontWeight:700, color:'var(--green)' }}>+${(plan.price*plan.dailyROI/100*plan.durationDays).toFixed(2)}</span>
                        </div>
                      </div>
                      <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', justifyContent:'center' }}
                        onClick={e=>e.stopPropagation()}>
                        {loading
                          ? <div style={{ width:17, height:17, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
                          : <><TrendingUp size={15}/> Invest ${plan.price}</>}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Completed Investments ── */}
      {completedInvs.length > 0 && (
        <div className="float-card">
          <p className="dash-card-title" style={{ color:'var(--text-primary)', marginBottom:'0.875rem' }}>Completed ({completedInvs.length})</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {completedInvs.map(inv => (
              <div key={inv._id} className="mobile-list-item">
                <div style={{ width:36, height:36, borderRadius:11, background:'rgba(45,212,191,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <CheckCircle size={17} color="var(--green)" />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, color:'var(--text-primary)', fontSize:13, textTransform:'capitalize' }}>{inv.plan}</p>
                  <p style={{ fontSize:11, color:'var(--text-muted)' }}>{inv.durationDays} days · ${inv.amount.toLocaleString()}</p>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <p style={{ fontWeight:800, color:'var(--green)', fontSize:13 }}>+${inv.totalEarned.toFixed(2)}</p>
                  <span className="badge-completed">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
