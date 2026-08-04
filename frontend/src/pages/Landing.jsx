import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ui/ThemeToggle'
import ImageSlider from '../components/ui/ImageSlider'
import SpeakButton from '../components/ui/SpeakButton'
import ROICalculator from '../components/ui/ROICalculator'
import Testimonials from '../components/ui/Testimonials'
import { TrustBadges, LiveTicker } from '../components/ui/TrustBadges'
import LiveFeed from '../components/ui/LiveFeed'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import FloatingParticles from '../components/ui/FloatingParticles'
import { useScrollReveal } from '../hooks/index.js'
import { Zap, Clock } from 'lucide-react'

const PLANS = [
  { key:'bronze',   name:'Bronze',   min:'15$',   roi:'5%',   duration:30, color:'#cd7f32', badge:'Débutant' },
  { key:'argent',   name:'Argent',   min:'30$',   roi:'8%',   duration:45, color:'var(--blue)', badge:'Populaire' },
  { key:'or',       name:'Or',       min:'50$',   roi:'10%',  duration:60, color:'#eab308', badge:'Standard' },
  { key:'platine',  name:'Platine',  min:'100$',  roi:'12%',  duration:90, color:'#94a3b8', badge:'Premium' },
  { key:'vip_exec', name:'VIP Exec', min:'500$',  roi:'15%',  duration:120, color:'var(--accent)', badge:'VIP' },
  { key:'king',     name:'King',     min:'1 000$',roi:'20%',  duration:180, color:'var(--green)', badge:'Royal' },
]

const PAYMENTS = [
  { name:'Bitcoin',  logo:'₿' },
  { name:'Ethereum', logo:'Ξ' },
  { name:'USDT',     logo:'₮' },
  { name:'BNB',      logo:'◆' },
]

const STATS = [
  { val:124, suffix:'M$+', label:'Actifs gérés' },
  { val:18432, suffix:'+', label:'Investisseurs' },
  { val:20, suffix:'%/j', label:'ROI maximum', decimals:0 },
  { val:70, suffix:'+', label:'Pays' },
]

export default function Landing() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  useScrollReveal()

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-base)', color:'var(--text-primary)', overflowX:'hidden' }}>
      <LiveFeed />

      {/* ── NAVBAR ── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0.75rem 1.25rem',
        background: isDark ? 'rgba(5,10,20,0.9)' : 'rgba(242,245,252,0.95)',
        backdropFilter:'blur(20px)',
        borderBottom:'1px solid var(--border)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,var(--accent),var(--accent-dark))',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px var(--accent-glow)' }}>
            <Zap size={16} color="#fff" />
          </div>
          <div>
            <span style={{ fontFamily:'"Poppins",sans-serif',fontWeight:700,fontSize:'1rem',color:'var(--text-primary)' }}>OilAI <span style={{ color:'var(--accent)' }}>Invest</span></span>
            <div style={{ fontSize:9,color:'var(--text-muted)',letterSpacing:'0.08em',textTransform:'uppercase',lineHeight:1 }}>Investissement IA</div>
          </div>
        </div>
        <div className="nav-buttons-wrap" style={{ flexWrap:'wrap', justifyContent:'flex-end' }}>
          <ThemeToggle compact />
          <Link to="/login" className="nav-btn-connexion">Connexion</Link>
          <Link to="/register" className="btn-primary nav-btn-commencer">Commencer</Link>
        </div>
      </nav>

      {/* ── HERO SLIDER ── */}
      <section style={{ paddingTop:60 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 1rem', display:'flex', justifyContent:'center' }}>
          <ImageSlider height="clamp(300px, 55vw, 580px)" showText={true} />
        </div>
      </section>

      {/* ── LIVE TICKER ── */}
      <LiveTicker />

      {/* ── STATS (animated counters) ── */}
      <section style={{ background:'var(--bg-card)',borderBottom:'1px solid var(--border)',padding:'1.5rem' }}>
        <div style={{ maxWidth:800,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.5rem',textAlign:'center' }} id="stats-row">
{STATS.map(({ val, suffix, label, decimals=0 }) => (
            <div key={label} className="reveal">
              <p style={{ fontFamily:'"Poppins",sans-serif',fontSize:'clamp(1.1rem,3vw,1.6rem)',fontWeight:700,color:'var(--accent)',lineHeight:1 }}>
                <AnimatedCounter value={val} suffix={suffix} decimals={decimals} duration={2000} />
              </p>
              <p style={{ fontSize:10,color:'var(--text-muted)',marginTop:4,fontWeight:600 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── URGENCY BAR ── */}
      <div style={{ background:'linear-gradient(90deg,var(--accent),var(--accent-dark))',padding:'0.6rem 1rem',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
        <Clock size={13} color="#fff" />
        <p style={{ fontSize:12,fontWeight:700,color:'#fff' }}>
          🔥 <strong>37 places restantes</strong> pour le Plan Premium ce mois — Rejoignez maintenant !
        </p>
      </div>

      {/* ── PLANS ── */}
      <section id="plans" className="section-pad">
        <div style={{ maxWidth:1100,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:'2rem' }} className="reveal">
            <p style={{ fontSize:11,fontWeight:700,color:'var(--accent)',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:8 }}>💎 Nos Plans</p>
            <h2 style={{ fontFamily:'"Poppins",sans-serif',fontSize:'clamp(1.5rem,4vw,2.5rem)',fontWeight:700,color:'var(--text-primary)' }}>
              Choisissez votre <span className="gradient-text">croissance</span>
            </h2>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'1rem' }}>
            {PLANS.map((plan, i) => (
              <div key={plan.key} className={`card shine-card gradient-border reveal stagger-${i+1}`} style={{ position:'relative',overflow:'hidden',border:'1px solid var(--border)',transition:'all 0.3s',cursor:'default' }}>
                <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:plan.color }} />
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem' }}>
                  <h3 style={{ fontFamily:'"Poppins",sans-serif',fontSize:'1.3rem',fontWeight:700,color:'var(--text-primary)' }}>{plan.name}</h3>
                  <span style={{ padding:'0.15rem 0.6rem',borderRadius:999,fontSize:10,fontWeight:700,background:plan.color+'18',color:plan.color,border:`1px solid ${plan.color}35`,whiteSpace:'nowrap' }}>{plan.badge}</span>
                </div>
                <p style={{ fontFamily:'"Poppins",sans-serif',fontSize:'2.5rem',fontWeight:700,color:plan.color,lineHeight:1,marginBottom:4 }}>{plan.roi}</p>
                <p style={{ fontSize:12,color:'var(--text-muted)',marginBottom:'1rem' }}>par jour · {plan.duration} jours · Tarif {plan.min}</p>
                <SpeakButton
                  text={`Le plan ${plan.name} rapporte ${plan.roi} par jour pendant ${plan.duration} jours. Tarif fixe de ${plan.min}. Rejoignez OilAI Invest !`}
                  variant="primary"
                  style={{ width:'100%',justifyContent:'center',fontSize:12,padding:'0.7rem 1rem',background:`linear-gradient(135deg,${plan.color}cc,${plan.color}88)` }}>
                  Commencer — {plan.name}
                </SpeakButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI CALCULATOR ── */}
      <section id="calcul" style={{ background:'var(--bg-card)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)' }} className="section-pad">
        <div style={{ maxWidth:820,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:'1.5rem' }} className="reveal">
            <p style={{ fontSize:11,fontWeight:700,color:'var(--accent)',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:8 }}>💹 Simulateur</p>
            <h2 style={{ fontFamily:'"Poppins",sans-serif',fontSize:'clamp(1.3rem,3.5vw,2.2rem)',fontWeight:700,color:'var(--text-primary)' }}>
              Calculez vos <span className="gradient-text">gains</span>
            </h2>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* ── PAYMENTS ── */}
      <section id="paiements" className="section-pad">
        <div style={{ maxWidth:800,margin:'0 auto',textAlign:'center' }}>
          <div className="reveal" style={{ marginBottom:'1.5rem' }}>
            <p style={{ fontSize:11,fontWeight:700,color:'var(--accent)',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:8 }}>🔒 Paiements Crypto</p>
            <h2 style={{ fontFamily:'"Poppins",sans-serif',fontSize:'clamp(1.3rem,3.5vw,2.2rem)',fontWeight:700,color:'var(--text-primary)',marginBottom:10 }}>
              100% <span className="gradient-text">Cryptomonnaies</span>
            </h2>
            <p style={{ color:'var(--text-secondary)',fontSize:13,lineHeight:1.65,maxWidth:440,margin:'0 auto' }}>
              Déposez et retirez en Bitcoin, Ethereum, USDT ou BNB. Rapide, sécurisé, sans intermédiaire bancaire.
            </p>
          </div>
          <div style={{ display:'flex',justifyContent:'center',gap:'0.75rem',flexWrap:'wrap' }}>
            {PAYMENTS.map((p, i) => (
              <div key={p.name} className={`reveal stagger-${i+1}`} style={{ display:'flex',alignItems:'center',gap:8,padding:'0.75rem 1.1rem',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,transition:'all 0.25s' }}>
                <span style={{ fontSize:22 }}>{p.logo}</span>
                <span style={{ fontWeight:700,color:'var(--text-primary)',fontSize:13 }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <TrustBadges />

      {/* ── TESTIMONIALS ── */}
      <Testimonials />

      {/* ── STEPS ── */}
      <section style={{ background:'var(--bg-card)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)' }} className="section-pad">
        <div style={{ maxWidth:860,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:'2rem' }} className="reveal">
            <h2 style={{ fontFamily:'"Poppins",sans-serif',fontSize:'clamp(1.3rem,3.5vw,2.2rem)',fontWeight:700,color:'var(--text-primary)' }}>
              Démarrez en <span className="gradient-text">4 étapes</span>
            </h2>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'1.25rem' }}>
            {[
              { n:'01', t:'Inscription', d:'Gratuite en 2 min', icon:'👤' },
              { n:'02', t:'Dépôt Crypto', d:'BTC · ETH · USDT · BNB', icon:'💎' },
              { n:'03', t:'Choisir un plan', d:'Bronze à King', icon:'🎯' },
              { n:'04', t:'Gagner chaque jour', d:'IA active 24h/24', icon:'💰' },
            ].map(({ n, t, d, icon }, i) => (
              <div key={n} className={`reveal stagger-${i+1}`} style={{ textAlign:'center',padding:'1.25rem 0.875rem',background:'var(--bg-card2)',border:'1px solid var(--border)',borderRadius:16 }}>
                <div style={{ width:48,height:48,borderRadius:14,background:'var(--accent-glow)',border:'1.5px solid rgba(245,166,35,0.25)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.75rem',fontSize:22 }}>{icon}</div>
                <p style={{ fontSize:9,fontWeight:700,color:'var(--accent)',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.08em' }}>Étape {n}</p>
                <p style={{ fontWeight:700,color:'var(--text-primary)',fontSize:'0.875rem',marginBottom:4 }}>{t}</p>
                <p style={{ fontSize:11,color:'var(--text-secondary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ margin:'2rem 1.25rem',borderRadius:20,overflow:'hidden',position:'relative',minHeight:260,display:'flex',alignItems:'center',justifyContent:'center' }}>
        <img src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1400&q=80" alt="" style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.1 }} />
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(135deg,var(--bg-base),rgba(5,10,20,0.85))' }} />
        <FloatingParticles count={10} />
        <div style={{ position:'relative',textAlign:'center',padding:'3rem 1.5rem',zIndex:1 }}>
          <h2 style={{ fontFamily:'"Poppins",sans-serif',fontSize:'clamp(1.4rem,4vw,2.4rem)',fontWeight:700,color:'var(--text-primary)',marginBottom:'0.75rem',lineHeight:1.2 }} className="reveal">
            Votre avenir financier<br /><span className="gradient-text">commence aujourd'hui</span>
          </h2>
          <p style={{ color:'var(--text-secondary)',marginBottom:'1.5rem',fontSize:13,lineHeight:1.65,maxWidth:440,margin:'0 auto 1.5rem' }} className="reveal">
            18 000+ investisseurs africains génèrent des profits quotidiens avec OilAI.
          </p>
          <div style={{ display:'flex',gap:'0.75rem',justifyContent:'center',flexWrap:'wrap' }} className="reveal">
            <SpeakButton
              text="Créez votre compte OilAI Invest gratuit et gagnez jusqu'à 20 pourcent par jour. Rejoignez 18 000 investisseurs africains maintenant !"
              onClick={() => window.location.href='/register'}
              style={{ fontSize:'0.9rem',padding:'0.875rem 1.75rem',animation:'glowPulse 2.5s ease-in-out infinite' }}>
              🚀 Créer mon compte
            </SpeakButton>
          </div>
          <p style={{ fontSize:11,color:'var(--text-muted)',marginTop:'1rem' }}>✅ Gratuit · ✅ Sans engagement · ✅ Retrait libre</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:'1px solid var(--border)',padding:'1.5rem',textAlign:'center' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginBottom:8 }}>
          <div style={{ width:26,height:26,borderRadius:8,background:'linear-gradient(135deg,var(--accent),var(--accent-dark))',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <Zap size={13} color="#fff" />
          </div>
          <span style={{ fontFamily:'"Poppins",sans-serif',fontWeight:700,fontSize:'0.95rem',color:'var(--text-primary)' }}>OilAI Invest</span>
        </div>
        <p style={{ fontSize:11,color:'var(--text-muted)',lineHeight:1.6 }}>
          © 2025 OilAI Invest · Plateforme panafricaine<br />
          L'investissement comporte des risques. Les performances passées ne garantissent pas les résultats futurs.
        </p>
      </footer>
      {/* ── SECTION À PROPOS ── */}
      <section id="about" style={{ padding:"5rem 1.25rem", background:"var(--bg-base)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:10 }}>🌍 Notre Vision</p>
            <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(1.6rem,4vw,2.5rem)", fontWeight:700, color:"var(--text-primary)", marginBottom:14 }}>
              OilAI Invest — <span className="gradient-text">Construire l&apos;avenir</span><br/>financier de l&apos;Afrique
            </h2>
            <p style={{ color:"var(--text-secondary)", fontSize:14, lineHeight:1.7, maxWidth:620, margin:"0 auto" }}>
              Nous croyons que chaque Africain mérite d&apos;accéder aux opportunités des marchés financiers mondiaux.
              Notre plateforme d&apos;intelligence artificielle démocratise l&apos;investissement dans le secteur pétrolier.
            </p>
          </div>

          <div style={{ borderRadius:24, overflow:"hidden", marginBottom:"3rem", position:"relative", height:320 }}>
            <img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1400&q=80" alt="OilAI Invest"
              style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(6,11,15,0.85) 40%,transparent 100%)" }}/>
            <div style={{ position:"absolute", top:"50%", left:"2rem", transform:"translateY(-50%)", maxWidth:360 }}>
              <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(1.2rem,3vw,1.8rem)", fontWeight:700, color:"#fff", lineHeight:1.3, marginBottom:10 }}>
                Fondée pour servir<br/>18 000+ investisseurs
              </p>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.8)", lineHeight:1.6 }}>
                Depuis notre lancement, plus de 124 millions de dollars ont été distribués à travers 70+ pays.
              </p>
            </div>
          </div>

          <div style={{ display:"grid", gap:"1.5rem", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", marginBottom:"3rem" }}>
            {[
              { img:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80", tag:"🤖 Technologie", title:"IA de pointe sur les marchés pétroliers", text:"Notre algorithme analyse en temps réel les données WTI, Brent et les facteurs géopolitiques pour optimiser vos rendements." },
              { img:"https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80", tag:"🌍 Mission", title:"Inclusion financière panafricaine", text:"Nous construisons des ponts entre les marchés financiers mondiaux et les investisseurs africains, sans barrière bancaire." },
              { img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", tag:"🚀 Vision 2026", title:"Expansion et nouveaux marchés", text:"Prochainement : investissements dans les énergies renouvelables africaines, les mines et les obligations souveraines." },
            ].map(({ img, tag, title, text }) => (
              <div key={title} className="float-card" style={{ padding:0, overflow:"hidden" }}>
                <div style={{ height:180, overflow:"hidden", position:"relative" }}>
                  <img src={img} alt={title} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  <div style={{ position:"absolute", top:12, left:12 }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:"4px 10px", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)", borderRadius:999, color:"#fff" }}>{tag}</span>
                  </div>
                </div>
                <div style={{ padding:"1.25rem" }}>
                  <p style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, color:"var(--text-primary)", fontSize:"1rem", marginBottom:8 }}>{title}</p>
                  <p style={{ fontSize:12, color:"var(--text-secondary)", lineHeight:1.65 }}>{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:"1rem", padding:"2.5rem", background:"var(--bg-card)", borderRadius:24, border:"1px solid var(--border)" }}>
            {[
              { val:"2021",  label:"Année de fondation" },
              { val:"70+",   label:"Pays représentés" },
              { val:"18k+",  label:"Investisseurs actifs" },
              { val:"124M$", label:"Rendements distribués" },
              { val:"99.9%", label:"Disponibilité" },
              { val:"24/7",  label:"Support IA" },
            ].map(({ val, label }) => (
              <div key={label} style={{ textAlign:"center", padding:"0.75rem 0.5rem" }}>
                <p style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:"1.6rem", color:"var(--accent)", marginBottom:4 }}>{val}</p>
                <p style={{ fontSize:11, color:"var(--text-muted)", fontWeight:600 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
