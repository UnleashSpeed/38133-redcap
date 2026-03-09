/**
 * L1RSRPDisplay.tsx
 * 
 * Layer 1 RSRP accuracy display component
 * Shows absolute and relative accuracy for SSB and CSI-RS based measurements
 */

import React from 'react';
import { Zap, Activity, Target, Radio, ArrowRight, Info } from 'lucide-react';

export type DisplayMode = 'fun' | 'researcher' | 'spec';
export type FrequencyRange = 'FR1' | 'FR2';
export type L1RSRPType = 'SSB' | 'CSI-RS';
export type Condition = 'normal' | 'extreme';

interface L1RSRPAccuracy {
  '1Rx': { normal: number; extreme: number };
  '2Rx': { normal: number; extreme: number };
}

interface L1RSRPDisplayProps {
  fr: FrequencyRange;
  l1Type: L1RSRPType;
  condition: Condition;
  mode: DisplayMode;
  showRelative?: boolean;
}

// L1-RSRP accuracy data from TS 38.133 clause 10.1A.2
const L1_RSRP_ABSOLUTE: Record<FrequencyRange, Record<L1RSRPType, L1RSRPAccuracy>> = {
  FR1: {
    SSB: { '1Rx': { normal: 7, extreme: 10 }, '2Rx': { normal: 5.5, extreme: 8.5 } },
    'CSI-RS': { '1Rx': { normal: 7, extreme: 10 }, '2Rx': { normal: 5.5, extreme: 8.5 } }
  },
  FR2: {
    SSB: { '1Rx': { normal: 8, extreme: 11 }, '2Rx': { normal: 6, extreme: 9 } },
    'CSI-RS': { '1Rx': { normal: 8, extreme: 11 }, '2Rx': { normal: 6, extreme: 9 } }
  }
};

// Relative accuracy only defined for FR1
const L1_RSRP_RELATIVE: Record<'FR1', L1RSRPAccuracy> = {
  FR1: { '1Rx': { normal: 6, extreme: 9 }, '2Rx': { normal: 5, extreme: 8 } }
};

export const L1RSRPDisplay: React.FC<L1RSRPDisplayProps> = ({
  fr,
  l1Type,
  condition,
  mode,
  showRelative = true
}) => {
  const absoluteData = L1_RSRP_ABSOLUTE[fr][l1Type];
  const relativeData = fr === 'FR1' ? L1_RSRP_RELATIVE.FR1 : null;

  const getModeContent = () => {
    switch (mode) {
      case 'fun':
        return {
          absoluteTitle: `⚡ ${l1Type} Beam Power Meter`,
          absoluteDesc: `L1-RSRP measures how strong ${l1Type} beams are at lightning speed!`,
          relativeTitle: '🎯 Beam Comparison Tool',
          relativeDesc: 'Relative accuracy helps compare different beams to find the best one!',
          tips: [
            '💨 L1 measurements are super fast - perfect for quick beam switching!',
            '📡 SSB beams help find the cell, CSI-RS beams help with data transfer',
            '🎯 Your phone uses this to always stay on the strongest signal!'
          ]
        };
      case 'researcher':
        return {
          absoluteTitle: `L1-RSRP Absolute Accuracy (${l1Type})`,
          absoluteDesc: `Absolute accuracy for ${l1Type}-based L1-RSRP measurements used in beam reporting.`,
          relativeTitle: 'L1-RSRP Relative Accuracy',
          relativeDesc: 'Relative accuracy for comparing L1-RSRP measurements between beams or cells.',
          tips: [
            'L1-RSRP reporting has reduced latency compared to RRC-layer measurements',
            'Critical for beam management in FR2 where beamforming is essential',
            'Measurement period: 40ms (FR1), 80ms (FR2) for SSB-based measurements'
          ]
        };
      case 'spec':
        return {
          absoluteTitle: `TS 38.133 clause 10.1A.2.1 - L1-RSRP Absolute Accuracy (${l1Type})`,
          absoluteDesc: `Absolute accuracy requirements for ${l1Type}-based L1-RSRP measurements.`,
          relativeTitle: 'TS 38.133 clause 10.1A.2.2 - L1-RSRP Relative Accuracy',
          relativeDesc: 'Relative accuracy requirements for L1-RSRP inter-beam comparison.',
          tips: [
            'Table 10.1A.2.1-1 (FR1), Table 10.1A.2.1-2 (FR2) for absolute accuracy',
            'Table 10.1A.2.2-1 for FR1 relative accuracy (not specified for FR2)',
            'Reporting range: -140 dBm to -44 dBm with 1 dB resolution'
          ]
        };
    }
  };

  const content = getModeContent();

  return (
    <div className="space-y-6">
      {/* Absolute Accuracy Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Zap className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{content.absoluteTitle}</h3>
            <p className="text-sm text-slate-500">{content.absoluteDesc}</p>
          </div>
        </div>

        {/* Accuracy Values */}
        <div className="grid grid-cols-2 gap-6">
          {/* 1Rx */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Radio className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">1Rx Configuration</span>
            </div>
            <div className="text-4xl font-bold text-blue-700 mb-2">
              ±{absoluteData['1Rx'][condition]} dB
            </div>
            <div className="text-xs text-blue-500">Single receive antenna</div>
            
            {/* Condition indicator */}
            <div className="mt-4 flex justify-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                condition === 'normal' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {condition === 'normal' ? 'Normal Conditions' : 'Extreme Conditions'}
              </span>
            </div>
          </div>

          {/* 2Rx */}
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">2Rx Configuration</span>
            </div>
            <div className="text-4xl font-bold text-green-700 mb-2">
              ±{absoluteData['2Rx'][condition]} dB
            </div>
            <div className="text-xs text-green-500">Dual receive antennas</div>
            
            {/* Improvement badge */}
            <div className="mt-4 flex justify-center">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                {(absoluteData['1Rx'][condition] - absoluteData['2Rx'][condition]).toFixed(1)} dB better
              </span>
            </div>
          </div>
        </div>

        {/* Comparison bar */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">2Rx Improvement</span>
            <span className="text-lg font-bold text-purple-600">
              {(absoluteData['1Rx'][condition] - absoluteData['2Rx'][condition]).toFixed(1)} dB
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${(1 - absoluteData['2Rx'][condition] / absoluteData['1Rx'][condition]) * 100}%` 
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>1Rx: ±{absoluteData['1Rx'][condition]} dB</span>
            <ArrowRight className="w-4 h-4" />
            <span>2Rx: ±{absoluteData['2Rx'][condition]} dB</span>
          </div>
        </div>
      </div>

      {/* Relative Accuracy (FR1 only) */}
      {showRelative && relativeData && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">{content.relativeTitle}</h3>
              <p className="text-sm text-slate-500">{content.relativeDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* 1Rx Relative */}
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border-2 border-indigo-200 text-center">
              <div className="text-sm text-indigo-600 font-medium mb-2">1Rx Configuration</div>
              <div className="text-4xl font-bold text-indigo-700">±{relativeData['1Rx'][condition]} dB</div>
              <div className="text-xs text-indigo-500 mt-2">Inter-beam comparison</div>
            </div>

            {/* 2Rx Relative */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 text-center">
              <div className="text-sm text-purple-600 font-medium mb-2">2Rx Configuration</div>
              <div className="text-4xl font-bold text-purple-700">±{relativeData['2Rx'][condition]} dB</div>
              <div className="text-xs text-purple-500 mt-2">Inter-beam comparison</div>
            </div>
          </div>

          {mode === 'researcher' && (
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-700">
              <strong>Relative Accuracy:</strong> Measures the difference between two L1-RSRP 
              measurements from the same or different cells/beams. Critical for beam comparison 
              and handover decisions where relative differences matter more than absolute values.
            </div>
          )}

          {mode === 'spec' && (
            <div className="mt-4 p-3 bg-slate-100 rounded-lg text-xs text-slate-600 font-mono">
              Reference: TS 38.133 Table 10.1A.2.2-1 (FR1 only)
            </div>
          )}
        </div>
      )}

      {/* Tips / Info */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-800 mb-2">
              {mode === 'fun' ? '💡 Did You Know?' : mode === 'researcher' ? 'Technical Notes' : 'Specification Notes'}
            </h4>
            <ul className="space-y-1">
              {content.tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-amber-700">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Compact L1-RSRP indicator for inline display
 */
interface CompactL1IndicatorProps {
  fr: FrequencyRange;
  condition: Condition;
}

export const CompactL1Indicator: React.FC<CompactL1IndicatorProps> = ({ fr, condition }) => {
  const data = L1_RSRP_ABSOLUTE[fr].SSB;
  
  return (
    <div className="flex gap-2">
      <div className="px-3 py-2 bg-blue-100 rounded-lg text-center">
        <div className="text-xs text-blue-600">1Rx</div>
        <div className="font-bold text-blue-700">±{data['1Rx'][condition]}</div>
      </div>
      <div className="px-3 py-2 bg-green-100 rounded-lg text-center">
        <div className="text-xs text-green-600">2Rx</div>
        <div className="font-bold text-green-700">±{data['2Rx'][condition]}</div>
      </div>
    </div>
  );
};

export default L1RSRPDisplay;
