import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import { 
  Search, UserCheck, UserX, DollarSign, X, AlertCircle, 
  Eye, Key, Trash2, Download, RefreshCw, Filter, ArrowUpDown, 
  Users, ShieldCheck, ShieldAlert, Wallet, TrendingUp, Copy, Check
} from 'lucide-react'
import toast from 'react-hot-toast'
import UserDetailModal from '../../components/admin/UserDetailModal'
import AdjustBalanceModal from '../../components/admin/AdjustBalanceModal'
import ResetPasswordModal from '../../components/admin/ResetPasswordModal'
import DeleteUserModal from '../../components/admin/DeleteUserModal'

export default function AdminUsers() {
  const [users, setUsers]           = useState([])
  const [total, setTotal]           = useState(0)
  const [pages, setPages]           = useState(1)
  const [stats, setStats]           = useState(null)
  const [page, setPage]             = useState(1)
  const [limit, setLimit]           = useState(25)
  const [search, setSearch]         = useState('')
  const [status, setStatus]         = useState('all') // all, active, banned
  const [isVerified, setIsVerified] = useState('all') // all, true, false
  const [sortBy, setSortBy]         = useState('createdAt')
  const [sortOrder, setSortOrder]   = useState('desc')
  const [loading, setLoading]       = useState(true)
  const [loadError, setLoadError]   = useState(null)

  // Modals state
  const [selectedUserForDetail, setSelectedUserForDetail] = useState(null)
  const [selectedUserForBalance, setSelectedUserForBalance] = useState(null)
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null)
  const [selectedUserForDelete, setSelectedUserForDelete] = useState(null)

  const [copiedId, setCopiedId] = useState(null)

  const load = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const params = {
        page,
        limit,
        search: search.trim() || undefined,
        status: status !== 'all' ? status : undefined,
        isVerified: isVerified !== 'all' ? isVerified : undefined,
        sortBy,
        sortOrder
      }
      const r = await adminAPI.getUsers(params)
      setUsers(r.data.users)
      setTotal(r.data.total)
      setPages(r.data.pages || 1)
      if (r.data.stats) {
        setStats(r.data.stats)
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load users'
      setLoadError(msg)
      toast.error('Users: ' + msg)
    } finally { 
      setLoading(false) 
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      load()
    }, 300)
    return () => clearTimeout(timer)
  }, [search, status, isVerified, sortBy, sortOrder, page, limit])

  const toggle = async (id) => {
    try {
      const r = await adminAPI.toggleStatus(id)
      toast.success(r.data.message)
      setUsers(u => u.map(user => user._id === id ? r.data.user : user))
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Error updating status') 
    }
  }

  const handleUserUpdated = (updatedUser) => {
    setUsers(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u))
  }

  const handleUserDeleted = (deletedId) => {
    setUsers(prev => prev.filter(u => u._id !== deletedId))
    setTotal(t => Math.max(0, t - 1))
    if (selectedUserForDetail?._id === deletedId) {
      setSelectedUserForDetail(null)
    }
  }

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success('Copied: ' + text)
  }

  // Export Users to CSV
  const exportToCSV = () => {
    if (!users || users.length === 0) {
      toast.error('No users to export')
      return
    }

    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Country', 'Balance ($)', 'Total Invested ($)', 'Referral Code', 'Status', 'Verified', 'Created At']
    const rows = users.map(u => [
      u._id,
      `"${u.firstName || ''}"`,
      `"${u.lastName || ''}"`,
      `"${u.email || ''}"`,
      `"${u.phone || ''}"`,
      `"${u.country || ''}"`,
      (u.balance || 0).toFixed(2),
      (u.totalInvested || 0).toFixed(2),
      u.referralCode || '',
      u.isActive ? 'Active' : 'Banned',
      u.isVerified ? 'Verified' : 'Unverified',
      new Date(u.createdAt).toISOString()
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `oilai_users_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Users exported to CSV!')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            User Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Complete control over accounts, balances, compliance & records
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button 
            onClick={load} 
            disabled={loading}
            className="btn-ghost"
            style={{ fontSize: 13, padding: '0.6rem 1rem' }}
            title="Refresh list"
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>

          <button 
            onClick={exportToCSV}
            className="btn-primary"
            style={{ fontSize: 13, padding: '0.6rem 1.1rem' }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {loadError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.875rem 1rem', background: 'rgba(255,75,110,0.08)', border: '1px solid rgba(255,75,110,0.2)', borderRadius: 12, color: 'var(--red)', fontSize: 13 }}>
          <AlertCircle size={16} />
          <span><strong>Error:</strong> {loadError}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Users</span>
              <Users size={16} color="var(--blue)" />
            </div>
            <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.totalUsers}
            </p>
          </div>

          <div className="card" style={{ padding: '1.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Accounts</span>
              <UserCheck size={16} color="var(--green)" />
            </div>
            <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--green)' }}>
              {stats.activeUsers}
            </p>
          </div>

          <div className="card" style={{ padding: '1.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Suspended / Banned</span>
              <UserX size={16} color="var(--red)" />
            </div>
            <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--red)' }}>
              {stats.bannedUsers}
            </p>
          </div>

          <div className="card" style={{ padding: '1.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verified KYC</span>
              <ShieldCheck size={16} color="var(--blue)" />
            </div>
            <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--blue)' }}>
              {stats.verifiedUsers}
            </p>
          </div>

          <div className="card" style={{ padding: '1.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Balances</span>
              <Wallet size={16} color="var(--accent)" />
            </div>
            <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>
              ${(stats.totalBalances || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="card" style={{ padding: '1.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Capital Invested</span>
              <TrendingUp size={16} color="#a78bfa" />
            </div>
            <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa' }}>
              ${(stats.totalInvested || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(1) }} 
            className="input" 
            style={{ paddingLeft: 38, paddingTop: '0.55rem', paddingBottom: '0.55rem', fontSize: 13 }} 
            placeholder="Search by name, email, phone, code…" 
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Status Filter */}
          <select 
            value={status} 
            onChange={e => { setStatus(e.target.value); setPage(1) }}
            className="input" 
            style={{ width: 'auto', minWidth: 120, padding: '0.55rem 0.85rem', fontSize: 13 }}
          >
            <option value="all">Status: All</option>
            <option value="active">Active Only</option>
            <option value="banned">Banned Only</option>
          </select>

          {/* Verification Filter */}
          <select 
            value={isVerified} 
            onChange={e => { setIsVerified(e.target.value); setPage(1) }}
            className="input" 
            style={{ width: 'auto', minWidth: 130, padding: '0.55rem 0.85rem', fontSize: 13 }}
          >
            <option value="all">KYC: All</option>
            <option value="true">Verified Only</option>
            <option value="false">Unverified Only</option>
          </select>

          {/* Sort By */}
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="input" 
            style={{ width: 'auto', minWidth: 140, padding: '0.55rem 0.85rem', fontSize: 13 }}
          >
            <option value="createdAt">Sort: Registration</option>
            <option value="balance">Sort: Balance</option>
            <option value="totalInvested">Sort: Invested</option>
            <option value="firstName">Sort: Name</option>
          </select>

          {/* Sort Order */}
          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? 'Ascending (lowest first)' : 'Descending (highest first)'}
            style={{ 
              height: 38, 
              padding: '0 10px', 
              borderRadius: 12, 
              background: 'var(--bg-input)', 
              border: '1.5px solid var(--border)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4, 
              cursor: 'pointer', 
              color: 'var(--text-secondary)',
              fontSize: 12,
              fontWeight: 600
            }}
          >
            <ArrowUpDown size={14} />
            <span>{sortOrder.toUpperCase()}</span>
          </button>

          {/* Per Page */}
          <select 
            value={limit} 
            onChange={e => { setLimit(Number(e.target.value)); setPage(1) }}
            className="input" 
            style={{ width: 'auto', padding: '0.55rem 0.75rem', fontSize: 13 }}
          >
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </select>
        </div>
      </div>

      {/* Main Users Table */}
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '1.5rem' }}>User / Identity</th>
              <th>Contact Details</th>
              <th style={{ textAlign: 'right' }}>Balance</th>
              <th style={{ textAlign: 'right' }}>Total Invested</th>
              <th style={{ textAlign: 'center' }}>Account Status</th>
              <th style={{ textAlign: 'center' }}>KYC</th>
              <th style={{ textAlign: 'center' }}>Joined</th>
              <th style={{ textAlign: 'center', paddingRight: '1.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span>Loading users records…</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
                  No users match the search criteria.
                </td>
              </tr>
            ) : users.map(u => (
              <tr key={u._id}>
                {/* User Identity */}
                <td style={{ paddingLeft: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div 
                      onClick={() => setSelectedUserForDetail(u._id)}
                      style={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: 11, 
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: '#fff', 
                        fontWeight: 700, 
                        fontSize: 12, 
                        flexShrink: 0,
                        cursor: 'pointer'
                      }}
                      title="Click to view 360 profile"
                    >
                      {u.firstName?.[0]}{u.lastName?.[0]}
                    </div>
                    <div>
                      <div 
                        onClick={() => setSelectedUserForDetail(u._id)}
                        style={{ fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        <span>{u.firstName} {u.lastName}</span>
                        {u.role === 'admin' && (
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 999, background: 'rgba(167,139,250,0.18)', color: '#a78bfa' }}>
                            Admin
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, fontFamily: 'monospace' }}>
                          {u.referralCode || '—'}
                        </span>
                        {u.referralCode && (
                          <button 
                            onClick={() => copyText(u.referralCode, u._id + 'ref')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 2 }}
                            title="Copy code"
                          >
                            {copiedId === u._id + 'ref' ? <Check size={10} color="var(--green)" /> : <Copy size={10} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td>
                  <div>
                    <p style={{ color: 'var(--text-primary)', fontSize: 13 }}>{u.email}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                      {u.phone || 'No phone'} {u.country ? `• ${u.country}` : ''}
                    </p>
                  </div>
                </td>

                {/* Balance */}
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent)', fontSize: 14 }}>
                  ${(u.balance || 0).toFixed(2)}
                </td>

                {/* Total Invested */}
                <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 13 }}>
                  ${(u.totalInvested || 0).toLocaleString()}
                </td>

                {/* Active / Banned */}
                <td style={{ textAlign: 'center' }}>
                  <span className={u.isActive ? 'badge-approved' : 'badge-rejected'}>
                    {u.isActive ? 'Active' : 'Banned'}
                  </span>
                </td>

                {/* Verified */}
                <td style={{ textAlign: 'center' }}>
                  <span className={u.isVerified ? 'badge-active' : 'badge-rejected'}>
                    {u.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>

                {/* Date */}
                <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                  {new Date(u.createdAt).toLocaleDateString('en-US')}
                </td>

                {/* Actions */}
                <td style={{ textAlign: 'center', paddingRight: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {/* View Details 360 */}
                    <button 
                      onClick={() => setSelectedUserForDetail(u._id)} 
                      title="View Complete User Details (360°)"
                      style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: 8, 
                        background: 'rgba(59,142,255,0.1)', 
                        border: '1px solid rgba(59,142,255,0.2)', 
                        color: 'var(--blue)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer' 
                      }}
                    >
                      <Eye size={14} />
                    </button>

                    {/* Adjust Balance */}
                    <button 
                      onClick={() => setSelectedUserForBalance(u)} 
                      title="Adjust Balance"
                      style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: 8, 
                        background: 'rgba(34,197,94,0.1)', 
                        border: '1px solid rgba(34,197,94,0.2)', 
                        color: 'var(--accent)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer' 
                      }}
                    >
                      <DollarSign size={14} />
                    </button>

                    {/* Reset Password */}
                    <button 
                      onClick={() => setSelectedUserForPassword(u)} 
                      title="Reset Password"
                      style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: 8, 
                        background: 'rgba(255,166,35,0.1)', 
                        border: '1px solid rgba(255,166,35,0.2)', 
                        color: '#f5a623', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer' 
                      }}
                    >
                      <Key size={14} />
                    </button>

                    {/* Toggle Ban / Unban */}
                    <button 
                      onClick={() => toggle(u._id)} 
                      title={u.isActive ? 'Ban / Deactivate Account' : 'Activate Account'}
                      style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: 8, 
                        background: u.isActive ? 'rgba(255,75,110,0.1)' : 'rgba(0,212,160,0.1)', 
                        border: u.isActive ? '1px solid rgba(255,75,110,0.2)' : '1px solid rgba(0,212,160,0.2)', 
                        color: u.isActive ? 'var(--red)' : 'var(--green)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer' 
                      }}
                    >
                      {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>

                    {/* Delete User */}
                    <button 
                      onClick={() => setSelectedUserForDelete(u)} 
                      title="Delete User"
                      style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: 8, 
                        background: 'rgba(255,75,110,0.06)', 
                        border: '1px solid rgba(255,75,110,0.15)', 
                        color: 'var(--red)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer' 
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Showing {users.length} of {total} registered users (Page {page} of {pages})
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

            {Array.from({ length: Math.min(5, pages) }, (_, i) => {
              let pageNum = page
              if (pages <= 5) pageNum = i + 1
              else if (page <= 3) pageNum = i + 1
              else if (page >= pages - 2) pageNum = pages - 4 + i
              else pageNum = page - 2 + i

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: page === pageNum ? 'var(--accent)' : 'var(--border)',
                    background: page === pageNum ? 'var(--accent)' : 'var(--bg-card2)',
                    color: page === pageNum ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  {pageNum}
                </button>
              )
            })}

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

      {/* MODAL 1: 360 USER DETAILS MODAL */}
      {selectedUserForDetail && (
        <UserDetailModal 
          userId={selectedUserForDetail}
          onClose={() => setSelectedUserForDetail(null)}
          onUserUpdated={handleUserUpdated}
          onOpenAdjustBalance={(u) => setSelectedUserForBalance(u)}
          onOpenResetPassword={(u) => setSelectedUserForPassword(u)}
          onOpenDeleteUser={(u) => setSelectedUserForDelete(u)}
        />
      )}

      {/* MODAL 2: ADJUST BALANCE MODAL */}
      {selectedUserForBalance && (
        <AdjustBalanceModal 
          user={selectedUserForBalance}
          onClose={() => setSelectedUserForBalance(null)}
          onBalanceAdjusted={handleUserUpdated}
        />
      )}

      {/* MODAL 3: RESET PASSWORD MODAL */}
      {selectedUserForPassword && (
        <ResetPasswordModal 
          user={selectedUserForPassword}
          onClose={() => setSelectedUserForPassword(null)}
        />
      )}

      {/* MODAL 4: DELETE USER MODAL */}
      {selectedUserForDelete && (
        <DeleteUserModal 
          user={selectedUserForDelete}
          onClose={() => setSelectedUserForDelete(null)}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </div>
  )
}
