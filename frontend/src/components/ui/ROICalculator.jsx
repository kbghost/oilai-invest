import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, TrendingUp, ArrowRight, Zap } from 'lucide-react'

const PLANS = {
  bronze:   { name: 'Bronze',    price: 15,   roi: 5,  days: 30,  color: 'var(--text-muted)' },
  silver:   { name: 'Silver',    price: 30,   roi: 8,  days: 45,  color: 'var(--blue)' },
  gold:     { name: 'Gold',      price: 50,   roi: 10, days: 60,  color: '#eab308' },
  platinum: { name: 'Platinum',  price: 100,  roi: 12, days: 90,  color: '#94a3b8' },
  vip_exec: { name: 'VIP Exec',  price: 500,  roi: 15, days: 120, color: 'var(--accent)' },
  king:     { name: 'King',      price: 1000, roi: 20, days: 180, color: 'var(--green)' },
}

export default function ROICalculator() {
  const [plan, setPlan] = useState('gold')
  const [result, setResult] = useState(null)

  const planData = PLANS[plan]

  useEffect(() => {
    const dailyProfit = planData.price * planData.roi / 100
    const totalProfit = dailyProfit * planData.days
    const total = planData.price + totalProfit
    setResult({ dailyProfit, totalProfit, total, roi: (totalProfit / planData.price * 100) })
  }, [plan, planData])

  const speakText = result
    ? `If you invest $${planData.price} in the ${planData.name} plan, you will earn $${result.dailyProfit.toFixed(2)} every day. Over ${planData.days} days, your total profit will be $${result.totalProfit.toFixed(2)}, for a final capital of $${result.total.toFixed(2)}. Join OilAI Invest now!`
    : ''

  return (
    <div className="card reveal" style={{ border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
      {/* Glow bg */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'var(--accent-glow)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ width: 42, height: 42, borderRadius: 13, background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px var(--accent-glow)', flexShrink: 0 }}>
          <Calculator size={20} color="#fff" />
        </div>
        <div>
          <h3 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: 2 }}>
            AI Profit Calculator
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Simulate your returns in real time</p>
        </div>
      </div>

      {/* Plan selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: '1.5rem' }}>
        {Object.entries(PLANS).map(([key, p]) => (
          <button key={key} onClick={() => setPlan(key)}
            style={{
              padding: '0.75rem', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit',
              fontWeight: 700, fontSize: 13, transition: 'all 0.2s', border: '1.5px solid',
              borderColor: plan === key ? p.color : 'var(--border)',
              background: plan === key ? p.color + '15' : 'var(--bg-card2)',
              color: plan === key ? p.color : 'var(--text-muted)',
            }}>
            {p.name}<br />
            <span style={{ fontSize: 11, fontWeight: 400 }}>{p.roi}%/day</span>
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '1.25rem', padding:'1rem', background:'var(--bg-card2)', borderRadius:12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount Invested</span>
          <span style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.1rem' }}>${planData.price.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan Duration</span>
          <span style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{planData.days} days</span>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: '1.25rem' }}>
          {[
            { label: 'Daily Profit',             value: `+$${result.dailyProfit.toFixed(2)}`, color: 'var(--green)' },
            { label: `Profit / ${planData.days}d`, value: `+$${result.totalProfit.toFixed(0)}`, color: planData.color },
            { label: 'Final Capital',              value: `$${result.total.toFixed(0)}`,        color: 'var(--text-primary)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: '0.875rem', background: 'var(--bg-card2)', borderRadius: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
              <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, color, fontSize: '1rem' }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ROI badge */}
      {result && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.75rem', background: 'rgba(0,212,160,0.06)', border: '1px solid rgba(0,212,160,0.15)', borderRadius: 12, marginBottom: '1.25rem' }}>
          <Zap size={15} color="var(--green)" />
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Return of <span style={{ fontWeight: 700, color: 'var(--green)' }}>{result.roi.toFixed(1)}%</span> over {planData.days} days.
          </p>
        </div>
      )}

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a href="#plans" style={{
          flex: 1, minWidth: 140, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          gap: 6, padding: '0.8rem 1.2rem', borderRadius: 14, fontWeight: 700, fontSize: 14,
          background: 'var(--bg-card2)', border: '1.5px solid var(--accent)', color: 'var(--accent)', textDecoration: 'none', transition: 'all 0.2s'
        }}>
          View Our Plans <ArrowRight size={16} />
        </a>
        <Link to="/register" style={{
          flex: 1, minWidth: 140, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          gap: 6, padding: '0.8rem 1.2rem', borderRadius: 14, fontWeight: 700, fontSize: 14,
          background: 'var(--bg-card2)', border: '1.5px solid var(--accent)', color: 'var(--accent)',
          textDecoration: 'none', transition: 'all 0.2s'
        }}>
          Invest Now <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
