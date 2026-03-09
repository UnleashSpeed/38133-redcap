/**
 * P-Factor Calculator Component
 * Interactive calculator for P-Factor formulas from 3GPP TS 38.133
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Info, Settings2 } from 'lucide-react';
import { usePFactorCalculator } from '../../hooks/usePFactorCalculator';
import { ContentMode, FrequencyRange } from '../../types/rlm';

interface PFactorCalculatorProps {
  mode: ContentMode;
}

const modeContent = {
  fun: {
    title: 'The Gap Multiplier Magic',
    description: 'When measurement gaps block your signal, this magic number tells you how much longer to wait!',
    fr1Label: 'Regular Bands (FR1)',
    fr2Label: 'Super Fast Bands (FR2)',
    gapOverlapLabel: 'Gaps Blocking Signal?',
    tSSBLabel: 'Signal Burst Time',
    mgrpLabel: 'Gap Repeat Time',
    resultLabel: 'Magic Multiplier',
    explanation: 'Think of P like a traffic jam multiplier - when gaps block your signal checks, you need more time to be sure!',
  },
  researcher: {
    title: 'P-Factor Calculator',
    description: 'Calculate the P-factor used in TEvaluate formulas to account for measurement gap impact on SSB monitoring.',
    fr1Label: 'FR1 (Sub-6 GHz)',
    fr2Label: 'FR2 (mmWave)',
    gapOverlapLabel: 'Gap Overlaps SSB',
    tSSBLabel: 'T_SSB (ms)',
    mgrpLabel: 'MGRP (ms)',
    resultLabel: 'P-Factor',
    explanation: 'The P-factor scales the evaluation period when measurement gaps prevent continuous SSB monitoring.',
  },
  spec: {
    title: 'P-Factor Calculation (TS 38.133)',
    description: 'Per clause 8.1B.2: P-factor calculation for TEvaluate_out and TEvaluate_in formulas.',
    fr1Label: 'Frequency Range 1',
    fr2Label: 'Frequency Range 2',
    gapOverlapLabel: 'Measurement Gap Overlaps SSB',
    tSSBLabel: 'T_SSB',
    mgrpLabel: 'MGRP',
    resultLabel: 'P',
    explanation: 'P-factor accounts for the unavailability of SSB during measurement gaps.',
  },
};

export const PFactorCalculator: React.FC<PFactorCalculatorProps> = ({ mode }) => {
  const {
    tSSB_ms,
    mgrp_ms,
    smtcDuration_ms,
    smtcPeriodicity_ms,
    frequencyRange,
    gapOverlap,
    setTSSB,
    setMGRP,
    setSMTCDuration,
    setSMTCPeriodicity,
    setFrequencyRange,
    setGapOverlap,
    pFactor,
    formula,
    explanation,
    tSSBOptions,
    mgrpOptions,
  } = usePFactorCalculator();

  const content = modeContent[mode];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-purple-500" />
          {content.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{content.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          {/* Frequency Range Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Settings2 className="w-4 h-4 inline mr-1" />
              Frequency Range
            </label>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFrequencyRange('FR1')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  frequencyRange === 'FR1'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {content.fr1Label}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFrequencyRange('FR2')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  frequencyRange === 'FR2'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {content.fr2Label}
              </motion.button>
            </div>
          </div>

          {/* Gap Overlap Toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={gapOverlap}
                  onChange={(e) => setGapOverlap(e.target.checked)}
                  className="sr-only"
                />
                <motion.div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    gapOverlap ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  animate={{ backgroundColor: gapOverlap ? '#3b82f6' : '#d1d5db' }}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5"
                    animate={{ left: gapOverlap ? '26px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.div>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {content.gapOverlapLabel}
              </span>
            </label>
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
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {value} ms
                </motion.button>
              ))}
            </div>
          </div>

          {/* MGRP Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {content.mgrpLabel}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {mgrpOptions.map((value) => (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMGRP(value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mgrp_ms === value
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {value}
                </motion.button>
              ))}
            </div>
          </div>

          {/* FR2 SMTC Options */}
          {frequencyRange === 'FR2' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">SMTC Configuration (FR2)</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">SMTC Duration (ms)</label>
                  <input
                    type="number"
                    value={smtcDuration_ms}
                    onChange={(e) => setSMTCDuration(parseFloat(e.target.value) || 0)}
                    min={0}
                    max={10}
                    step={0.5}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">SMTC Periodicity (ms)</label>
                  <input
                    type="number"
                    value={smtcPeriodicity_ms}
                    onChange={(e) => setSMTCPeriodicity(parseFloat(e.target.value) || 1)}
                    min={1}
                    max={160}
                    step={1}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Result Section */}
        <div className="space-y-4">
          {/* Formula Display */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Formula</p>
            <div className="text-lg font-mono text-center py-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              {mode === 'spec' ? (
                <span className="text-purple-600 dark:text-purple-400">{formula}</span>
              ) : (
                <code className="text-purple-600 dark:text-purple-400">{formula}</code>
              )}
            </div>
          </div>

          {/* P-Factor Result */}
          <motion.div
            className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-6 text-white"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-sm opacity-80 mb-1">{content.resultLabel}</p>
            <p className="text-4xl font-bold">{pFactor.toFixed(3)}</p>
            <p className="text-sm opacity-70 mt-2">
              {gapOverlap
                ? `Signal blocked ${((1 - 1 / pFactor) * 100).toFixed(1)}% of the time`
                : 'No blocking - P = 1'}
            </p>
          </motion.div>

          {/* Explanation */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                  {mode === 'fun' ? 'What does this mean?' : 'Explanation'}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400">{explanation}</p>
              </div>
            </div>
          </div>

          {/* Calculation Details */}
          {gapOverlap && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Calculation</p>
              <div className="space-y-1 text-sm font-mono text-gray-700 dark:text-gray-300">
                {frequencyRange === 'FR1' ? (
                  <>
                    <p>P = 1 / (1 - {tSSB_ms} / {mgrp_ms})</p>
                    <p>P = 1 / (1 - {(tSSB_ms / mgrp_ms).toFixed(3)})</p>
                    <p>P = 1 / {(1 - tSSB_ms / mgrp_ms).toFixed(3)}</p>
                    <p className="text-purple-600 dark:text-purple-400 font-semibold">P = {pFactor.toFixed(3)}</p>
                  </>
                ) : (
                  <>
                    <p>P₁ = 1 / (1 - {tSSB_ms} / {mgrp_ms}) = {(1 / (1 - tSSB_ms / mgrp_ms)).toFixed(3)}</p>
                    {smtcDuration_ms > 0 && smtcPeriodicity_ms > 0 && (
                      <>
                        <p>P₂ = 1 / (1 - {smtcDuration_ms} / {smtcPeriodicity_ms}) = {(1 / (1 - smtcDuration_ms / smtcPeriodicity_ms)).toFixed(3)}</p>
                        <p>P = P₁ × P₂</p>
                      </>
                    )}
                    <p className="text-purple-600 dark:text-purple-400 font-semibold">P = {pFactor.toFixed(3)}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PFactorCalculator;
