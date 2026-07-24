import { useState, useEffect, useRef } from 'react'

/**
 * AnimatedCounter — Anime un chiffre de 0 vers `value`
 * Props:
 *  - value    : nombre cible
 *  - duration : durée en ms (défaut 2000)
 *  - prefix   : ex "$"
 *  - suffix   : ex "%", "+"
 *  - decimals : décimales (défaut 0)
 */
export default function AnimatedCounter({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  style = {},
  className = ''
}) {
  const [current, setCurrent] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  const frameRef = useRef(null)

  // Start when visible
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true)
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  // Animate
  useEffect(() => {
    if (!started) return
    const startTime = performance.now()
    const startVal = 0

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3)
      setCurrent(startVal + (value - startVal) * ease)
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [started, value, duration])

  const display = decimals > 0
    ? current.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.floor(current).toLocaleString('fr-FR')

  return (
    <span ref={ref} className={`counter-value ${className}`} style={style}>
      {prefix}{display}{suffix}
    </span>
  )
}
