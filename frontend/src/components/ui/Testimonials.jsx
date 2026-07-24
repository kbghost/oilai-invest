import AnimatedCounter from './AnimatedCounter'

const TESTIMONIALS = [
  {
    name: 'Kofi Mensah',
    role: 'Investisseur vérifié',
    plan: 'Plan Premium',
    earned: 4820,
    text: 'OilAI Invest a changé ma vie. En 3 mois, j\'ai gagné plus que mon salaire annuel. Les profits arrivent chaque jour sans que je fasse quoi que ce soit !',
    avatar: 'KM',
    color: 'var(--accent)',
    stars: 5,
  },
  {
    name: 'Fatou Diallo',
    role: 'Investisseuse vérifiée',
    plan: 'Plan Pro',
    earned: 1850,
    text: 'Au début j\'étais sceptique, mais après mon premier retrait crypto réussi, j\'ai doublé ma mise. Le support est réactif et tout est transparent.',
    avatar: 'FD',
    color: 'var(--blue)',
    stars: 5,
  },
  {
    name: 'Ibrahim Touré',
    role: 'Investisseur vérifié',
    plan: 'Plan Starter',
    earned: 520,
    text: 'J\'ai commencé avec seulement 200$ et en un mois j\'avais déjà gagné 130$ de profits. C\'est la meilleure plateforme d\'investissement que j\'ai testée en Afrique.',
    avatar: 'IT',
    color: 'var(--green)',
    stars: 5,
  },
  {
    name: 'Adjoua Koné',
    role: 'Investisseuse vérifiée',
    plan: 'Plan Premium',
    earned: 9400,
    text: 'Je recommande OilAI à toute ma famille. L\'IA prédit vraiment bien les marchés pétroliers. Mes revenus passifs ont explosé depuis que j\'ai rejoint la plateforme.',
    avatar: 'AK',
    color: '#a78bfa',
    stars: 5,
  },
]

export default function Testimonials() {
  return (
    <section style={{ padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="reveal">
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
          ⭐ Témoignages Vérifiés
        </p>
        <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
          Ce que disent nos{' '}
          <span className="gradient-text">investisseurs africains</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', fontSize: 14, lineHeight: 1.7 }}>
          Plus de 18 000 investisseurs nous font confiance chaque jour en Afrique de l'Ouest et au-delà.
        </p>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {TESTIMONIALS.map((t, i) => (
          <div key={t.name} className={`card testimonial-card reveal stagger-${i + 1}`}
            style={{ border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
            {/* Top accent line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: t.color }} />

            {/* Stars */}
            <div style={{ display: 'flex', gap: 2, marginBottom: '0.875rem', marginTop: 4 }}>
              {[...Array(t.stars)].map((_, i) => (
                <span key={i} style={{ color: 'var(--accent)', fontSize: 14 }}>★</span>
              ))}
            </div>

            {/* Quote */}
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic' }}>
              "{t.text}"
            </p>

            {/* Earned badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.3rem 0.75rem', background: 'rgba(0,212,160,0.08)', border: '1px solid rgba(0,212,160,0.2)', borderRadius: 999, marginBottom: '1rem' }}>
              <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700 }}>
                +$<AnimatedCounter value={t.earned} duration={1800} /> gagnés
              </span>
            </div>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: t.color + '25', border: '1.5px solid ' + t.color + '50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Clash Display", sans-serif', fontWeight: 700, fontSize: 13, color: t.color, flexShrink: 0 }}>
                {t.avatar}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{t.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.role} · {t.plan}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
