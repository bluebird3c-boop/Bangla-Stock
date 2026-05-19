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
    history: Array.from({ length: 30 }, (_, i) => ({ 
      date: `May ${i + 1}`, 
      price: 390 + Math.random() * 30 
    }))
  },
  {
    symbol: 'BRACBANK',
    name: 'BRAC Bank PLC',
    price: 48.90,
    change: 0.30,
    changePercent: 0.62,
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
  const [activeTab, setActiveTab] = useState('Overview');

  console.log('App Rendering', { selectedStock });

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
          news: [`Market volatility in ${stock.name}`, `Recent quarterly earnings report impact`]
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
          <p className="text-xs text-blue-400 font-bold mb-1 uppercase tracking-widest">Expert Mode</p>
          <p className="text-[11px] text-blue-200/60">Unlock advanced AI fundamental analysis sensors.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#0A0B0D]/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5 w-96">
            <Search className="w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search stocks, sectors, news..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-600"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
              <HelpCircle className="w-5 h-5 text-gray-400" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border-2 border-white/10" />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Market Overview</h1>
              <p className="text-gray-500 text-sm">AI-driven predictive analysis for your watchlisted assets.</p>
            </div>
            <div className="flex gap-2">
              {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(t => (
                <button key={t} className={cn("px-3 py-1 rounded-lg text-xs font-medium transition-all", t === '1M' ? "bg-white text-black" : "text-gray-500 hover:text-white")}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column: Chart & Insights */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* Main Chart Card */}
              <div className="bg-[#121417] rounded-3xl border border-white/5 p-8 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold">{selectedStock.symbol}</span>
                      <span className="text-gray-500 font-medium">{selectedStock.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl font-bold">${selectedStock.price}</span>
                      <div className={cn(
                        "flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded-full",
                        selectedStock.change > 0 ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
                      )}>
                        {selectedStock.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(selectedStock.change)} ({Math.abs(selectedStock.changePercent)}%)
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                      <Zap className="w-4 h-4" />
                      Buy Now
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
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#4b5563', fontSize: 10 }}
                        dy={10}
                      />
                      <YAxis 
                        hide 
                        domain={['auto', 'auto']}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke={selectedStock.change > 0 ? "#10b981" : "#f43f5e"} 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Forecast Card */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <div className="h-64 flex flex-col items-center justify-center bg-[#121417]/50 rounded-3xl border-2 border-dashed border-white/5 space-y-4">
                    <BrainCircuit className="w-12 h-12 text-blue-500 animate-pulse" />
                    <p className="text-gray-500 font-medium animate-pulse">Consulting Sheba AI Core Engine...</p>
                  </div>
                ) : forecast && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Target className="w-32 h-32" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-tighter mb-4">
                          <Activity className="w-4 h-4" />
                          AI Signal Engine
                        </div>
                        <h3 className="text-4xl font-black mb-2 flex items-baseline gap-2">
                          {forecast.signal}
                          <span className="text-sm font-medium text-gray-400">Target: ${forecast.targetPrice}</span>
                        </h3>
                        <div className="flex items-center gap-4 mt-6">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${forecast.confidence}%` }}
                              className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                            />
                          </div>
                          <span className="text-sm font-bold">{forecast.confidence}% Confidence</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#121417] border border-white/5 rounded-3xl p-8">
                      <div className="flex items-center gap-2 text-amber-500 font-bold text-sm uppercase tracking-tighter mb-4">
                        <ShieldAlert className="w-4 h-4" />
                        Risk Meter
                      </div>
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-2xl font-bold uppercase">{forecast.riskLevel} Risk</span>
                        <div className={cn(
                          "w-3 h-3 rounded-full animate-ping",
                          forecast.riskLevel === 'Low' ? "bg-emerald-500" : forecast.riskLevel === 'Medium' ? "bg-amber-500" : "bg-rose-500"
                        )} />
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Based on sentiment analysis and historical volatility, our engine classifies this asset as {forecast.riskLevel.toLowerCase()} risk.
                      </p>
                    </div>

                    <div className="col-span-1 md:col-span-2 bg-[#121417] border border-white/5 rounded-3xl p-8">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-tighter mb-4">
                        <BrainCircuit className="w-4 h-4" />
                        Sheba AI Insight (Expert)
                      </div>
                      <p className="text-lg font-medium leading-relaxed italic text-gray-200">
                        "{forecast.explanation}"
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Watchlist & Activity */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="bg-[#121417] border border-white/5 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold">Portfolio Hotlist</h3>
                  <button className="text-xs text-blue-500 font-bold flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-4">
                  {MOCK_STOCKS.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => setSelectedStock(stock)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl transition-all border",
                        selectedStock.symbol === stock.symbol 
                          ? "bg-white/5 border-white/10 ring-1 ring-blue-500/50" 
                          : "bg-transparent border-transparent hover:bg-white/[0.02]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center font-bold text-xs">
                          {stock.symbol[0]}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">{stock.symbol}</p>
                          <p className="text-xs text-gray-500">{stock.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-white">${stock.price}</p>
                        <p className={cn("text-[10px] font-bold", stock.change > 0 ? "text-emerald-400" : "text-rose-400")}>
                          {stock.change > 0 ? '+' : ''}{stock.changePercent}%
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Market News */}
              <div className="bg-[#121417] border border-white/5 rounded-3xl p-6">
                <h3 className="font-bold mb-6">Sentiment Pulse</h3>
                <div className="space-y-4">
                  {[
                    { title: "Fed moves on interest rates", time: "2h ago", sentiment: "Neutral" },
                    { title: "Tech sector rally continues", time: "5h ago", sentiment: "Bullish" },
                    { title: "Energy crisis in Europe", time: "12h ago", sentiment: "Bearish" }
                  ].map((news, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="flex justify-between items-start mb-1">
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase",
                          news.sentiment === 'Bullish' ? "bg-emerald-500/10 text-emerald-500" : news.sentiment === 'Bearish' ? "bg-rose-500/10 text-rose-500" : "bg-gray-500/10 text-gray-500"
                        )}>{news.sentiment}</span>
                        <span className="text-[10px] text-gray-600">{news.time}</span>
                      </div>
                      <p className="text-sm font-medium group-hover:text-blue-400 transition-colors">{news.title}</p>
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
