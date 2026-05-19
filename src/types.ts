export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: { date: string; price: number }[];
  fundamentals?: {
    pe: number;
    eps: number;
    divYield: number;
    marketCap: string;
    debtToEquity: number;
  };
}

export interface AIForecast {
  signal: 'Strong Buy' | 'Hold' | 'Weak' | 'Sell';
  score: number;
  targetPrice: number;
  stopLoss: number;
  explanation: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}
