import { useEffect, useState } from 'react'
import { depositAPI } from '../../services/api'
import { Check, X, Eye, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

// URL de base du backend pour afficher les preuves de paiement
const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:5000'

const PAYMENT_EMOJIS = { bitcoin:'₿', ethereum:'Ξ', usdt:'₮', bnb:'◆' }
const METHOD_LABELS  = { bitcoin:'Bitcoin', ethereum:'Ethereum', usdt:'USDT TRC20', bnb:'BNB' }

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState([])
  const [status, setStatus]     = useState('pending')
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)
  const [action, setAction]     = useState('')
  const [note, setNote]         = useState('')

  const [loadError, setLoadError] = useState(null)

  const load = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const r = await depositAPI.adminGetAll({ status })
      setDeposits(r.data.deposits)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur de chargement'
      setLoadError(msg)
      toast.error('Dépôts : ' + msg)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [status])

  const confirm = async () => {
    try {
      if (action === 'approve') await depositAPI.approve(modal._id, { note })
      else await depositAPI.reject(modal._id, { note })
      toast.success(`Dépôt ${action === 'approve' ? 'approuvé ✅' : 'rejeté ❌'}`)
      setModal(null); setNote('')
      await load()
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur'
      toast.error(msg)
    }
  }

  const STATUS_TABS = [
    { val: 'pending',  label: 'En attente', color: 'var(--accent)' },
    { val: 'approved', label: 'Approuvés',  color: 'var(--green)' },
    { val: 'rejected', label: 'Rejetés',    color: 'var(--red)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Dépôts</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Valider et gérer les demandes de dépôt</p>
      </div>

      {loadError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.875rem 1rem', background: 'rgba(255,75,110,0.08)', border: '1px solid rgba(255,75,110,0.2)', borderRadius: 12, color: 'var(--red)', fontSize: 13 }}>
          <AlertCircle size={16} />
          <span><strong>Erreur :</strong> {loadError} — Vérifiez que le backend est démarré et que MongoDB est connecté.</span>
        </div>
      )}

      <div className="tab-bar" style={{ width: 'fit-content' }}>
        {STATUS_TABS.map(({ val, label }) => (
          <button key={val} className={'tab-btn' + (status === val ? ' active' : '')} onClick={() => setStatus(val)}>{label}</button>
        ))}
      </div>

      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '1.5rem' }}>Utilisateur</th>
              <th>Mode</th>
              <th style={{ textAlign: 'right' }}>Montant</th>
              <th style={{ textAlign: 'center' }}>Date</th>
              <th style={{ textAlign: 'center' }}>Statut</th>
              {status === 'pending' && <th style={{ textAlign: 'center', paddingRight: '1.5rem' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Chargement…</td></tr>
            ) : deposits.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Aucun dépôt</td></tr>
            ) : deposits.map(d => (
              <tr key={d._id}>
                <td style={{ paddingLeft: '1.5rem' }}>
                  <p style={{ fontWeight: 600 }}>{d.user?.firstName} {d.user?.lastName}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.user?.email}</p>
                </td>
                <td>
                  <span style={{ fontSize: 16, marginRight: 6 }}>{PAYMENT_EMOJIS[d.method] || '💳'}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{METHOD_LABELS[d.method] || d.method}</span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--green)' }}>+${d.amount?.toLocaleString()}</td>
                <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>{new Date(d.createdAt).toLocaleDateString('fr-FR')}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={'badge-' + d.status}>{d.status === 'pending' ? 'En attente' : d.status === 'approved' ? 'Approuvé' : 'Rejeté'}</span>
                </td>
                {status === 'pending' && (
                  <td style={{ textAlign: 'center', paddingRight: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      {d.proofImage && (
                        <a href={`${API_BASE}/${d.proofImage.replace(/\\/g, '/')}`} target="_blank" rel="noreferrer"
                          style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(59,142,255,0.1)', border: '1px solid rgba(59,142,255,0.2)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                          <Eye size={13} />
                        </a>
                      )}
                      <button onClick={() => { setModal(d); setAction('approve'); setNote('') }}
                        style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(0,212,160,0.1)', border: '1px solid rgba(0,212,160,0.2)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Check size={13} />
                      </button>
                      <button onClick={() => { setModal(d); setAction('reject'); setNote('') }}
                        style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,75,110,0.1)', border: '1px solid rgba(255,75,110,0.2)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={13} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={() => setModal(null)} />
          <div className="card" style={{ position: 'relative', width: '100%', maxWidth: 380, zIndex: 1 }}>
            <h3 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              {action === 'approve' ? '✅ Approuver' : '❌ Rejeter'} le dépôt
            </h3>
            <div style={{ padding: '0.875rem', background: 'var(--bg-card2)', borderRadius: 12, marginBottom: '1rem' }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{modal.user?.firstName} {modal.user?.lastName}</p>
              <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, color: 'var(--accent)', fontSize: '1.2rem' }}>${modal.amount?.toLocaleString()}</p>
            </div>
            <div>
              <label className="label">Note admin (optionnel)</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} className="input" style={{ height: 80, resize: 'none' }} placeholder="Message pour l'utilisateur…" />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: '1.25rem' }}>
              <button onClick={() => setModal(null)} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Annuler</button>
              <button onClick={confirm} style={{ flex: 1, padding: '0.75rem', borderRadius: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, border: 'none', color: '#fff', background: action === 'approve' ? 'linear-gradient(135deg, var(--green), #00a87d)' : 'linear-gradient(135deg, var(--red), #b02040)' }}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
