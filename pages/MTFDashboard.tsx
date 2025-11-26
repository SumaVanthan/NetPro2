
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { MTF_POSITIONS, MTF_STATS } from '../constants';
import { ShieldCheck, Info, AlertTriangle, ArrowUpRight, Landmark, Clock } from 'lucide-react';

const MTFDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'POSITIONS' | 'HOLDINGS'>('POSITIONS');

  return (
    <Layout title="MTF Dashboard" showBack>
      {/* Hero Stats */}
      <div className="bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-white/5 px-4 py-6 transition-colors">
          <div className="flex justify-between items-start mb-6">
              <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">Total MTF Debt <Info size={12}/></div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">₹{MTF_STATS.totalDebt.toLocaleString()}</div>
              </div>
              <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Accrued Interest</div>
                  <div className="text-lg font-bold text-red-600 dark:text-red-400 font-mono">₹{MTF_STATS.accruedInterest}</div>
              </div>
          </div>

          {/* Risk Meter */}
          <div className="mb-2">
              <div className="flex justify-between text-[10px] mb-1 font-bold uppercase">
                  <span className="text-green-600 dark:text-green-500">Safe</span>
                  <span className="text-yellow-600 dark:text-yellow-500">Moderate</span>
                  <span className="text-red-600 dark:text-red-500">Critical</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-green-500 w-[60%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <div className="h-full bg-yellow-500 w-[0%]"></div>
                  <div className="h-full bg-red-500 w-[0%]"></div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                  <ShieldCheck size={12} className="text-green-600 dark:text-green-500" />
                  Your margin status is healthy.
              </div>
          </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 px-4 py-4">
           <button className="bg-white dark:bg-shriram-surface border border-gray-200 dark:border-white/10 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white shadow-sm transition-colors">
               <Landmark size={16} className="text-shriram-yellowDim dark:text-shriram-yellow"/> Add Collateral
           </button>
           <button className="bg-white dark:bg-shriram-surface border border-gray-200 dark:border-white/10 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white shadow-sm transition-colors">
               <ArrowUpRight size={16} className="text-blue-600 dark:text-blue-400"/> Add Funds
           </button>
      </div>

      {/* Content Tabs */}
      <div className="px-4">
          <div className="flex border-b border-gray-200 dark:border-white/10 mb-4">
              <button 
                onClick={() => setActiveTab('POSITIONS')}
                className={`pb-3 text-xs font-bold px-4 transition-colors ${activeTab === 'POSITIONS' ? 'text-shriram-yellowDim dark:text-shriram-yellow border-b-2 border-shriram-yellowDim dark:border-shriram-yellow' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-400'}`}
              >
                  Active Positions
              </button>
              <button 
                onClick={() => setActiveTab('HOLDINGS')}
                className={`pb-3 text-xs font-bold px-4 transition-colors ${activeTab === 'HOLDINGS' ? 'text-shriram-yellowDim dark:text-shriram-yellow border-b-2 border-shriram-yellowDim dark:border-shriram-yellow' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-400'}`}
              >
                  Pledged Holdings
              </button>
          </div>

          {/* Positions List */}
          <div className="space-y-3 pb-20">
              {MTF_POSITIONS.map((pos, idx) => (
                  <div key={idx} className="bg-white dark:bg-shriram-surface p-4 rounded-xl border border-gray-200 dark:border-white/5 relative overflow-hidden shadow-sm transition-colors">
                      <div className="absolute top-0 right-0 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] font-bold px-2 py-1 rounded-bl-lg">
                          MTF 4x
                      </div>
                      <div className="flex justify-between items-start mb-3">
                          <div>
                              <h3 className="font-bold text-sm text-gray-900 dark:text-white">{pos.symbol}</h3>
                              <div className="text-[10px] text-gray-500 dark:text-gray-400">{pos.qty} Qty @ {pos.avgPrice.toFixed(2)}</div>
                          </div>
                          <div className="text-right mt-4">
                              <div className={`text-sm font-mono font-bold ${pos.pnl >= 0 ? 'text-trade-up' : 'text-trade-down'}`}>
                                  {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toLocaleString()}
                              </div>
                              <div className="text-[10px] text-gray-500">P&L</div>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-black/20 p-2 rounded-lg text-[10px] mb-3">
                          <div>
                              <span className="text-gray-500 block">Funded Amount</span>
                              <span className="text-gray-900 dark:text-white font-medium">₹{((pos.avgPrice * pos.qty) * 0.75).toLocaleString()}</span>
                          </div>
                          <div>
                              <span className="text-gray-500 block">Interest (7 Days)</span>
                              <span className="text-red-600 dark:text-red-300 font-medium">₹45.20</span>
                          </div>
                      </div>

                      <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-gray-100 dark:bg-white/5 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Square Off</button>
                          <button className="flex-1 py-2 bg-shriram-yellow/10 text-shriram-yellowDim dark:text-shriram-yellow rounded-lg text-xs font-bold hover:bg-shriram-yellow/20 transition-colors">Convert to Delivery</button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </Layout>
  );
};

export default MTFDashboard;
