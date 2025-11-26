
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { STOCKS } from '../constants';
import { PieChart as PieIcon, CheckCircle2, Clock, XCircle, Filter, RefreshCw, Briefcase, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { holdings, positions, orders } = currentUser;
  const [view, setView] = useState<'HOLDINGS' | 'POSITIONS' | 'ORDERS'>('HOLDINGS');
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'OPEN' | 'HISTORY'>('ALL');

  const totalInvested = holdings.reduce((acc, h) => acc + h.invested, 0);
  const totalCurrent = holdings.reduce((acc, h) => acc + h.current, 0);
  const totalPnl = totalCurrent - totalInvested;
  const isProfit = totalPnl >= 0;

  // Day's Change Calculation for Portfolio
  const totalDayChange = holdings.reduce((acc, curr) => {
      const stock = STOCKS.find(s => s.symbol === curr.symbol);
      return acc + (stock ? stock.change * curr.qty : 0);
  }, 0);
  const prevPortfolioValue = totalCurrent - totalDayChange;
  const totalDayChangePercent = prevPortfolioValue > 0 ? (totalDayChange / prevPortfolioValue) * 100 : 0;
  const isDayProfit = totalDayChange >= 0;

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'ALL') return true;
    if (orderFilter === 'OPEN') return order.status === 'PENDING';
    if (orderFilter === 'HISTORY') return order.status === 'EXECUTED' || order.status === 'REJECTED' || order.status === 'CANCELLED';
    return true;
  });

  const getStatusIcon = (status: string) => {
      switch(status) {
          case 'EXECUTED': return <CheckCircle2 size={14} className="text-green-500" />;
          case 'PENDING': return <Clock size={14} className="text-yellow-500" />;
          default: return <XCircle size={14} className="text-red-500" />;
      }
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'EXECUTED': return 'text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-500/10';
          case 'PENDING': return 'text-yellow-600 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-500/10';
          default: return 'text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-500/10';
      }
  };

  const renderEmptyState = (type: string) => (
      <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
          <div className="w-16 h-16 bg-gray-200 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Briefcase size={24} className="text-gray-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">No {type} Found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px]">
              You don't have any {type.toLowerCase()} in your account yet.
          </p>
          {type === 'Holdings' && (
             <button onClick={() => navigate('/watchlist')} className="mt-4 text-shriram-yellow text-xs font-bold flex items-center gap-1">
                 Start Investing <Search size={12}/>
             </button>
          )}
      </div>
  );

  return (
    <Layout title="Portfolio">
      {/* Summary Card (Visible only on Holdings/Positions) */}
      {view !== 'ORDERS' && (
        <div className="px-4 mt-2 mb-6">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
                {/* Total P&L */}
                <div className="text-center mb-6">
                     <h3 className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Total Returns</h3>
                     <div className={`text-3xl font-bold font-mono mb-1 ${isProfit ? 'text-trade-up' : 'text-trade-down'}`}>
                        {isProfit ? '+' : ''}{totalPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                     <div className={`text-sm font-medium ${isProfit ? 'text-green-600/80 dark:text-green-500/70' : 'text-red-600/80 dark:text-red-500/70'}`}>
                        {totalInvested > 0 ? ((totalPnl / totalInvested) * 100).toFixed(2) : '0.00'}%
                    </div>
                </div>

                 {/* 1-Day Return Block */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 mb-5 flex justify-between items-center border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                         <div className={`w-1 h-8 rounded-full ${isDayProfit ? 'bg-trade-up' : 'bg-trade-down'}`}></div>
                         <div>
                             <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">1-Day Return</div>
                         </div>
                    </div>
                    <div className="text-right">
                         <div className={`text-sm font-bold font-mono ${isDayProfit ? 'text-trade-up' : 'text-trade-down'}`}>
                             {isDayProfit ? '+' : ''}₹{Math.abs(totalDayChange).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                         </div>
                         <div className={`text-[10px] ${isDayProfit ? 'text-green-600/80 dark:text-green-500/70' : 'text-red-600/80 dark:text-red-500/70'}`}>
                             {isDayProfit ? '+' : ''}{Math.abs(totalDayChangePercent).toFixed(2)}%
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Invested</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">₹{totalInvested.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Current</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">₹{totalCurrent.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Main Toggle */}
      <div className="px-4 mb-4 mt-4">
         <div className="flex bg-gray-200 dark:bg-[#1A1A1A] p-1 rounded-xl transition-colors">
            <button 
                onClick={() => setView('HOLDINGS')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${view === 'HOLDINGS' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
                Holdings
            </button>
            <button 
                onClick={() => setView('POSITIONS')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${view === 'POSITIONS' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
                Positions
            </button>
            <button 
                onClick={() => setView('ORDERS')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${view === 'ORDERS' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
                Orders
                {orders.some(o => o.status === 'PENDING') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-shriram-yellow"></span>
                )}
            </button>
         </div>
      </div>

      {/* Orders Sub-Filter */}
      {view === 'ORDERS' && (
          <div className="px-4 mb-4 flex gap-2 overflow-x-auto no-scrollbar">
              {['ALL', 'OPEN', 'HISTORY'].map((filter) => (
                  <button 
                    key={filter}
                    onClick={() => setOrderFilter(filter as any)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${orderFilter === filter ? 'bg-shriram-yellowDim dark:bg-shriram-yellow text-white dark:text-black border-shriram-yellowDim dark:border-shriram-yellow' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10'}`}
                  >
                      {filter === 'OPEN' ? 'Pending' : filter === 'HISTORY' ? 'Executed' : 'All'}
                  </button>
              ))}
          </div>
      )}

      {/* Content List */}
      <div className="px-4 pb-20 space-y-3">
        {view === 'HOLDINGS' && (
            holdings.length > 0 ? holdings.map((h) => {
                // Find real-time data from STOCKS to calculate day change
                const stock = STOCKS.find(s => s.symbol === h.symbol);
                const dayChange = stock ? stock.change * h.qty : 0;
                const dayChangePercent = stock ? stock.percentChange : 0;
                const isDayPositive = dayChange >= 0;
                const isTotalPositive = h.pnl >= 0;

                return (
                    <div key={h.symbol} className="bg-white dark:bg-shriram-surface p-4 rounded-xl border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors shadow-sm">
                        {/* Header: Symbol, Qty, LTP */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-base text-gray-900 dark:text-white">{h.symbol}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                     <span className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded font-medium">{h.qty} Qty</span>
                                     <span className="text-[10px] text-gray-500 dark:text-gray-400">Avg. ₹{h.avgPrice.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-mono font-bold text-gray-900 dark:text-white">₹{h.ltp.toLocaleString()}</div>
                                <div className={`text-[10px] font-bold ${isDayPositive ? 'text-trade-up' : 'text-trade-down'}`}>
                                    {isDayPositive ? '+' : ''}{dayChangePercent}%
                                </div>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="bg-gray-50 dark:bg-[#121212] rounded-lg p-3 border border-gray-100 dark:border-white/5">
                             <div className="grid grid-cols-2 gap-4">
                                
                                {/* Current Value */}
                                <div className="border-r border-gray-200 dark:border-white/5 pr-2">
                                     <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Current Value</div>
                                     <div className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">₹{h.current.toLocaleString()}</div>
                                </div>

                                {/* Day's P&L */}
                                <div className="pl-2">
                                     <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Day's Change</div>
                                     <div className={`text-sm font-bold ${isDayPositive ? 'text-trade-up' : 'text-trade-down'}`}>
                                        {isDayPositive ? '+' : ''}₹{Math.abs(dayChange).toLocaleString()}
                                     </div>
                                </div>

                                {/* Separator */}
                                <div className="col-span-2 h-px bg-gray-200 dark:bg-white/5"></div>

                                 {/* Total P&L */}
                                 <div className="col-span-2 flex justify-between items-center">
                                     <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total Returns</div>
                                     <div className={`text-sm font-bold flex items-baseline gap-2 ${isTotalPositive ? 'text-trade-up' : 'text-trade-down'}`}>
                                        <span>{isTotalPositive ? '+' : ''}₹{Math.abs(h.pnl).toLocaleString()}</span>
                                        <span className="text-[10px] font-medium opacity-80 bg-white/50 dark:bg-white/5 px-1.5 py-0.5 rounded ml-1">
                                            {isTotalPositive ? '+' : ''}{h.pnlPercent}%
                                        </span>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                );
            }) : renderEmptyState('Holdings')
        )}

        {view === 'POSITIONS' && (
             positions.length > 0 ? positions.map((p) => (
                <div key={p.symbol} className="bg-white dark:bg-shriram-surface p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
                    <div className="flex justify-between items-start">
                         <div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${p.product === 'NRML' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'}`}>{p.product}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${p.type === 'BUY' ? 'bg-green-100 dark:bg-green-500/20 text-trade-up' : 'bg-red-100 dark:bg-red-500/20 text-trade-down'}`}>{p.type}</span>
                            </div>
                            <h4 className="font-bold text-xs mt-1 text-gray-900 dark:text-white">{p.symbol}</h4>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">{p.qty} Qty • Avg. {p.avgPrice}</span>
                        </div>
                        <div className="text-right">
                             <div className={`text-sm font-mono font-bold ${p.pnl >= 0 ? 'text-trade-up' : 'text-trade-down'}`}>
                                {p.pnl >= 0 ? '+' : ''}{p.pnl.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-0.5">LTP: {p.ltp}</div>
                        </div>
                    </div>
                </div>
             )) : renderEmptyState('Positions')
        )}

        {view === 'ORDERS' && (
            filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                    <div key={order.id} className="bg-white dark:bg-shriram-surface p-4 rounded-xl border border-gray-200 dark:border-white/5 relative overflow-hidden shadow-sm transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${order.type === 'BUY' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                                    {order.type}
                                </span>
                                <span className="text-[10px] font-bold text-gray-500 border border-gray-200 dark:border-white/10 px-1.5 py-0.5 rounded">
                                    {order.product}
                                </span>
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{order.symbol}</h4>
                            <div className="text-right">
                                <span className="text-xs text-gray-400 mr-1">Price</span>
                                <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">{order.price}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-gray-100 dark:border-white/5 pt-2 mt-2">
                            <div className="flex gap-4">
                                <span>Qty: <span className="text-gray-800 dark:text-gray-300 font-bold">{order.qty}</span></span>
                                <span>Time: {order.time}</span>
                            </div>
                            {order.message && (
                                <span className="text-red-400">{order.message}</span>
                            )}
                        </div>
                        
                        {/* Decorative Strip */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${order.status === 'EXECUTED' ? 'bg-green-500' : order.status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    </div>
                ))
            ) : renderEmptyState('Orders')
        )}
      </div>

      {view === 'HOLDINGS' && holdings.length > 0 && (
        <div className="px-4 py-6 flex justify-center pb-24">
            <button 
                onClick={() => navigate('/allocation')}
                className="flex items-center gap-2 text-shriram-yellowDim dark:text-shriram-yellow text-xs font-medium hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <PieIcon size={14} /> View Allocation Analysis
            </button>
        </div>
      )}
    </Layout>
  );
};

export default Portfolio;
