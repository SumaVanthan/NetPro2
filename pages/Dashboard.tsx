
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { INDICES, STOCKS, FO_DATA } from '../constants';
import { ArrowUpRight, ArrowDownRight, Plus, ChevronRight, Bell, Activity, Layers, Zap, ShoppingBag, Percent, ShieldAlert, BrainCircuit, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'EQUITY' | 'FNO'>('EQUITY');
  const { currentUser } = useUser();
  const { holdings, behavior } = currentUser;

  // Portfolio Calculations
  const totalInvested = holdings.reduce((acc, curr) => acc + curr.invested, 0);
  const totalValue = holdings.reduce((acc, curr) => acc + curr.current, 0);
  const totalPnl = totalValue - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
  const isProfit = totalPnl >= 0;

  // Day's Change Calculation (Mocking based on STOCKS change * Holding Qty)
  const daysPnl = holdings.reduce((acc, curr) => {
      const stock = STOCKS.find(s => s.symbol === curr.symbol);
      return acc + (stock ? stock.change * curr.qty : 0);
  }, 0);
  const prevValue = totalValue - daysPnl;
  const daysPnlPercent = prevValue > 0 ? (daysPnl / prevValue) * 100 : 0;
  const isDayProfit = daysPnl >= 0;

  const isDavid = currentUser.profile.id === 'u3'; // Disciplined Trader

  return (
    <Layout>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
        }
      `}</style>

      {/* Header Custom */}
      <div className="px-5 py-3 flex justify-between items-center sticky top-0 bg-gray-50 dark:bg-shriram-bg z-20 border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-bold border border-gray-300 dark:border-white/10 text-shriram-yellowDim dark:text-shriram-yellow">
            {currentUser.profile.avatarInitials}
          </div>
          <div>
            <h2 className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">Good Morning,</h2>
            <h1 className="text-sm font-bold leading-tight text-gray-900 dark:text-white">{currentUser.profile.name}</h1>
          </div>
        </div>
        <div className="flex gap-3">
            <button className="p-2 rounded-full bg-white dark:bg-shriram-surface text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white relative border border-gray-200 dark:border-transparent shadow-sm">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white dark:border-shriram-surface"></span>
            </button>
        </div>
      </div>

      {/* Marquee Indices Ticker */}
      <div className="bg-gray-100 dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-white/5 overflow-hidden relative h-9 flex items-center transition-colors duration-300">
        <div className="animate-marquee whitespace-nowrap flex gap-8 px-4">
            {/* Render Twice for seamless loop */}
            {[...INDICES, ...INDICES].map((index, i) => (
                <div key={`${index.name}-${i}`} className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{index.name}</span>
                    <div className="flex items-center gap-1">
                         <span className="text-xs font-bold text-gray-900 dark:text-white">{index.value.toLocaleString()}</span>
                         <span className={`text-[10px] ${index.change >= 0 ? 'text-trade-up' : 'text-trade-down'}`}>
                            {index.change >= 0 ? '+' : ''}{index.percentChange}%
                         </span>
                    </div>
                </div>
            ))}
        </div>
        {/* Gradients for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-gray-100 dark:from-[#1A1A1A] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-gray-100 dark:from-[#1A1A1A] to-transparent z-10"></div>
      </div>

      {/* Mode Toggle */}
      <div className="px-5 mt-4 mb-4">
          <div className="bg-gray-200 dark:bg-[#1A1A1A] p-1 rounded-lg flex relative transition-colors">
             <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md transition-all duration-300 shadow-sm ${mode === 'FNO' ? 'left-[calc(50%+2px)]' : 'left-1'}`}
             ></div>
             <button 
                onClick={() => setMode('EQUITY')}
                className={`flex-1 py-2 text-xs font-bold z-10 transition-colors ${mode === 'EQUITY' ? 'text-black' : 'text-gray-500 dark:text-gray-400'}`}
             >
                Overview
             </button>
             <button 
                onClick={() => setMode('FNO')}
                className={`flex-1 py-2 text-xs font-bold z-10 transition-colors ${mode === 'FNO' ? 'text-black' : 'text-gray-500 dark:text-gray-400'}`}
             >
                F&O Pulse
             </button>
          </div>
      </div>

      {mode === 'EQUITY' ? (
        <>
          {/* Portfolio Snapshot OR Start Investing CTA */}
          <div className="px-5">
            {holdings.length > 0 ? (
                <div className="bg-gradient-to-br from-white to-gray-100 dark:from-shriram-surface dark:to-[#181818] rounded-2xl p-5 border border-gray-200 dark:border-white/5 relative overflow-hidden shadow-lg transition-all">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-shriram-yellow/10 dark:bg-shriram-yellow/5 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                      <div className="mb-4">
                          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">Total Portfolio Value</p>
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">₹{totalValue.toLocaleString()}</h2>
                      </div>

                      <div className="flex items-center gap-8">
                          <div>
                              <p className="text-[10px] text-gray-500 mb-0.5 font-medium uppercase tracking-wide">Overall Profit</p>
                              <div className={`flex items-baseline gap-1.5 ${isProfit ? 'text-trade-up' : 'text-trade-down'}`}>
                                  <span className="text-sm font-bold font-mono">{isProfit ? '+' : ''}₹{Math.abs(totalPnl).toLocaleString()}</span>
                                  <span className="text-xs font-bold">({Math.abs(totalPnlPercent).toFixed(2)}%)</span>
                              </div>
                          </div>
                          
                          <div className="w-px h-8 bg-gray-300 dark:bg-white/10"></div>

                          <div>
                              <p className="text-[10px] text-gray-500 mb-0.5 font-medium uppercase tracking-wide">Day's Change</p>
                              <div className={`flex items-baseline gap-1.5 ${isDayProfit ? 'text-trade-up' : 'text-trade-down'}`}>
                                   <span className="text-sm font-bold font-mono">{isDayProfit ? '+' : ''}₹{Math.abs(daysPnl).toLocaleString()}</span>
                                   <span className="text-xs font-bold">({Math.abs(daysPnlPercent).toFixed(2)}%)</span>
                              </div>
                          </div>
                      </div>

                      <div className="flex gap-3 mt-5">
                          <button onClick={() => navigate('/funds')} className="flex-1 bg-shriram-yellow text-black py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-shriram-yellowDim transition-colors">
                            <Plus size={16} /> Add Funds
                          </button>
                          <button onClick={() => navigate('/portfolio')} className="flex-1 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-transparent">
                            View Holdings
                          </button>
                      </div>
                  </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-gray-100 to-white dark:from-shriram-surface dark:to-[#1A1A1A] rounded-2xl p-6 border border-gray-200 dark:border-white/5 text-center">
                    <div className="w-12 h-12 bg-shriram-yellow rounded-full flex items-center justify-center mx-auto mb-4 text-black">
                        <ShoppingBag size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Start Your Journey</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-[200px] mx-auto">You don't have any investments yet. Start building your wealth today.</p>
                    <button onClick={() => navigate('/watchlist')} className="w-full bg-shriram-yellow text-black font-bold py-3 rounded-xl shadow-lg shadow-shriram-yellow/20 flex items-center justify-center gap-2">
                        Explore Stocks <ArrowRight size={16} />
                    </button>
                </div>
            )}
          </div>

          {/* Capital Safeguard (Behavior) */}
          {behavior && (
             <div className="px-5 mt-6">
                <div 
                  onClick={() => navigate('/behavior')}
                  className={`bg-gradient-to-r rounded-xl p-1 cursor-pointer active:scale-[0.99] transition-transform ${isDavid ? 'from-green-500/20 to-blue-500/20' : 'from-red-500/10 to-orange-500/10 dark:from-red-900/20 dark:to-orange-900/20'}`}
                >
                  <div className="bg-white dark:bg-[#1A1A1A] rounded-lg p-3 border flex justify-between items-center shadow-sm border-transparent">
                     <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-200 dark:text-gray-800" />
                                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className={isDavid ? "text-green-500" : "text-red-500"} strokeDasharray="100" strokeDashoffset={100 - behavior.score} />
                            </svg>
                            <span className="absolute text-[10px] font-bold text-gray-900 dark:text-white">{behavior.score}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{isDavid ? 'Trading Discipline' : 'Capital Safeguard'}</h3>
                                <span className={`text-white text-[8px] px-1.5 py-0.5 rounded font-bold ${isDavid ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}>
                                    {isDavid ? 'EXCELLENT' : 'HIGH RISK'}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                                {isDavid ? 'You are trading like a pro.' : 'Revenge trading pattern detected.'}
                            </p>
                        </div>
                     </div>
                     <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
              </div>
          )}

          {/* MTF Promo Banner */}
          <div className="px-5 mt-4">
              <div 
                onClick={() => navigate('/mtf-dashboard')}
                className="bg-gradient-to-r from-gray-100 to-white dark:from-[#2A2A2A] dark:to-[#1A1A1A] rounded-xl p-4 border border-shriram-yellow/20 relative overflow-hidden cursor-pointer shadow-sm"
              >
                  <div className="absolute top-0 right-0 bg-shriram-yellow text-black text-[9px] font-bold px-2 py-1 rounded-bl-lg">
                      NOW LIVE
                  </div>
                  <div className="flex gap-3 items-center relative z-10">
                      <div className="w-10 h-10 rounded-full bg-shriram-yellow/10 flex items-center justify-center text-shriram-yellowDim dark:text-shriram-yellow border border-shriram-yellow/30">
                          <Percent size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Margin Trading Facility</h3>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">Get up to <span className="text-shriram-yellowDim dark:text-shriram-yellow font-bold">4X Leverage</span> on F&O and Equity Delivery.</p>
                      </div>
                      <div className="bg-gray-100 dark:bg-white/5 p-1.5 rounded-lg">
                          <ChevronRight size={18} className="text-gray-400"/>
                      </div>
                  </div>
              </div>
          </div>

          {/* Baskets Promo */}
          <div className="px-5 mt-4">
            <div onClick={() => navigate('/baskets')} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500 dark:text-blue-400">
                        <ShoppingBag size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Smart Baskets</h3>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Invest in themes & strategies</p>
                    </div>
                </div>
                <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
            </div>
          </div>

          {/* Trending Stocks (Mini Watchlist) */}
          <div className="px-5 mt-8 mb-6">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Top Movers</h3>
                <button onClick={() => navigate('/watchlist')} className="text-shriram-yellowDim dark:text-shriram-yellow text-xs font-medium flex items-center">View All <ChevronRight size={14}/></button>
            </div>
            
            <div className="space-y-3">
                {STOCKS.slice(0, 3).map(stock => (
                    <div key={stock.symbol} onClick={() => navigate(`/stock/${stock.symbol}`)} className="bg-white dark:bg-shriram-surface p-3 rounded-xl border border-gray-200 dark:border-white/5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-shriram-surfaceHighlight transition-colors cursor-pointer shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className={`w-1 h-8 rounded-full ${stock.change >= 0 ? 'bg-trade-up' : 'bg-trade-down'}`}></div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{stock.symbol}</h4>
                                <span className="text-[10px] text-gray-500">{stock.exchange}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`font-mono text-sm ${stock.change >= 0 ? 'text-trade-up' : 'text-trade-down'}`}>
                                {stock.ltp.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">
                                {stock.change > 0 ? '+' : ''}{stock.change} ({stock.percentChange}%)
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </>
      ) : (
        /* F&O Dashboard Mode */
        <div className="animate-in fade-in duration-300">
            {/* Index Stats Cards */}
            <div className="px-5 grid grid-cols-2 gap-3 mb-6">
                {FO_DATA.indices.map((idx, i) => (
                    <div key={idx.name} className="bg-white dark:bg-shriram-surface p-4 rounded-xl border border-gray-200 dark:border-white/5 relative overflow-hidden group shadow-sm">
                        <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl -mr-4 -mt-4 ${idx.trend === 'Bullish' ? 'bg-green-500/10 dark:bg-green-500/20' : 'bg-red-500/10 dark:bg-red-500/20'}`}></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xs font-bold text-gray-900 dark:text-white">{idx.name}</h3>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded ${idx.trend === 'Bullish' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}>{idx.trend}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div>
                                    <div className="text-[10px] text-gray-500">PCR</div>
                                    <div className={`text-xs font-mono font-bold ${idx.pcr > 1 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{idx.pcr}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-500">IV</div>
                                    <div className="text-xs font-mono font-bold text-shriram-yellowDim dark:text-shriram-yellow">{idx.iv}</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/option-chain')}
                                className="w-full mt-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-[10px] font-medium hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center gap-1 text-gray-700 dark:text-gray-300"
                            >
                                <Layers size={10} /> Option Chain
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Smart Heatmap (Buildups) */}
            <div className="px-5 mb-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <Activity size={16} className="text-shriram-yellowDim dark:text-shriram-yellow"/> OI Buildups
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {/* Long Buildup List */}
                    <div className="space-y-2">
                         <div className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">Long Buildup</div>
                         {FO_DATA.longBuildup.map(item => (
                             <div key={item.symbol} className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-500/20 p-2 rounded-lg flex justify-between items-center shadow-sm">
                                <div>
                                    <div className="text-[10px] font-bold text-gray-900 dark:text-gray-200">{item.symbol}</div>
                                    <div className="text-[9px] text-gray-500">OI: {item.oi}</div>
                                </div>
                                <div className="text-green-600 dark:text-green-400 text-[10px] font-bold">+{item.change}%</div>
                             </div>
                         ))}
                    </div>
                    {/* Short Buildup List */}
                    <div className="space-y-2">
                         <div className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Short Buildup</div>
                         {FO_DATA.shortBuildup.map(item => (
                             <div key={item.symbol} className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 p-2 rounded-lg flex justify-between items-center shadow-sm">
                                <div>
                                    <div className="text-[10px] font-bold text-gray-900 dark:text-gray-200">{item.symbol}</div>
                                    <div className="text-[9px] text-gray-500">OI: {item.oi}</div>
                                </div>
                                <div className="text-red-600 dark:text-red-400 text-[10px] font-bold">{item.change}%</div>
                             </div>
                         ))}
                    </div>
                </div>
            </div>

            {/* Most Active Contracts */}
            <div className="px-5 mb-20">
                 <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <Zap size={16} className="text-shriram-yellowDim dark:text-shriram-yellow"/> Most Active
                    </h3>
                </div>
                <div className="space-y-3">
                    {FO_DATA.activeContracts.map(contract => (
                        <div key={contract.symbol} onClick={() => navigate('/option-chain')} className="bg-white dark:bg-shriram-surface p-3 rounded-xl border border-gray-200 dark:border-white/5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-shriram-surfaceHighlight transition-colors cursor-pointer shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-shriram-yellowDim dark:text-shriram-yellow">
                                    <Layers size={16} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">{contract.symbol}</h4>
                                    <span className="text-[10px] text-gray-500">OI: {contract.oiLakh}L</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                                    ₹{contract.ltp.toFixed(2)}
                                </div>
                                <div className={`text-[10px] ${contract.change >= 0 ? 'text-trade-up' : 'text-trade-down'}`}>
                                    {contract.change > 0 ? '+' : ''}{contract.change}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

    </Layout>
  );
};

export default Dashboard;
