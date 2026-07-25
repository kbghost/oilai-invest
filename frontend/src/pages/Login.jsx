import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ui/ThemeToggle'
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      toast.success('Connexion réussie !')
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) { toast.error(err.response?.data?.message || 'Connexion échouée') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex' }}>
      {/* Left panel — desktop only */}
      <div id="login-left" style={{ flex: 1, position: 'relative', display: 'none', flexDirection: 'column' }}>
        <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,var(--bg-base) 35%,rgba(5,10,20,0.6) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,var(--accent),var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={17} color="#fff" /></div>
            <span style={{ fontFamily: '"Clash Display",sans-serif', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>OilAI <span style={{ color: 'var(--accent)' }}>Invest</span></span>
          </Link>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>🌍 Plateforme #1 Afrique de l'Ouest</p>
            <h2 style={{ fontFamily: '"Clash Display",sans-serif', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '1rem' }}>Votre argent travaille,<br />même quand vous dormez.</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['ROI jusqu\'à 20%/jour', 'Dépôts 100% crypto', 'Sécurité AES-256', 'Support 24/7 en français'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--green)', fontWeight: 800 }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>© 2025 OilAI Invest</p>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, maxWidth: 460, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 1.75rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,var(--accent),var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={14} color="#fff" /></div>
            <span style={{ fontFamily: '"Clash Display",sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}>OilAI</span>
          </Link>
          <ThemeToggle compact />
        </div>
        <h1 style={{ fontFamily: '"Clash Display",sans-serif', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 5 }}>Connexion</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: '1.75rem' }}>Accédez à votre compte investisseur</p>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><label className="label">Email</label><input name="email" type="email" required value={form.email} onChange={handle} className="input" placeholder="votre@email.com" /></div>
          <div>
            <label className="label">Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={show ? 'text' : 'password'} required value={form.password} onChange={handle} className="input" style={{ paddingRight: 48 }} placeholder="••••••••" />
              <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}>
            {loading ? <div style={{ width: 19, height: 19, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : <><span>Se connecter</span><ArrowRight size={17} /></>}
          </button>
        </form>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, marginTop: '1.25rem' }}>
          Pas de compte ? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}
