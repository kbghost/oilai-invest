import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, TrendingUp, ArrowRight, Zap } from 'lucide-react'
import SpeakButton from './SpeakButton'

const PLANS = {
  starter: { name: 'Starter', roi: 1.5, min: 100, max: 999, color: 'var(--blue)' },
  pro:     { name: 'Pro',     roi: 2.5, min: 1000, max: 4999, color: 'var(--accent)' },
  premium: { name: 'Premium', roi: 3.5, min: 5000, max: 50000, color: 'var(--green)' },
}

export default function ROICalculator() {
  const [plan, setPlan]     = useState('pro')
  const [amount, setAmount] = useState(1000)
  const [days, setDays]     = useState(30)
  const [result, setResult] = useState(null)

  const planData = PLANS[plan]

  useEffect(() => {
    const clampedAmount = Math.max(planData.min, Math.min(planData.max, amount))
    const dailyProfit = clampedAmount * planData.roi / 100
    const totalProfit = dailyProfit * days
    const total = clampedAmount + totalProfit
    setResult({ dailyProfit, totalProfit, total, roi: (totalProfit / clampedAmount * 100) })
  }, [plan, amount, days])

  const speakText = result
    ? `Si vous investissez ${amount.toLocaleString()} dollars dans le plan ${planData.name}, vous gagnerez ${result.dailyProfit.toFixed(2)} dollars chaque jour. Sur ${days} jours, votre gain total sera de ${result.totalProfit.toFixed(2)} dollars, pour un capital final de ${result.total.toFixed(2)} dollars. Rejoignez OilAI Invest dès maintenant !`
    : ''

  const trackPct = plan === 'starter'
    ? ((amount - 100) / 899 * 100)
    : plan === 'pro'
    ? ((amount - 1000) / 3999 * 100)
    : ((amount - 5000) / 45000 * 100)

  return (
    <div className="card reveal" style={{ border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
      {/* Glow bg */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'var(--accent-glow)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ width: 42, height: 42, borderRadius: 13, background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px var(--accent-glow)', flexShrink: 0 }}>
          <Calculator size={20} color="#fff" />
        </div>
        <div>
          <h3 style={{ fontFamily: '"Clash Display", sans-serif', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: 2 }}>
            Calculateur de Gains IA
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Simulez vos profits en temps réel</p>
        </div>
      </div>

      {/* Plan selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: '1.5rem' }}>
        {Object.entries(PLANS).map(([key, p]) => (
          <button key={key} onClick={() => { setPlan(key); setAmount(p.min) }}
            style={{
              padding: '0.75rem', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit',
              fontWeight: 700, fontSize: 13, transition: 'all 0.2s', border: '1.5px solid',
              borderColor: plan === key ? p.color : 'var(--border)',
              background: plan === key ? p.color + '15' : 'var(--bg-card2)',
              color: plan === key ? p.color : 'var(--text-muted)',
            }}>
            {p.name}<br />
            <span style={{ fontSize: 11, fontWeight: 400 }}>{p.roi}%/j</span>
          </button>
        ))}
      </div>

      {/* Amount slider */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Montant investi</span>
          <span style={{ fontFamily: '"Clash Display", sans-serif', fontWeight: 700, color: 'var(--accent)', fontSize: '1.1rem' }}>${amount.toLocaleString('fr-FR')}</span>
        </div>
        <input
          type="range"
          min={planData.min}
          max={planData.max}
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          style={{ '--track-pct': trackPct + '%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
          <span>Min: ${planData.min.toLocaleString()}</span>
          <span>Max: ${planData.max.toLocaleString()}</span>
        </div>
      </div>

      {/* Duration slider */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Durée</span>
          <span style={{ fontFamily: '"Clash Display", sans-serif', fontWeight: 700, color: 'var(--accent)', fontSize: '1.1rem' }}>{days} jours</span>
        </div>
        <input
          type="range"
          min={7}
          max={90}
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          style={{ '--track-pct': ((days - 7) / 83 * 100) + '%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
          <span>7 jours</span>
          <span>90 jours</span>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: '1.25rem' }}>
          {[
            { label: 'Profit / jour', value: `+$${result.dailyProfit.toFixed(2)}`, color: 'var(--green)' },
            { label: `Profit / ${days}j`, value: `+$${result.totalProfit.toFixed(0)}`, color: planData.color },
            { label: 'Capital final', value: `$${result.total.toFixed(0)}`, color: 'var(--text-primary)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: '0.875rem', background: 'var(--bg-card2)', borderRadius: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
              <p style={{ fontFamily: '"Clash Display", sans-serif', fontWeight: 700, color, fontSize: '1rem' }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ROI badge */}
      {result && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.75rem', background: 'rgba(0,212,160,0.06)', border: '1px solid rgba(0,212,160,0.15)', borderRadius: 12, marginBottom: '1.25rem' }}>
          <Zap size={15} color="var(--green)" />
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Rendement de <span style={{ fontWeight: 700, color: 'var(--green)' }}>{result.roi.toFixed(1)}%</span> sur {days} jours grâce à l'IA pétrolière OilAI
          </p>
        </div>
      )}

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <SpeakButton text={speakText} variant="primary" style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}>
          Entendre mes gains
        </SpeakButton>
        <Link to="/register" style={{
          flex: 1, minWidth: 140, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          gap: 6, padding: '0.8rem 1.2rem', borderRadius: 14, fontWeight: 700, fontSize: 14,
          background: 'var(--bg-card2)', border: '1.5px solid var(--accent)', color: 'var(--accent)',
          textDecoration: 'none', transition: 'all 0.2s'
        }}>
          Investir maintenant <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
