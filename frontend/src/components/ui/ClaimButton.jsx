/**
 * ClaimButton.jsx — Bouton "Réclamer mes gains"
 *
 * MODIFIER LE COMPORTEMENT :
 *   - Le cooldown est géré côté backend (investmentController.js → CLAIM_COOLDOWN_HOURS)
 *   - Le frontend affiche le compte à rebours basé sur nextClaimAt retourné par l'API
 *
 * PROPS :
 *   investment  : objet investissement (doit avoir .pendingProfit, .lastClaimDate, ._id)
 *   onClaimed   : callback appelé après un claim réussi (recharge les données)
 */
import { useState, useEffect } from 'react'
import { investmentAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Zap, Clock, Check, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

function useCountdown(nextClaimAt) {
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    if (!nextClaimAt) return
    const update = () => {
      const ms = new Date(nextClaimAt) - Date.now()
      if (ms <= 0) { setRemaining(null); return }
      const h = Math.floor(ms / 3600000)
      const m = Math.floor((ms % 3600000) / 60000)
      const s = Math.floor((ms % 60000) / 1000)
      setRemaining({ h, m, s, total: ms })
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [nextClaimAt])

  return remaining
}

export default function ClaimButton({ investment, onClaimed }) {
  const { updateUser, user } = useAuth()
  const [loading, setLoading]       = useState(false)
  const [claimed, setClaimed]       = useState(false)
  const [nextClaimAt, setNextClaimAt] = useState(() => {
    if (investment.nextClaimAt) {
      const next = new Date(investment.nextClaimAt).getTime()
      return next > Date.now() ? new Date(next) : null
    }
    // Backward compatibility if nextClaimAt is missing
    if (!investment.lastClaimDate) return null
    const next = new Date(investment.lastClaimDate).getTime() + 24 * 60 * 60 * 1000
    return next > Date.now() ? new Date(next) : null
  })

  const countdown = useCountdown(nextClaimAt)
  const canClaim  = !countdown && (investment.pendingProfit || 0) > 0 && !claimed
  const pending   = parseFloat((investment.pendingProfit || 0).toFixed(2))

  const handleClaim = async () => {
    if (!canClaim || loading) return
    setLoading(true)
    try {
      const { data } = await investmentAPI.claim(investment._id)
      toast.success(data.message, { duration: 4000 })
      setClaimed(true)
      setNextClaimAt(new Date(data.nextClaimAt))
      // Mettre à jour le solde affiché dans la navbar/header
      if (user && data.profitClaimed) {
        updateUser({ ...user, balance: (user.balance || 0) + data.profitClaimed })
      }
      if (onClaimed) onClaimed()
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de la réclamation'
      toast.error(msg)
      if (err.response?.data?.nextClaimAt) {
        setNextClaimAt(new Date(err.response.data.nextClaimAt))
      }
    } finally { setLoading(false) }
  }

  // ── Déjà réclamé aujourd'hui ──
  if (countdown) {
    return (
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0.75rem 1rem',
        background:'var(--bg-card2)', borderRadius:14,
        border:'1px solid var(--border)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:10, background:'rgba(110,128,121,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Lock size={15} color="var(--text-muted)" />
          </div>
          <div>
            <p style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)' }}>Prochain claim dans</p>
            <p style={{ fontSize:11, color:'var(--text-muted)' }}>
              Gain en attente demain : <span style={{ color:'var(--accent)', fontWeight:700 }}>
                ~${pending > 0 ? pending.toFixed(2) : (investment.amount * investment.dailyROI / 100).toFixed(2)}
              </span>
            </p>
          </div>
        </div>
        <div style={{
          fontFamily:'monospace', fontWeight:800, fontSize:15,
          color:'var(--text-primary)',
          padding:'0.4rem 0.75rem',
          background:'var(--bg-card)', border:'1px solid var(--border)',
          borderRadius:10,
        }}>
          {String(countdown.h).padStart(2,'0')}:{String(countdown.m).padStart(2,'0')}:{String(countdown.s).padStart(2,'0')}
        </div>
      </div>
    )
  }

  // ── Déjà réclamé (feedback immédiat) ──
  if (claimed) {
    return (
      <div style={{
        display:'flex', alignItems:'center', gap:8, padding:'0.875rem 1rem',
        background:'rgba(34,197,94,0.08)', borderRadius:14,
        border:'1px solid rgba(34,197,94,0.2)',
      }}>
        <Check size={18} color="var(--green)" strokeWidth={3} />
        <p style={{ fontSize:13, fontWeight:700, color:'var(--green)' }}>Gains crédités sur votre solde !</p>
      </div>
    )
  }

  // ── Bouton actif ──
  return (
    <button
      onClick={handleClaim}
      disabled={loading || !canClaim}
      style={{
        width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0.875rem 1.25rem',
        background: canClaim
          ? 'linear-gradient(135deg, var(--accent), var(--accent-dark))'
          : 'var(--bg-card2)',
        border:'none', borderRadius:14,
        cursor: canClaim ? 'pointer' : 'not-allowed',
        transition:'all 0.2s', boxShadow: canClaim ? '0 4px 16px var(--accent-glow)' : 'none',
        fontFamily:'inherit',
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {loading
          ? <div style={{ width:20, height:20, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
          : <div style={{ width:32, height:32, borderRadius:10, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Zap size={17} color="#fff" />
            </div>
        }
        <div style={{ textAlign:'left' }}>
          <p style={{ fontSize:13, fontWeight:800, color:'#fff', marginBottom:1 }}>
            {loading ? 'Traitement...' : 'Réclamer mes gains'}
          </p>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.8)' }}>
            {canClaim ? `+$${pending.toFixed(2)} disponibles` : 'Aucun gain disponible'}
          </p>
        </div>
      </div>
      {canClaim && !loading && (
        <div style={{
          padding:'0.4rem 0.875rem', background:'rgba(255,255,255,0.2)',
          borderRadius:10, fontSize:14, fontWeight:800, color:'#fff',
        }}>
          +${pending.toFixed(2)}
        </div>
      )}
    </button>
  )
}
