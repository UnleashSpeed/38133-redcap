/**
 * RLM Specification Tables Component
 * Interactive display of all tables from 3GPP TS 38.133 clause 8.1B
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, BookOpen, Filter, ChevronRight } from 'lucide-react';
import { ContentMode, RxConfig, FrequencyRange } from '../../types/rlm';

interface RLMSpecTablesProps {
  mode: ContentMode;
}

interface TableData {
  id: string;
  title: string;
  clause: string;
  description: string;
  headers: string[];
  rows: (string | number)[][];
}

// Table 8.1B.2.1-1: PDCCH parameters for out-of-sync
const tableOutOfSyncPDCCH: TableData = {
  id: 'out-of-sync-pdcch',
  title: 'Table 8.1B.2.1-1: PDCCH parameters for out-of-sync',
  clause: '8.1B.2.1',
  description: 'PDCCH parameters for evaluating out-of-sync state in SSB-based RLM.',
  headers: ['Parameter', '1Rx', '2Rx', 'Unit'],
  rows: [
    ['DCI format', '1-0', '1-0', '-'],
    ['OFDM symbols', '2', '2', 'symbols'],
    ['Aggregation level', '16', '8', 'CCE'],
    ['Bandwidth', '48', '24', 'PRBs'],
    ['Ratio of PDCCH REs to SSS REs', '4', '4', 'dB'],
  ],
};

// Table 8.1B.2.1-2: PDCCH parameters for in-sync
const tableInSyncPDCCH: TableData = {
  id: 'in-sync-pdcch',
  title: 'Table 8.1B.2.1-2: PDCCH parameters for in-sync',
  clause: '8.1B.2.1',
  description: 'PDCCH parameters for evaluating in-sync state in SSB-based RLM.',
  headers: ['Parameter', '1Rx', '2Rx', 'Unit'],
  rows: [
    ['DCI format', '1-0', '1-0', '-'],
    ['OFDM symbols', '2', '2', 'symbols'],
    ['Aggregation level', '8', '4', 'CCE'],
    ['Bandwidth', '48', '24', 'PRBs'],
    ['Ratio of PDCCH REs to SSS REs', '0', '0', 'dB'],
  ],
};

// Table 8.1B.2.2-1: TEvaluate_out for FR1 without DRX
const tableTEvaluateOutFR1: TableData = {
  id: 'tevaluate-out-fr1',
  title: 'Table 8.1B.2.2-1: TEvaluate_out for FR1 (no DRX)',
  clause: '8.1B.2.2',
  description: 'Evaluation period for out-of-sync detection in FR1 without DRX.',
  headers: ['Rx Config', 'Formula', 'Min Value'],
  rows: [
    ['2Rx', 'Max(200, Ceil(10×P)×TSSB)', '200 ms'],
    ['1Rx', 'Max(400, Ceil(20×P)×TSSB)', '400 ms'],
  ],
};

// Table 8.1B.2.2-2: TEvaluate_in for FR1 without DRX
const tableTEvaluateInFR1: TableData = {
  id: 'tevaluate-in-fr1',
  title: 'Table 8.1B.2.2-2: TEvaluate_in for FR1 (no DRX)',
  clause: '8.1B.2.2',
  description: 'Evaluation period for in-sync detection in FR1 without DRX.',
  headers: ['Rx Config', 'Formula', 'Min Value'],
  rows: [
    ['2Rx', 'Max(100, Ceil(2×P)×TSSB)', '100 ms'],
    ['1Rx', 'Max(200, Ceil(4×P)×TSSB)', '200 ms'],
  ],
};

// Table 8.1B.2.2-3: TEvaluate for FR2
const tableTEvaluateFR2: TableData = {
  id: 'tevaluate-fr2',
  title: 'Table 8.1B.2.2-3: TEvaluate for FR2 (N=8)',
  clause: '8.1B.2.2',
  description: 'Evaluation periods for FR2 with N=8 RLM resources.',
  headers: ['State', 'Rx Config', 'Formula', 'Min Value'],
  rows: [
    ['Out-of-sync', '2Rx', 'Max(200, Ceil(10×P×N)×TSSB)', '200 ms'],
    ['Out-of-sync', '1Rx', 'Max(400, Ceil(20×P×N)×TSSB)', '400 ms'],
    ['In-sync', '2Rx', 'Max(100, Ceil(2×P×N)×TSSB)', '100 ms'],
    ['In-sync', '1Rx', 'Max(200, Ceil(4×P×N)×TSSB)', '200 ms'],
  ],
};

// Table 8.1B.3.1-1: M values for CSI-RS based RLM
const tableMValuesCSI: TableData = {
  id: 'm-values-csi',
  title: 'Table 8.1B.3.1-1: M values for CSI-RS-based RLM',
  clause: '8.1B.3.1',
  description: 'Number of evaluations for CSI-RS-based radio link monitoring.',
  headers: ['Parameter', '2Rx', '1Rx'],
  rows: [
    ['M_out,RedCap', '20', '40'],
    ['M_in,RedCap', '10', '10'],
  ],
};

// Table 8.1B.1-1: N_RLM resources
const tableNRLMResources: TableData = {
  id: 'nrlm-resources',
  title: 'Table 8.1B.1-1: Maximum N_RLM resources',
  clause: '8.1B.1',
  description: 'Maximum number of RLM resources per frequency range.',
  headers: ['Frequency Range', 'Frequency', 'N_RLM'],
  rows: [
    ['FR1', '≤ 3 GHz', '2'],
    ['FR1', '> 3 GHz', '4'],
    ['FR2', '-', '8'],
  ],
};

// Table 8.1B.1-2: BLER thresholds
const tableBLERThresholds: TableData = {
  id: 'bler-thresholds',
  title: 'Table 8.1B.1-2: BLER thresholds for RedCap',
  clause: '8.1B.1',
  description: 'Block Error Rate thresholds for Qout and Qin detection.',
  headers: ['Parameter', 'Value', 'Description'],
  rows: [
    ['BLER_out,RedCap', '10%', 'Out-of-sync detection threshold'],
    ['BLER_in,RedCap', '2%', 'In-sync detection threshold'],
  ],
};

const allTables: TableData[] = [
  tableBLERThresholds,
  tableNRLMResources,
  tableOutOfSyncPDCCH,
  tableInSyncPDCCH,
  tableTEvaluateOutFR1,
  tableTEvaluateInFR1,
  tableTEvaluateFR2,
  tableMValuesCSI,
];

const modeContent = {
  fun: {
    title: 'The Rule Book',
    description: 'All the official rules about how your device checks signal quality!',
    filterLabel: 'Find Rules About...',
    expandLabel: 'Show me the details!',
  },
  researcher: {
    title: '3GPP TS 38.133 Tables',
    description: 'Complete reference of all tables from clause 8.1B for RedCap RLM.',
    filterLabel: 'Filter tables',
    expandLabel: 'View table details',
  },
  spec: {
    title: 'Specification Tables (clause 8.1B)',
    description: 'Per 3GPP TS 38.133 clause 8.1B: Radio Link Monitoring for RedCap.',
    filterLabel: 'Filter',
    expandLabel: 'Expand',
  },
};

interface InteractiveTableProps {
  table: TableData;
  mode: ContentMode;
  rxFilter: RxConfig | 'all';
  frFilter: FrequencyRange | 'all';
}

const InteractiveTable: React.FC<InteractiveTableProps> = ({ table, mode, rxFilter, frFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter rows based on Rx and FR filters
  const filteredRows = table.rows.filter((row) => {
    const rowStr = row.join(' ').toLowerCase();
    if (rxFilter !== 'all' && (rowStr.includes('1rx') || rowStr.includes('2rx'))) {
      if (!rowStr.includes(rxFilter.toLowerCase())) return false;
    }
    if (frFilter !== 'all' && (rowStr.includes('fr1') || rowStr.includes('fr2'))) {
      if (!rowStr.includes(frFilter.toLowerCase())) return false;
    }
    return true;
  });

  if (filteredRows.length === 0) return null;

  return (
    <motion.div
      layout
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
      >
        <div className="text-left">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">{table.title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{table.clause}</p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white dark:bg-gray-900">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{table.description}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      {table.headers.map((header, i) => (
                        <th
                          key={i}
                          className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="py-2 px-3 text-gray-600 dark:text-gray-400 font-mono"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const RLMSpecTables: React.FC<RLMSpecTablesProps> = ({ mode }) => {
  const [rxFilter, setRxFilter] = useState<RxConfig | 'all'>('all');
  const [frFilter, setFrFilter] = useState<FrequencyRange | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const content = modeContent[mode];

  const filteredTables = allTables.filter((table) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        table.title.toLowerCase().includes(searchLower) ||
        table.description.toLowerCase().includes(searchLower) ||
        table.rows.some((row) =>
          row.some((cell) => cell.toString().toLowerCase().includes(searchLower))
        )
      );
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-500" />
          {content.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{content.description}</p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        {/* Search */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={content.filterLabel}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
        </div>

        {/* Rx Filter */}
        <div className="flex gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 py-1">Rx:</span>
          {(['all', '1Rx', '2Rx'] as const).map((rx) => (
            <button
              key={rx}
              onClick={() => setRxFilter(rx)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                rxFilter === rx
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {rx === 'all' ? 'All' : rx}
            </button>
          ))}
        </div>

        {/* FR Filter */}
        <div className="flex gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 py-1">FR:</span>
          {(['all', 'FR1', 'FR2'] as const).map((fr) => (
            <button
              key={fr}
              onClick={() => setFrFilter(fr)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                frFilter === fr
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {fr === 'all' ? 'All' : fr}
            </button>
          ))}
        </div>
      </div>

      {/* Tables */}
      <div className="space-y-3">
        {filteredTables.map((table) => (
          <InteractiveTable
            key={table.id}
            table={table}
            mode={mode}
            rxFilter={rxFilter}
            frFilter={frFilter}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Legend</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div><span className="font-mono font-semibold">TSSB</span> - SSB period</div>
          <div><span className="font-mono font-semibold">MGRP</span> - Gap repetition</div>
          <div><span className="font-mono font-semibold">P</span> - P-factor</div>
          <div><span className="font-mono font-semibold">N</span> - RLM resources</div>
          <div><span className="font-mono font-semibold">AL</span> - Aggregation level</div>
          <div><span className="font-mono font-semibold">CCE</span> - Control channel element</div>
          <div><span className="font-mono font-semibold">PRB</span> - Physical resource block</div>
          <div><span className="font-mono font-semibold">DRX</span> - Discontinuous reception</div>
        </div>
      </div>
    </div>
  );
};

export default RLMSpecTables;
