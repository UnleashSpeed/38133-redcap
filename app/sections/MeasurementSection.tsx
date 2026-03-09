"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import {
  Settings,
  Activity,
  Timer,
  Zap,
  BarChart3,
  Radio,
  ChevronDown,
  ChevronUp,
  Info,
  Calculator,
  Eye,
  EyeOff,
  Sliders,
  ArrowRightLeft,
  Wifi,
  Signal,
  Layers,
  Clock,
  TrendingUp,
  Divide,
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type ModeType = "fun" | "researcher" | "spec";
type RxConfig = "1rx" | "2rx";
type GapSharingScheme = "00" | "01" | "10" | "11";

interface GapPattern {
  id: number;
  mgl: number; // Measurement Gap Length in ms
  mgrp: number; // Measurement Gap Repetition Period in ms
  description: string;
  useCase: string;
}

interface SMTCConfig {
  periodicity: number; // ms
  duration: number; // ms
  offset: number; // slots
}

interface MOConfig {
  id: string;
  name: string;
  isIntra: boolean;
  gapId: number;
}

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

const GAP_PATTERNS: GapPattern[] = [
  { id: 0, mgl: 6, mgrp: 40, description: "Standard gap", useCase: "General inter-frequency" },
  { id: 1, mgl: 6, mgrp: 80, description: "Longer period", useCase: "Low mobility scenarios" },
  { id: 2, mgl: 3, mgrp: 40, description: "Short gap", useCase: "Fast switching needed" },
  { id: 3, mgl: 3, mgrp: 80, description: "Short gap, long period", useCase: "Balanced throughput" },
  { id: 4, mgl: 6, mgrp: 20, description: "Frequent gaps", useCase: "High mobility" },
  { id: 5, mgl: 6, mgrp: 160, description: "Sparse gaps", useCase: "Throughput critical" },
  { id: 6, mgl: 4, mgrp: 20, description: "Short frequent", useCase: "Fast measurement" },
  { id: 7, mgl: 4, mgrp: 40, description: "Standard short", useCase: "Balanced" },
  { id: 8, mgl: 4, mgrp: 80, description: "Short sparse", useCase: "Low activity" },
  { id: 9, mgl: 4, mgrp: 160, description: "Very sparse", useCase: "Minimal impact" },
  { id: 10, mgl: 3, mgrp: 20, description: "Very short frequent", useCase: "Ultra-fast" },
  { id: 11, mgl: 3, mgrp: 160, description: "Minimal gaps", useCase: "Max throughput" },
  { id: 12, mgl: 5.5, mgrp: 20, description: "Extended frequent", useCase: "LTE coexistence" },
  { id: 13, mgl: 5.5, mgrp: 40, description: "Extended standard", useCase: "Mixed RAT" },
  { id: 14, mgl: 5.5, mgrp: 80, description: "Extended sparse", useCase: "Inter-RAT" },
  { id: 15, mgl: 5.5, mgrp: 160, description: "Extended minimal", useCase: "Background meas" },
  { id: 16, mgl: 3.5, mgrp: 20, description: "Medium frequent", useCase: "Fast NR" },
  { id: 17, mgl: 3.5, mgrp: 40, description: "Medium standard", useCase: "Standard NR" },
  { id: 18, mgl: 3.5, mgrp: 80, description: "Medium sparse", useCase: "Slow NR" },
  { id: 19, mgl: 3.5, mgrp: 160, description: "Medium minimal", useCase: "Background NR" },
  { id: 20, mgl: 1.5, mgrp: 20, description: "Ultra short frequent", useCase: "SSB only" },
  { id: 21, mgl: 1.5, mgrp: 40, description: "Ultra short", useCase: "Quick SSB" },
  { id: 22, mgl: 1.5, mgrp: 80, description: "Ultra short sparse", useCase: "Periodic SSB" },
  { id: 23, mgl: 1.5, mgrp: 160, description: "Ultra short minimal", useCase: "Rare SSB" },
  { id: 24, mgl: 10, mgrp: 80, description: "Long gap", useCase: "Wideband meas" },
  { id: 25, mgl: 20, mgrp: 160, description: "Very long gap", useCase: "Full bandwidth" },
];

const GAP_SHARING_SCHEMES: Record<GapSharingScheme, { name: string; description: string; xRange: [number, number] }> = {
  "00": { name: "Equal Sharing", description: "50/50 split between intra and inter", xRange: [50, 50] },
  "01": { name: "Intra Priority", description: "More resources for intra-frequency", xRange: [60, 80] },
  "10": { name: "Inter Priority", description: "More resources for inter-frequency", xRange: [20, 40] },
  "11": { name: "Reserved", description: "Reserved for future use", xRange: [50, 50] },
};

const SMTC_PERIODICITIES = [5, 10, 20, 40, 80, 160];
const SMTC_DURATIONS = [1, 2, 3, 4, 5];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const calculateKIntra = (x: number): number => {
  if (x <= 0 || x >= 100) return 0;
  return (1 / x) * 100;
};

const calculateKInter = (x: number): number => {
  if (x <= 0 || x >= 100) return 0;
  return (1 / (100 - x)) * 100;
};

const calculateCSSF = (
  mintra: number,
  minter: number,
  ratio: number
): number => {
  const mtot = mintra + minter;
  if (mtot === 0) return 1;
  return Math.max(1, Math.ceil(mtot * ratio));
};

const calculateTIdentifyIntra = (
  rxConfig: RxConfig,
  smtcPeriod: number,
  cssf: number,
  kp: number
): { sync: number; meas: number; total: number } => {
  const kpMultiplier = rxConfig === "1rx" ? 7 : 5;
  const syncPeriods = Math.ceil(kpMultiplier * kp);
  const measPeriods = Math.ceil(5 * kp);

  const sync = Math.max(600, syncPeriods * smtcPeriod) * cssf;
  const meas = Math.max(200, measPeriods * smtcPeriod) * cssf;

  return { sync, meas, total: sync + meas };
};

const calculateTIdentifyInter = (
  rxConfig: RxConfig,
  mgrp: number,
  smtcPeriod: number,
  cssf: number
): { sync: number; meas: number; total: number } => {
  const maxPeriod = Math.max(mgrp, smtcPeriod);
  const syncMultiplier = rxConfig === "1rx" ? 10 : 8;

  const sync = Math.max(600, syncMultiplier * maxPeriod) * cssf;
  const meas = Math.max(200, 8 * maxPeriod) * cssf;

  return { sync, meas, total: sync + meas };
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// --- Gap Pattern Visualizer ---
const GapPatternVisualizer: React.FC<{ mode: ModeType }> = ({ mode }) => {
  const [selectedPattern, setSelectedPattern] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);

  const pattern = GAP_PATTERNS[selectedPattern];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setAnimationTime((t) => (t + 0.5) % pattern.mgrp);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, pattern.mgrp]);

  const gapStart = 0;
  const gapEnd = pattern.mgl;
  const isInGap = animationTime >= gapStart && animationTime < gapEnd;

  const getFunDescription = () => {
    const descriptions: Record<number, string> = {
      0: "The Goldilocks gap - not too long, not too short! Perfect for everyday inter-frequency adventures.",
      1: "The Marathon Runner - takes its time but gets the job done. Great when you're not in a rush.",
      2: "The Speed Demon - quick as a flash! When you need to peek at other frequencies FAST.",
      4: "The Hyperactive - can't sit still! Always checking what's out there.",
      5: "The Sloth - rare but mighty. For when throughput is king and measurements can wait.",
      24: "The Big Kahuna - needs a lot of time but sees EVERYTHING. Wideband wizard!",
      25: "The Grand Canyon - a massive gap for massive measurements. Use sparingly!",
    };
    return descriptions[selectedPattern] || "A solid, reliable gap pattern for your measurement needs.";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-500" />
          Gap Pattern Visualizer
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {isPlaying ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPlaying ? "Pause" : "Animate"}
          </button>
        </div>
      </div>

      {/* Pattern Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
          Select Gap Pattern (0-25)
        </label>
        <div className="grid grid-cols-13 gap-1">
          {GAP_PATTERNS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPattern(p.id);
                setAnimationTime(0);
              }}
              className={`p-2 text-xs font-mono rounded transition-all ${
                selectedPattern === p.id
                  ? "bg-blue-500 text-white ring-2 ring-blue-300"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {p.id}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Pattern Info */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400">MGL</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pattern.mgl}ms</div>
          <div className="text-xs text-slate-500">Gap Duration</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400">MGRP</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{pattern.mgrp}ms</div>
          <div className="text-xs text-slate-500">Repetition Period</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400">Duty Cycle</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {((pattern.mgl / pattern.mgrp) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500">Gap Overhead</div>
        </div>
      </div>

      {/* Timing Diagram */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4">
        <svg viewBox="0 0 800 150" className="w-full">
          {/* Timeline */}
          <line x1="50" y1="100" x2="750" y2="100" stroke="#64748b" strokeWidth="2" />
          
          {/* Time markers */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
            <g key={i}>
              <line
                x1={50 + t * 700}
                y1="95"
                x2={50 + t * 700}
                y2="105"
                stroke="#64748b"
                strokeWidth="2"
              />
              <text
                x={50 + t * 700}
                y="125"
                textAnchor="middle"
                className="text-xs fill-slate-500"
              >
                {Math.round(t * pattern.mgrp)}ms
              </text>
            </g>
          ))}

          {/* Gap period */}
          <rect
            x="50"
            y="60"
            width={(pattern.mgl / pattern.mgrp) * 700}
            height="30"
            fill="#ef4444"
            rx="4"
            opacity="0.8"
          />
          <text
            x={50 + (pattern.mgl / pattern.mgrp) * 350}
            y="80"
            textAnchor="middle"
            className="text-xs fill-white font-bold"
          >
            GAP ({pattern.mgl}ms)
          </text>

          {/* Active period */}
          <rect
            x={50 + (pattern.mgl / pattern.mgrp) * 700}
            y="60"
            width={700 - (pattern.mgl / pattern.mgrp) * 700}
            height="30"
            fill="#22c55e"
            rx="4"
            opacity="0.8"
          />
          <text
            x={50 + (pattern.mgl / pattern.mgrp) * 700 + (700 - (pattern.mgl / pattern.mgrp) * 700) / 2}
            y="80"
            textAnchor="middle"
            className="text-xs fill-white font-bold"
          >
            ACTIVE
          </text>

          {/* Animation indicator */}
          <motion.circle
            cx={50 + (animationTime / pattern.mgrp) * 700}
            cy="75"
            r="8"
            fill={isInGap ? "#ef4444" : "#22c55e"}
            animate={{
              cx: 50 + (animationTime / pattern.mgrp) * 700,
              fill: isInGap ? "#ef4444" : "#22c55e",
            }}
            transition={{ duration: 0.05 }}
          />

          {/* Legend */}
          <g transform="translate(50, 20)">
            <rect x="0" y="0" width="15" height="10" fill="#ef4444" rx="2" />
            <text x="20" y="9" className="text-xs fill-slate-600 dark:fill-slate-400">Measurement Gap</text>
            <rect x="150" y="0" width="15" height="10" fill="#22c55e" rx="2" />
            <text x="170" y="9" className="text-xs fill-slate-600 dark:fill-slate-400">Normal Operation</text>
          </g>
        </svg>
      </div>

      {/* Description */}
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200">{pattern.description}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-medium">Use case:</span> {pattern.useCase}
            </p>
            {mode === "fun" && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 italic">
                {getFunDescription()}
              </p>
            )}
          </div>
        </div>
      </div>

      {mode === "spec" && (
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-300 font-mono">
            3GPP TS 38.133 Table 9.1A.2-1: Gap Pattern {selectedPattern}
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
            MGL = {pattern.mgl}ms, MGRP = {pattern.mgrp}ms
          </p>
        </div>
      )}
    </div>
  );
};

// --- Gap Sharing Simulator ---
const GapSharingSimulator: React.FC<{ mode: ModeType }> = ({ mode }) => {
  const [xValue, setXValue] = useState<number>(50);
  const [scheme, setScheme] = useState<GapSharingScheme>("00");

  const kIntra = calculateKIntra(xValue);
  const kInter = calculateKInter(xValue);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Divide className="w-6 h-6 text-purple-500" />
          Gap Sharing Simulator
        </h3>
      </div>

      {/* Scheme Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
          measGapSharingScheme
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(GAP_SHARING_SCHEMES) as GapSharingScheme[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                setScheme(s);
                if (s !== "11") {
                  const [min] = GAP_SHARING_SCHEMES[s].xRange;
                  setXValue(min);
                }
              }}
              className={`p-3 rounded-lg border-2 transition-all ${
                scheme === s
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                  : "border-slate-200 dark:border-slate-600 hover:border-purple-300"
              }`}
            >
              <div className="font-mono font-bold text-lg">"{s}"</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {GAP_SHARING_SCHEMES[s].name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* X Value Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            X Value (Intra-frequency %)
          </label>
          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{xValue}%</span>
        </div>
        <input
          type="range"
          min={GAP_SHARING_SCHEMES[scheme].xRange[0]}
          max={GAP_SHARING_SCHEMES[scheme].xRange[1]}
          value={xValue}
          onChange={(e) => setXValue(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{GAP_SHARING_SCHEMES[scheme].xRange[0]}%</span>
          <span>{GAP_SHARING_SCHEMES[scheme].xRange[1]}%</span>
        </div>
      </div>

      {/* Visual Representation */}
      <div className="mb-6">
        <div className="h-12 rounded-lg overflow-hidden flex">
          <motion.div
            className="bg-blue-500 flex items-center justify-center text-white font-bold"
            style={{ width: `${xValue}%` }}
            layout
          >
            Intra {xValue}%
          </motion.div>
          <motion.div
            className="bg-orange-500 flex items-center justify-center text-white font-bold"
            style={{ width: `${100 - xValue}%` }}
            layout
          >
            Inter {100 - xValue}%
          </motion.div>
        </div>
      </div>

      {/* K Values */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">K<sub>intra</sub></div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {kIntra.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <MathJax>{`\\(K_{intra} = \\frac{1}{${xValue}} \\times 100\\)`}</MathJax>
          </div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">K<sub>inter</sub></div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {kInter.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <MathJax>{`\\(K_{inter} = \\frac{1}{${100 - xValue}} \\times 100\\)`}</MathJax>
          </div>
        </div>
      </div>

      {mode === "spec" && (
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-sm font-mono text-slate-600 dark:text-slate-300">
            3GPP TS 38.133 clause 9.1A.2.1
          </p>
          <MathJax>{`\\[K_{intra} = \\frac{1}{X} \\times 100, \\quad K_{inter} = \\frac{1}{100-X} \\times 100\\]`}</MathJax>
        </div>
      )}

      {mode === "fun" && (
        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Think of X as dividing a pizza! {xValue}% for intra-frequency toppings, {100 - xValue}% for inter-frequency toppings.
            The K values tell you how much each slice needs to stretch to feed everyone! 
          </p>
        </div>
      )}
    </div>
  );
};

// --- CSSF Calculator ---
const CSSFCalculator: React.FC<{ mode: ModeType }> = ({ mode }) => {
  const [mintra, setMintra] = useState<number>(1);
  const [minter, setMinter] = useState<number>(1);
  const [ratio, setRatio] = useState<number>(1);

  const mtot = mintra + minter;
  const cssf = calculateCSSF(mintra, minter, ratio);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-green-500" />
          CSSF Calculator
        </h3>
      </div>

      <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>CSSF</strong> = Carrier-Specific Scaling Factor for RedCap
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
          Clause 9.1A.5.2: CSSF<sub>within_gap_RedCap,i</sub>
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            M<sub>intra</sub>
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={mintra}
            onChange={(e) => setMintra(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
          />
          <p className="text-xs text-slate-500 mt-1">Intra-frequency MOs</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            M<sub>inter</sub>
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={minter}
            onChange={(e) => setMinter(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
          />
          <p className="text-xs text-slate-500 mt-1">Inter-frequency MOs</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            R<sub>i</sub>
          </label>
          <input
            type="number"
            min="0.1"
            max="2"
            step="0.1"
            value={ratio}
            onChange={(e) => setRatio(Math.max(0.1, Number(e.target.value)))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
          />
          <p className="text-xs text-slate-500 mt-1">Gap ratio</p>
        </div>
      </div>

      {/* Calculation Steps */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-3">Calculation Steps</h4>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">M<sub>tot</sub> = M<sub>intra</sub> + M<sub>inter</sub></span>
            <span className="text-slate-700 dark:text-slate-300">= {mintra} + {minter} = {mtot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">M<sub>tot</sub> × R<sub>i</sub></span>
            <span className="text-slate-700 dark:text-slate-300">= {mtot} × {ratio} = {(mtot * ratio).toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
            <span className="text-green-600 dark:text-green-400 font-bold">CSSF = max(1, ceil({(mtot * ratio).toFixed(2)}))</span>
            <span className="text-green-600 dark:text-green-400 font-bold text-xl">= {cssf}</span>
          </div>
        </div>
      </div>

      {/* Formula */}
      {mode === "spec" && (
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <MathJax>{`\\[CSSF_{within\\_gap\\_RedCap,i} = \\max(1, \\lceil (M_{intra} + M_{inter}) \\times R_i \\rceil)\\]`}</MathJax>
        </div>
      )}

      {mode === "fun" && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            CSSF is like a traffic multiplier! More Measurement Objects (MOs) sharing the same gap means 
            each one needs more time. It's like adding more cars to a single-lane road - everyone slows down!
          </p>
        </div>
      )}
    </div>
  );
};

// --- SMTC Timing Visualizer ---
const SMTCTimingVisualizer: React.FC<{ mode: ModeType }> = ({ mode }) => {
  const [periodicity, setPeriodicity] = useState<number>(20);
  const [duration, setDuration] = useState<number>(2);
  const [offset, setOffset] = useState<number>(0);

  const slotsPerMs = 2; // Assuming 30kHz SCS (2 slots per ms)
  const durationSlots = duration * slotsPerMs;
  const offsetMs = offset / slotsPerMs;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-amber-500" />
          SMTC Timing Visualizer
        </h3>
      </div>

      <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>SMTC</strong> = SSB-Based Measurement Timing Configuration
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
          Defines when the UE should measure SSBs on a carrier
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Periodicity (ms)
          </label>
          <select
            value={periodicity}
            onChange={(e) => setPeriodicity(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
          >
            {SMTC_PERIODICITIES.map((p) => (
              <option key={p} value={p}>{p} ms</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Duration (ms)
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
          >
            {SMTC_DURATIONS.map((d) => (
              <option key={d} value={d}>{d} ms ({d * slotsPerMs} slots)</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Offset (slots)
          </label>
          <input
            type="number"
            min="0"
            max={periodicity * slotsPerMs - 1}
            value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
          />
        </div>
      </div>

      {/* Timing Diagram */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4 overflow-x-auto">
        <svg viewBox="0 0 900 200" className="min-w-[900px]">
          {/* Timeline showing 2 periods */}
          {[0, 1].map((period) => {
            const periodStart = period * periodicity;
            const smtcStart = periodStart + offsetMs;
            const smtcEnd = smtcStart + duration;
            const xOffset = period * 400;

            return (
              <g key={period} transform={`translate(${xOffset}, 0)`}>
                {/* Period label */}
                <text x="10" y="20" className="text-xs fill-slate-500 font-bold">
                  Period {period + 1} (t={periodStart}ms)
                </text>

                {/* Time axis */}
                <line x1="0" y1="150" x2="380" y2="150" stroke="#64748b" strokeWidth="2" />
                
                {/* Time markers */}
                {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                  <g key={i}>
                    <line
                      x1={t * 360}
                      y1="145"
                      x2={t * 360}
                      y2="155"
                      stroke="#64748b"
                      strokeWidth="2"
                    />
                    <text
                      x={t * 360}
                      y="175"
                      textAnchor="middle"
                      className="text-xs fill-slate-500"
                    >
                      {Math.round(periodStart + t * periodicity)}ms
                    </text>
                  </g>
                ))}

                {/* SMTC window */}
                <rect
                  x={(offsetMs / periodicity) * 360}
                  y="80"
                  width={(duration / periodicity) * 360}
                  height="50"
                  fill="#f59e0b"
                  rx="4"
                  opacity="0.8"
                />
                <text
                  x={(offsetMs / periodicity) * 360 + (duration / periodicity) * 180}
                  y="110"
                  textAnchor="middle"
                  className="text-xs fill-white font-bold"
                >
                  SMTC Window
                </text>

                {/* SSB bursts within window */}
                {[0, 1, 2, 3].map((ssb) => (
                  <rect
                    key={ssb}
                    x={(offsetMs / periodicity) * 360 + ssb * 15}
                    y="85"
                    width="10"
                    height="40"
                    fill="#d97706"
                    rx="2"
                  />
                ))}

                {/* Labels */}
                <text
                  x={(offsetMs / periodicity) * 360}
                  y="70"
                  className="text-xs fill-amber-600 font-bold"
                >
                  Offset: {offsetMs}ms ({offset} slots)
                </text>
                <text
                  x={(offsetMs / periodicity) * 360 + (duration / periodicity) * 360}
                  y="70"
                  textAnchor="end"
                  className="text-xs fill-amber-600 font-bold"
                >
                  Duration: {duration}ms ({durationSlots} slots)
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <g transform="translate(20, 20)">
            <rect x="0" y="0" width="20" height="15" fill="#f59e0b" rx="2" />
            <text x="25" y="12" className="text-xs fill-slate-600 dark:fill-slate-400">SMTC Window</text>
            <rect x="120" y="0" width="15" height="15" fill="#d97706" rx="2" />
            <text x="140" y="12" className="text-xs fill-slate-600 dark:fill-slate-400">SSB Bursts</text>
          </g>
        </svg>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg text-center">
          <div className="text-sm text-slate-500 dark:text-slate-400">Periodicity</div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{periodicity}ms</div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg text-center">
          <div className="text-sm text-slate-500 dark:text-slate-400">Duration</div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{duration}ms</div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg text-center">
          <div className="text-sm text-slate-500 dark:text-slate-400">Duty Cycle</div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {((duration / periodicity) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {mode === "fun" && (
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            SMTC is like setting your alarm clock! The periodicity is how often it rings, 
            the duration is how long you snooze, and the offset is when you first set it. 
            The UE only "listens" during the SMTC window!
          </p>
        </div>
      )}
    </div>
  );
};

// --- Intra vs Inter Comparison ---
const IntraInterComparison: React.FC<{ mode: ModeType }> = ({ mode }) => {
  const [rxConfig, setRxConfig] = useState<RxConfig>("2rx");
  const [smtcPeriod, setSmtcPeriod] = useState<number>(20);
  const [mgrp, setMgrp] = useState<number>(40);
  const [cssf, setCssf] = useState<number>(1);
  const [kp, setKp] = useState<number>(1);

  const intraResults = calculateTIdentifyIntra(rxConfig, smtcPeriod, cssf, kp);
  const interResults = calculateTIdentifyInter(rxConfig, mgrp, smtcPeriod, cssf);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <ArrowRightLeft className="w-6 h-6 text-indigo-500" />
          Intra vs Inter-Frequency Comparison
        </h3>
      </div>

      {/* RX Configuration Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
          UE RX Configuration
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setRxConfig("1rx")}
            className={`flex-1 p-3 rounded-lg border-2 transition-all ${
              rxConfig === "1rx"
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                : "border-slate-200 dark:border-slate-600"
            }`}
          >
            <div className="font-bold">1Rx</div>
            <div className="text-xs text-slate-500">Single receive chain</div>
          </button>
          <button
            onClick={() => setRxConfig("2rx")}
            className={`flex-1 p-3 rounded-lg border-2 transition-all ${
              rxConfig === "2rx"
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                : "border-slate-200 dark:border-slate-600"
            }`}
          >
            <div className="font-bold">2Rx</div>
            <div className="text-xs text-slate-500">Dual receive chains</div>
          </button>
        </div>
      </div>

      {/* Parameters */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            SMTC Period (ms)
          </label>
          <select
            value={smtcPeriod}
            onChange={(e) => setSmtcPeriod(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg"
          >
            {SMTC_PERIODICITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            MGRP (ms)
          </label>
          <select
            value={mgrp}
            onChange={(e) => setMgrp(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg"
          >
            {[20, 40, 80, 160].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            CSSF
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={cssf}
            onChange={(e) => setCssf(Math.max(1, Number(e.target.value)))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            K<sub>p</sub>
          </label>
          <input
            type="number"
            min="1"
            max="5"
            step="0.5"
            value={kp}
            onChange={(e) => setKp(Math.max(0.5, Number(e.target.value)))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg"
          />
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-700">
              <th className="p-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Phase</th>
              <th className="p-3 text-center text-sm font-medium text-blue-600 dark:text-blue-400">
                <Wifi className="w-4 h-4 inline mr-1" />
                Intra-Frequency
              </th>
              <th className="p-3 text-center text-sm font-medium text-orange-600 dark:text-orange-400">
                <Signal className="w-4 h-4 inline mr-1" />
                Inter-Frequency
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200 dark:border-slate-600">
              <td className="p-3 text-sm text-slate-600 dark:text-slate-300">PSS/SSS Sync</td>
              <td className="p-3 text-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{intraResults.sync}ms</span>
              </td>
              <td className="p-3 text-center">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{interResults.sync}ms</span>
              </td>
            </tr>
            <tr className="border-b border-slate-200 dark:border-slate-600">
              <td className="p-3 text-sm text-slate-600 dark:text-slate-300">SSB Measurement</td>
              <td className="p-3 text-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{intraResults.meas}ms</span>
              </td>
              <td className="p-3 text-center">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{interResults.meas}ms</span>
              </td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-900/50">
              <td className="p-3 text-sm font-bold text-slate-700 dark:text-slate-200">Total T<sub>identify</sub></td>
              <td className="p-3 text-center">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{intraResults.total}ms</span>
              </td>
              <td className="p-3 text-center">
                <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">{interResults.total}ms</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Formulas */}
      {mode === "spec" && (
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Intra-Frequency (Clause 9.2B):</p>
            <MathJax>{`\\[T_{PSS/SSS\\_sync}^{intra} = \\max(600, \\lceil ${rxConfig === "1rx" ? 7 : 5} \\times K_p \\rceil \\times SMTC) \\times CSSF\\]`}</MathJax>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Inter-Frequency (Clause 9.3B):</p>
            <MathJax>{`\\[T_{PSS/SSS\\_sync}^{inter} = \\max(600, ${rxConfig === "1rx" ? 10 : 8} \\times \\max(MGRP, SMTC)) \\times CSSF\\]`}</MathJax>
          </div>
        </div>
      )}

      {mode === "fun" && (
        <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            {rxConfig === "1rx" 
              ? "With 1Rx, the UE is like a one-armed juggler - it needs more time to catch everything!"
              : "With 2Rx, the UE is a master juggler with two hands - measurements happen faster!"}
            Intra-frequency is like checking your own pockets (faster), while inter-frequency is like 
            checking your friend's pockets across the room (needs a gap to cross!).
          </p>
        </div>
      )}
    </div>
  );
};

// --- Measurement Period Tables ---
const MeasurementPeriodTables: React.FC<{ mode: ModeType }> = ({ mode }) => {
  const [activeTable, setActiveTable] = useState<"intra" | "inter" | "drx">("intra");

  const intraTableData = {
    headers: ["Condition", "TSSB_measurement_period (2Rx FR1)", "TSSB_measurement_period (1Rx FR1)"],
    rows: [
      ["Without DRX", "max(200ms, 5×Kp×SMTC)×CSSF", "max(200ms, 5×Kp×SMTC)×CSSF"],
      ["With DRX cycle ≤ 320ms", "max(200ms, ceil(5×Kp)×SMTC)×CSSF", "max(200ms, ceil(5×Kp)×SMTC)×CSSF"],
      ["With DRX cycle > 320ms", "max(200ms, ceil(7×Kp)×SMTC)×CSSF", "max(200ms, ceil(7×Kp)×SMTC)×CSSF"],
    ],
  };

  const interTableData = {
    headers: ["Condition", "TSSB_measurement_period (2Rx FR1)", "TSSB_measurement_period (1Rx FR1)"],
    rows: [
      ["Without DRX", "max(200ms, 8×max(MGRP,SMTC))×CSSF", "max(200ms, 10×max(MGRP,SMTC))×CSSF"],
      ["With DRX cycle ≤ 320ms", "max(200ms, 8×max(MGRP,SMTC))×CSSF", "max(200ms, 10×max(MGRP,SMTC))×CSSF"],
      ["With DRX cycle > 320ms", "max(200ms, 10×max(MGRP,SMTC))×CSSF", "max(200ms, 12×max(MGRP,SMTC))×CSSF"],
    ],
  };

  const drxTableData = {
    headers: ["DRX Cycle Length", "Scaling Factor"],
    rows: [
      ["≤ 320ms", "1.0× (no scaling)"],
      ["320ms < DRX ≤ 640ms", "1.5×"],
      ["640ms < DRX ≤ 1280ms", "2.0×"],
      ["> 1280ms", "2.5×"],
    ],
  };

  const tables = {
    intra: { title: "Intra-Frequency Measurement Periods (9.2B)", data: intraTableData },
    inter: { title: "Inter-Frequency Measurement Periods (9.3B)", data: interTableData },
    drx: { title: "DRX Scaling Factors", data: drxTableData },
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-teal-500" />
          Measurement Period Tables
        </h3>
      </div>

      {/* Table Selector */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(tables) as Array<keyof typeof tables>).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTable(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTable === key
                ? "bg-teal-500 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            {key === "intra" ? "Intra-Freq" : key === "inter" ? "Inter-Freq" : "DRX Scaling"}
          </button>
        ))}
      </div>

      {/* Active Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-teal-50 dark:bg-teal-900/30">
              {tables[activeTable].data.headers.map((header, i) => (
                <th
                  key={i}
                  className="p-3 text-left text-sm font-medium text-teal-700 dark:text-teal-300"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tables[activeTable].data.rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="p-3 text-sm text-slate-700 dark:text-slate-300 font-mono"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mode === "spec" && (
        <div className="mt-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
          <p className="text-sm text-teal-800 dark:text-teal-300 font-mono">
            3GPP TS 38.133 clause {activeTable === "intra" ? "9.2B" : activeTable === "inter" ? "9.3B" : "DRX configuration"}
          </p>
        </div>
      )}
    </div>
  );
};

// --- Gap Configuration Comparison ---
const GapConfigurationComparison: React.FC<{ mode: ModeType }> = ({ mode }) => {
  const [configType, setConfigType] = useState<"perUE" | "perFR">("perUE");

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-rose-500" />
          Gap Configuration Types
        </h3>
      </div>

      {/* Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setConfigType("perUE")}
          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
            configType === "perUE"
              ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30"
              : "border-slate-200 dark:border-slate-600"
          }`}
        >
          <div className="font-bold text-lg">Per-UE Configuration</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            One gap config for all frequencies
          </div>
        </button>
        <button
          onClick={() => setConfigType("perFR")}
          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
            configType === "perFR"
              ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30"
              : "border-slate-200 dark:border-slate-600"
          }`}
        >
          <div className="font-bold text-lg">Per-FR Configuration</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Separate gap per Frequency Range
          </div>
        </button>
      </div>

      {/* Comparison Content */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
          <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-3">Characteristics</h4>
          <ul className="space-y-2">
            {configType === "perUE" ? (
              <>
                <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-green-500">✓</span>
                  Single gap pattern applies to all carriers
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-green-500">✓</span>
                  Simpler configuration management
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-red-500">✗</span>
                  May not be optimal for all bands
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-red-500">✗</span>
                  Limited flexibility for mixed FR1/FR2
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-green-500">✓</span>
                  Independent gaps for FR1 and FR2
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-green-500">✓</span>
                  Optimized per frequency range
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-green-500">✓</span>
                  Better for carrier aggregation
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-red-500">✗</span>
                  More complex configuration
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
          <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-3">Use Cases</h4>
          <ul className="space-y-2">
            {configType === "perUE" ? (
              <>
                <li className="text-sm text-slate-600 dark:text-slate-300">• Single band operation</li>
                <li className="text-sm text-slate-600 dark:text-slate-300">• Simple handover scenarios</li>
                <li className="text-sm text-slate-600 dark:text-slate-300">• Resource-constrained devices</li>
                <li className="text-sm text-slate-600 dark:text-slate-300">• RedCap default mode</li>
              </>
            ) : (
              <>
                <li className="text-sm text-slate-600 dark:text-slate-300">• Multi-band CA</li>
                <li className="text-sm text-slate-600 dark:text-slate-300">• FR1 + FR2 operation</li>
                <li className="text-sm text-slate-600 dark:text-slate-300">• Advanced mobility</li>
                <li className="text-sm text-slate-600 dark:text-slate-300">• High-end UE capability</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Visual Diagram */}
      <div className="mt-6 bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
        <svg viewBox="0 0 800 200" className="w-full">
          {configType === "perUE" ? (
            <>
              {/* Per-UE: Single gap for all */}
              <text x="400" y="30" textAnchor="middle" className="text-sm font-bold fill-slate-700 dark:fill-slate-300">
                Per-UE Gap Configuration
              </text>
              
              {/* Gap pattern */}
              <rect x="100" y="60" width="100" height="40" fill="#ef4444" rx="4" opacity="0.8" />
              <text x="150" y="85" textAnchor="middle" className="text-xs fill-white font-bold">GAP</text>
              <rect x="200" y="60" width="200" height="40" fill="#22c55e" rx="4" opacity="0.8" />
              <text x="300" y="85" textAnchor="middle" className="text-xs fill-white font-bold">ACTIVE</text>
              <rect x="400" y="60" width="100" height="40" fill="#ef4444" rx="4" opacity="0.8" />
              <text x="450" y="85" textAnchor="middle" className="text-xs fill-white font-bold">GAP</text>
              <rect x="500" y="60" width="200" height="40" fill="#22c55e" rx="4" opacity="0.8" />
              <text x="600" y="85" textAnchor="middle" className="text-xs fill-white font-bold">ACTIVE</text>

              {/* Labels */}
              <text x="150" y="130" textAnchor="middle" className="text-xs fill-slate-500">FR1 & FR2</text>
              <text x="450" y="130" textAnchor="middle" className="text-xs fill-slate-500">FR1 & FR2</text>
              
              <text x="400" y="170" textAnchor="middle" className="text-sm fill-blue-600 dark:fill-blue-400 font-bold">
                Same gap pattern applies to all frequency ranges
              </text>
            </>
          ) : (
            <>
              {/* Per-FR: Separate gaps */}
              <text x="400" y="30" textAnchor="middle" className="text-sm font-bold fill-slate-700 dark:fill-slate-300">
                Per-FR Gap Configuration
              </text>
              
              {/* FR1 Gap */}
              <rect x="50" y="50" width="80" height="30" fill="#3b82f6" rx="4" opacity="0.8" />
              <text x="90" y="70" textAnchor="middle" className="text-xs fill-white font-bold">FR1 GAP</text>
              <rect x="130" y="50" width="120" height="30" fill="#22c55e" rx="4" opacity="0.8" />
              
              {/* FR2 Gap */}
              <rect x="300" y="50" width="60" height="30" fill="#f59e0b" rx="4" opacity="0.8" />
              <text x="330" y="70" textAnchor="middle" className="text-xs fill-white font-bold">FR2 GAP</text>
              <rect x="360" y="50" width="100" height="30" fill="#22c55e" rx="4" opacity="0.8" />

              {/* Second period */}
              <rect x="500" y="50" width="80" height="30" fill="#3b82f6" rx="4" opacity="0.8" />
              <text x="540" y="70" textAnchor="middle" className="text-xs fill-white font-bold">FR1 GAP</text>
              <rect x="580" y="50" width="120" height="30" fill="#22c55e" rx="4" opacity="0.8" />
              
              <rect x="250" y="90" width="60" height="30" fill="#f59e0b" rx="4" opacity="0.8" />
              <text x="280" y="110" textAnchor="middle" className="text-xs fill-white font-bold">FR2 GAP</text>
              <rect x="310" y="90" width="100" height="30" fill="#22c55e" rx="4" opacity="0.8" />

              {/* Labels */}
              <text x="400" y="170" textAnchor="middle" className="text-sm fill-blue-600 dark:fill-blue-400 font-bold">
                Independent gap patterns for FR1 and FR2
              </text>
            </>
          )}
        </svg>
      </div>

      {mode === "spec" && (
        <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
          <p className="text-sm text-rose-800 dark:text-rose-300 font-mono">
            3GPP TS 38.331: measGapConfig (Per-UE) vs measGapConfigFR1/FR2 (Per-FR)
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN SECTION COMPONENT
// ============================================================================

interface MeasurementSectionProps {
  mode?: ModeType;
}

const MeasurementSection: React.FC<MeasurementSectionProps> = ({ mode = "researcher" }) => {
  const [activeTab, setActiveTab] = useState<string>("gap-patterns");

  const tabs = [
    { id: "gap-patterns", label: "Gap Patterns", icon: Activity },
    { id: "gap-sharing", label: "Gap Sharing", icon: Divide },
    { id: "cssf", label: "CSSF Calculator", icon: Calculator },
    { id: "smtc", label: "SMTC Timing", icon: Clock },
    { id: "comparison", label: "Intra vs Inter", icon: ArrowRightLeft },
    { id: "tables", label: "Period Tables", icon: Layers },
    { id: "config", label: "Gap Config", icon: Settings },
  ];

  return (
    <MathJaxContext>
      <section className="py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-500 rounded-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
              Measurement Procedures
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              3GPP TS 38.133 clause 9.1A - General Measurement Requirements for RedCap
            </p>
          </div>
        </div>

        {mode === "spec" && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300 font-mono">
              Reference: 3GPP TS 38.133 version 17.x.x, clause 9.1A
            </p>
          </div>
        )}

        {mode === "fun" && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Welcome to the measurement playground! Here we'll explore how RedCap devices 
              "look around" at different frequencies while staying connected. Think of it like 
              checking different TV channels while watching your favorite show!
            </p>
          </div>
        )}
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "gap-patterns" && <GapPatternVisualizer mode={mode} />}
          {activeTab === "gap-sharing" && <GapSharingSimulator mode={mode} />}
          {activeTab === "cssf" && <CSSFCalculator mode={mode} />}
          {activeTab === "smtc" && <SMTCTimingVisualizer mode={mode} />}
          {activeTab === "comparison" && <IntraInterComparison mode={mode} />}
          {activeTab === "tables" && <MeasurementPeriodTables mode={mode} />}
          {activeTab === "config" && <GapConfigurationComparison mode={mode} />}
        </motion.div>
      </AnimatePresence>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl"
      >
        <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          Key Concepts Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
            <div className="font-medium text-slate-700 dark:text-slate-200 text-sm">MGL</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Measurement Gap Length</div>
            <div className="text-xs text-slate-400 mt-1">1.5 - 20ms</div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
            <div className="font-medium text-slate-700 dark:text-slate-200 text-sm">MGRP</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Gap Repetition Period</div>
            <div className="text-xs text-slate-400 mt-1">20 - 160ms</div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
            <div className="font-medium text-slate-700 dark:text-slate-200 text-sm">CSSF</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Carrier Scaling Factor</div>
            <div className="text-xs text-slate-400 mt-1">≥ 1</div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
            <div className="font-medium text-slate-700 dark:text-slate-200 text-sm">SMTC</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Measurement Timing</div>
            <div className="text-xs text-slate-400 mt-1">5 - 160ms period</div>
          </div>
        </div>
      </motion.div>
    </section>
    </MathJaxContext>
  );
};

export default MeasurementSection;
