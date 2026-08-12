import { useEffect, useState, useRef } from 'react'
import { depositAPI } from '../services/api'
import { PAYMENT_METHODS, getPaymentMethod } from '../config/paymentMethods'
import { Upload, ArrowDownCircle, Check, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

function copyToClipboard(text) { navigator.clipboard.writeText(text).then(() => toast.success('Copied!')) }

export default function Deposits() {
  const [deposits, setDeposits] = useState([])
  const [method, setMethod]     = useState('')
  const [amount, setAmount]     = useState('')
  const [reference, setReference] = useState('')
  const [file, setFile]         = useState(null)
  const [loading, setLoading]   = useState(false)
  const [tab, setTab]           = useState('new')
  const fileRef = useRef()

  useEffect(() => { depositAPI.getAll().then(r => setDeposits(r.data.deposits)).catch(()=>{}) }, [])
  const selectedMethod = getPaymentMethod(method)

  const submit = async e => {
    e.preventDefault()
    if (!method) return toast.error('Please select a cryptocurrency')
    if (!amount || parseFloat(amount) < 10) return toast.error('Minimum amount: $10')
    const fd = new FormData()
    fd.append('amount', amount); fd.append('method', method); fd.append('reference', reference)
    if (file) fd.append('proofImage', file)
    setLoading(true)
    try {
      await depositAPI.create(fd)
      toast.success('Deposit submitted! Pending approval.')
      const r = await depositAPI.getAll(); setDeposits(r.data.deposits)
      setAmount(''); setReference(''); setFile(null); setMethod('')
      setTab('history')
    } catch (err) { toast.error(err.response?.data?.message || 'Error submitting deposit') }
    finally { setLoading(false) }
  }

  return (
    <div className="dash-enter" style={{ maxWidth:600,margin:'0 auto' }}>
      <div style={{ marginBottom:'1rem' }}>
        <h1 style={{ fontFamily:'"Poppins",sans-serif',fontSize:'1.5rem',fontWeight:700,color:'var(--text-primary)',marginBottom:3 }}>Deposits</h1>
        <p style={{ color:'var(--text-secondary)',fontSize:13 }}>Fund your account with cryptocurrency</p>
      </div>

      <div className="tab-bar" style={{ marginBottom:'1.25rem',width:'fit-content' }}>
        <button className={'tab-btn'+(tab==='new'?' active':'')} onClick={()=>setTab('new')}>New Deposit</button>
        <button className={'tab-btn'+(tab==='history'?' active':'')} onClick={()=>setTab('history')}>History</button>
      </div>

      {tab === 'new' && (
        <form onSubmit={submit} style={{ display:'flex',flexDirection:'column',gap:'1rem' }}>
          {/* Step 1 */}
          <div className="card">
            <p style={{ fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.75rem' }}>1 · Select Cryptocurrency</p>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:8 }}>
              {PAYMENT_METHODS.map(m => (
                <div key={m.value} className={'payment-card'+(method===m.value?' selected':'')} onClick={()=>setMethod(m.value)} style={{ padding:'0.75rem 0.5rem' }}>
                  <img src={m.logo} alt={m.label} style={{ width:32,height:32,objectFit:'contain',margin:'0 auto 4px' }} />
                  <p style={{ fontSize:11,fontWeight:700,color:'var(--text-primary)' }}>{m.label}</p>
                  <p style={{ fontSize:9,color:'var(--text-muted)' }}>{m.network}</p>
                </div>
              ))}
            </div>

            {selectedMethod && (
              <div style={{ marginTop:'1rem',padding:'0.875rem',background:'var(--bg-card2)',borderRadius:12,border:'1px solid var(--border)' }}>
                <p style={{ fontSize:10,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8 }}>Send to this address:</p>
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:8 }}>
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontWeight:700,color:'var(--text-primary)',fontSize:12.5,fontFamily:'monospace',wordBreak:'break-all' }}>{selectedMethod.address}</p>
                    <p style={{ fontSize:11,color:'var(--text-secondary)' }}>{selectedMethod.name} · {selectedMethod.network} Network</p>
                  </div>
                  <button type="button" onClick={()=>copyToClipboard(selectedMethod.address)} style={{ flexShrink:0,padding:'0.35rem 0.65rem',background:'var(--accent-glow)',border:'1px solid var(--accent-glow)',borderRadius:9,color:'var(--accent)',fontSize:11,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:4,fontFamily:'inherit' }}>
                    <Copy size={12}/> Copy
                  </button>
                </div>
                <div style={{ padding:'0.625rem',background:'var(--accent-glow)',borderRadius:9,fontSize:11,color:'var(--text-secondary)',lineHeight:1.5 }}>⚠️ {selectedMethod.instructions}</div>
              </div>
            )}
          </div>

          {/* Step 2 */}
          <div className="card">
            <p style={{ fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.75rem' }}>2 · Amount</p>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',fontWeight:700 }}>$</span>
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} min="10" className="input" style={{ paddingLeft:28 }} placeholder="Min. $10" />
            </div>
            <div style={{ display:'flex',gap:6,marginTop:8 }}>
              {[100,500,1000,5000].map(v => (
                <button type="button" key={v} onClick={()=>setAmount(v.toString())} style={{ flex:1,padding:'0.35rem',background:'var(--bg-card2)',border:'1px solid var(--border)',borderRadius:9,fontSize:11,fontWeight:600,color:'var(--text-secondary)',cursor:'pointer',fontFamily:'inherit' }}>${v.toLocaleString()}</button>
              ))}
            </div>
          </div>

          {/* Step 3 */}
          <div className="card">
            <p style={{ fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.75rem' }}>3 · Proof of Payment</p>
            <div style={{ marginBottom:10 }}>
              <label className="label">Transaction Hash (optional)</label>
              <input type="text" value={reference} onChange={e=>setReference(e.target.value)} className="input" placeholder="e.g. 0xabc123..." />
            </div>
            <div>
              <label className="label">Screenshot / Receipt (optional)</label>
              <div onClick={()=>fileRef.current.click()} style={{ border:'2px dashed var(--border)',borderRadius:12,padding:'1.5rem',textAlign:'center',cursor:'pointer' }}>
                {file ? <p style={{ color:'var(--green)',fontWeight:600,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',gap:5 }}><Check size={14}/> {file.name}</p>
                : <><Upload size={22} color="var(--text-muted)" style={{ margin:'0 auto 6px' }} /><p style={{ color:'var(--text-muted)',fontSize:12 }}>Click to attach screenshot</p></>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>setFile(e.target.files[0])} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%',justifyContent:'center',padding:'0.9rem' }}>
            {loading ? <div style={{ width:19,height:19,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} /> : <><ArrowDownCircle size={16}/> Submit Deposit</>}
          </button>
        </form>
      )}

      {tab === 'history' && (
        <div className="card">
          <p style={{ fontFamily:'"Poppins",sans-serif',fontWeight:700,color:'var(--text-primary)',marginBottom:'1rem',fontSize:'0.95rem' }}>Deposit History</p>
          {deposits.length === 0 ? (
            <div style={{ textAlign:'center',padding:'2.5rem 0',color:'var(--text-muted)' }}><ArrowDownCircle size={32} style={{ margin:'0 auto 10px',opacity:0.3 }} /><p style={{ fontSize:13 }}>No deposits yet</p></div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {deposits.map(d => {
                const m = getPaymentMethod(d.method)
                return (
                  <div key={d._id} className="mobile-list-item">
                    <div style={{ width:36,height:36,borderRadius:11,background:d.status==='approved'?'rgba(45,212,191,0.1)':d.status==='rejected'?'rgba(255,92,122,0.1)':'var(--accent-glow)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,flexShrink:0,color:'var(--text-primary)' }}>{m?.depositIcon || '₿'}</div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <p style={{ fontWeight:600,color:'var(--text-primary)',fontSize:13 }}>{m?.label||d.method}</p>
                      <p style={{ fontSize:11,color:'var(--text-muted)' }}>{new Date(d.createdAt).toLocaleDateString('en-US')}</p>
                    </div>
                    <div style={{ textAlign:'right',flexShrink:0 }}>
                      <p style={{ fontWeight:700,color:'var(--text-primary)',fontSize:14 }}>${d.amount?.toLocaleString()}</p>
                      <span className={'badge-'+d.status}>{d.status==='pending'?'Pending':d.status==='approved'?'Approved':'Rejected'}</span>
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
