
import React, { useState } from 'react';
import { X, Info, Zap, Percent } from 'lucide-react';

interface OrderPadProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  ltp: number;
  initialType: 'BUY' | 'SELL';
}

const OrderPad: React.FC<OrderPadProps> = ({ isOpen, onClose, symbol, ltp, initialType }) => {
  const [type, setType] = useState(initialType);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(ltp);
  const [orderMode, setOrderMode] = useState<'MARKET' | 'LIMIT'>('LIMIT');
  const [product, setProduct] = useState<'MIS' | 'CNC' | 'MTF'>('CNC');

  if (!isOpen) return null;

  const estimatedValue = orderMode === 'MARKET' ? ltp * qty : price * qty;
  
  // MTF Logic
  const mtfLeverage = 4; // Synthetic leverage
  const marginRequired = product === 'MTF' ? estimatedValue / mtfLeverage : estimatedValue;
  const dailyInterest = product === 'MTF' ? (estimatedValue - marginRequired) * 0.0005 : 0; // ~0.05% per day synthetic

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border-t sm:border border-gray-200 dark:border-white/10 animate-in slide-in-from-bottom-10 text-gray-900 dark:text-white">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
             <h2 className="text-lg font-bold">{symbol}</h2>
             <div className="flex items-center gap-2">
                <span className="text-xs font-mono">₹{ltp.toFixed(2)}</span>
                <span className="text-[10px] text-green-500">+0.5%</span>
             </div>
          </div>
          <div className="flex items-center bg-gray-100 dark:bg-black/40 rounded-lg p-1">
            <button 
                onClick={() => setType('BUY')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${type === 'BUY' ? 'bg-trade-up text-white' : 'text-gray-500 dark:text-gray-400'}`}
            >
                BUY
            </button>
            <button 
                onClick={() => setType('SELL')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${type === 'SELL' ? 'bg-trade-down text-white' : 'text-gray-500 dark:text-gray-400'}`}
            >
                SELL
            </button>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"><X size={20}/></button>
        </div>

        {/* Product Type */}
        <div className="flex gap-2 mb-6 bg-gray-50 dark:bg-black/20 p-1 rounded-xl">
             <button 
                onClick={() => setProduct('MIS')}
                className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${product === 'MIS' ? 'border-shriram-yellow text-shriram-yellow bg-shriram-yellow/10 shadow-sm' : 'border-transparent text-gray-500'}`}
             >
                Intraday
             </button>
             <button 
                onClick={() => setProduct('CNC')}
                className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${product === 'CNC' ? 'border-shriram-yellow text-shriram-yellow bg-shriram-yellow/10 shadow-sm' : 'border-transparent text-gray-500'}`}
             >
                Delivery
             </button>
             <button 
                onClick={() => setProduct('MTF')}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1 ${product === 'MTF' ? 'border-blue-500 text-blue-500 bg-blue-500/10 shadow-sm' : 'border-transparent text-gray-500'}`}
             >
                MTF <Zap size={10} fill="currentColor"/>
             </button>
        </div>

        {/* MTF Highlight Box */}
        {product === 'MTF' && (
            <div className="mb-6 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex justify-between items-center">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Percent size={14} />
                    <span className="text-xs font-medium">Pay only 25% now. Carry forward.</span>
                </div>
                <div className="text-[10px] text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-black/40 px-2 py-1 rounded">
                    4x Leverage
                </div>
            </div>
        )}

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
                <label className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1">Quantity</label>
                <div className="flex items-center bg-gray-100 dark:bg-black/40 rounded-lg border border-gray-200 dark:border-white/10 px-3 py-3">
                    <input 
                        type="number" 
                        value={qty} 
                        onChange={(e) => setQty(parseInt(e.target.value))}
                        className="bg-transparent w-full text-gray-900 dark:text-white font-mono text-lg focus:outline-none"
                    />
                    <span className="text-xs text-gray-500">Qty</span>
                </div>
            </div>
            <div>
                <label className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1">Price</label>
                <div className={`flex items-center bg-gray-100 dark:bg-black/40 rounded-lg border border-gray-200 dark:border-white/10 px-3 py-3 ${orderMode === 'MARKET' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <span className="text-gray-500 mr-1">₹</span>
                    <input 
                        type="number" 
                        value={price} 
                        disabled={orderMode === 'MARKET'}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        className="bg-transparent w-full text-gray-900 dark:text-white font-mono text-lg focus:outline-none"
                    />
                </div>
            </div>
        </div>

        {/* Order Type Toggle */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
            {['MARKET', 'LIMIT', 'SL', 'SL-M'].map(m => (
                <button 
                    key={m}
                    onClick={() => setOrderMode(m as any)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold border ${orderMode === m ? 'bg-white text-black border-gray-300 dark:border-white' : 'border-gray-300 dark:border-white/10 text-gray-400 hover:border-gray-400 dark:hover:border-white/30'}`}
                >
                    {m}
                </button>
            ))}
        </div>

        {/* Margin & Charges */}
        <div className="bg-gray-50 dark:bg-shriram-surfaceHighlight rounded-lg p-3 mb-6 border border-gray-100 dark:border-transparent">
            <div className="flex justify-between items-center mb-2">
                <div className="text-[10px] text-gray-500 dark:text-gray-400">Margin Required</div>
                <div className="text-sm font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    ₹{marginRequired.toFixed(2)}
                    {product === 'MTF' && <span className="text-[10px] text-gray-400 dark:text-gray-500 line-through">₹{estimatedValue.toFixed(2)}</span>}
                </div>
            </div>
            {product === 'MTF' && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-white/5">
                    <div className="text-[10px] text-blue-500 dark:text-blue-400">Est. Daily Interest</div>
                    <div className="text-[10px] font-medium text-gray-800 dark:text-white">~₹{dailyInterest.toFixed(2)} / day</div>
                </div>
            )}
        </div>

        {/* Submit */}
        <button 
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-transform active:scale-95 ${type === 'BUY' ? 'bg-trade-up shadow-green-500/20' : 'bg-trade-down shadow-red-500/20'}`}
            onClick={onClose}
        >
            {type} {product}
        </button>

      </div>
    </div>
  );
};

export default OrderPad;
