import { useState } from 'react'
import { adminAPI } from '../../services/api'
import { X, DollarSign, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdjustBalanceModal({ user, onClose, onBalanceAdjusted }) {
  const [form, setForm] = useState({ amount: '', type: 'credit', note: '' })
  const [loading, setLoading] = useState(false)

  const numAmount = parseFloat(form.amount) || 0
  const currentBalance = user.balance || 0
  const newBalance = form.type === 'credit' 
    ? currentBalance + numAmount 
    : Math.max(0, currentBalance - numAmount)

  const QUICK_AMOUNTS = [50, 100, 250, 500, 1000]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || numAmount <= 0) {
      toast.error('Please enter a valid amount greater than 0.')
      return
    }

    if (form.type === 'debit' && currentBalance < numAmount) {
      toast.error('User balance is insufficient for this debit.')
      return
    }

    setLoading(true)
    try {
      const res = await adminAPI.adjustBalance(user._id, form)
      toast.success(res.data.message || 'Balance adjusted successfully!')
      onBalanceAdjusted?.(res.data.user)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adjusting balance.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div 
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }} 
        onClick={onClose} 
      />

      <div className="card" style={{ position: 'relative', width: '100%', maxWidth: 420, zIndex: 1, borderRadius: 20 }}>
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute', 
            top: 14, 
            right: 14, 
            background: 'var(--bg-card2)', 
            border: '1px solid var(--border)', 
            borderRadius: 8, 
            padding: 5, 
            cursor: 'pointer', 
            color: 'var(--text-muted)', 
            display: 'flex' 
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <DollarSign size={18} />
          </div>
          <div>
            <h3 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
              Adjust User Balance
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {user.firstName} {user.lastName} ({user.email})
            </p>
          </div>
        </div>

        {/* Current & Projected Balance Card */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: 'var(--bg-card2)', borderRadius: 14, marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>CURRENT BALANCE</p>
            <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ${currentBalance.toFixed(2)}
            </p>
          </div>

          <ArrowRight size={18} color="var(--text-muted)" />

          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>AFTER ADJUSTMENT</p>
            <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.25rem', fontWeight: 700, color: form.type === 'credit' ? 'var(--green)' : 'var(--red)' }}>
              ${newBalance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Credit / Debit Selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
          {['credit', 'debit'].map(t => (
            <button 
              key={t} 
              type="button"
              onClick={() => setForm(p => ({ ...p, type: t }))}
              style={{ 
                flex: 1, 
                padding: '0.65rem', 
                borderRadius: 12, 
                fontSize: 13, 
                fontWeight: 700, 
                cursor: 'pointer', 
                transition: 'all 0.2s', 
                fontFamily: 'inherit', 
                textTransform: 'capitalize', 
                background: form.type === t ? (t === 'credit' ? 'rgba(0,212,160,0.15)' : 'rgba(255,75,110,0.15)') : 'var(--bg-card2)', 
                color: form.type === t ? (t === 'credit' ? 'var(--green)' : 'var(--red)') : 'var(--text-muted)', 
                border: form.type === t ? `1px solid ${t === 'credit' ? 'rgba(0,212,160,0.3)' : 'rgba(255,75,110,0.3)'}` : '1px solid var(--border)' 
              }}
            >
              {t === 'credit' ? '+ Credit (Add Funds)' : '- Debit (Deduct Funds)'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Quick Amounts */}
          <div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {QUICK_AMOUNTS.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, amount: String(amt) }))}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: form.amount === String(amt) ? 'var(--accent-glow)' : 'var(--bg-card2)',
                    color: form.amount === String(amt) ? 'var(--accent)' : 'var(--text-secondary)',
                    border: form.amount === String(amt) ? '1px solid var(--accent)' : '1px solid var(--border)',
                    fontFamily: 'inherit'
                  }}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div>
              <label className="label">Amount ($ USD)</label>
              <input 
                type="number" 
                step="any"
                min="0.01" 
                value={form.amount} 
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} 
                className="input" 
                placeholder="0.00" 
                required 
              />
            </div>
          </div>

          <div>
            <label className="label">Reason / Admin Note (optional)</label>
            <input 
              type="text" 
              value={form.note} 
              onChange={e => setForm(p => ({ ...p, note: e.target.value }))} 
              className="input" 
              placeholder="e.g. Deposit correction, Promo reward..." 
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? 'Processing...' : 'Confirm Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
