import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { referralAPI } from '../services/api'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import { Copy, Check, Users, TrendingUp, Gift, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * 🎁 Système de parrainage OilAI Invest
 *
 * Comment ça marche :
 *  1. Chaque utilisateur a un code unique (ex: OILAI-A3F7C2)
 *  2. Il partage ce code à ses amis au moment de l'inscription
 *  3. Quand le filleul fait son 1er dépôt approuvé par l'admin
 *  4. Le parrain reçoit automatiquement 5% du montant de ce dépôt
 *
 * Exemple : filleul dépose $1 000 → parrain reçoit $50 directement sur son solde
 */

const BONUS_PERCENT = 5 // doit correspondre à REFERRAL_BONUS_PERCENT dans le backend

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => toast.success('Copié !'))
}

export default function Referral() {
  const { user } = useAuth()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    referralAPI.getStats()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode || ''}`

  if (loading) return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:300 }}>
      <div style={{ width:28,height:28,border:'2.5px solid var(--border)',borderTopColor:'var(--accent)',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div className="dash-enter" style={{ maxWidth:680,margin:'0 auto',display:'flex',flexDirection:'column',gap:'1.1rem' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontFamily:'"Clash Display",sans-serif',fontSize:'1.5rem',fontWeight:700,color:'var(--text-primary)',marginBottom:3 }}>Parrainage</h1>
        <p style={{ color:'var(--text-secondary)',fontSize:13 }}>Invitez des amis et gagnez {BONUS_PERCENT}% de leur premier dépôt</p>
      </div>

      {/* Bannière explicative */}
      <div style={{ background:'linear-gradient(135deg,var(--accent),var(--accent-dark))',borderRadius:18,padding:'1.25rem 1.5rem',color:'#fff',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:-20,right:-20,width:100,height:100,background:'rgba(255,255,255,0.1)',borderRadius:'50%' }} />
        <div style={{ position:'absolute',bottom:-30,left:'30%',width:120,height:120,background:'rgba(255,255,255,0.06)',borderRadius:'50%' }} />
        <div style={{ position:'relative',zIndex:1 }}>
          <Gift size={22} color="#fff" style={{ marginBottom:8 }} />
          <p style={{ fontSize:16,fontWeight:800,fontFamily:'"Clash Display",sans-serif',marginBottom:4 }}>
            Chaque filleul = {BONUS_PERCENT}% pour vous
          </p>
          <p style={{ fontSize:12,opacity:0.85,lineHeight:1.55 }}>
            Votre ami s'inscrit avec votre code, fait un dépôt de <strong>1 000$</strong>,
            vous recevez automatiquement <strong>50$</strong> sur votre solde.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.75rem' }}>
        {[
          { label:'Filleuls',         val:stats?.referralCount || 0,    icon:Users,    color:'var(--blue)' },
          { label:'Gains parrainage', val:stats?.referralEarnings || 0, icon:TrendingUp,color:'var(--green)', prefix:'$', decimals:2 },
          { label:'Bonus / filleul',  val:BONUS_PERCENT,                icon:Gift,     color:'var(--accent)', suffix:'%' },
        ].map(({ label, val, icon:Icon, color, prefix='', suffix='', decimals=0 }) => (
          <div key={label} className="float-card" style={{ textAlign:'center',padding:'1rem 0.5rem' }}>
            <div style={{ width:34,height:34,borderRadius:10,background:color+'15',border:`1px solid ${color}28`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px' }}>
              <Icon size={17} color={color} />
            </div>
            <p className="dash-stat-value" style={{ color:'var(--text-primary)',fontSize:'1.1rem',marginBottom:2 }}>
              <span style={{ fontSize:'0.75em',color:'var(--text-muted)' }}>{prefix}</span>
              <AnimatedCounter value={val} duration={1200} decimals={decimals} />
              <span style={{ fontSize:'0.75em',color:'var(--text-muted)' }}>{suffix}</span>
            </p>
            <p style={{ fontSize:10,color:'var(--text-muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Code + Lien */}
      <div className="float-card">
        <p style={{ fontFamily:'"Clash Display",sans-serif',fontWeight:700,color:'var(--text-primary)',marginBottom:'1rem',fontSize:'0.95rem' }}>
          Mon code de parrainage
        </p>

        {/* Code */}
        <div style={{ display:'flex',alignItems:'center',gap:10,padding:'0.875rem 1rem',background:'var(--bg-card2)',border:'2px dashed var(--accent)',borderRadius:14,marginBottom:10 }}>
          <p style={{ flex:1,fontFamily:'monospace',fontSize:'1.25rem',fontWeight:800,color:'var(--accent)',letterSpacing:'0.08em' }}>
            {user?.referralCode || stats?.referralCode || '—'}
          </p>
          <button onClick={() => copyToClipboard(user?.referralCode || stats?.referralCode || '')}
            style={{ padding:'0.4rem 0.75rem',background:'var(--accent)',border:'none',borderRadius:9,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:4,fontFamily:'inherit' }}>
            <Copy size={13} /> Copier
          </button>
        </div>

        {/* Lien complet */}
        <p style={{ fontSize:11,color:'var(--text-muted)',marginBottom:6,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em' }}>Lien d'invitation</p>
        <div style={{ display:'flex',alignItems:'center',gap:8,padding:'0.7rem 1rem',background:'var(--bg-card2)',borderRadius:12,border:'1px solid var(--border)' }}>
          <p style={{ flex:1,fontSize:11,color:'var(--text-secondary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:'monospace' }}>
            {referralLink}
          </p>
          <button onClick={() => copyToClipboard(referralLink)}
            style={{ flexShrink:0,padding:'0.35rem 0.6rem',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:8,color:'var(--accent)',fontSize:11,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:3,fontFamily:'inherit' }}>
            <Copy size={11} /> Copier
          </button>
        </div>

        {/* Partager via WhatsApp */}
        <a href={`https://wa.me/?text=Rejoins OilAI Invest et gagne jusqu'à 3.5%/jour sur le pétrole ! Utilise mon code : ${user?.referralCode || ''} ou inscris-toi ici : ${referralLink}`}
          target="_blank" rel="noreferrer"
          style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginTop:12,padding:'0.7rem',background:'#25D366',borderRadius:12,textDecoration:'none',color:'#fff',fontSize:13,fontWeight:700 }}>
          <span style={{ fontSize:16 }}>📲</span> Partager sur WhatsApp
        </a>
      </div>

      {/* Liste des filleuls */}
      <div className="float-card">
        <p style={{ fontFamily:'"Clash Display",sans-serif',fontWeight:700,color:'var(--text-primary)',marginBottom:'1rem',fontSize:'0.95rem' }}>
          Mes filleuls ({stats?.referralCount || 0})
        </p>

        {!stats?.filleuls?.length ? (
          <div style={{ textAlign:'center',padding:'2rem 0',color:'var(--text-muted)' }}>
            <Users size={32} style={{ margin:'0 auto 10px',opacity:0.3 }} />
            <p style={{ fontSize:13,marginBottom:6 }}>Aucun filleul pour l'instant</p>
            <p style={{ fontSize:11,color:'var(--text-muted)',lineHeight:1.5 }}>Partagez votre code et commencez à gagner dès que vos amis font leur premier dépôt.</p>
          </div>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
            {stats.filleuls.map((f, i) => (
              <div key={f._id || i} className="mobile-list-item">
                <div style={{ width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,var(--accent),var(--accent-dark))',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:12,flexShrink:0 }}>
                  {f.firstName?.[0]}{f.lastName?.[0]}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <p style={{ fontWeight:600,color:'var(--text-primary)',fontSize:13 }}>{f.firstName} {f.lastName}</p>
                  <p style={{ fontSize:11,color:'var(--text-muted)' }}>Inscrit le {new Date(f.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div style={{ textAlign:'right',flexShrink:0 }}>
                  <p style={{ fontSize:11,color:'var(--text-muted)' }}>Investi</p>
                  <p style={{ fontWeight:700,color:'var(--accent)',fontSize:13 }}>${(f.totalInvested||0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment ça marche */}
      <div className="float-card">
        <p style={{ fontFamily:'"Clash Display",sans-serif',fontWeight:700,color:'var(--text-primary)',marginBottom:'1rem',fontSize:'0.95rem' }}>Comment ça marche ?</p>
        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          {[
            { n:'1', t:'Partagez votre code', d:`Envoyez votre code ${user?.referralCode||'OILAI-XXXXXX'} à vos amis ou le lien d'invitation.` },
            { n:'2', t:'Votre ami s\'inscrit', d:'Il crée son compte et entre votre code dans le champ "Code de parrainage".' },
            { n:'3', t:'Il fait son 1er dépôt', d:`Dès que son premier dépôt est approuvé, le bonus est calculé.` },
            { n:'4', t:`Vous recevez ${BONUS_PERCENT}%`, d:'Le bonus est crédité instantanément sur votre solde, disponible pour investir ou retirer.' },
          ].map(({ n, t, d }) => (
            <div key={n} style={{ display:'flex',gap:12,alignItems:'flex-start' }}>
              <div style={{ width:24,height:24,borderRadius:8,background:'var(--accent-glow)',border:'1px solid var(--accent-glow)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'var(--accent)',flexShrink:0,marginTop:1 }}>{n}</div>
              <div>
                <p style={{ fontWeight:700,color:'var(--text-primary)',fontSize:13,marginBottom:2 }}>{t}</p>
                <p style={{ fontSize:12,color:'var(--text-secondary)',lineHeight:1.5 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
