"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  Zap,
  Activity,
  BarChart3,
  Info,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";

type FormulaType = "p-factor" | "tevaluate" | "nserv" | "cssf";

interface FormulaResult {
  value: number;
  unit: string;
  explanation: string;
}

interface FormulaConfig {
  id: FormulaType;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  inputs: {
    name: string;
    key: string;
    min: number;
    max: number;
    step: number;
    default: number;
    unit: string;
    description: string;
  }[];
  calculate: (inputs: Record<string, number>) => FormulaResult;
  formula: string;
}

const formulas: FormulaConfig[] = [
  {
    id: "p-factor",
    name: "P-Factor Calculator",
    description: "Calculate the P-Factor for FR1 RLM evaluation period scaling",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
    formula: "P = 1 / (1 - TSSB / MGRP)",
    inputs: [
      {
        name: "TSSB",
        key: "tssb",
        min: 10,
        max: 160,
        step: 10,
        default: 40,
        unit: "ms",
        description: "Time between SSB transmissions",
      },
      {
        name: "MGRP",
        key: "mgrp",
        min: 20,
        max: 160,
        step: 10,
        default: 80,
        unit: "ms",
        description: "Measurement Gap Repetition Period",
      },
    ],
    calculate: (inputs) => {
      const p = 1 / (1 - inputs.tssb / inputs.mgrp);
      return {
        value: Math.round(p * 100) / 100,
        unit: "",
        explanation: `P-Factor of ${p.toFixed(2)} means the evaluation period is scaled by this factor during gaps`,
      };
    },
  },
  {
    id: "tevaluate",
    name: "TEvaluate Calculator",
    description: "Calculate evaluation period for 2Rx out-of-sync detection",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    formula: "TEvaluate = Max(200, Ceil(10 × P) × TSSB)",
    inputs: [
      {
        name: "P-Factor",
        key: "pFactor",
        min: 1,
        max: 5,
        step: 0.1,
        default: 2,
        unit: "",
        description: "Calculated P-Factor from gap configuration",
      },
      {
        name: "TSSB",
        key: "tssb",
        min: 10,
        max: 160,
        step: 10,
        default: 40,
        unit: "ms",
        description: "Time between SSB transmissions",
      },
    ],
    calculate: (inputs) => {
      const tEvaluate = Math.max(200, Math.ceil(10 * inputs.pFactor) * inputs.tssb);
      return {
        value: tEvaluate,
        unit: "ms",
        explanation: `Evaluation period of ${tEvaluate}ms ensures reliable out-of-sync detection with 2Rx`,
      };
    },
  },
  {
    id: "nserv",
    name: "Nserv_RedCap Calculator",
    description: "Calculate serving cell evaluation period for RedCap devices",
    icon: Activity,
    color: "from-emerald-500 to-green-500",
    formula: "Nserv = f(DRX, eDRX, PTW, 1Rx/2Rx)",
    inputs: [
      {
        name: "DRX Cycle",
        key: "drxCycle",
        min: 32,
        max: 1024,
        step: 32,
        default: 320,
        unit: "ms",
        description: "Discontinuous Reception cycle length",
      },
      {
        name: "eDRX Cycle",
        key: "edrxCycle",
        min: 0,
        max: 10485,
        step: 256,
        default: 0,
        unit: "ms",
        description: "Extended DRX cycle (0 if disabled)",
      },
      {
        name: "PTW",
        key: "ptw",
        min: 2.56,
        max: 40.96,
        step: 2.56,
        default: 2.56,
        unit: "s",
        description: "Paging Time Window",
      },
      {
        name: "Rx Config",
        key: "rxConfig",
        min: 1,
        max: 2,
        step: 1,
        default: 1,
        unit: "Rx",
        description: "Number of receive antennas (1 or 2)",
      },
    ],
    calculate: (inputs) => {
      let basePeriod = inputs.drxCycle;
      if (inputs.edrxCycle > 0) {
        basePeriod = Math.min(basePeriod + inputs.edrxCycle / 10, inputs.ptw * 1000);
      }
      const nserv = inputs.rxConfig === 1 
        ? basePeriod * 1.5 
        : basePeriod * 1.2;
      return {
        value: Math.round(nserv),
        unit: "ms",
        explanation: `Serving cell evaluation period of ${Math.round(nserv)}ms for ${inputs.rxConfig}Rx RedCap device`,
      };
    },
  },
  {
    id: "cssf",
    name: "CSSF Calculator",
    description: "Calculate Channel State Information Scaling Factor",
    icon: BarChart3,
    color: "from-purple-500 to-pink-500",
    formula: "CSSF_within_gap = 1 / (1 - Mtot × Ri)",
    inputs: [
      {
        name: "Mtot",
        key: "mtot",
        min: 0.1,
        max: 0.9,
        step: 0.05,
        default: 0.3,
        unit: "",
        description: "Total measurement gap ratio",
      },
      {
        name: "Ri",
        key: "ri",
        min: 0.1,
        max: 2.0,
        step: 0.1,
        default: 0.5,
        unit: "",
        description: "CSI-RS periodicity ratio",
      },
    ],
    calculate: (inputs) => {
      const cssf = 1 / (1 - inputs.mtot * inputs.ri);
      return {
        value: Math.round(cssf * 100) / 100,
        unit: "",
        explanation: `CSSF of ${cssf.toFixed(2)} scales CSI measurement period during gaps`,
      };
    },
  },
];

export default function FormulaCalculator() {
  const [selectedFormula, setSelectedFormula] = useState<FormulaType>("p-factor");
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [result, setResult] = useState<FormulaResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{ formula: string; inputs: Record<string, number>; result: FormulaResult }[]>([]);

  const currentFormula = formulas.find((f) => f.id === selectedFormula)!;

  // Initialize inputs when formula changes
  useEffect(() => {
    const defaultInputs: Record<string, number> = {};
    currentFormula.inputs.forEach((input) => {
      defaultInputs[input.key] = input.default;
    });
    setInputs(defaultInputs);
  }, [selectedFormula]);

  // Calculate result when inputs change
  useEffect(() => {
    if (Object.keys(inputs).length > 0) {
      const newResult = currentFormula.calculate(inputs);
      setResult(newResult);
    }
  }, [inputs, currentFormula]);

  const handleInputChange = (key: string, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    const defaultInputs: Record<string, number> = {};
    currentFormula.inputs.forEach((input) => {
      defaultInputs[input.key] = input.default;
    });
    setInputs(defaultInputs);
  };

  const handleSaveToHistory = useCallback(() => {
    if (result) {
      setHistory((prev) => [
        { formula: currentFormula.name, inputs: { ...inputs }, result },
        ...prev.slice(0, 4),
      ]);
    }
  }, [result, currentFormula.name, inputs]);

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(`${result.value} ${result.unit}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Formula Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {formulas.map((formula) => {
          const Icon = formula.icon;
          const isSelected = selectedFormula === formula.id;
          return (
            <motion.button
              key={formula.id}
              onClick={() => setSelectedFormula(formula.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? `border-transparent bg-gradient-to-br ${formula.color} text-white shadow-lg`
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-md"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-6 h-6 mb-2 mx-auto" />
              <span className="text-sm font-semibold block">{formula.name}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <motion.div
          key={selectedFormula}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
        >
          <div className={`bg-gradient-to-r ${currentFormula.color} p-4`}>
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Input Parameters
            </h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Formula Display */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Formula</div>
              <code className="text-sm font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded">
                {currentFormula.formula}
              </code>
            </div>

            {/* Inputs */}
            {currentFormula.inputs.map((input) => (
              <div key={input.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 flex items-center gap-2">
                    {input.name}
                    <div className="group relative">
                      <Info className="w-4 h-4 text-slate-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {input.description}
                      </div>
                    </div>
                  </label>
                  <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">
                    {inputs[input.key]} {input.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  value={inputs[input.key] || input.default}
                  onChange={(e) => handleInputChange(input.key, parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{input.min} {input.unit}</span>
                  <span>{input.max} {input.unit}</span>
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleSaveToHistory}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white transition-colors bg-gradient-to-r ${currentFormula.color}`}
              >
                Save to History
              </button>
            </div>
          </div>
        </motion.div>

        {/* Result Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Main Result */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className={`bg-gradient-to-r ${currentFormula.color} p-4`}>
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Result
              </h3>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    key={result.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <div className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                      {result.value}
                      <span className="text-2xl text-slate-400 ml-2">{result.unit}</span>
                    </div>
                    <p className="text-slate-600 mt-4">{result.explanation}</p>

                    <button
                      onClick={copyToClipboard}
                      className="mt-6 flex items-center gap-2 mx-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Result
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 p-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Calculation History
                </h3>
              </div>
              <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                {history.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <span className="font-semibold text-slate-700">{item.formula}</span>
                      <span className="text-slate-400 mx-2">|</span>
                      <span className="text-sm text-slate-500">
                        {Object.entries(item.inputs).map(([k, v]) => `${k}: ${v}`).join(", ")}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-800">
                      {item.result.value} {item.result.unit}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
