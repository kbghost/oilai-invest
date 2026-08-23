/**
 * ImageSlider — Slider automatique (7s par slide)
 *
 * 🖼️ COMMENT MODIFIER LES IMAGES :
 * Editez le tableau SLIDES ci-dessous.
 * Chaque slide a :
 *   - image  : URL Unsplash (format ?w=1400&q=80 pour optimiser la taille)
 *   - title  : Titre principal
 *   - sub    : Sous-titre / description
 *   - badge  : Petit label coloré en haut
 *
 * Pour remplacer une image :
 *   1. Allez sur https://unsplash.com
 *   2. Cherchez votre photo
 *   3. Cliquez → Download → "Copy link" ou utilisez l'URL de la page avec ?w=1400&q=80
 *   4. Remplacez l'URL dans le tableau
 *
 * Pour changer la durée : modifiez INTERVAL_MS (en millisecondes)
 */

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const INTERVAL_MS = 7000 // 7 secondes

// ═══════════════════════════════════════════════════════════
// 🖼️  SLIDES — Edit images and text here
// ═══════════════════════════════════════════════════════════
export const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=75',
    badge: '🤖 Predictive AI',
    title: 'Invest in Oil\nwith Artificial Intelligence',
    sub: 'Our AI analyzes global oil markets in real time to maximize your daily returns.',
  },
  {
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=75',
    badge: '🛢️ Oil Market',
    title: 'Oil, the Engine of\nYour Financial Growth',
    sub: 'Access global energy market opportunities directly from your phone, anywhere in the world.',
  },
  {
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=75',
    badge: '📈 High Daily Yields',
    title: 'Up to 20% Profit\nEvery Single Day',
    sub: 'Flexible investment plans tailored for every budget. Start with as little as $15 and grow your capital.',
  },
  {
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=75',
    badge: '🌍 Crypto-Powered',
    title: 'Instant Deposits & Withdrawals\n100% Crypto',
    sub: 'Bitcoin, Ethereum, USDT, BNB — deposit and withdraw effortlessly with total security.',
  },
  {
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=75',
    badge: '🔒 100% Secure',
    title: 'Your Capital is\nProtected 24/7',
    sub: 'Institutional-grade security, AES-256 encryption, and dedicated AI support. Invest with complete peace of mind.',
  },
]
// ═══════════════════════════════════════════════════════════

export default function ImageSlider({ height = '520px', showText = true }) {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const go = useCallback((idx) => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(idx)
      setTransitioning(false)
    }, 300)
  }, [transitioning])

  const prev = () => go((current - 1 + SLIDES.length) % SLIDES.length)
  const next = useCallback(() => go((current + 1) % SLIDES.length), [current, go])

  useEffect(() => {
    let timer = null
    const startTimer = () => {
      if (!document.hidden) {
        timer = setInterval(next, INTERVAL_MS)
      }
    }
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timer) clearInterval(timer)
      } else {
        if (timer) clearInterval(timer)
        startTimer()
      }
    }

    startTimer()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      if (timer) clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [next])

  const slide = SLIDES[current]

  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden', borderRadius: 24 }}>
      {/* Image */}
      <div style={{
        position: 'absolute', inset: 0,
        transition: 'opacity 0.4s ease',
        opacity: transitioning ? 0 : 1
      }}>
        <img
          src={slide.image}
          alt={slide.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          loading="eager"
          decoding="async"
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(5,10,20,0.96) 32%, rgba(5,10,20,0.30) 100%)'
        }} />
      </div>

      {/* Text content */}
      {showText && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems:'center', justifyContent:'center', padding: '1.5rem 1.25rem', zIndex: 2 }}>
          <div style={{ maxWidth: 620, width:'100%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.3rem 0.9rem', background: 'rgba(245,166,35,0.18)', border: '1px solid rgba(245,166,35,0.35)', borderRadius: 999, color: 'var(--accent)', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', marginBottom: '1.25rem', width: 'fit-content' }}>
              {slide.badge}
            </div>

          <h2 style={{ fontFamily: '"Poppins", sans-serif', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 700, color: '#fff', lineHeight: 1.25, marginBottom: '1rem', whiteSpace: 'pre-line', textShadow: '0 16px 30px rgba(0,0,0,0.45)' }}>
            {slide.title}
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', maxWidth: 500, lineHeight: 1.65, marginBottom: '1.5rem' }}>
            {slide.sub}
          </p>

          {/* Slide counter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => go(i)} className={'slider-dot' + (i === current ? ' active' : '')} />
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Arrow buttons */}
      <button onClick={prev} style={{
        position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
        width: 40, height: 40, borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: 3, transition: 'background 0.2s'
      }}>
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} style={{
        position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
        width: 40, height: 40, borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: 3, transition: 'background 0.2s'
      }}>
        <ChevronRight size={20} />
      </button>

      {/* Bottom dots on right for dashboard mini mode */}
      {!showText && (
        <div style={{ position: 'absolute', bottom: 12, right: 16, display: 'flex', gap: 5, zIndex: 3 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => go(i)} className={'slider-dot' + (i === current ? ' active' : '')} />
          ))}
        </div>
      )}
    </div>
  )
}
