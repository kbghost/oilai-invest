import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { 
  X, User, Mail, Phone, Globe, Shield, CheckCircle2, XCircle, 
  DollarSign, TrendingUp, ArrowDownCircle, ArrowUpCircle, 
  Share2, Key, Edit3, Trash2, Calendar, Clock, Copy, Check,
  ExternalLink, AlertTriangle, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

const METHOD_EMOJIS = { bitcoin: '₿', ethereum: 'Ξ', usdt: '₮', bnb: '◆' }
const METHOD_LABELS = { bitcoin: 'Bitcoin', ethereum: 'Ethereum', usdt: 'USDT TRC20', bnb: 'BNB' }

// Base URL for uploads
const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:5000'

export default function UserDetailModal({ 
  userId, 
  onClose, 
  onUserUpdated, 
  onOpenAdjustBalance,
  onOpenResetPassword,
  onOpenDeleteUser
}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview') // overview, investments, deposits, withdrawals, referrals, edit
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Edit form state
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    role: 'user',
    isVerified: false,
    isActive: true
  })
  const [editSaving, setEditSaving] = useState(false)

  const loadUserDetails = async () => {
    setLoading(true)
    try {
      const res = await adminAPI.getUserDetails(userId)
      setData(res.data)
      const u = res.data.user
      setEditForm({
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        email: u.email || '',
        phone: u.phone || '',
        country: u.country || '',
        role: u.role || 'user',
        isVerified: Boolean(u.isVerified),
        isActive: Boolean(u.isActive)
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error loading user details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      loadUserDetails()
    }
  }, [userId])

  const copyText = (text, type) => {
    navigator.clipboard.writeText(text)
    if (type === 'code') {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } else {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    }
    toast.success('Copied to clipboard!')
  }

  const handleToggleStatus = async () => {
    setActionLoading(true)
    try {
      const res = await adminAPI.toggleStatus(userId)
      toast.success(res.data.message)
      setData(prev => prev ? { ...prev, user: res.data.user } : prev)
      setEditForm(prev => ({ ...prev, isActive: res.data.user.isActive }))
      onUserUpdated?.(res.data.user)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleVerify = async () => {
    setActionLoading(true)
    try {
      const updatedVerified = !data.user.isVerified
      const res = await adminAPI.updateUser(userId, { isVerified: updatedVerified })
      toast.success(updatedVerified ? 'User marked as Verified ✅' : 'User marked as Unverified')
      setData(prev => prev ? { ...prev, user: res.data.user } : prev)
      setEditForm(prev => ({ ...prev, isVerified: res.data.user.isVerified }))
      onUserUpdated?.(res.data.user)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle verification')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setEditSaving(true)
    try {
      const res = await adminAPI.updateUser(userId, editForm)
      toast.success('User profile updated successfully!')
      setData(prev => prev ? { ...prev, user: res.data.user } : prev)
      onUserUpdated?.(res.data.user)
      setActiveTab('overview')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setEditSaving(false)
    }
  }

  const handleCancelInvestment = async (invId) => {
    if (!window.confirm('Cancel this investment? Principal will be refunded to user balance.')) return
    try {
      const res = await adminAPI.updateInvestmentStatus(invId, { status: 'cancelled', refund: true })
      toast.success(res.data.message)
      loadUserDetails()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel investment')
    }
  }

  const handleCompleteInvestment = async (invId) => {
    if (!window.confirm('Mark this investment as completed?')) return
    try {
      const res = await adminAPI.updateInvestmentStatus(invId, { status: 'completed' })
      toast.success(res.data.message)
      loadUserDetails()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update investment')
    }
  }

  const u = data?.user
  const stats = data?.stats || {}
  const investments = data?.investments || []
  const deposits = data?.deposits || []
  const withdrawals = data?.withdrawals || []
  const referrals = data?.referrals || []

  const TABS = [
    { id: 'overview',     label: 'Overview',     icon: User,          count: null },
    { id: 'investments',  label: 'Investments',  icon: TrendingUp,    count: investments.length },
    { id: 'deposits',     label: 'Deposits',     icon: ArrowDownCircle, count: deposits.length },
    { id: 'withdrawals',  label: 'Withdrawals',  icon: ArrowUpCircle, count: withdrawals.length },
    { id: 'referrals',    label: 'Referrals',    icon: Share2,        count: referrals.length },
    { id: 'edit',         label: 'Edit Profile', icon: Edit3,         count: null },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* Backdrop */}
      <div 
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div 
        className="card" 
        style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: 920, 
          maxHeight: '92vh', 
          zIndex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          padding: 0,
          overflow: 'hidden',
          borderRadius: 24,
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7)'
        }}
      >
        {/* Header Bar */}
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          borderBottom: '1px solid var(--border)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'var(--bg-card2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: 10, 
              background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#fff'
            }}>
              <User size={16} />
            </div>
            <div>
              <h2 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                User 360° Profile
              </h2>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Comprehensive records & administrative controls
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button 
              onClick={loadUserDetails} 
              title="Refresh user data"
              disabled={loading}
              style={{ 
                width: 34, 
                height: 34, 
                borderRadius: 10, 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer', 
                color: 'var(--text-secondary)' 
              }}
            >
              <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
            </button>
            <button 
              onClick={onClose} 
              style={{ 
                width: 34, 
                height: 34, 
                borderRadius: 10, 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer', 
                color: 'var(--text-secondary)' 
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', gap: 12 }}>
            <div style={{ width: 36, height: 36, border: '2.5px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading user records…</p>
          </div>
        ) : !u ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--red)' }}>
            User information not available.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
            {/* Top Identity Banner */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                {/* Left: Avatar & Identity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ 
                    width: 54, 
                    height: 54, 
                    borderRadius: 16, 
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#fff', 
                    fontWeight: 800, 
                    fontSize: 18, 
                    flexShrink: 0,
                    boxShadow: '0 8px 20px var(--accent-glow)'
                  }}>
                    {u.firstName?.[0]}{u.lastName?.[0]}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                      <span style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {u.firstName} {u.lastName}
                      </span>
                      <span className={u.isActive ? 'badge-approved' : 'badge-rejected'}>
                        {u.isActive ? 'Active' : 'Banned'}
                      </span>
                      <span className={u.isVerified ? 'badge-active' : 'badge-rejected'}>
                        {u.isVerified ? 'Verified KYC' : 'Unverified'}
                      </span>
                      {u.role === 'admin' && (
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(167,139,250,0.18)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}>
                          Admin
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Mail size={12} color="var(--text-muted)" />
                        <span>{u.email}</span>
                        <button onClick={() => copyText(u.email, 'email')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 2 }}>
                          {copiedEmail ? <Check size={11} color="var(--green)" /> : <Copy size={11} />}
                        </button>
                      </div>

                      {u.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Phone size={12} color="var(--text-muted)" />
                          <span>{u.phone}</span>
                        </div>
                      )}

                      {u.country && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Globe size={12} color="var(--text-muted)" />
                          <span>{u.country}</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Code:</span>
                        <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace' }}>{u.referralCode}</span>
                        <button onClick={() => copyText(u.referralCode, 'code')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 2 }}>
                          {copiedCode ? <Check size={11} color="var(--green)" /> : <Copy size={11} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => onOpenAdjustBalance?.(u)}
                    className="btn-primary" 
                    style={{ fontSize: 12, padding: '0.5rem 0.9rem', borderRadius: 10 }}
                  >
                    <DollarSign size={13} />
                    Adjust Balance
                  </button>

                  <button 
                    onClick={() => onOpenResetPassword?.(u)}
                    className="btn-ghost" 
                    style={{ fontSize: 12, padding: '0.5rem 0.9rem', borderRadius: 10 }}
                  >
                    <Key size={13} />
                    Reset Pass
                  </button>

                  <button 
                    onClick={handleToggleStatus} 
                    disabled={actionLoading}
                    style={{ 
                      fontSize: 12, 
                      padding: '0.5rem 0.9rem', 
                      borderRadius: 10,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontFamily: 'inherit',
                      background: u.isActive ? 'rgba(255,75,110,0.1)' : 'rgba(0,212,160,0.1)',
                      borderColor: u.isActive ? 'rgba(255,75,110,0.25)' : 'rgba(0,212,160,0.25)',
                      color: u.isActive ? 'var(--red)' : 'var(--green)'
                    }}
                  >
                    {u.isActive ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
                    {u.isActive ? 'Ban Account' : 'Activate'}
                  </button>

                  <button 
                    onClick={handleToggleVerify} 
                    disabled={actionLoading}
                    style={{ 
                      fontSize: 12, 
                      padding: '0.5rem 0.9rem', 
                      borderRadius: 10,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid rgba(59,142,255,0.25)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontFamily: 'inherit',
                      background: 'rgba(59,142,255,0.1)',
                      color: 'var(--blue)'
                    }}
                  >
                    <Shield size={13} />
                    {u.isVerified ? 'Unverify KYC' : 'Verify KYC'}
                  </button>

                  <button 
                    onClick={() => onOpenDeleteUser?.(u)}
                    title="Delete User"
                    style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: 10, 
                      background: 'rgba(255,75,110,0.08)', 
                      border: '1px solid rgba(255,75,110,0.2)', 
                      color: 'var(--red)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer' 
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg-card2)', padding: '0 1rem', overflowX: 'auto' }}>
              {TABS.map(({ id, label, icon: Icon, count }) => {
                const isActive = activeTab === id
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      padding: '0.85rem 1rem',
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 13,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                    {count !== null && (
                      <span style={{ 
                        fontSize: 10, 
                        fontWeight: 700, 
                        padding: '1px 6px', 
                        borderRadius: 999, 
                        background: isActive ? 'var(--accent-glow)' : 'var(--bg-card)', 
                        color: isActive ? 'var(--accent)' : 'var(--text-muted)' 
                      }}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Tab Contents (Scrollable) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Financial KPI Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                    <div style={{ padding: '1rem', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 16 }}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Balance</p>
                      <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent)' }}>
                        ${(u.balance || 0).toFixed(2)}
                      </p>
                    </div>

                    <div style={{ padding: '1rem', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 16 }}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Deposited</p>
                      <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.35rem', fontWeight: 800, color: 'var(--green)' }}>
                        ${stats.totalDeposited?.toLocaleString()}
                      </p>
                      {stats.pendingDepositsCount > 0 && (
                        <p style={{ fontSize: 10, color: '#f5a623', marginTop: 2 }}>{stats.pendingDepositsCount} pending</p>
                      )}
                    </div>

                    <div style={{ padding: '1rem', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 16 }}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Withdrawn</p>
                      <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.35rem', fontWeight: 800, color: 'var(--red)' }}>
                        ${stats.totalWithdrawn?.toLocaleString()}
                      </p>
                      {stats.pendingWithdrawalsCount > 0 && (
                        <p style={{ fontSize: 10, color: 'var(--red)', marginTop: 2 }}>{stats.pendingWithdrawalsCount} pending</p>
                      )}
                    </div>

                    <div style={{ padding: '1rem', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 16 }}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Invested Active</p>
                      <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.35rem', fontWeight: 800, color: 'var(--blue)' }}>
                        ${stats.activeInvestmentsSum?.toLocaleString()}
                      </p>
                    </div>

                    <div style={{ padding: '1rem', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 16 }}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Profit Claimed</p>
                      <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent)' }}>
                        ${stats.totalProfitClaimed?.toFixed(2)}
                      </p>
                    </div>

                    <div style={{ padding: '1rem', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 16 }}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Referral Bonus</p>
                      <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.35rem', fontWeight: 800, color: '#a78bfa' }}>
                        ${(u.referralEarnings || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Account Information Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {/* User Info card */}
                    <div style={{ padding: '1.25rem', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 16 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                        Account & Contact Info
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                          <span style={{ color: 'var(--text-muted)' }}>User ID</span>
                          <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-secondary)' }}>{u._id}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                          <span style={{ color: 'var(--text-muted)' }}>Registered</span>
                          <span style={{ color: 'var(--text-primary)' }}>{new Date(u.createdAt).toLocaleString('en-US')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                          <span style={{ color: 'var(--text-muted)' }}>Last Login</span>
                          <span style={{ color: 'var(--text-primary)' }}>{u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-US') : 'Never'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                          <span style={{ color: 'var(--text-muted)' }}>Phone</span>
                          <span style={{ color: 'var(--text-primary)' }}>{u.phone || 'Not provided'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                          <span style={{ color: 'var(--text-muted)' }}>Country</span>
                          <span style={{ color: 'var(--text-primary)' }}>{u.country || 'Not specified'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Role</span>
                          <span style={{ fontWeight: 600, color: u.role === 'admin' ? '#a78bfa' : 'var(--text-primary)', textTransform: 'capitalize' }}>{u.role}</span>
                        </div>
                      </div>
                    </div>

                    {/* Referral & Sponsor card */}
                    <div style={{ padding: '1.25rem', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 16 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                        Sponsorship & Network
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                          <span style={{ color: 'var(--text-muted)' }}>Referred By (Sponsor)</span>
                          {u.referredBy ? (
                            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>
                              {u.referredBy.firstName} {u.referredBy.lastName} ({u.referredBy.referralCode})
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Direct registration (No sponsor)</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                          <span style={{ color: 'var(--text-muted)' }}>Own Referral Code</span>
                          <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace' }}>{u.referralCode}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                          <span style={{ color: 'var(--text-muted)' }}>Direct Affiliates Count</span>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{stats.referralsCount || 0} users</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Total Commission Earned</span>
                          <span style={{ fontWeight: 700, color: 'var(--green)' }}>${(u.referralEarnings || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INVESTMENTS */}
              {activeTab === 'investments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                      Investments ({investments.length})
                    </h3>
                  </div>

                  {investments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--bg-card2)', borderRadius: 16 }}>
                      This user has no investments yet.
                    </div>
                  ) : (
                    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th style={{ paddingLeft: '1.25rem' }}>Plan</th>
                            <th style={{ textAlign: 'right' }}>Capital</th>
                            <th style={{ textAlign: 'center' }}>Daily ROI</th>
                            <th style={{ textAlign: 'center' }}>Progress</th>
                            <th style={{ textAlign: 'right' }}>Claimed</th>
                            <th style={{ textAlign: 'center' }}>Status</th>
                            <th style={{ textAlign: 'center', paddingRight: '1.25rem' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {investments.map(inv => (
                            <tr key={inv._id}>
                              <td style={{ paddingLeft: '1.25rem' }}>
                                <p style={{ fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-primary)' }}>{inv.plan}</p>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(inv.startDate || inv.createdAt).toLocaleDateString()}</p>
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent)' }}>
                                ${inv.amount?.toLocaleString()}
                              </td>
                              <td style={{ textAlign: 'center', color: 'var(--green)', fontWeight: 600 }}>
                                +{inv.dailyROI}% / day
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: 12, fontWeight: 600 }}>
                                  {inv.daysCompleted} / {inv.durationDays} days
                                </span>
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                                ${(inv.totalEarned || 0).toFixed(2)}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <span className={
                                  inv.status === 'active' ? 'badge-active' : 
                                  inv.status === 'completed' ? 'badge-approved' : 'badge-rejected'
                                }>
                                  {inv.status}
                                </span>
                              </td>
                              <td style={{ textAlign: 'center', paddingRight: '1.25rem' }}>
                                {inv.status === 'active' && (
                                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                    <button 
                                      onClick={() => handleCompleteInvestment(inv._id)}
                                      title="Mark Completed"
                                      style={{ padding: '3px 8px', fontSize: 11, borderRadius: 6, background: 'rgba(0,212,160,0.1)', color: 'var(--green)', border: '1px solid rgba(0,212,160,0.2)', cursor: 'pointer' }}
                                    >
                                      Complete
                                    </button>
                                    <button 
                                      onClick={() => handleCancelInvestment(inv._id)}
                                      title="Cancel & Refund"
                                      style={{ padding: '3px 8px', fontSize: 11, borderRadius: 6, background: 'rgba(255,75,110,0.1)', color: 'var(--red)', border: '1px solid rgba(255,75,110,0.2)', cursor: 'pointer' }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DEPOSITS */}
              {activeTab === 'deposits' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                    Deposits History ({deposits.length})
                  </h3>

                  {deposits.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--bg-card2)', borderRadius: 16 }}>
                      No deposits made by this user yet.
                    </div>
                  ) : (
                    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th style={{ paddingLeft: '1.25rem' }}>Method</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                            <th style={{ textAlign: 'center' }}>Date</th>
                            <th style={{ textAlign: 'center' }}>Proof</th>
                            <th style={{ textAlign: 'center' }}>Status</th>
                            <th style={{ paddingRight: '1.25rem' }}>Note / Ref</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deposits.map(d => (
                            <tr key={d._id}>
                              <td style={{ paddingLeft: '1.25rem' }}>
                                <span style={{ marginRight: 6 }}>{METHOD_EMOJIS[d.method] || '💳'}</span>
                                <span style={{ fontWeight: 600 }}>{METHOD_LABELS[d.method] || d.method}</span>
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--green)' }}>
                                +${d.amount?.toLocaleString()}
                              </td>
                              <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                                {new Date(d.createdAt).toLocaleDateString()}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                {d.proofImage ? (
                                  <a 
                                    href={`${API_BASE}/${d.proofImage.replace(/\\/g, '/')}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    style={{ color: 'var(--blue)', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}
                                  >
                                    View <ExternalLink size={11} />
                                  </a>
                                ) : (
                                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>None</span>
                                )}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <span className={
                                  d.status === 'approved' ? 'badge-approved' : 
                                  d.status === 'pending' ? 'badge-active' : 'badge-rejected'
                                }>
                                  {d.status}
                                </span>
                              </td>
                              <td style={{ paddingRight: '1.25rem', fontSize: 12, color: 'var(--text-secondary)' }}>
                                {d.adminNote || d.reference || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: WITHDRAWALS */}
              {activeTab === 'withdrawals' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                    Withdrawals History ({withdrawals.length})
                  </h3>

                  {withdrawals.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--bg-card2)', borderRadius: 16 }}>
                      No withdrawals requested by this user yet.
                    </div>
                  ) : (
                    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th style={{ paddingLeft: '1.25rem' }}>Method</th>
                            <th>Wallet Address</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                            <th style={{ textAlign: 'center' }}>Date</th>
                            <th style={{ textAlign: 'center' }}>Status</th>
                            <th style={{ paddingRight: '1.25rem' }}>TxHash / Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {withdrawals.map(w => (
                            <tr key={w._id}>
                              <td style={{ paddingLeft: '1.25rem' }}>
                                <span style={{ marginRight: 6 }}>{METHOD_EMOJIS[w.method] || '💸'}</span>
                                <span style={{ fontWeight: 600 }}>{METHOD_LABELS[w.method] || w.method}</span>
                              </td>
                              <td style={{ fontFamily: 'monospace', fontSize: 11, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {w.walletAddress}
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--red)' }}>
                                -${w.amount?.toLocaleString()}
                              </td>
                              <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                                {new Date(w.createdAt).toLocaleDateString()}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <span className={
                                  w.status === 'approved' ? 'badge-approved' : 
                                  w.status === 'pending' ? 'badge-active' : 'badge-rejected'
                                }>
                                  {w.status}
                                </span>
                              </td>
                              <td style={{ paddingRight: '1.25rem', fontSize: 11, color: 'var(--text-secondary)' }}>
                                {w.txHash ? (
                                  <span style={{ fontFamily: 'monospace' }}>{w.txHash.slice(0, 16)}…</span>
                                ) : (
                                  w.adminNote || '—'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: REFERRALS */}
              {activeTab === 'referrals' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                      Referred Users / Filleuls ({referrals.length})
                    </h3>
                  </div>

                  {referrals.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--bg-card2)', borderRadius: 16 }}>
                      This user has not invited any users yet.
                    </div>
                  ) : (
                    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th style={{ paddingLeft: '1.25rem' }}>User</th>
                            <th>Email</th>
                            <th style={{ textAlign: 'right' }}>Balance</th>
                            <th style={{ textAlign: 'right' }}>Total Invested</th>
                            <th style={{ textAlign: 'center', paddingRight: '1.25rem' }}>Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {referrals.map(r => (
                            <tr key={r._id}>
                              <td style={{ paddingLeft: '1.25rem' }}>
                                <span style={{ fontWeight: 600 }}>{r.firstName} {r.lastName}</span>
                              </td>
                              <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                                {r.email}
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--accent)' }}>
                                ${(r.balance || 0).toFixed(2)}
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                ${(r.totalInvested || 0).toLocaleString()}
                              </td>
                              <td style={{ textAlign: 'center', paddingRight: '1.25rem', color: 'var(--text-muted)', fontSize: 12 }}>
                                {new Date(r.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: EDIT PROFILE */}
              {activeTab === 'edit' && (
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label className="label">First Name</label>
                      <input 
                        type="text" 
                        value={editForm.firstName} 
                        onChange={e => setEditForm(p => ({ ...p, firstName: e.target.value }))}
                        className="input" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="label">Last Name</label>
                      <input 
                        type="text" 
                        value={editForm.lastName} 
                        onChange={e => setEditForm(p => ({ ...p, lastName: e.target.value }))}
                        className="input" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="label">Email Address</label>
                      <input 
                        type="email" 
                        value={editForm.email} 
                        onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                        className="input" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="label">Phone Number</label>
                      <input 
                        type="text" 
                        value={editForm.phone} 
                        onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                        className="input" 
                        placeholder="+1 234 567 890" 
                      />
                    </div>

                    <div>
                      <label className="label">Country</label>
                      <input 
                        type="text" 
                        value={editForm.country} 
                        onChange={e => setEditForm(p => ({ ...p, country: e.target.value }))}
                        className="input" 
                        placeholder="e.g. France, United States" 
                      />
                    </div>

                    <div>
                      <label className="label">Role</label>
                      <select 
                        value={editForm.role} 
                        onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}
                        className="input"
                      >
                        <option value="user">User (Standard Investor)</option>
                        <option value="admin">Admin (Administrator)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1rem', background: 'var(--bg-card2)', borderRadius: 14 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)' }}>
                      <input 
                        type="checkbox" 
                        checked={editForm.isVerified} 
                        onChange={e => setEditForm(p => ({ ...p, isVerified: e.target.checked }))}
                        style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} 
                      />
                      <span>Mark Account as <strong>Verified (KYC approved)</strong></span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)' }}>
                      <input 
                        type="checkbox" 
                        checked={editForm.isActive} 
                        onChange={e => setEditForm(p => ({ ...p, isActive: e.target.checked }))}
                        style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} 
                      />
                      <span>Account is <strong>Active</strong> (uncheck to ban/suspend)</span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('overview')} 
                      className="btn-ghost"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={editSaving} 
                      className="btn-primary"
                    >
                      {editSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
