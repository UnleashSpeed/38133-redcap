/**
 * AccuracyTable.tsx
 * 
 * Interactive accuracy table with expandable details
 * Shows all accuracy values from 3GPP TS 38.133 clause 10.1A
 */

import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Download, Copy, Check } from 'lucide-react';

export type DisplayMode = 'fun' | 'researcher' | 'spec';
export type FrequencyRange = 'FR1' | 'FR2';
export type MetricType = 'RSRP' | 'RSRQ' | 'SINR' | 'L1-RSRP';

interface AccuracyValue {
  normal: number;
  extreme: number;
}

interface IoRangeAccuracy {
  range: string;
  '1Rx': AccuracyValue;
  '2Rx': AccuracyValue;
}

interface AccuracyTableProps {
  metric: MetricType;
  fr: FrequencyRange;
  mode: DisplayMode;
  data?: IoRangeAccuracy[];
  expandable?: boolean;
  showExport?: boolean;
}

// Complete accuracy data from TS 38.133
const ACCURACY_DATA: Record<string, Record<string, IoRangeAccuracy[]>> = {
  RSRP: {
    FR1: [
      { range: 'Io > -80 dBm', '1Rx': { normal: 7, extreme: 10 }, '2Rx': { normal: 5.5, extreme: 8.5 } },
      { range: '-80 ≥ Io > -90 dBm', '1Rx': { normal: 9, extreme: 12 }, '2Rx': { normal: 7.5, extreme: 10.5 } },
      { range: '-90 ≥ Io > -100 dBm', '1Rx': { normal: 11, extreme: 14 }, '2Rx': { normal: 11, extreme: 14 } },
    ],
    FR2: [
      { range: 'All Io ranges', '1Rx': { normal: 8, extreme: 11 }, '2Rx': { normal: 6, extreme: 9 } },
    ]
  },
  RSRQ: {
    FR1: [
      { range: 'All Io ranges', '1Rx': { normal: 3.5, extreme: 6.5 }, '2Rx': { normal: 3, extreme: 6 } },
    ],
    FR2: [
      { range: 'All Io ranges', '1Rx': { normal: 4.5, extreme: 7.5 }, '2Rx': { normal: 3.5, extreme: 6.5 } },
    ]
  },
  SINR: {
    FR1: [
      { range: 'All Io ranges', '1Rx': { normal: 3.5, extreme: 6.5 }, '2Rx': { normal: 3, extreme: 6 } },
    ],
    FR2: [
      { range: 'All Io ranges', '1Rx': { normal: 4.5, extreme: 7.5 }, '2Rx': { normal: 3.5, extreme: 6.5 } },
    ]
  },
  'L1-RSRP': {
    FR1: [
      { range: 'SSB - All Io', '1Rx': { normal: 7, extreme: 10 }, '2Rx': { normal: 5.5, extreme: 8.5 } },
      { range: 'CSI-RS - All Io', '1Rx': { normal: 7, extreme: 10 }, '2Rx': { normal: 5.5, extreme: 8.5 } },
    ],
    FR2: [
      { range: 'SSB - All Io', '1Rx': { normal: 8, extreme: 11 }, '2Rx': { normal: 6, extreme: 9 } },
      { range: 'CSI-RS - All Io', '1Rx': { normal: 8, extreme: 11 }, '2Rx': { normal: 6, extreme: 9 } },
    ]
  }
};

const TABLE_REFERENCES: Record<string, Record<string, string>> = {
  RSRP: { FR1: 'Table 10.1A.1.1-1', FR2: 'Table 10.1A.1.1-2' },
  RSRQ: { FR1: 'Table 10.1A.1.2-1', FR2: 'Table 10.1A.1.2-2' },
  SINR: { FR1: 'Table 10.1A.1.3-1', FR2: 'Table 10.1A.1.3-2' },
  'L1-RSRP': { FR1: 'Table 10.1A.2.1-1', FR2: 'Table 10.1A.2.1-2' }
};

export const AccuracyTable: React.FC<AccuracyTableProps> = ({
  metric,
  fr,
  mode,
  data: propData,
  expandable = true,
  showExport = true
}) => {
  const [expanded, setExpanded] = useState(!expandable);
  const [copied, setCopied] = useState(false);

  const data = propData || ACCURACY_DATA[metric]?.[fr] || [];
  const tableRef = TABLE_REFERENCES[metric]?.[fr] || '';

  const handleCopy = () => {
    const csv = generateCSV(data);
    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCSV = (tableData: IoRangeAccuracy[]): string => {
    const headers = ['Io Range', '1Rx Normal (dB)', '1Rx Extreme (dB)', '2Rx Normal (dB)', '2Rx Extreme (dB)'];
    const rows = tableData.map(row => [
      row.range,
      row['1Rx'].normal.toString(),
      row['1Rx'].extreme.toString(),
      row['2Rx'].normal.toString(),
      row['2Rx'].extreme.toString()
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  const getBestAccuracy = () => {
    const allValues = data.flatMap(d => [
      d['1Rx'].normal, d['1Rx'].extreme,
      d['2Rx'].normal, d['2Rx'].extreme
    ]);
    return Math.min(...allValues);
  };

  const getWorstAccuracy = () => {
    const allValues = data.flatMap(d => [
      d['1Rx'].normal, d['1Rx'].extreme,
      d['2Rx'].normal, d['2Rx'].extreme
    ]);
    return Math.max(...allValues);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div 
        className={`
          w-full p-4 flex items-center justify-between 
          ${expandable ? 'bg-slate-50 hover:bg-slate-100 cursor-pointer' : 'bg-slate-50'}
          transition-colors
        `}
        onClick={() => expandable && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-slate-600" />
          <div>
            <span className="font-semibold text-slate-800">
              {metric} Accuracy Table ({fr})
            </span>
            {mode === 'spec' && tableRef && (
              <span className="ml-2 text-xs text-slate-500 font-mono">
                {tableRef}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showExport && expanded && (
            <button
              onClick={(e) => { e.stopPropagation(); handleCopy(); }}
              className="p-2 hover:bg-white rounded-lg transition-colors text-slate-500 hover:text-blue-600"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
          {expandable && (
            expanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </div>
      </div>

      {/* Table Content */}
      {expanded && (
        <div className="p-4">
          {/* Summary Stats */}
          <div className="flex gap-4 mb-4">
            <div className="px-3 py-1 bg-green-100 rounded-full text-sm">
              <span className="text-green-700 font-medium">Best: ±{getBestAccuracy()} dB</span>
            </div>
            <div className="px-3 py-1 bg-red-100 rounded-full text-sm">
              <span className="text-red-700 font-medium">Worst: ±{getWorstAccuracy()} dB</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-3 text-left text-sm font-semibold text-slate-700 rounded-tl-lg">
                    Io Range
                  </th>
                  <th className="p-3 text-center text-sm font-semibold text-slate-700 bg-blue-50" colSpan={2}>
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      1Rx
                    </div>
                  </th>
                  <th className="p-3 text-center text-sm font-semibold text-slate-700 bg-green-50" colSpan={2}>
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      2Rx
                    </div>
                  </th>
                </tr>
                <tr className="bg-slate-50">
                  <th className="p-2"></th>
                  <th className="p-2 text-center text-xs font-medium text-blue-600 bg-blue-50/50">Normal</th>
                  <th className="p-2 text-center text-xs font-medium text-blue-600 bg-blue-50/50">Extreme</th>
                  <th className="p-2 text-center text-xs font-medium text-green-600 bg-green-50/50">Normal</th>
                  <th className="p-2 text-center text-xs font-medium text-green-600 bg-green-50/50">Extreme</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className="border-t border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-3 text-sm text-slate-700 font-medium">{row.range}</td>
                    <td className="p-3 text-center text-sm font-bold text-blue-600 bg-blue-50/30">
                      ±{row['1Rx'].normal}
                    </td>
                    <td className="p-3 text-center text-sm font-bold text-blue-500 bg-blue-50/30">
                      ±{row['1Rx'].extreme}
                    </td>
                    <td className="p-3 text-center text-sm font-bold text-green-600 bg-green-50/30">
                      ±{row['2Rx'].normal}
                    </td>
                    <td className="p-3 text-center text-sm font-bold text-green-500 bg-green-50/30">
                      ±{row['2Rx'].extreme}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></span>
              <span>1Rx: Single receive antenna</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-green-100 border border-green-300"></span>
              <span>2Rx: Dual receive antennas</span>
            </div>
          </div>

          {/* Mode-specific footer */}
          {mode === 'spec' && (
            <div className="mt-4 p-3 bg-slate-100 rounded-lg text-xs text-slate-600 font-mono">
              <div>Document: 3GPP TS 38.133</div>
              <div>Section: 10.1A.1.{metric === 'RSRP' ? '1' : metric === 'RSRQ' ? '2' : metric === 'SINR' ? '3' : '2.1'}</div>
              <div>Reference: {tableRef}</div>
            </div>
          )}

          {mode === 'researcher' && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
              <strong>Note:</strong> All values in dB represent maximum allowed measurement error. 
              Lower values indicate better accuracy. 2Rx provides diversity gain improving accuracy 
              by 0.5-2 dB depending on Io range and conditions.
            </div>
          )}

          {mode === 'fun' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
              💡 <strong>Remember:</strong> Smaller numbers mean better accuracy! 
              2Rx (two antennas) is like having super hearing - you get more precise measurements!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Compact table for inline display
 */
interface CompactAccuracyTableProps {
  metric: MetricType;
  fr: FrequencyRange;
}

export const CompactAccuracyTable: React.FC<CompactAccuracyTableProps> = ({ metric, fr }) => {
  const data = ACCURACY_DATA[metric]?.[fr]?.[0];
  
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="p-2 bg-blue-50 rounded text-center">
        <div className="text-xs text-blue-500">1Rx Normal</div>
        <div className="font-bold text-blue-700">±{data['1Rx'].normal} dB</div>
      </div>
      <div className="p-2 bg-green-50 rounded text-center">
        <div className="text-xs text-green-500">2Rx Normal</div>
        <div className="font-bold text-green-700">±{data['2Rx'].normal} dB</div>
      </div>
    </div>
  );
};

export default AccuracyTable;
