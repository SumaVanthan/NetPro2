
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { SENTIMENT_INSIGHTS, STOCKS, NEWS } from '../constants';
import { StockSentiment } from '../types';
import { 
    Activity, BrainCircuit, 
    Target, Database, Hexagon, 
    X,  AlertTriangle, Zap, Calendar,
    PieChart as PieIcon, ArrowRightLeft, Briefcase, Search, TrendingUp, TrendingDown,
    ChevronRight, MessageSquare, Globe, BarChart3, ThumbsUp, ThumbsDown, Lock, Share2, Bell,
    ArrowUp, ArrowDown, Minus, ExternalLink, Newspaper, Award, LineChart,
    Info
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, ReferenceLine, ComposedChart, Line } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// --- Helpers ---
const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'Bullish' || sentiment === 'Positive' || sentiment === 'Greed' || sentiment === 'Extreme Greed' || sentiment === 'Strong Buy' || sentiment === 'Buy') return 'text-green-600 dark:text-green-500';
    if (sentiment === 'Bearish' || sentiment === 'Negative' || sentiment === 'Fear' || sentiment === 'Extreme Fear' || sentiment === 'Strong Sell' || sentiment === 'Sell') return 'text-red-600 dark:text-red-500';
    return 'text-yellow-600 dark:text-yellow-500';
};

const getBgColor = (sentiment: string) => {
    if (sentiment === 'Bullish' || sentiment === 'Positive' || sentiment === 'Greed' || sentiment === 'Strong Buy') return 'bg-green-500';
    if (sentiment === 'Bearish' || sentiment === 'Negative' || sentiment === 'Fear' || sentiment === 'Strong Sell') return 'bg-red-500';
    return 'bg-yellow-500';
};

const SourceBadge = ({ source }: { source: string }) => (
    <div className="flex items-center gap-1 mt-2 opacity-50 text-gray-500 dark:text-gray-400">
        <Database size={8} />
        <span className="text-[9px] font-medium uppercase tracking-wide">Source: {source}</span>
    </div>
);

interface StockCardProps {
    holding: any;
    onSelect: (symbol: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({ holding, onSelect }) => {
    const data = SENTIMENT_INSIGHTS.stocks[holding.symbol as keyof typeof SENTIMENT_INSIGHTS.stocks];
    if (!data) return null;

    return (
        <div 
        onClick={() => onSelect(holding.symbol)}
        className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-200 dark:border-white/5 mb-3 active:scale-[0.98] transition-all hover:border-gray-300 dark:hover:border-white/20 cursor-pointer shadow-sm"
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">{holding.symbol}</h3>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">{data.overview?.industry || 'Equity'}</div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold ${getBgColor(data.sentiment)} text-white bg-opacity-90 dark:bg-opacity-80`}>
                    {data.sentiment}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-500 dark:text-gray-300">
                <div>
                    <span className="text-gray-400 dark:text-gray-500 block">Consensus</span>
                    <span className={`font-bold ${getSentimentColor(data.analystRating.consensus)}`}>{data.analystRating.consensus}</span>
                </div>
                <div>
                    <span className="text-gray-400 dark:text-gray-500 block">News</span>
                    <span className={`font-bold ${data.newsSentiment.positive > data.newsSentiment.negative ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                        {data.newsSentiment.positive}% Pos
                    </span>
                </div>
                <div>
                    <span className="text-gray-400 dark:text-gray-500 block">Tech</span>
                    <span className={`font-bold ${getSentimentColor(data.technicals)}`}>{data.technicals}</span>
                </div>
            </div>
            
            {data.nextEvent && (
                <div className="mt-3 flex items-center gap-1.5 text-[10px] bg-gray-50 dark:bg-white/5 p-1.5 rounded text-gray-500 dark:text-gray-400">
                    <Calendar size={10} />
                    <span>Event: <span className="text-gray-900 dark:text-white font-medium">{data.nextEvent}</span></span>
                </div>
            )}
        </div>
    );
};

const Insights: React.FC = () => {
  const { currentUser } = useUser();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'PORTFOLIO' | 'MARKET'>('PORTFOLIO');
  const [showDeepInsights, setShowDeepInsights] = useState(false);
  const [activeStock, setActiveStock] = useState<StockSentiment | null>(null);
  const [drawdownPeriod, setDrawdownPeriod] = useState<'30D' | '90D'>('30D');

  // Mock Drawdown Data
  const drawdownData = {
      '30D': {
          data: [
            { day: 1, val: 100 }, { day: 5, val: 98 }, { day: 10, val: 96 }, { day: 15, val: 92 },
            { day: 20, val: 94 }, { day: 25, val: 97 }, { day: 30, val: 99 }
          ],
          maxDrop: -8.0,
          status: 'Recovering'
      },
      '90D': {
          data: [
              { day: 1, val: 100 }, { day: 15, val: 95 }, { day: 30, val: 88 }, { day: 45, val: 82 },
              { day: 60, val: 85 }, { day: 75, val: 92 }, { day: 90, val: 96 }
          ],
          maxDrop: -18.0,
          status: 'In Recovery'
      }
  };

  const currentDD = drawdownData[drawdownPeriod];

  // Check if navigated with state
  useEffect(() => {
      if (location.state && (location.state as any).symbol) {
          const symbol = (location.state as any).symbol;
          const stockData = SENTIMENT_INSIGHTS.stocks[symbol as keyof typeof SENTIMENT_INSIGHTS.stocks];
          if (stockData) {
              setActiveStock(stockData);
              setShowDeepInsights(true);
          }
      }
  }, [location]);

  const handleStockSelect = (symbol: string) => {
      const stockData = SENTIMENT_INSIGHTS.stocks[symbol as keyof typeof SENTIMENT_INSIGHTS.stocks];
      if (stockData) {
          setActiveStock(stockData);
          setShowDeepInsights(true);
      }
  };

  return (
    <Layout title="Sentiment & Insights" showBack>
      
      {/* Sticky Tabs */}
      <div className="sticky top-0 bg-gray-50/95 dark:bg-shriram-bg/95 backdrop-blur-md z-30 px-4 pt-2 border-b border-gray-200 dark:border-white/5 transition-colors">
          <div className="flex gap-6">
              <button 
                onClick={() => setActiveTab('PORTFOLIO')}
                className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'PORTFOLIO' ? 'text-shriram-yellowDim dark:text-shriram-yellow border-b-2 border-shriram-yellowDim dark:border-shriram-yellow' : 'text-gray-500 dark:text-gray-400'}`}
              >
                  Portfolio
              </button>
              <button 
                onClick={() => setActiveTab('MARKET')}
                className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'MARKET' ? 'text-shriram-yellowDim dark:text-shriram-yellow border-b-2 border-shriram-yellowDim dark:border-shriram-yellow' : 'text-gray-500 dark:text-gray-400'}`}
              >
                  Market
              </button>
          </div>
      </div>

      <div className="p-4 pb-24">
          {activeTab === 'PORTFOLIO' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                  {/* Portfolio Health Card */}
                  <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border border-gray-200 dark:border-white/5 mb-4 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              <Activity size={18} className="text-shriram-yellowDim dark:text-shriram-yellow"/> Portfolio Health
                          </h2>
                          <div className="px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-bold rounded">
                              BULLISH
                          </div>
                      </div>
                      <div className="flex items-end gap-2 mb-2">
                          <span className="text-4xl font-bold text-gray-900 dark:text-white">78</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">/ 100</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 w-[78%]"></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                          Your portfolio shows strong alignment with market momentum. 
                          <span className="text-gray-900 dark:text-white font-bold"> 65% stocks</span> are in an uptrend.
                      </p>
                  </div>

                  {/* Drawdown Indicator */}
                  <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border border-gray-200 dark:border-white/5 mb-4 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              <TrendingDown size={18} className="text-red-500"/> Max Drawdown
                          </h2>
                          <div className="flex bg-gray-100 dark:bg-white/5 rounded-lg p-0.5">
                              <button 
                                onClick={() => setDrawdownPeriod('30D')}
                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${drawdownPeriod === '30D' ? 'bg-white dark:bg-white/20 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                              >
                                  30D
                              </button>
                              <button 
                                onClick={() => setDrawdownPeriod('90D')}
                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${drawdownPeriod === '90D' ? 'bg-white dark:bg-white/20 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                              >
                                  90D
                              </button>
                          </div>
                      </div>
                      
                      <div className="flex gap-6 mb-4">
                          <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Max Drop</div>
                              <div className="text-xl font-bold text-red-600 dark:text-red-500">{currentDD.maxDrop}%</div>
                          </div>
                          <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recovery Status</div>
                              <div className={`text-xl font-bold ${currentDD.status === 'Recovering' ? 'text-yellow-600 dark:text-yellow-500' : 'text-green-600 dark:text-green-500'}`}>
                                  {currentDD.status}
                              </div>
                          </div>
                      </div>

                      {/* Mini Area Chart for Drawdown */}
                      <div className="h-24 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={currentDD.data}>
                                  <defs>
                                      <linearGradient id="colorDd" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <Area type="monotone" dataKey="val" stroke="#EF4444" fillOpacity={1} fill="url(#colorDd)" strokeWidth={2} />
                              </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Stock Analysis */}
                  <div className="mb-2 mt-6">
                      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Holding Analysis</h3>
                      {currentUser.holdings.map(h => (
                          <StockCard key={h.symbol} holding={h} onSelect={handleStockSelect} />
                      ))}
                  </div>
              </div>
          ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                   {/* Market Mood */}
                   <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border border-gray-200 dark:border-white/5 mb-4 text-center shadow-sm">
                        <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Market Mood Index</h2>
                        <div className="relative w-40 h-20 mx-auto mb-2 overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-800 rounded-t-full"></div>
                             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-t-full opacity-50"></div>
                             {/* Needle */}
                             <div 
                                className="absolute bottom-0 left-1/2 w-1 h-full bg-black dark:bg-white origin-bottom transition-transform duration-1000"
                                style={{ transform: `translateX(-50%) rotate(${(SENTIMENT_INSIGHTS.market.fearGreedIndex / 100) * 180 - 90}deg)` }}
                             ></div>
                        </div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-500 mt-2">{SENTIMENT_INSIGHTS.market.fearGreedLabel}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Score: {SENTIMENT_INSIGHTS.market.fearGreedIndex}</div>
                   </div>

                   {/* Social Trends */}
                   <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border border-gray-200 dark:border-white/5 mb-4 shadow-sm">
                       <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <MessageSquare size={18} className="text-blue-500"/> Social Buzz
                            </h2>
                            <span className="text-[10px] bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded font-bold">LIVE</span>
                       </div>
                       <div className="space-y-3">
                           {SENTIMENT_INSIGHTS.market.social.trendingStocks.map((stock, i) => (
                               <div key={stock.symbol} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                                   <div className="flex items-center gap-3">
                                       <div className="text-xs font-bold text-gray-400">#{i+1}</div>
                                       <div>
                                           <div className="text-xs font-bold text-gray-900 dark:text-white">{stock.symbol}</div>
                                           <div className="text-[10px] text-gray-500">{stock.mentions} Mentions</div>
                                       </div>
                                   </div>
                                   <div className={`text-[10px] font-bold ${stock.sentiment === 'Bullish' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                                       {stock.sentiment}
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>

                   {/* Sector Performance */}
                   <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
                       <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                            <PieIcon size={18} className="text-purple-500"/> Sector Heat
                       </h2>
                       <div className="space-y-3">
                           {SENTIMENT_INSIGHTS.market.sectors.map(sector => (
                               <div key={sector.name} className="flex items-center justify-between">
                                   <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{sector.name}</div>
                                   <div className="flex items-center gap-3 flex-1 ml-4">
                                       <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full flex-1 overflow-hidden">
                                           <div 
                                             className={`h-full ${sector.return >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                             style={{ width: `${Math.abs(sector.return) * 20}%` }}
                                           ></div>
                                       </div>
                                       <div className={`text-xs font-bold w-10 text-right ${sector.return >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                                           {sector.return > 0 ? '+' : ''}{sector.return}%
                                       </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
              </div>
          )}
      </div>

      {/* Deep Insights Modal */}
      {showDeepInsights && activeStock && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
              <div className="bg-white dark:bg-[#121212] w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10">
                  
                  {/* Modal Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-white dark:bg-[#1A1A1A] sticky top-0 z-10">
                      <div>
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{activeStock.symbol}</h2>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                              <span>{activeStock.overview?.industry}</span>
                              <span>•</span>
                              <span className={`${getSentimentColor(activeStock.sentiment)} font-bold`}>{activeStock.sentiment}</span>
                          </div>
                      </div>
                      <button 
                        onClick={() => setShowDeepInsights(false)}
                        className="p-2 bg-gray-100 dark:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                      >
                          <X size={20} />
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                      
                      {/* Quant Rating */}
                      {activeStock.quant && (
                        <div className="mb-6 bg-gray-50 dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-200 dark:border-white/5">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Hexagon size={16} className="text-shriram-yellowDim dark:text-shriram-yellow" /> Quant Score
                                </h3>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${activeStock.quant.score >= 70 ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'}`}>
                                    {activeStock.quant.score}/100
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                {Object.entries(activeStock.quant.metrics).slice(0, 4).map(([key, val]) => (
                                    <div key={key} className="bg-white dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-white/5">
                                        <div className="text-[9px] text-gray-500 uppercase mb-1">{key}</div>
                                        <div className={`text-sm font-bold ${val === 'A+' || val === 'A' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                            {val}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                      )}

                      {/* Technicals */}
                      {activeStock.technicalsAnalysis && (
                          <div className="mb-6">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Technical Indicators</h3>
                              <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-white dark:bg-[#1A1A1A] p-3 rounded-xl border border-gray-200 dark:border-white/5">
                                      <div className="text-[10px] text-gray-500">RSI (14)</div>
                                      <div className="text-lg font-bold text-gray-900 dark:text-white">{activeStock.technicalsAnalysis.rsi}</div>
                                      <div className="text-[9px] text-gray-400">Neutral Zone</div>
                                  </div>
                                  <div className="bg-white dark:bg-[#1A1A1A] p-3 rounded-xl border border-gray-200 dark:border-white/5">
                                      <div className="text-[10px] text-gray-500">MACD</div>
                                      <div className="text-lg font-bold text-green-600 dark:text-green-400">{activeStock.technicalsAnalysis.macd.trend}</div>
                                      <div className="text-[9px] text-gray-400">Crossover</div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Fundamentals / Forecast */}
                      {activeStock.priceForecast && (
                          <div className="mb-6">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Price Forecast (1Y)</h3>
                              <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-200 dark:border-white/5">
                                  <div className="flex items-center justify-between text-xs text-gray-500 mb-6 px-2">
                                      <span>Low: {activeStock.priceForecast.low}</span>
                                      <span>High: {activeStock.priceForecast.high}</span>
                                  </div>
                                  <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                                      <div 
                                        className="absolute top-0 h-full bg-gray-400 dark:bg-gray-500 rounded-full"
                                        style={{ left: '20%', right: '20%' }}
                                      ></div>
                                      {/* Current Price Marker */}
                                      <div 
                                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-shriram-yellow rounded-full border-2 border-white dark:border-[#121212] shadow-md"
                                        style={{ left: '45%' }}
                                      ></div>
                                  </div>
                                  <div className="text-center mt-2">
                                      <div className="text-xs text-gray-500">Current</div>
                                      <div className="text-sm font-bold text-gray-900 dark:text-white">₹{activeStock.priceForecast.current}</div>
                                      <div className="text-[10px] text-green-600 dark:text-green-400">+{activeStock.priceForecast.upside}% Potential</div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* SWOT */}
                      {activeStock.swot && (
                          <div className="mb-6">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">SWOT Analysis</h3>
                              <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-500/20">
                                      <div className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase mb-2">Strengths</div>
                                      <ul className="list-disc list-inside text-[10px] text-gray-600 dark:text-gray-300 space-y-1">
                                          {activeStock.swot.strengths.slice(0,2).map((s, i) => <li key={i}>{s}</li>)}
                                      </ul>
                                  </div>
                                  <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-500/20">
                                      <div className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase mb-2">Weaknesses</div>
                                      <ul className="list-disc list-inside text-[10px] text-gray-600 dark:text-gray-300 space-y-1">
                                          {activeStock.swot.weaknesses.slice(0,2).map((s, i) => <li key={i}>{s}</li>)}
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Shareholding */}
                      {activeStock.shareholding && (
                          <div className="mb-6">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Shareholding Pattern</h3>
                              <div className="h-40">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <BarChart layout="vertical" data={[
                                          { name: 'Promoters', value: activeStock.shareholding.promoters, fill: '#F9C80E' },
                                          { name: 'FII', value: activeStock.shareholding.fii, fill: '#00D09C' },
                                          { name: 'DII', value: activeStock.shareholding.dii, fill: '#3B82F6' },
                                          { name: 'Public', value: activeStock.shareholding.retail, fill: '#9CA3AF' },
                                      ]}>
                                          <XAxis type="number" hide />
                                          <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 10, fill: '#888'}} />
                                          <RechartsTooltip 
                                             cursor={{fill: 'transparent'}}
                                             contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                                             itemStyle={{ color: '#fff' }}
                                          />
                                          <Bar dataKey="value" barSize={16} radius={[0, 4, 4, 0]}>
                                              {
                                                  [
                                                    { fill: '#F9C80E' }, { fill: '#00D09C' }, { fill: '#3B82F6' }, { fill: '#9CA3AF' }
                                                  ].map((entry, index) => (
                                                      <Cell key={`cell-${index}`} fill={entry.fill} />
                                                  ))
                                              }
                                          </Bar>
                                      </BarChart>
                                  </ResponsiveContainer>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

    </Layout>
  );
};

export default Insights;
