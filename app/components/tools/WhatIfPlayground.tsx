"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Clock,
  Signal,
  BarChart3,
  Layers,
  Target,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  baseParams: SimulationParams;
}

interface SimulationParams {
  rxConfig: 1 | 2;
  tssb: number;
  mgrp: number;
  drxCycle: number;
  snr: number;
  cellLoad: number;
  mobility: number;
}

interface SimulationResult {
  rlmPeriod: number;
  detectionAccuracy: number;
  powerConsumption: number;
  resourceEfficiency: number;
  coverageScore: number;
  status: "good" | "warning" | "critical";
}

const scenarios: Scenario[] = [
  {
    id: "urban",
    name: "Urban Dense",
    description: "High cell load, good SNR, high mobility",
    icon: Layers,
    baseParams: {
      rxConfig: 1,
      tssb: 20,
      mgrp: 40,
      drxCycle: 320,
      snr: 15,
      cellLoad: 80,
      mobility: 60,
    },
  },
  {
    id: "rural",
    name: "Rural Coverage",
    description: "Low cell load, poor SNR, low mobility",
    icon: Signal,
    baseParams: {
      rxConfig: 2,
      tssb: 40,
      mgrp: 80,
      drxCycle: 640,
      snr: 5,
      cellLoad: 30,
      mobility: 10,
    },
  },
  {
    id: "iot",
    name: "IoT Static",
    description: "Power constrained, static device, periodic traffic",
    icon: Zap,
    baseParams: {
      rxConfig: 1,
      tssb: 80,
      mgrp: 160,
      drxCycle: 1024,
      snr: 10,
      cellLoad: 20,
      mobility: 0,
    },
  },
  {
    id: "highway",
    name: "Highway Mobile",
    description: "Very high mobility, handover intensive",
    icon: Activity,
    baseParams: {
      rxConfig: 2,
      tssb: 20,
      mgrp: 40,
      drxCycle: 160,
      snr: 12,
      cellLoad: 50,
      mobility: 120,
    },
  },
];

const calculateSimulation = (params: SimulationParams): SimulationResult => {
  // P-Factor calculation
  const pFactor = 1 / (1 - params.tssb / params.mgrp);

  // Base RLM period
  let rlmPeriod = params.rxConfig === 1 ? 400 : 200;
  rlmPeriod = rlmPeriod * pFactor;

  // SNR impact on detection accuracy
  let detectionAccuracy = Math.min(99, 70 + params.snr * 1.5);
  if (params.rxConfig === 2) {
    detectionAccuracy = Math.min(99, detectionAccuracy + 10);
  }

  // Power consumption (normalized)
  let powerConsumption = params.rxConfig === 1 ? 100 : 140;
  powerConsumption = powerConsumption * (params.drxCycle / 320);

  // Resource efficiency
  let resourceEfficiency = params.rxConfig === 1 ? 50 : 100;
  resourceEfficiency = resourceEfficiency * (1 - params.cellLoad / 200);

  // Coverage score
  let coverageScore = params.snr * 5 + (params.rxConfig === 2 ? 25 : 0);
  coverageScore = Math.min(100, coverageScore);

  // Determine status
  let status: "good" | "warning" | "critical" = "good";
  if (detectionAccuracy < 80 || coverageScore < 50) {
    status = "critical";
  } else if (detectionAccuracy < 90 || coverageScore < 70) {
    status = "warning";
  }

  return {
    rlmPeriod: Math.round(rlmPeriod),
    detectionAccuracy: Math.round(detectionAccuracy),
    powerConsumption: Math.round(powerConsumption),
    resourceEfficiency: Math.round(resourceEfficiency),
    coverageScore: Math.round(coverageScore),
    status,
  };
};

export default function WhatIfPlayground() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [params, setParams] = useState<SimulationParams>(scenarios[0].baseParams);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [history, setHistory] = useState<{ params: SimulationParams; result: SimulationResult }[]>([]);

  // Calculate result when params change
  useEffect(() => {
    const newResult = calculateSimulation(params);
    setResult(newResult);
  }, [params]);

  const handleParamChange = (key: keyof SimulationParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleScenarioChange = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setParams(scenario.baseParams);
  };

  const handleSimulate = useCallback(() => {
    setIsSimulating(true);
    setTimeout(() => {
      const newResult = calculateSimulation(params);
      setResult(newResult);
      setHistory((prev) => [{ params: { ...params }, result: newResult }, ...prev.slice(0, 4)]);
      setIsSimulating(false);
    }, 800);
  }, [params]);

  const handleReset = () => {
    setParams(selectedScenario.baseParams);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Scenario Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isSelected = selectedScenario.id === scenario.id;
          return (
            <motion.button
              key={scenario.id}
              onClick={() => handleScenarioChange(scenario)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon
                className={`w-6 h-6 mb-2 ${isSelected ? "text-blue-500" : "text-slate-400"}`}
              />
              <span
                className={`text-sm font-semibold block ${
                  isSelected ? "text-blue-700" : "text-slate-700"
                }`}
              >
                {scenario.name}
              </span>
              <span className="text-xs text-slate-500">{scenario.description}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Simulation Parameters
            </h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Rx Configuration Toggle */}
            <div className="space-y-3">
              <label className="font-semibold text-slate-700">Rx Configuration</label>
              <div className="flex bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => handleParamChange("rxConfig", 1)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                    params.rxConfig === 1
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-slate-600"
                  }`}
                >
                  1Rx
                </button>
                <button
                  onClick={() => handleParamChange("rxConfig", 2)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                    params.rxConfig === 2
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-slate-600"
                  }`}
                >
                  2Rx
                </button>
              </div>
            </div>

            {/* Sliders */}
            {[
              { key: "tssb", label: "TSSB", min: 10, max: 160, step: 10, unit: "ms" },
              { key: "mgrp", label: "MGRP", min: 20, max: 160, step: 10, unit: "ms" },
              { key: "drxCycle", label: "DRX Cycle", min: 32, max: 1024, step: 32, unit: "ms" },
              { key: "snr", label: "SNR", min: -10, max: 30, step: 1, unit: "dB" },
              { key: "cellLoad", label: "Cell Load", min: 0, max: 100, step: 5, unit: "%" },
              { key: "mobility", label: "Mobility", min: 0, max: 150, step: 5, unit: "km/h" },
            ].map((slider) => (
              <div key={slider.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">{slider.label}</label>
                  <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">
                    {params[slider.key as keyof SimulationParams]} {slider.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={params[slider.key as keyof SimulationParams]}
                  onChange={(e) =>
                    handleParamChange(slider.key as keyof SimulationParams, parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
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
                onClick={handleSimulate}
                disabled={isSimulating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white transition-all hover:shadow-lg disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Simulation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Status Card */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={result.status}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`rounded-2xl p-6 text-white ${
                  result.status === "good"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                    : result.status === "warning"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600"
                    : "bg-gradient-to-r from-red-500 to-rose-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  {result.status === "good" ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : result.status === "warning" ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : (
                    <AlertTriangle className="w-8 h-8" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold">
                      {result.status === "good"
                        ? "Optimal Configuration"
                        : result.status === "warning"
                        ? "Suboptimal Configuration"
                        : "Critical Issues Detected"}
                    </h3>
                    <p className="text-white/80">
                      {result.status === "good"
                        ? "This configuration provides excellent performance"
                        : result.status === "warning"
                        ? "Consider adjusting parameters for better performance"
                        : "Significant improvements needed - try 2Rx or increase SNR"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Metrics Grid */}
          {result && (
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-4 shadow-md border border-slate-200"
              >
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">RLM Period</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{result.rlmPeriod} ms</div>
                <div className="text-xs text-slate-400">Evaluation interval</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-xl p-4 shadow-md border border-slate-200"
              >
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Detection Accuracy</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{result.detectionAccuracy}%</div>
                <div className="text-xs text-slate-400">Out-of-sync reliability</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-4 shadow-md border border-slate-200"
              >
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Power Consumption</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{result.powerConsumption}</div>
                <div className="text-xs text-slate-400">Relative units</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-xl p-4 shadow-md border border-slate-200"
              >
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">Resource Efficiency</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{result.resourceEfficiency}%</div>
                <div className="text-xs text-slate-400">PRB utilization</div>
              </motion.div>
            </div>
          )}

          {/* Coverage Score */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-md border border-slate-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-slate-500">
                  <Signal className="w-4 h-4" />
                  <span className="text-sm font-medium">Coverage Score</span>
                </div>
                <span className="text-2xl font-bold text-slate-800">{result.coverageScore}/100</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.coverageScore}%` }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className={`h-full rounded-full ${
                    result.coverageScore >= 70
                      ? "bg-emerald-500"
                      : result.coverageScore >= 50
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                />
              </div>
            </motion.div>
          )}

          {/* History */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl p-4 shadow-md border border-slate-200"
            >
              <h4 className="font-semibold text-slate-700 mb-3">Recent Simulations</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-sm"
                  >
                    <span className="text-slate-600">
                      {item.params.rxConfig}Rx | SNR: {item.params.snr}dB
                    </span>
                    <span
                      className={`font-semibold ${
                        item.result.status === "good"
                          ? "text-emerald-600"
                          : item.result.status === "warning"
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.result.detectionAccuracy}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
