import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { STOCKS, SMART_LISTS, THEMATIC_LISTS, SENTIMENT_INSIGHTS } from '../constants';
import { 
    Search, SlidersHorizontal, Plus, X, Trash2, FolderPlus, 
    MoreVertical, Bell, Zap, TrendingUp, BarChart2, LayoutGrid, 
    List, Layers, ArrowUpRight, ArrowDownLeft, Edit3, Sparkles,
    Share2, Activity, BookOpen, PlayCircle, GripVertical, Filter, SortAsc, Hexagon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Stock, WatchlistGroup, ViewMode, Note } from '../types';
import Sparkline from '../components/Sparkline';

// --- Helper Components ---

const SentimentBar = ({ score, type }: { score: number, type: 'bullish' | 'bearish' | 'neutral' }) => {
    let color = 'bg-gray-500';
    if (type === 'bullish') color = 'bg-green-500';
    else if (type === 'bearish') color = 'bg-red-500';
    else color = 'bg-yellow-500';

    return (
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${score}%` }}></div>
        </div>
    );
};

const Watchlist: React.FC = () => {
  const navigate = useNavigate();
  
  // --- States ---
  const [activeCategory, setActiveCategory] = useState<'MY_LISTS' | 'SMART' | 'THEMES'>('MY_LISTS');
  const [groups, setGroups] = useState<WatchlistGroup[]>([
    { id: 'default', name: 'My Watchlist', stocks: STOCKS, type: 'CUSTOM' },
    { id: 'nifty', name: 'Nifty 50', stocks: STOCKS.slice(0, 3), type: 'CUSTOM' },
    { id: 'banks', name: 'Banking', stocks: [STOCKS[2]], type: 'CUSTOM' },
  ]);
  const [activeGroupId, setActiveGroupId] = useState<string>('default');
  
  // Smart Lists & Themes integration
  const currentGroupList = activeCategory === 'MY_LISTS' ? groups : activeCategory === 'SMART' ? SMART_LISTS : THEMATIC_LISTS;
  
  // Synchronous Category Switcher to prevent content flash
  const switchCategory = (category: 'MY_LISTS' | 'SMART' | 'THEMES') => {
      setActiveCategory(category);
      const targetList = category === 'MY_LISTS' ? groups : category === 'SMART' ? SMART_LISTS : THEMATIC_LISTS;
      if (targetList.length > 0) {
          setActiveGroupId(targetList[0].id);
      }
  };

  const activeGroup = currentGroupList.find(g => g.id === activeGroupId) || currentGroupList[0] || groups[0];

  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [scenarioBeta, setScenarioBeta] = useState(0); // -5 to +5 range for Nifty simulation
  const [expandedStock, setExpandedStock] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  
  // Sorting & Filtering
  const [sortBy, setSortBy] = useState<'DEFAULT' | 'CHANGE' | 'LTP' | 'QUANT'>('DEFAULT');
  const [isReordering, setIsReordering] = useState(false);

  // --- Search Logic ---
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = STOCKS.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // --- Scenario Simulation Logic ---
  const getSimulatedPrice = (stock: Stock) => {
      if (scenarioBeta === 0) return { price: stock.ltp, change: stock.change, percent: stock.percentChange };
      
      // Mock Beta: High Beta for some stocks
      const beta = ['ADANIENT', 'TATAMOTORS', 'DLF'].includes(stock.symbol) ? 1.5 : 
                   ['HINDUNILVR', 'ITC'].includes(stock.symbol) ? 0.6 : 1.0;
      
      const simulatedImpact = scenarioBeta * beta; // e.g., Nifty +1% * 1.5 Beta = Stock +1.5%
      const newPercent = stock.percentChange + simulatedImpact;
      const newChange = stock.ltp * (newPercent / 100); // Simplified calc
      const newPrice = stock.prevClose + newChange; // Approx

      return { price: newPrice, change: newChange, percent: newPercent };
  };

  // --- Actions ---
  const handleAddStock = (stock: Stock) => {
    if (activeCategory !== 'MY_LISTS') {
        alert("You can only add stocks to your custom watchlists.");
        return;
    }
    if (!activeGroup.stocks.find(s => s.symbol === stock.symbol)) {
        const updatedGroups = groups.map(g => {
            if (g.id === activeGroupId) {
                return { ...g, stocks: [stock, ...g.stocks] };
            }
            return g;
        });
        setGroups(updatedGroups);
    }
    setSearchQuery('');
  };

  const toggleNote = (symbol: string) => {
      const existing = notes.find(n => n.stockSymbol === symbol);
      if(!existing) {
          const noteText = prompt("Add a note for " + symbol);
          if(noteText) {
              setNotes([...notes, { id: Date.now().toString(), stockSymbol: symbol, text: noteText, createdAt: new Date().toISOString() }]);
          }
      } else {
          alert(`Note: ${existing.text}`);
      }
  };

  const handleRemoveStock = (symbol: string) => {
      const updatedGroups = groups.map(g => {
          if (g.id === activeGroupId) {
              return { ...g, stocks: g.stocks.filter(s => s.symbol !== symbol) };
          }
          return g;
      });
      setGroups(updatedGroups);
  };

  // --- Sorting Logic ---
  const getProcessedStocks = () => {
      let stocks = [...activeGroup.stocks];
      
      if (sortBy === 'CHANGE') {
          stocks.sort((a, b) => b.percentChange - a.percentChange);
      } else if (sortBy === 'LTP') {
          stocks.sort((a, b) => b.ltp - a.ltp);
      } else if (sortBy === 'QUANT') {
          stocks.sort((a, b) => {
              const qA = SENTIMENT_INSIGHTS.stocks[a.symbol as keyof typeof SENTIMENT_INSIGHTS.stocks]?.quant?.score || 0;
              const qB = SENTIMENT_INSIGHTS.stocks[b.symbol as keyof typeof SENTIMENT_INSIGHTS.stocks]?.quant?.score || 0;
              return qB - qA;
          });
      }
      
      return stocks;
  };

  const processedStocks = getProcessedStocks();

  // --- Sub-Components ---

  const IntelligentTile: React.FC<{ stock: Stock }> = ({ stock }) => {
      const isExpanded = expandedStock === stock.symbol;
      const sim = getSimulatedPrice(stock);
      const sentiment = SENTIMENT_INSIGHTS.stocks[stock.symbol as keyof typeof SENTIMENT_INSIGHTS.stocks];
      const isPositive = sim.percent >= 0;
      const quant = sentiment?.quant;

      return (
          <div className={`bg-white dark:bg-shriram-surface border border-gray-200 dark:border-white/5 transition-all duration-300 overflow-hidden ${isExpanded ? 'rounded-2xl my-3 shadow-xl dark:shadow-2xl border-shriram-yellow/50 dark:border-shriram-yellow/30 bg-gray-50 dark:bg-[#1A1A1A]' : 'rounded-xl mb-2 active:scale-[0.99]'}`}>
              {/* Header Row */}
              <div 
                className="p-4 flex justify-between items-center cursor-pointer relative"
                onClick={() => !isReordering && setExpandedStock(isExpanded ? null : stock.symbol)}
              >
                  <div className="flex items-center gap-3">
                      {isReordering && <GripVertical className="text-gray-400" size={20} />}
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 flex-shrink-0">
                          {stock.symbol.substring(0, 1)}
                      </div>
                      <div>
                          <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm text-gray-900 dark:text-white">{stock.symbol}</h3>
                              {notes.find(n => n.stockSymbol === stock.symbol) && <Edit3 size={10} className="text-shriram-yellow" />}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                             <span>{stock.exchange}</span>
                          </div>
                      </div>
                  </div>

                  {/* Sparkline (Simulated visual) */}
                  {!isExpanded && !isReordering && (
                      <div className="w-16 h-8 opacity-50 hidden sm:block">
                          <Sparkline data={isPositive ? [10, 12, 11, 14, 13, 16] : [16, 14, 15, 12, 13, 10]} color={isPositive ? '#22C55E' : '#EF4444'} width={64} height={32} />
                      </div>
                  )}

                  <div className="text-right">
                      <div className={`font-mono text-sm font-bold ${isPositive ? 'text-trade-up' : 'text-trade-down'} transition-all duration-500`}>
                          {sim.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {isPositive ? '+' : ''}{sim.change.toFixed(2)} ({sim.percent.toFixed(2)}%)
                      </div>
                  </div>
                  
                  {/* Scenario Indicator */}
                  {scenarioBeta !== 0 && (
                      <div className="absolute top-0 right-0 bg-shriram-yellow/20 text-shriram-yellow text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                          SIMULATED
                      </div>
                  )}
              </div>

              {/* Expanded Insights Panel */}
              {isExpanded && (
                  <div className="bg-gray-100 dark:bg-black/20 border-t border-gray-200 dark:border-white/5 p-4 animate-in slide-in-from-top-2">
                      {/* Quick Actions */}
                      <div className="flex flex-col gap-2 mb-4">
                          <div className="grid grid-cols-2 gap-2">
                              <button className="bg-green-500/20 text-green-600 dark:text-green-400 py-3 rounded-lg text-xs font-bold hover:bg-green-500/30 transition-colors">BUY</button>
                              <button className="bg-red-500/20 text-red-600 dark:text-red-400 py-3 rounded-lg text-xs font-bold hover:bg-red-500/30 transition-colors">SELL</button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                              <button 
                                onClick={() => navigate(`/stock/${stock.symbol}`)} 
                                className="bg-white dark:bg-white/10 text-gray-800 dark:text-white py-2 rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/20 transition-colors border border-gray-200 dark:border-transparent shadow-sm"
                              >
                                  Stock Details
                              </button>
                              <button 
                                onClick={() => navigate('/insights', { state: { symbol: stock.symbol } })} 
                                className="bg-shriram-yellow/20 text-shriram-yellowDim dark:text-shriram-yellow py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-shriram-yellow/30 transition-colors"
                              >
                                  <Sparkles size={12} /> Insights
                              </button>
                              {activeCategory === 'MY_LISTS' ? (
                                 <button onClick={() => handleRemoveStock(stock.symbol)} className="bg-red-500/10 text-red-500 dark:text-red-400 py-2 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors">Remove</button>
                              ) : (
                                 <button onClick={() => toggleNote(stock.symbol)} className="bg-white dark:bg-white/10 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/20 transition-colors border border-gray-200 dark:border-transparent shadow-sm">Note</button>
                              )}
                          </div>
                      </div>

                      {/* Mini Stats */}
                      <div className="grid grid-cols-3 gap-3 text-center mb-4">
                          <div className="bg-white dark:bg-white/5 p-2 rounded-lg border border-gray-200 dark:border-transparent shadow-sm">
                              <div className="text-[9px] text-gray-500 uppercase">Volume</div>
                              <div className="text-xs font-bold text-gray-900 dark:text-white">{stock.volume}</div>
                              <div className="text-[9px] text-green-500 dark:text-green-400">+12% vs Avg</div>
                          </div>
                          <div className="bg-white dark:bg-white/5 p-2 rounded-lg border border-gray-200 dark:border-transparent shadow-sm">
                              <div className="text-[9px] text-gray-500 uppercase">Quant Score</div>
                              <div className={`mt-1 text-xs font-bold ${quant && quant.score >= 60 ? 'text-green-500 dark:text-green-400' : 'text-yellow-500 dark:text-yellow-400'}`}>
                                {quant ? quant.score : 'N/A'}
                              </div>
                          </div>
                          <div className="bg-white dark:bg-white/5 p-2 rounded-lg border border-gray-200 dark:border-transparent shadow-sm">
                              <div className="text-[9px] text-gray-500 uppercase">Tech Rating</div>
                              <div className="text-xs font-bold text-shriram-yellowDim dark:text-shriram-yellow">Strong Buy</div>
                          </div>
                      </div>

                      {/* Peer Sync (Mini Comparison) */}
                      {sentiment && sentiment.peers && (
                          <div className="text-[10px]">
                              <div className="text-gray-500 mb-2 uppercase font-bold">Peer Performance</div>
                              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                  {sentiment.peers.map((p, i) => (
                                      <div key={i} className="bg-white dark:bg-white/5 px-3 py-1.5 rounded border border-gray-200 dark:border-white/5 whitespace-nowrap shadow-sm">
                                          <span className="text-gray-900 dark:text-white font-bold mr-2">{p.symbol}</span>
                                          <span className="text-green-500 dark:text-green-400">+{p.return1y}%</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              )}
          </div>
      );
  };

  const HeatmapBlock: React.FC<{ stock: Stock }> = ({ stock }) => {
      const sim = getSimulatedPrice(stock);
      const change = sim.percent;
      // Dynamic styling based on change
      let bgClass = 'bg-gray-500 dark:bg-gray-800';
      if (change > 2) bgClass = 'bg-green-500';
      else if (change > 0) bgClass = 'bg-green-400 dark:bg-green-600/60';
      else if (change > -1) bgClass = 'bg-red-400 dark:bg-red-600/60';
      else bgClass = 'bg-red-500 dark:bg-red-600';

      return (
          <div 
            onClick={() => setExpandedStock(stock.symbol)}
            className={`${bgClass} p-2 rounded-lg flex flex-col justify-between min-h-[80px] cursor-pointer hover:opacity-90 transition-all active:scale-95`}
          >
              <div className="text-[10px] font-bold text-white/90 truncate">{stock.symbol}</div>
              <div>
                  <div className="text-xs font-bold text-white">{sim.price.toFixed(0)}</div>
                  <div className="text-[9px] text-white/80">{change > 0 ? '+' : ''}{change.toFixed(2)}%</div>
              </div>
          </div>
      );
  };

  const ClusterGroup: React.FC<{ title: string, stocks: Stock[] }> = ({ title, stocks }) => (
      <div className="mb-4">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 pl-1">{title}</h3>
          <div className="space-y-1">
              {stocks.map(stock => <IntelligentTile key={stock.symbol} stock={stock} />)}
          </div>
      </div>
  );

  return (
    <Layout title="Watchlist" hideNav={false}>
        
      {/* --- 1. Smart Command Bar & Navigation (Sticky) --- */}
      <div className="sticky top-0 bg-gray-50/95 dark:bg-shriram-bg/95 backdrop-blur-md z-30 pb-2 border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="px-4 py-2 relative">
             <div className="relative group z-50">
                <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-4 h-4 group-focus-within:text-shriram-yellow transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search, Add, Alert, or Deep Dive..." 
                    className="w-full bg-white dark:bg-shriram-surface rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 border border-gray-200 dark:border-white/5 focus:outline-none focus:border-shriram-yellow/50 focus:shadow-[0_0_15px_rgba(249,200,14,0.1)] transition-all shadow-sm"
                />
                {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-gray-400"><X size={16}/></button>}
                
                {/* Instant Search Results */}
                {searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto animate-in zoom-in-95">
                        {searchResults.length > 0 ? (
                            searchResults.map(stock => (
                                <div key={stock.symbol} className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 flex justify-between items-center border-b border-gray-100 dark:border-white/5 last:border-0">
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">{stock.symbol}</div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{stock.name}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleAddStock(stock)} className="text-[10px] font-bold bg-shriram-yellow/10 text-shriram-yellowDim dark:text-shriram-yellow px-2 py-1 rounded hover:bg-shriram-yellow hover:text-black transition-colors">+ WATCH</button>
                                        <button onClick={() => navigate('/insights', { state: { symbol: stock.symbol } })} className="text-[10px] font-bold bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">INSIGHTS</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500 text-xs">No stocks found</div>
                        )}
                    </div>
                )}
             </div>
        </div>

        {/* --- 2. Multi-Level Navigation --- */}
        <div className="flex items-center justify-between px-4 mt-1">
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
                <button onClick={() => switchCategory('MY_LISTS')} className={`text-xs font-bold pb-2 border-b-2 transition-colors whitespace-nowrap ${activeCategory === 'MY_LISTS' ? 'text-gray-900 dark:text-white border-shriram-yellow' : 'text-gray-500 border-transparent'}`}>My Lists</button>
                <button onClick={() => switchCategory('SMART')} className={`text-xs font-bold pb-2 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${activeCategory === 'SMART' ? 'text-shriram-yellowDim dark:text-shriram-yellow border-shriram-yellowDim dark:border-shriram-yellow' : 'text-gray-500 border-transparent'}`}><Sparkles size={10}/> Smart Lists</button>
                <button onClick={() => switchCategory('THEMES')} className={`text-xs font-bold pb-2 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${activeCategory === 'THEMES' ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400' : 'text-gray-500 border-transparent'}`}><Layers size={10}/> Themes</button>
            </div>
            <div className="flex bg-gray-200 dark:bg-white/5 rounded-lg p-0.5">
                <button onClick={() => setViewMode('LIST')} className={`p-1.5 rounded ${viewMode === 'LIST' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`} title="List View"><List size={14}/></button>
                <button onClick={() => setViewMode('CLUSTER')} className={`p-1.5 rounded ${viewMode === 'CLUSTER' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`} title="Cluster View"><LayoutGrid size={14}/></button>
                <button onClick={() => setViewMode('HEATMAP')} className={`p-1.5 rounded ${viewMode === 'HEATMAP' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`} title="Heatmap"><Activity size={14}/></button>
            </div>
        </div>
        
        {/* Sub-List Tabs */}
        <div className="flex items-center px-4 gap-3 mt-3 overflow-x-auto no-scrollbar pb-1">
            {currentGroupList.map(group => (
                <button 
                    key={group.id}
                    onClick={() => setActiveGroupId(group.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap flex-shrink-0 ${
                        activeGroupId === group.id ? 'bg-white text-black border-gray-300 dark:border-white shadow-md' : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30'
                    }`}
                >
                    {group.icon && <group.icon size={10} />} {group.name}
                </button>
            ))}
             {activeCategory === 'MY_LISTS' && (
                 <button className="w-7 h-7 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-white/5 hover:bg-gray-300 dark:hover:bg-white/10 flex-shrink-0"><Plus size={14}/></button>
             )}
        </div>

        {/* Sort & Reorder Controls */}
        {viewMode === 'LIST' && activeGroup.stocks.length > 0 && (
            <div className="px-4 mt-3 flex justify-between items-center">
                <div className="flex gap-2">
                    <button 
                        onClick={() => setSortBy(sortBy === 'DEFAULT' ? 'CHANGE' : sortBy === 'CHANGE' ? 'QUANT' : 'DEFAULT')} 
                        className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-white/5 px-2 py-1 rounded"
                    >
                        <SortAsc size={12} /> 
                        Sort: {sortBy === 'DEFAULT' ? 'Default' : sortBy === 'CHANGE' ? '% Change' : sortBy === 'QUANT' ? 'Quant Score' : 'Default'}
                    </button>
                </div>
                {activeCategory === 'MY_LISTS' && (
                    <button 
                        onClick={() => setIsReordering(!isReordering)}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${isReordering ? 'bg-shriram-yellow text-black' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        {isReordering ? 'Done' : 'Organize'}
                    </button>
                )}
            </div>
        )}
      </div>

      {/* --- 3. Scenario Mode (The "What If" Engine) --- */}
      <div className="px-4 py-4 bg-gray-100 dark:bg-gradient-to-b dark:from-[#151515] dark:to-[#0D0D0D] border-b border-gray-200 dark:border-white/5 relative z-0 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                  <PlayCircle size={12} className="text-shriram-yellow" /> Scenario Mode
              </div>
              <div className="text-xs font-mono font-bold text-gray-900 dark:text-white">
                  NIFTY {scenarioBeta > 0 ? '+' : ''}{scenarioBeta}%
              </div>
          </div>
          <input 
            type="range" 
            min="-5" 
            max="5" 
            step="0.5" 
            value={scenarioBeta}
            onChange={(e) => setScenarioBeta(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-300 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-shriram-yellow"
          />
          <div className="flex justify-between text-[8px] text-gray-500 dark:text-gray-600 mt-1 font-bold">
              <span>CRASH (-5%)</span>
              <span>NEUTRAL</span>
              <span>RALLY (+5%)</span>
          </div>
      </div>

      {/* --- 4. Main Content Area --- */}
      <div className="px-4 pb-6 min-h-[400px] pt-2">
          {activeGroup.stocks.length === 0 ? (
              <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                  <FolderPlus size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">This list is empty.</p>
                  <p className="text-xs mt-1">Use the search bar to add stocks.</p>
              </div>
          ) : (
              <>
                {viewMode === 'LIST' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        {processedStocks.map(stock => (
                            <IntelligentTile key={stock.symbol} stock={stock} />
                        ))}
                    </div>
                )}

                {viewMode === 'HEATMAP' && (
                    <div className="grid grid-cols-3 gap-2 animate-in zoom-in-95 duration-300">
                        {processedStocks.map(stock => (
                            <HeatmapBlock key={stock.symbol} stock={stock} />
                        ))}
                    </div>
                )}

                {viewMode === 'CLUSTER' && (
                    <div className="animate-in fade-in">
                        {/* Group by Sentiment for Demo */}
                        <ClusterGroup 
                            title="Bullish Momentum" 
                            stocks={processedStocks.filter(s => {
                                const sent = SENTIMENT_INSIGHTS.stocks[s.symbol as keyof typeof SENTIMENT_INSIGHTS.stocks];
                                return sent && sent.sentiment === 'Bullish';
                            })}
                        />
                        <ClusterGroup 
                            title="Bearish / Neutral" 
                            stocks={processedStocks.filter(s => {
                                const sent = SENTIMENT_INSIGHTS.stocks[s.symbol as keyof typeof SENTIMENT_INSIGHTS.stocks];
                                return !sent || sent.sentiment !== 'Bullish';
                            })}
                        />
                    </div>
                )}
              </>
          )}
      </div>

    </Layout>
  );
};

export default Watchlist;
