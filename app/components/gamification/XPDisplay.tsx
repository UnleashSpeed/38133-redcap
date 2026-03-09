"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Zap,
  TrendingUp,
  Trophy,
  Target,
  Flame,
  Crown,
  Gem,
  Award,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface XPDisplayProps {
  currentXP: number;
  level: number;
  showAnimation?: boolean;
  xpGained?: number;
  onAnimationComplete?: () => void;
}

interface LevelConfig {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  icon: React.ElementType;
  color: string;
  gradient: string;
}

const levelConfigs: LevelConfig[] = [
  {
    level: 1,
    name: "Novice",
    minXP: 0,
    maxXP: 100,
    icon: Star,
    color: "text-slate-600",
    gradient: "from-slate-400 to-slate-500",
  },
  {
    level: 2,
    name: "Learner",
    minXP: 100,
    maxXP: 300,
    icon: Target,
    color: "text-blue-600",
    gradient: "from-blue-400 to-blue-500",
  },
  {
    level: 3,
    name: "Practitioner",
    minXP: 300,
    maxXP: 600,
    icon: Zap,
    color: "text-emerald-600",
    gradient: "from-emerald-400 to-emerald-500",
  },
  {
    level: 4,
    name: "Specialist",
    minXP: 600,
    maxXP: 1000,
    icon: Flame,
    color: "text-amber-600",
    gradient: "from-amber-400 to-amber-500",
  },
  {
    level: 5,
    name: "Expert",
    minXP: 1000,
    maxXP: 1500,
    icon: Gem,
    color: "text-purple-600",
    gradient: "from-purple-400 to-purple-500",
  },
  {
    level: 6,
    name: "Master",
    minXP: 1500,
    maxXP: 2200,
    icon: Crown,
    color: "text-pink-600",
    gradient: "from-pink-400 to-pink-500",
  },
  {
    level: 7,
    name: "Grandmaster",
    minXP: 2200,
    maxXP: 3000,
    icon: Trophy,
    color: "text-orange-600",
    gradient: "from-orange-400 to-orange-500",
  },
  {
    level: 8,
    name: "Legend",
    minXP: 3000,
    maxXP: 4000,
    icon: Award,
    color: "text-red-600",
    gradient: "from-red-400 to-red-500",
  },
  {
    level: 9,
    name: "RedCap Champion",
    minXP: 4000,
    maxXP: 5500,
    icon: Sparkles,
    color: "text-yellow-600",
    gradient: "from-yellow-300 via-amber-400 to-orange-500",
  },
  {
    level: 10,
    name: "Ultimate Guru",
    minXP: 5500,
    maxXP: 7500,
    icon: Crown,
    color: "text-indigo-600",
    gradient: "from-indigo-400 via-purple-500 to-pink-500",
  },
];

export function getLevelFromXP(xp: number): LevelConfig {
  for (let i = levelConfigs.length - 1; i >= 0; i--) {
    if (xp >= levelConfigs[i].minXP) {
      return levelConfigs[i];
    }
  }
  return levelConfigs[0];
}

export function getXPToNextLevel(currentXP: number): number {
  const currentLevel = getLevelFromXP(currentXP);
  const nextLevel = levelConfigs.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel) return 0;
  return nextLevel.minXP - currentXP;
}

export function getLevelProgress(currentXP: number): number {
  const currentLevel = getLevelFromXP(currentXP);
  const nextLevel = levelConfigs.find((l) => l.level === currentLevel.level + 1);

  if (!nextLevel) return 100;

  const levelRange = nextLevel.minXP - currentLevel.minXP;
  const xpInLevel = currentXP - currentLevel.minXP;
  return Math.min(100, Math.round((xpInLevel / levelRange) * 100));
}

export default function XPDisplay({
  currentXP,
  level,
  showAnimation = false,
  xpGained = 0,
  onAnimationComplete,
}: XPDisplayProps) {
  const [displayXP, setDisplayXP] = useState(currentXP);
  const [showGainAnimation, setShowGainAnimation] = useState(false);
  const [animatedGain, setAnimatedGain] = useState(0);

  const levelConfig = getLevelFromXP(currentXP);
  const progress = getLevelProgress(currentXP);
  const xpToNext = getXPToNextLevel(currentXP);
  const nextLevel = levelConfigs.find((l) => l.level === levelConfig.level + 1);

  const LevelIcon = levelConfig.icon;

  // XP gain animation
  useEffect(() => {
    if (showAnimation && xpGained > 0) {
      setShowGainAnimation(true);
      setAnimatedGain(0);

      const duration = 1500;
      const steps = 30;
      const stepValue = xpGained / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        setAnimatedGain(Math.min(Math.round(stepValue * currentStep), xpGained));
        setDisplayXP(currentXP - xpGained + Math.round(stepValue * currentStep));

        if (currentStep >= steps) {
          clearInterval(interval);
          setTimeout(() => {
            setShowGainAnimation(false);
            onAnimationComplete?.();
          }, 1000);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [showAnimation, xpGained, currentXP, onAnimationComplete]);

  return (
    <div className="relative">
      {/* Main XP Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Level Header */}
        <div className={`bg-gradient-to-r ${levelConfig.gradient} p-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <LevelIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-80">Level {levelConfig.level}</div>
                <div className="font-bold text-lg">{levelConfig.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{displayXP.toLocaleString()}</div>
              <div className="text-sm opacity-80">Total XP</div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="p-4">
          {/* XP Gain Animation */}
          <AnimatePresence>
            {showGainAnimation && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </motion.div>
                <span className="text-2xl font-bold text-amber-600">+{animatedGain} XP</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Progress to Level {nextLevel?.level || "Max"}</span>
              <span className="font-medium text-slate-800">{progress}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${levelConfig.gradient}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* XP Info */}
          <div className="flex justify-between text-sm text-slate-500">
            <span>{levelConfig.minXP.toLocaleString()} XP</span>
            {nextLevel ? (
              <span>{xpToNext.toLocaleString()} XP to next level</span>
            ) : (
              <span className="text-emerald-600 font-medium">Max Level Reached!</span>
            )}
            <span>{(nextLevel?.minXP || levelConfig.minXP).toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* Level Preview */}
      {nextLevel && (
        <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-200 rounded-lg">
                <nextLevel.icon className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Next Level</div>
                <div className="font-semibold text-slate-700">{nextLevel.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Unlocks at</div>
              <div className="font-semibold text-slate-700">
                {nextLevel.minXP.toLocaleString()} XP
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact XP Display for headers/navbars
export function XPDisplayCompact({
  currentXP,
  showAnimation = false,
  xpGained = 0,
}: {
  currentXP: number;
  showAnimation?: boolean;
  xpGained?: number;
}) {
  const levelConfig = getLevelFromXP(currentXP);
  const progress = getLevelProgress(currentXP);
  const LevelIcon = levelConfig.icon;

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-2 shadow-md border border-slate-200">
      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${levelConfig.gradient}`}>
        <LevelIcon className="w-4 h-4 text-white" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Lvl {levelConfig.level}</span>
          <span className="text-slate-400">|</span>
          <span className="font-mono text-slate-600">{currentXP.toLocaleString()} XP</span>
          {showAnimation && xpGained > 0 && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-amber-600 font-bold"
            >
              +{xpGained}
            </motion.span>
          )}
        </div>
        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${levelConfig.gradient}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// XP History Component
export function XPHistory({
  history,
}: {
  history: { action: string; xp: number; timestamp: string }[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          XP History
        </h3>
      </div>
      <div className="p-4 max-h-64 overflow-y-auto">
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-center text-slate-400 py-4">No XP earned yet. Start learning!</p>
          ) : (
            history.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-700">{item.action}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className="font-bold text-amber-600">+{item.xp} XP</span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
