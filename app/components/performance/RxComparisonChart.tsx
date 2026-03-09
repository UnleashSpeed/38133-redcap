/**
 * RxComparisonChart.tsx
 * 
 * Interactive bar chart comparing 1Rx vs 2Rx measurement accuracy
 * Shows improvement metrics and statistical analysis
 */

import React, { useMemo } from 'react';
import { Scale, TrendingDown, Calculator } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

export type Condition = 'normal' | 'extreme';

export interface IoRangeAccuracy {
  range: string;
  minIo: number;
  maxIo: number;
  '1Rx': { normal: number; extreme: number };
  '2Rx': { normal: number; extreme: number };
}

interface RxComparisonChartProps {
  data: IoRangeAccuracy[];
  condition: Condition;
  title?: string;
  showStats?: boolean;
  showImprovement?: boolean;
}

interface ChartDataPoint {
  range: string;
  shortRange: string;
  '1Rx': number;
  '2Rx': number;
  improvement: number;
  improvementPercent: number;
}

export const RxComparisonChart: React.FC<RxComparisonChartProps> = ({
  data,
  condition,
  title = '1Rx vs 2Rx Comparison',
  showStats = true,
  showImprovement = true
}) => {
  // Prepare chart data
  const chartData: ChartDataPoint[] = useMemo(() => {
    return data.map(item => {
      const improvement = item['1Rx'][condition] - item['2Rx'][condition];
      const improvementPercent = (improvement / item['1Rx'][condition]) * 100;
      // Create shortened range label for chart
      const shortRange = item.range
        .replace('Io > ', '>')
        .replace(' dBm', '')
        .replace('≥', '-');
      
      return {
        range: item.range,
        shortRange,
        '1Rx': item['1Rx'][condition],
        '2Rx': item['2Rx'][condition],
        improvement,
        improvementPercent
      };
    });
  }, [data, condition]);

  // Calculate statistics
  const stats = useMemo(() => {
    const rx1Values = chartData.map(d => d['1Rx']);
    const rx2Values = chartData.map(d => d['2Rx']);
    const improvements = chartData.map(d => d.improvement);
    
    const avgRx1 = rx1Values.reduce((a, b) => a + b, 0) / rx1Values.length;
    const avgRx2 = rx2Values.reduce((a, b) => a + b, 0) / rx2Values.length;
    const avgImprovement = improvements.reduce((a, b) => a + b, 0) / improvements.length;
    const maxImprovement = Math.max(...improvements);
    const minImprovement = Math.min(...improvements);
    
    return {
      avgRx1: avgRx1.toFixed(1),
      avgRx2: avgRx2.toFixed(1),
      avgImprovement: avgImprovement.toFixed(1),
      maxImprovement: maxImprovement.toFixed(1),
      minImprovement: minImprovement.toFixed(1),
      improvementPercent: ((avgImprovement / avgRx1) * 100).toFixed(1)
    };
  }, [chartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-2">{data.range}</p>
          <div className="space-y-1">
            <p className="text-blue-600 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              1Rx: ±{data['1Rx']} dB
            </p>
            <p className="text-green-600 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              2Rx: ±{data['2Rx']} dB
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200">
            <p className="text-purple-600 font-medium">
              <TrendingDown className="w-4 h-4 inline mr-1" />
              2Rx is {data.improvement.toFixed(1)} dB better
            </p>
            <p className="text-sm text-slate-500">
              ({data.improvementPercent.toFixed(1)}% improvement)
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Scale className="w-5 h-5 text-purple-600" />
        {title}
      </h3>
      
      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="shortRange" 
              angle={-30} 
              textAnchor="end" 
              height={70}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              label={{ value: 'Accuracy (±dB)', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="circle"
            />
            <ReferenceLine y={0} stroke="#cbd5e1" />
            
            <Bar 
              dataKey="1Rx" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
              name="1Rx (Single Antenna)"
              maxBarSize={50}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-1rx-${index}`} fill="#3b82f6" fillOpacity={0.8 + (index * 0.05)} />
              ))}
            </Bar>
            
            <Bar 
              dataKey="2Rx" 
              fill="#22c55e" 
              radius={[4, 4, 0, 0]} 
              name="2Rx (Dual Antenna)"
              maxBarSize={50}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-2rx-${index}`} fill="#22c55e" fillOpacity={0.8 + (index * 0.05)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Cards */}
      {showStats && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-sm text-blue-600 font-medium mb-1">1Rx Average</div>
            <div className="text-2xl font-bold text-blue-700">±{stats.avgRx1} dB</div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="text-sm text-green-600 font-medium mb-1">2Rx Average</div>
            <div className="text-2xl font-bold text-green-700">±{stats.avgRx2} dB</div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="text-sm text-purple-600 font-medium mb-1">Avg Improvement</div>
            <div className="text-2xl font-bold text-purple-700">{stats.avgImprovement} dB</div>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="text-sm text-amber-600 font-medium mb-1">Improvement %</div>
            <div className="text-2xl font-bold text-amber-700">{stats.improvementPercent}%</div>
          </div>
        </div>
      )}

      {/* Improvement Details */}
      {showImprovement && (
        <div className="mt-4 p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Improvement Analysis</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-slate-500">Minimum</div>
              <div className="text-lg font-semibold text-slate-700">{stats.minImprovement} dB</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Average</div>
              <div className="text-lg font-semibold text-purple-600">{stats.avgImprovement} dB</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Maximum</div>
              <div className="text-lg font-semibold text-slate-700">{stats.maxImprovement} dB</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Mini comparison for inline display
 */
interface MiniRxComparisonProps {
  rx1Value: number;
  rx2Value: number;
  label: string;
}

export const MiniRxComparison: React.FC<MiniRxComparisonProps> = ({ rx1Value, rx2Value, label }) => {
  const improvement = rx1Value - rx2Value;
  const improvementPercent = ((improvement / rx1Value) * 100).toFixed(0);
  
  return (
    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-200">
      <div className="text-sm font-medium text-slate-600 w-24">{label}</div>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 p-2 bg-blue-100 rounded text-center">
          <span className="text-sm text-blue-700 font-medium">1Rx: ±{rx1Value} dB</span>
        </div>
        <div className="text-slate-400">→</div>
        <div className="flex-1 p-2 bg-green-100 rounded text-center">
          <span className="text-sm text-green-700 font-medium">2Rx: ±{rx2Value} dB</span>
        </div>
      </div>
      <div className="text-sm text-purple-600 font-medium">
        -{improvement} dB ({improvementPercent}%)
      </div>
    </div>
  );
};

export default RxComparisonChart;
