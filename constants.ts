
import { Stock, Index, Holding, Position, Order, NewsItem, Basket, BehaviorProfile, StockSentiment, MarketSentiment, WatchlistGroup } from './types';
import { TrendingUp, Zap, Shield, Activity, Flame, Cpu } from 'lucide-react';

export const INDICES: Index[] = [
  {
    name: 'NIFTY 50',
    value: 22450.30,
    change: 124.50,
    percentChange: 0.56,
    data: [22300, 22350, 22320, 22380, 22400, 22420, 22450]
  },
  {
    name: 'BANKNIFTY',
    value: 47890.10,
    change: -210.40,
    percentChange: -0.44,
    data: [48100, 48050, 48000, 47950, 47900, 47850, 47890]
  },
  {
    name: 'FINNIFTY',
    value: 21200.55,
    change: 45.10,
    percentChange: 0.21,
    data: [21150, 21180, 21160, 21190, 21210, 21200, 21200.55]
  },
  {
    name: 'SENSEX',
    value: 73850.20,
    change: 350.10,
    percentChange: 0.48,
    data: []
  },
  {
    name: 'NIFTY IT',
    value: 36500.00,
    change: -120.50,
    percentChange: -0.33,
    data: []
  }
];

export const STOCKS: Stock[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    ltp: 2980.45,
    change: 15.20,
    percentChange: 0.51,
    exchange: 'NSE',
    volume: '4.2M',
    low: 2950.00,
    high: 2995.00,
    open: 2960.00,
    prevClose: 2965.25,
    depth: {
        buy: [{price: 2980.40, qty: 500}, {price: 2980.35, qty: 1200}, {price: 2980.30, qty: 450}],
        sell: [{price: 2980.50, qty: 300}, {price: 2980.55, qty: 800}, {price: 2980.60, qty: 1500}]
    }
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Svcs',
    ltp: 4120.10,
    change: -25.50,
    percentChange: -0.62,
    exchange: 'NSE',
    volume: '1.1M',
    low: 4100.00,
    high: 4160.00,
    open: 4150.00,
    prevClose: 4145.60,
     depth: {
        buy: [{price: 4120.00, qty: 100}, {price: 4119.50, qty: 200}, {price: 4119.00, qty: 50}],
        sell: [{price: 4120.20, qty: 400}, {price: 4120.50, qty: 100}, {price: 4121.00, qty: 250}]
    }
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    ltp: 1450.60,
    change: 10.10,
    percentChange: 0.70,
    exchange: 'NSE',
    volume: '12.5M',
    low: 1435.00,
    high: 1460.00,
    open: 1440.00,
    prevClose: 1440.50,
     depth: {
        buy: [{price: 1450.50, qty: 5000}, {price: 1450.40, qty: 2000}, {price: 1450.00, qty: 10000}],
        sell: [{price: 1450.70, qty: 4000}, {price: 1450.80, qty: 1500}, {price: 1451.00, qty: 8000}]
    }
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    ltp: 1650.30,
    change: 5.40,
    percentChange: 0.33,
    exchange: 'NSE',
    volume: '3.8M',
    low: 1640.00,
    high: 1665.00,
    open: 1645.00,
    prevClose: 1644.90,
     depth: {
        buy: [{price: 1650.00, qty: 300}, {price: 1649.80, qty: 600}, {price: 1649.50, qty: 900}],
        sell: [{price: 1650.50, qty: 200}, {price: 1650.70, qty: 400}, {price: 1651.00, qty: 700}]
    }
  },
   {
    symbol: 'ADANIENT',
    name: 'Adani Enterprises',
    ltp: 3200.00,
    change: -45.00,
    percentChange: -1.39,
    exchange: 'NSE',
    volume: '2.1M',
    low: 3180.00,
    high: 3250.00,
    open: 3240.00,
    prevClose: 3245.00,
     depth: {
        buy: [{price: 3199.00, qty: 200}, {price: 3198.00, qty: 500}, {price: 3195.00, qty: 1000}],
        sell: [{price: 3200.50, qty: 100}, {price: 3201.00, qty: 300}, {price: 3202.00, qty: 600}]
    }
  },
  {
    symbol: 'TATASTEEL',
    name: 'Tata Steel Ltd',
    ltp: 152.40,
    change: 2.40,
    percentChange: 1.60,
    exchange: 'NSE',
    volume: '8.5M',
    low: 149.00,
    high: 153.00,
    open: 150.00,
    prevClose: 150.00,
     depth: {
        buy: [{price: 152.30, qty: 1500}, {price: 152.20, qty: 3000}, {price: 152.00, qty: 5000}],
        sell: [{price: 152.45, qty: 2000}, {price: 152.50, qty: 4000}, {price: 152.60, qty: 1200}]
    }
  }
];

export const SMART_LISTS: WatchlistGroup[] = [
    {
        id: 'smart-1',
        name: 'High Momentum',
        type: 'SMART',
        description: 'Stocks showing strong upward trend & volume',
        icon: Activity,
        stocks: [STOCKS[0], STOCKS[4]]
    },
    {
        id: 'smart-2',
        name: 'F&O Heat',
        type: 'SMART',
        description: 'Highest OI Buildup for May Series',
        icon: Flame,
        stocks: [STOCKS[2], STOCKS[5]]
    },
    {
        id: 'smart-3',
        name: 'Social Buzz',
        type: 'SMART',
        description: 'Most discussed on Twitter & News',
        icon: Zap,
        stocks: [STOCKS[0], STOCKS[1]]
    }
];

export const THEMATIC_LISTS: WatchlistGroup[] = [
    {
        id: 'theme-1',
        name: 'EV Revolution',
        type: 'THEME',
        description: 'Battery, Auto & Power stocks',
        icon: Zap,
        stocks: [STOCKS[5], STOCKS[0]]
    },
    {
        id: 'theme-2',
        name: 'PSU Rally',
        type: 'THEME',
        description: 'Public Sector Undertakings',
        icon: Shield,
        stocks: [STOCKS[5]]
    },
    {
        id: 'theme-3',
        name: 'AI Winners',
        type: 'THEME',
        description: 'IT Services & Tech Infra',
        icon: Cpu,
        stocks: [STOCKS[1], STOCKS[3]]
    }
];

export const HOLDINGS: Holding[] = [
  {
    symbol: 'RELIANCE',
    qty: 50,
    avgPrice: 2800.00,
    ltp: 2980.45,
    invested: 140000,
    current: 149022.50,
    pnl: 9022.50,
    pnlPercent: 6.44
  },
  {
    symbol: 'TATASTEEL',
    qty: 1000,
    avgPrice: 145.00,
    ltp: 152.40,
    invested: 145000,
    current: 152400,
    pnl: 7400,
    pnlPercent: 5.10
  }
];

export const POSITIONS: Position[] = [
  {
    symbol: 'NIFTY 23MAY 22500 CE',
    product: 'NRML',
    qty: 50,
    avgPrice: 120.50,
    ltp: 145.00,
    pnl: 1225.00,
    type: 'BUY'
  },
  {
    symbol: 'BANKNIFTY 23MAY 48000 PE',
    product: 'MIS',
    qty: 15,
    avgPrice: 340.00,
    ltp: 310.00,
    pnl: -450.00,
    type: 'BUY'
  }
];

export const MTF_POSITIONS: Position[] = [
    {
        symbol: 'TATASTEEL',
        product: 'MTF',
        qty: 2000,
        avgPrice: 148.00,
        ltp: 152.40,
        pnl: 8800,
        type: 'BUY'
    },
    {
        symbol: 'INFY',
        product: 'MTF',
        qty: 100,
        avgPrice: 1620.00,
        ltp: 1650.30,
        pnl: 3030,
        type: 'BUY'
    }
];

export const ORDERS: Order[] = [
  {
    id: 'ORD101',
    symbol: 'RELIANCE',
    type: 'BUY',
    product: 'CNC',
    qty: 50,
    price: 2980.45,
    status: 'EXECUTED',
    time: '10:30:24'
  },
  {
    id: 'ORD102',
    symbol: 'TATASTEEL',
    type: 'SELL',
    product: 'MIS',
    qty: 200,
    price: 155.00,
    status: 'PENDING',
    time: '11:15:10'
  },
  {
    id: 'ORD103',
    symbol: 'HDFCBANK',
    type: 'BUY',
    product: 'CNC',
    qty: 10,
    price: 1460.00,
    status: 'REJECTED',
    time: '09:20:05',
    message: 'Insufficient Funds'
  },
  {
    id: 'ORD104',
    symbol: 'NIFTY 23MAY 22500 CE',
    type: 'BUY',
    product: 'NRML',
    qty: 50,
    price: 120.00,
    status: 'EXECUTED',
    time: '09:16:00'
  }
];

export const MTF_STATS = {
    totalDebt: 185000,
    marginUsed: 62500,
    availableLimit: 25000,
    accruedInterest: 345.50,
    interestRate: 0.049, // 0.049% per day approx 18% pa
    riskStatus: 'Safe' // Safe, Moderate, Critical
};

export const NEWS: NewsItem[] = [
  {
    id: 1,
    headline: "RBI keeps repo rate unchanged at 6.5%, maintains stance",
    source: "Financial Express",
    time: "10 mins ago",
    sentiment: "Neutral",
    impact: "High"
  },
  {
    id: 2,
    headline: "TCS wins $500M deal from UK insurer, stock sees upgrade",
    source: "MoneyControl",
    time: "1 hour ago",
    sentiment: "Positive",
    relatedStock: 'TCS',
    impact: "Medium"
  },
  {
    id: 3,
    headline: "Crude oil prices surge amidst geopolitical tensions",
    source: "Bloomberg",
    time: "2 hours ago",
    sentiment: "Negative",
    impact: "Medium"
  },
  {
    id: 4,
    headline: "Reliance Jio announces tariff hike effective next month",
    source: "Economic Times",
    time: "3 hours ago",
    sentiment: "Positive",
    relatedStock: 'RELIANCE',
    impact: "High"
  },
  {
    id: 5,
    headline: "Tata Steel european operations face headwinds",
    source: "Reuters",
    time: "5 hours ago",
    sentiment: "Negative",
    relatedStock: 'TATASTEEL',
    impact: "Low"
  }
];

export const FO_DATA = {
    indices: [
        { name: 'NIFTY 50', pcr: 1.12, iv: 14.2, maxPain: 22400, trend: 'Bullish' },
        { name: 'BANKNIFTY', pcr: 0.85, iv: 16.8, maxPain: 47800, trend: 'Bearish' },
    ],
    longBuildup: [
        { symbol: 'TATASTEEL', ltp: 165.40, change: 2.4, oi: '+12%' },
        { symbol: 'DLF', ltp: 920.50, change: 3.1, oi: '+8%' },
        { symbol: 'HAL', ltp: 3850.00, change: 1.8, oi: '+5%' },
        { symbol: 'VEDL', ltp: 380.20, change: 4.1, oi: '+22%' },
    ],
    shortBuildup: [
        { symbol: 'HDFCBANK', ltp: 1440.00, change: -1.2, oi: '+15%' },
        { symbol: 'SBIN', ltp: 760.20, change: -0.8, oi: '+9%' },
        { symbol: 'BAJFINANCE', ltp: 6800.50, change: -2.5, oi: '+11%' },
        { symbol: 'INFY', ltp: 1420.00, change: -1.4, oi: '+6%' },
    ],
    activeContracts: [
        { symbol: 'NIFTY 22500 CE', ltp: 145.20, change: 25.5, oiLakh: 85 },
        { symbol: 'NIFTY 22400 PE', ltp: 88.00, change: -14.0, oiLakh: 72 },
        { symbol: 'BANKNIFTY 48000 CE', ltp: 320.50, change: 45.0, oiLakh: 45 },
    ]
};

export const BASKETS: Basket[] = [
    {
        id: 'ev-revolution',
        name: 'EV Revolution',
        type: 'THEME',
        description: 'Invest in companies leading the Electric Vehicle transition in India.',
        cagr: 28.5,
        minInvest: 15500,
        risk: 'High',
        volatility: 'High',
        popularity: 'High',
        stocks: [
            { symbol: 'TATAMOTORS', weight: 30 },
            { symbol: 'TATAPOWER', weight: 25 },
            { symbol: 'OLECTRA', weight: 20 },
            { symbol: 'EXIDEIND', weight: 25 }
        ]
    },
    {
        id: 'banking-leaders',
        name: 'Banking Leaders',
        type: 'THEME',
        description: 'Top private and public sector banks with strong balance sheets.',
        cagr: 16.2,
        minInvest: 22000,
        risk: 'Medium',
        volatility: 'Medium',
        popularity: 'High',
        stocks: [
            { symbol: 'HDFCBANK', weight: 35 },
            { symbol: 'ICICIBANK', weight: 30 },
            { symbol: 'SBIN', weight: 20 },
            { symbol: 'AXISBANK', weight: 15 }
        ]
    },
    {
        id: 'fmcg-shield',
        name: 'FMCG Shield',
        type: 'DEFENSIVE',
        description: 'Low volatility stocks for stable returns during market uncertainty.',
        cagr: 12.4,
        minInvest: 12000,
        risk: 'Low',
        volatility: 'Low',
        popularity: 'Medium',
        stocks: [
            { symbol: 'HINDUNILVR', weight: 40 },
            { symbol: 'ITC', weight: 30 },
            { symbol: 'NESTLEIND', weight: 30 }
        ]
    },
    {
        id: 'high-beta',
        name: 'High Beta Movers',
        type: 'VOLATILITY',
        description: 'Aggressive basket for traders seeking high short-term momentum.',
        cagr: 35.8,
        minInvest: 8000,
        risk: 'High',
        volatility: 'High',
        popularity: 'Medium',
        stocks: [
            { symbol: 'ADANIENT', weight: 30 },
            { symbol: 'DLF', weight: 25 },
            { symbol: 'INDUSINDBK', weight: 25 },
            { symbol: 'METROPOLIS', weight: 20 }
        ]
    },
    {
        id: 'dividend-kings',
        name: 'Dividend Aristocrats',
        type: 'DIVIDEND',
        description: 'Companies with a consistent track record of high dividend payouts.',
        cagr: 14.5,
        minInvest: 18000,
        risk: 'Low',
        volatility: 'Low',
        popularity: 'Medium',
        stocks: [
            { symbol: 'VEDL', weight: 30 },
            { symbol: 'COALINDIA', weight: 25 },
            { symbol: 'IOC', weight: 25 },
            { symbol: 'PFC', weight: 20 }
        ]
    }
];

export const BEHAVIOR_PROFILE: BehaviorProfile = {
    score: 54,
    riskLevel: 'HIGH',
    metrics: {
        slUsagePercent: 18, // Very low SL usage
        winStreak: 5, // Overconfidence trigger
        tradesLastHour: 27, // Overtrading trigger
        avgLossRecovTime: '90s', // Revenge trading trigger
        exposurePercent: 68
    },
    activeAlerts: [
        {
            id: 'a1',
            type: 'REVENGE',
            severity: 'HIGH',
            message: 'Revenge Trading Detected',
            suggestion: 'You placed a trade 90s after a loss. Take a 5 min break.',
            timestamp: '2 mins ago'
        },
        {
            id: 'a2',
            type: 'NO_SL',
            severity: 'CRITICAL',
            message: 'Stop-Loss Missing',
            suggestion: '82% of your active trades have no SL. Protect capital now.',
            timestamp: 'Just now'
        }
    ]
};

export const ALLOCATION_DATA = {
    sectors: [
        { name: 'Financials', value: 32.5, color: '#00D09C', return: 12.5 },
        { name: 'Technology', value: 24.2, color: '#3B82F6', return: -2.3 },
        { name: 'Energy', value: 18.5, color: '#F59E0B', return: 8.1 },
        { name: 'Consumer', value: 12.8, color: '#EC4899', return: 4.2 },
        { name: 'Metals', value: 8.5, color: '#9333EA', return: 5.4 },
        { name: 'Others', value: 3.5, color: '#6B7280', return: 1.2 },
    ],
    subSectors: [
        { name: 'Private Banks', value: 22.5, color: '#00D09C' },
        { name: 'IT Services', value: 24.2, color: '#3B82F6' },
        { name: 'Oil & Gas', value: 18.5, color: '#F59E0B' },
        { name: 'FMCG', value: 12.8, color: '#EC4899' },
        { name: 'PSU Banks', value: 10.0, color: '#10B981' },
        { name: 'Steel', value: 8.5, color: '#9333EA' },
    ],
    marketCap: [
        { name: 'Large Cap', value: 62, risk: 'Low', color: '#00D09C' },
        { name: 'Mid Cap', value: 28, risk: 'Moderate', color: '#F9C80E' },
        { name: 'Small Cap', value: 10, risk: 'High', color: '#EF4444' },
    ],
    riskDistribution: [
        { name: 'Low Risk', value: 45, color: '#00D09C' },
        { name: 'Moderate', value: 35, color: '#F9C80E' },
        { name: 'High Risk', value: 20, color: '#EF4444' },
    ]
};

// New Data for Sentiment & Insights
export const SENTIMENT_INSIGHTS = {
    portfolio: {
        score: 78,
        label: 'Bullish',
        distribution: { bullish: 65, neutral: 25, bearish: 10 },
        riskLevel: 'Moderate',
    },
    market: {
        fearGreedIndex: 68, // Greed
        fearGreedLabel: 'Greed',
        vix: 12.4,
        vixTrend: 'Falling',
        indexSentiment: 'Bullish',
        technicalView: {
            shortTerm: 'Bullish',
            mediumTerm: 'Neutral',
            support: 22100,
            resistance: 22650
        },
        fii: { net: -2100, trend: 'Selling', daysSequence: 3 },
        dii: { net: 3450, trend: 'Buying', daysSequence: 5 },
        sectors: [
            { name: 'Metals', sentiment: 'Bullish', return: 2.4, trend: 'up' },
            { name: 'Auto', sentiment: 'Bullish', return: 1.1, trend: 'up' },
            { name: 'Realty', sentiment: 'Bearish', return: -1.8, trend: 'down' },
            { name: 'IT', sentiment: 'Neutral', return: -0.5, trend: 'flat' }
        ],
        social: {
            overallScore: 82,
            platforms: [
                { platform: 'X (Twitter)', sentiment: 'Positive', score: 75, trend: 'Rising', mentions: '12.5K', topTopic: '#NiftyRally' },
                { platform: 'Instagram', sentiment: 'Neutral', score: 50, trend: 'Stable', mentions: '5.2K' },
                { platform: 'Google Trends', sentiment: 'Positive', score: 88, trend: 'Rising', topTopic: 'Election Results' }
            ],
            trendingStocks: [
                { symbol: 'TATAMOTORS', name: 'Tata Motors', popularityScore: 92, sentiment: 'Bullish', mentions: '8.4K', rank: 1 },
                { symbol: 'HDFCBANK', name: 'HDFC Bank', popularityScore: 85, sentiment: 'Bearish', mentions: '6.1K', rank: 2 },
                { symbol: 'ZOMATO', name: 'Zomato', popularityScore: 78, sentiment: 'Bullish', mentions: '5.5K', rank: 3 }
            ]
        },
        newsMood: {
            positivePercent: 65,
            negativePercent: 15,
            neutralPercent: 20,
            summary: 'Positive global cues and strong earnings drive sentiment.',
            highImpactItems: ['RBI MPC Policy', 'US Fed Rate Cut Hopes', 'Q4 Results Season']
        },
        macro: {
            globalTone: 'Bullish',
            interestRate: 'Pause',
            inflation: 'Cooling'
        }
    } as MarketSentiment,
    stocks: {
        'RELIANCE': {
            symbol: 'RELIANCE',
            score: 82,
            sentiment: 'Bullish',
            analystRating: { buy: 85, hold: 10, sell: 5, consensus: 'Buy' },
            newsSentiment: { positive: 70, neutral: 20, negative: 10 },
            technicals: 'Uptrend',
            volatility: 'Low',
            earningsOutlook: 'Positive',
            nextEvent: 'AGM in 15 Days',
            quant: {
                score: 82,
                label: 'Strong Buy',
                metrics: {
                    valuation: 'B+',
                    growth: 'A',
                    profitability: 'A+',
                    momentum: 'B',
                    risk: 'Low'
                }
            },
            overview: {
                marketCap: '19.5L Cr',
                industry: 'Oil & Gas / Telecom',
                pe: 28.5,
                sectorPe: 24.1,
                pb: 2.4,
                dividendYield: 0.3,
                roe: 9.8,
                high52: 3025,
                low52: 2250,
                bvps: 1250.50,
                marketLeader: true
            },
            technicalsAnalysis: {
                macd: { value: 12.5, signal: 9.2, histogram: 3.3, trend: 'Bullish' },
                rsi: 68.5,
                adx: 32.1,
                ema50: 2850.00,
                ema200: 2640.00,
                maCrossover: 'Golden Cross'
            },
            pivots: {
                classic: { r2: 3050, r1: 3010, p: 2975, s1: 2940, s2: 2910 },
                fibonacci: { r2: 3040, r1: 3005, p: 2975, s1: 2945, s2: 2920 }
            },
            piotroskiScore: 8,
            debtToEquity: 0.45,
            priceForecast: {
                low: 2750,
                high: 3350,
                median: 3100,
                current: 2980.45,
                upside: 12.4
            },
            earningsForecast: [
                { year: 'FY22', revenue: 650000, profit: 45000, eps: 66, type: 'Historical' },
                { year: 'FY23', revenue: 780000, profit: 60000, eps: 88, type: 'Historical' },
                { year: 'FY24', revenue: 920000, profit: 74000, eps: 109, type: 'Historical' },
                { year: 'FY25E', revenue: 1050000, profit: 85000, eps: 125, type: 'Estimated' },
                { year: 'FY26E', revenue: 1200000, profit: 98000, eps: 145, type: 'Estimated' },
                { year: 'FY27E', revenue: 1350000, profit: 112000, eps: 165, type: 'Estimated' }
            ],
            swot: {
                strengths: ['Market Leader in Oil & Gas', 'Rapid growth in Retail & Telecom', 'Strong Cash Flows'],
                weaknesses: ['High Debt levels', 'Capital intensive businesses'],
                opportunities: ['Green Energy transition', '5G monetization', 'Retail IPO'],
                threats: ['Regulatory changes', 'Volatile crude oil prices', 'Competition in Telecom']
            },
            deals: [
                { id: 'd1', date: '12 May', type: 'BUY', party: 'Vanguard Group', qty: '2.5M', price: 2965.00 },
                { id: 'd2', date: '10 May', type: 'SELL', party: 'Axis Mutual Fund', qty: '1.1M', price: 2972.50 },
                { id: 'd3', date: '05 May', type: 'BUY', party: 'Blackrock Inc', qty: '3.0M', price: 2950.00 }
            ],
            financials: {
                quarterly: [
                    { period: 'Q1', revenue: 210000, profit: 16000, eps: 23, margin: 7.6 },
                    { period: 'Q2', revenue: 215000, profit: 17500, eps: 25, margin: 8.1 },
                    { period: 'Q3', revenue: 225000, profit: 19000, eps: 28, margin: 8.4 },
                    { period: 'Q4', revenue: 240000, profit: 21000, eps: 31, margin: 8.7 },
                ],
                yearly: [
                    { period: '2021', revenue: 650000, profit: 45000, eps: 66, margin: 6.9 },
                    { period: '2022', revenue: 780000, profit: 60000, eps: 88, margin: 7.6 },
                    { period: '2023', revenue: 920000, profit: 74000, eps: 109, margin: 8.0 },
                ]
            },
            shareholding: {
                promoters: 50.3,
                fii: 22.4,
                dii: 15.8,
                retail: 11.5,
                others: 0
            },
            shareholdingChanges: [
                { category: 'Promoters', change: 0, trend: 'Stable' },
                { category: 'FIIs', change: 0.5, trend: 'Increase' },
                { category: 'DIIs', change: 0.2, trend: 'Increase' },
                { category: 'Retail', change: -0.7, trend: 'Decrease' }
            ],
            peers: [
                { symbol: 'ONGC', marketCap: '3.2L Cr', pe: 6.5, pb: 0.9, roe: 14.2, return1y: 45 },
                { symbol: 'IOC', marketCap: '2.1L Cr', pe: 8.2, pb: 1.1, roe: 12.5, return1y: 35 },
            ],
            events: [
                { date: '15 Jul', title: 'Q1 Earnings', type: 'Earnings' },
                { date: '21 Aug', title: 'AGM 2024', type: 'Meeting' }
            ]
        } as StockSentiment,
        'TATASTEEL': {
            symbol: 'TATASTEEL',
            score: 65,
            sentiment: 'Neutral',
            analystRating: { buy: 45, hold: 40, sell: 15, consensus: 'Hold' },
            newsSentiment: { positive: 40, neutral: 40, negative: 20 },
            technicals: 'Sideways',
            volatility: 'Medium',
            earningsOutlook: 'Neutral',
            nextEvent: 'Results on 25th May',
            quant: {
                score: 39,
                label: 'Sell',
                metrics: {
                    valuation: 'A',
                    growth: 'D',
                    profitability: 'C',
                    momentum: 'D',
                    risk: 'Medium'
                }
            },
            overview: {
                marketCap: '1.9L Cr',
                industry: 'Metals',
                pe: 14.2,
                sectorPe: 16.5,
                pb: 1.8,
                dividendYield: 2.4,
                roe: 12.5,
                high52: 165,
                low52: 128,
                bvps: 85.40,
                marketLeader: false
            },
            piotroskiScore: 5,
            debtToEquity: 1.2,
            priceForecast: {
                low: 130,
                high: 175,
                median: 158,
                current: 152.40,
                upside: 3.6
            },
             financials: {
                quarterly: [
                    { period: 'Q1', revenue: 58000, profit: 1500, eps: 1.2, margin: 2.5 },
                    { period: 'Q2', revenue: 56000, profit: 1200, eps: 0.9, margin: 2.1 },
                    { period: 'Q3', revenue: 59000, profit: 1800, eps: 1.5, margin: 3.0 },
                    { period: 'Q4', revenue: 62000, profit: 2400, eps: 1.9, margin: 3.8 },
                ],
                yearly: [
                    { period: '2021', revenue: 180000, profit: 25000, eps: 20, margin: 13.8 },
                    { period: '2022', revenue: 240000, profit: 32000, eps: 26, margin: 13.3 },
                    { period: '2023', revenue: 235000, profit: 8000, eps: 6, margin: 3.4 },
                ]
            },
            shareholding: {
                promoters: 33.9,
                fii: 19.6,
                dii: 22.5,
                retail: 24.0,
                others: 0
            },
            peers: [
                { symbol: 'JSWSTEEL', marketCap: '2.1L Cr', pe: 18.5, pb: 2.4, roe: 15.2, return1y: 28 },
                { symbol: 'SAIL', marketCap: '65K Cr', pe: 12.1, pb: 0.8, roe: 9.5, return1y: 42 },
            ],
            events: [
                { date: '25 May', title: 'Q4 Earnings', type: 'Earnings' },
                { date: '10 Jun', title: 'Dividend Ex-Date', type: 'Dividend' }
            ]
        } as StockSentiment,
        'TCS': {
            symbol: 'TCS',
            score: 45,
            sentiment: 'Bearish',
            analystRating: { buy: 30, hold: 40, sell: 30, consensus: 'Hold' },
            newsSentiment: { positive: 20, neutral: 50, negative: 30 },
            technicals: 'Downtrend',
            volatility: 'Low',
            earningsOutlook: 'Negative',
            nextEvent: 'Dividend Ex-Date Tom',
            quant: {
                score: 84,
                label: 'Strong Buy',
                metrics: {
                    valuation: 'C',
                    growth: 'A',
                    profitability: 'A+',
                    momentum: 'A',
                    risk: 'Low'
                }
            },
            overview: {
                marketCap: '14.5L Cr',
                industry: 'IT Services',
                pe: 32.1,
                sectorPe: 28.4,
                pb: 12.5,
                dividendYield: 1.2,
                roe: 45.8,
                high52: 4250,
                low52: 3300,
                bvps: 350.00,
                marketLeader: true
            },
             financials: {
                quarterly: [
                    { period: 'Q1', revenue: 59000, profit: 11000, eps: 30, margin: 18.6 },
                    { period: 'Q2', revenue: 60000, profit: 11500, eps: 31, margin: 19.1 },
                    { period: 'Q3', revenue: 60500, profit: 11800, eps: 32, margin: 19.5 },
                    { period: 'Q4', revenue: 61500, profit: 12500, eps: 34, margin: 20.3 },
                ],
                yearly: [
                    { period: '2021', revenue: 164000, profit: 32000, eps: 87, margin: 19.5 },
                    { period: '2022', revenue: 191000, profit: 38000, eps: 104, margin: 19.9 },
                    { period: '2023', revenue: 225000, profit: 42000, eps: 115, margin: 18.6 },
                ]
            },
            shareholding: {
                promoters: 72.3,
                fii: 12.5,
                dii: 10.1,
                retail: 5.1,
                others: 0
            },
            peers: [
                { symbol: 'INFY', marketCap: '6.2L Cr', pe: 26.5, pb: 7.2, roe: 32.1, return1y: 15 },
                { symbol: 'HCLTECH', marketCap: '4.1L Cr', pe: 24.2, pb: 5.8, roe: 28.4, return1y: 22 },
            ],
            events: [
                { date: 'Tomorrow', title: 'Final Dividend', type: 'Dividend' }
            ]
        } as StockSentiment,
        'INFY': {
            symbol: 'INFY',
            score: 46,
            sentiment: 'Bearish',
            analystRating: { buy: 20, hold: 50, sell: 30, consensus: 'Hold' },
            newsSentiment: { positive: 30, neutral: 40, negative: 30 },
            technicals: 'Downtrend',
            volatility: 'Medium',
            earningsOutlook: 'Neutral',
            nextEvent: 'Results soon',
            quant: {
                score: 46,
                label: 'Sell',
                metrics: {
                    valuation: 'C',
                    growth: 'C',
                    profitability: 'A',
                    momentum: 'D',
                    risk: 'Low'
                }
            }
        } as StockSentiment,
         'HDFCBANK': {
            symbol: 'HDFCBANK',
            score: 65,
            sentiment: 'Neutral',
            analystRating: { buy: 70, hold: 20, sell: 10, consensus: 'Buy' },
            newsSentiment: { positive: 50, neutral: 30, negative: 20 },
            technicals: 'Sideways',
            volatility: 'Low',
            earningsOutlook: 'Positive',
            nextEvent: 'None',
            quant: {
                score: 65,
                label: 'Hold',
                metrics: {
                    valuation: 'B',
                    growth: 'B',
                    profitability: 'A',
                    momentum: 'C',
                    risk: 'Low'
                }
            }
        } as StockSentiment
    }
};
