
import React from 'react';
import Layout from '../components/Layout';
import { ALLOCATION_DATA, HOLDINGS } from '../constants';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip 
} from 'recharts';
import { 
    PieChart as PieIcon, TrendingUp, Layers, ShieldAlert, Hash
} from 'lucide-react';

const AllocationAnalysis: React.FC = () => {
  const totalValue = HOLDINGS.reduce((acc, curr) => acc + curr.current, 0);

  // Sort holdings by weight
  const sortedHoldings = [...HOLDINGS].sort((a, b) => b.current - a.current).map(h => ({
      ...h,
      weight: (h.current / totalValue) * 100
  }));

  const SectionHeader = ({ icon: Icon, title, subtitle }: any) => (
      <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg text-shriram-yellowDim dark:text-shriram-yellow">
              <Icon size={18} />
          </div>
          <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
              {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
      </div>
  );

  const Card = ({ children, className = '' }: any) => (
      <div className={`bg-white dark:bg-shriram-surface p-4 rounded-xl border border-gray-200 dark:border-white/5 mb-6 shadow-sm ${className}`}>
          {children}
      </div>
  );

  return (
    <Layout title="Portfolio Analysis" showBack>
      <div className="px-4 pt-4 pb-20">
          
          {/* Total Value Header */}
          <div className="mb-6 flex justify-center">
             <div className="text-center">
                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Portfolio Value</p>
                 <h2 className="text-2xl font-bold font-mono text-gray-900 dark:text-white">₹{totalValue.toLocaleString()}</h2>
             </div>
          </div>

          {/* Sector Allocation */}
          <Card>
              <SectionHeader icon={PieIcon} title="Sector Allocation" subtitle="Exposure by industry sectors" />
              <div className="h-48 relative">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={ALLOCATION_DATA.sectors}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                          >
                              {ALLOCATION_DATA.sectors.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                              ))}
                          </Pie>
                          <RechartsTooltip 
                             contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                             itemStyle={{ color: '#fff' }}
                             formatter={(value: number) => [`${value}%`, 'Allocation']}
                          />
                      </PieChart>
                  </ResponsiveContainer>
                  {/* Center Content */}
                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Top Sector</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{ALLOCATION_DATA.sectors[0].name}</span>
                  </div>
              </div>
              
              {/* Legend with Returns */}
              <div className="space-y-3 mt-4">
                  {ALLOCATION_DATA.sectors.map((sector) => (
                      <div key={sector.name} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sector.color }}></div>
                               <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{sector.name}</span>
                          </div>
                          <div className="text-right flex items-center gap-3">
                              <span className={`text-[10px] ${sector.return >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {sector.return > 0 ? '+' : ''}{sector.return}%
                              </span>
                              <span className="text-xs font-bold text-gray-900 dark:text-white w-8 text-right">{sector.value}%</span>
                          </div>
                      </div>
                  ))}
              </div>
          </Card>

           {/* Market Cap & Risk Distribution */}
           <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Market Cap */}
              <div className="bg-white dark:bg-shriram-surface p-4 rounded-xl border border-gray-200 dark:border-white/5 flex flex-col shadow-sm">
                   <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">Market Cap</h3>
                   <div className="flex-1 flex items-end justify-between gap-2 min-h-[120px] pb-5 relative">
                       {ALLOCATION_DATA.marketCap.map((cap) => (
                           <div key={cap.name} className="w-1/3 h-full flex flex-col justify-end items-center group relative">
                               <div className="text-[10px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-[calc(100%+4px)] text-gray-900 dark:text-white">{cap.value}%</div>
                               <div 
                                  className="w-full rounded-t-sm transition-all hover:opacity-80" 
                                  style={{ height: `${cap.value}%`, backgroundColor: cap.color }}
                               ></div>
                               <div className="text-[9px] text-gray-500 mt-2 text-center leading-tight absolute top-full w-full">{cap.name}</div>
                           </div>
                       ))}
                   </div>
              </div>

              {/* Risk Distribution */}
              <div className="bg-white dark:bg-shriram-surface p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">Risk Dist.</h3>
                   <div className="h-32 flex flex-col justify-end space-y-3">
                        {ALLOCATION_DATA.riskDistribution.map(risk => (
                            <div key={risk.name}>
                                <div className="flex justify-between text-[9px] mb-1 text-gray-500 dark:text-gray-400">
                                    <span>{risk.name}</span>
                                    <span>{risk.value}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${risk.value}%`, backgroundColor: risk.color }}></div>
                                </div>
                            </div>
                        ))}
                   </div>
              </div>
          </div>

          {/* Sub-sector / Industry Allocation */}
          <Card>
              <SectionHeader icon={TrendingUp} title="Industry Breakdown" subtitle="Detailed exposure by sub-sectors" />
              <div className="space-y-4">
                  {ALLOCATION_DATA.subSectors.map((sub) => (
                      <div key={sub.name}>
                          <div className="flex justify-between items-end mb-1">
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{sub.name}</span>
                              <span className="text-xs font-bold text-gray-900 dark:text-white">{sub.value}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                  className="h-full rounded-full" 
                                  style={{ width: `${sub.value}%`, backgroundColor: sub.color }}
                              ></div>
                          </div>
                      </div>
                  ))}
              </div>
          </Card>

          {/* Stock Allocation */}
          <Card>
               <SectionHeader icon={Layers} title="Stock Allocation" subtitle="Weight by individual stock" />
               <div className="space-y-4">
                   {sortedHoldings.map((stock) => (
                       <div key={stock.symbol} className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400">
                                   {stock.symbol.substring(0, 1)}
                               </div>
                               <div>
                                   <div className="text-xs font-bold text-gray-900 dark:text-gray-200">{stock.symbol}</div>
                                   <div className="text-[10px] text-gray-500">₹{stock.current.toLocaleString()}</div>
                               </div>
                           </div>
                           
                           <div className="flex-1 mx-4">
                                <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                   <div 
                                      className={`h-full ${stock.weight > 20 ? 'bg-red-500' : 'bg-shriram-yellow'}`} 
                                      style={{ width: `${stock.weight}%` }}
                                   ></div>
                               </div>
                           </div>

                           <div className="text-right w-12">
                               <div className="font-bold text-xs text-gray-900 dark:text-white">{stock.weight.toFixed(1)}%</div>
                           </div>
                       </div>
                   ))}
               </div>
               
               {sortedHoldings.some(s => s.weight > 20) && (
                    <div className="mt-4 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 rounded-lg flex gap-2 items-center">
                        <ShieldAlert size={14} className="text-red-500 dark:text-red-400" />
                        <span className="text-[10px] text-red-600 dark:text-red-300">High concentration risk detected (>20%)</span>
                    </div>
               )}
          </Card>

      </div>
    </Layout>
  );
};

export default AllocationAnalysis;
