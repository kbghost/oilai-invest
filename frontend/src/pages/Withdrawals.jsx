import { useEffect, useState } from 'react'
import { withdrawalAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { ArrowUpCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const METHODS = [
  { value:'bitcoin',  label:'Bitcoin (BTC)',  emoji:'₿', placeholder:'bc1q... ou 1A1zP1...', hint:'Adresse Bitcoin valide. Vérifiez avant envoi.', network:'BTC', delay:'45 min' },
  { value:'ethereum', label:'Ethereum (ETH)', emoji:'Ξ', placeholder:'0x...', hint:'Adresse ERC20 valide uniquement.', network:'ERC20', delay:'45 min' },
  { value:'usdt',     label:'USDT',           emoji:'₮', placeholder:'T...', hint:'Réseau TRC20 uniquement.', network:'TRC20', delay:'45 min' },
  { value:'bnb',      label:'BNB',            emoji:'◆', placeholder:'bnb1...', hint:'Réseau BNB Smart Chain (BEP20).', network:'BEP20', delay:'45 min' },
]

export default function Withdrawals() {
  const { user, updateUser } = useAuth()
  const [withdrawals, setWithdrawals] = useState([])
  const [form, setForm] = useState({ amount:'', method:'', walletAddress:'' })
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('new')

  useEffect(() => { withdrawalAPI.getAll().then(r => setWithdrawals(r.data.withdrawals)).catch(()=>{}) }, [])
  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const selectedMethod = METHODS.find(m => m.value === form.method)

  const submit = async e => {
    e.preventDefault()
    if (parseFloat(form.amount) < 10) return toast.error('Minimum : 10$')
    if (!form.method) return toast.error('Choisissez une cryptomonnaie')
    if (!form.walletAddress) return toast.error('Entrez votre adresse de portefeuille')
    if ((user?.balance||0) < parseFloat(form.amount)) return toast.error('Solde insuffisant')
    setLoading(true)
    try {
      await withdrawalAPI.create({ ...form, amount: parseFloat(form.amount) })
      toast.success('Retrait soumis ! Traitement sous '+(selectedMethod?.delay||'45 min'))
      updateUser({ ...user, balance: (user?.balance||0) - parseFloat(form.amount) })
      const r = await withdrawalAPI.getAll(); setWithdrawals(r.data.withdrawals)
      setForm({ amount:'', method:'', walletAddress:'' })
      setTab('history')
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur') }
    finally { setLoading(false) }
  }

  return (
    <div className="dash-enter" style={{ maxWidth:560,margin:'0 auto' }}>
      <div style={{ marginBottom:'1rem' }}>
        <h1 style={{ fontFamily:'"Clash Display",sans-serif',fontSize:'1.5rem',fontWeight:700,color:'var(--text-primary)',marginBottom:3 }}>Retraits</h1>
        <p style={{ color:'var(--text-secondary)',fontSize:13 }}>Retirez vos gains en cryptomonnaie</p>
      </div>

      <div style={{ display:'flex',alignItems:'center',gap:10,padding:'0.75rem 1rem',background:'var(--accent-glow)',border:'1px solid var(--accent-glow)',borderRadius:12,marginBottom:'1.25rem' }}>
        <ArrowUpCircle size={16} color="var(--accent)" />
        <p style={{ fontSize:12,color:'var(--text-primary)' }}>Solde : <span style={{ fontWeight:700,color:'var(--accent)' }}>${(user?.balance||0).toFixed(2)}</span> · Min. 10$</p>
      </div>

      <div className="tab-bar" style={{ marginBottom:'1.25rem',width:'fit-content' }}>
        <button className={'tab-btn'+(tab==='new'?' active':'')} onClick={()=>setTab('new')}>Nouveau</button>
        <button className={'tab-btn'+(tab==='history'?' active':'')} onClick={()=>setTab('history')}>Historique</button>
      </div>

      {tab === 'new' && (
        <form onSubmit={submit} style={{ display:'flex',flexDirection:'column',gap:'1rem' }}>
          <div className="card">
            <p style={{ fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.75rem' }}>Cryptomonnaie de retrait</p>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(110px,1fr))',gap:8 }}>
              {METHODS.map(m => (
                <div key={m.value} className={'payment-card'+(form.method===m.value?' selected':'')} onClick={()=>setForm(p=>({...p,method:m.value,walletAddress:''}))} style={{ padding:'0.65rem 0.4rem' }}>
                  <div style={{ fontSize:22,marginBottom:3,fontWeight:700 }}>{m.emoji}</div>
                  <p style={{ fontSize:10,fontWeight:700,color:'var(--text-primary)' }}>{m.label}</p>
                  <p style={{ fontSize:9,color:'var(--text-muted)' }}>{m.network}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <label className="label">Montant ($)</label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',fontWeight:700 }}>$</span>
              <input type="number" name="amount" value={form.amount} onChange={handle} min="10" max={user?.balance} className="input" style={{ paddingLeft:28 }} placeholder="Min. 10$" />
            </div>
            {form.amount && parseFloat(form.amount) > 0 && (
              <div style={{ marginTop:10, padding:'0.75rem', background:'var(--bg-card2)', borderRadius:10, fontSize:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ color:'var(--text-muted)' }}>Montant demandé</span>
                  <span style={{ fontWeight:600 }}>${parseFloat(form.amount).toFixed(2)}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ color:'var(--red)' }}>Frais de réseau (2%)</span>
                  <span style={{ fontWeight:600, color:'var(--red)' }}>-${(parseFloat(form.amount) * 0.02).toFixed(2)}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', borderTop:'1px solid var(--border)', paddingTop:4, marginTop:4 }}>
                  <span style={{ color:'var(--text-primary)', fontWeight:700 }}>Montant reçu</span>
                  <span style={{ fontWeight:800, color:'var(--green)' }}>${(parseFloat(form.amount) * 0.98).toFixed(2)}</span>
                </div>
              </div>
            )}
            {(user?.balance||0) > 0 && (
              <div style={{ display:'flex',gap:6,marginTop:8 }}>
                {[10,50,100].filter(v => v <= (user?.balance||0)).map(v => (
                  <button type="button" key={v} onClick={()=>setForm(p=>({...p,amount:v.toString()}))} style={{ flex:1,padding:'0.35rem',background:'var(--bg-card2)',border:'1px solid var(--border)',borderRadius:9,fontSize:11,fontWeight:600,color:'var(--text-secondary)',cursor:'pointer',fontFamily:'inherit' }}>${v}</button>
                ))}
                <button type="button" onClick={()=>setForm(p=>({...p,amount:(user?.balance||0).toString()}))} style={{ flex:1,padding:'0.35rem',background:'var(--bg-card2)',border:'1px solid var(--border)',borderRadius:9,fontSize:11,fontWeight:600,color:'var(--accent)',cursor:'pointer',fontFamily:'inherit' }}>Tout</button>
              </div>
            )}
          </div>

          <div className="card">
            <label className="label">{selectedMethod ? selectedMethod.label+' — Adresse' : 'Adresse de portefeuille'}</label>
            <input type="text" name="walletAddress" value={form.walletAddress} onChange={handle} className="input" placeholder={selectedMethod?.placeholder || 'Choisissez une crypto'} />
            {selectedMethod?.hint && <p style={{ fontSize:11,color:'var(--text-muted)',marginTop:6,display:'flex',gap:5,alignItems:'flex-start' }}><AlertCircle size={12} style={{ flexShrink:0,marginTop:1 }} /> {selectedMethod.hint}</p>}
          </div>

          <div style={{ padding:'0.75rem 0.875rem',background:'rgba(255,92,122,0.07)',border:'1px solid rgba(255,92,122,0.18)',borderRadius:10,fontSize:11,color:'var(--text-secondary)',display:'flex',gap:6 }}>
            <AlertCircle size={13} color="var(--red)" style={{ flexShrink:0,marginTop:1 }} />
            <span>Vérifiez votre adresse avant de soumettre. Transaction blockchain non annulable.</span>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%',justifyContent:'center',padding:'0.9rem' }}>
            {loading ? <div style={{ width:19,height:19,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} /> : <><ArrowUpCircle size={16}/> Demander le retrait</>}
          </button>
        </form>
      )}

      {tab === 'history' && (
        <div className="card">
          <p style={{ fontFamily:'"Clash Display",sans-serif',fontWeight:700,color:'var(--text-primary)',marginBottom:'1rem',fontSize:'0.95rem' }}>Historique</p>
          {withdrawals.length === 0 ? (
            <div style={{ textAlign:'center',padding:'2.5rem 0',color:'var(--text-muted)' }}><ArrowUpCircle size={32} style={{ margin:'0 auto 10px',opacity:0.3 }} /><p style={{ fontSize:13 }}>Aucun retrait</p></div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {withdrawals.map(w => {
                const m = METHODS.find(x => x.value === w.method)
                return (
                  <div key={w._id} className="mobile-list-item">
                    <div style={{ width:36,height:36,borderRadius:11,background:w.status==='approved'?'rgba(45,212,191,0.1)':w.status==='rejected'?'rgba(255,92,122,0.1)':'var(--accent-glow)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,flexShrink:0,color:'var(--text-primary)' }}>{m?.emoji||'₿'}</div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <p style={{ fontWeight:600,color:'var(--text-primary)',fontSize:13 }}>{m?.label||w.method}</p>
                      <p style={{ fontSize:10,color:'var(--text-muted)',fontFamily:'monospace',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:150 }}>{w.walletAddress}</p>
                    </div>
                    <div style={{ textAlign:'right',flexShrink:0 }}>
                      <p style={{ fontWeight:700,color:'var(--red)',fontSize:14 }}>-${w.amount?.toLocaleString()}</p>
                      {w.netAmount && <p style={{ fontSize:10,color:'var(--green)', fontWeight:600 }}>Reçu : ${w.netAmount.toLocaleString()}</p>}
                      <span className={'badge-'+w.status}>{w.status==='pending'?'En attente':w.status==='approved'?'Approuvé':'Rejeté'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
