
export interface Stock {
  symbol: string;
  name: string;
  ltp: number;
  change: number;
  percentChange: number;
  exchange: 'NSE' | 'BSE';
  volume: string;
  low: number;
  high: number;
  open: number;
  prevClose: number;
  depth: {
    buy: { price: number; qty: number }[];
    sell: { price: number; qty: number }[];
  };
}

export interface Index {
  name: string;
  value: number;
  change: number;
  percentChange: number;
  data: number[]; // For sparkline
}

export interface Holding {
  symbol: string;
  qty: number;
  avgPrice: number;
  ltp: number;
  invested: number;
  current: number;
  pnl: number;
  pnlPercent: number;
}

export interface Position {
  symbol: string;
  product: 'MIS' | 'NRML' | 'CNC' | 'MTF';
  qty: number;
  avgPrice: number;
  ltp: number;
  pnl: number;
  type: 'BUY' | 'SELL';
}

export interface Order {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  product: 'MIS' | 'NRML' | 'CNC' | 'MTF';
  qty: number;
  price: number;
  status: 'EXECUTED' | 'PENDING' | 'REJECTED' | 'CANCELLED';
  time: string;
  message?: string; // For rejection reasons
}

export interface NewsItem {
  id: number;
  headline: string;
  source: string;
  time: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  relatedStock?: string;
  impact?: 'High' | 'Medium' | 'Low';
}

export interface Basket {
    id: string;
    name: string;
    type: 'THEME' | 'DEFENSIVE' | 'VOLATILITY' | 'DIVIDEND';
    description: string;
    cagr: number;
    minInvest: number;
    risk: 'Low' | 'Medium' | 'High';
    volatility: 'Low' | 'Medium' | 'High';
    popularity: 'High' | 'Medium';
    stocks: { symbol: string; weight: number }[];
}

export interface BehaviorAlert {
    id: string;
    type: 'REVENGE' | 'OVERTRADING' | 'OVERCONFIDENCE' | 'NO_SL' | 'EXPOSURE' | 'DISCIPLINE' | 'PATIENCE' | 'STRATEGY';
    severity: 'HIGH' | 'MODERATE' | 'LOW' | 'CRITICAL' | 'POSITIVE';
    message: string;
    suggestion: string;
    timestamp: string;
}

export interface BehaviorProfile {
    score: number;
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'DISCIPLINED';
    metrics: {
        slUsagePercent: number;
        winStreak: number;
        tradesLastHour: number;
        avgLossRecovTime: string; // e.g. "2 min" (too fast)
        exposurePercent: number;
    };
    activeAlerts: BehaviorAlert[];
}

// Deep Insights Interfaces
export interface FinancialPeriod {
  period: string;
  revenue: number;
  profit: number;
  eps: number;
  margin: number;
}

export interface StockOverview {
  marketCap: string;
  industry: string;
  pe: number;
  sectorPe: number;
  pb: number;
  dividendYield: number;
  roe: number;
  high52: number;
  low52: number;
  bvps?: number; // Book Value Per Share
  marketLeader?: boolean; // Is Market Leader
}

export interface Shareholding {
  promoters: number;
  fii: number;
  dii: number;
  retail: number;
  others: number;
}

export interface ShareholdingChange {
    category: 'Promoters' | 'FIIs' | 'DIIs' | 'Retail';
    change: number; // positive or negative percent change
    trend: 'Increase' | 'Decrease' | 'Stable';
}

export interface Peer {
  symbol: string;
  marketCap: string;
  pe: number;
  pb: number;
  roe: number;
  return1y: number;
}

export interface CorporateEvent {
  date: string;
  title: string;
  type: 'Earnings' | 'Dividend' | 'Corporate Action' | 'Meeting';
}

export interface ForecastPrice {
    low: number;
    high: number;
    median: number;
    current: number;
    upside: number; // percentage
}

export interface EarningsForecastPeriod {
    year: string;
    revenue: number;
    profit: number;
    eps: number;
    type: 'Historical' | 'Estimated';
}

export interface SWOTAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

export interface BlockDeal {
    id: string;
    date: string;
    type: 'BUY' | 'SELL';
    party: string;
    qty: string;
    price: number;
}

// --- NEW QUANT RATING TYPE ---
export interface QuantRating {
    score: number; // 0-100
    label: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
    metrics: {
        valuation: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
        growth: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
        profitability: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
        momentum: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
        risk: 'Low' | 'Medium' | 'High';
    };
}

// --- TECHNICAL ANALYSIS TYPES ---
export interface TechnicalIndicators {
    macd: { value: number; signal: number; histogram: number; trend: 'Bullish' | 'Bearish' };
    rsi: number;
    adx: number; // Trend Strength
    ema50: number;
    ema200: number;
    maCrossover: 'Golden Cross' | 'Death Cross' | 'Neutral';
}

export interface PivotPoints {
    classic: { s2: number; s1: number; p: number; r1: number; r2: number };
    fibonacci: { s2: number; s1: number; p: number; r1: number; r2: number };
}

export interface StockSentiment {
    symbol: string;
    score: number; // 0-100
    sentiment: 'Bullish' | 'Bearish' | 'Neutral';
    analystRating: {
        buy: number;
        hold: number;
        sell: number;
        consensus: 'Buy' | 'Hold' | 'Sell';
    };
    newsSentiment: {
        positive: number;
        neutral: number;
        negative: number;
    };
    technicals: 'Uptrend' | 'Downtrend' | 'Sideways';
    volatility: 'Low' | 'Medium' | 'High';
    earningsOutlook: 'Positive' | 'Negative' | 'Neutral';
    nextEvent: string;
    
    // Quant Rating Field
    quant?: QuantRating;

    // New Deep Insight Fields
    overview?: StockOverview;
    piotroskiScore?: number; // 0-9
    debtToEquity?: number;
    priceForecast?: ForecastPrice;
    earningsForecast?: EarningsForecastPeriod[];
    swot?: SWOTAnalysis;
    deals?: BlockDeal[];
    financials?: {
      quarterly: FinancialPeriod[];
      yearly: FinancialPeriod[];
    };
    shareholding?: Shareholding;
    shareholdingChanges?: ShareholdingChange[];
    peers?: Peer[];
    events?: CorporateEvent[];
    
    // Technicals
    technicalsAnalysis?: TechnicalIndicators;
    pivots?: PivotPoints;
}

// --- NEW SENTIMENT TYPES ---

export interface PlatformSentiment {
    platform: 'X (Twitter)' | 'Instagram' | 'Google Trends' | 'Facebook';
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    score: number; // 0-100
    trend: 'Rising' | 'Falling' | 'Stable';
    mentions?: string; // e.g. "12.5K"
    topTopic?: string;
}

export interface SocialTrendingStock {
    symbol: string;
    name: string;
    popularityScore: number; // 0-100
    sentiment: 'Bullish' | 'Bearish';
    mentions: string;
    rank: number;
}

export interface NewsMood {
    positivePercent: number;
    negativePercent: number;
    neutralPercent: number;
    summary: string;
    highImpactItems: string[];
}

export interface MacroSentiment {
    globalTone: 'Bullish' | 'Bearish' | 'Mixed';
    interestRate: 'Hike' | 'Cut' | 'Pause';
    inflation: 'Rising' | 'Cooling' | 'Stable';
}

export interface MarketSentiment {
    fearGreedIndex: number; // 0-100
    fearGreedLabel: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
    vix: number;
    vixTrend: 'Rising' | 'Falling' | 'Stable';
    indexSentiment: 'Bullish' | 'Bearish';
    
    // New Technical Fields
    technicalView: {
        shortTerm: 'Bullish' | 'Bearish' | 'Neutral';
        mediumTerm: 'Bullish' | 'Bearish' | 'Neutral';
        support: number;
        resistance: number;
    };

    fii: {
        net: number;
        trend: 'Buying' | 'Selling';
        daysSequence: number;
    };
    dii: {
        net: number;
        trend: 'Buying' | 'Selling';
        daysSequence: number;
    };
    sectors: {
        name: string;
        sentiment: 'Bullish' | 'Bearish' | 'Neutral';
        return: number;
        trend: 'up' | 'down' | 'flat';
    }[];

    // New Categories
    social: {
        overallScore: number;
        platforms: PlatformSentiment[];
        trendingStocks: SocialTrendingStock[];
    };
    newsMood: NewsMood;
    macro: MacroSentiment;
}

// Watchlist specific types
export type WatchlistType = 'CUSTOM' | 'SMART' | 'THEME';
export type ViewMode = 'LIST' | 'HEATMAP' | 'CLUSTER';

export interface Note {
    id: string;
    stockSymbol: string;
    text: string;
    createdAt: string;
}

export interface WatchlistGroup {
  id: string;
  name: string;
  stocks: Stock[];
  type: WatchlistType;
  description?: string;
  icon?: any;
}

// User Context Types
export interface UserProfile {
    id: string;
    name: string;
    avatarInitials: string;
    kycStatus: boolean;
    clientId: string;
}

export interface UserData {
    profile: UserProfile;
    holdings: Holding[];
    positions: Position[];
    orders: Order[];
    behavior: BehaviorProfile | null;
}
