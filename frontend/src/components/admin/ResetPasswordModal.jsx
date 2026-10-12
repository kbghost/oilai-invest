import { useState } from 'react'
import { adminAPI } from '../../services/api'
import { X, Key, Copy, Check, Eye, EyeOff, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResetPasswordModal({ user, onClose }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*'
    let generated = ''
    for (let i = 0; i < 12; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(generated)
    setShowPassword(true)
    toast.success('Generated secure password!')
  }

  const copyPassword = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Password copied to clipboard!')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)
    try {
      const res = await adminAPI.resetPassword(user._id, { newPassword: password })
      toast.success(res.data.message || 'Password reset successfully!')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error resetting password.')
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
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,166,35,0.15)', border: '1px solid rgba(255,166,35,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <Key size={18} />
          </div>
          <div>
            <h3 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
              Reset User Password
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {user.firstName} {user.lastName} ({user.email})
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="label" style={{ marginBottom: 0 }}>New Password</label>
              <button 
                type="button" 
                onClick={generatePassword} 
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 11, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Auto-generate
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="input" 
                placeholder="Enter minimum 6 characters…" 
                required 
                style={{ paddingRight: 75 }}
              />
              <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(p => !p)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {password && (
                  <button 
                    type="button" 
                    onClick={copyPassword} 
                    title="Copy password"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? 'var(--green)' : 'var(--text-muted)', padding: 4 }}
                  >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '0.75rem', background: 'rgba(255,166,35,0.08)', border: '1px solid rgba(255,166,35,0.2)', borderRadius: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
            <ShieldAlert size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 1 }} />
            <span>The user will be required to use this new password next time they log in. Make sure to copy and send it to them securely.</span>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? 'Resetting...' : 'Confirm Reset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
