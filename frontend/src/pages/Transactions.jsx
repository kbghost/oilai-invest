import { useEffect, useState } from 'react'
import { depositAPI, withdrawalAPI, investmentAPI } from '../services/api'
import { ArrowDownCircle, ArrowUpCircle, TrendingUp } from 'lucide-react'

const PAYMENT_LABELS = { bitcoin:'Bitcoin', ethereum:'Ethereum', usdt:'USDT TRC20', bnb:'BNB' }

export default function Transactions() {
  const [deposits, setDeposits]       = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [investments, setInvestments] = useState([])
  const [filter, setFilter]           = useState('all')

  useEffect(() => {
    Promise.all([depositAPI.getAll(), withdrawalAPI.getAll(), investmentAPI.getAll()])
      .then(([d, w, i]) => { setDeposits(d.data.deposits); setWithdrawals(w.data.withdrawals); setInvestments(i.data.investments) })
  }, [])

  const all = [
    ...deposits.map(d => ({ ...d, _type:'deposit' })),
    ...withdrawals.map(w => ({ ...w, _type:'withdrawal' })),
    ...investments.map(i => ({ ...i, _type:'investment' })),
  ].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))

  const filtered = filter === 'all' ? all : all.filter(t => t._type === filter)

  const typeConfig = {
    deposit:    { icon:ArrowDownCircle, color:'var(--green)', bg:'rgba(0,212,160,0.1)', sign:'+' },
    withdrawal: { icon:ArrowUpCircle,   color:'var(--red)',   bg:'rgba(255,75,110,0.1)', sign:'-' },
    investment: { icon:TrendingUp,      color:'var(--blue)',  bg:'rgba(59,142,255,0.1)',  sign:'-' },
  }

  const tabs = [
    { val:'all',        label:'All' },
    { val:'deposit',    label:'Deposits' },
    { val:'withdrawal', label:'Withdrawals' },
    { val:'investment', label:'Invest.' },
  ]

  return (
    <div className="dash-enter" style={{ maxWidth:720,margin:'0 auto',display:'flex',flexDirection:'column',gap:'1rem' }}>
      <div>
        <h1 style={{ fontFamily:'"Poppins",sans-serif',fontSize:'1.5rem',fontWeight:700,color:'var(--text-primary)',marginBottom:3 }}>Transaction History</h1>
        <p style={{ color:'var(--text-secondary)',fontSize:13 }}>All your transactions in one place</p>
      </div>

      <div className="tab-bar" style={{ width:'fit-content',overflowX:'auto' }}>
        {tabs.map(({ val, label }) => (
          <button key={val} className={'tab-btn'+(filter===val?' active':'')} onClick={()=>setFilter(val)}>{label}</button>
        ))}
      </div>

      <div className="card" style={{ padding:0 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center',padding:'3rem 1.5rem',color:'var(--text-muted)' }}>
            <TrendingUp size={32} style={{ margin:'0 auto 10px',opacity:0.3 }} />
            <p style={{ fontSize:13 }}>No transactions found</p>
          </div>
        ) : (
          <div>
            {filtered.map((t, i) => {
              const cfg = typeConfig[t._type]
              const Icon = cfg.icon
              const label = t._type === 'investment'
                ? (t.plan?.charAt(0).toUpperCase()+t.plan?.slice(1))+' Plan'
                : t._type === 'deposit' ? 'Deposit — '+(PAYMENT_LABELS[t.method]||t.method)
                : 'Withdrawal — '+(PAYMENT_LABELS[t.method]||t.method)
              return (
                <div key={t._id} style={{ display:'flex',alignItems:'center',gap:11,padding:'0.875rem 1.1rem',borderBottom:i<filtered.length-1?'1px solid var(--border)':'none' }}>
                  <div style={{ width:34,height:34,borderRadius:10,background:cfg.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                    <Icon size={15} color={cfg.color} />
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <p style={{ fontWeight:600,color:'var(--text-primary)',fontSize:13,marginBottom:1 }}>{label}</p>
                    <p style={{ fontSize:10,color:'var(--text-muted)' }}>{new Date(t.createdAt).toLocaleDateString('en-US',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</p>
                  </div>
                  <div style={{ textAlign:'right',flexShrink:0 }}>
                    <p style={{ fontWeight:700,color:t._type==='deposit'?'var(--green)':'var(--red)',fontSize:13 }}>{cfg.sign}${t.amount?.toLocaleString('en-US')}</p>
                    {t.status && <span className={'badge-'+t.status} style={{ fontSize:9 }}>{
                      t.status==='pending'   ? 'Pending'   :
                      t.status==='approved'  ? 'Approved'  :
                      t.status==='rejected'  ? 'Rejected'  :
                      t.status==='active'    ? 'Active'    :
                      t.status==='completed' ? 'Completed' :
                      t.status==='cancelled' ? 'Cancelled' : t.status
                    }</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
