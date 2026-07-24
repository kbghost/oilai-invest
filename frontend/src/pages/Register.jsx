import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ui/ThemeToggle'
import { referralAPI } from '../services/api'
import { Eye, EyeOff, Zap, ArrowRight, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const { register }     = useAuth()
  const navigate         = useNavigate()
  const [searchParams]   = useSearchParams()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    phone: '', country: '',
    referralCode: searchParams.get('ref') || '',
  })
  const [show, setShow]           = useState(false)
  const [loading, setLoading]     = useState(false)
  const [refStatus, setRefStatus] = useState(null) // null | 'checking' | {valid, name} | {valid:false}

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  // Valide le code de parrainage en temps réel avec debounce 600ms
  useEffect(() => {
    const code = form.referralCode.trim().toUpperCase()
    if (!code || code.length < 6) { setRefStatus(null); return }
    setRefStatus('checking')
    const timer = setTimeout(async () => {
      try {
        const r = await referralAPI.verifyCode(code)
        setRefStatus({ valid: true, name: r.data.referrer.name })
      } catch {
        setRefStatus({ valid: false })
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [form.referralCode])

  const submit = async e => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Mot de passe : 6 caractères minimum')
    if (refStatus && refStatus !== 'checking' && refStatus.valid === false)
      return toast.error('Code de parrainage invalide')
    setLoading(true)
    try {
      const payload = { ...form }
      if (payload.referralCode) payload.referralCode = payload.referralCode.trim().toUpperCase()
      else delete payload.referralCode
      await register(payload)
      toast.success('Compte créé !')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Erreur inscription')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-base)', display:'flex' }}>
      {/* Panel gauche — desktop uniquement */}
      <div id="reg-left" style={{ flex:1, position:'relative', display:'none', flexDirection:'column' }}>
        <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.22 }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,var(--bg-base) 38%,rgba(5,10,20,0.7) 100%)' }}/>
        <div style={{ position:'relative', zIndex:1, padding:'2.5rem', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none' }}>
            <div style={{ width:36, height:36, borderRadius:11, background:'linear-gradient(135deg,var(--accent),var(--accent-dark))', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Zap size={17} color="#fff"/>
            </div>
            <span style={{ fontFamily:'"Clash Display",sans-serif', fontWeight:700, fontSize:'1.15rem', color:'var(--text-primary)' }}>
              OilAI <span style={{ color:'var(--accent)' }}>Invest</span>
            </span>
          </Link>
          <div>
            <h2 style={{ fontFamily:'"Clash Display",sans-serif', fontSize:'1.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'1.25rem', lineHeight:1.25 }}>
              Rejoignez<br/><span className="gradient-text">18 000+ investisseurs</span><br/>africains
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', maxWidth:300 }}>
              {[['124M$+','Actifs gérés'],['3.5%/j','ROI max'],['70+','Pays'],['24/7','Support IA']].map(([v,l]) => (
                <div key={l} style={{ padding:'0.75rem', background:'rgba(34,197,94,0.07)', border:'1px solid rgba(34,197,94,0.14)', borderRadius:12, textAlign:'center' }}>
                  <p style={{ fontFamily:'"Clash Display",sans-serif', fontWeight:700, color:'var(--accent)', fontSize:'1rem' }}>{v}</p>
                  <p style={{ fontSize:10, color:'var(--text-muted)' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize:11, color:'var(--text-muted)' }}>© 2025 OilAI Invest</p>
        </div>
      </div>

      {/* Formulaire */}
      <div style={{ flex:1, maxWidth:500, display:'flex', flexDirection:'column', justifyContent:'center', padding:'2rem 1.75rem', overflowY:'auto', margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem' }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
            <div style={{ width:30, height:30, borderRadius:9, background:'linear-gradient(135deg,var(--accent),var(--accent-dark))', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Zap size={14} color="#fff"/>
            </div>
            <span style={{ fontFamily:'"Clash Display",sans-serif', fontWeight:700, color:'var(--text-primary)' }}>OilAI</span>
          </Link>
          <ThemeToggle compact/>
        </div>

        <h1 style={{ fontFamily:'"Clash Display",sans-serif', fontSize:'1.6rem', fontWeight:700, color:'var(--text-primary)', marginBottom:5 }}>Créer un compte</h1>
        <p style={{ color:'var(--text-secondary)', fontSize:13, marginBottom:'1.5rem' }}>Inscription gratuite — prêt en 2 minutes</p>

        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
            <div>
              <label className="label">Prénom</label>
              <input name="firstName" required value={form.firstName} onChange={handle} className="input" placeholder="Jean"/>
            </div>
            <div>
              <label className="label">Nom</label>
              <input name="lastName" required value={form.lastName} onChange={handle} className="input" placeholder="Dupont"/>
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required value={form.email} onChange={handle} className="input" placeholder="votre@email.com"/>
          </div>

          <div>
            <label className="label">Mot de passe</label>
            <div style={{ position:'relative' }}>
              <input name="password" type={show?'text':'password'} required value={form.password} onChange={handle} className="input" style={{ paddingRight:48 }} placeholder="Min. 6 caractères"/>
              <button type="button" onClick={()=>setShow(!show)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex' }}>
                {show ? <EyeOff size={17}/> : <Eye size={17}/>}
              </button>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
            <div>
              <label className="label">Téléphone</label>
              <input name="phone" value={form.phone} onChange={handle} className="input" placeholder="+xxx..."/>
            </div>
            <div>
              <label className="label">Pays</label>
              <input name="country" value={form.country} onChange={handle} className="input" placeholder="Votre pays"/>
            </div>
          </div>

          {/* Code de parrainage */}
          <div>
            <label className="label" style={{ display:'flex', alignItems:'center', gap:6 }}>
              🎁 Code de parrainage
              <span style={{ fontSize:9, fontWeight:400, color:'var(--text-muted)', textTransform:'none', letterSpacing:0 }}>(optionnel)</span>
            </label>
            <div style={{ position:'relative' }}>
              <input
                name="referralCode"
                value={form.referralCode}
                onChange={handle}
                className="input"
                placeholder="OILAI-XXXXXX"
                maxLength={12}
                style={{
                  paddingRight: 44,
                  fontFamily: 'monospace',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              />
              {/* Indicateur statut */}
              {refStatus === 'checking' && (
                <div style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', width:15, height:15, border:'2px solid var(--border)', borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
              )}
              {refStatus && refStatus !== 'checking' && refStatus.valid && (
                <div style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', width:20, height:20, borderRadius:'50%', background:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Check size={12} color="#fff" strokeWidth={3}/>
                </div>
              )}
              {refStatus && refStatus !== 'checking' && !refStatus.valid && (
                <div style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', width:20, height:20, borderRadius:'50%', background:'var(--red)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <X size={12} color="#fff" strokeWidth={3}/>
                </div>
              )}
            </div>

            {/* Message sous le champ */}
            {refStatus?.valid && (
              <div style={{ marginTop:6, padding:'0.5rem 0.75rem', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:10, fontSize:12, color:'var(--green)', fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
                <Check size={12} strokeWidth={3}/> Parrain valide : {refStatus.name}
              </div>
            )}
            {refStatus && !refStatus.valid && refStatus !== 'checking' && (
              <p style={{ marginTop:5, fontSize:11, color:'var(--red)' }}>Code de parrainage introuvable</p>
            )}
          </div>

          <p style={{ fontSize:11, color:'var(--text-muted)', lineHeight:1.5 }}>
            En vous inscrivant, vous acceptez nos conditions d'utilisation.
          </p>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'0.9rem' }}>
            {loading
              ? <div style={{ width:19, height:19, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
              : <><span>Créer mon compte</span><ArrowRight size={17}/></>}
          </button>
        </form>

        <p style={{ textAlign:'center', color:'var(--text-muted)', fontSize:12, marginTop:'1.25rem' }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color:'var(--accent)', fontWeight:700, textDecoration:'none' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
