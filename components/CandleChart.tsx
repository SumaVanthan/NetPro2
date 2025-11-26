import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const data = [
  { time: '09:15', open: 2960, high: 2970, low: 2955, close: 2965 },
  { time: '09:30', open: 2965, high: 2980, low: 2960, close: 2975 },
  { time: '09:45', open: 2975, high: 2978, low: 2965, close: 2968 },
  { time: '10:00', open: 2968, high: 2975, low: 2962, close: 2972 },
  { time: '10:15', open: 2972, high: 2985, low: 2970, close: 2982 },
  { time: '10:30', open: 2982, high: 2990, low: 2980, close: 2988 },
  { time: '10:45', open: 2988, high: 2995, low: 2985, close: 2990 },
  { time: '11:00', open: 2990, high: 2992, low: 2980, close: 2982 },
  { time: '11:15', open: 2982, high: 2985, low: 2975, close: 2978 },
  { time: '11:30', open: 2978, high: 2982, low: 2970, close: 2975 },
  { time: '11:45', open: 2975, high: 2980, low: 2972, close: 2978 },
  { time: '12:00', open: 2978, high: 2985, low: 2975, close: 2980.45 },
];

interface CandleChartProps {
  type?: 'candle' | 'line' | 'area';
}

const CandleChart: React.FC<CandleChartProps> = ({ type = 'candle' }) => {
  return (
    <div className="w-full h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
                <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D09C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D09C" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EB5B3C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EB5B3C" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F9C80E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F9C80E" stopOpacity={0}/>
                </linearGradient>
            </defs>
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#666', fontSize: 10 }} 
            interval={2}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#666', fontSize: 10 }}
            orientation="right"
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
            cursor={{ stroke: '#333', strokeDasharray: '3 3' }}
          />
          
          {type === 'candle' && (
            <>
                 <Bar dataKey="high" data={data.map(d => ({ ...d, high: d.high - d.low, bottom: d.low }))} fill="#333" barSize={1} />
                 <Bar dataKey="close" data={data.map(d => {
                    const isUp = d.close > d.open;
                    return {
                        ...d,
                        val: Math.abs(d.close - d.open),
                        bottom: Math.min(d.close, d.open),
                        color: isUp ? '#00D09C' : '#EB5B3C'
                    }
                 })} barSize={6}>
                    {
                        data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.close > entry.open ? '#00D09C' : '#EB5B3C'} />
                        ))
                    }
                 </Bar>
            </>
          )}

          {type === 'line' && (
             <Line type="monotone" dataKey="close" stroke="#F9C80E" strokeWidth={2} dot={false} />
          )}

          {type === 'area' && (
             <Area type="monotone" dataKey="close" stroke="#F9C80E" fill="url(#colorArea)" strokeWidth={2} />
          )}

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandleChart;