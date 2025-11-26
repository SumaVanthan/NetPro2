
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { User, Settings, Shield, Moon, LogOut, ChevronRight, CreditCard, FileText, Sun, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, switchUser, availableUsers } = useUser();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    navigate('/');
  };

  const MenuItem = ({ icon: Icon, label, sub, onClick }: any) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-white/5 first:rounded-t-xl last:rounded-b-xl last:border-0 hover:bg-gray-50 dark:hover:bg-[#222] transition-colors">
       <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 dark:bg-black/40 rounded-lg text-gray-500 dark:text-gray-400">
            <Icon size={18} />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{label}</div>
            {sub && <div className="text-[10px] text-gray-500">{sub}</div>}
          </div>
       </div>
       <ChevronRight size={16} className="text-gray-400 dark:text-gray-600" />
    </button>
  );

  return (
    <Layout title="Account">
      <div className="px-4 pt-4 pb-8 relative">
         
         {/* User Switcher */}
         <div className="mb-6 overflow-x-auto no-scrollbar">
             <div className="flex gap-3">
                 {availableUsers.map(user => (
                     <button 
                        key={user.id}
                        onClick={() => switchUser(user.id)}
                        className={`flex items-center gap-2 p-2 pr-4 rounded-full border transition-all ${currentUser.profile.id === user.id ? 'bg-shriram-yellow text-black border-shriram-yellow shadow-md' : 'bg-white dark:bg-[#1A1A1A] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10'}`}
                     >
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentUser.profile.id === user.id ? 'bg-black text-shriram-yellow' : 'bg-gray-200 dark:bg-white/10'}`}>
                             {user.avatarInitials}
                         </div>
                         <div className="text-left">
                             <div className="text-xs font-bold whitespace-nowrap">{user.name}</div>
                         </div>
                     </button>
                 ))}
             </div>
         </div>

         {/* Profile Card */}
         <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-shriram-yellow flex items-center justify-center text-black font-bold text-xl shadow-md">
                {currentUser.profile.avatarInitials}
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{currentUser.profile.name}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Client ID: {currentUser.profile.clientId}</p>
                <span className="inline-block mt-1 text-[10px] bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-200 dark:border-transparent">KYC Verified</span>
            </div>
         </div>

         <div className="space-y-6">
            {/* Section 1 */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Account & Funds</h3>
                <div className="rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                    <MenuItem icon={CreditCard} label="Funds" sub="Add or withdraw money" />
                    <MenuItem icon={FileText} label="Reports" sub="P&L, Tax, Ledger" />
                    <MenuItem icon={User} label="Personal Details" />
                </div>
            </div>

            {/* Section 2 */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">App Settings</h3>
                <div className="rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                    <MenuItem icon={Shield} label="Security" sub="2FA, Fingerprint" />
                    <MenuItem icon={Settings} label="Preferences" sub="Chart type, Notifications" />
                    
                    {/* Dark Mode Toggle */}
                    <div className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-[#222] transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-black/40 rounded-lg text-gray-500 dark:text-gray-400">
                                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</div>
                        </div>
                        <div 
                            className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${theme === 'dark' ? 'bg-shriram-yellow' : 'bg-gray-300'}`}
                            onClick={toggleTheme}
                        >
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${theme === 'dark' ? 'left-5' : 'left-0.5'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleLogout}
                className="w-full py-4 flex items-center justify-center gap-2 text-red-500 font-medium bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shadow-sm"
            >
                <LogOut size={18} /> Logout
            </button>
            
            <div className="text-center text-[10px] text-gray-500 dark:text-gray-600">
                Net Pro v4.2.0 (Build 4550) <br/>
                Shriram Insight Share Brokers Ltd.
            </div>
         </div>

         {/* Logout Confirmation Modal */}
         {showLogoutConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-xs rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-2xl text-center transform scale-100 animate-in zoom-in-95 duration-200">
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
                        <LogOut size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Logout?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to logout from your account?</p>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowLogoutConfirm(false)}
                            className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmLogout}
                            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-500/20 dark:shadow-red-900/20 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
         )}
      </div>
    </Layout>
  );
};

export default Profile;
