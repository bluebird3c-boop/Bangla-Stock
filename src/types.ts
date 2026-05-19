export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: { date: string; price: number }[];
}

export interface AIForecast {
  signal: 'Strong Buy' | 'Hold' | 'Weak' | 'Sell';
  score: number;
  targetPrice: number;
  explanation: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
}
