"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Trophy,
  Star,
  Target,
  Zap,
  Map,
  Award,
  TrendingUp,
  Gamepad2,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Share2,
  Lock,
  Unlock,
  Flame,
} from "lucide-react";

import BadgeCollection, { defaultBadges, Badge } from "../components/gamification/BadgeCollection";
import ProgressMap, { defaultTopicNodes, TopicNode } from "../components/gamification/ProgressMap";
import QuizComponent, { sampleQuiz } from "../components/gamification/QuizComponent";
import XPDisplay, { XPDisplayCompact, XPHistory, getLevelFromXP } from "../components/gamification/XPDisplay";

// User progress storage key
const STORAGE_KEY = "redcap_user_progress";

interface UserProgress {
  xp: number;
  level: number;
  badges: string[];
  completedTopics: string[];
  quizScores: Record<string, number>;
  xpHistory: { action: string; xp: number; timestamp: string }[];
  streak: number;
  lastActive: string;
}

const defaultProgress: UserProgress = {
  xp: 0,
  level: 1,
  badges: [],
  completedTopics: [],
  quizScores: {},
  xpHistory: [],
  streak: 0,
  lastActive: new Date().toISOString(),
};

type GamificationTab = "overview" | "badges" | "progress" | "quiz";

export default function GamificationSection() {
  const [activeTab, setActiveTab] = useState<GamificationTab>("overview");
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [selectedNode, setSelectedNode] = useState<TopicNode | null>(null);
  const [badges, setBadges] = useState<Badge[]>(defaultBadges);

  // Load progress from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProgress((prev) => ({ ...prev, ...parsed }));

        // Update badges based on earned badges
        setBadges((prev) =>
          prev.map((badge) => ({
            ...badge,
            earned: parsed.badges?.includes(badge.id) || badge.earned,
          }))
        );
      } catch (e) {
        console.error("Failed to load progress:", e);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Update badges with earned status
  useEffect(() => {
    setBadges((prev) =>
      prev.map((badge) => ({
        ...badge,
        earned: progress.badges.includes(badge.id) || badge.earned,
        earnedAt: progress.badges.includes(badge.id)
          ? new Date().toISOString()
          : badge.earnedAt,
      }))
    );
  }, [progress.badges]);

  const addXP = useCallback(
    (amount: number, action: string) => {
      setXpGained(amount);
      setShowXPAnimation(true);

      setProgress((prev) => {
        const newXP = prev.xp + amount;
        const newLevel = getLevelFromXP(newXP).level;

        // Check for level up
        if (newLevel > prev.level) {
          setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981"],
            });
          }, 1500);
        }

        return {
          ...prev,
          xp: newXP,
          level: newLevel,
          xpHistory: [
            { action, xp: amount, timestamp: new Date().toISOString() },
            ...prev.xpHistory.slice(0, 19),
          ],
        };
      });
    },
    [setProgress]
  );

  const awardBadge = useCallback(
    (badgeId: string) => {
      if (!progress.badges.includes(badgeId)) {
        setProgress((prev) => ({
          ...prev,
          badges: [...prev.badges, badgeId],
        }));

        // Trigger confetti for badge
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#f59e0b", "#eab308", "#ca8a04"],
        });
      }
    },
    [progress.badges]
  );

  const handleQuizComplete = useCallback(
    (score: number, xpEarned: number, passed: boolean) => {
      if (passed) {
        addXP(xpEarned, `Completed quiz: ${sampleQuiz.title}`);

        // Award badges based on score
        if (score === 100) {
          awardBadge("rlm-ninja");
        }
        if (score >= 70) {
          awardBadge("1rx-master");
        }

        setProgress((prev) => ({
          ...prev,
          quizScores: {
            ...prev.quizScores,
            [sampleQuiz.id]: score,
          },
        }));
      }

      setTimeout(() => {
        setShowQuiz(false);
      }, 3000);
    },
    [addXP, awardBadge]
  );

  const handleNodeClick = useCallback((node: TopicNode) => {
    setSelectedNode(node);
    if (node.status === "available" || node.status === "in-progress") {
      // In a real app, this would navigate to the lesson
      console.log("Opening lesson:", node.name);
    }
  }, []);

  const handleShareBadge = useCallback((badge: Badge) => {
    // Simulate sharing
    const text = `I earned the "${badge.name}" badge on RedCap RRM Learning! 🎉`;
    if (navigator.share) {
      navigator.share({
        title: "RedCap RRM Learning",
        text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert("Badge info copied to clipboard!");
    }

    // Award sharing badge
    awardBadge("knowledge-sharer");
    addXP(75, "Shared badge on social media");
  }, [addXP, awardBadge]);

  const earnedBadgesCount = badges.filter((b) => b.earned).length;
  const totalXPAvailable = badges.reduce((sum, b) => sum + b.xpReward, 0);
  const totalXPEarned = badges
    .filter((b) => b.earned)
    .reduce((sum, b) => sum + b.xpReward, 0);

  return (
    <section id="gamification" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            <Gamepad2 className="w-4 h-4" />
            Gamified Learning
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Learn, Earn, Level Up!
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Master RedCap RRM concepts through interactive challenges, earn badges, 
            and track your progress as you become a RedCap expert.
          </p>
        </motion.div>

        {/* XP Display (Compact) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <XPDisplayCompact
            currentXP={progress.xp}
            showAnimation={showXPAnimation}
            xpGained={xpGained}
          />
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {[
            { id: "overview", name: "Overview", icon: Target },
            { id: "badges", name: "Badges", icon: Award },
            { id: "progress", name: "Progress Map", icon: Map },
            { id: "quiz", name: "Take Quiz", icon: Gamepad2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as GamificationTab);
                  if (tab.id === "quiz") setShowQuiz(true);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Star className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-800">{progress.xp}</div>
                      <div className="text-sm text-slate-500">Total XP</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Trophy className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-800">{progress.level}</div>
                      <div className="text-sm text-slate-500">Current Level</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-amber-100 rounded-xl">
                      <Award className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-800">
                        {earnedBadgesCount}/{badges.length}
                      </div>
                      <div className="text-sm text-slate-500">Badges Earned</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <Flame className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-800">{progress.streak}</div>
                      <div className="text-sm text-slate-500">Day Streak</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* XP Display & History */}
              <div className="grid lg:grid-cols-2 gap-6">
                <XPDisplay
                  currentXP={progress.xp}
                  level={progress.level}
                  showAnimation={showXPAnimation}
                  xpGained={xpGained}
                  onAnimationComplete={() => setShowXPAnimation(false)}
                />
                <XPHistory history={progress.xpHistory} />
              </div>

              {/* Quick Actions */}
              <div className="mt-8 grid md:grid-cols-3 gap-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("quiz")}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white text-left"
                >
                  <Gamepad2 className="w-8 h-8 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Take a Quiz</h3>
                  <p className="text-white/80 text-sm">Test your knowledge and earn XP</p>
                  <ChevronRight className="w-5 h-5 mt-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("progress")}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white text-left"
                >
                  <Map className="w-8 h-8 mb-4" />
                  <h3 className="text-xl font-bold mb-2">View Progress Map</h3>
                  <p className="text-white/80 text-sm">Track your learning journey</p>
                  <ChevronRight className="w-5 h-5 mt-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("badges")}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white text-left"
                >
                  <Award className="w-8 h-8 mb-4" />
                  <h3 className="text-xl font-bold mb-2">View Badges</h3>
                  <p className="text-white/80 text-sm">Collect all achievements</p>
                  <ChevronRight className="w-5 h-5 mt-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === "badges" && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8"
            >
              <BadgeCollection badges={badges} onShare={handleShareBadge} />
            </motion.div>
          )}

          {activeTab === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ProgressMap
                nodes={defaultTopicNodes}
                onNodeClick={handleNodeClick}
                userXP={progress.xp}
                userLevel={progress.level}
              />
            </motion.div>
          )}

          {activeTab === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {showQuiz ? (
                <QuizComponent
                  quiz={sampleQuiz}
                  onComplete={handleQuizComplete}
                  onExit={() => setShowQuiz(false)}
                />
              ) : (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    Quiz Completed!
                  </h3>
                  <p className="text-slate-600 mb-8">
                    Great job! Check your XP and badges to see what you earned.
                  </p>
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white hover:shadow-lg transition-all"
                  >
                    <RotateCcw className="w-5 h-5 inline mr-2" />
                    Retake Quiz
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
