// TrustBadges.jsx
import { Shield, Lock, Award, Globe, Clock, CheckCircle } from 'lucide-react'

const BADGES = [
  { icon: Shield,       label: 'AES-256 Security',      desc: 'Bank-grade encryption',        color: 'var(--blue)' },
  { icon: Lock,         label: 'SSL Certified',          desc: 'Secure connection',             color: 'var(--green)' },
  { icon: Award,        label: '#1 Platform',            desc: 'West Africa',                   color: 'var(--accent)' },
  { icon: Globe,        label: '70+ Countries',          desc: 'Global coverage',               color: '#a78bfa' },
  { icon: Clock,        label: '24/7 Profits',           desc: 'AI always active',              color: 'var(--accent)' },
  { icon: CheckCircle,  label: 'Guaranteed Withdrawals', desc: 'Processed within 24-48h',       color: 'var(--green)' },
]

export function TrustBadges() {
  return (
    <section style={{ padding: '4rem 2rem', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }} className="reveal">
          🛡️ Trusted Platform
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          {BADGES.map((b, i) => (
            <div key={b.label} className={`trust-badge reveal stagger-${(i % 5) + 1}`}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.25rem 1rem', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 16, cursor: 'default' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: b.color + '15', border: '1px solid ' + b.color + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <b.icon size={20} color={b.color} />
              </div>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13, marginBottom: 4 }}>{b.label}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

// LiveTicker.jsx — Scrolling activity banner
const TICKER_ITEMS = [
  '🟢 Kofi just earned +$47.50',
  '📈 WTI Price: $81.42 ↑ +1.82%',
  '🔵 Fatou deposited $500 in Bitcoin',
  '🤖 AI Signal: STRONG BUY — Confidence 87%',
  '🟢 Ibrahim just earned +$112.30',
  '💰 Automated high-yield investments 24/7',
  '📊 Average daily ROI: +2.8%',
  '✅ Serge successfully withdrew $315',
  '🛢️ OPEC+ maintains production cuts',
  '⚡ Adjoua just joined OilAI',
  '💹 Total profits generated today: $48,320',
  '🟢 Jean deposited $2,000 in USDT',
]

export function LiveTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div style={{
      background: 'var(--bg-card2)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '0.625rem 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Fade edges */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, var(--bg-card2), transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, var(--bg-card2), transparent)', zIndex: 2, pointerEvents: 'none' }} />

      <div style={{
        display: 'flex',
        gap: 0,
        width: 'max-content',
        animation: 'tickerScroll 55s linear infinite',
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            padding: '0 2rem',
            borderRight: '1px solid var(--border)',
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
