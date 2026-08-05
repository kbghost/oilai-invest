import { useEffect, useState } from 'react'
import { adminAPI, investmentAPI } from '../../services/api'
import { Users, TrendingUp, ArrowDownCircle, ArrowUpCircle, RefreshCw, DollarSign, Activity, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats]       = useState(null)
  const [recent, setRecent]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    adminAPI.getStats()
      .then(r => { setStats(r.data.stats); setRecent(r.data.recentUsers) })
      .catch(err => {
        const msg = err.response?.data?.message || err.message || 'Failed to load stats'
        setLoadError(msg)
        toast.error('Dashboard: ' + msg)
      })
      .finally(() => setLoading(false))
  }, [])

  const processProfit = async () => {
    setProcessing(true)
    try {
      const r = await investmentAPI.processProfits()
      toast.success(r.data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing profits')
    } finally { setProcessing(false) }
  }

  const cards = stats ? [
    { label: 'Total Users',           value: stats.totalUsers,         icon: Users,           color: 'var(--blue)' },
    { label: 'Active Investments',    value: stats.activeInvestments,  icon: TrendingUp,      color: 'var(--accent)' },
    { label: 'Pending Deposits',      value: stats.pendingDeposits,    icon: ArrowDownCircle, color: '#FFCC00' },
    { label: 'Pending Withdrawals',   value: stats.pendingWithdrawals, icon: ArrowUpCircle,   color: 'var(--red)' },
    { label: 'Total Deposited',       value: `$${(stats.totalDeposits||0).toLocaleString('en-US')}`,    icon: DollarSign, color: 'var(--green)' },
    { label: 'Total Withdrawn',       value: `$${(stats.totalWithdrawals||0).toLocaleString('en-US')}`, icon: Activity,   color: '#a78bfa' },
  ] : []

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (loadError) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12 }}>
      <AlertCircle size={40} color="var(--red)" />
      <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>Unable to load statistics</p>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', maxWidth: 400 }}>{loadError}</p>
      <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>Make sure the backend is running (<code>node server.js</code>) and that <code>MONGODB_URI</code> in <code>.env</code> is correct (replace &lt;db_password&gt; with your actual Atlas password).</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Platform overview</p>
        </div>
        <button onClick={processProfit} disabled={processing} className="btn-primary" style={{ fontSize: 13 }}>
          <RefreshCw size={15} style={{ animation: processing ? 'spin 0.8s linear infinite' : 'none' }} />
          {processing ? 'Processing...' : "Generate Today's Profits"}
        </button>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }} id="admin-stats-grid">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div style={{ width: 40, height: 40, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Icon size={20} color={color} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
            <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Recent users */}
      <div className="card">
        <h3 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Recent Registrations</h3>
        {recent.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '2rem 0' }}>No users yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recent.map((u, i) => (
              <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.875rem 0', borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {u.firstName?.[0]}{u.lastName?.[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{u.firstName} {u.lastName}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 14 }}>${(u.balance||0).toFixed(2)}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString('en-US')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
