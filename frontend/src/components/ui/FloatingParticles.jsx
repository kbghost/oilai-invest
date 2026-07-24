import { useEffect, useRef } from 'react'

/**
 * FloatingParticles — Canvas de particules flottantes ($ € ₿ ⬆)
 * Léger, performant, s'adapte au thème
 */
export default function FloatingParticles({ count = 18 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const SYMBOLS = ['$', '+', '↑', '●', '◆']
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light'

    for (let i = 0; i < count; i++) {
      particles.push({
        x:    Math.random() * canvas.width,
        y:    Math.random() * canvas.height,
        size: Math.random() * 10 + 8,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        speed: Math.random() * 0.4 + 0.1,
        opacity: Math.random() * 0.08 + 0.03,
        drift:  (Math.random() - 0.5) * 0.3,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const color = isDark ? '245, 166, 35' : '212, 136, 26'

      particles.forEach(p => {
        ctx.font = `${p.size}px "Clash Display", sans-serif`
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`
        ctx.fillText(p.symbol, p.x, p.y)

        p.y -= p.speed
        p.x += p.drift
        p.opacity += 0.0005

        if (p.y < -20) {
          p.y = canvas.height + 20
          p.x = Math.random() * canvas.width
          p.opacity = Math.random() * 0.08 + 0.03
        }
        if (p.x < -20 || p.x > canvas.width + 20) {
          p.x = Math.random() * canvas.width
        }
      })

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  )
}
