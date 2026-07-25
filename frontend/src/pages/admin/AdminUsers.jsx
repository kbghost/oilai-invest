import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import { Search, UserCheck, UserX, DollarSign, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [total, setTotal]     = useState(0)
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const [adjustForm, setAdjustForm] = useState({ amount: '', type: 'credit', note: '' })

  const load = async () => {
    setLoading(true)
    try {
      const r = await adminAPI.getUsers({ search })
      setUsers(r.data.users); setTotal(r.data.total)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [search])

  const toggle = async (id) => {
    try {
      const r = await adminAPI.toggleStatus(id)
      toast.success(r.data.message)
      setUsers(u => u.map(user => user._id === id ? r.data.user : user))
    } catch { toast.error('Erreur') }
  }

  const adjustBalance = async () => {
    try {
      const r = await adminAPI.adjustBalance(modal._id, adjustForm)
      toast.success('Solde ajusté')
      setUsers(u => u.map(user => user._id === modal._id ? r.data.user : user))
      setModal(null); setAdjustForm({ amount: '', type: 'credit', note: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur') }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Utilisateurs</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{total} utilisateurs enregistrés</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 320 }}>
        <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input" style={{ paddingLeft: 38, paddingTop: '0.6rem', paddingBottom: '0.6rem' }} placeholder="Rechercher un utilisateur…" />
      </div>

      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '1.5rem' }}>Utilisateur</th>
              <th className="hidden md:table-cell">Email</th>
              <th style={{ textAlign: 'right' }}>Solde</th>
              <th style={{ textAlign: 'center' }}>Statut</th>
              <th style={{ textAlign: 'center', paddingRight: '1.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Chargement…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Aucun utilisateur trouvé</td></tr>
            ) : users.map(u => (
              <tr key={u._id}>
                <td style={{ paddingLeft: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                      {u.firstName?.[0]}{u.lastName?.[0]}
                    </div>
                    <span style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{u.email}</td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent)' }}>${(u.balance||0).toFixed(2)}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={u.isActive ? 'badge-active' : 'badge-rejected'}>{u.isActive ? 'Actif' : 'Banni'}</span>
                </td>
                <td style={{ textAlign: 'center', paddingRight: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <button onClick={() => setModal(u)} title="Ajuster solde"
                      style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <DollarSign size={13} />
                    </button>
                    <button onClick={() => toggle(u._id)} title={u.isActive ? 'Bannir' : 'Activer'}
                      style={{ width: 30, height: 30, borderRadius: 8, background: u.isActive ? 'rgba(255,75,110,0.1)' : 'rgba(0,212,160,0.1)', border: u.isActive ? '1px solid rgba(255,75,110,0.2)' : '1px solid rgba(0,212,160,0.2)', color: u.isActive ? 'var(--red)' : 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      {u.isActive ? <UserX size={13} /> : <UserCheck size={13} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adjust balance modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={() => setModal(null)} />
          <div className="card" style={{ position: 'relative', width: '100%', maxWidth: 380, zIndex: 1 }}>
            <button onClick={() => setModal(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, padding: 5, cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={16} /></button>
            <h3 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Ajuster le solde</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {modal.firstName} {modal.lastName} — Solde actuel : <span style={{ color: 'var(--accent)', fontWeight: 700 }}>${(modal.balance||0).toFixed(2)}</span>
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
              {['credit','debit'].map(t => (
                <button key={t} onClick={() => setAdjustForm(p => ({ ...p, type: t }))}
                  style={{ flex: 1, padding: '0.6rem', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit', textTransform: 'capitalize', background: adjustForm.type === t ? (t === 'credit' ? 'rgba(0,212,160,0.15)' : 'rgba(255,75,110,0.15)') : 'var(--bg-card2)', color: adjustForm.type === t ? (t === 'credit' ? 'var(--green)' : 'var(--red)') : 'var(--text-muted)', border: adjustForm.type === t ? `1px solid ${t === 'credit' ? 'rgba(0,212,160,0.3)' : 'rgba(255,75,110,0.3)'}` : '1px solid var(--border)' }}>
                  {t === 'credit' ? '+ Créditer' : '- Débiter'}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label className="label">Montant ($)</label>
                <input type="number" value={adjustForm.amount} onChange={e => setAdjustForm(p => ({ ...p, amount: e.target.value }))} className="input" placeholder="Montant" min="0.01" />
              </div>
              <div>
                <label className="label">Note (optionnel)</label>
                <input type="text" value={adjustForm.note} onChange={e => setAdjustForm(p => ({ ...p, note: e.target.value }))} className="input" placeholder="Raison de l'ajustement" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: '1.25rem' }}>
              <button onClick={() => setModal(null)} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Annuler</button>
              <button onClick={adjustBalance} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
