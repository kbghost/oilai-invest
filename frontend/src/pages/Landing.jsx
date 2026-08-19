import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ui/ThemeToggle'
import ImageSlider from '../components/ui/ImageSlider'
import ROICalculator from '../components/ui/ROICalculator'
import Testimonials from '../components/ui/Testimonials'
import { TrustBadges, LiveTicker } from '../components/ui/TrustBadges'
import LiveFeed from '../components/ui/LiveFeed'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import FloatingParticles from '../components/ui/FloatingParticles'
import { useScrollReveal } from '../hooks/index.js'
import { Zap, Clock } from 'lucide-react'

const PLANS = [
  { key:'decouverte',  name:'Découverte',  price:'100 €',  roi:'3,0%',  duration:30, dailyGain:'3,00 €',   totalProfit:'90,00 €',    threshold:'17 jours',   color:'#3b82f6', badge:'Débutant' },
  { key:'standard',    name:'Standard',    price:'250 €',  roi:'4,5%',  duration:45, dailyGain:'11,25 €',  totalProfit:'506,25 €',   threshold:'5 jours',    color:'var(--blue)', badge:'Populaire' },
  { key:'performance', name:'Performance', price:'500 €',  roi:'6,0%',  duration:60, dailyGain:'30,00 €',  totalProfit:'1 800,00 €', threshold:'2 jours',    color:'#eab308', badge:'Performance' },
  { key:'patrimoine',  name:'Patrimoine',  price:'1 000 €',roi:'8,0%',  duration:90, dailyGain:'80,00 €',  totalProfit:'7 200,00 €', threshold:'1 jour',     color:'#94a3b8', badge:'Patrimoine' },
  { key:'vip_exec',    name:'VIP Exec',    price:'2 500 €',roi:'10,0%', duration:120,dailyGain:'250,00 €', totalProfit:'30 000,00 €',threshold:'Chaque jour', color:'var(--accent)', badge:'VIP' },
  { key:'club_prive',  name:'Club Privé',  price:'5 000 €',roi:'12,0%', duration:180,dailyGain:'600,00 €', totalProfit:'108 000,00 €',threshold:'Chaque jour',color:'var(--green)', badge:'Prestige' },
]

const PAYMENTS = [
  { name:'Bitcoin',  logo:'₿' },
  { name:'Ethereum', logo:'Ξ' },
  { name:'USDT',     logo:'₮' },
  { name:'BNB',      logo:'◆' },
]

const STATS = [
  { val:124, suffix:'M€+', label:'Actifs Gérés' },
  { val:18432, suffix:'+', label:'Investisseurs' },
  { val:12, suffix:'%/jour', label:'ROI Quotidien Max', decimals:0 },
  { val:190, suffix:'+', label:'Pays Pris en Charge' },
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
        padding:'0.6rem 1rem',
        background: isDark ? 'rgba(5,10,20,0.9)' : 'rgba(242,245,252,0.95)',
        backdropFilter:'blur(20px)',
        borderBottom:'1px solid var(--border)',
        gap:'0.5rem',
        minHeight: 56,
      }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
          <div style={{ width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,var(--accent),var(--accent-dark))',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px var(--accent-glow)', flexShrink:0 }}>
            <Zap size={15} color="#fff" />
          </div>
          <div>
            <span style={{ fontFamily:'"Poppins",sans-serif',fontWeight:700,fontSize:'0.95rem',lineHeight:1.2,display:'block' }}>
              <span style={{ color: isDark ? '#fff' : '#111' }}>OilAI</span>{' '}
              <span style={{ color:'var(--accent)' }}>Invest</span>
            </span>
            <div className="nav-subtitle" style={{ fontSize:8,color:'var(--text-muted)',letterSpacing:'0.08em',textTransform:'uppercase',lineHeight:1 }}>AI Investment</div>
          </div>
        </div>
        <div className="nav-links-desktop">
          <a href="#plans" className="nav-link">Plans</a>
          <a href="#calcul" className="nav-link">Calculator</a>
          <a href="#paiements" className="nav-link">Payments</a>
          <a href="#about" className="nav-link">About</a>
        </div>
        <div className="nav-buttons-wrap">
          <ThemeToggle compact />
          <Link to="/login" className="nav-btn-connexion">Log In</Link>
          <Link to="/register" className="btn-primary nav-btn-commencer">Get Started</Link>
        </div>
      </nav>

      {/* ── HERO SLIDER ── */}
      <section style={{ paddingTop:60 }}>
        <div style={{ width:'100%', maxWidth:'100%', margin:'0 auto', padding:'0', display:'flex', justifyContent:'center' }}>
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
          🔥 <strong>37 spots remaining</strong> for the Premium Plan this month — Join now!
        </p>
      </div>

      {/* ── PLANS ── */}
      <section id="plans" className="section-pad">
        <div style={{ maxWidth:1100,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:'2rem' }} className="reveal">
            <p style={{ fontSize:11,fontWeight:700,color:'var(--accent)',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:8 }}>💎 Our Plans</p>
            <h2 style={{ fontFamily:'"Poppins",sans-serif',fontSize:'clamp(1.5rem,4vw,2.5rem)',fontWeight:700,color:'var(--text-primary)' }}>
              Choose your <span className="gradient-text">growth plan</span>
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
                <p style={{ fontFamily:'"Poppins",sans-serif',fontSize:'2.2rem',fontWeight:800,color:plan.color,lineHeight:1,marginBottom:4 }}>{plan.roi}<span style={{ fontSize:12, fontWeight:500, color:'var(--text-muted)' }}> / jour</span></p>
                <p style={{ fontSize:13,fontWeight:700,color:'var(--text-primary)',marginBottom:'0.75rem' }}>Tarif : {plan.price} · {plan.duration} Jours</p>

                <div style={{ background:'var(--bg-card2)', borderRadius:10, padding:'0.6rem 0.75rem', marginBottom:'1rem', fontSize:11, display:'flex', flexDirection:'column', gap:3 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:'var(--text-muted)' }}>Gain par jour :</span><strong style={{ color:'var(--green)' }}>+{plan.dailyGain}</strong></div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:'var(--text-muted)' }}>Profit net total :</span><strong style={{ color:plan.color }}>+{plan.totalProfit}</strong></div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:'var(--text-muted)' }}>Seuil (50 €) :</span><strong style={{ color:'var(--text-primary)' }}>{plan.threshold}</strong></div>
                </div>

                <Link
                  to="/register"
                  style={{
                    display:'inline-flex',width:'100%',justifyContent:'center',
                    fontSize:13,padding:'0.75rem 1rem',borderRadius:14,
                    background:'linear-gradient(135deg,var(--accent),var(--accent-dark))',
                    color:'#fff',fontWeight:700,textDecoration:'none',alignItems:'center',
                    boxShadow:'0 4px 14px var(--accent-glow)',
                    transition:'all 0.2s',
                    whiteSpace:'nowrap',
                  }}>
                  Investir maintenant
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI CALCULATOR ── */}
      <section id="calcul" style={{ background:'var(--bg-card)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)' }} className="section-pad">
        <div style={{ maxWidth:820,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:'1.5rem' }} className="reveal">
            <p style={{ fontSize:11,fontWeight:700,color:'var(--accent)',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:8 }}>💹 Calculator</p>
            <h2 style={{ fontFamily:'"Poppins",sans-serif',fontSize:'clamp(1.3rem,3.5vw,2.2rem)',fontWeight:700,color:'var(--text-primary)' }}>
              Calculate your <span className="gradient-text">returns</span>
            </h2>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* ── PAYMENTS ── */}
      <section id="paiements" className="section-pad">
        <div style={{ maxWidth:800,margin:'0 auto',textAlign:'center' }}>
          <div className="reveal" style={{ marginBottom:'1.5rem' }}>
            <p style={{ fontSize:11,fontWeight:700,color:'var(--accent)',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:8 }}>🔒 Crypto Payments</p>
            <h2 style={{ fontFamily:'"Poppins",sans-serif',fontSize:'clamp(1.3rem,3.5vw,2.2rem)',fontWeight:700,color:'var(--text-primary)',marginBottom:10 }}>
              100% <span className="gradient-text">Cryptocurrencies</span>
            </h2>
            <p style={{ color:'var(--text-secondary)',fontSize:13,lineHeight:1.65,maxWidth:440,margin:'0 auto' }}>
              Deposit and withdraw seamlessly with Bitcoin, Ethereum, USDT, or BNB. Fast, secure, with zero banking delays.
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
              Get started in <span className="gradient-text">4 easy steps</span>
            </h2>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'1.25rem' }}>
            {[
              { n:'01', t:'Registration', d:'Free in under 2 mins', icon:'👤' },
              { n:'02', t:'Crypto Deposit', d:'BTC · ETH · USDT · BNB', icon:'💎' },
              { n:'03', t:'Choose a Plan', d:'Bronze to King', icon:'🎯' },
              { n:'04', t:'Earn Daily', d:'AI active 24/7', icon:'💰' },
            ].map(({ n, t, d, icon }, i) => (
              <div key={n} className={`reveal stagger-${i+1}`} style={{ textAlign:'center',padding:'1.25rem 0.875rem',background:'var(--bg-card2)',border:'1px solid var(--border)',borderRadius:16 }}>
                <div style={{ width:48,height:48,borderRadius:14,background:'var(--accent-glow)',border:'1.5px solid rgba(245,166,35,0.25)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.75rem',fontSize:22 }}>{icon}</div>
                <p style={{ fontSize:9,fontWeight:700,color:'var(--accent)',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.08em' }}>Step {n}</p>
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
            Your financial future<br /><span className="gradient-text">starts today</span>
          </h2>
          <p style={{ color:'var(--text-secondary)',marginBottom:'1.5rem',fontSize:13,lineHeight:1.65,maxWidth:440,margin:'0 auto 1.5rem' }} className="reveal">
            Over 18,000 investors generate daily profits with OilAI.
          </p>
          <div style={{ display:'flex',gap:'0.75rem',justifyContent:'center',flexWrap:'wrap' }} className="reveal">
            <Link to="/register" style={{
              display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,fontSize:'0.9rem',padding:'0.875rem 1.75rem',
              borderRadius:14,fontWeight:700,color:'#fff',background:'linear-gradient(135deg,var(--accent),var(--accent-dark))',textDecoration:'none',animation:'glowPulse 2.5s ease-in-out infinite'
            }}>
              🚀 Create Free Account
            </Link>
          </div>
          <p style={{ fontSize:11,color:'var(--text-muted)',marginTop:'1rem' }}>✅ Free Registration · ✅ No Contract · ✅ Instant Withdrawals</p>
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
          © 2025 OilAI Invest · Pan-African Investment Platform<br />
          Investing involves risk. Past performance does not guarantee future results.
        </p>
      </footer>

      {/* ── ABOUT SECTION ── */}
      <section id="about" style={{ padding:"5rem 1.25rem", background:"var(--bg-base)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:10 }}>🌍 Our Vision</p>
            <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(1.6rem,4vw,2.5rem)", fontWeight:700, color:"var(--text-primary)", marginBottom:14 }}>
              OilAI Invest — <span className="gradient-text">Building Africa&apos;s</span><br/>Financial Future
            </h2>
            <p style={{ color:"var(--text-secondary)", fontSize:14, lineHeight:1.7, maxWidth:620, margin:"0 auto" }}>
              We believe everyone deserves seamless access to global financial markets.
              Our artificial intelligence platform democratizes high-yield investment in the energy and oil sector.
            </p>
          </div>

          <div style={{ borderRadius:24, overflow:"hidden", marginBottom:"3rem", position:"relative", height:320 }}>
            <img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1400&q=80" alt="OilAI Invest"
              style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(6,11,15,0.85) 40%,transparent 100%)" }}/>
            <div style={{ position:"absolute", top:"50%", left:"2rem", transform:"translateY(-50%)", maxWidth:360 }}>
              <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(1.2rem,3vw,1.8rem)", fontWeight:700, color:"#fff", lineHeight:1.3, marginBottom:10 }}>
                Built to Serve<br/>18,000+ Investors
              </p>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.8)", lineHeight:1.6 }}>
                Since launch, over $124 million in profits have been distributed across 70+ countries.
              </p>
            </div>
          </div>

          <div style={{ display:"grid", gap:"1.5rem", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", marginBottom:"3rem" }}>
            {[
              { img:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80", tag:"🤖 Technology", title:"Cutting-Edge Energy Trading AI", text:"Our algorithm analyzes WTI, Brent data, and geopolitical factors in real time to maximize your returns." },
              { img:"https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80", tag:"🌍 Mission", title:"Pan-African Financial Inclusion", text:"We bridge global financial markets with African investors, eliminating traditional banking barriers." },
              { img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", tag:"🚀 Vision 2026", title:"Expansion & New Horizons", text:"Coming soon: investments in renewable energy, mining assets, and sovereign energy bonds." },
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
              { val:"2021",  label:"Founded" },
              { val:"70+",   label:"Countries" },
              { val:"18k+",  label:"Active Investors" },
              { val:"124M$", label:"Profits Distributed" },
              { val:"99.9%", label:"System Uptime" },
              { val:"24/7",  label:"AI Support" },
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
