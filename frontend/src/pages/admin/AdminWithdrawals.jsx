import { useEffect, useState } from 'react'
import { withdrawalAPI } from '../../services/api'
import { Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const PAYMENT_EMOJIS = { bitcoin:'₿', ethereum:'Ξ', usdt:'₮', bnb:'◆' }
const METHOD_LABELS  = { bitcoin:'Bitcoin', ethereum:'Ethereum', usdt:'USDT TRC20', bnb:'BNB' }

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([])
  const [status, setStatus]           = useState('pending')
  const [loading, setLoading]         = useState(true)
  const [modal, setModal]             = useState(null)
  const [action, setAction]           = useState('')
  const [form, setForm]               = useState({ note: '', txHash: '' })

  const load = async () => {
    setLoading(true)
    try { const r = await withdrawalAPI.adminGetAll({ status }); setWithdrawals(r.data.withdrawals) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [status])

  const confirm = async () => {
    try {
      if (action === 'approve') await withdrawalAPI.approve(modal._id, form)
      else await withdrawalAPI.reject(modal._id, form)
      toast.success('Retrait ' + (action === 'approve' ? 'approuvé' : 'rejeté'))
      setModal(null); setForm({ note: '', txHash: '' }); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur') }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Retraits</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Valider et traiter les demandes de retrait</p>
      </div>

      <div className="tab-bar" style={{ width: 'fit-content' }}>
        {[['pending','En attente'],['approved','Approuvés'],['rejected','Rejetés']].map(([val,label]) => (
          <button key={val} className={'tab-btn' + (status === val ? ' active' : '')} onClick={() => setStatus(val)}>{label}</button>
        ))}
      </div>

      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '1.5rem' }}>Utilisateur</th>
              <th>Mode</th>
              <th>Adresse / Numéro</th>
              <th style={{ textAlign: 'right' }}>Montant</th>
              <th style={{ textAlign: 'center' }}>Date</th>
              <th style={{ textAlign: 'center' }}>Statut</th>
              {status === 'pending' && <th style={{ textAlign: 'center', paddingRight: '1.5rem' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Chargement…</td></tr>
            ) : withdrawals.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Aucun retrait</td></tr>
            ) : withdrawals.map(w => (
              <tr key={w._id}>
                <td style={{ paddingLeft: '1.5rem' }}>
                  <p style={{ fontWeight: 600 }}>{w.user?.firstName} {w.user?.lastName}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{w.user?.email}</p>
                </td>
                <td>
                  <span style={{ fontSize: 16, marginRight: 6 }}>{PAYMENT_EMOJIS[w.method] || '💸'}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{METHOD_LABELS[w.method] || w.method}</span>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {w.walletAddress}
                </td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--red)' }}>-${w.amount?.toLocaleString()}</td>
                <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>{new Date(w.createdAt).toLocaleDateString('fr-FR')}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={'badge-' + w.status}>{w.status === 'pending' ? 'En attente' : w.status === 'approved' ? 'Approuvé' : 'Rejeté'}</span>
                </td>
                {status === 'pending' && (
                  <td style={{ textAlign: 'center', paddingRight: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <button onClick={() => { setModal(w); setAction('approve'); setForm({ note:'', txHash:'' }) }}
                        style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(0,212,160,0.1)', border: '1px solid rgba(0,212,160,0.2)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Check size={13} />
                      </button>
                      <button onClick={() => { setModal(w); setAction('reject'); setForm({ note:'', txHash:'' }) }}
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
          <div className="card" style={{ position: 'relative', width: '100%', maxWidth: 400, zIndex: 1 }}>
            <h3 style={{ fontFamily: '"Clash Display", sans-serif', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              {action === 'approve' ? '✅ Approuver' : '❌ Rejeter'} le retrait
            </h3>
            <div style={{ padding: '0.875rem', background: 'var(--bg-card2)', borderRadius: 12, marginBottom: '1rem' }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{modal.user?.firstName} {modal.user?.lastName}</p>
              <p style={{ fontFamily: '"Clash Display", sans-serif', fontWeight: 700, color: 'var(--red)', fontSize: '1.2rem', marginBottom: 4 }}>-${modal.amount?.toLocaleString()}</p>
              <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{modal.walletAddress}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {action === 'approve' && (
                <div>
                  <label className="label">Hash de transaction (optionnel)</label>
                  <input value={form.txHash} onChange={e => setForm(p => ({ ...p, txHash: e.target.value }))} className="input" placeholder="TX hash / référence" />
                </div>
              )}
              <div>
                <label className="label">Note admin</label>
                <textarea value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} className="input" style={{ height: 72, resize: 'none' }} placeholder="Message pour l'utilisateur…" />
              </div>
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
