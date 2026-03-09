/**
 * TEvaluate Calculator Component
 * Interactive calculator for TEvaluate_out and TEvaluate_in periods
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { useTEvaluateCalculator } from '../../hooks/useTEvaluateCalculator';
import { ContentMode, RxConfig, FrequencyRange } from '../../types/rlm';

interface TEvaluateCalculatorProps {
  mode: ContentMode;
}

const modeContent = {
  fun: {
    title: 'How Long to Wait?',
    description: 'Figure out how long the device waits before deciding if the signal is good or bad!',
    fr1Label: 'Regular Bands',
    fr2Label: 'Super Fast Bands',
    rx1Label: 'One Antenna',
    rx2Label: 'Two Antennas',
    outOfSyncLabel: 'Detecting Bad Signal',
    inSyncLabel: 'Detecting Good Signal',
    pFactorLabel: 'Gap Multiplier (P)',
    tSSBLabel: 'Signal Check Time',
    nResourcesLabel: 'Resources (N)',
    drxLabel: 'Sleep Mode (DRX)',
    resultLabel: 'Wait Time',
    formulaLabel: 'The Magic Formula',
  },
  researcher: {
    title: 'TEvaluate Period Calculator',
    description: 'Calculate evaluation periods for out-of-sync and in-sync detection per 3GPP TS 38.133.',
    fr1Label: 'FR1',
    fr2Label: 'FR2',
    rx1Label: '1Rx',
    rx2Label: '2Rx',
    outOfSyncLabel: 'Out-of-Sync Detection',
    inSyncLabel: 'In-Sync Detection',
    pFactorLabel: 'P-Factor',
    tSSBLabel: 'T_SSB (ms)',
    nResourcesLabel: 'N (RLM Resources)',
    drxLabel: 'DRX Cycle',
    resultLabel: 'TEvaluate',
    formulaLabel: 'Formula',
  },
  spec: {
    title: 'TEvaluate Calculation (TS 38.133)',
    description: 'Per clause 8.1B.2.2: TEvaluate_out and TEvaluate_in for SSB-based RLM.',
    fr1Label: 'FR1',
    fr2Label: 'FR2',
    rx1Label: '1Rx',
    rx2Label: '2Rx',
    outOfSyncLabel: 'TEvaluate_out',
    inSyncLabel: 'TEvaluate_in',
    pFactorLabel: 'P',
    tSSBLabel: 'T_SSB',
    nResourcesLabel: 'N',
    drxLabel: 'DRX Cycle',
    resultLabel: 'TEvaluate',
    formulaLabel: 'Formula (Table 8.1B.2.2-X)',
  },
};

export const TEvaluateCalculator: React.FC<TEvaluateCalculatorProps> = ({ mode }) => {
  const {
    frequencyRange,
    rxConfig,
    drxCycle,
    pFactor,
    tSSB_ms,
    nResources,
    syncState,
    setFrequencyRange,
    setRxConfig,
    setDRXCycle,
    setPFactor,
    setTSSB,
    setNResources,
    setSyncState,
    result,
    tSSBOptions,
    drxOptions,
    nResourceOptions,
  } = useTEvaluateCalculator();

  const content = modeContent[mode];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-amber-500" />
          {content.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{content.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          {/* Sync State Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Detection Type
            </label>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSyncState('out')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  syncState === 'out'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                {content.outOfSyncLabel}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSyncState('in')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  syncState === 'in'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                {content.inSyncLabel}
              </motion.button>
            </div>
          </div>

          {/* Frequency Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frequency Range
            </label>
            <div className="flex gap-2">
              {(['FR1', 'FR2'] as FrequencyRange[]).map((fr) => (
                <motion.button
                  key={fr}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFrequencyRange(fr)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    frequencyRange === fr
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {fr === 'FR1' ? content.fr1Label : content.fr2Label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Rx Configuration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Zap className="w-4 h-4 inline mr-1" />
              Receiver Configuration
            </label>
            <div className="flex gap-2">
              {(['1Rx', '2Rx'] as RxConfig[]).map((rx) => (
                <motion.button
                  key={rx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRxConfig(rx)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    rxConfig === rx
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {rx === '1Rx' ? content.rx1Label : content.rx2Label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* P-Factor Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {content.pFactorLabel}: <span className="text-purple-600 dark:text-purple-400">{pFactor.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={pFactor}
              onChange={(e) => setPFactor(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1.0 (no gaps)</span>
              <span>5.0 (heavy gaps)</span>
            </div>
          </div>

          {/* T_SSB Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {content.tSSBLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {tSSBOptions.map((value) => (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTSSB(value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tSSB_ms === value
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {value} ms
                </motion.button>
              ))}
            </div>
          </div>

          {/* N Resources (FR2 only) */}
          {frequencyRange === 'FR2' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {content.nResourcesLabel}
              </label>
              <div className="flex gap-2">
                {nResourceOptions.map((value) => (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setNResources(value)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      nResources === value
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* DRX Cycle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {content.drxLabel}
            </label>
            <select
              value={drxCycle}
              onChange={(e) => setDRXCycle(e.target.value as typeof drxCycle)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              {drxOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'no-drx' ? 'No DRX' : option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Section */}
        <div className="space-y-4">
          {/* Formula Display */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              {content.formulaLabel}
            </p>
            <div className="text-center py-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <code className="text-sm text-amber-600 dark:text-amber-400 font-mono">
                {result.formula}
              </code>
            </div>
          </div>

          {/* Result Display */}
          <motion.div
            className={`rounded-lg p-6 text-white ${
              syncState === 'out'
                ? 'bg-gradient-to-br from-red-500 to-orange-600'
                : 'bg-gradient-to-br from-green-500 to-emerald-600'
            }`}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-sm opacity-80 mb-1">{content.resultLabel}</p>
            <p className="text-4xl font-bold">{result.result_ms} ms</p>
            <p className="text-sm opacity-70 mt-2">{result.result_sf} subframes</p>
          </motion.div>

          {/* Calculation Steps */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Calculation</p>
            <div className="space-y-2 text-sm">
              <code className="block text-gray-700 dark:text-gray-300 font-mono">
                {result.calculation}
              </code>
            </div>
          </div>

          {/* 1Rx vs 2Rx Comparison */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
              {mode === 'fun' ? 'One vs Two Antennas' : '1Rx vs 2Rx Comparison'}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className={`p-3 rounded-lg ${rxConfig === '1Rx' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}>
                <p className="font-medium text-gray-700 dark:text-gray-300">1Rx</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {syncState === 'out' ? 'Ceil(20×P)×T_SSB' : 'Ceil(4×P)×T_SSB'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Max({syncState === 'out' ? '400' : '200'}, ...)
                </p>
              </div>
              <div className={`p-3 rounded-lg ${rxConfig === '2Rx' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}>
                <p className="font-medium text-gray-700 dark:text-gray-300">2Rx</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {syncState === 'out' ? 'Ceil(10×P)×T_SSB' : 'Ceil(2×P)×T_SSB'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Max({syncState === 'out' ? '200' : '100'}, ...)
                </p>
              </div>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              {mode === 'fun'
                ? 'Two antennas work twice as fast! 🚀'
                : '2Rx provides 2x faster detection due to diversity gain.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TEvaluateCalculator;
