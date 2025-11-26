
import React from 'react';
import Layout from '../components/Layout';
import { ShieldAlert, BrainCircuit, Activity, Clock, Ban, PauseOctagon, UserCheck, Award, Star } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const BehaviorScore: React.FC = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  // Redirect if no behavior profile (e.g. Sarah)
  if (!currentUser.behavior) {
      return (
        <Layout title="Capital Safeguard" showBack>
            <div className="flex flex-col items-center justify-center h-[60vh] px-6 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <BrainCircuit size={40} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Trading Data Yet</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Start trading to unlock behavioral insights and psychology scores.
                </p>
                <button onClick={() => navigate('/dashboard')} className="mt-6 px-6 py-3 bg-shriram-yellow text-black font-bold rounded-xl">
                    Go to Dashboard
                </button>
            </div>
        </Layout>
      );
  }

  const { score, riskLevel, activeAlerts, metrics } = currentUser.behavior;

  // Determine score color and theme
  let scoreColor = 'text-green-600 dark:text-green-500';
  let strokeColor = 'stroke-green-500';
  let bgGlow = 'bg-green-500';
  let riskText = 'DISCIPLINED TRADER';
  let isPositive = true;

  if (score < 60) { 
      scoreColor = 'text-red-600 dark:text-red-500'; 
      strokeColor = 'stroke-red-500'; 
      bgGlow = 'bg-red-500';
      riskText = 'HIGH RISK DETECTED';
      isPositive = false;
  }
  else if (score < 80) { 
      scoreColor = 'text-yellow-600 dark:text-yellow-500'; 
      strokeColor = 'stroke-yellow-500'; 
      bgGlow = 'bg-yellow-500';
      riskText = 'MODERATE RISK';
      isPositive = false;
  } else {
      // > 80 (e.g. David Morgan)
      riskText = 'DISCIPLINED TRADER';
  }

  // Circle geometry constants for 160x160 viewBox
  const RADIUS = 70;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  return (
    <Layout title={isPositive ? "Trading Discipline" : "Capital Safeguard"} showBack>
      <div className="pb-10">
        
        {/* Score Section */}
        <div className="flex flex-col items-center justify-center py-8 bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-white/5 relative overflow-hidden transition-colors">
            {/* Background glow */}
            <div className={`absolute w-64 h-64 rounded-full blur-3xl opacity-10 ${bgGlow}`}></div>
            
            <div className="relative w-40 h-40 flex items-center justify-center z-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200 dark:text-gray-800" />
                    <circle 
                        cx="80" cy="80" r="70" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        fill="transparent" 
                        className={`${strokeColor} transition-all duration-1000 ease-out`}
                        strokeDasharray={CIRCUMFERENCE} 
                        strokeDashoffset={CIRCUMFERENCE - (CIRCUMFERENCE * score) / 100} 
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className={`text-4xl font-bold font-mono ${scoreColor}`}>{score}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Behavior Score</span>
                </div>
            </div>

            <div className="mt-6 text-center z-10">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${isPositive ? 'bg-green-100 dark:bg-green-500/20 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400' : score < 60 ? 'bg-red-100 dark:bg-red-500/20 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-500/20 border-yellow-200 dark:border-yellow-500/30 text-yellow-700 dark:text-yellow-400'}`}>
                    {isPositive ? <Award size={14} /> : <BrainCircuit size={14} />}
                    <span className="text-xs font-bold uppercase">{riskText}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 max-w-[250px] mx-auto leading-relaxed">
                   {isPositive 
                        ? "Your trading pattern shows patience and controlled decision-making. Keep it up!"
                        : "Your trading discipline needs attention. Recent patterns suggest emotional decision making."
                   }
                </p>
            </div>
        </div>

        {/* Active Alerts (Positive or Negative) */}
        {activeAlerts.length > 0 && (
            <div className="px-4 mt-6">
                <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {isPositive ? <Star size={16} className="text-green-600 dark:text-green-500" /> : <ShieldAlert size={16} className="text-red-600 dark:text-red-500" />} 
                    {isPositive ? "Behavior Insights" : "Critical Alerts"}
                </h3>
                <div className="space-y-3">
                    {activeAlerts.map(alert => (
                        <div 
                            key={alert.id} 
                            className={`p-4 rounded-xl relative overflow-hidden border ${
                                alert.severity === 'POSITIVE' 
                                ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30' 
                                : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30'
                            }`}
                        >
                            <div className="flex gap-3 items-start relative z-10">
                                <div className={`p-2 rounded-lg mt-1 ${
                                    alert.severity === 'POSITIVE' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                                }`}>
                                    {alert.severity === 'POSITIVE' && <Award size={18} />}
                                    {alert.type === 'REVENGE' && <Activity size={18} />}
                                    {alert.type === 'NO_SL' && <Ban size={18} />}
                                    {alert.type === 'OVERTRADING' && <Clock size={18} />}
                                </div>
                                <div>
                                    <div className="flex justify-between items-start w-full">
                                        <h4 className={`text-sm font-bold ${alert.severity === 'POSITIVE' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                                            {alert.message}
                                        </h4>
                                        <span className="text-[9px] text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded">{alert.timestamp}</span>
                                    </div>
                                    <p className={`text-xs mt-1 leading-relaxed ${alert.severity === 'POSITIVE' ? 'text-green-700/80 dark:text-green-300/80' : 'text-red-700/80 dark:text-red-300/80'}`}>
                                        {alert.suggestion}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Behavior Metrics Grid */}
        <div className="px-4 mt-6">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Psychology Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-shriram-surface p-3 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm">
                    <div className="text-[10px] text-gray-500 mb-1">Stop-Loss Usage</div>
                    <div className={`text-xl font-bold ${metrics.slUsagePercent > 90 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {metrics.slUsagePercent}%
                    </div>
                    <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 mt-2 rounded-full overflow-hidden">
                        <div className={`h-full ${metrics.slUsagePercent > 90 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${metrics.slUsagePercent}%` }}></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-shriram-surface p-3 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm">
                    <div className="text-[10px] text-gray-500 mb-1">Trades (Last Hour)</div>
                    <div className={`text-xl font-bold ${metrics.tradesLastHour < 5 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                        {metrics.tradesLastHour}
                    </div>
                    <div className="text-[9px] text-gray-500 mt-1">Baseline: 6 trades</div>
                </div>
                <div className="bg-white dark:bg-shriram-surface p-3 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm">
                    <div className="text-[10px] text-gray-500 mb-1">Win Streak</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{metrics.winStreak}</div>
                    <div className={`text-[9px] mt-1 ${metrics.winStreak > 5 && !isPositive ? 'text-yellow-600 dark:text-yellow-500' : 'text-green-600 dark:text-green-500'}`}>
                        {metrics.winStreak > 5 && !isPositive ? "High Risk of reckless bet" : "Consistent Performance"}
                    </div>
                </div>
                <div className="bg-white dark:bg-shriram-surface p-3 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm">
                    <div className="text-[10px] text-gray-500 mb-1">Avg. Loss Recovery</div>
                    <div className={`text-xl font-bold ${metrics.avgLossRecovTime === 'N/A' ? 'text-gray-400' : 'text-red-600 dark:text-red-400'}`}>
                        {metrics.avgLossRecovTime}
                    </div>
                    <div className="text-[9px] text-gray-500 mt-1">
                        {metrics.avgLossRecovTime === 'N/A' ? 'No losses recently' : 'Too fast (Revenge)'}
                    </div>
                </div>
            </div>
        </div>

        {/* Cool Down Actions or Positive Reinforcement */}
        <div className="px-4 mt-6">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{isPositive ? "Keep Growing" : "Recommended Actions"}</h3>
            
            {isPositive ? (
                 <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 p-4 rounded-xl flex items-center gap-4 mb-3">
                    <div className="p-3 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full">
                        <Award size={20} />
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">You’re trading like a pro.</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Your discipline is paying off. Stick to your rules.</div>
                    </div>
                </div>
            ) : (
                <>
                    <button className="w-full bg-white dark:bg-[#1A1A1A] border border-shriram-yellow/20 p-4 rounded-xl flex items-center gap-4 mb-3 hover:bg-gray-50 dark:hover:bg-[#222] transition-colors group shadow-sm">
                        <div className="p-3 bg-shriram-yellow/10 text-shriram-yellowDim dark:text-shriram-yellow rounded-full group-hover:bg-shriram-yellow group-hover:text-black transition-colors">
                            <PauseOctagon size={20} />
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-bold text-gray-900 dark:text-white">Take a 15 min Cool Down</div>
                            <div className="text-xs text-gray-500">Lock F&O orders temporarily to reset.</div>
                        </div>
                    </button>
                    <button className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 p-4 rounded-xl flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-[#222] transition-colors group shadow-sm">
                        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
                            <UserCheck size={20} />
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-bold text-gray-900 dark:text-white">Review Trading Rules</div>
                            <div className="text-xs text-gray-500">Re-read your defined max loss limits.</div>
                        </div>
                    </button>
                </>
            )}
        </div>
      </div>
    </Layout>
  );
};

export default BehaviorScore;
