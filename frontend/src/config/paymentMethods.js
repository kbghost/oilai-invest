export const PAYMENT_METHODS = [
  {
    value: 'bitcoin',
    label: 'Bitcoin (BTC)',
    logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png',
    address: 'bc1qs57elyrscvxmjp2qnaje4kmelvmcevfew64e4w',
    name: 'Wallet BTC OilAI',
    instructions: 'Native Bitcoin network. 2 confirmations required.',
    network: 'BTC',
    placeholder: 'bc1q... or 1A1zP1...',
    hint: 'Valid Bitcoin address. Verify before sending.',
    delay: '45 min',
    depositIcon: '₿'
  },
  {
    value: 'ethereum',
    label: 'Ethereum (ETH)',
    logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png',
    address: '0x2C4bb9f9a2978E9dd2FB942c6f7B77ab2603AB7D',
    name: 'Wallet ETH OilAI',
    instructions: 'ERC20 network only. Verify address before sending.',
    network: 'ERC20',
    placeholder: '0x...',
    hint: 'Valid ERC20 address only.',
    delay: '45 min',
    depositIcon: 'Ξ'
  },
  {
    value: 'usdt',
    label: 'USDT',
    logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png',
    address: 'TEQqn2RvN3mVTZwyeyPEWxF21zHrqhFUKt',
    name: 'Wallet USDT OilAI',
    instructions: 'TRC20 network only. Avoid ERC20 — funds will be lost.',
    network: 'TRC20',
    placeholder: 'T...',
    hint: 'TRC20 network only.',
    delay: '45 min',
    depositIcon: '₮'
  },
  {
    value: 'bnb',
    label: 'BNB',
    logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png',
    address: '0x2C4bb9f9a2978E9dd2FB942c6f7B77ab2603AB7D',
    name: 'Wallet BNB OilAI',
    instructions: 'BNB Smart Chain (BEP20) network only.',
    network: 'BEP20',
    placeholder: 'bnb1...',
    hint: 'BNB Smart Chain (BEP20) network.',
    delay: '45 min',
    depositIcon: '◈'
  }
]

export const getPaymentMethod = (value) => PAYMENT_METHODS.find((method) => method.value === value) || null
