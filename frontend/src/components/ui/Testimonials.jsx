import AnimatedCounter from './AnimatedCounter'

const TESTIMONIALS = [
  {
    name: 'Kofi Mensah',
    role: 'Verified Investor',
    plan: 'Premium Plan',
    earned: 4820,
    text: 'OilAI Invest has changed my life. In just 3 months, I earned more than my annual salary. Profits arrive every single day without me having to do anything!',
    avatar: 'KM',
    color: 'var(--accent)',
    stars: 5,
  },
  {
    name: 'Fatou Diallo',
    role: 'Verified Investor',
    plan: 'Pro Plan',
    earned: 1850,
    text: 'I was skeptical at first, but after my first successful crypto withdrawal, I doubled my stake. The support team is responsive and everything is completely transparent.',
    avatar: 'FD',
    color: 'var(--blue)',
    stars: 5,
  },
  {
    name: 'Ibrahim Touré',
    role: 'Verified Investor',
    plan: 'Starter Plan',
    earned: 520,
    text: 'I started with only $200 and within a month I had already earned $130 in profits. This is the best investment platform I have ever tried in West Africa.',
    avatar: 'IT',
    color: 'var(--green)',
    stars: 5,
  },
  {
    name: 'Adjoua Koné',
    role: 'Verified Investor',
    plan: 'Premium Plan',
    earned: 9400,
    text: 'I recommend OilAI to all my family members. The AI is incredibly accurate at predicting oil markets. My passive income has skyrocketed since I joined the platform.',
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
          ⭐ Verified Testimonials
        </p>
        <h2 style={{ fontFamily: '"Poppins", sans-serif', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
          What our{' '}
          <span className="gradient-text">investors say</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', fontSize: 14, lineHeight: 1.7 }}>
          Investors trust us every day across West Africa and beyond.
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
                +$<AnimatedCounter value={t.earned} duration={1800} /> earned
              </span>
            </div>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: t.color + '25', border: '1.5px solid ' + t.color + '50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Poppins", sans-serif', fontWeight: 700, fontSize: 13, color: t.color, flexShrink: 0 }}>
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
