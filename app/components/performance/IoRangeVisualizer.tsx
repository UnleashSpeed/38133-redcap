/**
 * IoRangeVisualizer.tsx
 * 
 * Interactive visualization of Io (interference + noise) ranges
 * Shows how signal strength affects measurement accuracy
 */

import React, { useState } from 'react';
import { Signal, Info, Zap, Waves, Radio } from 'lucide-react';

export type DisplayMode = 'fun' | 'researcher' | 'spec';

interface IoRange {
  label: string;
  min: number;
  max: number;
  color: string;
  bgColor: string;
  description: string;
  accuracyImpact: string;
}

interface IoRangeVisualizerProps {
  mode?: DisplayMode;
  showDetails?: boolean;
  interactive?: boolean;
}

const IO_RANGES: IoRange[] = [
  {
    label: 'Io > -80 dBm',
    min: -80,
    max: -50,
    color: '#22c55e',
    bgColor: 'bg-green-500',
    description: 'Strong signal environment',
    accuracyImpact: 'Best accuracy - minimal measurement uncertainty'
  },
  {
    label: '-80 to -90 dBm',
    min: -90,
    max: -80,
    color: '#eab308',
    bgColor: 'bg-yellow-500',
    description: 'Moderate signal strength',
    accuracyImpact: 'Good accuracy - slight degradation'
  },
  {
    label: '-90 to -100 dBm',
    min: -100,
    max: -90,
    color: '#f97316',
    bgColor: 'bg-orange-500',
    description: 'Weak signal area',
    accuracyImpact: 'Reduced accuracy - higher uncertainty'
  },
  {
    label: '< -100 dBm',
    min: -120,
    max: -100,
    color: '#ef4444',
    bgColor: 'bg-red-500',
    description: 'Very weak signal / edge of coverage',
    accuracyImpact: 'Fair accuracy - maximum uncertainty'
  }
];

export const IoRangeVisualizer: React.FC<IoRangeVisualizerProps> = ({
  mode = 'researcher',
  showDetails = true,
  interactive = true
}) => {
  const [hoveredRange, setHoveredRange] = useState<IoRange | null>(null);
  const [selectedRange, setSelectedRange] = useState<IoRange | null>(null);

  const activeRange = hoveredRange || selectedRange;

  const getModeContent = () => {
    switch (mode) {
      case 'fun':
        return {
          title: '📶 Signal Strength Playground',
          description: 'Io is like the "background noise" in a classroom - the louder it is, the harder to hear!',
          explanation: 'Think of Io as how "noisy" the airwaves are. When Io is high (>-80 dBm), it\'s like a quiet library - easy to measure signals accurately!'
        };
      case 'researcher':
        return {
          title: 'Io Range Analysis',
          description: 'Io represents the total received power spectral density including interference and noise.',
          explanation: 'Higher Io levels generally correlate with stronger desired signals and better measurement accuracy. The relationship is specified in 3GPP TS 38.133 clause 10.1A.'
        };
      case 'spec':
        return {
          title: 'Io Range Specifications (TS 38.133)',
          description: 'Total received power spectral density including signal and interference.',
          explanation: 'Io ranges defined per Table 10.1A.1.1-1 for FR1 RSRP accuracy. Measurement conditions specified in Annex C (normal) and Annex D (extreme).'
        };
    }
  };

  const content = getModeContent();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Signal className="w-5 h-5 text-teal-600" />
        {content.title}
      </h3>
      
      <p className="text-slate-600 mb-6">{content.description}</p>

      {/* Signal Strength Bar */}
      <div className="relative mb-6">
        <div className="h-16 rounded-xl overflow-hidden flex shadow-inner">
          {IO_RANGES.map((range, idx) => {
            const width = ((range.max - range.min) / 70) * 100;
            return (
              <div
                key={idx}
                className={`
                  relative flex items-center justify-center text-white text-sm font-medium
                  transition-all duration-300 cursor-pointer
                  ${interactive ? 'hover:brightness-110' : ''}
                  ${activeRange?.label === range.label ? 'ring-4 ring-offset-2 ring-slate-300 z-10' : ''}
                `}
                style={{ 
                  backgroundColor: range.color, 
                  width: `${width}%`,
                  minWidth: '80px'
                }}
                onMouseEnter={() => interactive && setHoveredRange(range)}
                onMouseLeave={() => interactive && setHoveredRange(null)}
                onClick={() => interactive && setSelectedRange(range)}
              >
                <span className="px-2 text-center">{range.label}</span>
                
                {/* Indicator dot */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Scale labels */}
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>Strong (-50 dBm)</span>
          <span>Weak (-120 dBm)</span>
        </div>
      </div>

      {/* Range Details */}
      {showDetails && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {IO_RANGES.map((range, idx) => (
            <div
              key={idx}
              className={`
                p-3 rounded-lg border-2 transition-all cursor-pointer
                ${activeRange?.label === range.label 
                  ? 'border-slate-400 bg-slate-50' 
                  : 'border-transparent hover:border-slate-200 bg-slate-50'}
              `}
              onMouseEnter={() => setHoveredRange(range)}
              onMouseLeave={() => setHoveredRange(null)}
              onClick={() => setSelectedRange(range)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: range.color }}
                ></div>
                <span className="text-sm font-medium text-slate-700">{range.label}</span>
              </div>
              <p className="text-xs text-slate-500">{range.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Active Range Detail Panel */}
      {activeRange && (
        <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start gap-4">
            <div 
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${activeRange.color}20` }}
            >
              <Waves className="w-6 h-6" style={{ color: activeRange.color }} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800">{activeRange.label}</h4>
              <p className="text-sm text-slate-600 mt-1">{activeRange.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-slate-700">
                  <strong>Accuracy Impact:</strong> {activeRange.accuracyImpact}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode-specific info */}
      <div className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-teal-800 mb-1">
              {mode === 'fun' ? '💡 Did You Know?' : mode === 'researcher' ? 'Technical Note' : 'Specification Reference'}
            </h4>
            <p className="text-sm text-teal-700">{content.explanation}</p>
          </div>
        </div>
      </div>

      {/* Formula (researcher/spec mode) */}
      {(mode === 'researcher' || mode === 'spec') && (
        <div className="mt-4 p-4 bg-slate-100 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Io Definition</span>
          </div>
          <div className="font-mono text-sm text-slate-600 bg-white p-3 rounded-lg">
            Io = Total received power spectral density [dBm/15kHz]
            <br />
            Includes: Desired signal + Interference + Thermal noise
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Compact Io indicator for inline use
 */
interface CompactIoIndicatorProps {
  value: number;
  showLabel?: boolean;
}

export const CompactIoIndicator: React.FC<CompactIoIndicatorProps> = ({ value, showLabel = true }) => {
  const getRange = (val: number): IoRange => {
    if (val > -80) return IO_RANGES[0];
    if (val > -90) return IO_RANGES[1];
    if (val > -100) return IO_RANGES[2];
    return IO_RANGES[3];
  };

  const range = getRange(value);

  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: range.color }}
      ></div>
      {showLabel && (
        <span className="text-sm text-slate-600">{value} dBm</span>
      )}
    </div>
  );
};

export default IoRangeVisualizer;
