import { useEffect, useState, useRef } from 'react'
import { depositAPI } from '../services/api'
import { Upload, ArrowDownCircle, Check, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * 💳 MÉTHODES DE DÉPÔT — 100% Cryptomonnaies
 * Pour modifier une adresse de portefeuille, éditez le champ `number` ci-dessous.
 */
const METHODS = [
  { value:'bitcoin',  label:'Bitcoin (BTC)',   logo:'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png', number:'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', name:'Wallet BTC OilAI', instructions:'Réseau Bitcoin natif. 2 confirmations requises.', network:'BTC' },
  { value:'ethereum', label:'Ethereum (ETH)',  logo:'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png', number:'0x71C7656EC7ab88b098defB751B7401B5f6d8976F', name:'Wallet ETH OilAI', instructions:'Réseau ERC20 uniquement. Vérifiez l\'adresse avant envoi.', network:'ERC20' },
  { value:'usdt',     label:'USDT',            logo:'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png', number:'TN3W4h6rK2CE4zJe3ZE1x9L9JXmbgEZquT', name:'Wallet USDT OilAI', instructions:'Réseau TRC20 uniquement. Évitez ERC20 — fonds perdus.', network:'TRC20' },
  { value:'bnb',      label:'BNB',             logo:'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png', number:'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2', name:'Wallet BNB OilAI', instructions:'Réseau BNB Smart Chain (BEP20) uniquement.', network:'BEP20' },
]

function copyToClipboard(text) { navigator.clipboard.writeText(text).then(() => toast.success('Copié !')) }

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
  const selectedMethod = METHODS.find(m => m.value === method)

  const submit = async e => {
    e.preventDefault()
    if (!method) return toast.error('Choisissez une cryptomonnaie')
    if (!amount || parseFloat(amount) < 10) return toast.error('Montant minimum : 10$')
    const fd = new FormData()
    fd.append('amount', amount); fd.append('method', method); fd.append('reference', reference)
    if (file) fd.append('proofImage', file)
    setLoading(true)
    try {
      await depositAPI.create(fd)
      toast.success('Dépôt soumis ! En attente de validation.')
      const r = await depositAPI.getAll(); setDeposits(r.data.deposits)
      setAmount(''); setReference(''); setFile(null); setMethod('')
      setTab('history')
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur') }
    finally { setLoading(false) }
  }

  return (
    <div className="dash-enter" style={{ maxWidth:600,margin:'0 auto' }}>
      <div style={{ marginBottom:'1rem' }}>
        <h1 style={{ fontFamily:'"Poppins",sans-serif',fontSize:'1.5rem',fontWeight:700,color:'var(--text-primary)',marginBottom:3 }}>Dépôts</h1>
        <p style={{ color:'var(--text-secondary)',fontSize:13 }}>Rechargez votre compte en cryptomonnaie</p>
      </div>

      <div className="tab-bar" style={{ marginBottom:'1.25rem',width:'fit-content' }}>
        <button className={'tab-btn'+(tab==='new'?' active':'')} onClick={()=>setTab('new')}>Nouveau dépôt</button>
        <button className={'tab-btn'+(tab==='history'?' active':'')} onClick={()=>setTab('history')}>Historique</button>
      </div>

      {tab === 'new' && (
        <form onSubmit={submit} style={{ display:'flex',flexDirection:'column',gap:'1rem' }}>
          {/* Step 1 */}
          <div className="card">
            <p style={{ fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.75rem' }}>1 · Choisir la cryptomonnaie</p>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:8 }}>
              {METHODS.map(m => (
                <div key={m.value} className={'payment-card'+(method===m.value?' selected':'')} onClick={()=>setMethod(m.value)} style={{ padding:'0.75rem 0.5rem' }}>
                  <img src={m.logo} alt={m.label} style={{ width:32,height:32,objectFit:'contain',margin:'0 auto 4px' }} />
                  <p style={{ fontSize:11,fontWeight:700,color:'var(--text-primary)' }}>{m.label}</p>
                  <p style={{ fontSize:9,color:'var(--text-muted)' }}>{m.network}</p>
                </div>
              ))}
            </div>

            {selectedMethod && (
              <div style={{ marginTop:'1rem',padding:'0.875rem',background:'var(--bg-card2)',borderRadius:12,border:'1px solid var(--border)' }}>
                <p style={{ fontSize:10,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8 }}>Envoyez à cette adresse :</p>
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:8 }}>
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontWeight:700,color:'var(--text-primary)',fontSize:12.5,fontFamily:'monospace',wordBreak:'break-all' }}>{selectedMethod.number}</p>
                    <p style={{ fontSize:11,color:'var(--text-secondary)' }}>{selectedMethod.name} · Réseau {selectedMethod.network}</p>
                  </div>
                  <button type="button" onClick={()=>copyToClipboard(selectedMethod.number)} style={{ flexShrink:0,padding:'0.35rem 0.65rem',background:'var(--accent-glow)',border:'1px solid var(--accent-glow)',borderRadius:9,color:'var(--accent)',fontSize:11,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:4,fontFamily:'inherit' }}>
                    <Copy size={12}/> Copier
                  </button>
                </div>
                <div style={{ padding:'0.625rem',background:'var(--accent-glow)',borderRadius:9,fontSize:11,color:'var(--text-secondary)',lineHeight:1.5 }}>⚠️ {selectedMethod.instructions}</div>
              </div>
            )}
          </div>

          {/* Step 2 */}
          <div className="card">
            <p style={{ fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.75rem' }}>2 · Montant</p>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',fontWeight:700 }}>$</span>
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} min="10" className="input" style={{ paddingLeft:28 }} placeholder="Min. 10$" />
            </div>
            <div style={{ display:'flex',gap:6,marginTop:8 }}>
              {[100,500,1000,5000].map(v => (
                <button type="button" key={v} onClick={()=>setAmount(v.toString())} style={{ flex:1,padding:'0.35rem',background:'var(--bg-card2)',border:'1px solid var(--border)',borderRadius:9,fontSize:11,fontWeight:600,color:'var(--text-secondary)',cursor:'pointer',fontFamily:'inherit' }}>${v.toLocaleString()}</button>
              ))}
            </div>
          </div>

          {/* Step 3 */}
          <div className="card">
            <p style={{ fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.75rem' }}>3 · Preuve de transaction</p>
            <div style={{ marginBottom:10 }}>
              <label className="label">Hash de transaction (optionnel)</label>
              <input type="text" value={reference} onChange={e=>setReference(e.target.value)} className="input" placeholder="Ex: 0xabc123..." />
            </div>
            <div>
              <label className="label">Capture d'écran (optionnel)</label>
              <div onClick={()=>fileRef.current.click()} style={{ border:'2px dashed var(--border)',borderRadius:12,padding:'1.5rem',textAlign:'center',cursor:'pointer' }}>
                {file ? <p style={{ color:'var(--green)',fontWeight:600,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',gap:5 }}><Check size={14}/> {file.name}</p>
                : <><Upload size={22} color="var(--text-muted)" style={{ margin:'0 auto 6px' }} /><p style={{ color:'var(--text-muted)',fontSize:12 }}>Cliquez pour joindre une image</p></>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>setFile(e.target.files[0])} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%',justifyContent:'center',padding:'0.9rem' }}>
            {loading ? <div style={{ width:19,height:19,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} /> : <><ArrowDownCircle size={16}/> Soumettre le dépôt</>}
          </button>
        </form>
      )}

      {tab === 'history' && (
        <div className="card">
          <p style={{ fontFamily:'"Poppins",sans-serif',fontWeight:700,color:'var(--text-primary)',marginBottom:'1rem',fontSize:'0.95rem' }}>Historique</p>
          {deposits.length === 0 ? (
            <div style={{ textAlign:'center',padding:'2.5rem 0',color:'var(--text-muted)' }}><ArrowDownCircle size={32} style={{ margin:'0 auto 10px',opacity:0.3 }} /><p style={{ fontSize:13 }}>Aucun dépôt</p></div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {deposits.map(d => {
                const m = METHODS.find(x => x.value === d.method)
                return (
                  <div key={d._id} className="mobile-list-item">
                    <div style={{ width:36,height:36,borderRadius:11,background:d.status==='approved'?'rgba(45,212,191,0.1)':d.status==='rejected'?'rgba(255,92,122,0.1)':'var(--accent-glow)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,flexShrink:0,color:'var(--text-primary)' }}>{m?.emoji||'₿'}</div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <p style={{ fontWeight:600,color:'var(--text-primary)',fontSize:13 }}>{m?.label||d.method}</p>
                      <p style={{ fontSize:11,color:'var(--text-muted)' }}>{new Date(d.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div style={{ textAlign:'right',flexShrink:0 }}>
                      <p style={{ fontWeight:700,color:'var(--text-primary)',fontSize:14 }}>${d.amount?.toLocaleString()}</p>
                      <span className={'badge-'+d.status}>{d.status==='pending'?'En attente':d.status==='approved'?'Approuvé':'Rejeté'}</span>
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
