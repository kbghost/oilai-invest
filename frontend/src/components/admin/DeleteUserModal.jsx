import { useState } from 'react'
import { adminAPI } from '../../services/api'
import { X, AlertTriangle, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DeleteUserModal({ user, onClose, onUserDeleted }) {
  const [confirmInput, setConfirmInput] = useState('')
  const [loading, setLoading] = useState(false)

  const isConfirmed = confirmInput.trim().toUpperCase() === 'DELETE'

  const handleDelete = async (e) => {
    e.preventDefault()
    if (!isConfirmed) return

    setLoading(true)
    try {
      const res = await adminAPI.deleteUser(user._id)
      toast.success(res.data.message || 'User deleted successfully')
      onUserDeleted?.(user._id)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting user.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 85, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div 
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} 
        onClick={onClose} 
      />

      <div className="card" style={{ position: 'relative', width: '100%', maxWidth: 440, zIndex: 1, borderRadius: 20, border: '1px solid rgba(255,75,110,0.3)' }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,75,110,0.15)', border: '1px solid rgba(255,75,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', flexShrink: 0 }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, color: 'var(--red)', fontSize: '1.2rem', lineHeight: 1.2 }}>
              Delete User Account
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Permanent action cannot be undone
            </p>
          </div>
        </div>

        <div style={{ padding: '0.875rem 1rem', background: 'var(--bg-card2)', borderRadius: 14, marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>
            {user.firstName} {user.lastName}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {user.email}
          </p>
          <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, marginTop: 4 }}>
            Balance: ${(user.balance || 0).toFixed(2)}
          </p>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
          Deleting this user will permanently remove their investments, pending transactions, and sponsorship links. To confirm, type <strong>DELETE</strong> below:
        </p>

        <form onSubmit={handleDelete} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input 
            type="text" 
            value={confirmInput} 
            onChange={e => setConfirmInput(e.target.value)} 
            placeholder='Type "DELETE" to confirm' 
            className="input" 
            style={{ borderColor: isConfirmed ? 'var(--red)' : undefined }}
          />

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!isConfirmed || loading} 
              style={{ 
                flex: 1, 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '0.75rem', 
                borderRadius: 14, 
                fontWeight: 700, 
                fontSize: 14, 
                cursor: isConfirmed ? 'pointer' : 'not-allowed', 
                opacity: isConfirmed ? 1 : 0.5,
                border: 'none', 
                color: '#fff', 
                background: 'linear-gradient(135deg, var(--red), #b02040)',
                fontFamily: 'inherit' 
              }}
            >
              <Trash2 size={15} />
              {loading ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
