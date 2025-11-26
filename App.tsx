
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import Onboarding from './pages/Onboarding';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Watchlist from './pages/Watchlist';
import StockDetail from './pages/StockDetail';
import Portfolio from './pages/Portfolio';
import Funds from './pages/Funds';
import Insights from './pages/Insights';
import OptionChain from './pages/OptionChain';
import Profile from './pages/Profile';
import Baskets from './pages/Baskets';
import BasketDetail from './pages/BasketDetail';
import MTFDashboard from './pages/MTFDashboard';
import BehaviorScore from './pages/BehaviorScore';
import AllocationAnalysis from './pages/AllocationAnalysis';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/stock/:symbol" element={<StockDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/option-chain" element={<OptionChain />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/baskets" element={<Baskets />} />
            <Route path="/basket/:id" element={<BasketDetail />} />
            <Route path="/mtf-dashboard" element={<MTFDashboard />} />
            <Route path="/behavior" element={<BehaviorScore />} />
            <Route path="/allocation" element={<AllocationAnalysis />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
