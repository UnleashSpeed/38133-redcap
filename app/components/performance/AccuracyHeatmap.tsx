/**
 * AccuracyHeatmap.tsx
 * 
 * Interactive heatmap visualization for RedCap measurement accuracy
 * Shows accuracy values across Io ranges with color-coded cells
 */

import React from 'react';
import { BarChart3, Info } from 'lucide-react';

export type DisplayMode = 'fun' | 'researcher' | 'spec';
export type Condition = 'normal' | 'extreme';

export interface IoRangeAccuracy {
  range: string;
  minIo: number;
  maxIo: number;
  '1Rx': { normal: number; extreme: number };
  '2Rx': { normal: number; extreme: number };
}

interface AccuracyHeatmapProps {
  data: IoRangeAccuracy[];
  condition: Condition;
  mode: DisplayMode;
  title?: string;
  showLegend?: boolean;
  showImprovement?: boolean;
}

/**
 * Get color based on accuracy value (lower is better)
 */
const getHeatmapColor = (value: number): { bg: string; border: string; text: string } => {
  if (value <= 6) {
    return { 
      bg: 'bg-green-100', 
      border: 'border-green-400', 
      text: 'text-green-700' 
    };
  }
  if (value <= 9) {
    return { 
      bg: 'bg-yellow-100', 
      border: 'border-yellow-400', 
      text: 'text-yellow-700' 
    };
  }
  return { 
    bg: 'bg-red-100', 
    border: 'border-red-400', 
    text: 'text-red-700' 
  };
};

/**
 * Get gradient color for continuous visualization
 */
const getGradientColor = (value: number, maxValue: number): string => {
  const ratio = value / maxValue;
  if (ratio < 0.4) return '#22c55e'; // green-500
  if (ratio < 0.7) return '#eab308'; // yellow-500
  return '#ef4444'; // red-500
};

export const AccuracyHeatmap: React.FC<AccuracyHeatmapProps> = ({
  data,
  condition,
  mode,
  title = 'Accuracy Heatmap',
  showLegend = true,
  showImprovement = true
}) => {
  const maxValue = Math.max(...data.flatMap(d => [d['1Rx'][condition], d['2Rx'][condition]]));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          {title} ({condition === 'normal' ? 'Normal' : 'Extreme'} Conditions)
        </h3>
        <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600">
          Lower is better
        </span>
      </div>
      
      {/* Heatmap Grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
        {data.map((item, idx) => {
          const rx1Color = getHeatmapColor(item['1Rx'][condition]);
          const rx2Color = getHeatmapColor(item['2Rx'][condition]);
          const improvement = (item['1Rx'][condition] - item['2Rx'][condition]).toFixed(1);
          
          return (
            <div key={idx} className="space-y-3">
              {/* Io Range Header */}
              <div className="text-sm font-medium text-slate-600 text-center bg-slate-100 py-2 rounded-lg">
                {item.range}
              </div>
              
              {/* 1Rx Cell */}
              <div 
                className={`
                  p-4 rounded-xl text-center transition-all duration-300 
                  hover:scale-105 cursor-pointer border-2
                  ${rx1Color.bg} ${rx1Color.border}
                `}
              >
                <div className="text-xs text-slate-500 mb-1 font-medium">1Rx</div>
                <div className={`text-2xl font-bold ${rx1Color.text}`}>
                  ±{item['1Rx'][condition]} dB
                </div>
                {showImprovement && (
                  <div className="text-xs text-slate-400 mt-1">Single antenna</div>
                )}
              </div>
              
              {/* 2Rx Cell */}
              <div 
                className={`
                  p-4 rounded-xl text-center transition-all duration-300 
                  hover:scale-105 cursor-pointer border-2
                  ${rx2Color.bg} ${rx2Color.border}
                `}
              >
                <div className="text-xs text-slate-500 mb-1 font-medium">2Rx</div>
                <div className={`text-2xl font-bold ${rx2Color.text}`}>
                  ±{item['2Rx'][condition]} dB
                </div>
                {showImprovement && (
                  <div className="text-xs text-green-600 mt-1 font-medium">
                    {improvement} dB better
                  </div>
                )}
              </div>

              {/* Improvement Bar */}
              {showImprovement && (
                <div className="pt-2">
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((parseFloat(improvement) / 3) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-center text-purple-600 mt-1">
                    2Rx advantage
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-sm text-slate-600">Excellent (≤6 dB)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-sm text-slate-600">Good (6-9 dB)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-sm text-slate-600">Fair (>9 dB)</span>
          </div>
        </div>
      )}

      {/* Mode-specific tips */}
      {mode === 'fun' && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Fun Fact:</strong> 2Rx (two antennas) is like having two ears - you can 
            "hear" the signal much more accurately! The improvement is shown in green.
          </span>
        </div>
      )}

      {mode === 'researcher' && (
        <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-700 flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Analysis:</strong> 2Rx provides consistent improvement across all Io ranges 
            through diversity gain. The benefit is most pronounced in normal conditions.
          </span>
        </div>
      )}

      {mode === 'spec' && (
        <div className="mt-4 p-3 bg-slate-100 rounded-lg text-xs text-slate-600 font-mono">
          Reference: 3GPP TS 38.133 clause 10.1A | Conditions per Annex C (normal) / Annex D (extreme)
        </div>
      )}
    </div>
  );
};

/**
 * Compact heatmap for dashboard/overview use
 */
interface CompactHeatmapProps {
  data: IoRangeAccuracy[];
  condition: Condition;
}

export const CompactAccuracyHeatmap: React.FC<CompactHeatmapProps> = ({ data, condition }) => {
  const maxValue = Math.max(...data.flatMap(d => [d['1Rx'][condition], d['2Rx'][condition]]));

  return (
    <div className="grid grid-cols-3 gap-2">
      {data.map((item, idx) => (
        <div key={idx} className="space-y-1">
          <div className="text-xs text-slate-500 text-center truncate">{item.range}</div>
          <div className="flex gap-1">
            <div 
              className="flex-1 p-2 rounded text-center text-white text-sm font-bold"
              style={{ backgroundColor: getGradientColor(item['1Rx'][condition], maxValue) }}
            >
              1Rx: ±{item['1Rx'][condition]}
            </div>
            <div 
              className="flex-1 p-2 rounded text-center text-white text-sm font-bold"
              style={{ backgroundColor: getGradientColor(item['2Rx'][condition], maxValue) }}
            >
              2Rx: ±{item['2Rx'][condition]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccuracyHeatmap;
