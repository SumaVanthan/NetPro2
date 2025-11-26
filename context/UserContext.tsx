
import React, { createContext, useContext, useState } from 'react';
import { HOLDINGS, POSITIONS, ORDERS, BEHAVIOR_PROFILE } from '../constants';
import { UserData, BehaviorProfile } from '../types';

interface UserContextType {
  currentUser: UserData;
  switchUser: (userId: string) => void;
  availableUsers: { id: string; name: string; avatarInitials: string }[];
}

const JOHN_DOE_DATA: UserData = {
    profile: { id: 'u1', name: 'John Doe', avatarInitials: 'JD', kycStatus: true, clientId: 'SHR8821' },
    holdings: HOLDINGS,
    positions: POSITIONS,
    orders: ORDERS,
    behavior: BEHAVIOR_PROFILE
};

const SARAH_PARKER_DATA: UserData = {
    profile: { id: 'u2', name: 'Sarah Parker', avatarInitials: 'SP', kycStatus: true, clientId: 'SHR9902' },
    holdings: [],
    positions: [],
    orders: [],
    behavior: null
};

// Positive Behavior Profile for David
const DAVID_BEHAVIOR_PROFILE: BehaviorProfile = {
    score: 92,
    riskLevel: 'DISCIPLINED',
    metrics: {
        slUsagePercent: 98,
        winStreak: 12,
        tradesLastHour: 1,
        avgLossRecovTime: 'N/A',
        exposurePercent: 25
    },
    activeAlerts: [
        {
            id: 'd1',
            type: 'DISCIPLINE',
            severity: 'POSITIVE',
            message: 'Smart Risk Management',
            suggestion: 'You consistently set stop-loss and avoid revenge trading.',
            timestamp: 'Ongoing'
        },
        {
            id: 'd2',
            type: 'STRATEGY',
            severity: 'POSITIVE',
            message: 'Capital Protected',
            suggestion: 'Your losses are small and controlled, allowing long-term compounding.',
            timestamp: 'Ongoing'
        },
        {
            id: 'd3',
            type: 'PATIENCE',
            severity: 'POSITIVE',
            message: 'Low Emotional Volatility',
            suggestion: 'Your trade timing and sizing indicates high discipline.',
            timestamp: 'Ongoing'
        }
    ]
};

const DAVID_MORGAN_DATA: UserData = {
    profile: { id: 'u3', name: 'David Morgan', avatarInitials: 'DM', kycStatus: true, clientId: 'SHR7743' },
    holdings: [
        { symbol: 'TCS', qty: 200, avgPrice: 3800.00, ltp: 4120.10, invested: 760000, current: 824020, pnl: 64020, pnlPercent: 8.42 },
        { symbol: 'HDFCBANK', qty: 500, avgPrice: 1420.00, ltp: 1450.60, invested: 710000, current: 725300, pnl: 15300, pnlPercent: 2.15 }
    ],
    positions: [],
    orders: [
        { id: 'ORD201', symbol: 'TCS', type: 'BUY', product: 'CNC', qty: 50, price: 4050.00, status: 'EXECUTED', time: 'Yesterday' }
    ],
    behavior: DAVID_BEHAVIOR_PROFILE
};

const USERS = {
    'u1': JOHN_DOE_DATA,
    'u2': SARAH_PARKER_DATA,
    'u3': DAVID_MORGAN_DATA
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState<string>('u1');

  const switchUser = (userId: string) => {
      if (USERS[userId as keyof typeof USERS]) {
          setCurrentUserId(userId);
      }
  };

  const currentUser = USERS[currentUserId as keyof typeof USERS];
  
  const availableUsers = Object.values(USERS).map(u => ({
      id: u.profile.id,
      name: u.profile.name,
      avatarInitials: u.profile.avatarInitials
  }));

  return (
    <UserContext.Provider value={{ currentUser, switchUser, availableUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
