
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { BASKETS } from '../constants';
import CandleChart from '../components/CandleChart'; // Reuse chart for illustration
import { ArrowLeft, Share2, Info, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

const BasketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const basket = BASKETS.find(b => b.id === id);
  const [amount, setAmount] = useState(basket?.minInvest || 10000);

  if (!basket) return <div>Basket not found</div>;

  const getRiskColor = (risk: string) => {
      if (risk === 'High') return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
      if (risk === 'Medium') return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20';
      return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
  };

  const handleBack = () => {
      if (window.history.state && window.history.state.idx > 0) {
          navigate(-1);
      } else {
          navigate('/baskets');
      }
  };

  return (
    <Layout hideNav>
       {/* Header */}
       <div className="sticky top-0 z-40 bg-white dark:bg-shriram-bg border-b border-gray-200 dark:border-white/5 px-4 py-3 flex justify-between items-center transition-colors">
         <button 
            onClick={handleBack} 
            className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full active:bg-gray-100 dark:active:bg-white/10 transition-colors"
         >
            <ArrowLeft size={20}/>
         </button>
         <h1 className="text-sm font-bold text-gray-900 dark:text-white">Basket Details</h1>
         <button className="p-2 -mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full active:bg-gray-100 dark:active:bg-white/10 transition-colors">
            <Share2 size={20}/>
         </button>
      </div>

      <div className="pb-32">
          {/* Hero */}
          <div className="px-4 pt-6 pb-4">
              <div className="flex justify-between items-start mb-2">
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{basket.name}</h2>
                   <span className={`text-[10px] font-bold px-2 py-1 rounded border ${getRiskColor(basket.risk)}`}>
                       {basket.risk} Risk
                   </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{basket.description}</p>
          </div>

          {/* Performance */}
          <div className="px-4 mb-6">
             <div className="flex gap-8 mb-4">
                 <div>
                     <div className="text-xs text-gray-500 mb-1">3Y CAGR</div>
                     <div className="text-2xl font-bold text-trade-up">+{basket.cagr}%</div>
                 </div>
                 <div>
                     <div className="text-xs text-gray-500 mb-1">Volatility</div>
                     <div className="text-2xl font-bold text-gray-900 dark:text-gray-200">{basket.volatility}</div>
                 </div>
             </div>
             
             {/* Chart Placeholder - Using Line Chart */}
             <div className="h-48 bg-white dark:bg-shriram-surface rounded-xl border border-gray-200 dark:border-white/5 p-2 relative overflow-hidden shadow-sm">
                 <div className="absolute top-2 right-2 flex gap-2 z-10">
                     <div className="flex items-center gap-1 text-[10px] text-gray-700 dark:text-white">
                         <div className="w-2 h-2 bg-shriram-yellowDim dark:bg-shriram-yellow rounded-full"></div> {basket.name}
                     </div>
                     <div className="flex items-center gap-1 text-[10px] text-gray-500">
                         <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div> NIFTY 50
                     </div>
                 </div>
                 <CandleChart type="area" />
             </div>
          </div>

          {/* Constituents */}
          <div className="px-4 mb-6">
              <h3 className="text-sm font-bold mb-3 text-gray-900 dark:text-white">Stocks & Weights</h3>
              <div className="bg-white dark:bg-shriram-surface rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                  {basket.stocks.map((stock, i) => (
                      <div key={stock.symbol} className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                                  {stock.symbol.substring(0,1)}
                              </div>
                              <div>
                                  <div className="text-sm font-bold text-gray-900 dark:text-white">{stock.symbol}</div>
                                  <div className="text-[10px] text-gray-500">Equity</div>
                              </div>
                          </div>
                          <div className="text-right">
                              <div className="text-sm font-bold text-gray-900 dark:text-white">{stock.weight}%</div>
                              <div className="text-[10px] text-gray-500">Weight</div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* About */}
          <div className="px-4 mb-6">
               <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                   <Info size={16} className="text-shriram-yellowDim dark:text-shriram-yellow"/> Why Invest?
               </h3>
               <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                   This basket is designed to provide exposure to {basket.name} theme. 
                   It is rebalanced quarterly to ensure alignment with the strategy. 
                   Perfect for investors looking for {basket.risk === 'Low' ? 'stability' : 'growth'}.
               </p>
          </div>
      </div>

      {/* Invest Dock */}
      <div className="fixed bottom-0 w-full max-w-md bg-white/95 dark:bg-shriram-bg/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 p-4 z-50 rounded-t-2xl transition-colors">
          <div className="flex justify-between items-center mb-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Investment Amount</div>
              <div className="text-xs text-shriram-yellowDim dark:text-shriram-yellow font-bold">Min. ₹{basket.minInvest}</div>
          </div>
          <div className="flex items-center bg-gray-100 dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3 mb-4">
              <span className="text-gray-500 font-medium mr-2">₹</span>
              <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  className="bg-transparent w-full text-xl font-bold text-gray-900 dark:text-white focus:outline-none"
              />
          </div>
          <button className="w-full bg-shriram-yellow text-black font-bold py-4 rounded-xl text-lg shadow-lg shadow-shriram-yellow/20 active:scale-95 transition-transform">
              Invest Now
          </button>
      </div>

    </Layout>
  );
};

export default BasketDetail;
