import { useTheme } from '../../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ compact = false }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  if (compact) {
    return (
      <button onClick={toggle} title={isDark ? 'Mode clair' : 'Mode sombre'}
        style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--bg-card2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-secondary)'
        }}>
        {isDark ? <Sun size={16} color="var(--accent)" /> : <Moon size={16} color="var(--accent)" />}
      </button>
    )
  }

  return (
    <button onClick={toggle} title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0.5rem 0.875rem', borderRadius: 12,
        background: 'var(--bg-card2)', border: '1px solid var(--border)',
        cursor: 'pointer', transition: 'all 0.2s',
        color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500,
        fontFamily: 'inherit',
      }}>
      {isDark
        ? <><Sun size={15} color="var(--accent)" /> <span>Mode clair</span></>
        : <><Moon size={15} color="var(--accent)" /> <span>Mode sombre</span></>
      }
    </button>
  )
}
