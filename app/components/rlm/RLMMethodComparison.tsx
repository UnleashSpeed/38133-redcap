/**
 * RLM Method Comparison Component
 * Compares SSB-based vs CSI-RS based RLM
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Wifi, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { ContentMode, RxConfig } from '../../types/rlm';
import { getOutOfSyncPDCCHParams, getInSyncPDCCHParams, getCSIRSMValues, formatPercent } from '../../utils/rlmCalculations';

interface RLMMethodComparisonProps {
  mode: ContentMode;
}

const modeContent = {
  fun: {
    title: 'Two Ways to Watch Your Signal',
    description: 'Compare the two different methods your device uses to check if the signal is still good!',
    ssbTitle: 'Using Signal Beacons (SSB)',
    csirsTitle: 'Using Special Reference Signals (CSI-RS)',
    ssbDesc: 'Like checking lighthouse beacons - reliable and always there!',
    csirsDesc: 'Like using special spy signals - more flexible but needs setup!',
    prosLabel: 'Good Stuff 👍',
    consLabel: 'Tricky Parts 🤔',
  },
  researcher: {
    title: 'SSB-based vs CSI-RS-based RLM',
    description: 'Comparison of RLM methods per 3GPP TS 38.133 clause 8.1B.2 and 8.1B.3.',
    ssbTitle: 'SSB-based RLM',
    csirsTitle: 'CSI-RS-based RLM',
    ssbDesc: 'Uses Synchronization Signal Blocks for link quality monitoring.',
    csirsDesc: 'Uses Channel State Information Reference Signals for link quality monitoring.',
    prosLabel: 'Advantages',
    consLabel: 'Limitations',
  },
  spec: {
    title: 'RLM Methods (TS 38.133 clause 8.1B)',
    description: 'Per clause 8.1B.2 (SSB-based) and 8.1B.3 (CSI-RS-based).',
    ssbTitle: 'SSB-based RLM (8.1B.2)',
    csirsTitle: 'CSI-RS-based RLM (8.1B.3)',
    ssbDesc: 'Reference signals: SSB (PBCH-DMRS, SSS).',
    csirsDesc: 'Reference signals: CSI-RS configured for RLM.',
    prosLabel: 'Characteristics',
    consLabel: 'Constraints',
  },
};

interface ComparisonCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({
  title,
  description,
  icon,
  color,
  isActive,
  onClick,
  children,
}) => (
  <motion.div
    layout
    onClick={onClick}
    className={`cursor-pointer rounded-xl border-2 transition-all ${
      isActive
        ? `border-${color}-500 shadow-lg`
        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
    }`}
  >
    <div className={`p-4 ${isActive ? `bg-${color}-50 dark:bg-${color}-900/20` : 'bg-white dark:bg-gray-900'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isActive ? `bg-${color}-500 text-white` : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </div>
    </div>
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export const RLMMethodComparison: React.FC<RLMMethodComparisonProps> = ({ mode }) => {
  const [activeMethod, setActiveMethod] = useState<'SSB' | 'CSI-RS' | null>('SSB');
  const [rxConfig, setRxConfig] = useState<RxConfig>('2Rx');
  
  const content = modeContent[mode];
  const outOfSyncParams = getOutOfSyncPDCCHParams(rxConfig);
  const inSyncParams = getInSyncPDCCHParams(rxConfig);
  const csirsValues = getCSIRSMValues(rxConfig);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Radio className="w-6 h-6 text-indigo-500" />
          {content.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{content.description}</p>
      </div>

      {/* Rx Config Toggle */}
      <div className="mb-6 flex justify-end">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(['1Rx', '2Rx'] as RxConfig[]).map((rx) => (
            <button
              key={rx}
              onClick={() => setRxConfig(rx)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                rxConfig === rx
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {rx}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="space-y-4">
        {/* SSB Card */}
        <ComparisonCard
          title={content.ssbTitle}
          description={content.ssbDesc}
          icon={<Radio className="w-5 h-5" />}
          color="blue"
          isActive={activeMethod === 'SSB'}
          onClick={() => setActiveMethod(activeMethod === 'SSB' ? null : 'SSB')}
        >
          <div className="space-y-4">
            {/* PDCCH Parameters */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {mode === 'spec' ? 'PDCCH Parameters (Tables 8.1B.2.1-1, 8.1B.2.1-2)' : 'PDCCH Parameters'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Out-of-Sync</p>
                  <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <p>AL: {outOfSyncParams.aggregationLevel} CCE</p>
                    <p>BW: {outOfSyncParams.bandwidthPRBs} PRBs</p>
                    <p>Ratio: {outOfSyncParams.ratioPDCCHtoSSS_dB} dB</p>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">In-Sync</p>
                  <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <p>AL: {inSyncParams.aggregationLevel} CCE</p>
                    <p>BW: {inSyncParams.bandwidthPRBs} PRBs</p>
                    <p>Ratio: {inSyncParams.ratioPDCCHtoSSS_dB} dB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pros/Cons */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">{content.prosLabel}</p>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    Always available
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    No additional config
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    Wide beam coverage
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">{content.consLabel}</p>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-1">
                    <X className="w-3 h-3 text-amber-500" />
                    Fixed periodicity
                  </li>
                  <li className="flex items-center gap-1">
                    <X className="w-3 h-3 text-amber-500" />
                    May be suboptimal
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ComparisonCard>

        {/* CSI-RS Card */}
        <ComparisonCard
          title={content.csirsTitle}
          description={content.csirsDesc}
          icon={<Wifi className="w-5 h-5" />}
          color="purple"
          isActive={activeMethod === 'CSI-RS'}
          onClick={() => setActiveMethod(activeMethod === 'CSI-RS' ? null : 'CSI-RS')}
        >
          <div className="space-y-4">
            {/* M Values */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {mode === 'spec' ? 'M Values (clause 8.1B.3)' : 'Evaluation Counts'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">M_out</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{csirsValues.mOut}</p>
                  <p className="text-xs text-gray-500">evaluations</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">M_in</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{csirsValues.mIn}</p>
                  <p className="text-xs text-gray-500">evaluations</p>
                </div>
              </div>
            </div>

            {/* CSI-RS Periodicity */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                T_CSI-RS Options
              </p>
              <div className="flex gap-2 flex-wrap">
                {[5, 10, 20, 40].map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-sm"
                  >
                    {t} ms
                  </span>
                ))}
              </div>
            </div>

            {/* Pros/Cons */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">{content.prosLabel}</p>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    Flexible periodicity
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    Beam-specific
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    Better for mobility
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">{content.consLabel}</p>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-1">
                    <X className="w-3 h-3 text-amber-500" />
                    Requires configuration
                  </li>
                  <li className="flex items-center gap-1">
                    <X className="w-3 h-3 text-amber-500" />
                    Additional overhead
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ComparisonCard>
      </div>

      {/* Summary Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Parameter</th>
              <th className="text-center py-2 px-3 font-medium text-blue-600 dark:text-blue-400">SSB-based</th>
              <th className="text-center py-2 px-3 font-medium text-purple-600 dark:text-purple-400">CSI-RS-based</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-2 px-3">Reference Signal</td>
              <td className="text-center py-2 px-3">SSB (PBCH-DMRS, SSS)</td>
              <td className="text-center py-2 px-3">CSI-RS</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-2 px-3">Periodicity</td>
              <td className="text-center py-2 px-3">Fixed (5-160 ms)</td>
              <td className="text-center py-2 px-3">Configurable (5-40 ms)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-2 px-3">BLER Thresholds</td>
              <td className="text-center py-2 px-3">{formatPercent(0.1)} / {formatPercent(0.02)}</td>
              <td className="text-center py-2 px-3">{formatPercent(0.1)} / {formatPercent(0.02)}</td>
            </tr>
            <tr>
              <td className="py-2 px-3">Evaluation Count ({rxConfig})</td>
              <td className="text-center py-2 px-3">Based on TEvaluate</td>
              <td className="text-center py-2 px-3">M_out={csirsValues.mOut}, M_in={csirsValues.mIn}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RLMMethodComparison;
