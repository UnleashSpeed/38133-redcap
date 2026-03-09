'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMode, ContentMode, modeLabels, modeDescriptions } from '@/app/context/ModeContext';
import { Gamepad2, GraduationCap, FileSpreadsheet } from 'lucide-react';

// Nokia Blue color
const NOKIA_BLUE = '#005AFF';

interface ModeConfig {
  id: ContentMode;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const modes: ModeConfig[] = [
  {
    id: 'fun',
    icon: Gamepad2,
    color: '#10b981', // Emerald
    bgColor: '#d1fae5',
  },
  {
    id: 'researcher',
    icon: GraduationCap,
    color: NOKIA_BLUE,
    bgColor: '#dbeafe',
  },
  {
    id: 'spec',
    icon: FileSpreadsheet,
    color: '#7c3aed', // Violet
    bgColor: '#ede9fe',
  },
];

interface ThreeModeToggleProps {
  variant?: 'default' | 'compact' | 'pills';
  showDescription?: boolean;
  className?: string;
}

export function ThreeModeToggle({
  variant = 'default',
  showDescription = true,
  className = '',
}: ThreeModeToggleProps) {
  const { mode, setMode } = useMode();

  const currentMode = modes.find((m) => m.id === mode);
  const CurrentIcon = currentMode?.icon || GraduationCap;

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-slate-800 ${className}`}>
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode(m.id)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              style={{
                backgroundColor: isActive ? m.color : 'transparent',
              }}
              title={modeDescriptions[m.id]}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{modeLabels[m.id]}</span>
            </motion.button>
          );
        })}
      </div>
    );
  }

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                isActive
                  ? 'border-transparent text-white shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              style={{
                backgroundColor: isActive ? m.color : 'transparent',
              }}
            >
              <Icon className="w-4 h-4" />
              {modeLabels[m.id]}
            </motion.button>
          );
        })}
      </div>
    );
  }

  // Default variant - cards
  return (
    <div className={`space-y-4 ${className}`}>
      {showDescription && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border border-blue-100 dark:border-slate-700">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: currentMode?.bgColor }}
          >
            <CurrentIcon
              className="w-5 h-5"
              style={{ color: currentMode?.color }}
            />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {modeLabels[mode]} Mode
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {modeDescriptions[mode]}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode(m.id)}
              className={`relative p-4 rounded-xl text-left transition-all border-2 ${
                isActive
                  ? 'border-transparent shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              style={{
                backgroundColor: isActive ? m.bgColor : 'transparent',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    border: `2px solid ${m.color}`,
                  }}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <div className="relative z-10">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{
                    backgroundColor: isActive ? 'white' : m.bgColor,
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: m.color }}
                  />
                </div>
                <div
                  className={`font-semibold mb-1 ${
                    isActive ? 'text-gray-900 dark:text-gray-900' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {modeLabels[m.id]}
                </div>
                <div
                  className={`text-xs ${
                    isActive ? 'text-gray-600' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {modeDescriptions[m.id]}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Content wrapper that shows different content based on mode
interface ModeContentProps {
  fun?: React.ReactNode;
  researcher?: React.ReactNode;
  spec?: React.ReactNode;
  children?: React.ReactNode; // Default content (shown in all modes)
}

export function ModeContent({ fun, researcher, spec, children }: ModeContentProps) {
  const { mode, isFun, isResearcher, isSpec } = useMode();

  return (
    <div className="mode-content-wrapper">
      {isFun && fun}
      {isResearcher && researcher}
      {isSpec && spec}
      {children}
    </div>
  );
}

// Animated transition wrapper for mode changes
interface ModeTransitionProps {
  children: React.ReactNode;
}

export function ModeTransition({ children }: ModeTransitionProps) {
  const { mode } = useMode();

  return (
    <motion.div
      key={mode}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default ThreeModeToggle;
