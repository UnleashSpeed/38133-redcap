/**
 * Idle Mobility Components
 * 
 * 3GPP TS 38.133 Clause 4.2B - Cell Re-selection for RedCap
 * Reusable UI components for the Idle Mobility section
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Clock,
  Activity,
  Signal,
  Zap,
  Settings,
  ChevronDown,
  ChevronUp,
  Table as TableIcon,
  Timer,
  Radio,
  Battery,
  Move,
  MapPin,
  Gauge,
  Search,
  CheckCircle2,
  AlertCircle,
  Info,
  BarChart3,
  Layers,
  Filter,
  ArrowRight,
  Smartphone,
  Wifi,
} from 'lucide-react';
import { ContentMode, ContentModeProps, RxConfig, MobilityState, CellEdgeState } from './types';
import { useNservCalculator, useTimingCalculator, useScenarioConfig } from './hooks';
import {
  NSERV_TABLE_NO_EDRX,
  NSERV_TABLE_EDRX_FR1,
  TMEASURE_INTRA_2RX,
  TMEASURE_INTRA_1RX,
  TDETECT_INTER_2RX,
  TDETECT_INTER_1RX,
  formatTime,
} from './utils';

// ============================================================================
// MODE SELECTOR
// ============================================================================

interface ModeSelectorProps {
  mode: ContentMode;
  onModeChange: (mode: ContentMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onModeChange }) => {
  const modes: { value: ContentMode; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
    { 
      value: 'fun', 
      label: 'Fun Mode', 
      icon: <Zap className="w-4 h-4" />, 
      color: 'bg-yellow-500',
      desc: 'Learn with fun analogies'
    },
    { 
      value: 'researcher', 
      label: 'Researcher', 
      icon: <Activity className="w-4 h-4" />, 
      color: 'bg-blue-500',
      desc: 'Technical details'
    },
    { 
      value: 'spec', 
      label: 'Spec Mode', 
      icon: <Settings className="w-4 h-4" />, 
      color: 'bg-purple-500',
      desc: '3GPP references'
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onModeChange(m.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            mode === m.value
              ? `${m.color} text-white shadow-md`
              : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          title={m.desc}
        >
          {m.icon}
          <span className="text-sm font-medium">{m.label}</span>
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// NSERV CALCULATOR
// ============================================================================

export const NservCalculator: React.FC<ContentModeProps> = ({ mode }) => {
  const calc = useNservCalculator();
  const [showTable, setShowTable] = useState(false);

  const getDescription = () => {
    switch (mode) {
      case 'fun':
        return "Think of Nserv as your device's 'patience level' - how many times it checks the current cell before looking elsewhere. Higher Nserv = more patient!";
      case 'researcher':
        return "Nserv_RedCap defines the number of DRX cycles for cell reselection evaluation. It scales with DRX cycle length and PTW configuration.";
      case 'spec':
        return "Nserv_RedCap per Tables 4.2B.2.2-1, 4.2B.2.2-2, 4.2B.2.2-3. M1 factor = 2 if SMTC > 20ms AND DRX ≤ 0.64s, else 1.";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Calculator className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nserv_RedCap Calculator</h3>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">{getDescription()}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-4">
          {/* eDRX Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Use eDRX</span>
            <button
              onClick={() => calc.setIsEDRX(!calc.isEDRX)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                calc.isEDRX ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                animate={{ left: calc.isEDRX ? '28px' : '4px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* DRX/eDRX Cycle Selection */}
          {!calc.isEDRX ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                DRX Cycle
              </label>
              <select
                value={calc.drxCycle}
                onChange={(e) => calc.setDrxCycle(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {NSERV_TABLE_NO_EDRX.map((entry) => (
                  <option key={entry.drx} value={entry.drx}>
                    {entry.drx}s (Nserv = {entry.nserv})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency Range
                </label>
                <div className="flex gap-2">
                  {(['FR1', 'FR2'] as const).map((fr) => (
                    <button
                      key={fr}
                      onClick={() => calc.setFrequencyRange(fr)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        calc.frequencyRange === fr
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {fr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  eDRX Cycle
                </label>
                <input
                  type="range"
                  min="2.56"
                  max="10485.76"
                  step="2.56"
                  value={calc.edrxCycle}
                  onChange={(e) => calc.setEdrxCycle(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {calc.edrxCycle}s
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PTW (Paging Time Window)
                </label>
                <select
                  value={calc.ptw}
                  onChange={(e) => calc.setPtw(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value={0.16}>0.16s</option>
                  <option value={0.32}>0.32s</option>
                  <option value={0.64}>0.64s</option>
                  <option value={1.28}>1.28s</option>
                  <option value={2.56}>2.56s</option>
                  <option value={5.12}>5.12s</option>
                </select>
              </div>
            </>
          )}

          {/* SMTC Periodicity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SMTC Periodicity (ms)
            </label>
            <input
              type="range"
              min="10"
              max="160"
              step="10"
              value={calc.smtcPeriodicity}
              onChange={(e) => calc.setSmtcPeriodicity(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
              {calc.smtcPeriodicity}ms
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="text-sm opacity-80 mb-1">Base Nserv_RedCap</div>
            <div className="text-4xl font-bold">{calc.nserv}</div>
            <div className="text-sm opacity-80 mt-2">DRX cycles</div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">M1 Factor</span>
              <span className={`text-lg font-bold ${calc.m1Factor > 1 ? 'text-green-500' : 'text-gray-500'}`}>
                ×{calc.m1Factor}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {calc.smtcPeriodicity > 20 && (calc.isEDRX ? calc.edrxCycle : calc.drxCycle) <= 0.64
                ? 'SMTC > 20ms AND DRX ≤ 0.64s → M1 = 2'
                : 'M1 = 1 (standard)'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white">
            <div className="text-sm opacity-80 mb-1">Effective Nserv</div>
            <div className="text-4xl font-bold">{calc.effectiveNserv}</div>
            <div className="text-sm opacity-80 mt-2">
              = {calc.nserv} × {calc.m1Factor}
            </div>
          </div>
        </div>
      </div>

      {/* Table Toggle */}
      <button
        onClick={() => setShowTable(!showTable)}
        className="mt-6 flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
      >
        <TableIcon className="w-4 h-4" />
        <span className="text-sm font-medium">
          {showTable ? 'Hide Reference Tables' : 'Show Reference Tables'}
        </span>
        {showTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {showTable && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Table 4.2B.2.2-1: No eDRX</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left">DRX Cycle (s)</th>
                      <th className="px-4 py-2 text-left">Nserv</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NSERV_TABLE_NO_EDRX.map((row, i) => (
                      <tr key={i} className="border-b dark:border-gray-700">
                        <td className="px-4 py-2 font-mono">{row.drx}</td>
                        <td className="px-4 py-2 font-mono">{row.nserv}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// TIMELINE ANIMATOR
// ============================================================================

interface TimelineAnimatorProps extends ContentModeProps {
  tDetect?: number;
  tMeasure?: number;
  tEvaluate?: number;
}

export const TimelineAnimator: React.FC<TimelineAnimatorProps> = ({ 
  mode,
  tDetect = 600,
  tMeasure = 200,
  tEvaluate = 320
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'detect' | 'measure' | 'evaluate' | 'complete'>('detect');
  
  const totalTime = tDetect + tMeasure + tEvaluate;

  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          setIsPlaying(false);
          return 100;
        }
        
        const currentTime = (newProgress / 100) * totalTime;
        if (currentTime < tDetect) setPhase('detect');
        else if (currentTime < tDetect + tMeasure) setPhase('measure');
        else if (currentTime < totalTime) setPhase('evaluate');
        else setPhase('complete');
        
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, tDetect, tMeasure, tEvaluate, totalTime]);

  const getPhaseDescription = () => {
    switch (mode) {
      case 'fun':
        switch (phase) {
          case 'detect': return "🔍 Cell Detective Mode: Your device is scanning the neighborhood for available cells!";
          case 'measure': return "📊 Signal Strength Check: Measuring how strong each cell's signal is...";
          case 'evaluate': return "🤔 Decision Time: Should I stay or should I go? Comparing options...";
          case 'complete': return "✅ Mission Complete! Best cell selected!";
        }
      case 'researcher':
        switch (phase) {
          case 'detect': return "Tdetect: Detecting cells on target frequency";
          case 'measure': return "Tmeasure: Measuring RSRP/RSRQ of detected cells";
          case 'evaluate': return "Tevaluate: Evaluating cell reselection criteria";
          case 'complete': return "Cell reselection process completed";
        }
      case 'spec':
        switch (phase) {
          case 'detect': return "Tdetect = max(600ms, 8×max(MGRP,SMTC))×CSSF [Table 4.2B.2.3-2]";
          case 'measure': return "Tmeasure = max(200ms, 5×SMTC)×CSSF [Table 4.2B.2.3-1]";
          case 'evaluate': return "Tevaluate = Nserv × DRX cycle [Clause 4.2B.2.2]";
          case 'complete': return "Treselection = Tdetect + Tmeasure + Tevaluate";
        }
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'detect': return 'bg-blue-500';
      case 'measure': return 'bg-green-500';
      case 'evaluate': return 'bg-yellow-500';
      case 'complete': return 'bg-purple-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cell Reselection Timeline</h3>
        </div>
        <button
          onClick={() => {
            if (progress >= 100) {
              setProgress(0);
              setPhase('detect');
            }
            setIsPlaying(!isPlaying);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {isPlaying ? 'Pause' : progress >= 100 ? 'Restart' : 'Start Animation'}
        </button>
      </div>

      <div className={`p-4 rounded-lg mb-6 ${getPhaseColor()} bg-opacity-10 border border-${getPhaseColor().replace('bg-', '')}`}>
        <p className={`font-medium ${getPhaseColor().replace('bg-', 'text-')}`}>{getPhaseDescription()}</p>
      </div>

      {/* Timeline Visualization */}
      <div className="relative h-32 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
        {/* Phase backgrounds */}
        <div className="absolute inset-0 flex">
          <div 
            className="bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 text-xs font-medium"
            style={{ width: `${(tDetect / totalTime) * 100}%` }}
          >
            <div className="text-center">
              <Search className="w-5 h-5 mx-auto mb-1" />
              Tdetect
            </div>
          </div>
          <div 
            className="bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-300 text-xs font-medium"
            style={{ width: `${(tMeasure / totalTime) * 100}%` }}
          >
            <div className="text-center">
              <Activity className="w-5 h-5 mx-auto mb-1" />
              Tmeasure
            </div>
          </div>
          <div 
            className="bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-700 dark:text-yellow-300 text-xs font-medium"
            style={{ width: `${(tEvaluate / totalTime) * 100}%` }}
          >
            <div className="text-center">
              <Gauge className="w-5 h-5 mx-auto mb-1" />
              Tevaluate
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-red-500 shadow-lg"
          style={{ left: `${progress}%` }}
        >
          <div className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 rounded-full" />
        </motion.div>
      </div>

      {/* Time markers */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>0ms</span>
        <span>{tDetect}ms</span>
        <span>{tDetect + tMeasure}ms</span>
        <span>{totalTime}ms</span>
      </div>

      {/* Phase details */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className={`p-4 rounded-lg border-2 transition-all ${phase === 'detect' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-gray-900 dark:text-white">Tdetect</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{tDetect}ms</div>
          <div className="text-xs text-gray-500 mt-1">Cell detection phase</div>
        </div>

        <div className={`p-4 rounded-lg border-2 transition-all ${phase === 'measure' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="font-semibold text-gray-900 dark:text-white">Tmeasure</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{tMeasure}ms</div>
          <div className="text-xs text-gray-500 mt-1">Signal measurement</div>
        </div>

        <div className={`p-4 rounded-lg border-2 transition-all ${phase === 'evaluate' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold text-gray-900 dark:text-white">Tevaluate</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{tEvaluate}ms</div>
          <div className="text-xs text-gray-500 mt-1">Evaluation phase</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Total Reselection Time</span>
          <span className="text-2xl font-bold text-purple-600">{totalTime}ms</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// RELAXED CRITERIA VISUALIZER
// ============================================================================

export const RelaxedCriteriaVisualizer: React.FC<ContentModeProps> = ({ mode }) => {
  const [k1, setK1] = useState(false);
  const [k2, setK2] = useState(false);
  const [baseTiming, setBaseTiming] = useState(200);

  const k3 = k1 && k2;
  
  const relaxedTiming = React.useMemo(() => {
    if (k3) {
      return Math.max(2 * baseTiming, 1000);
    } else if (k1 || k2) {
      return Math.max(1.5 * baseTiming, 750);
    }
    return baseTiming;
  }, [baseTiming, k1, k2, k3]);

  const getDescription = () => {
    switch (mode) {
      case 'fun':
        return "When your device is chilling at home (not moving, good signal), it can relax and check cells less often - saving battery!";
      case 'researcher':
        return "Relaxed measurement criteria reduce power consumption when UE is stationary, at good coverage, or both.";
      case 'spec':
        return "Per clause 4.2B.2.4: Relaxed measurement criteria apply when K1 (stationary/low mobility), K2 (Srxlev > 4dB), or K3 (both) conditions are met.";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Battery className="w-6 h-6 text-green-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Relaxed Measurement Criteria</h3>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">{getDescription()}</p>

      {/* K Factor Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setK1(!k1)}
          className={`p-4 rounded-xl border-2 transition-all text-left ${
            k1
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-900 dark:text-white">K1 Factor</span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${k1 ? 'bg-blue-500' : 'bg-gray-300'}`}>
              {k1 && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Move className="w-4 h-4" />
            Stationary / Low Mobility
          </div>
        </button>

        <button
          onClick={() => setK2(!k2)}
          className={`p-4 rounded-xl border-2 transition-all text-left ${
            k2
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-900 dark:text-white">K2 Factor</span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${k2 ? 'bg-green-500' : 'bg-gray-300'}`}>
              {k2 && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Signal className="w-4 h-4" />
            Not at Cell Edge (Srxlev &gt; 4dB)
          </div>
        </button>
      </div>

      {/* K3 Indicator */}
      <div className={`p-4 rounded-xl border-2 mb-6 ${
        k3
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
          : 'border-gray-200 dark:border-gray-700 opacity-50'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900 dark:text-white">K3 Factor</span>
            <div className="text-sm text-gray-600 dark:text-gray-400">K1 AND K2 (both conditions)</div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            k3 ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            {k3 ? 'ACTIVE' : 'INACTIVE'}
          </div>
        </div>
      </div>

      {/* Base Timing Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Base Tmeasure (ms)
        </label>
        <input
          type="range"
          min="100"
          max="1000"
          step="50"
          value={baseTiming}
          onChange={(e) => setBaseTiming(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
          {baseTiming}ms
        </div>
      </div>

      {/* Timing Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Normal Timing</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{baseTiming}ms</div>
        </div>

        <div className={`p-4 rounded-xl ${
          k3
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
            : k1 || k2
            ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          <div className={`text-sm mb-1 ${k1 || k2 ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
            Relaxed Timing
          </div>
          <div className={`text-3xl font-bold ${k1 || k2 ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            {formatTime(relaxedTiming)}
          </div>
          {k3 && (
            <div className="text-xs text-white/80 mt-1">
              max(2×{baseTiming}ms, 1s)
            </div>
          )}
        </div>
      </div>

      {/* Savings indicator */}
      {k1 || k2 ? (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Battery className="w-5 h-5" />
            <span className="font-medium">
              Battery savings: {((1 - baseTiming / relaxedTiming) * 100).toFixed(0)}% less frequent measurements
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ============================================================================
// 1RX VS 2RX COMPARISON
// ============================================================================

export const RxComparisonDashboard: React.FC<ContentModeProps> = ({ mode }) => {
  const [smtcPeriodicity, setSmtcPeriodicity] = useState(20);
  const [mgrp, setMgrp] = useState(40);
  const [measurementType, setMeasurementType] = useState<'intra' | 'inter'>('intra');

  const timing2Rx = measurementType === 'intra'
    ? Math.max(200, 5 * smtcPeriodicity)
    : Math.max(600, 8 * Math.max(mgrp, smtcPeriodicity));

  const timing1Rx = measurementType === 'intra'
    ? Math.max(200, 7 * smtcPeriodicity)
    : Math.max(600, 10 * Math.max(mgrp, smtcPeriodicity));

  const getDescription = () => {
    switch (mode) {
      case 'fun':
        return "2Rx is like having two eyes instead of one - you see (measure) faster! But 1Rx saves more battery. Choose wisely!";
      case 'researcher':
        return "RedCap supports both 1Rx and 2Rx configurations. 2Rx provides faster measurement times but higher power consumption.";
      case 'spec':
        return "Per Tables 4.2B.2.3-1 and 4.2B.2.3-2: 1Rx multipliers are 7× (intra) and 10× (inter) vs 5× and 8× for 2Rx.";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Radio className="w-6 h-6 text-indigo-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">1Rx vs 2Rx Comparison</h3>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">{getDescription()}</p>

      {/* Measurement Type Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMeasurementType('intra')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            measurementType === 'intra'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          Intra-frequency
        </button>
        <button
          onClick={() => setMeasurementType('inter')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            measurementType === 'inter'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          Inter-frequency
        </button>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SMTC Periodicity (ms)
          </label>
          <input
            type="range"
            min="10"
            max="160"
            step="10"
            value={smtcPeriodicity}
            onChange={(e) => setSmtcPeriodicity(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">{smtcPeriodicity}ms</div>
        </div>

        {measurementType === 'inter' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              MGRP (ms)
            </label>
            <input
              type="range"
              min="20"
              max="160"
              step="20"
              value={mgrp}
              onChange={(e) => setMgrp(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">{mgrp}ms</div>
          </div>
        )}
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-2 gap-6">
        {/* 2Rx Card */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Signal className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">2Rx Configuration</span>
          </div>

          <div className="text-4xl font-bold mb-2">{timing2Rx}ms</div>
          <div className="text-sm text-white/80 mb-4">
            {measurementType === 'intra' ? 'Tmeasure' : 'Tdetect'}
          </div>

          <div className="bg-white/10 rounded-lg p-3 text-sm">
            <code className="font-mono">
              {measurementType === 'intra'
                ? `max(200, 5×${smtcPeriodicity})`
                : `max(600, 8×max(${mgrp},${smtcPeriodicity}))`}
            </code>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
            <Zap className="w-4 h-4" />
            Faster measurements
          </div>
        </div>

        {/* 1Rx Card */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Battery className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">1Rx Configuration</span>
          </div>

          <div className="text-4xl font-bold mb-2">{timing1Rx}ms</div>
          <div className="text-sm text-white/80 mb-4">
            {measurementType === 'intra' ? 'Tmeasure' : 'Tdetect'}
          </div>

          <div className="bg-white/10 rounded-lg p-3 text-sm">
            <code className="font-mono">
              {measurementType === 'intra'
                ? `max(200, 7×${smtcPeriodicity})`
                : `max(600, 10×max(${mgrp},${smtcPeriodicity}))`}
            </code>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
            <Battery className="w-4 h-4" />
            Better battery life
          </div>
        </div>
      </div>

      {/* Impact Analysis */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Impact Analysis</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Time Difference</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              +{timing1Rx - timing2Rx}ms ({((timing1Rx / timing2Rx - 1) * 100).toFixed(0)}% slower)
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Power Savings</div>
            <div className="text-xl font-bold text-green-600">
              ~30-40% less power
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENARIO TOGGLES
// ============================================================================

export const ScenarioToggles: React.FC<ContentModeProps> = ({ mode }) => {
  const scenario = useScenarioConfig();

  const getDescription = () => {
    switch (mode) {
      case 'fun':
        return "Configure your device's situation to see how it affects cell reselection!";
      case 'researcher':
        return "Scenario configuration affects relaxed measurement criteria and timing requirements.";
      case 'spec':
        return "Per clause 4.2B.2.4: K1, K2, K3 factors determine relaxed measurement applicability.";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="w-6 h-6 text-orange-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Scenario Configuration</h3>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">{getDescription()}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Mobility State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mobility State
          </label>
          <div className="space-y-2">
            {(['normal', 'stationary', 'low_mobility'] as MobilityState[]).map((state) => (
              <button
                key={state}
                onClick={() => scenario.setMobility(state)}
                className={`w-full p-2 rounded-lg text-left text-sm transition-colors ${
                  scenario.mobility === state
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {state === 'normal' && <Move className="w-4 h-4" />}
                  {state === 'stationary' && <MapPin className="w-4 h-4" />}
                  {state === 'low_mobility' && <Activity className="w-4 h-4" />}
                  {state === 'normal' && 'Normal Mobility'}
                  {state === 'stationary' && 'Stationary'}
                  {state === 'low_mobility' && 'Low Mobility'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cell Edge State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Coverage State
          </label>
          <div className="space-y-2">
            {(['normal', 'not_at_edge'] as CellEdgeState[]).map((state) => (
              <button
                key={state}
                onClick={() => scenario.setCellEdge(state)}
                className={`w-full p-2 rounded-lg text-left text-sm transition-colors ${
                  scenario.cellEdge === state
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {state === 'normal' && <AlertCircle className="w-4 h-4" />}
                  {state === 'not_at_edge' && <CheckCircle2 className="w-4 h-4" />}
                  {state === 'normal' && 'Cell Edge (Srxlev ≤ 4dB)'}
                  {state === 'not_at_edge' && 'Good Coverage (Srxlev > 4dB)'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Rx Configuration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rx Configuration
          </label>
          <div className="space-y-2">
            {(['1Rx', '2Rx'] as RxConfig[]).map((config) => (
              <button
                key={config}
                onClick={() => scenario.setRxConfig(config)}
                className={`w-full p-2 rounded-lg text-left text-sm transition-colors ${
                  scenario.rxConfig === config
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4" />
                  {config}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Scenario Summary */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
        <div className="text-sm opacity-80 mb-1">Current Scenario</div>
        <div className="text-lg font-semibold">{scenario.scenarioDescription}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {scenario.k1 && (
            <span className="px-2 py-1 bg-white/20 rounded text-xs">
              K1: {scenario.mobility === 'stationary' ? 'Stationary' : 'Low Mobility'}
            </span>
          )}
          {scenario.k2 && (
            <span className="px-2 py-1 bg-white/20 rounded text-xs">
              K2: Not at Cell Edge
            </span>
          )}
          {scenario.k3 && (
            <span className="px-2 py-1 bg-white/20 rounded text-xs">
              K3: Both conditions
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// INTERACTIVE TABLES
// ============================================================================

export const InteractiveTables: React.FC<ContentModeProps> = ({ mode }) => {
  const [activeTable, setActiveTable] = useState<'nserv' | 'timing' | 'interrat'>('nserv');
  const [filter, setFilter] = useState('');

  const getTableDescription = () => {
    switch (mode) {
      case 'fun':
        return "All the nerdy tables your heart desires! Filter and search through the 3GPP specs.";
      case 'researcher':
        return "Complete reference tables from 3GPP TS 38.133 clause 4.2B for cell reselection parameters.";
      case 'spec':
        return "Tables 4.2B.2.2-1 through 4.2B.2.7-2: Nserv, Tmeasure, Tdetect, and inter-RAT requirements.";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <TableIcon className="w-6 h-6 text-teal-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Interactive Reference Tables</h3>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">{getTableDescription()}</p>

      {/* Table Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'nserv', label: 'Nserv Tables', icon: <Calculator className="w-4 h-4" /> },
          { key: 'timing', label: 'Timing Tables', icon: <Timer className="w-4 h-4" /> },
          { key: 'interrat', label: 'Inter-RAT Tables', icon: <Layers className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTable(t.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTable === t.key
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Filter Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Filter tables..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {activeTable === 'nserv' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Table 4.2B.2.2-1: Nserv_RedCap (No eDRX)
              </h4>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left border dark:border-gray-700">DRX Cycle (s)</th>
                    <th className="px-4 py-2 text-left border dark:border-gray-700">Nserv</th>
                  </tr>
                </thead>
                <tbody>
                  {NSERV_TABLE_NO_EDRX
                    .filter(row => !filter || row.drx.toString().includes(filter) || row.nserv.toString().includes(filter))
                    .map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-2 border dark:border-gray-700 font-mono">{row.drx}</td>
                        <td className="px-4 py-2 border dark:border-gray-700 font-mono">{row.nserv}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Table 4.2B.2.2-2: Nserv_RedCap (eDRX FR1)
              </h4>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left border dark:border-gray-700">eDRX (s)</th>
                    <th className="px-4 py-2 text-left border dark:border-gray-700">PTW (s)</th>
                    <th className="px-4 py-2 text-left border dark:border-gray-700">Nserv</th>
                  </tr>
                </thead>
                <tbody>
                  {NSERV_TABLE_EDRX_FR1
                    .filter(row => !filter || row.edrx.toString().includes(filter) || row.nserv.toString().includes(filter))
                    .slice(0, 10)
                    .map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-2 border dark:border-gray-700 font-mono">{row.edrx}</td>
                        <td className="px-4 py-2 border dark:border-gray-700 font-mono">{row.ptw}</td>
                        <td className="px-4 py-2 border dark:border-gray-700 font-mono">{row.nserv}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="text-center text-sm text-gray-500 mt-2">
                Showing first 10 entries of {NSERV_TABLE_EDRX_FR1.length} total
              </div>
            </div>
          </div>
        )}

        {activeTable === 'timing' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Table 4.2B.2.3-1: Tmeasure for Intra-frequency
              </h4>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left border dark:border-gray-700">Configuration</th>
                    <th className="px-4 py-2 text-left border dark:border-gray-700">Formula</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-2 border dark:border-gray-700">2Rx</td>
                    <td className="px-4 py-2 border dark:border-gray-700 font-mono">{TMEASURE_INTRA_2RX}</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-2 border dark:border-gray-700">1Rx</td>
                    <td className="px-4 py-2 border dark:border-gray-700 font-mono">{TMEASURE_INTRA_1RX}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Table 4.2B.2.3-2: Tdetect for Inter-frequency
              </h4>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left border dark:border-gray-700">Configuration</th>
                    <th className="px-4 py-2 text-left border dark:border-gray-700">Formula</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-2 border dark:border-gray-700">2Rx</td>
                    <td className="px-4 py-2 border dark:border-gray-700 font-mono">{TDETECT_INTER_2RX}</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-2 border dark:border-gray-700">1Rx</td>
                    <td className="px-4 py-2 border dark:border-gray-700 font-mono">{TDETECT_INTER_1RX}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTable === 'interrat' && (
          <div className="p-8 text-center text-gray-500">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Inter-RAT measurement tables (4.2B.2.6-x, 4.2B.2.7-x)</p>
            <p className="text-sm mt-2">E-UTRAN and NR FR1/FR2 measurement requirements</p>
          </div>
        )}
      </div>
    </div>
  );
};
