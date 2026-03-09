/**
 * RLM Signal Simulator Component
 * Visualizes signal degradation through Qout/Qin thresholds
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import { Activity, AlertTriangle, CheckCircle, Play, Pause, RotateCcw, Signal } from 'lucide-react';
import { useRLMSimulator } from '../../hooks/useRLMSimulator';
import { ContentMode, SyncState } from '../../types/rlm';
import { BLER_THRESHOLDS, formatPercent } from '../../utils/rlmCalculations';

interface RLMSignalSimulatorProps {
  mode: ContentMode;
}

const modeContent = {
  fun: {
    title: 'Signal Strength Adventure',
    description: 'Watch your signal go on a rollercoaster ride! Will it stay strong or drop into the danger zone?',
    qoutLabel: 'Danger Zone 🚨',
    qinLabel: 'Safe Zone ✅',
    transitioningLabel: 'Hold on tight! 🎢',
    snrLabel: 'Signal Power Level',
    blerLabel: 'Error Rate',
  },
  researcher: {
    title: 'RLM Signal Quality Monitor',
    description: 'Real-time visualization of SNR degradation and BLER evolution through Qout/Qin thresholds.',
    qoutLabel: 'Qout Threshold (Out-of-Sync)',
    qinLabel: 'Qin Threshold (In-Sync)',
    transitioningLabel: 'Transitioning',
    snrLabel: 'SNR (dB)',
    blerLabel: 'BLER',
  },
  spec: {
    title: 'Radio Link Monitoring Signal Simulator (8.1B)',
    description: 'Simulates Qout,RedCap and Qin,RedCap thresholds per TS 38.133 clause 8.1B. BLERout,RedCap = 10%, BLERin,RedCap = 2%.',
    qoutLabel: 'Qout,RedCap',
    qinLabel: 'Qin,RedCap',
    transitioningLabel: 'RLM_EVALUATING',
    snrLabel: 'SNR (dB)',
    blerLabel: 'BLER',
  },
};

const getStateColor = (state: SyncState): string => {
  switch (state) {
    case 'in-sync':
      return '#22c55e'; // green-500
    case 'out-of-sync':
      return '#ef4444'; // red-500
    case 'transitioning':
      return '#f59e0b'; // amber-500
    default:
      return '#6b7280';
  }
};

const getStateIcon = (state: SyncState) => {
  switch (state) {
    case 'in-sync':
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    case 'out-of-sync':
      return <AlertTriangle className="w-6 h-6 text-red-500" />;
    case 'transitioning':
      return <Activity className="w-6 h-6 text-amber-500" />;
    default:
      return <Signal className="w-6 h-6 text-gray-500" />;
  }
};

const getStateLabel = (state: SyncState, mode: ContentMode): string => {
  const content = modeContent[mode];
  switch (state) {
    case 'in-sync':
      return content.qinLabel;
    case 'out-of-sync':
      return content.qoutLabel;
    case 'transitioning':
      return content.transitioningLabel;
    default:
      return 'Unknown';
  }
};

export const RLMSignalSimulator: React.FC<RLMSignalSimulatorProps> = ({ mode }) => {
  const {
    snr_dB,
    bler,
    syncState,
    history,
    isRunning,
    startSimulation,
    stopSimulation,
    resetSimulation,
    setSNR,
    degradeSignal,
    improveSignal,
    qOutLevel,
    qInLevel,
  } = useRLMSimulator({
    initialSNR: -5,
    simulationSpeed: 150,
  });

  const content = modeContent[mode];
  const stateColor = getStateColor(syncState);

  // Prepare chart data
  const chartData = history.map((point, index) => ({
    index,
    snr: point.snr_dB,
    bler: point.bler_percent,
    timestamp: point.timestamp,
  }));

  // Particle animation for signal visualization
  const ParticleField: React.FC = () => {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);

    useEffect(() => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.3,
      }));
      setParticles(newParticles);
    }, []);

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: stateColor,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [particle.opacity, particle.opacity * 0.3, particle.opacity],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-500" />
          {content.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{content.description}</p>
      </div>

      {/* Status Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Sync State */}
        <motion.div
          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-2"
          style={{ borderColor: stateColor }}
          animate={{ scale: syncState === 'transitioning' ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 0.5, repeat: syncState === 'transitioning' ? Infinity : 0 }}
        >
          <div className="flex items-center gap-3">
            {getStateIcon(syncState)}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Current State</p>
              <p className="text-lg font-semibold" style={{ color: stateColor }}>
                {getStateLabel(syncState, mode)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* SNR Display */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{content.snrLabel}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{snr_dB.toFixed(1)}</span>
            <span className="text-sm text-gray-500">dB</span>
          </div>
          <input
            type="range"
            min="-20"
            max="10"
            step="0.5"
            value={snr_dB}
            onChange={(e) => setSNR(parseFloat(e.target.value))}
            className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        {/* BLER Display */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{content.blerLabel}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatPercent(bler)}</span>
          </div>
          <div className="mt-2 flex gap-1">
            <div
              className="h-2 rounded-full bg-green-500"
              style={{ width: `${BLER_THRESHOLDS.inSync * 100}%` }}
            />
            <div
              className="h-2 rounded-full bg-amber-500"
              style={{ width: `${(BLER_THRESHOLDS.outOfSync - BLER_THRESHOLDS.inSync) * 100}%` }}
            />
            <div
              className="h-2 rounded-full bg-red-500 flex-1"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatPercent(BLER_THRESHOLDS.inSync)}</span>
            <span>{formatPercent(BLER_THRESHOLDS.outOfSync)}</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64 mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <ParticleField />
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="index" hide />
            <YAxis
              yAxisId="left"
              domain={[-20, 10]}
              tickFormatter={(v) => `${v} dB`}
              stroke="#6b7280"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              stroke="#6b7280"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#9ca3af' }}
            />
            {/* Threshold lines */}
            <ReferenceLine
              yAxisId="left"
              y={qOutLevel}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: mode === 'spec' ? 'Qout' : 'Qout Threshold', fill: '#ef4444', fontSize: 12 }}
            />
            <ReferenceLine
              yAxisId="left"
              y={qInLevel}
              stroke="#22c55e"
              strokeDasharray="5 5"
              label={{ value: mode === 'spec' ? 'Qin' : 'Qin Threshold', fill: '#22c55e', fontSize: 12 }}
            />
            {/* SNR Line */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="snr"
              stroke={stateColor}
              fill={stateColor}
              fillOpacity={0.1}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            {/* BLER Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bler"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="absolute top-2 right-2 flex gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-1 rounded" style={{ backgroundColor: stateColor }} />
            SNR
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-1 rounded bg-violet-500" />
            BLER
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRunning ? stopSimulation : startSimulation}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Start'} Simulation
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetSimulation}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </motion.button>

        <div className="flex-1" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => degradeSignal(3)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
        >
          <Signal className="w-4 h-4" />
          Degrade Signal
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => improveSignal(3)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 transition-colors"
        >
          <Signal className="w-4 h-4" />
          Improve Signal
        </motion.button>
      </div>

      {/* Threshold Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          {mode === 'fun' ? '🎯 How It Works' : mode === 'researcher' ? 'Threshold Definitions' : '3GPP TS 38.133 clause 8.1B'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-red-600 dark:text-red-400 font-medium">
              {mode === 'spec' ? 'Qout,RedCap' : 'Qout (Out-of-Sync)'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === 'fun'
                ? 'The danger zone! When errors hit 10%, it\'s time to worry.'
                : mode === 'researcher'
                ? `BLER threshold: ${formatPercent(BLER_THRESHOLDS.outOfSync)}. Indicates poor channel quality requiring radio link failure procedures.`
                : `BLERout,RedCap = ${formatPercent(BLER_THRESHOLDS.outOfSync)}. The downlink radio link quality is worse than Qout,RedCap.`}
            </p>
          </div>
          <div>
            <p className="text-green-600 dark:text-green-400 font-medium">
              {mode === 'spec' ? 'Qin,RedCap' : 'Qin (In-Sync)'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === 'fun'
                ? 'The safe zone! When errors drop to 2%, you\'re in good shape.'
                : mode === 'researcher'
                ? `BLER threshold: ${formatPercent(BLER_THRESHOLDS.inSync)}. Indicates acceptable channel quality for reliable communication.`
                : `BLERin,RedCap = ${formatPercent(BLER_THRESHOLDS.inSync)}. The downlink radio link quality is better than Qin,RedCap.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RLMSignalSimulator;
