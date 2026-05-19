import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Target, ShieldAlert, BrainCircuit, 
  Search, ArrowUpRight, ArrowDownRight, Activity, Wallet,
  Zap, Info, LayoutDashboard, Component, Settings, HelpCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { StockData, AIForecast } from './types';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data (DSE - Dhaka Stock Exchange Examples)
const MOCK_STOCKS: StockData[] = [
  {
    symbol: 'GP',
    name: 'Grameenphone Ltd.',
    price: 261.50,
    change: 4.20,
    changePercent: 1.63,
    fundamentals: { pe: 12.5, eps: 21.0, divYield: 5.4, marketCap: '35,000 Cr', debtToEquity: 0.2 },
    history: Array.from({ length: 30 }, (_, i) => ({ 
      date: `May ${i + 1}`, 
      price: 250 + Math.random() * 20 
    }))
  },
  {
    symbol: 'SQURPHARMA',
    name: 'Square Pharmaceuticals',
    price: 215.30,
    change: -1.20,
    changePercent: -0.56,
    fundamentals: { pe: 10.2, eps: 18.5, divYield: 4.8, marketCap: '28,000 Cr', debtToEquity: 0.1 },
    history: Array.from({ length: 30 }, (_, i) => ({ 
      date: `May ${i + 1}`, 
      price: 210 + Math.random() * 15 
    }))
  },
  {
    symbol: 'BATBC',
    name: 'British American Tobacco',
    price: 410.70,
    change: 8.50,
    changePercent: 2.11,
    fundamentals: { pe: 15.1, eps: 32.4, divYield: 6.2, marketCap: '22,000 Cr', debtToEquity: 0.3 },
    history: Array.from({ length: 30 }, (_, i) => ({ 
      date: `May ${i + 1}`, 
      price: 390 + Math.random() * 30 
    }))
  },
  {
    symbol: 'BEXIMCO',
    name: 'Beximco Limited',
    price: 115.60,
    change: 2.30,
    changePercent: 2.03,
    fundamentals: { pe: 18.2, eps: 6.4, divYield: 2.1, marketCap: '10,000 Cr', debtToEquity: 0.8 },
    history: Array.from({ length: 30 }, (_, i) => ({ 
      date: `May ${i + 1}`, 
      price: 105 + Math.random() * 15 
    }))
  },
  {
    symbol: 'LHBL',
    name: 'LafargeHolcim Bangladesh',
    price: 68.40,
    change: 1.10,
    changePercent: 1.63,
    fundamentals: { pe: 14.3, eps: 4.8, divYield: 3.5, marketCap: '7,500 Cr', debtToEquity: 0.4 },
    history: Array.from({ length: 30 }, (_, i) => ({ 
      date: `May ${i + 1}`, 
      price: 60 + Math.random() * 10 
    }))
  },
  {
    symbol: 'BXPHARMA',
    name: 'Beximco Pharmaceuticals',
    price: 142.90,
    change: -2.10,
    changePercent: -1.45,
    fundamentals: { pe: 11.5, eps: 12.3, divYield: 3.2, marketCap: '6,200 Cr', debtToEquity: 0.2 },
    history: Array.from({ length: 30 }, (_, i) => ({ 
      date: `May ${i + 1}`, 
      price: 135 + Math.random() * 15 
    }))
  },
  {
    symbol: 'ROBI',
    name: 'Robi Axiata Limited',
    price: 28.20,
    change: 0.40,
    changePercent: 1.44,
    fundamentals: { pe: 45.2, eps: 0.6, divYield: 1.5, marketCap: '14,000 Cr', debtToEquity: 1.2 },
    history: Array.from({ length: 30 }, (_, i) => ({ 
      date: `May ${i + 1}`, 
      price: 25 + Math.random() * 5 
    }))
  },
  {
    symbol: 'BRACBANK',
    name: 'BRAC Bank PLC',
    price: 48.90,
    change: 0.30,
    changePercent: 0.62,
    fundamentals: { pe: 9.8, eps: 5.1, divYield: 4.5, marketCap: '8,000 Cr', debtToEquity: 0.1 },
    history: Array.from({ length: 30 }, (_, i) => ({ 
      date: `May ${i + 1}`, 
      price: 45 + Math.random() * 5 
    }))
  },
  {
    symbol: 'RENATA',
    name: 'Renata Limited',
    price: 785.40,
    change: -12.40,
    changePercent: -1.55,
    fundamentals: { pe: 22.4, eps: 35.2, divYield: 2.8, marketCap: '9,000 Cr', debtToEquity: 0.2 },
    history: Array.from({ length: 30 }, (_, i) => ({ 
      date: `May ${i + 1}`, 
      price: 760 + Math.random() * 50 
    }))
  }
];

export default function App() {
  const [selectedStock, setSelectedStock] = useState<StockData>(MOCK_STOCKS[0]);
  const [forecast, setForecast] = useState<AIForecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Analysis');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStocks = MOCK_STOCKS.filter(s => 
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAIForecast = async (stock: StockData) => {
    console.log('Fetching forecast for', stock.symbol);
    setIsLoading(true);
    try {
      const response = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockSymbol: stock.symbol,
          historicalData: stock.history.slice(-7),
          news: [`Local market sensitivity for ${stock.name}`, `Latest earnings report sentiment`]
        })
      });
      const data = await response.json();
      console.log('Forecast received', data);
      setForecast(data);
    } catch (error) {
      console.error('Forecast fetch failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAIForecast(selectedStock);
  }, [selectedStock]);

  return (
    <div className="flex h-screen bg-[#0A0B0D] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0A0B0D] flex flex-col p-6 space-y-8 max-md:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Sheba AI</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard' },
            { icon: Activity, label: 'Market' },
            { icon: Wallet, label: 'Portfolio' },
            { icon: Component, label: 'Signals' },
            { icon: Settings, label: 'Settings' }
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                item.label === 'Dashboard' ? "bg-white/5 text-blue-400" : "text-gray-500 hover:bg-white/[0.02] hover:text-gray-300"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 bg-blue-600/5 rounded-2xl border border-blue-600/10">
          <p className="text-xs text-blue-400 font-bold mb-1 uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-3 h-3" /> Expert Mode
          </p>
          <p className="text-[11px] text-blue-200/60 leading-tight">Advanced DSE fundamental & sentiment analysis active.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#0A0B0D]/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5 w-96 transition-all focus-within:border-blue-500/50 focus-within:bg-white/10">
            <Search className="w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search DSE stocks..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-xs font-bold border border-emerald-500/20">
              <Zap className="w-3 h-3" /> Live Market
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border-2 border-white/10" />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Expert Analysis</h1>
              <p className="text-gray-500 text-sm">Professional forecasting system for DSE investors.</p>
            </div>
            <div className="flex gap-4 border-b border-white/5 pb-2">
              {['Analysis', 'Fundamentals', 'Risks'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setActiveTab(t)}
                  className={cn(
                    "text-sm font-bold transition-all relative pb-2 px-1", 
                    activeTab === t ? "text-blue-400" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  {t}
                  {activeTab === t && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column: Chart & Insights */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {activeTab === 'Analysis' && (
                <>
                  <div className="bg-[#121417] rounded-3xl border border-white/5 p-8 relative overflow-hidden group shadow-2xl">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-bold tracking-tighter">{selectedStock.symbol}</span>
                          <span className="text-gray-500 font-medium text-sm">/ {selectedStock.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-4xl font-black">৳{selectedStock.price}</span>
                          <div className={cn(
                            "flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded-full",
                            selectedStock.change > 0 ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
                          )}>
                            {selectedStock.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(selectedStock.change)} ({Math.abs(selectedStock.changePercent)}%)
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl text-sm font-black transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                          <Wallet className="w-4 h-4" />
                          Trade ৳
                        </button>
                      </div>
                    </div>

                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedStock.history}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={selectedStock.change > 0 ? "#10b981" : "#f43f5e"} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={selectedStock.change > 0 ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                          <XAxis dataKey="date" hide />
                          <YAxis hide domain={['auto', 'auto']} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#131518', border: '1px solid #ffffff10', borderRadius: '16px', color: '#fff' }}
                            itemStyle={{ color: '#60a5fa' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke={selectedStock.change > 0 ? "#10b981" : "#f43f5e"} 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorPrice)" 
                            animationDuration={1500}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <div className="h-64 flex flex-col items-center justify-center bg-[#121417]/50 rounded-3xl border-2 border-dashed border-white/5 space-y-4">
                        <BrainCircuit className="w-12 h-12 text-blue-500 animate-pulse" />
                        <p className="text-gray-500 font-medium animate-pulse">Running expert AI modules...</p>
                      </div>
                    ) : forecast && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                          className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-3xl p-8"
                        >
                          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-6">
                            <Zap className="w-4 h-4" /> AI Decision Core
                          </div>
                          <div className="space-y-6">
                            <div>
                              <p className="text-gray-500 text-xs font-bold mb-1">RECOMMENDED ACTION</p>
                              <h3 className={cn(
                                "text-4xl font-black italic",
                                forecast.sentiment === 'Bullish' ? "text-emerald-400" : forecast.sentiment === 'Bearish' ? "text-rose-400" : "text-amber-400"
                              )}>
                                {forecast.signal}
                              </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Target Price</p>
                                <p className="text-xl font-black">৳{forecast.targetPrice}</p>
                              </div>
                              <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                                <p className="text-rose-500 text-[10px] uppercase font-bold mb-1">Stop Loss AI</p>
                                <p className="text-xl font-black text-rose-400">৳{forecast.stopLoss || (selectedStock.price * 0.95).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                          className="bg-[#121417] border border-white/5 rounded-3xl p-8 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-6">
                              <BrainCircuit className="w-4 h-4" /> Confidence Score
                            </div>
                            <div className="relative w-32 h-32 mx-auto mb-6">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                <motion.circle 
                                  cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                  strokeDasharray="364.4" 
                                  initial={{ strokeDashoffset: 364.4 }}
                                  animate={{ strokeDashoffset: 364.4 - (364.4 * forecast.confidence) / 100 }}
                                  className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black">{forecast.confidence}%</span>
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Accuracy</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          className="col-span-1 md:col-span-2 bg-[#121417] border border-white/5 rounded-3xl p-8"
                        >
                          <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">
                            <Info className="w-4 h-4" /> AI Explained (Bangla)
                          </div>
                          <p className="text-xl font-bold leading-relaxed text-blue-100">
                             "{forecast.explanation}"
                          </p>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {activeTab === 'Fundamentals' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-[#121417] border border-white/5 rounded-3xl p-8">
                    <h3 className="font-black text-xl mb-6">Valuation Metrics</h3>
                    <div className="space-y-6">
                      {[
                        { label: 'P/E Ratio', value: selectedStock.fundamentals?.pe, tip: 'Lower is generally better valuation' },
                        { label: 'EPS (Earnings per Share)', value: `৳${selectedStock.fundamentals?.eps}`, tip: 'Profit normalized per unit' },
                        { label: 'Dividend Yield', value: `${selectedStock.fundamentals?.divYield}%`, tip: 'Annual return from dividends' },
                        { label: 'Market Cap', value: selectedStock.fundamentals?.marketCap, tip: 'Total market value' }
                      ].map((item) => (
                        <div key={item.label} className="group">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-500 text-sm font-bold flex items-center gap-2">
                              {item.label} <Info className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                            <span className="font-black text-lg">{item.value}</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-blue-500/20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#121417] border border-white/5 rounded-3xl p-8">
                    <h3 className="font-black text-xl mb-6">Balance Sheet Score</h3>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-400">Debt to Equity</span>
                        <span className={cn("px-2 py-1 rounded-lg text-xs font-black", (selectedStock.fundamentals?.debtToEquity || 0) < 0.5 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                          {selectedStock.fundamentals?.debtToEquity}x
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed italic">
                        "The company maintains a {(selectedStock.fundamentals?.debtToEquity || 0) < 0.5 ? 'healthy' : 'volatile'} debt buffer, significantly impacting its AI risk score for this quarter."
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5">
                      <h4 className="text-sm font-black mb-2 flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-blue-500" /> Sector Outlook
                      </h4>
                      <p className="text-sm text-blue-100/70">The {selectedStock.name.split(' ')[1]} sector is showing strong institutional accumulation based on recent volume surges.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Watchlist & Activity */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="bg-[#121417] border border-white/5 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-sm uppercase tracking-widest text-gray-400">DSE Watchlist</h3>
                  <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-500">
                    {filteredStocks.length} Assets
                  </div>
                </div>
                <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                  <AnimatePresence mode="popLayout">
                    {filteredStocks.map((stock) => (
                      <motion.button
                        layout
                        key={stock.symbol}
                        onClick={() => setSelectedStock(stock)}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={cn(
                          "w-full flex items-center justify-between p-4 rounded-2xl transition-all border group",
                          selectedStock.symbol === stock.symbol 
                            ? "bg-white/5 border-white/10 ring-1 ring-blue-500/50" 
                            : "bg-transparent border-transparent hover:bg-white/[0.02]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors",
                            selectedStock.symbol === stock.symbol ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400"
                          )}>
                            {stock.symbol.slice(0, 2)}
                          </div>
                          <div className="text-left">
                            <p className="font-black text-sm tracking-tight">{stock.symbol}</p>
                            <p className="text-[10px] text-gray-500 truncate w-32">{stock.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-sm tracking-tighter">৳{stock.price}</p>
                          <p className={cn("text-[10px] font-black", stock.change > 0 ? "text-emerald-400" : "text-rose-400")}>
                            {stock.change > 0 ? '+' : ''}{stock.changePercent}%
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Advanced Signal Bot Preview */}
              <div className="bg-gradient-to-br from-[#121417] to-indigo-950/20 border border-white/5 rounded-3xl p-6">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase mb-4">
                  <Activity className="w-4 h-4" /> Signal Pulse
                </div>
                <div className="space-y-4">
                  {[
                    { asset: 'GP', action: 'MACD Crossover', type: 'Bullish' },
                    { asset: 'ROBI', action: 'RSI Oversold', type: 'Neutral' },
                    { asset: 'RENATA', action: 'Trend Breakout', type: 'Bullish' }
                  ].map((signal, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex gap-2 items-center">
                        <span className="text-xs font-black">{signal.asset}</span>
                        <span className="text-[10px] text-gray-500">{signal.action}</span>
                      </div>
                      <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded", signal.type === 'Bullish' ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-500/10 text-gray-500")}>
                        {signal.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
