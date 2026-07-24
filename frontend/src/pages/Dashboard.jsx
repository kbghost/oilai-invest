import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { investmentAPI, oilAPI } from '../services/api'
import ImageSlider from '../components/ui/ImageSlider'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import LiveActivityFeed from '../components/ui/LiveActivityFeed'
import {
  TrendingUp, Zap, ArrowUpRight, ArrowDownRight,
  Clock, ChevronRight, ArrowDownCircle, ArrowUpCircle,
  History, Activity, ShieldCheck
} from 'lucide-react'

/* ── Tooltip recharts ── */
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:10,padding:'8px 12px',fontSize:12,boxShadow:'0 4px 16px rgba(0,0,0,0.12)' }}>
      <p style={{ color:'var(--text-muted)',marginBottom:2 }}>{label}</p>
      <p style={{ fontWeight:700,color:'var(--accent)' }}>${payload[0]?.value?.toFixed(2)}</p>
    </div>
  )
}

/* ── Simple floating stat card (no 3D tilt) ── */
function StatCard({ label, numValue, value, prefix='', suffix='', icon: Icon, color, delayClass }) {
  return (
    <div className={`float-card dash-enter ${delayClass}`}>
      <div style={{ position:'absolute',top:-16,right:-16,width:64,height:64,background:color+'14',borderRadius:'50%',filter:'blur(18px)',pointerEvents:'none' }} />
      <div style={{ width:36,height:36,borderRadius:11,background:color+'16',border:`1px solid ${color}28`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'0.75rem' }}>
        <Icon size={18} color={color} />
      </div>
      <p style={{ fontSize:10,color:'var(--text-muted)',marginBottom:3,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em' }}>{label}</p>
      <p className="dash-stat-value" style={{ color:'var(--text-primary)' }}>
        {numValue != null
          ? <><span style={{ fontSize:'0.78em',color:'var(--text-muted)',fontWeight:700 }}>{prefix}</span><AnimatedCounter value={numValue} duration={1500} decimals={2} />{suffix && <span style={{ fontSize:'0.78em',color:'var(--text-muted)',fontWeight:700 }}>{suffix}</span>}</>
          : value}
      </p>
    </div>
  )
}

/* ── Quick action button ── */
function QuickBtn({ to, icon: Icon, label, color }) {
  return (
    <Link to={to} className="quick-action-btn" style={{ textDecoration:'none' }}>
      <div style={{ width:36,height:36,borderRadius:12,background:color+'15',border:`1px solid ${color}30`,display:'flex',alignItems:'center',justifyContent:'center' }}>
        <Icon size={17} color={color} />
      </div>
      <span style={{ fontSize:10,fontWeight:700,color:'var(--text-secondary)' }}>{label}</span>
    </Link>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [investments, setInvestments] = useState([])
  const [oilData, setOilData]         = useState(null)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    Promise.all([investmentAPI.getAll(), oilAPI.getPrice()])
      .then(([inv, oil]) => {
        setInvestments(inv.data.investments)
        setOilData(oil.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const activeInvs    = investments.filter(i => i.status === 'active')
  const totalInvested = activeInvs.reduce((s, i) => s + i.amount, 0)
  const totalEarned   = investments.reduce((s, i) => s + i.totalEarned, 0)

  const chartData = (() => {
    const map = {}
    investments.forEach(inv => inv.profitHistory?.forEach(({ date, profit }) => {
      const d = new Date(date).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' })
      map[d] = (map[d] || 0) + profit
    }))
    return Object.entries(map).slice(-14).map(([date, profit]) => ({ date, profit }))
  })()

  if (loading) return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:400 }}>
      <div style={{ width:32,height:32,border:'2.5px solid var(--border)',borderTopColor:'var(--accent)',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div className="dash-section-gap" style={{ display:'flex',flexDirection:'column',gap:'1rem',maxWidth:1280,margin:'0 auto' }}>

      {/* ── Balance Hero ── */}
      <div className="dash-enter dash-enter-1" style={{ position:'relative' }}>
        <div className="balance-hero shine-card" style={{ boxShadow:'0 10px 32px -8px var(--accent-glow)' }}>
          <div style={{ position:'relative',zIndex:1 }}>
            <div style={{ display:'flex',alignItems:'center',gap:7,marginBottom:5 }}>
              <p style={{ fontSize:12,fontWeight:700,opacity:0.85,letterSpacing:'0.02em' }}>Bonjour, {user?.firstName}</p>
              <span style={{ display:'inline-flex',alignItems:'center',gap:4,fontSize:10,fontWeight:700,background:'rgba(255,255,255,0.18)',padding:'0.15rem 0.5rem',borderRadius:999 }}>
                <ShieldCheck size={11} /> Compte vérifié
              </span>
            </div>
            <p style={{ fontSize:12,opacity:0.75,marginBottom:'0.875rem' }}>Solde disponible sur votre portefeuille</p>
            <p className="dash-balance-amount" style={{ marginBottom:'1.1rem' }}>
              <AnimatedCounter value={user?.balance || 0} prefix="$" duration={1500} decimals={2} />
            </p>
            <div style={{ display:'flex',gap:8 }}>
              {[
                { to:'deposits',    icon:ArrowDownCircle, label:'Dépôt' },
                { to:'withdrawals', icon:ArrowUpCircle,   label:'Retrait' },
                { to:'invest',      icon:TrendingUp,      label:'Investir' },
              ].map(({ to, icon:Icon, label }) => (
                <Link key={to} to={to} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'0.55rem 0.25rem',background:'rgba(255,255,255,0.16)',borderRadius:12,backdropFilter:'blur(8px)',textDecoration:'none',color:'#fff',fontSize:10.5,fontWeight:700,border:'1px solid rgba(255,255,255,0.18)',transition:'background 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.26)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.16)'}>
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="stat-grid-mobile">
        <StatCard label="Total investi" numValue={totalInvested} prefix="$" icon={TrendingUp}  color="var(--blue)"   delayClass="dash-enter-2" />
        <StatCard label="Gains totaux"  numValue={totalEarned}   prefix="$" icon={Zap}          color="var(--green)"  delayClass="dash-enter-3" />
        <StatCard label="Plans actifs"  value={activeInvs.length}           icon={Activity}     color="var(--accent)" delayClass="dash-enter-4" />
        <StatCard label="Rendement"     value={activeInvs.length > 0 ? `${(totalEarned / Math.max(totalInvested,1) * 100).toFixed(1)}%` : '0%'} icon={ArrowUpRight} color="#a78bfa" delayClass="dash-enter-5" />
      </div>

      {/* ── Market overview + slider ── */}
      <div style={{ display:'grid',gap:'1rem' }} id="oil-slider-grid">
<div className="dash-enter dash-enter-2">
          <ImageSlider height="240px" showText={true} />
        </div>

        {oilData && (
          <div className="float-card dash-enter dash-enter-3" style={{ display:'flex',flexDirection:'column',gap:'0.75rem' }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
              <div>
                <p className="dash-card-title" style={{ color:'var(--text-primary)' }}>Marché Pétrole · WTI</p>
                <p style={{ fontSize:11,color:'var(--text-muted)' }}>Analyse IA en continu</p>
              </div>
              <div className="live-dot" />
            </div>

            <div style={{ display:'flex',alignItems:'flex-end',gap:8 }}>
              <p className="dash-stat-value" style={{ color:'var(--text-primary)',fontSize:'1.6rem' }}>${oilData.current.price}</p>
              <div style={{ display:'flex',alignItems:'center',gap:3,paddingBottom:3,fontSize:13,fontWeight:700,color:oilData.current.change>=0?'var(--green)':'var(--red)' }}>
                {oilData.current.change>=0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                {Math.abs(oilData.current.changePercent)}%
              </div>
            </div>

            <div style={{ display:'flex',alignItems:'flex-end',gap:2,height:40 }}>
              {oilData.history.slice(-20).map((d,i) => {
                const arr = oilData.history.slice(-20)
                const mn = Math.min(...arr.map(x=>x.price))
                const mx = Math.max(...arr.map(x=>x.price))
                const h = ((d.price-mn)/(mx-mn)*100)||20
                return <div key={i} style={{ flex:1,borderRadius:3,height:h+'%',background:'var(--accent)',opacity:0.25+i*0.035,transition:'height 0.3s' }} />
              })}
            </div>

            <div style={{ display:'flex',flexDirection:'column',gap:6,padding:'0.75rem',background:'var(--bg-card2)',borderRadius:12 }}>
              {[
                { l:'Signal IA', v:oilData.aiPrediction.signal, c:oilData.aiPrediction.signal.includes('BUY')?'var(--green)':'var(--red)' },
                { l:'Indice de confiance', v:oilData.aiPrediction.confidence+'%', c:'var(--accent)' },
              ].map(({ l,v,c }) => (
                <div key={l} style={{ display:'flex',justifyContent:'space-between',fontSize:12 }}>
                  <span style={{ color:'var(--text-muted)' }}>{l}</span>
                  <span style={{ fontWeight:700,color:c }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Chart + Active investments ── */}
      <div style={{ display:'grid',gap:'1rem' }} id="chart-inv-grid">
<div className="float-card dash-enter dash-enter-4">
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem' }}>
            <div>
              <p className="dash-card-title" style={{ color:'var(--text-primary)' }}>Évolution des profits</p>
              <p style={{ fontSize:11,color:'var(--text-muted)' }}>14 derniers jours</p>
            </div>
            <span style={{ fontSize:11,fontWeight:700,padding:'0.25rem 0.65rem',background:'rgba(45,212,191,0.12)',color:'var(--green)',border:'1px solid rgba(45,212,191,0.25)',borderRadius:999 }}>
              +{totalEarned>0 ? ((totalEarned/Math.max(totalInvested,1))*100).toFixed(1) : 0}%
            </span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="pG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill:'var(--text-muted)',fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'var(--text-muted)',fontSize:10 }} axisLine={false} tickLine={false} width={34} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="profit" stroke="var(--accent)" strokeWidth={2.25} fill="url(#pG)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:190,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'var(--text-muted)' }}>
              <TrendingUp size={28} style={{ opacity:0.3,marginBottom:8 }} />
              <p style={{ fontSize:12 }}>Aucun historique de profit pour l'instant</p>
              <Link to="invest" style={{ color:'var(--accent)',fontSize:12,marginTop:6,textDecoration:'none',fontWeight:700 }}>Démarrer un investissement →</Link>
            </div>
          )}
        </div>

        <div className="float-card dash-enter dash-enter-5">
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.875rem' }}>
            <p className="dash-card-title" style={{ color:'var(--text-primary)' }}>Plans actifs</p>
            <Link to="invest" style={{ fontSize:11,color:'var(--accent)',textDecoration:'none',fontWeight:700,display:'flex',alignItems:'center',gap:3 }}>
              Tout voir <ChevronRight size={12} />
            </Link>
          </div>

          {activeInvs.length === 0 ? (
            <div style={{ textAlign:'center',padding:'2.25rem 0' }}>
              <TrendingUp size={32} style={{ margin:'0 auto 10px',color:'var(--text-muted)',opacity:0.3 }} />
              <p style={{ color:'var(--text-muted)',fontSize:12,marginBottom:12 }}>Vous n'avez pas encore de plan actif</p>
              <Link to="invest" className="btn-primary" style={{ fontSize:12,padding:'0.6rem 1.25rem' }}>Découvrir les plans</Link>
            </div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {activeInvs.slice(0,3).map(inv => {
                const pct = Math.min((inv.daysCompleted/inv.durationDays)*100, 100)
                return (
                  <div key={inv._id} className="mobile-list-item">
                    <div style={{ width:36,height:36,borderRadius:11,background:'var(--accent-glow)',border:'1px solid var(--accent-glow)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      <Zap size={16} color="var(--accent)" />
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:3 }}>
                        <span style={{ fontWeight:700,color:'var(--text-primary)',fontSize:13,textTransform:'capitalize' }}>{inv.plan}</span>
                        <span style={{ fontWeight:700,color:'var(--green)',fontSize:12 }}>+${inv.totalEarned.toFixed(2)}</span>
                      </div>
                      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
                        <span style={{ fontSize:10,color:'var(--text-muted)',display:'flex',alignItems:'center',gap:3 }}>
                          <Clock size={10} /> {inv.daysCompleted}/{inv.durationDays} jours
                        </span>
                        <span style={{ fontSize:10,color:'var(--text-primary)',fontWeight:600 }}>${inv.amount.toLocaleString()}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width:pct+'%' }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="float-card dash-enter dash-enter-6">
        <p className="dash-card-title" style={{ color:'var(--text-primary)',marginBottom:'0.875rem' }}>Actions rapides</p>
        <div style={{ display:'flex',gap:8 }}>
          <QuickBtn to="deposits"     icon={ArrowDownCircle} label="Déposer"    color="var(--green)" />
          <QuickBtn to="withdrawals"  icon={ArrowUpCircle}   label="Retirer"    color="var(--red)" />
          <QuickBtn to="invest"       icon={TrendingUp}      label="Investir"   color="var(--accent)" />
          <QuickBtn to="transactions" icon={History}         label="Historique" color="var(--blue)" />
        </div>
      </div>

      {/* ── Activité en direct (dépôts & retraits temps réel) ── */}
      <LiveActivityFeed />

    </div>
  )
}
