import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, Briefcase, PieChart, User, ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  title?: string;
  showBack?: boolean;
  showBackCustom?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, hideNav = false, title, showBack = false, showBackCustom }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: TrendingUp, label: 'Watchlist', path: '/watchlist' },
    { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
    { icon: PieChart, label: 'Insights', path: '/insights' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleBack = () => {
    if (showBackCustom) {
      showBackCustom();
      return;
    }
    // Check if there is a history to go back to, otherwise default to dashboard
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-shriram-bg text-gray-900 dark:text-white font-sans flex justify-center transition-colors duration-300">
      <div className="w-full max-w-md bg-gray-50 dark:bg-shriram-bg relative shadow-2xl min-h-screen flex flex-col">
        
        {/* Top Bar */}
        {title && (
          <header className="sticky top-0 z-50 bg-gray-50/80 dark:bg-shriram-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showBack && (
                <button 
                  onClick={handleBack} 
                  className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full active:bg-gray-200 dark:active:bg-white/10 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h1>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto no-scrollbar ${!hideNav ? 'pb-20' : ''} ${title ? '' : 'pt-0'}`}>
          {children}
        </main>

        {/* Bottom Navigation */}
        {!hideNav && (
          <nav className="fixed bottom-0 w-full max-w-md bg-white/90 dark:bg-shriram-surface/90 backdrop-blur-lg border-t border-gray-200 dark:border-white/5 pb-safe pt-1 z-50">
            <div className="flex justify-around items-center h-16">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${
                      active ? 'text-shriram-yellow' : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    <item.icon size={22} strokeWidth={active ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                    {active && <div className="w-1 h-1 rounded-full bg-shriram-yellow absolute bottom-1" />}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Layout;
