// ─── Oil Price AI Simulation ─────────────────────────────────────────────────
// Simulates realistic WTI crude oil market data for the AI investment model

const generateOilHistory = (days = 30) => {
  const data = [];
  let price = 78;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Simulate realistic market movement
    const momentum = (Math.random() - 0.48) * 1.5;  // Slight upward bias
    const volatility = (Math.random() - 0.5) * 2.5;  // ±$2.5 noise
    price = Math.max(60, Math.min(100, price + momentum + volatility));

    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      open: parseFloat((price - Math.random() * 1).toFixed(2)),
      high: parseFloat((price + Math.random() * 1.5).toFixed(2)),
      low: parseFloat((price - Math.random() * 1.5).toFixed(2)),
      volume: Math.floor(Math.random() * 50000 + 80000)
    });
  }

  return data;
};

const getCurrentOilData = (req, res) => {
  const history = generateOilHistory(30);
  const current = history[history.length - 1];
  const previous = history[history.length - 2];

  const change = parseFloat((current.price - previous.price).toFixed(2));
  const changePercent = parseFloat(((change / previous.price) * 100).toFixed(2));

  // AI prediction (simulated)
  const aiPrediction = {
    tomorrow: parseFloat((current.price + (Math.random() - 0.4) * 2).toFixed(2)),
    nextWeek: parseFloat((current.price + (Math.random() - 0.35) * 5).toFixed(2)),
    confidence: Math.floor(Math.random() * 20 + 70), // 70-90% confidence
    sentiment: change > 0 ? 'bullish' : change < -0.5 ? 'bearish' : 'neutral',
    signal: change > 1 ? 'STRONG BUY' : change > 0 ? 'BUY' : change > -1 ? 'HOLD' : 'WAIT'
  };

  res.json({
    success: true,
    current: { ...current, change, changePercent },
    history,
    aiPrediction,
    lastUpdated: new Date().toISOString()
  });
};

const getOilNews = (req, res) => {
  // Simulated news feed
  const news = [
    {
      id: 1,
      headline: 'OPEC+ Maintains Production Cuts Amid Global Demand Uncertainty',
      summary: 'Oil ministers agreed to extend output restrictions through Q3...',
      impact: 'positive',
      time: '2h ago'
    },
    {
      id: 2,
      headline: 'US Strategic Reserve Drawdown Weighs on Crude Prices',
      summary: 'Department of Energy announces release of 20M barrels...',
      impact: 'negative',
      time: '5h ago'
    },
    {
      id: 3,
      headline: 'Middle East Supply Chain Risks Elevate Oil Premium',
      summary: 'Geopolitical tensions add risk premium to energy markets...',
      impact: 'positive',
      time: '8h ago'
    },
    {
      id: 4,
      headline: 'China Demand Recovery Stronger Than Expected in Q2',
      summary: 'Chinese crude imports hit 11.5M barrels per day...',
      impact: 'positive',
      time: '12h ago'
    }
  ];

  res.json({ success: true, news });
};

module.exports = { getCurrentOilData, getOilNews };
