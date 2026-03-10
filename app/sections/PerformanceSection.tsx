/**
 * PerformanceSection.tsx
 * 
 * 3GPP TS 38.133 clause 10.1A - Measurement Accuracy for RedCap
 * Interactive educational content for RSRP/RSRQ/SINR/L1-RSRP accuracy requirements
 */

import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Signal, 
  Radio, 
  Zap, 
  BarChart3, 
  ChevronDown, 
  ChevronUp,
  Info,
  Scale,
  Target,
  Layers
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type DisplayMode = 'fun' | 'researcher' | 'spec';
type FrequencyRange = 'FR1' | 'FR2';
type RxConfig = '1Rx' | '2Rx';
type Condition = 'normal' | 'extreme';
type MetricType = 'RSRP' | 'RSRQ' | 'SINR' | 'L1-RSRP';
type L1RSRPType = 'SSB' | 'CSI-RS';

interface AccuracyValue {
  normal: number;
  extreme: number;
}

interface IoRangeAccuracy {
  range: string;
  minIo: number;
  maxIo: number;
  '1Rx': AccuracyValue;
  '2Rx': AccuracyValue;
}

interface MetricAccuracyData {
  FR1: {
    absolute: IoRangeAccuracy[] | AccuracyValue;
    relative?: AccuracyValue;
  };
  FR2: {
    absolute: IoRangeAccuracy[] | AccuracyValue;
    relative?: AccuracyValue;
  };
}

// ============================================================================
// ACCURACY DATA (3GPP TS 38.133 clause 10.1A)
// ============================================================================

const RSRP_ACCURACY: MetricAccuracyData = {
  FR1: {
    absolute: [
      { range: 'Io > -80 dBm', minIo: -80, maxIo: -50, '1Rx': { normal: 7, extreme: 10 }, '2Rx': { normal: 5.5, extreme: 8.5 } },
      { range: '-80 ≥ Io > -90 dBm', minIo: -90, maxIo: -80, '1Rx': { normal: 9, extreme: 12 }, '2Rx': { normal: 7.5, extreme: 10.5 } },
      { range: '-90 ≥ Io > -100 dBm', minIo: -100, maxIo: -90, '1Rx': { normal: 11, extreme: 14 }, '2Rx': { normal: 11, extreme: 14 } },
    ]
  },
  FR2: {
    absolute: [
      { range: 'All Io ranges', minIo: -100, maxIo: -50, '1Rx': { normal: 8, extreme: 11 }, '2Rx': { normal: 6, extreme: 9 } },
    ]
  }
};

const RSRQ_ACCURACY: MetricAccuracyData = {
  FR1: {
    absolute: { '1Rx': { normal: 3.5, extreme: 6.5 }, '2Rx': { normal: 3, extreme: 6 } }
  },
  FR2: {
    absolute: { '1Rx': { normal: 4.5, extreme: 7.5 }, '2Rx': { normal: 3.5, extreme: 6.5 } }
  }
};

const SINR_ACCURACY: MetricAccuracyData = {
  FR1: {
    absolute: { '1Rx': { normal: 3.5, extreme: 6.5 }, '2Rx': { normal: 3, extreme: 6 } }
  },
  FR2: {
    absolute: { '1Rx': { normal: 4.5, extreme: 7.5 }, '2Rx': { normal: 3.5, extreme: 6.5 } }
  }
};

const L1_RSRP_ACCURACY = {
  FR1: {
    SSB: { '1Rx': { normal: 7, extreme: 10 }, '2Rx': { normal: 5.5, extreme: 8.5 } },
    'CSI-RS': { '1Rx': { normal: 7, extreme: 10 }, '2Rx': { normal: 5.5, extreme: 8.5 } }
  },
  FR2: {
    SSB: { '1Rx': { normal: 8, extreme: 11 }, '2Rx': { normal: 6, extreme: 9 } },
    'CSI-RS': { '1Rx': { normal: 8, extreme: 11 }, '2Rx': { normal: 6, extreme: 9 } }
  }
};

const L1_RSRP_RELATIVE = {
  FR1: { '1Rx': { normal: 6, extreme: 9 }, '2Rx': { normal: 5, extreme: 8 } }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getHeatmapColor = (value: number, maxValue: number): string => {
  const ratio = value / maxValue;
  if (ratio < 0.33) return '#22c55e'; // green-500
  if (ratio < 0.66) return '#eab308'; // yellow-500
  return '#ef4444'; // red-500
};

const getAccuracyDescription = (metric: MetricType, mode: DisplayMode): string => {
  const descriptions = {
    fun: {
      RSRP: "Think of RSRP as your phone's 'signal strength meter.' RedCap needs to measure this accurately to know how loud the cell tower is shouting!",
      RSRQ: "RSRQ is like measuring signal quality - not just how loud, but how clear the message is. Better quality = fewer errors!",
      SINR: "SINR tells us how much the signal stands out from the noise. Higher SINR = crystal clear calls and fast data!",
      'L1-RSRP': "L1-RSRP is the super-fast measurement at Layer 1 - like having a speedometer that updates instantly!"
    },
    researcher: {
      RSRP: "Reference Signal Received Power (RSRP) measures the linear average of reference signal power across resource elements. Critical for cell selection and handover decisions.",
      RSRQ: "Reference Signal Received Quality (RSRQ) combines RSRP with RSSI to provide a quality metric that accounts for interference and load conditions.",
      SINR: "Signal-to-Interference-plus-Noise Ratio (SINR) determines the achievable throughput and link adaptation decisions in the physical layer.",
      'L1-RSRP': "Layer 1 RSRP provides rapid measurements for beam management and mobility procedures with reduced reporting latency."
    },
    spec: {
      RSRP: "TS 38.133 clause 10.1A.1.1: RSRP measurement accuracy requirements for RedCap UE with 1Rx and 2Rx configurations under normal and extreme conditions.",
      RSRQ: "TS 38.133 clause 10.1A.1.2: RSRQ measurement accuracy requirements for RedCap UE, specified as absolute accuracy in dB.",
      SINR: "TS 38.133 clause 10.1A.1.3: SINR measurement accuracy requirements for RedCap UE, applicable for CSI-SINR and PDSCH SINR measurements.",
      'L1-RSRP': "TS 38.133 clause 10.1A.2.1: L1-RSRP measurement accuracy for SSB and CSI-RS based measurements used in beam reporting."
    }
  };
  return descriptions[mode][metric];
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// --- Heatmap Visualization Component ---
interface AccuracyHeatmapProps {
  data: IoRangeAccuracy[];
  condition: Condition;
  mode: DisplayMode;
}

const AccuracyHeatmap: React.FC<AccuracyHeatmapProps> = ({ data, condition, mode }) => {
  const maxValue = Math.max(...data.flatMap(d => [d['1Rx'][condition], d['2Rx'][condition]]));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        Accuracy Heatmap ({condition === 'normal' ? 'Normal' : 'Extreme'} Conditions)
      </h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {data.map((item, idx) => (
          <div key={idx} className="space-y-3">
            <div className="text-sm font-medium text-slate-600 text-center bg-slate-100 py-2 rounded-lg">
              {item.range}
            </div>
            
            {/* 1Rx Cell */}
            <div 
              className="p-4 rounded-xl text-center transition-all hover:scale-105 cursor-pointer"
              style={{ backgroundColor: `${getHeatmapColor(item['1Rx'][condition], maxValue)}20`, border: `2px solid ${getHeatmapColor(item['1Rx'][condition], maxValue)}` }}
            >
              <div className="text-xs text-slate-500 mb-1">1Rx</div>
              <div className="text-2xl font-bold" style={{ color: getHeatmapColor(item['1Rx'][condition], maxValue) }}>
                ±{item['1Rx'][condition]} dB
              </div>
            </div>
            
            {/* 2Rx Cell */}
            <div 
              className="p-4 rounded-xl text-center transition-all hover:scale-105 cursor-pointer"
              style={{ backgroundColor: `${getHeatmapColor(item['2Rx'][condition], maxValue)}20`, border: `2px solid ${getHeatmapColor(item['2Rx'][condition], maxValue)}` }}
            >
              <div className="text-xs text-slate-500 mb-1">2Rx</div>
              <div className="text-2xl font-bold" style={{ color: getHeatmapColor(item['2Rx'][condition], maxValue) }}>
                ±{item['2Rx'][condition]} dB
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-sm text-slate-600">Excellent (≤5.5 dB)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500"></div>
          <span className="text-sm text-slate-600">Good (5.5-8 dB)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-sm text-slate-600">Fair (>8 dB)</span>
        </div>
      </div>

      {mode === 'fun' && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          💡 <strong>Fun Fact:</strong> 2Rx (two antennas) is like having two ears - you can hear the signal much more accurately!
        </div>
      )}
    </div>
  );
};

// --- 1Rx vs 2Rx Comparison Chart ---
interface RxComparisonChartProps {
  data: IoRangeAccuracy[];
  condition: Condition;
}

const RxComparisonChart: React.FC<RxComparisonChartProps> = ({ data, condition }) => {
  const chartData = data.map(item => ({
    range: item.range.replace(' dBm', ''),
    '1Rx': item['1Rx'][condition],
    '2Rx': item['2Rx'][condition],
    improvement: (item['1Rx'][condition] - item['2Rx'][condition]).toFixed(1)
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Scale className="w-5 h-5 text-purple-600" />
        1Rx vs 2Rx Comparison
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="range" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              label={{ value: 'Accuracy (±dB)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const improvement = payload[0].payload.improvement;
                  return (
                    <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                      <p className="font-medium text-slate-800">{label}</p>
                      <p className="text-blue-600">1Rx: ±{payload[0].value} dB</p>
                      <p className="text-green-600">2Rx: ±{payload[1].value} dB</p>
                      <p className="text-purple-600 font-medium mt-1">
                        2Rx is {improvement} dB better!
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="1Rx" fill="#3b82f6" radius={[4, 4, 0, 0]} name="1Rx (Single Antenna)" />
            <Bar dataKey="2Rx" fill="#22c55e" radius={[4, 4, 0, 0]} name="2Rx (Dual Antenna)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">1Rx Average</div>
          <div className="text-xl font-bold text-blue-700">
            ±{(chartData.reduce((a, b) => a + b['1Rx'], 0) / chartData.length).toFixed(1)} dB
          </div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-600 font-medium">2Rx Average</div>
          <div className="text-xl font-bold text-green-700">
            ±{(chartData.reduce((a, b) => a + b['2Rx'], 0) / chartData.length).toFixed(1)} dB
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Simple Accuracy Display (for RSRQ/SINR) ---
interface SimpleAccuracyDisplayProps {
  data: AccuracyValue;
  metric: string;
  condition: Condition;
  mode: DisplayMode;
}

const SimpleAccuracyDisplay: React.FC<SimpleAccuracyDisplayProps> = ({ data, metric, condition, mode }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-orange-600" />
        {metric} Accuracy ({condition === 'normal' ? 'Normal' : 'Extreme'})
      </h3>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
          <div className="text-sm text-blue-600 font-medium mb-2">1Rx Configuration</div>
          <div className="text-4xl font-bold text-blue-700">±{data['1Rx'][condition]} dB</div>
          <div className="text-xs text-blue-500 mt-2">Single receive antenna</div>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
          <div className="text-sm text-green-600 font-medium mb-2">2Rx Configuration</div>
          <div className="text-4xl font-bold text-green-700">±{data['2Rx'][condition]} dB</div>
          <div className="text-xs text-green-500 mt-2">Dual receive antennas</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">2Rx Improvement:</span>
          <span className="text-lg font-bold text-purple-600">
            {(data['1Rx'][condition] - data['2Rx'][condition]).toFixed(1)} dB better
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(1 - data['2Rx'][condition] / data['1Rx'][condition]) * 100}%` }}
          ></div>
        </div>
      </div>

      {mode === 'researcher' && (
        <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
          <strong>Note:</strong> {metric} accuracy is independent of Io range in FR1/FR2 specifications.
          The accuracy values apply across all operating conditions within the specified range.
        </div>
      )}
    </div>
  );
};

// --- L1-RSRP Display Component ---
interface L1RSRPDisplayProps {
  fr: FrequencyRange;
  l1Type: L1RSRPType;
  condition: Condition;
  mode: DisplayMode;
}

const L1RSRPDisplay: React.FC<L1RSRPDisplayProps> = ({ fr, l1Type, condition, mode }) => {
  const data = L1_RSRP_ACCURACY[fr][l1Type];
  const relativeData = L1_RSRP_RELATIVE.FR1;

  return (
    <div className="space-y-6">
      {/* Absolute Accuracy */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          L1-RSRP Absolute Accuracy ({fr} - {l1Type})
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 text-center">
            <div className="text-sm text-blue-600 font-medium mb-2">1Rx Configuration</div>
            <div className="text-4xl font-bold text-blue-700">±{data['1Rx'][condition]} dB</div>
            <div className="text-xs text-blue-500 mt-2">Single antenna</div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 text-center">
            <div className="text-sm text-green-600 font-medium mb-2">2Rx Configuration</div>
            <div className="text-4xl font-bold text-green-700">±{data['2Rx'][condition]} dB</div>
            <div className="text-xs text-green-500 mt-2">Dual antennas</div>
          </div>
        </div>

        {mode === 'fun' && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700">
            ⚡ <strong>Speed Matters:</strong> L1-RSRP measurements happen super fast at Layer 1 - 
            perfect for quickly finding the best beam!
          </div>
        )}
      </div>

      {/* Relative Accuracy (FR1 only) */}
      {fr === 'FR1' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            L1-RSRP Relative Accuracy (FR1)
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border-2 border-indigo-200 text-center">
              <div className="text-sm text-indigo-600 font-medium mb-2">1Rx Configuration</div>
              <div className="text-4xl font-bold text-indigo-700">±{relativeData['1Rx'][condition]} dB</div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 text-center">
              <div className="text-sm text-purple-600 font-medium mb-2">2Rx Configuration</div>
              <div className="text-4xl font-bold text-purple-700">±{relativeData['2Rx'][condition]} dB</div>
            </div>
          </div>

          {mode === 'researcher' && (
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-800">
              <strong>Relative Accuracy:</strong> Measures the difference between two L1-RSRP 
              measurements from the same or different cells. Critical for beam comparison and 
              handover decisions.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Interactive Accuracy Table ---
interface AccuracyTableProps {
  metric: MetricType;
  fr: FrequencyRange;
  mode: DisplayMode;
}

const AccuracyTable: React.FC<AccuracyTableProps> = ({ metric, fr, mode }) => {
  const [expanded, setExpanded] = useState(false);

  const getTableData = () => {
    switch (metric) {
      case 'RSRP':
        return RSRP_ACCURACY[fr].absolute as IoRangeAccuracy[];
      case 'RSRQ':
      case 'SINR':
        const simpleData = (metric === 'RSRQ' ? RSRQ_ACCURACY : SINR_ACCURACY)[fr].absolute as AccuracyValue;
        return [
          { range: 'All Io ranges', minIo: -100, maxIo: -50, '1Rx': simpleData['1Rx'], '2Rx': simpleData['2Rx'] }
        ];
      default:
        return [];
    }
  };

  const data = getTableData();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-slate-600" />
          <span className="font-semibold text-slate-800">
            {metric} Accuracy Table ({fr})
          </span>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {expanded && (
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left text-sm font-semibold text-slate-700">Io Range</th>
                <th className="p-3 text-center text-sm font-semibold text-slate-700" colSpan={2}>Normal Conditions</th>
                <th className="p-3 text-center text-sm font-semibold text-slate-700" colSpan={2}>Extreme Conditions</th>
              </tr>
              <tr className="bg-slate-50">
                <th className="p-2"></th>
                <th className="p-2 text-center text-xs font-medium text-slate-600">1Rx</th>
                <th className="p-2 text-center text-xs font-medium text-slate-600">2Rx</th>
                <th className="p-2 text-center text-xs font-medium text-slate-600">1Rx</th>
                <th className="p-2 text-center text-xs font-medium text-slate-600">2Rx</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="p-3 text-sm text-slate-700">{row.range}</td>
                  <td className="p-3 text-center text-sm font-medium text-blue-600">±{row['1Rx'].normal} dB</td>
                  <td className="p-3 text-center text-sm font-medium text-green-600">±{row['2Rx'].normal} dB</td>
                  <td className="p-3 text-center text-sm font-medium text-orange-600">±{row['1Rx'].extreme} dB</td>
                  <td className="p-3 text-center text-sm font-medium text-red-600">±{row['2Rx'].extreme} dB</td>
                </tr>
              ))}
            </tbody>
          </table>

          {mode === 'spec' && (
            <div className="mt-4 p-3 bg-slate-100 rounded-lg text-xs text-slate-600 font-mono">
              Source: 3GPP TS 38.133 Table 10.1A.{metric === 'RSRP' ? '1.1' : metric === 'RSRQ' ? '1.2' : '1.3'}-{fr === 'FR1' ? '1' : '2'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Io Range Visualizer ---
const IoRangeVisualizer: React.FC = () => {
  const ranges = [
    { label: 'Io > -80 dBm', color: '#22c55e', description: 'Strong signal area' },
    { label: '-80 to -90 dBm', color: '#eab308', description: 'Moderate signal' },
    { label: '-90 to -100 dBm', color: '#f97316', description: 'Weak signal area' },
    { label: '< -100 dBm', color: '#ef4444', description: 'Very weak signal' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Signal className="w-5 h-5 text-teal-600" />
        Io Range Visualizer
      </h3>
      
      <div className="relative">
        {/* Signal strength bar */}
        <div className="h-12 rounded-lg overflow-hidden flex">
          {ranges.map((range, idx) => (
            <div 
              key={idx}
              className="flex-1 flex items-center justify-center text-white text-xs font-medium"
              style={{ backgroundColor: range.color }}
            >
              {range.label}
            </div>
          ))}
        </div>
        
        {/* Labels */}
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>Strong (-50 dBm)</span>
          <span>Weak (-100 dBm)</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {ranges.map((range, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: range.color }}></div>
            <span className="text-sm text-slate-600">{range.description}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-teal-50 rounded-lg text-sm text-teal-700">
        <Info className="w-4 h-4 inline mr-1" />
        <strong>Io</strong> represents the total received power spectral density, including signal and interference.
        Higher Io generally means better measurement accuracy.
      </div>
    </div>
  );
};

// --- Mode Content Component ---
interface ModeContentProps {
  mode: DisplayMode;
  metric: MetricType;
}

const ModeContent: React.FC<ModeContentProps> = ({ mode, metric }) => {
  const content = {
    fun: {
      RSRP: {
        title: "📡 Signal Strength Detective",
        description: "RSRP is like measuring how loud your friend is shouting across a playground!",
        points: [
          "🎯 Better accuracy means your phone knows EXACTLY which tower is closest",
          "📶 2Rx is like having two ears - you hear the signal twice as clearly!",
          "🌟 When signals are strong (Io > -80dBm), measurements are super precise",
          "🌙 Weak signals are harder to measure accurately (like whispering from far away)"
        ]
      },
      RSRQ: {
        title: "✨ Signal Quality Checker",
        description: "RSRQ tells us not just how loud, but how CLEAR the signal is!",
        points: [
          "🎵 It's like checking if music is clear or full of static",
          "📊 Quality matters more than just strength for fast internet!",
          "🔄 2Rx helps filter out noise for crystal-clear measurements",
          "🏆 Good RSRQ = smooth video calls and fast downloads!"
        ]
      },
      SINR: {
        title: "🔊 Signal vs Noise Battle",
        description: "SINR shows how much the signal stands out from background noise!",
        points: [
          "⚔️ It's a battle between your signal and interfering signals",
          "🏔️ Higher SINR = the signal 'mountain' rises above the noise 'valley'",
          "🚀 Great SINR means super-fast data speeds!",
          "📡 RedCap needs accurate SINR to pick the best frequencies!"
        ]
      },
      'L1-RSRP': {
        title: "⚡ Super-Fast Beam Finder",
        description: "L1-RSRP works at lightning speed to find the best signal beam!",
        points: [
          "💨 Layer 1 measurements are INSTANT - no waiting!",
          "🎯 Perfect for quickly switching between different beams",
          "📱 Helps your phone stay connected while moving around",
          "🌟 Both SSB and CSI-RS beams can be measured accurately!"
        ]
      }
    },
    researcher: {
      RSRP: {
        title: "RSRP Measurement Accuracy Analysis",
        description: "RSRP accuracy requirements for RedCap UE with Io-dependent specifications in FR1.",
        points: [
          "FR1 accuracy varies with Io: ±7 to ±11 dB (1Rx normal), ±5.5 to ±11 dB (2Rx normal)",
          "FR2 maintains consistent accuracy: ±8 dB (1Rx), ±6 dB (2Rx) across all Io ranges",
          "2Rx configuration provides 1.5-2 dB improvement in measurement accuracy",
          "Extreme conditions add 3 dB tolerance to all measurements"
        ]
      },
      RSRQ: {
        title: "RSRQ Measurement Accuracy Analysis",
        description: "RSRQ accuracy is specified independently of Io range for both FR1 and FR2.",
        points: [
          "FR1: ±3.5 dB (1Rx normal), ±3 dB (2Rx normal) - 0.5 dB improvement with 2Rx",
          "FR2: ±4.5 dB (1Rx normal), ±3.5 dB (2Rx normal) - 1 dB improvement with 2Rx",
          "RSRQ combines RSRP and RSSI measurements for quality assessment",
          "Critical for cell selection, reselection, and handover decisions"
        ]
      },
      SINR: {
        title: "SINR Measurement Accuracy Analysis",
        description: "SINR accuracy specifications align with RSRQ requirements for RedCap UE.",
        points: [
          "Identical accuracy requirements to RSRQ: ±3.5/±3 dB (FR1), ±4.5/±3.5 dB (FR2)",
          "Applies to both CSI-SINR and PDSCH SINR measurements",
          "SINR directly impacts link adaptation and scheduling decisions",
          "Accurate SINR measurement enables optimal MCS selection"
        ]
      },
      'L1-RSRP': {
        title: "L1-RSRP Measurement Accuracy Analysis",
        description: "Layer 1 RSRP measurements support rapid beam management and mobility procedures.",
        points: [
          "Absolute accuracy: ±7/±5.5 dB (FR1), ±8/±6 dB (FR2) for normal conditions",
          "Relative accuracy (FR1 only): ±6/±5 dB for comparing beam measurements",
          "Applicable to both SSB-based and CSI-RS based L1-RSRP measurements",
          "Reduced reporting latency compared to RRC-layer measurements"
        ]
      }
    },
    spec: {
      RSRP: {
        title: "TS 38.133 clause 10.1A.1.1 - RSRP Measurement Accuracy",
        description: "Reference Signal Received Power measurement accuracy requirements for RedCap UE.",
        points: [
          "Table 10.1A.1.1-1 (FR1): Io-dependent accuracy with 3 ranges: >-80, -80 to -90, -90 to -100 dBm",
          "Table 10.1A.1.1-2 (FR2): Single accuracy value across all Io ranges",
          "Normal conditions: 3GPP TS 38.133 Annex C (15°C to 35°C, nominal voltage)",
          "Extreme conditions: 3GPP TS 38.133 Annex D (temperature/voltage extremes)"
        ]
      },
      RSRQ: {
        title: "TS 38.133 clause 10.1A.1.2 - RSRQ Measurement Accuracy",
        description: "Reference Signal Received Quality measurement accuracy requirements.",
        points: [
          "Table 10.1A.1.2-1 (FR1): ±3.5 dB (1Rx normal), ±3 dB (2Rx normal)",
          "Table 10.1A.1.2-2 (FR2): ±4.5 dB (1Rx normal), ±3.5 dB (2Rx normal)",
          "RSRQ = N × RSRP / RSSI, where N is number of resource blocks",
          "Measurement period: 200ms for FR1, 400ms for FR2"
        ]
      },
      SINR: {
        title: "TS 38.133 clause 10.1A.1.3 - SINR Measurement Accuracy",
        description: "Signal-to-Interference-plus-Noise Ratio measurement accuracy requirements.",
        points: [
          "Table 10.1A.1.3-1 (FR1): Same values as RSRQ accuracy",
          "Table 10.1A.1.3-2 (FR2): Same values as RSRQ accuracy",
          "Applies to CSI-SINR and PDSCH SINR measurements",
          "SINR accuracy affects CSI reporting and link adaptation"
        ]
      },
      'L1-RSRP': {
        title: "TS 38.133 clause 10.1A.2 - L1-RSRP Measurement Accuracy",
        description: "Layer 1 RSRP measurement accuracy for beam reporting.",
        points: [
          "clause 10.1A.2.1: Absolute accuracy for SSB and CSI-RS based measurements",
          "clause 10.1A.2.2: Relative accuracy for FR1 (inter-beam comparison)",
          "Measurement period: 40ms (FR1), 80ms (FR2) for SSB",
          "Reporting range: -140 dBm to -44 dBm with 1 dB resolution"
        ]
      }
    }
  };

  const c = content[mode][metric];

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-2">{c.title}</h3>
      <p className="text-slate-600 mb-4">{c.description}</p>
      <ul className="space-y-2">
        {c.points.map((point, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span className="text-slate-700">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface PerformanceSectionProps {
  mode?: DisplayMode;
}

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({ mode = 'researcher' }) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('RSRP');
  const [fr, setFr] = useState<FrequencyRange>('FR1');
  const [condition, setCondition] = useState<Condition>('normal');
  const [l1Type, setL1Type] = useState<L1RSRPType>('SSB');

  const metrics: { id: MetricType; icon: React.ReactNode; label: string }[] = [
    { id: 'RSRP', icon: <Signal className="w-5 h-5" />, label: 'RSRP' },
    { id: 'RSRQ', icon: <Activity className="w-5 h-5" />, label: 'RSRQ' },
    { id: 'SINR', icon: <Radio className="w-5 h-5" />, label: 'SINR' },
    { id: 'L1-RSRP', icon: <Zap className="w-5 h-5" />, label: 'L1-RSRP' },
  ];

  const renderContent = () => {
    switch (activeMetric) {
      case 'RSRP':
        const rsrpData = RSRP_ACCURACY[fr].absolute as IoRangeAccuracy[];
        return (
          <div className="space-y-6">
            <ModeContent mode={mode} metric="RSRP" />
            <div className="grid lg:grid-cols-2 gap-6">
              <AccuracyHeatmap data={rsrpData} condition={condition} mode={mode} />
              <RxComparisonChart data={rsrpData} condition={condition} />
            </div>
            <IoRangeVisualizer />
            <AccuracyTable metric="RSRP" fr={fr} mode={mode} />
          </div>
        );
      
      case 'RSRQ':
        const rsrqData = RSRQ_ACCURACY[fr].absolute as AccuracyValue;
        return (
          <div className="space-y-6">
            <ModeContent mode={mode} metric="RSRQ" />
            <SimpleAccuracyDisplay 
              data={rsrqData} 
              metric="RSRQ" 
              condition={condition} 
              mode={mode} 
            />
            <AccuracyTable metric="RSRQ" fr={fr} mode={mode} />
          </div>
        );
      
      case 'SINR':
        const sinrData = SINR_ACCURACY[fr].absolute as AccuracyValue;
        return (
          <div className="space-y-6">
            <ModeContent mode={mode} metric="SINR" />
            <SimpleAccuracyDisplay 
              data={sinrData} 
              metric="SINR" 
              condition={condition} 
              mode={mode} 
            />
            <AccuracyTable metric="SINR" fr={fr} mode={mode} />
          </div>
        );
      
      case 'L1-RSRP':
        return (
          <div className="space-y-6">
            <ModeContent mode={mode} metric="L1-RSRP" />
            
            {/* L1-RSRP Type Selector */}
            <div className="flex gap-4">
              {(['SSB', 'CSI-RS'] as L1RSRPType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setL1Type(type)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    l1Type === type
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {type} Based
                </button>
              ))}
            </div>
            
            <L1RSRPDisplay 
              fr={fr} 
              l1Type={l1Type} 
              condition={condition} 
              mode={mode} 
            />
          </div>
        );
    }
  };

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Measurement Accuracy Requirements
            </h2>
            <p className="text-slate-500">
              3GPP TS 38.133 clause 10.1A - RedCap UE Measurement Performance
            </p>
          </div>
        </div>
        
        {mode === 'spec' && (
          <div className="mt-2 p-2 bg-slate-100 rounded-lg text-xs text-slate-600 font-mono inline-block">
            Document: 3GPP TS 38.133 V17.x.x | Section: 10.1A
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-8 border border-slate-200">
        <div className="flex flex-wrap items-center gap-6">
          {/* Metric Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Metric:</span>
            <div className="flex bg-slate-100 rounded-lg p-1">
              {metrics.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMetric(m.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeMetric === m.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* FR Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Band:</span>
            <div className="flex bg-slate-100 rounded-lg p-1">
              {(['FR1', 'FR2'] as FrequencyRange[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFr(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    fr === f
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Condition:</span>
            <div className="flex bg-slate-100 rounded-lg p-1">
              {(['normal', 'extreme'] as Condition[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCondition(c)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    condition === c
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800">
              About {activeMetric}
            </h4>
            <p className="text-blue-700 mt-1">
              {getAccuracyDescription(activeMetric, mode)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {renderContent()}

      {/* Footer Note */}
      <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Info className="w-4 h-4" />
          <span>
            All accuracy values are specified in dB and represent the maximum allowed measurement error 
            under the specified conditions. See 3GPP TS 38.133 for complete test requirements.
          </span>
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;
