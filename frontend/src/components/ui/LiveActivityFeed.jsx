import { useState, useEffect, useCallback } from 'react'
import { ArrowDownCircle, ArrowUpCircle, TrendingUp } from 'lucide-react'

/**
 * LiveActivityFeed — Real-time activity feed (simulated)
 *
 * Displays recent transactions with timestamps ranging
 * from "just now" to "29 min ago" to give a realistic feel.
 *
 * Timestamps update in real time (minute by minute).
 * New entries arrive every 15-45 seconds.
 *
 * To customize amounts and names: edit the POOL array below.
 */

const CRYPTO_LABELS = {
  bitcoin:  { label:'Bitcoin',  emoji:'₿' },
  ethereum: { label:'Ethereum', emoji:'Ξ' },
  usdt:     { label:'USDT',     emoji:'₮' },
  bnb:      { label:'BNB',      emoji:'◆' },
}

// Pool de transactions à afficher (ordre aléatoire, horodatage dynamique)
const POOL = [
  { type:'deposit',    name:'K. Mensah',    amount:500,   crypto:'bitcoin'  },
  { type:'earn',       name:'F. Diallo',    amount:47.50, plan:'Pro'        },
  { type:'deposit',    name:'I. Touré',     amount:1000,  crypto:'usdt'     },
  { type:'withdraw',   name:'A. Koné',      amount:315,   crypto:'ethereum' },
  { type:'earn',       name:'S. Ndiaye',    amount:112,   plan:'Premium'    },
  { type:'deposit',    name:'M. Bah',       amount:200,   crypto:'bnb'      },
  { type:'earn',       name:'C. Ouedraogo', amount:28.90, plan:'Starter'    },
  { type:'deposit',    name:'J. Eze',       amount:5000,  crypto:'bitcoin'  },
  { type:'earn',       name:'A. Traoré',    amount:87.15, plan:'Pro'        },
  { type:'withdraw',   name:'O. Diop',      amount:200,   crypto:'usdt'     },
  { type:'deposit',    name:'B. Sawadogo',  amount:300,   crypto:'ethereum' },
  { type:'earn',       name:'R. Fofana',    amount:198.6, plan:'Premium'    },
  { type:'deposit',    name:'L. Gbagbo',    amount:750,   crypto:'usdt'     },
  { type:'withdraw',   name:'P. Coulibaly', amount:100,   crypto:'bnb'      },
  { type:'earn',       name:'D. Camara',    amount:54.20, plan:'Pro'        },
  { type:'deposit',    name:'E. Asante',    amount:2000,  crypto:'bitcoin'  },
  { type:'earn',       name:'N. Keita',     amount:63.40, plan:'Starter'    },
  { type:'withdraw',   name:'T. Manga',     amount:450,   crypto:'ethereum' },
  { type:'deposit',    name:'Y. Oumar',     amount:800,   crypto:'usdt'     },
  { type:'earn',       name:'G. Mensah',    amount:145,   plan:'Premium'    },
]

function getLabel(tx) {
  if (tx.type === 'deposit')  return `Deposit ${CRYPTO_LABELS[tx.crypto]?.label || 'Crypto'}`
  if (tx.type === 'withdraw') return `Withdrawal ${CRYPTO_LABELS[tx.crypto]?.label || 'Crypto'}`
  return `Earnings — ${tx.plan} Plan`
}

function getIcon(type) {
  if (type === 'deposit')  return { Icon: ArrowDownCircle, color:'var(--green)' }
  if (type === 'withdraw') return { Icon: ArrowUpCircle,   color:'var(--red)' }
  return { Icon: TrendingUp, color:'var(--accent)' }
}

function getSign(type) {
  if (type === 'earn')    return '+'
  if (type === 'deposit') return '+'
  return '-'
}

function buildInitialList() {
  // Distribuer 12 entrées aléatoires avec des timestamps de 0 à 29 min
  const shuffled = [...POOL].sort(() => Math.random() - 0.5)
  const now = Date.now()
  return shuffled.slice(0, 12).map((tx, i) => ({
    ...tx,
    id:        Math.random().toString(36).slice(2),
    timestamp: now - (i * 2.5 + Math.random() * 2) * 60000, // 0→29 min
  }))
}

function formatAgo(timestamp) {
  const mins = Math.floor((Date.now() - timestamp) / 60000)
  if (mins < 1)  return 'Just now'
  if (mins === 1) return '1 min ago'
  return `${mins} min ago`
}

export default function LiveActivityFeed() {
  const [entries, setEntries] = useState(buildInitialList)
  // Ajouter une nouvelle transaction toutes les 15-45s
  const addNew = useCallback(() => {
    const tx = POOL[Math.floor(Math.random() * POOL.length)]
    setEntries(prev => [
      { ...tx, id: Math.random().toString(36).slice(2), timestamp: Date.now() },
      ...prev.slice(0, 14), // garder max 15 entrées
    ])
  }, [])

  // MAJ toutes les 60s pour rafraîchir "il y a X min"
  useEffect(() => {
    const tickTimer = setInterval(() => setTick(t => t + 1), 60000)
    return () => clearInterval(tickTimer)
  }, [])

  // Nouvelles entrées aléatoires
  useEffect(() => {
    const delay = 15000 + Math.random() * 30000 // 15–45s
    const timer = setTimeout(() => { addNew(); }, delay)
    return () => clearTimeout(timer)
  }, [entries, addNew])

  return (
    <div className="float-card dash-enter" style={{ overflow:'hidden' }}>
      {/* Header */}
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem' }}>
        <div>
          <p className="dash-card-title" style={{ color:'var(--text-primary)' }}>
            Live Activity
          </p>
          <p style={{ fontSize:11,color:'var(--text-muted)' }}>Recent deposits &amp; withdrawals</p>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:6,padding:'0.3rem 0.7rem',background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:999 }}>
          <div className="live-dot" style={{ position:'relative',width:7,height:7 }} />
          <span style={{ fontSize:10,fontWeight:700,color:'var(--green)' }}>LIVE</span>
        </div>
      </div>

      {/* Liste scrollable */}
      <div style={{ display:'flex',flexDirection:'column',gap:6,maxHeight:320,overflowY:'auto' }}>
        {entries.map((tx) => {
          const { Icon, color } = getIcon(tx.type)
          return (
            <div
              key={tx.id}
              style={{
                display:'flex',alignItems:'center',gap:10,
                padding:'0.625rem 0.75rem',
                background:'var(--bg-card2)',borderRadius:12,
                border:'1px solid var(--border)',
                transition:'opacity 0.3s',
                animation: tx.timestamp > Date.now() - 3000 ? 'dashFadeUp 0.4s ease forwards' : 'none',
              }}
            >
              <div style={{ width:32,height:32,borderRadius:10,background:color+'14',border:`1px solid ${color}22`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <Icon size={15} color={color} />
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <p style={{ fontSize:12,fontWeight:600,color:'var(--text-primary)',marginBottom:1 }}>
                  {tx.name}
                  <span style={{ color:'var(--text-muted)',fontWeight:400 }}> · {getLabel(tx)}</span>
                </p>
                <p style={{ fontSize:10,color:'var(--text-muted)' }}>
                  {formatAgo(tx.timestamp)}
                </p>
              </div>
              <p style={{ fontWeight:800,fontSize:13,color: tx.type==='withdraw' ? 'var(--red)' : color,flexShrink:0 }}>
                {getSign(tx.type)}${tx.amount.toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2})}
              </p>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <p style={{ fontSize:10,color:'var(--text-muted)',textAlign:'center',marginTop:'0.75rem',paddingTop:'0.75rem',borderTop:'1px solid var(--border)' }}>
        Activity from the last 30 minutes · Updated continuously
      </p>
    </div>
  )
}
