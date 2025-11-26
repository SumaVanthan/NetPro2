import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import CandleChart from '../components/CandleChart';
import { STOCKS, SENTIMENT_INSIGHTS } from '../constants';
import { ArrowLeft, Bell, Star, CandlestickChart, LineChart, AreaChart, Hexagon } from 'lucide-react';
import OrderPad from './OrderPad';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const stock = STOCKS.find(s => s.symbol === symbol) || STOCKS[0];
  const isPositive = stock.change >= 0;
  
  const [showOrderPad, setShowOrderPad] = useState(false);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [chartType, setChartType] = useState<'candle' | 'line' | 'area'>('candle');

  const openOrderPad = (type: 'BUY' | 'SELL') => {
      setOrderType(type);
      setShowOrderPad(true);
  }

  const handleBack = () => {
      if (location.key !== 'default') {
          navigate(-1);
      } else {
          navigate('/watchlist');
      }
  };

  return (
    <Layout hideNav>
      {/* Custom Header */}
      <div className="sticky top-0 z-40 bg-gray-50 dark:bg-shriram-bg border-b border-gray-200 dark:border-white/5 px-4 py-3 flex justify-between items-center transition-colors">
         <button onClick={handleBack} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full active:bg-gray-200 dark:active:bg-white/10 transition-colors">
             <ArrowLeft size={20}/>
         </button>
         <div className="text-center">
            <h1 className="text-sm font-bold text-gray-900 dark:text-white">{stock.symbol}</h1>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">{stock.exchange}</span>
         </div>
         <div className="flex gap-3">
            <Bell size={18} className="text-gray-400" />
            <Star size={18} className="text-shriram-yellowDim dark:text-shriram-yellow fill-shriram-yellowDim dark:fill-shriram-yellow" />
         </div>
      </div>

      <div className="px-4 pt-6 pb-24">
        {/* Price Header */}
        <div className="mb-6">
            <h2 className={`text-3xl font-bold font-mono ${isPositive ? 'text-trade-up' : 'text-trade-down'}`}>
                {stock.ltp.toFixed(2)}
            </h2>
            <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm font-medium ${isPositive ? 'text-trade-up' : 'text-trade-down'}`}>
                    {isPositive ? '+' : ''}{stock.change} ({stock.percentChange}%)
                </span>
                <span className="text-xs text-gray-500 ml-2">Vol: {stock.volume}</span>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 dark:border-white/5 mb-4">
            <button className="text-shriram-yellowDim dark:text-shriram-yellow border-b-2 border-shriram-yellowDim dark:border-shriram-yellow pb-2 text-sm font-medium">Chart</button>
            <button className="text-gray-500 pb-2 text-sm font-medium" onClick={() => navigate('/option-chain')}>Option Chain</button>
            <button className="text-gray-500 pb-2 text-sm font-medium">News</button>
        </div>

        {/* Chart */}
        <div className="h-64 w-full bg-white dark:bg-shriram-surface/50 rounded-lg border border-gray-200 dark:border-white/5 relative overflow-hidden shadow-sm">
             {/* Timeframe Pill */}
             <div className="absolute top-2 left-2 z-10 flex bg-gray-100/80 dark:bg-black/40 rounded-lg p-1 backdrop-blur-sm">
                {['1D', '1W', '1M', '1Y'].map(tf => (
                    <span key={tf} className={`px-2 py-1 text-[10px] rounded cursor-pointer ${tf === '1D' ? 'bg-white text-black dark:bg-white/20 dark:text-white shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>{tf}</span>
                ))}
             </div>

             {/* Chart Type Toggle */}
             <div className="absolute top-2 right-2 z-10 flex bg-gray-100/80 dark:bg-black/40 rounded-lg p-1 backdrop-blur-sm gap-1">
                <button 
                  onClick={() => setChartType('candle')} 
                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition-colors ${chartType === 'candle' ? 'bg-white dark:bg-white/20 text-shriram-yellowDim dark:text-shriram-yellow shadow-sm' : 'text-gray-400'}`}
                  title="Candle"
                >
                  <CandlestickChart size={14} />
                </button>
                <button 
                  onClick={() => setChartType('line')} 
                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition-colors ${chartType === 'line' ? 'bg-white dark:bg-white/20 text-shriram-yellowDim dark:text-shriram-yellow shadow-sm' : 'text-gray-400'}`}
                  title="Line"
                >
                  <LineChart size={14} />
                </button>
                <button 
                  onClick={() => setChartType('area')} 
                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition-colors ${chartType === 'area' ? 'bg-white dark:bg-white/20 text-shriram-yellowDim dark:text-shriram-yellow shadow-sm' : 'text-gray-400'}`}
                  title="Area"
                >
                  <AreaChart size={14} />
                </button>
             </div>

             <CandleChart type={chartType} />
        </div>

        {/* OHLC */}
        <div className="grid grid-cols-4 gap-2 mt-6 text-center">
            {[
                { label: 'Open', val: stock.open },
                { label: 'High', val: stock.high },
                { label: 'Low', val: stock.low },
                { label: 'Prev. C', val: stock.prevClose }
            ].map(item => (
                <div key={item.label} className="bg-white dark:bg-shriram-surface p-2 rounded-lg border border-gray-200 dark:border-transparent shadow-sm">
                    <div className="text-[10px] text-gray-500 uppercase">{item.label}</div>
                    <div className="text-xs font-bold mt-1 text-gray-900 dark:text-white">{item.val}</div>
                </div>
            ))}
        </div>

        {/* Market Depth */}
        <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Market Depth</h3>
            <div className="flex text-[10px]">
                <div className="w-1/2 pr-1">
                    <div className="flex justify-between text-gray-500 mb-1"><span>Bid</span><span>Orders</span></div>
                    {stock.depth.buy.map((d, i) => (
                        <div key={i} className="flex justify-between py-1 relative">
                            <div className="absolute top-0 left-0 h-full bg-green-500/10 z-0" style={{ width: `${Math.random() * 100}%` }}></div>
                            <span className="relative z-10 text-trade-up font-mono">{d.price}</span>
                            <span className="relative z-10 text-gray-700 dark:text-gray-300">{d.qty}</span>
                        </div>
                    ))}
                </div>
                <div className="w-1/2 pl-1 border-l border-gray-200 dark:border-white/5">
                    <div className="flex justify-between text-gray-500 mb-1"><span>Offer</span><span>Orders</span></div>
                    {stock.depth.sell.map((d, i) => (
                        <div key={i} className="flex justify-between py-1 relative">
                             <div className="absolute top-0 right-0 h-full bg-red-500/10 z-0" style={{ width: `${Math.random() * 100}%` }}></div>
                            <span className="relative z-10 text-trade-down font-mono">{d.price}</span>
                            <span className="relative z-10 text-gray-700 dark:text-gray-300">{d.qty}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex mt-2 text-xs font-bold">
                <div className="w-1/2 text-trade-up">Total: 1.2M</div>
                <div className="w-1/2 text-right text-trade-down">Total: 0.9M</div>
            </div>
             <div className="mt-1 h-1 w-full bg-gray-200 dark:bg-gray-800 rounded-full flex overflow-hidden">
                <div className="h-full bg-trade-up w-[55%]"></div>
                <div className="h-full bg-trade-down w-[45%]"></div>
             </div>
        </div>
        
        {/* Fundamentals Preview */}
         <div className="mt-6 p-4 rounded-xl bg-white dark:bg-shriram-surface border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Fundamentals</h3>
                <span className="text-xs text-shriram-yellowDim dark:text-shriram-yellow">Know more</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                    <div className="text-gray-500">Mkt Cap</div>
                    <div className="text-gray-900 dark:text-white font-medium">₹18.5L Cr</div>
                </div>
                <div>
                    <div className="text-gray-500">P/E Ratio</div>
                    <div className="text-gray-900 dark:text-white font-medium">28.4</div>
                </div>
            </div>
         </div>

      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-0 w-full max-w-md bg-white/90 dark:bg-shriram-bg/90 backdrop-blur-lg p-4 border-t border-gray-200 dark:border-white/10 flex gap-3 z-50 transition-colors">
        <button 
            onClick={() => openOrderPad('SELL')}
            className="flex-1 bg-trade-down text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-500/20 dark:shadow-red-900/20 active:scale-95 transition-transform"
        >
            SELL
        </button>
        <button 
            onClick={() => openOrderPad('BUY')}
            className="flex-1 bg-trade-up text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/20 dark:shadow-green-900/20 active:scale-95 transition-transform"
        >
            BUY
        </button>
      </div>
      
      {/* Order Sheet */}
      {showOrderPad && (
        <OrderPad 
            isOpen={showOrderPad} 
            onClose={() => setShowOrderPad(false)} 
            symbol={stock.symbol} 
            ltp={stock.ltp} 
            initialType={orderType}
        />
      )}

    </Layout>
  );
};

export default StockDetail;
