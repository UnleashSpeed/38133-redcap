"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Antenna,
  Signal,
  Gauge,
  Clock,
  Target,
  Wifi,
  Battery,
  Zap,
  ChevronRight,
  BarChart3,
  Layers,
  ArrowRight,
  Check,
  X,
  Info,
} from "lucide-react";

interface ComparisonMetric {
  category: string;
  metric: string;
  rx1: string | number;
  rx2: string | number;
  unit?: string;
  advantage: "1rx" | "2rx" | "neutral";
  description: string;
}

const comparisonData: ComparisonMetric[] = [
  {
    category: "Aggregation",
    metric: "PDCCH CCE (Out-of-Sync)",
    rx1: 16,
    rx2: 8,
    unit: "CCE",
    advantage: "2rx",
    description: "2Rx requires fewer CCEs for reliable decoding",
  },
  {
    category: "Aggregation",
    metric: "PDCCH CCE (In-Sync)",
    rx1: 8,
    rx2: 4,
    unit: "CCE",
    advantage: "2rx",
    description: "Lower aggregation level with dual antenna diversity",
  },
  {
    category: "Bandwidth",
    metric: "PRB Allocation",
    rx1: 48,
    rx2: 24,
    unit: "PRBs",
    advantage: "2rx",
    description: "2Rx achieves same performance with half the PRBs",
  },
  {
    category: "Evaluation",
    metric: "Out-of-Sync Period",
    rx1: 400,
    rx2: 200,
    unit: "ms",
    advantage: "2rx",
    description: "Faster out-of-sync detection with diversity",
  },
  {
    category: "Evaluation",
    metric: "In-Sync Period",
    rx1: 100,
    rx2: 100,
    unit: "ms",
    advantage: "neutral",
    description: "Same in-sync detection period for both configs",
  },
  {
    category: "Performance",
    metric: "Link Budget Gain",
    rx1: 0,
    rx2: 3,
    unit: "dB",
    advantage: "2rx",
    description: "Typical diversity gain from dual receive paths",
  },
  {
    category: "Performance",
    metric: "BLER at Edge",
    rx1: 10,
    rx2: 5,
    unit: "%",
    advantage: "2rx",
    description: "Lower block error rate at cell edge",
  },
  {
    category: "Power",
    metric: "Baseband Processing",
    rx1: 1,
    rx2: 1.4,
    unit: "x",
    advantage: "1rx",
    description: "2Rx requires ~40% more baseband processing power",
  },
  {
    category: "Power",
    metric: "RF Chain Power",
    rx1: 1,
    rx2: 2,
    unit: "x",
    advantage: "1rx",
    description: "Additional RF chain increases power consumption",
  },
];

const scenarioComparisons = [
  {
    id: "coverage",
    name: "Coverage Limited",
    icon: Signal,
    description: "Cell edge scenarios with weak signal",
    rx1Score: 60,
    rx2Score: 90,
    winner: "2rx",
    details: [
      "2Rx provides 3dB diversity gain",
      "Better handling of fading conditions",
      "Improved signal quality at edge",
    ],
  },
  {
    id: "capacity",
    name: "Capacity Limited",
    icon: Layers,
    description: "Dense urban with interference",
    rx1Score: 70,
    rx2Score: 85,
    winner: "2rx",
    details: [
      "2Rx reduces required PRBs by 50%",
      "Lower CCE aggregation needed",
      "More efficient resource utilization",
    ],
  },
  {
    id: "power",
    name: "Power Constrained",
    icon: Battery,
    description: "IoT devices with battery limitations",
    rx1Score: 90,
    rx2Score: 60,
    winner: "1rx",
    details: [
      "1Rx consumes ~50% less power",
      "Simpler RF architecture",
      "Longer battery life",
    ],
  },
  {
    id: "cost",
    name: "Cost Sensitive",
    icon: Target,
    description: "Budget-constrained deployments",
    rx1Score: 95,
    rx2Score: 50,
    winner: "1rx",
    details: [
      "1Rx has lower BOM cost",
      "Simpler PCB design",
      "Reduced component count",
    ],
  },
];

export default function RxComparisonDashboard() {
  const [activeTab, setActiveTab] = useState<"metrics" | "scenarios">("metrics");
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);

  const categories = [...new Set(comparisonData.map((d) => d.category))];

  const filteredData = highlightedCategory
    ? comparisonData.filter((d) => d.category === highlightedCategory)
    : comparisonData;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("metrics")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "metrics"
                ? "bg-white text-blue-600 shadow-md"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Technical Metrics
          </button>
          <button
            onClick={() => setActiveTab("scenarios")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "scenarios"
                ? "bg-white text-blue-600 shadow-md"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <Gauge className="w-4 h-4 inline mr-2" />
            Scenario Analysis
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "metrics" ? (
          <motion.div
            key="metrics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <button
                onClick={() => setHighlightedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  highlightedCategory === null
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setHighlightedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    highlightedCategory === cat
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                <div className="col-span-3">Metric</div>
                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Antenna className="w-4 h-4" />
                    1Rx
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Wifi className="w-4 h-4" />
                    2Rx
                  </div>
                </div>
                <div className="col-span-2 text-center">Advantage</div>
                <div className="col-span-3">Description</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100">
                {filteredData.map((item, index) => (
                  <motion.div
                    key={item.metric}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-50 transition-colors items-center"
                  >
                    <div className="col-span-3">
                      <div className="font-medium text-slate-800">{item.metric}</div>
                      <div className="text-xs text-slate-400">{item.category}</div>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
                        {item.rx1} {item.unit}
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono">
                        {item.rx2} {item.unit}
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      {item.advantage === "1rx" && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <Check className="w-4 h-4" /> 1Rx
                        </span>
                      )}
                      {item.advantage === "2rx" && (
                        <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                          <Check className="w-4 h-4" /> 2Rx
                        </span>
                      )}
                      {item.advantage === "neutral" && (
                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <span className="w-4 h-4">=</span> Equal
                        </span>
                      )}
                    </div>
                    <div className="col-span-3 text-sm text-slate-600">
                      {item.description}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Antenna className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">1Rx Advantages</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Lower power consumption
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Reduced BOM cost
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Simpler RF design
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Smaller form factor
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Wifi className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">2Rx Advantages</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> 3dB diversity gain
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Better edge coverage
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> 50% PRB reduction
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Faster detection
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="scenarios"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Scenario Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {scenarioComparisons.map((scenario, index) => {
                const Icon = scenario.icon;
                const isSelected = selectedScenario === scenario.id;

                return (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedScenario(isSelected ? null : scenario.id)}
                    className={`cursor-pointer bg-white rounded-2xl shadow-lg border-2 transition-all overflow-hidden ${
                      isSelected
                        ? "border-blue-500 ring-4 ring-blue-100"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 rounded-xl ${
                              scenario.winner === "1rx"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800">{scenario.name}</h3>
                            <p className="text-sm text-slate-500">{scenario.description}</p>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 text-slate-400 transition-transform ${
                            isSelected ? "rotate-90" : ""
                          }`}
                        />
                      </div>

                      {/* Score Bars */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">1Rx</span>
                            <span className="font-semibold text-slate-800">{scenario.rx1Score}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${scenario.rx1Score}%` }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                              className="h-full bg-emerald-500 rounded-full"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">2Rx</span>
                            <span className="font-semibold text-slate-800">{scenario.rx2Score}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${scenario.rx2Score}%` }}
                              transition={{ delay: 0.4, duration: 0.5 }}
                              className="h-full bg-blue-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Winner Badge */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-sm text-slate-500">Recommended:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            scenario.winner === "1rx"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {scenario.winner === "1rx" ? "1Rx Configuration" : "2Rx Configuration"}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-slate-50 border-t border-slate-200"
                        >
                          <div className="p-6">
                            <h4 className="font-semibold text-slate-700 mb-3">Key Benefits</h4>
                            <ul className="space-y-2">
                              {scenario.details.map((detail, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex items-center gap-2 text-slate-600"
                                >
                                  <ArrowRight className="w-4 h-4 text-blue-500" />
                                  {detail}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Decision Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Decision Guide
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-emerald-400 mb-2">Choose 1Rx When:</h4>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Power consumption is critical (IoT sensors)</li>
                    <li>• Cost is a major constraint</li>
                    <li>• Device size must be minimized</li>
                    <li>• Coverage is not a limiting factor</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Choose 2Rx When:</h4>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Coverage extension is needed</li>
                    <li>• Network capacity is constrained</li>
                    <li>• High reliability is required</li>
                    <li>• Device can accommodate extra power</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
