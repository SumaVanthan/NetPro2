import React from 'react';
import Layout from '../components/Layout';
import { Wallet, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const Funds: React.FC = () => {
  return (
    <Layout title="Funds" showBack>
      <div className="px-4 pt-6">
         {/* Balance Card */}
         <div className="bg-gradient-to-r from-shriram-yellow to-yellow-600 p-6 rounded-2xl text-black shadow-lg shadow-yellow-900/20 mb-6">
             <div className="flex items-center gap-2 opacity-80 mb-1">
                <Wallet size={16} />
                <span className="text-xs font-bold uppercase">Available Margin</span>
             </div>
             <h1 className="text-3xl font-bold font-mono">₹45,200.00</h1>
             <div className="mt-4 flex gap-4 text-xs font-medium opacity-90">
                <div>
                    <div className="opacity-70">Used Margin</div>
                    <div>₹12,450.00</div>
                </div>
                <div>
                    <div className="opacity-70">Opening Balance</div>
                    <div>₹57,650.00</div>
                </div>
             </div>
         </div>

         {/* Actions */}
         <div className="flex gap-4 mb-8">
            <button className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <ArrowDownLeft size={18} /> Add Funds
            </button>
            <button className="flex-1 bg-[#1A1A1A] text-white border border-white/10 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#222]">
                <ArrowUpRight size={18} /> Withdraw
            </button>
         </div>

         {/* History */}
         <div>
            <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
                <History size={16} /> Recent Transactions
            </h3>
            <div className="space-y-3">
                {[
                    { label: 'Funds Added via UPI', date: 'Today, 10:30 AM', amount: 5000, type: 'CR' },
                    { label: 'Withdrawal Request', date: 'Yesterday', amount: 12000, type: 'DR' },
                    { label: 'Quarterly Settlement', date: '12 May 2024', amount: 450.50, type: 'DR' },
                ].map((tx, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-[#1A1A1A] rounded-xl border border-white/5">
                        <div>
                            <div className="text-sm font-medium text-gray-200">{tx.label}</div>
                            <div className="text-[10px] text-gray-500">{tx.date}</div>
                        </div>
                        <div className={`font-mono font-bold text-sm ${tx.type === 'CR' ? 'text-green-400' : 'text-white'}`}>
                            {tx.type === 'CR' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </div>
    </Layout>
  );
};

export default Funds;