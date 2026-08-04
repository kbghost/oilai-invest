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
    <div className="auth-container">
      {/* Panneau gauche (Bureau) */}
      <div className="auth-left">
        <img src="/images/login_bg.png" alt="Login Background" className="auth-bg-img" />
        <div className="auth-bg-overlay" />
        <div className="auth-left-content">
          <Link to="/" className="auth-logo-link">
            <div className="auth-logo-icon">
              <Zap size={18} color="#fff" />
            </div>
            <span className="auth-logo-text" style={{ color: '#000' }}>OilAI <span className="auth-logo-accent" style={{ color: '#000' }}>Invest</span></span>
          </Link>

          <div className="animate-fade-up">
            <p style={{ fontSize: 11, fontWeight: 800, color: '#000', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
              🌍 Plateforme #1 Afrique de l'Ouest
            </p>
            <h2 style={{ fontFamily: '"Poppins",sans-serif', fontSize: '2.4rem', fontWeight: 800, color: '#000', lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Votre argent travaille,<br />même quand vous dormez.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['ROI jusqu\'à 20%/jour', 'Dépôts 100% crypto', 'Sécurité AES-256', 'Support 24/7 en français'].map((f, i) => (
                <div key={f} className={`animate-fade-up stagger-${i+1}`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#000', fontWeight: 700 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.2)' }}>
                    <span style={{ color: '#000', fontWeight: 900, fontSize: 12 }}>✓</span>
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)', fontWeight: 600 }}>© 2025 OilAI Invest. Tous droits réservés.</p>
        </div>
      </div>

      {/* Formulaire droite */}
      <div className="auth-right">
        <div className="auth-mobile-header">
          <Link to="/" className="auth-logo-link">
            <div className="auth-logo-icon" style={{ width: 32, height: 32 }}><Zap size={15} color="#fff" /></div>
            <span className="auth-logo-text" style={{ fontSize: '1.1rem' }}>OilAI Invest</span>
          </Link>
          <ThemeToggle compact />
        </div>

        <div className="auth-card animate-fade-up stagger-1">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h1 style={{ fontFamily: '"Poppins",sans-serif', fontSize: '1.7rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Connexion à OilAI Invest
            </h1>
            <div style={{ display: 'none' }} className="desktop-theme-toggle"><ThemeToggle compact /></div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: '2rem' }}>Accédez à votre tableau de bord investisseur.</p>
          
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label">Adresse Email</label>
              <input name="email" type="email" required value={form.email} onChange={handle} className="input" placeholder="votre@email.com" />
            </div>
            
            <div>
              <label className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Mot de passe
                <span style={{ fontSize: 11, color: 'var(--accent)', cursor: 'pointer', textTransform: 'none', fontWeight: 600 }}>Oublié ?</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={show ? 'text' : 'password'} required value={form.password} onChange={handle} className="input" style={{ paddingRight: 48 }} placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}>
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '0.5rem', fontSize: '1rem' }}>
              {loading ? (
                <div style={{ width: 22, height: 22, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <><span>Se connecter</span><ArrowRight size={18} /></>
              )}
            </button>
          </form>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              Nouveau sur OilAI ? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none', marginLeft: 4 }}>Créer un compte</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
