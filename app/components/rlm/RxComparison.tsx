/**
 * 1Rx vs 2Rx Comparison Component
 * Comprehensive comparison of single vs dual receiver RLM performance
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Antenna, Zap, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { ContentMode } from '../../types/rlm';
import {
  getOutOfSyncPDCCHParams,
  getInSyncPDCCHParams,
  getCSIRSMValues,
  calculateTEvaluateOut,
  calculateTEvaluateIn,
  formatMs,
} from '../../utils/rlmCalculations';

interface RxComparisonProps {
  mode: ContentMode;
}

const modeContent = {
  fun: {
    title: 'One Antenna vs Two Antennas',
    description: 'See how having two antennas makes everything faster and better!',
    rx1Title: 'One Antenna (1Rx)',
    rx2Title: 'Two Antennas (2Rx)',
    speedLabel: 'Speed Boost',
    pdcchLabel: 'Signal Check Settings',
    tevaluateLabel: 'Wait Times',
    csirsLabel: 'Special Signal Checks',
    advantageLabel: 'Why Two is Better',
    rx1Advantage: 'Simpler, cheaper device 📱',
    rx2Advantage: 'Double the speed! 🚀',
  },
  researcher: {
    title: '1Rx vs 2Rx Performance Comparison',
    description: 'Comparative analysis of single-receiver vs dual-receiver configurations for RedCap RLM.',
    rx1Title: '1Rx Configuration',
    rx2Title: '2Rx Configuration',
    speedLabel: 'Performance Ratio',
    pdcchLabel: 'PDCCH Parameters',
    tevaluateLabel: 'TEvaluate Periods',
    csirsLabel: 'CSI-RS M Values',
    advantageLabel: 'Key Advantage',
    rx1Advantage: 'Lower complexity and power consumption',
    rx2Advantage: '2x faster detection through diversity gain',
  },
  spec: {
    title: '1Rx vs 2Rx (TS 38.133)',
    description: 'Per 3GPP TS 38.133 clause 8.1B: Receiver configuration comparison.',
    rx1Title: '1Rx',
    rx2Title: '2Rx',
    speedLabel: 'Ratio',
    pdcchLabel: 'PDCCH (Tables 8.1B.2.1-X)',
    tevaluateLabel: 'TEvaluate (Tables 8.1B.2.2-X)',
    csirsLabel: 'M Values (Table 8.1B.3.1-1)',
    advantageLabel: 'Benefit',
    rx1Advantage: 'Reduced UE complexity',
    rx2Advantage: 'Diversity gain: 2x faster evaluation',
  },
};

interface ComparisonRowProps {
  label: string;
  value1: React.ReactNode;
  value2: React.ReactNode;
  highlight?: 'left' | 'right' | 'none';
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({ label, value1, value2, highlight = 'none' }) => (
  <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 dark:border-gray-800 items-center">
    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>
    <div
      className={`text-sm text-center py-2 rounded-lg ${
        highlight === 'left'
          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
          : 'text-gray-600 dark:text-gray-400'
      }`}
    >
      {value1}
    </div>
    <div
      className={`text-sm text-center py-2 rounded-lg ${
        highlight === 'right'
          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
          : 'text-gray-600 dark:text-gray-400'
      }`}
    >
      {value2}
    </div>
  </div>
);

export const RxComparison: React.FC<RxComparisonProps> = ({ mode }) => {
  const content = modeContent[mode];
  
  // Get PDCCH params
  const rx1OutParams = getOutOfSyncPDCCHParams('1Rx');
  const rx2OutParams = getOutOfSyncPDCCHParams('2Rx');
  const rx1InParams = getInSyncPDCCHParams('1Rx');
  const rx2InParams = getInSyncPDCCHParams('2Rx');
  
  // Get CSI-RS M values
  const rx1MValues = getCSIRSMValues('1Rx');
  const rx2MValues = getCSIRSMValues('2Rx');
  
  // Calculate TEvaluate examples
  const exampleConfig = {
    frequencyRange: 'FR1' as const,
    drxCycle: 'no-drx' as const,
    pFactor: 1.5,
    tSSB_ms: 20,
    nResources: 2,
  };
  
  const rx1OutTEval = calculateTEvaluateOut({ ...exampleConfig, rxConfig: '1Rx' });
  const rx2OutTEval = calculateTEvaluateOut({ ...exampleConfig, rxConfig: '2Rx' });
  const rx1InTEval = calculateTEvaluateIn({ ...exampleConfig, rxConfig: '1Rx' });
  const rx2InTEval = calculateTEvaluateIn({ ...exampleConfig, rxConfig: '2Rx' });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Antenna className="w-6 h-6 text-cyan-500" />
          {content.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{content.description}</p>
      </div>

      {/* Comparison Table Header */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div />
        <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <Antenna className="w-6 h-6 text-amber-500 mx-auto mb-1" />
          <p className="font-semibold text-gray-900 dark:text-white">{content.rx1Title}</p>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex justify-center gap-1 mb-1">
            <Antenna className="w-6 h-6 text-green-500" />
            <Antenna className="w-6 h-6 text-green-500" />
          </div>
          <p className="font-semibold text-gray-900 dark:text-white">{content.rx2Title}</p>
        </div>
      </div>

      {/* PDCCH Parameters */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          {content.pdcchLabel}
        </h4>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
          <ComparisonRow
            label="Out-of-Sync AL"
            value1={`${rx1OutParams.aggregationLevel} CCE`}
            value2={`${rx2OutParams.aggregationLevel} CCE`}
            highlight="right"
          />
          <ComparisonRow
            label="In-Sync AL"
            value1={`${rx1InParams.aggregationLevel} CCE`}
            value2={`${rx2InParams.aggregationLevel} CCE`}
            highlight="right"
          />
          <ComparisonRow
            label="Out-of-Sync BW"
            value1={`${rx1OutParams.bandwidthPRBs} PRBs`}
            value2={`${rx2OutParams.bandwidthPRBs} PRBs`}
            highlight="right"
          />
          <ComparisonRow
            label="In-Sync BW"
            value1={`${rx1InParams.bandwidthPRBs} PRBs`}
            value2={`${rx2InParams.bandwidthPRBs} PRBs`}
            highlight="right"
          />
        </div>
      </div>

      {/* TEvaluate Periods */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          {content.tevaluateLabel}
          <span className="text-xs font-normal text-gray-500">(Example: P=1.5, TSSB=20ms)</span>
        </h4>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
          <ComparisonRow
            label="Out-of-Sync (FR1)"
            value1={formatMs(rx1OutTEval.result_ms)}
            value2={formatMs(rx2OutTEval.result_ms)}
            highlight="right"
          />
          <ComparisonRow
            label="In-Sync (FR1)"
            value1={formatMs(rx1InTEval.result_ms)}
            value2={formatMs(rx2InTEval.result_ms)}
            highlight="right"
          />
          <ComparisonRow
            label="Formula Factor"
            value1="Ceil(20×P)×TSSB"
            value2="Ceil(10×P)×TSSB"
            highlight="right"
          />
        </div>
      </div>

      {/* CSI-RS M Values */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-purple-500" />
          {content.csirsLabel}
        </h4>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
          <ComparisonRow
            label="M_out"
            value1={rx1MValues.mOut}
            value2={rx2MValues.mOut}
            highlight="right"
          />
          <ComparisonRow
            label="M_in"
            value1={rx1MValues.mIn}
            value2={rx2MValues.mIn}
            highlight="none"
          />
        </div>
      </div>

      {/* Speed Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-4 text-white"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Antenna className="w-5 h-5" />
            <p className="font-semibold">{content.rx1Title}</p>
          </div>
          <p className="text-sm opacity-90">{content.rx1Advantage}</p>
          <div className="mt-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-lg font-bold">1×</span>
            <span className="text-sm opacity-80">baseline</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              <Antenna className="w-5 h-5" />
              <Antenna className="w-5 h-5 -ml-1" />
            </div>
            <p className="font-semibold">{content.rx2Title}</p>
          </div>
          <p className="text-sm opacity-90">{content.rx2Advantage}</p>
          <div className="mt-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-lg font-bold">2×</span>
            <span className="text-sm opacity-80">faster detection</span>
          </div>
        </motion.div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
          {mode === 'fun' ? '📊 The Bottom Line' : 'Summary'}
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          {mode === 'fun'
            ? 'Two antennas means your device can check the signal twice as fast! But one antenna is simpler and uses less battery. RedCap devices can choose what works best for them!'
            : mode === 'researcher'
            ? '2Rx configuration provides 2x faster RLM detection through receiver diversity, at the cost of increased complexity and power consumption. 1Rx is suitable for cost-sensitive RedCap devices.'
            : 'Per TS 38.133 clause 8.1B: 2Rx provides diversity gain with 2x faster TEvaluate periods and 2x lower M_out values. 1Rx is supported for reduced complexity RedCap UEs.'}
        </p>
      </div>
    </div>
  );
};

export default RxComparison;
