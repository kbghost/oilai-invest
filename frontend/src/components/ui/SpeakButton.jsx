import { useState, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useSpeech } from '../../hooks/index.js'

/**
 * 🔊 SpeakButton — Bouton qui lit un message à voix haute
 *
 * Props:
 *  - text        : texte à lire (obligatoire)
 *  - children    : contenu du bouton (obligatoire)
 *  - variant     : 'primary' | 'outline' | 'ghost'
 *  - style       : styles additionnels
 *  - onClick     : action au clic (en plus de la lecture)
 *  - autoSpeak   : lit automatiquement au survol (défaut: false)
 */
export default function SpeakButton({
  text,
  children,
  variant = 'primary',
  style = {},
  onClick,
  autoSpeak = false,
  className = '',
  ...props
}) {
  const { speak, stop, isSpeaking } = useSpeech()
  const [speaking, setSpeaking] = useState(false)

  const handleClick = () => {
    if (speaking) {
      stop()
      setSpeaking(false)
    } else {
      const utt = speak(text)
      if (utt) {
        setSpeaking(true)
        utt.onend = () => setSpeaking(false)
        utt.onerror = () => setSpeaking(false)
      }
    }
    if (onClick) onClick()
  }

  const handleHover = () => {
    if (autoSpeak && !speaking) {
      const utt = speak(text, { rate: 1.1 })
      if (utt) {
        setSpeaking(true)
        utt.onend = () => setSpeaking(false)
      }
    }
  }

  useEffect(() => () => stop(), [])

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 700,
    borderRadius: 14,
    padding: '0.8rem 1.4rem',
    transition: 'all 0.2s',
    position: 'relative',
    overflow: 'hidden',
    border: 'none',
    ...style
  }

  const variantStyle = {
    primary: {
      background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
      color: '#fff',
      boxShadow: speaking ? '0 0 0 4px var(--accent-glow), 0 4px 20px var(--accent-glow)' : '0 4px 16px var(--accent-glow)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--accent)',
      border: '1.5px solid var(--accent)',
      boxShadow: speaking ? '0 0 20px var(--accent-glow)' : 'none',
    },
    ghost: {
      background: 'var(--bg-card2)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
    }
  }[variant]

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleHover}
      className={`btn-speak ${speaking ? 'speaking' : ''} ${className}`}
      style={{ ...baseStyle, ...variantStyle }}
      title={speaking ? 'Cliquez pour arrêter' : 'Cliquez pour entendre'}
      {...props}
    >
      {/* Shimmer effect */}
      {speaking && (
        <span style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmerScan 1s linear infinite'
        }} />
      )}

      {/* Icon */}
      {speaking
        ? <span className="sound-wave" style={{ color: variant === 'primary' ? '#fff' : 'var(--accent)' }}>
            <span/><span/><span/><span/><span/>
          </span>
        : <Volume2 size={17} strokeWidth={2.2} />
      }

      {/* Label */}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  )
}
