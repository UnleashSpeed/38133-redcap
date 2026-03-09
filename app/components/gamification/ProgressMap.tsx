"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  CheckCircle2,
  Lock,
  Star,
  ChevronRight,
  BookOpen,
  Target,
  Zap,
  Award,
  Flag,
  Play,
} from "lucide-react";

export interface TopicNode {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  position: { x: number; y: number };
  status: "locked" | "available" | "in-progress" | "completed";
  xpReward: number;
  dependencies: string[];
  estimatedTime: string;
  content: {
    type: "lesson" | "quiz" | "simulation";
    completed: boolean;
  }[];
}

interface ProgressMapProps {
  nodes: TopicNode[];
  onNodeClick?: (node: TopicNode) => void;
  userXP: number;
  userLevel: number;
}

export const defaultTopicNodes: TopicNode[] = [
  {
    id: "intro",
    name: "Introduction to RedCap",
    description: "Learn the basics of RedCap and its use cases",
    icon: BookOpen,
    position: { x: 50, y: 10 },
    status: "completed",
    xpReward: 50,
    dependencies: [],
    estimatedTime: "10 min",
    content: [
      { type: "lesson", completed: true },
      { type: "quiz", completed: true },
    ],
  },
  {
    id: "1rx-basics",
    name: "1Rx Fundamentals",
    description: "Understanding single receive antenna configuration",
    icon: Target,
    position: { x: 25, y: 30 },
    status: "completed",
    xpReward: 100,
    dependencies: ["intro"],
    estimatedTime: "15 min",
    content: [
      { type: "lesson", completed: true },
      { type: "simulation", completed: true },
      { type: "quiz", completed: true },
    ],
  },
  {
    id: "2rx-basics",
    name: "2Rx Fundamentals",
    description: "Understanding dual receive antenna configuration",
    icon: Zap,
    position: { x: 75, y: 30 },
    status: "in-progress",
    xpReward: 100,
    dependencies: ["intro"],
    estimatedTime: "15 min",
    content: [
      { type: "lesson", completed: true },
      { type: "simulation", completed: false },
      { type: "quiz", completed: false },
    ],
  },
  {
    id: "rlm-basics",
    name: "Radio Link Monitoring",
    description: "Learn how RLM works in RedCap devices",
    icon: Play,
    position: { x: 50, y: 45 },
    status: "available",
    xpReward: 150,
    dependencies: ["1rx-basics", "2rx-basics"],
    estimatedTime: "20 min",
    content: [
      { type: "lesson", completed: false },
      { type: "simulation", completed: false },
      { type: "quiz", completed: false },
    ],
  },
  {
    id: "gap-analysis",
    name: "Measurement Gaps",
    description: "Understanding measurement gaps and their impact",
    icon: Target,
    position: { x: 20, y: 60 },
    status: "locked",
    xpReward: 200,
    dependencies: ["rlm-basics"],
    estimatedTime: "25 min",
    content: [
      { type: "lesson", completed: false },
      { type: "simulation", completed: false },
      { type: "quiz", completed: false },
    ],
  },
  {
    id: "p-factor",
    name: "P-Factor Deep Dive",
    description: "Master the P-Factor calculation and its applications",
    icon: Zap,
    position: { x: 50, y: 65 },
    status: "locked",
    xpReward: 200,
    dependencies: ["rlm-basics"],
    estimatedTime: "25 min",
    content: [
      { type: "lesson", completed: false },
      { type: "simulation", completed: false },
      { type: "quiz", completed: false },
    ],
  },
  {
    id: "tevaluate",
    name: "TEvaluate Mastery",
    description: "Understanding evaluation period calculations",
    icon: Play,
    position: { x: 80, y: 60 },
    status: "locked",
    xpReward: 200,
    dependencies: ["rlm-basics"],
    estimatedTime: "25 min",
    content: [
      { type: "lesson", completed: false },
      { type: "simulation", completed: false },
      { type: "quiz", completed: false },
    ],
  },
  {
    id: "nserv",
    name: "Nserv_RedCap",
    description: "Serving cell evaluation for RedCap devices",
    icon: Target,
    position: { x: 35, y: 80 },
    status: "locked",
    xpReward: 250,
    dependencies: ["gap-analysis", "p-factor"],
    estimatedTime: "30 min",
    content: [
      { type: "lesson", completed: false },
      { type: "simulation", completed: false },
      { type: "quiz", completed: false },
    ],
  },
  {
    id: "cssf",
    name: "CSSF Calculations",
    description: "Channel State Information Scaling Factor",
    icon: Zap,
    position: { x: 65, y: 80 },
    status: "locked",
    xpReward: 250,
    dependencies: ["p-factor", "tevaluate"],
    estimatedTime: "30 min",
    content: [
      { type: "lesson", completed: false },
      { type: "simulation", completed: false },
      { type: "quiz", completed: false },
    ],
  },
  {
    id: "final-challenge",
    name: "RedCap Master Challenge",
    description: "Complete the final assessment to become a RedCap expert",
    icon: Award,
    position: { x: 50, y: 95 },
    status: "locked",
    xpReward: 500,
    dependencies: ["nserv", "cssf"],
    estimatedTime: "45 min",
    content: [
      { type: "quiz", completed: false },
      { type: "simulation", completed: false },
      { type: "quiz", completed: false },
    ],
  },
];

const statusConfig = {
  locked: {
    color: "bg-slate-200",
    borderColor: "border-slate-300",
    iconColor: "text-slate-400",
    label: "Locked",
  },
  available: {
    color: "bg-blue-100",
    borderColor: "border-blue-300",
    iconColor: "text-blue-500",
    label: "Start",
  },
  "in-progress": {
    color: "bg-amber-100",
    borderColor: "border-amber-300",
    iconColor: "text-amber-500",
    label: "Continue",
  },
  completed: {
    color: "bg-emerald-100",
    borderColor: "border-emerald-300",
    iconColor: "text-emerald-500",
    label: "Review",
  },
};

export default function ProgressMap({
  nodes,
  onNodeClick,
  userXP,
  userLevel,
}: ProgressMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const completedCount = nodes.filter((n) => n.status === "completed").length;
  const progressPercentage = (completedCount / nodes.length) * 100;

  // Generate SVG paths between connected nodes
  const generatePaths = () => {
    const paths: JSX.Element[] = [];
    nodes.forEach((node) => {
      node.dependencies.forEach((depId) => {
        const depNode = nodes.find((n) => n.id === depId);
        if (depNode) {
          const isActive =
            depNode.status === "completed" ||
            (depNode.status === "in-progress" && node.status !== "locked");
          paths.push(
            <line
              key={`${depId}-${node.id}`}
              x1={`${depNode.position.x}%`}
              y1={`${depNode.position.y}%`}
              x2={`${node.position.x}%`}
              y2={`${node.position.y}%`}
              stroke={isActive ? "#3b82f6" : "#cbd5e1"}
              strokeWidth="2"
              strokeDasharray={isActive ? "0" : "5,5"}
              className="transition-all duration-500"
            />
          );
        }
      });
    });
    return paths;
  };

  return (
    <div className="w-full">
      {/* Progress Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full">
            <Flag className="w-5 h-5" />
            <span className="font-semibold">
              {completedCount} / {nodes.length} Topics
            </span>
          </div>
          <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full">
            <Star className="w-5 h-5" />
            <span className="font-semibold">Level {userLevel}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md">
          <div className="flex justify-between text-sm text-slate-600 mb-1">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }
              }
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gradient-to-b from-slate-50 to-slate-100 rounded-3xl p-8 min-h-[600px] overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {generatePaths()}
        </svg>

        {/* Topic Nodes */}
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const status = statusConfig[node.status];
          const isHovered = hoveredNode === node.id;

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{
                position: "absolute",
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => onNodeClick?.(node)}
              className={`cursor-pointer z-10 ${
                node.status === "locked" ? "pointer-events-none" : ""
              }`}
            >
              {/* Node Circle */}
              <div
                className={`relative w-16 h-16 rounded-full ${status.color} ${status.borderColor} border-2 flex items-center justify-center transition-all duration-300 ${
                  isHovered ? "scale-110 shadow-lg" : ""
                } ${node.status === "in-progress" ? "ring-4 ring-amber-200 animate-pulse" : ""}`}
              >
                <Icon className={`w-7 h-7 ${status.iconColor}`} />

                {/* Status Indicator */}
                {node.status === "completed" && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
                {node.status === "locked" && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Node Label */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
                <span className="text-xs font-semibold text-slate-700 bg-white/80 px-2 py-1 rounded">
                  {node.name}
                </span>
              </div>

              {/* Hover Tooltip */}
              {isHovered && node.status !== "locked" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-20"
                >
                  <h4 className="font-bold text-slate-800 mb-1">{node.name}</h4>
                  <p className="text-sm text-slate-600 mb-3">{node.description}</p>

                  {/* Progress Indicators */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-medium">
                        {node.content.filter((c) => c.completed).length} / {node.content.length}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${
                            (node.content.filter((c) => c.completed).length /
                              node.content.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-amber-600">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">+{node.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="text-sm">{node.estimatedTime}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className={`w-full mt-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      node.status === "completed"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : node.status === "in-progress"
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    {status.label}
                    <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Start and End Labels */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold">
            Start Here
          </span>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-semibold">
            Final Challenge
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {Object.entries(statusConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${config.color} ${config.borderColor} border`} />
            <span className="text-sm text-slate-600 capitalize">{key.replace("-", " ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
