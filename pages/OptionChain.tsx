
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ChevronDown } from 'lucide-react';
import OrderPad from './OrderPad';

const STRIKES = [
    { strike: 22300, call: { price: 180.5, oi: '45L', change: 12 }, put: { price: 45.2, oi: '12L', change: -8 } },
    { strike: 22350, call: { price: 145.0, oi: '52L', change: 8 }, put: { price: 68.5, oi: '22L', change: -5 } },
    { strike: 22400, call: { price: 110.2, oi: '85L', change: -2 }, put: { price: 95.0, oi: '65L', change: 15 } },
    { strike: 22450, call: { price: 85.5, oi: '60L', change: -15 }, put: { price: 125.4, oi: '35L', change: 25 } },
    { strike: 22500, call: { price: 62.0, oi: '30L', change: -22 }, put: { price: 160.0, oi: '15L', change: 30 } },
    { strike: 22550, call: { price: 45.0, oi: '15L', change: -25 }, put: { price: 198.5, oi: '8L', change: 35 } },
];

const OptionChain: React.FC = () => {
  const [selectedStrike, setSelectedStrike] = useState<number | null>(null);
  const [orderPadOpen, setOrderPadOpen] = useState(false);

  const handleRowClick = (strike: number) => {
      setSelectedStrike(strike);
      setOrderPadOpen(true);
  }

  return (
    <Layout title="NIFTY 23MAY" showBack>
      
      {/* Controls */}
      <div className="bg-gray-50 dark:bg-shriram-bg px-4 py-2 flex justify-between border-b border-gray-200 dark:border-white/5 text-xs sticky top-[56px] z-20">
          <div className="flex flex-col">
             <span className="text-gray-500">Spot Price</span>
             <span className="font-mono font-bold text-gray-900 dark:text-white">22,450.30 <span className="text-green-500 text-[10px]">+0.56%</span></span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-[#1A1A1A] px-3 py-1 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm">
             <span className="text-gray-900 dark:text-white">23 MAY</span> <ChevronDown size={14} className="text-gray-400"/>
          </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-7 text-[10px] text-gray-500 py-2 bg-gray-100 dark:bg-[#121212] border-b border-gray-200 dark:border-white/5 text-center font-medium sticky top-[105px] z-20">
          <div className="col-span-2">CALL (LTP)</div>
          <div className="col-span-1">OI</div>
          <div className="col-span-1 text-gray-900 dark:text-white font-bold">STRIKE</div>
          <div className="col-span-1">OI</div>
          <div className="col-span-2">PUT (LTP)</div>
      </div>

      {/* Table */}
      <div className="pb-4">
         {STRIKES.map((row, idx) => {
             const isATM = row.strike === 22450;
             return (
                <div 
                    key={row.strike} 
                    onClick={() => handleRowClick(row.strike)}
                    className={`grid grid-cols-7 text-xs py-3 text-center border-b border-gray-100 dark:border-white/5 items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors active:bg-gray-100 dark:active:bg-white/10 cursor-pointer ${isATM ? 'bg-shriram-yellow/10 dark:bg-shriram-yellow/5' : ''}`}
                >
                    <div className={`col-span-2 font-mono ${row.call.change >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {row.call.price.toFixed(1)}
                    </div>
                    <div className="col-span-1 text-[10px] text-gray-400">{row.call.oi}</div>
                    <div className={`col-span-1 font-bold ${isATM ? 'text-shriram-yellowDim dark:text-shriram-yellow' : 'text-gray-900 dark:text-white'}`}>{row.strike}</div>
                    <div className="col-span-1 text-[10px] text-gray-400">{row.put.oi}</div>
                    <div className={`col-span-2 font-mono ${row.put.change >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {row.put.price.toFixed(1)}
                    </div>
                </div>
             );
         })}
      </div>

       {/* Legend */}
       <div className="px-4 py-3 text-[10px] text-gray-500 flex justify-center gap-4">
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-shriram-yellow/20 rounded-full"></div> ATM</div>
          <div className="flex items-center gap-1">Tap row to trade</div>
       </div>

       {selectedStrike && (
        <OrderPad 
            isOpen={orderPadOpen} 
            onClose={() => setOrderPadOpen(false)} 
            symbol={`NIFTY ${selectedStrike} CE/PE`} 
            ltp={100} 
            initialType='BUY'
        />
       )}

    </Layout>
  );
};

export default OptionChain;
