import React from 'react'
import { Zap, RefreshCw, AlertTriangle } from 'lucide-react'

/**
 * ErrorBoundary — Catches any uncaught React runtime errors.
 * Displays a user-friendly fallback instead of a blank white page.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-base, #060B0F)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: '"Poppins", "Inter", sans-serif',
      }}>
        <div style={{
          maxWidth: 480,
          width: '100%',
          background: 'var(--bg-card, #0D1F17)',
          border: '1px solid rgba(255,80,80,0.25)',
          borderRadius: 24,
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: '2rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,#00D4A0,#1a7a50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary, #fff)' }}>OilAI <span style={{ color: '#00D4A0' }}>Invest</span></span>
          </div>

          {/* Error icon */}
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <AlertTriangle size={28} color="#FF5C7A" />
          </div>

          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary, #fff)', marginBottom: '0.75rem' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted, #888)', marginBottom: '2rem', lineHeight: 1.6 }}>
            An unexpected error occurred. This is usually due to a temporary connection issue or an update being applied. Please try refreshing the page.
          </p>

          {/* Error detail (dev only) */}
          {this.state.error && (
            <div style={{ background: 'rgba(255,80,80,0.06)', border: '1px solid rgba(255,80,80,0.15)', borderRadius: 12, padding: '0.75rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <p style={{ fontSize: 11, color: '#FF5C7A', fontFamily: 'monospace', wordBreak: 'break-all', margin: 0 }}>
                {this.state.error.message || String(this.state.error)}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={this.handleReload}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.875rem', background: 'linear-gradient(135deg,#00D4A0,#1a7a50)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <RefreshCw size={16} /> Reload Page
            </button>
            <button
              onClick={this.handleGoHome}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.875rem', background: 'transparent', border: '1px solid var(--border, rgba(255,255,255,0.1))', borderRadius: 14, color: 'var(--text-secondary, #aaa)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }
}
