"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Star,
  Zap,
  Target,
  Trophy,
  Flame,
  Crown,
  Gem,
  Shield,
  Sword,
  Lock,
  Unlock,
  Info,
  Share2,
} from "lucide-react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earned: boolean;
  earnedAt?: string;
  requirement: string;
  xpReward: number;
}

interface BadgeCollectionProps {
  badges: Badge[];
  onShare?: (badge: Badge) => void;
}

const rarityConfig = {
  common: {
    label: "Common",
    bgColor: "bg-slate-100",
    textColor: "text-slate-600",
    borderColor: "border-slate-200",
    glowColor: "shadow-slate-200",
  },
  rare: {
    label: "Rare",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    glowColor: "shadow-blue-200",
  },
  epic: {
    label: "Epic",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    glowColor: "shadow-purple-200",
  },
  legendary: {
    label: "Legendary",
    bgColor: "bg-amber-100",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    glowColor: "shadow-amber-200",
  },
};

export const defaultBadges: Badge[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete the introduction module",
    icon: Star,
    color: "from-yellow-400 to-orange-500",
    rarity: "common",
    earned: true,
    earnedAt: "2024-01-15",
    requirement: "Complete Introduction",
    xpReward: 50,
  },
  {
    id: "1rx-master",
    name: "1Rx Master",
    description: "Demonstrate understanding of single receive antenna configuration",
    icon: Target,
    color: "from-blue-400 to-cyan-500",
    rarity: "common",
    earned: true,
    earnedAt: "2024-01-16",
    requirement: "Pass 1Rx Quiz",
    xpReward: 100,
  },
  {
    id: "2rx-expert",
    name: "2Rx Expert",
    description: "Master dual receive antenna concepts and benefits",
    icon: Zap,
    color: "from-emerald-400 to-green-500",
    rarity: "rare",
    earned: true,
    earnedAt: "2024-01-18",
    requirement: "Pass 2Rx Quiz",
    xpReward: 150,
  },
  {
    id: "rlm-ninja",
    name: "RLM Ninja",
    description: "Perfect score on Radio Link Monitoring quiz",
    icon: Sword,
    color: "from-red-400 to-rose-500",
    rarity: "rare",
    earned: false,
    requirement: "100% on RLM Quiz",
    xpReward: 200,
  },
  {
    id: "gap-guru",
    name: "Gap Guru",
    description: "Understand all measurement gap configurations",
    icon: Shield,
    color: "from-indigo-400 to-purple-500",
    rarity: "epic",
    earned: false,
    requirement: "Complete Gap Analysis Module",
    xpReward: 300,
  },
  {
    id: "formula-wizard",
    name: "Formula Wizard",
    description: "Correctly use all formula calculators 5 times each",
    icon: Gem,
    color: "from-violet-400 to-fuchsia-500",
    rarity: "epic",
    earned: false,
    requirement: "Use each calculator 5 times",
    xpReward: 350,
  },
  {
    id: "speed-runner",
    name: "Speed Runner",
    description: "Complete a quiz in under 2 minutes with 90%+ score",
    icon: Flame,
    color: "from-orange-400 to-red-500",
    rarity: "rare",
    earned: false,
    requirement: "Fast quiz completion",
    xpReward: 250,
  },
  {
    id: "perfect-streak",
    name: "Perfect Streak",
    description: "Answer 20 questions correctly in a row",
    icon: Crown,
    color: "from-amber-400 to-yellow-500",
    rarity: "legendary",
    earned: false,
    requirement: "20 correct answers streak",
    xpReward: 500,
  },
  {
    id: "redcap-champion",
    name: "RedCap Champion",
    description: "Complete all learning modules and earn all other badges",
    icon: Trophy,
    color: "from-yellow-300 via-amber-400 to-orange-500",
    rarity: "legendary",
    earned: false,
    requirement: "Complete all modules",
    xpReward: 1000,
  },
  {
    id: "knowledge-sharer",
    name: "Knowledge Sharer",
    description: "Share your progress on social media",
    icon: Share2,
    color: "from-sky-400 to-blue-500",
    rarity: "common",
    earned: false,
    requirement: "Share a badge",
    xpReward: 75,
  },
];

export default function BadgeCollection({ badges, onShare }: BadgeCollectionProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [filter, setFilter] = useState<"all" | "earned" | "locked" | Badge["rarity"]>("all");

  const filteredBadges = badges.filter((badge) => {
    if (filter === "all") return true;
    if (filter === "earned") return badge.earned;
    if (filter === "locked") return !badge.earned;
    return badge.rarity === filter;
  });

  const earnedCount = badges.filter((b) => b.earned).length;
  const totalXP = badges.filter((b) => b.earned).reduce((sum, b) => sum + b.xpReward, 0);

  return (
    <div className="w-full">
      {/* Stats Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full">
            <Award className="w-5 h-5" />
            <span className="font-semibold">
              {earnedCount} / {badges.length} Badges
            </span>
          </div>
          <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full">
            <Star className="w-5 h-5" />
            <span className="font-semibold">{totalXP} XP Earned</span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {["all", "earned", "locked", "common", "rare", "epic", "legendary"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredBadges.map((badge, index) => {
          const Icon = badge.icon;
          const rarity = rarityConfig[badge.rarity];

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedBadge(badge)}
              className={`relative cursor-pointer group ${
                badge.earned ? "" : "opacity-60"
              }`}
            >
              <div
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                  badge.earned
                    ? `bg-white ${rarity.borderColor} hover:shadow-lg hover:scale-105`
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                {/* Badge Icon */}
                <div
                  className={`relative w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${badge.color} p-0.5`}
                >
                  <div
                    className={`w-full h-full rounded-full flex items-center justify-center ${
                      badge.earned ? "bg-white" : "bg-slate-100"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        badge.earned ? "text-slate-700" : "text-slate-400"
                      }`}
                    />
                  </div>

                  {/* Earned Indicator */}
                  {badge.earned && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <Unlock className="w-3 h-3 text-white" />
                    </motion.div>
                  )}

                  {/* Locked Indicator */}
                  {!badge.earned && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Badge Info */}
                <h4 className="text-center font-semibold text-slate-800 text-sm mb-1">
                  {badge.name}
                </h4>
                <div className="flex items-center justify-center gap-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${rarity.bgColor} ${rarity.textColor}`}
                  >
                    {rarity.label}
                  </span>
                </div>

                {/* XP Reward */}
                <div className="mt-2 text-center">
                  <span className="text-xs text-amber-600 font-medium">+{badge.xpReward} XP</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              {(() => {
                const Icon = selectedBadge.icon;
                const rarity = rarityConfig[selectedBadge.rarity];

                return (
                  <>
                    {/* Badge Header */}
                    <div className="text-center mb-6">
                      <div
                        className={`relative w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${selectedBadge.color} p-1`}
                      >
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <Icon className="w-12 h-12 text-slate-700" />
                        </div>
                        {selectedBadge.earned && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center"
                          >
                            <Unlock className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-1">
                        {selectedBadge.name}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${rarity.bgColor} ${rarity.textColor}`}
                      >
                        {rarity.label}
                      </span>
                    </div>

                    {/* Badge Details */}
                    <div className="space-y-4">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-slate-600">{selectedBadge.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-amber-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-amber-600">
                            +{selectedBadge.xpReward}
                          </div>
                          <div className="text-sm text-amber-700">XP Reward</div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                          <div className="text-sm font-medium text-blue-700">
                            {selectedBadge.requirement}
                          </div>
                          <div className="text-xs text-blue-600">Requirement</div>
                        </div>
                      </div>

                      {selectedBadge.earned && selectedBadge.earnedAt && (
                        <div className="bg-emerald-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-emerald-700">
                            <Award className="w-5 h-5" />
                            <span className="font-medium">
                              Earned on {new Date(selectedBadge.earnedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {!selectedBadge.earned && (
                        <div className="bg-slate-100 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Lock className="w-5 h-5" />
                            <span className="font-medium">Locked - Complete the requirement to unlock</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setSelectedBadge(null)}
                        className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700 transition-colors"
                      >
                        Close
                      </button>
                      {selectedBadge.earned && onShare && (
                        <button
                          onClick={() => onShare(selectedBadge)}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl font-semibold text-white transition-colors"
                        >
                          Share Badge
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
