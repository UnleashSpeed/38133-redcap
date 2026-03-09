"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Timer,
  Trophy,
  Star,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Target,
  Zap,
  AlertCircle,
} from "lucide-react";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  xpReward: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in seconds
  passingScore: number; // percentage
  totalXPReward: number;
}

interface QuizComponentProps {
  quiz: Quiz;
  onComplete?: (score: number, xpEarned: number, passed: boolean) => void;
  onExit?: () => void;
}

const difficultyConfig = {
  easy: { color: "bg-emerald-100 text-emerald-700", label: "Easy", multiplier: 1 },
  medium: { color: "bg-amber-100 text-amber-700", label: "Medium", multiplier: 1.5 },
  hard: { color: "bg-red-100 text-red-700", label: "Hard", multiplier: 2 },
};

export const sampleQuiz: Quiz = {
  id: "rlm-basics",
  title: "RedCap RLM Fundamentals",
  description: "Test your understanding of Radio Link Monitoring in RedCap devices",
  questions: [
    {
      id: "q1",
      question: "What is the primary purpose of Radio Link Monitoring (RLM) in RedCap?",
      options: [
        "To measure network throughput",
        "To detect out-of-sync and in-sync conditions",
        "To manage handover decisions",
        "To optimize power consumption",
      ],
      correctAnswer: 1,
      explanation:
        "RLM's primary purpose is to detect out-of-sync and in-sync conditions to determine when the radio link quality has degraded or recovered.",
      difficulty: "easy",
      category: "RLM Basics",
      xpReward: 25,
    },
    {
      id: "q2",
      question: "What is the typical out-of-sync evaluation period for 1Rx RedCap devices?",
      options: ["100 ms", "200 ms", "400 ms", "800 ms"],
      correctAnswer: 2,
      explanation:
        "For 1Rx RedCap devices, the out-of-sync evaluation period is typically 400 ms, which is longer than the 200 ms for 2Rx devices.",
      difficulty: "medium",
      category: "1Rx Configuration",
      xpReward: 50,
    },
    {
      id: "q3",
      question: "How much diversity gain does 2Rx typically provide compared to 1Rx?",
      options: ["1 dB", "2 dB", "3 dB", "6 dB"],
      correctAnswer: 2,
      explanation:
        "2Rx configuration typically provides approximately 3 dB of diversity gain due to the dual receive paths.",
      difficulty: "easy",
      category: "2Rx Benefits",
      xpReward: 25,
    },
    {
      id: "q4",
      question: "What is the formula for calculating the P-Factor?",
      options: [
        "P = TSSB / MGRP",
        "P = 1 / (1 - TSSB / MGRP)",
        "P = MGRP / TSSB",
        "P = 1 - TSSB / MGRP",
      ],
      correctAnswer: 1,
      explanation:
        "The P-Factor is calculated as P = 1 / (1 - TSSB / MGRP), which scales the evaluation period during measurement gaps.",
      difficulty: "medium",
      category: "Formulas",
      xpReward: 50,
    },
    {
      id: "q5",
      question: "For 2Rx out-of-sync detection, what is the minimum TEvaluate value?",
      options: ["100 ms", "200 ms", "400 ms", "Depends on TSSB"],
      correctAnswer: 1,
      explanation:
        "TEvaluate for 2Rx out-of-sync detection has a minimum value of 200 ms, calculated as Max(200, Ceil(10×P)×TSSB).",
      difficulty: "hard",
      category: "TEvaluate",
      xpReward: 75,
    },
    {
      id: "q6",
      question: "How many PRBs does 2Rx require compared to 1Rx for the same performance?",
      options: ["Same amount", "25% fewer", "50% fewer", "75% fewer"],
      correctAnswer: 2,
      explanation:
        "2Rx typically requires 50% fewer PRBs (24 vs 48) compared to 1Rx due to the diversity gain and improved signal quality.",
      difficulty: "medium",
      category: "Resource Efficiency",
      xpReward: 50,
    },
    {
      id: "q7",
      question: "What is the PDCCH CCE aggregation level for 1Rx out-of-sync?",
      options: ["4 CCE", "8 CCE", "16 CCE", "32 CCE"],
      correctAnswer: 2,
      explanation:
        "1Rx requires 16 CCE for out-of-sync PDCCH detection, while 2Rx only requires 8 CCE due to better signal quality.",
      difficulty: "medium",
      category: "Aggregation Levels",
      xpReward: 50,
    },
    {
      id: "q8",
      question: "Which scenario is most suitable for 1Rx configuration?",
      options: [
        "Cell edge with weak signal",
        "High mobility environment",
        "Power-constrained IoT device",
        "High capacity demand area",
      ],
      correctAnswer: 2,
      explanation:
        "1Rx is ideal for power-constrained IoT devices where battery life is critical and the device can tolerate slightly reduced coverage.",
      difficulty: "easy",
      category: "Use Cases",
      xpReward: 25,
    },
  ],
  timeLimit: 600, // 10 minutes
  passingScore: 70,
  totalXPReward: 350,
};

export default function QuizComponent({ quiz, onComplete, onExit }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizState, setQuizState] = useState<"intro" | "active" | "review" | "completed">("intro");
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit || 0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (quizState === "active" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizState, timeRemaining]);

  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);

    // Update streak
    if (selectedAnswer === currentQuestion.correctAnswer) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
      }
    } else {
      setStreak(0);
    }

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setQuizState("completed");

    // Calculate score
    let correctCount = 0;
    let totalXPEarned = 0;
    answers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        correctCount++;
        const difficulty = quiz.questions[index].difficulty;
        totalXPEarned += quiz.questions[index].xpReward * difficultyConfig[difficulty].multiplier;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    if (passed) {
      triggerConfetti();
    }

    onComplete?.(score, Math.round(totalXPEarned), passed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Intro Screen
  if (quizState === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-2xl mx-auto"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{quiz.title}</h2>
              <p className="text-white/80">{quiz.description}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Quiz Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <HelpCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-slate-800">{quiz.questions.length}</div>
              <div className="text-sm text-slate-500">Questions</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <Timer className="w-6 h-6 mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold text-slate-800">
                {quiz.timeLimit ? formatTime(quiz.timeLimit) : "∞"}
              </div>
              <div className="text-sm text-slate-500">Time Limit</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <Star className="w-6 h-6 mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold text-slate-800">{quiz.totalXPReward}</div>
              <div className="text-sm text-slate-500">XP Reward</div>
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div className="mb-8">
            <h3 className="font-semibold text-slate-700 mb-3">Question Difficulty</h3>
            <div className="flex gap-2">
              {["easy", "medium", "hard"].map((diff) => {
                const count = quiz.questions.filter((q) => q.difficulty === diff).length;
                if (count === 0) return null;
                const config = difficultyConfig[diff as keyof typeof difficultyConfig];
                return (
                  <span key={diff} className={`px-3 py-1 rounded-full text-sm ${config.color}`}>
                    {count} {config.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Passing Score */}
          <div className="flex items-center gap-2 p-4 bg-emerald-50 rounded-xl mb-8">
            <Trophy className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700">
              Passing Score: <strong>{quiz.passingScore}%</strong>
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onExit}
              className="flex-1 px-6 py-3 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setQuizState("active")}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white hover:shadow-lg transition-all"
            >
              Start Quiz
              <ArrowRight className="w-5 h-5 inline ml-2" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Completed Screen
  if (quizState === "completed") {
    const correctCount = answers.filter(
      (a, i) => a === quiz.questions[i].correctAnswer
    ).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    let totalXPEarned = 0;
    answers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        const difficulty = quiz.questions[index].difficulty;
        totalXPEarned += quiz.questions[index].xpReward * difficultyConfig[difficulty].multiplier;
      }
    });

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-2xl mx-auto"
      >
        <div
          className={`p-8 text-white ${
            passed
              ? "bg-gradient-to-r from-emerald-500 to-teal-600"
              : "bg-gradient-to-r from-amber-500 to-orange-600"
          }`}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
            >
              {passed ? (
                <Trophy className="w-12 h-12" />
              ) : (
                <RotateCcw className="w-12 h-12" />
              )}
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">
              {passed ? "Congratulations!" : "Keep Learning!"}
            </h2>
            <p className="text-white/80">
              {passed
                ? "You passed the quiz and earned XP!"
                : "You didn't pass this time. Review and try again!"}
            </p>
          </div>
        </div>

        <div className="p-8">
          {/* Score Display */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <div className="text-4xl font-bold text-slate-800 mb-1">{score}%</div>
              <div className="text-sm text-slate-500">Your Score</div>
              <div className="text-xs text-slate-400 mt-1">
                {correctCount}/{quiz.questions.length} correct
              </div>
            </div>
            <div className="text-center p-6 bg-amber-50 rounded-xl">
              <div className="text-4xl font-bold text-amber-600 mb-1">
                +{Math.round(totalXPEarned)}
              </div>
              <div className="text-sm text-amber-700">XP Earned</div>
              {maxStreak >= 5 && (
                <div className="flex items-center justify-center gap-1 text-xs text-amber-600 mt-1">
                  <Zap className="w-3 h-3" />
                  Streak Bonus!
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Time Taken</span>
              <span className="font-semibold text-slate-800">
                {quiz.timeLimit
                  ? formatTime(quiz.timeLimit - timeRemaining)
                  : "Not timed"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Best Streak</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-500" />
                {maxStreak}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Passing Score</span>
              <span className="font-semibold text-slate-800">{quiz.passingScore}%</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onExit}
              className="flex-1 px-6 py-3 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Exit
            </button>
            {!passed && (
              <button
                onClick={() => {
                  setQuizState("active");
                  setCurrentQuestionIndex(0);
                  setSelectedAnswer(null);
                  setAnswers(new Array(quiz.questions.length).fill(null));
                  setShowExplanation(false);
                  setTimeRemaining(quiz.timeLimit || 0);
                  setStreak(0);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-semibold text-white hover:shadow-lg transition-all"
              >
                <RotateCcw className="w-5 h-5 inline mr-2" />
                Retry Quiz
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Active Quiz Screen
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium opacity-80">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            {streak > 2 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-amber-400/30 rounded-full text-xs">
                <Zap className="w-3 h-3" />
                {streak} Streak!
              </span>
            )}
          </div>
          {quiz.timeLimit && (
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                timeRemaining < 60 ? "bg-red-500/50" : "bg-white/20"
              }`}
            >
              <Timer className="w-4 h-4" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-8">
        {/* Difficulty Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              difficultyConfig[currentQuestion.difficulty].color
            }`}
          >
            {difficultyConfig[currentQuestion.difficulty].label}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            {currentQuestion.category}
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <Star className="w-3 h-3" />
            +{currentQuestion.xpReward} XP
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-xl font-bold text-slate-800 mb-6">{currentQuestion.question}</h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showResult = showExplanation;

            let buttonClass =
              "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ";

            if (showResult) {
              if (isCorrect) {
                buttonClass +=
                  "border-emerald-500 bg-emerald-50 text-emerald-800";
              } else if (isSelected && !isCorrect) {
                buttonClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                buttonClass += "border-slate-200 bg-slate-50 text-slate-500";
              }
            } else {
              buttonClass += isSelected
                ? "border-blue-500 bg-blue-50 text-blue-800"
                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={buttonClass}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      showResult
                        ? isCorrect
                          ? "bg-emerald-500 text-white"
                          : isSelected
                          ? "bg-red-500 text-white"
                          : "bg-slate-200 text-slate-500"
                        : isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div
                className={`p-4 rounded-xl ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? "bg-emerald-50 border border-emerald-200"
                    : "bg-amber-50 border border-amber-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4
                      className={`font-semibold mb-1 ${
                        selectedAnswer === currentQuestion.correctAnswer
                          ? "text-emerald-800"
                          : "text-amber-800"
                      }`}
                    >
                      {selectedAnswer === currentQuestion.correctAnswer
                        ? "Correct!"
                        : "Not quite right"}
                    </h4>
                    <p
                      className={`text-sm ${
                        selectedAnswer === currentQuestion.correctAnswer
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-4">
          {!showExplanation ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white hover:shadow-lg transition-all"
            >
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </>
              ) : (
                <>
                  Finish Quiz
                  <Sparkles className="w-5 h-5 inline ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
