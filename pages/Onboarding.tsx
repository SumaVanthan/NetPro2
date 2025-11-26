
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, TrendingUp, Zap } from 'lucide-react';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-shriram-bg flex flex-col items-center justify-between p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-shriram-yellow/10 to-transparent pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-shriram-yellow/20 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full flex flex-col items-center mt-20 z-10">
        <div className="w-16 h-16 bg-shriram-yellow rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(249,200,14,0.4)] mb-6">
           <TrendingUp className="text-black w-8 h-8" strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          Net Pro
          <span className="block text-sm font-medium text-gray-400 mt-1">by Shriram Insight</span>
        </h1>
      </div>

      <div className="w-full space-y-8 z-10">
        <div className="space-y-6">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-[#1A1A1A] border border-white/10 rounded-lg">
                    <Zap className="text-shriram-yellow w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-white font-medium">Lightning Fast Execution</h3>
                    <p className="text-sm text-gray-400">Trade in milliseconds with our advanced engine.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-2 bg-[#1A1A1A] border border-white/10 rounded-lg">
                    <ShieldCheck className="text-shriram-yellow w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-white font-medium">Bank-Grade Security</h3>
                    <p className="text-sm text-gray-400">2FA and biometric protection for your funds.</p>
                </div>
            </div>
        </div>

        <div className="space-y-3">
            <button 
                onClick={() => navigate('/signup')}
                className="w-full bg-shriram-yellow text-black font-bold py-4 rounded-xl text-lg hover:bg-shriram-yellowDim transition-colors shadow-lg shadow-shriram-yellow/20"
            >
                Open Demat Account
            </button>
            <button 
                onClick={() => navigate('/signup')} 
                className="w-full bg-[#1A1A1A] border border-white/20 text-white font-medium py-4 rounded-xl hover:bg-[#222] hover:border-white/30 transition-colors"
            >
                Login with SSO
            </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4">
        v4.2.0 • Market data is synthetic
      </div>
    </div>
  );
};

export default Onboarding;
