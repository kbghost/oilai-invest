import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import { 
  TrendingUp, Search, CheckCircle2, XCircle, RefreshCw, 
  AlertCircle, DollarSign, Calendar, Clock, User
} from 'lucide-react'
import toast from 'react-hot-toast'
import UserDetailModal from '../../components/admin/UserDetailModal'

export default function AdminInvestments() {
  const [investments, setInvestments] = useState([])
  const [total, setTotal]             = useState(0)
  const [pages, setPages]             = useState(1)
  const [stats, setStats]             = useState(null)
  const [page, setPage]               = useState(1)
  const [limit, setLimit]             = useState(25)
  const [status, setStatus]           = useState('all') // all, active, completed, cancelled
  const [search, setSearch]           = useState('')
  const [loading, setLoading]         = useState(true)
  const [loadError, setLoadError]     = useState(null)

  const [selectedUserDetailId, setSelectedUserDetailId] = useState(null)

  const load = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const params = {
        page,
        limit,
        status: status !== 'all' ? status : undefined,
        search: search.trim() || undefined
      }
      const r = await adminAPI.getInvestments(params)
      setInvestments(r.data.investments)
      setTotal(r.data.total)
      setPages(r.data.pages || 1)
      if (r.data.stats) {
        setStats(r.data.stats)
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load investments'
      setLoadError(msg)
      toast.error('Investments: ' + msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      load()
    }, 300)
    return () => clearTimeout(timer)
  }, [status, search, page, limit])

  const handleUpdateStatus = async (id, newStatus, refund = false) => {
    const confirmMsg = refund 
      ? 'Cancel this investment and refund capital to user balance?' 
      : `Change status to ${newStatus}?`
    if (!window.confirm(confirmMsg)) return

    try {
      const res = await adminAPI.updateInvestmentStatus(id, { status: newStatus, refund })
      toast.success(res.data.message)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating investment status')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Investments
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Monitor and manage all active, completed and pending user investments
          </p>
        </div>

        <button 
          onClick={load} 
          disabled={loading}
          className="btn-ghost"
          style={{ fontSize: 13, padding: '0.6rem 1rem' }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error alert */}
      {loadError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.875rem 1rem', background: 'rgba(255,75,110,0.08)', border: '1px solid rgba(255,75,110,0.2)', borderRadius: 12, color: 'var(--red)', fontSize: 13 }}>
          <AlertCircle size={16} />
          <span><strong>Error:</strong> {loadError}</span>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.15rem' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
              Total Volume
            </p>
            <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>
              ${stats.totalVolume?.toLocaleString()}
            </p>
          </div>

          <div className="card" style={{ padding: '1.15rem' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
              Active Investments
            </p>
            <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--blue)' }}>
              {stats.activeCount}
            </p>
          </div>

          <div className="card" style={{ padding: '1.15rem' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
              Completed Plans
            </p>
            <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--green)' }}>
              {stats.completedCount}
            </p>
          </div>

          <div className="card" style={{ padding: '1.15rem' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
              Cancelled Plans
            </p>
            <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--red)' }}>
              {stats.cancelledCount}
            </p>
          </div>
        </div>
      )}

      {/* Search and Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        {/* Status Tab Bar */}
        <div className="tab-bar" style={{ width: 'fit-content' }}>
          {[
            { val: 'all',       label: 'All' },
            { val: 'active',    label: 'Active' },
            { val: 'completed', label: 'Completed' },
            { val: 'cancelled', label: 'Cancelled' }
          ].map(({ val, label }) => (
            <button 
              key={val} 
              className={'tab-btn' + (status === val ? ' active' : '')} 
              onClick={() => { setStatus(val); setPage(1) }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(1) }} 
            className="input" 
            style={{ paddingLeft: 38, paddingTop: '0.55rem', paddingBottom: '0.55rem', fontSize: 13 }} 
            placeholder="Search investor or plan…" 
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '1.5rem' }}>Investor</th>
              <th>Plan</th>
              <th style={{ textAlign: 'right' }}>Capital</th>
              <th style={{ textAlign: 'center' }}>Daily ROI</th>
              <th style={{ textAlign: 'center' }}>Progress</th>
              <th style={{ textAlign: 'right' }}>Total Earned</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center', paddingRight: '1.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
                  Loading investments…
                </td>
              </tr>
            ) : investments.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
                  No investments found.
                </td>
              </tr>
            ) : investments.map(inv => (
              <tr key={inv._id}>
                <td style={{ paddingLeft: '1.5rem' }}>
                  <div 
                    onClick={() => inv.user?._id && setSelectedUserDetailId(inv.user._id)}
                    style={{ cursor: inv.user?._id ? 'pointer' : 'default' }}
                  >
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {inv.user ? `${inv.user.firstName} ${inv.user.lastName}` : 'Unknown User'}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {inv.user?.email || '—'}
                    </p>
                  </div>
                </td>

                <td>
                  <span style={{ fontWeight: 700, textTransform: 'capitalize', color: 'var(--accent)' }}>
                    {inv.plan}
                  </span>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {inv.durationDays} days plan
                  </p>
                </td>

                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ${inv.amount?.toLocaleString()}
                </td>

                <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--green)' }}>
                  +{inv.dailyROI}%
                </td>

                <td style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 12, fontWeight: 600 }}>
                    {inv.daysCompleted} / {inv.durationDays}d
                  </p>
                  <div className="progress-bar" style={{ width: 80, margin: '4px auto 0' }}>
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min(100, Math.round((inv.daysCompleted / (inv.durationDays || 1)) * 100))}%` }} 
                    />
                  </div>
                </td>

                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent)' }}>
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

                <td style={{ textAlign: 'center', paddingRight: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {inv.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(inv._id, 'completed')}
                          title="Complete Investment"
                          style={{ 
                            padding: '4px 8px', 
                            fontSize: 11, 
                            fontWeight: 600, 
                            borderRadius: 8, 
                            background: 'rgba(0,212,160,0.1)', 
                            border: '1px solid rgba(0,212,160,0.25)', 
                            color: 'var(--green)', 
                            cursor: 'pointer' 
                          }}
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(inv._id, 'cancelled', true)}
                          title="Cancel & Refund Principal"
                          style={{ 
                            padding: '4px 8px', 
                            fontSize: 11, 
                            fontWeight: 600, 
                            borderRadius: 8, 
                            background: 'rgba(255,75,110,0.1)', 
                            border: '1px solid rgba(255,75,110,0.25)', 
                            color: 'var(--red)', 
                            cursor: 'pointer' 
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {inv.user?._id && (
                      <button
                        onClick={() => setSelectedUserDetailId(inv.user._id)}
                        title="View User"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: 'var(--bg-card2)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <User size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Showing {investments.length} of {total} investments (Page {page} of {pages})
        </p>

        {pages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page <= 1}
              className="btn-ghost"
              style={{ padding: '0.4rem 0.8rem', fontSize: 12, opacity: page <= 1 ? 0.4 : 1 }}
            >
              Previous
            </button>
            <button 
              onClick={() => setPage(p => Math.min(pages, p + 1))} 
              disabled={page >= pages}
              className="btn-ghost"
              style={{ padding: '0.4rem 0.8rem', fontSize: 12, opacity: page >= pages ? 0.4 : 1 }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* User 360 Detail Modal */}
      {selectedUserDetailId && (
        <UserDetailModal
          userId={selectedUserDetailId}
          onClose={() => setSelectedUserDetailId(null)}
          onUserUpdated={() => load()}
        />
      )}
    </div>
  )
}
