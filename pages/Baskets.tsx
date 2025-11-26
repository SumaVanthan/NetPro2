
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { BASKETS } from '../constants';
import { Search, Filter, ShoppingBag, TrendingUp, Shield, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Baskets: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'THEME' | 'DEFENSIVE' | 'VOLATILITY' | 'DIVIDEND'>('ALL');

  const filteredBaskets = activeFilter === 'ALL' 
    ? BASKETS 
    : BASKETS.filter(b => b.type === activeFilter);

  const FilterChip = ({ label, type, icon: Icon }: any) => (
    <button 
        onClick={() => setActiveFilter(type)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
            activeFilter === type 
            ? 'bg-shriram-yellowDim dark:bg-shriram-yellow text-white dark:text-black border-shriram-yellowDim dark:border-shriram-yellow' 
            : 'bg-white/10 dark:bg-white/5 text-gray-100 dark:text-gray-400 border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:border-white/30'
        }`}
    >
        {Icon && <Icon size={12} />}
        {label}
    </button>
  );

  return (
    <Layout title="Smart Baskets" showBack>
        
      {/* Hero Section */}
      <div className="px-4 py-4 bg-gradient-to-b from-shriram-yellowDim/90 to-shriram-yellowDim/70 dark:from-shriram-yellow/10 dark:to-transparent transition-colors">
        <h2 className="text-xl font-bold text-white mb-1">Curated Portfolios</h2>
        <p className="text-xs text-white/80 dark:text-gray-400 mb-4">Invest in ideas, themes & strategies with one click.</p>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <FilterChip label="All" type="ALL" />
            <FilterChip label="Themes" type="THEME" icon={Target} />
            <FilterChip label="Defensive" type="DEFENSIVE" icon={Shield} />
            <FilterChip label="High Volatility" type="VOLATILITY" icon={Zap} />
            <FilterChip label="Dividends" type="DIVIDEND" icon={TrendingUp} />
        </div>
      </div>

      {/* Basket List */}
      <div className="px-4 pb-6 space-y-4 mt-4">
        {filteredBaskets.map((basket) => (
            <div 
                key={basket.id}
                onClick={() => navigate(`/basket/${basket.id}`)}
                className="bg-white dark:bg-shriram-surface rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden relative active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md dark:shadow-none"
            >
                {/* Decorative Background Blob */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-5 dark:opacity-10 pointer-events-none ${
                    basket.type === 'THEME' ? 'bg-blue-500' :
                    basket.type === 'DEFENSIVE' ? 'bg-green-500' :
                    basket.type === 'VOLATILITY' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />

                <div className="p-4 relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                             <div className={`p-2 rounded-lg ${
                                basket.type === 'THEME' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                                basket.type === 'DEFENSIVE' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' :
                                basket.type === 'VOLATILITY' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                            }`}>
                                <ShoppingBag size={18} />
                             </div>
                             <div>
                                 <h3 className="font-bold text-base text-gray-900 dark:text-white">{basket.name}</h3>
                                 <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                                     <span>{basket.stocks.length} Stocks</span>
                                     <span>•</span>
                                     <span>{basket.risk} Risk</span>
                                 </div>
                             </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">3Y CAGR</div>
                            <div className="text-lg font-bold text-trade-up">+{basket.cagr}%</div>
                        </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                        {basket.description}
                    </p>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-white/5">
                        <div className="text-xs">
                            <span className="text-gray-500">Min. Amount:</span> 
                            <span className="font-bold ml-1 text-gray-900 dark:text-gray-200">₹{basket.minInvest.toLocaleString()}</span>
                        </div>
                        <button className="text-xs font-bold text-shriram-yellowDim dark:text-shriram-yellow flex items-center gap-1">
                            View Details <TrendingUp size={12}/>
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>

    </Layout>
  );
};

export default Baskets;
