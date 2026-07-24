// TrustBadges.jsx
import { Shield, Lock, Award, Globe, Clock, CheckCircle } from 'lucide-react'

const BADGES = [
  { icon: Shield,       label: 'Sécurité AES-256',    desc: 'Chiffrement bancaire',      color: 'var(--blue)' },
  { icon: Lock,         label: 'SSL Certifié',         desc: 'Connexion sécurisée',       color: 'var(--green)' },
  { icon: Award,        label: 'Plateforme #1',        desc: 'Afrique de l\'Ouest',       color: 'var(--accent)' },
  { icon: Globe,        label: '70+ Pays',             desc: 'Couverture mondiale',        color: '#a78bfa' },
  { icon: Clock,        label: 'Profits 24/7',         desc: 'IA active en permanence',   color: 'var(--accent)' },
  { icon: CheckCircle,  label: 'Retraits Garantis',   desc: 'Sous 24-48h ouvrées',        color: 'var(--green)' },
]

export function TrustBadges() {
  return (
    <section style={{ padding: '4rem 2rem', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }} className="reveal">
          🛡️ Plateforme de confiance
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

// LiveTicker.jsx — Bandeau défilant d'activité
const TICKER_ITEMS = [
  '🟢 Kofi vient de gagner +$47.50',
  '📈 Prix WTI : $81.42 ↑ +1.82%',
  '🔵 Fatou a déposé $500 en Bitcoin',
  '🤖 IA Signal : STRONG BUY — Confiance 87%',
  '🟢 Ibrahim vient de gagner +$112.30',
  '💰 18 432 investisseurs actifs en ce moment',
  '📊 ROI moyen du jour : +2.8%',
  '✅ Serge a retiré $315 avec succès',
  '🛢️ OPEC+ maintient ses réductions de production',
  '⚡ Adjoua vient de rejoindre OilAI',
  '💹 Profit total généré aujourd\'hui : $48 320',
  '🟢 Jean a déposé $2 000 en USDT',
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
