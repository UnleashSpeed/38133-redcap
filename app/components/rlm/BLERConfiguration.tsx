/**
 * BLER Configuration Display Component
 * Shows BLER thresholds and configurations for RedCap RLM
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Percent, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { ContentMode } from '../../types/rlm';
import { BLER_THRESHOLDS, formatPercent } from '../../utils/rlmCalculations';

interface BLERConfigurationProps {
  mode: ContentMode;
}

const modeContent = {
  fun: {
    title: 'Error Rate Limits',
    description: 'How many errors are okay before we worry about the signal?',
    outOfSyncTitle: 'Too Many Errors! 🚨',
    inSyncTitle: 'Looking Good! ✅',
    outOfSyncDesc: 'When 1 in 10 messages has errors, things are getting bad!',
    inSyncDesc: 'When only 1 in 50 messages has errors, everything is fine!',
    config0Title: 'Standard Settings (Config #0)',
    visualizationLabel: 'Visual Guide',
    goodZone: 'Safe Zone',
    warningZone: 'Watch Out Zone',
    dangerZone: 'Danger Zone',
  },
  researcher: {
    title: 'BLER Threshold Configuration',
    description: 'Block Error Rate thresholds for RedCap radio link monitoring.',
    outOfSyncTitle: 'Out-of-Sync Threshold (Qout)',
    inSyncTitle: 'In-Sync Threshold (Qin)',
    outOfSyncDesc: 'BLER threshold indicating poor channel quality requiring RLF procedures.',
    inSyncDesc: 'BLER threshold indicating acceptable channel quality.',
    config0Title: 'Configuration #0 (Default)',
    visualizationLabel: 'BLER Zones',
    goodZone: 'In-Sync',
    warningZone: 'Evaluating',
    dangerZone: 'Out-of-Sync',
  },
  spec: {
    title: 'BLER Thresholds (TS 38.133 clause 8.1B.1)',
    description: 'Per clause 8.1B.1: BLER thresholds for RedCap RLM.',
    outOfSyncTitle: 'BLERout,RedCap',
    inSyncTitle: 'BLERin,RedCap',
    outOfSyncDesc: 'The downlink radio link quality is worse than Qout,RedCap.',
    inSyncDesc: 'The downlink radio link quality is better than Qin,RedCap.',
    config0Title: 'Configuration #0',
    visualizationLabel: 'BLER Range',
    goodZone: 'Qin,RedCap',
    warningZone: 'Transition',
    dangerZone: 'Qout,RedCap',
  },
};

export const BLERConfiguration: React.FC<BLERConfigurationProps> = ({ mode }) => {
  const content = modeContent[mode];
  
  const outOfSyncBLER = BLER_THRESHOLDS.outOfSync;
  const inSyncBLER = BLER_THRESHOLDS.inSync;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Percent className="w-6 h-6 text-rose-500" />
          {content.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{content.description}</p>
      </div>

      {/* BLER Threshold Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Out-of-Sync */}
        <motion.div
          className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-5 text-white"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-80">{content.outOfSyncTitle}</p>
              <p className="text-3xl font-bold">{formatPercent(outOfSyncBLER)}</p>
            </div>
          </div>
          <p className="text-sm opacity-90">{content.outOfSyncDesc}</p>
          {mode === 'spec' && (
            <p className="text-xs opacity-70 mt-2 font-mono">BLERout,RedCap = 0.10</p>
          )}
        </motion.div>

        {/* In-Sync */}
        <motion.div
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-80">{content.inSyncTitle}</p>
              <p className="text-3xl font-bold">{formatPercent(inSyncBLER)}</p>
            </div>
          </div>
          <p className="text-sm opacity-90">{content.inSyncDesc}</p>
          {mode === 'spec' && (
            <p className="text-xs opacity-70 mt-2 font-mono">BLERin,RedCap = 0.02</p>
          )}
        </motion.div>
      </div>

      {/* Configuration Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" />
          {content.config0Title}
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">BLERout,RedCap</p>
            <p className="font-mono text-gray-900 dark:text-white">0.10 (10%)</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">BLERin,RedCap</p>
            <p className="font-mono text-gray-900 dark:text-white">0.02 (2%)</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Hysteresis</p>
            <p className="font-mono text-gray-900 dark:text-white">{formatPercent(outOfSyncBLER - inSyncBLER)}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Ratio</p>
            <p className="font-mono text-gray-900 dark:text-white">{(outOfSyncBLER / inSyncBLER).toFixed(0)}:1</p>
          </div>
        </div>
      </div>

      {/* BLER Visualization */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{content.visualizationLabel}</h4>
        <div className="relative h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          {/* Zones */}
          <div
            className="absolute left-0 top-0 h-full bg-green-500/30 flex items-center justify-center"
            style={{ width: `${inSyncBLER * 100 * 5}%` }}
          >
            <span className="text-xs font-medium text-green-700 dark:text-green-300 px-2">
              {content.goodZone}
            </span>
          </div>
          <div
            className="absolute top-0 h-full bg-amber-500/30 flex items-center justify-center"
            style={{
              left: `${inSyncBLER * 100 * 5}%`,
              width: `${(outOfSyncBLER - inSyncBLER) * 100 * 5}%`,
            }}
          >
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300 px-2">
              {content.warningZone}
            </span>
          </div>
          <div
            className="absolute right-0 top-0 h-full bg-red-500/30 flex items-center justify-center"
            style={{ width: `${(20 - outOfSyncBLER * 100) * 5}%` }}
          >
            <span className="text-xs font-medium text-red-700 dark:text-red-300 px-2">
              {content.dangerZone}
            </span>
          </div>
          
          {/* Threshold markers */}
          <div
            className="absolute top-0 h-full w-0.5 bg-green-600"
            style={{ left: `${inSyncBLER * 100 * 5}%` }}
          >
            <span className="absolute -top-1 left-1 text-xs text-green-600 font-mono">
              {formatPercent(inSyncBLER)}
            </span>
          </div>
          <div
            className="absolute top-0 h-full w-0.5 bg-red-600"
            style={{ left: `${outOfSyncBLER * 100 * 5}%` }}
          >
            <span className="absolute -top-1 left-1 text-xs text-red-600 font-mono">
              {formatPercent(outOfSyncBLER)}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>5%</span>
          <span>10%</span>
          <span>15%</span>
          <span>20%</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          {mode === 'fun'
            ? 'The gap between 2% and 10% stops your device from flipping back and forth too quickly. It\'s like having a buffer zone!'
            : mode === 'researcher'
            ? 'The hysteresis between BLERin and BLERout prevents rapid state transitions (ping-pong effect) and provides stable link quality assessment.'
            : 'Per TS 38.133: The 5:1 ratio between BLERout and BLERin provides hysteresis to prevent oscillation between in-sync and out-of-sync states.'}
        </p>
      </div>
    </div>
  );
};

export default BLERConfiguration;
