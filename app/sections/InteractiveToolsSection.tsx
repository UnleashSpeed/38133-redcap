"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  BarChart3,
  Play,
  Sparkles,
  ChevronRight,
  Info,
  Lightbulb,
  BookOpen,
  Target,
} from "lucide-react";
import FormulaCalculator from "../components/tools/FormulaCalculator";
import RxComparisonDashboard from "../components/tools/RxComparisonDashboard";
import WhatIfPlayground from "../components/tools/WhatIfPlayground";

type ToolTab = "calculator" | "comparison" | "playground";

interface ToolInfo {
  id: ToolTab;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  tips: string[];
}

const tools: ToolInfo[] = [
  {
    id: "calculator",
    name: "Formula Calculator",
    description: "Calculate P-Factor, TEvaluate, Nserv_RedCap, and CSSF in real-time",
    icon: Calculator,
    color: "from-blue-500 to-cyan-500",
    tips: [
      "P-Factor increases as TSSB approaches MGRP",
      "Use TEvaluate for 2Rx out-of-sync timing",
      "Nserv depends on DRX cycle and Rx configuration",
      "CSSF scales CSI measurement during gaps",
    ],
  },
  {
    id: "comparison",
    name: "1Rx vs 2Rx Dashboard",
    description: "Compare receive configurations across metrics and scenarios",
    icon: BarChart3,
    color: "from-purple-500 to-pink-500",
    tips: [
      "2Rx provides 3dB diversity gain",
      "1Rx is better for power-constrained devices",
      "2Rx reduces required PRBs by 50%",
      "Consider coverage vs cost trade-offs",
    ],
  },
  {
    id: "playground",
    name: "What-If Playground",
    description: "Simulate different scenarios and see real-time results",
    icon: Play,
    color: "from-amber-500 to-orange-500",
    tips: [
      "Try different scenarios to see parameter effects",
      "Compare 1Rx and 2Rx in the same conditions",
      "Watch how SNR affects detection accuracy",
      "Monitor coverage score with mobility changes",
    ],
  },
];

export function InteractiveToolsSection() {
  const [activeTab, setActiveTab] = useState<ToolTab>("calculator");
  const [showTips, setShowTips] = useState(true);

  const currentTool = tools.find((t) => t.id === activeTab)!;
  const Icon = currentTool.icon;

  return (
    <section id="interactive-tools" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Interactive Learning
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Interactive Tools & Simulators
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Experiment with RedCap RRM parameters using our interactive calculators and simulators. 
            See real-time results as you adjust configurations.
          </p>
        </motion.div>

        {/* Tool Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {tools.map((tool) => {
            const ToolIcon = tool.icon;
            const isActive = activeTab === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`relative flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                  isActive
                    ? `border-transparent bg-gradient-to-r ${tool.color} text-white shadow-lg scale-105`
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <ToolIcon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">{tool.name}</div>
                  <div className={`text-xs ${isActive ? "text-white/80" : "text-slate-500"}`}>
                    {tool.description}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${isActive ? "rotate-90" : ""}`}
                />
              </button>
            );
          })}
        </motion.div>

        {/* Tips Panel */}
        <AnimatePresence>
          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-amber-800">Pro Tips</h4>
                      <button
                        onClick={() => setShowTips(false)}
                        className="text-amber-600 hover:text-amber-700"
                      >
                        Dismiss
                      </button>
                    </div>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {currentTool.tips.map((tip, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-2 text-sm text-amber-700"
                        >
                          <Target className="w-3 h-3 flex-shrink-0" />
                          {tip}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tool Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
        >
          {/* Tool Header */}
          <div className={`bg-gradient-to-r ${currentTool.color} p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{currentTool.name}</h3>
                  <p className="text-white/80">{currentTool.description}</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-white/60 text-sm">
                <Info className="w-4 h-4" />
                <span>Adjust parameters to see real-time results</span>
              </div>
            </div>
          </div>

          {/* Tool Body */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "calculator" && (
                <motion.div
                  key="calculator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <FormulaCalculator />
                </motion.div>
              )}
              {activeTab === "comparison" && (
                <motion.div
                  key="comparison"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <RxComparisonDashboard />
                </motion.div>
              )}
              {activeTab === "playground" && (
                <motion.div
                  key="playground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <WhatIfPlayground />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Learn the Theory</h4>
            <p className="text-slate-600 text-sm mb-4">
              Understand the mathematical foundations behind these calculations
            </p>
            <a
              href="#theory"
              className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              Read Documentation <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">View Benchmarks</h4>
            <p className="text-slate-600 text-sm mb-4">
              Compare performance metrics across different configurations
            </p>
            <a
              href="#benchmarks"
              className="text-purple-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              See Benchmarks <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="p-3 bg-emerald-100 rounded-lg w-fit mb-4">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Test Your Knowledge</h4>
            <p className="text-slate-600 text-sm mb-4">
              Take quizzes to earn badges and track your progress
            </p>
            <a
              href="#gamification"
              className="text-emerald-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              Start Quiz <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default InteractiveToolsSection;
