'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/context/ThemeContext';
import { useScrollProgress } from '@/app/hooks/useScrollProgress';
import {
  Radio,
  Activity,
  Smartphone,
  Gauge,
  Wrench,
  Sparkles,
  ChevronRight,
  ChevronDown,
  BookOpen,
} from 'lucide-react';

// Nokia Blue color
const NOKIA_BLUE = '#005AFF';

interface SidebarSection {
  id: string;
  label: string;
  specRef: string;
  icon: React.ElementType;
  subsections: {
    id: string;
    label: string;
    specRef?: string;
  }[];
}

const sidebarSections: SidebarSection[] = [
  {
    id: 'rlm',
    label: 'RLM',
    specRef: '38.133 §8.1B',
    icon: Radio,
    subsections: [
      { id: 'rlm-overview', label: 'Overview', specRef: '§8.1B.1' },
      { id: 'rlm-ssb', label: 'SSB-Based RLM', specRef: '§8.1B.2' },
      { id: 'rlm-csi-rs', label: 'CSI-RS-Based RLM', specRef: '§8.1B.3' },
      { id: 'rlm-out-sync', label: 'Out-of-Sync Thresholds', specRef: '§8.1B.4' },
      { id: 'rlm-in-sync', label: 'In-Sync Thresholds', specRef: '§8.1B.5' },
    ],
  },
  {
    id: 'measurement',
    label: 'Measurement',
    specRef: '38.133 §9.1A',
    icon: Activity,
    subsections: [
      { id: 'meas-overview', label: 'Measurement Overview', specRef: '§9.1A.1' },
      { id: 'meas-ss-rsrp', label: 'SS-RSRP Measurement', specRef: '§9.1A.2' },
      { id: 'meas-ss-rsrq', label: 'SS-RSRQ Measurement', specRef: '§9.1A.3' },
      { id: 'meas-ss-sinr', label: 'SS-SINR Measurement', specRef: '§9.1A.4' },
      { id: 'meas-csi', label: 'CSI-RS Measurements', specRef: '§9.1A.5' },
    ],
  },
  {
    id: 'idle-mobility',
    label: 'Idle Mobility',
    specRef: '38.133 §4.2B',
    icon: Smartphone,
    subsections: [
      { id: 'idle-overview', label: 'Idle Mode Overview', specRef: '§4.2B.1' },
      { id: 'idle-cell-selection', label: 'Cell Selection', specRef: '§4.2B.2' },
      { id: 'idle-cell-reselection', label: 'Cell Reselection', specRef: '§4.2B.3' },
      { id: 'idle-meas-rules', label: 'Measurement Rules', specRef: '§4.2B.4' },
    ],
  },
  {
    id: 'performance',
    label: 'Performance',
    specRef: '38.133 §10.1A',
    icon: Gauge,
    subsections: [
      { id: 'perf-overview', label: 'Performance Overview', specRef: '§10.1A.1' },
      { id: 'perf-latency', label: 'Measurement Latency', specRef: '§10.1A.2' },
      { id: 'perf-accuracy', label: 'Measurement Accuracy', specRef: '§10.1A.3' },
      { id: 'perf-reporting', label: 'Reporting Delay', specRef: '§10.1A.4' },
    ],
  },
  {
    id: 'tools',
    label: 'Interactive Tools',
    specRef: '',
    icon: Wrench,
    subsections: [
      { id: 'tool-calculator', label: 'Power Calculator' },
      { id: 'tool-visualizer', label: 'Signal Visualizer' },
      { id: 'tool-comparison', label: '1Rx vs 2Rx Compare' },
      { id: 'tool-simulator', label: 'Mobility Simulator' },
    ],
  },
  {
    id: 'beauty',
    label: 'Beauty of RedCap',
    specRef: '',
    icon: Sparkles,
    subsections: [
      { id: 'beauty-design', label: 'Design Philosophy' },
      { id: 'beauty-tradeoffs', label: 'Smart Trade-offs' },
      { id: 'beauty-applications', label: 'IoT Applications' },
      { id: 'beauty-future', label: 'Future of RedCap' },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { theme } = useTheme();
  const { isScrolled } = useScrollProgress();
  const [expandedSections, setExpandedSections] = useState<string[]>(['rlm']);
  const [activeSection, setActiveSection] = useState<string>('rlm-overview');

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
      onClose?.();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`fixed left-0 top-16 bottom-0 w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto z-40 hidden lg:block ${
          isScrolled ? 'pt-2' : 'pt-4'
        }`}
      >
        <div className="px-4 pb-4">
          {/* Spec Reference Header */}
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border border-blue-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4" style={{ color: NOKIA_BLUE }} />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Based on
              </span>
            </div>
            <div className="text-sm font-bold" style={{ color: NOKIA_BLUE }}>
              3GPP TS 38.133
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              NR RedCap Requirements
            </div>
          </div>

          {/* Navigation Tree */}
          <nav className="space-y-1">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.includes(section.id);
              const isActive = activeSection.startsWith(section.id);

              return (
                <div key={section.id} className="mb-1">
                  {/* Section Header */}
                  <motion.button
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      toggleSection(section.id);
                      if (section.subsections.length > 0) {
                        scrollToSection(section.subsections[0].id);
                      }
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: isActive ? NOKIA_BLUE : '#6b7280' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-medium truncate ${
                          isActive
                            ? 'text-blue-700 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {section.label}
                      </div>
                      {section.specRef && (
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {section.specRef}
                        </div>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  </motion.button>

                  {/* Subsections */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 mt-1 space-y-0.5">
                          {section.subsections.map((sub) => {
                            const isSubActive = activeSection === sub.id;
                            return (
                              <motion.button
                                key={sub.id}
                                whileHover={{ x: 2 }}
                                onClick={() => scrollToSection(sub.id)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                                  isSubActive
                                    ? 'bg-blue-100 dark:bg-blue-900/30'
                                    : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                                }`}
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                    isSubActive
                                      ? 'bg-blue-600 dark:bg-blue-400'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <div
                                    className={`text-sm truncate ${
                                      isSubActive
                                        ? 'text-blue-700 dark:text-blue-400 font-medium'
                                        : 'text-gray-600 dark:text-gray-400'
                                    }`}
                                  >
                                    {sub.label}
                                  </div>
                                  {sub.specRef && (
                                    <div className="text-xs text-gray-400 dark:text-gray-500">
                                      {sub.specRef}
                                    </div>
                                  )}
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
              <p>RedCap RRM Educational</p>
              <p className="mt-1">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed left-0 top-16 bottom-0 w-80 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto z-40 lg:hidden"
      >
        <div className="px-4 py-4">
          {/* Spec Reference Header */}
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border border-blue-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4" style={{ color: NOKIA_BLUE }} />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Based on
              </span>
            </div>
            <div className="text-sm font-bold" style={{ color: NOKIA_BLUE }}>
              3GPP TS 38.133
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              NR RedCap Requirements
            </div>
          </div>

          {/* Navigation Tree */}
          <nav className="space-y-1">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.includes(section.id);
              const isActive = activeSection.startsWith(section.id);

              return (
                <div key={section.id} className="mb-1">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: isActive ? NOKIA_BLUE : '#6b7280' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-medium ${
                          isActive
                            ? 'text-blue-700 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {section.label}
                      </div>
                      {section.specRef && (
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {section.specRef}
                        </div>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 mt-1 space-y-0.5">
                          {section.subsections.map((sub) => {
                            const isSubActive = activeSection === sub.id;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => scrollToSection(sub.id)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                                  isSubActive
                                    ? 'bg-blue-100 dark:bg-blue-900/30'
                                    : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                                }`}
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                    isSubActive
                                      ? 'bg-blue-600 dark:bg-blue-400'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <div
                                    className={`text-sm ${
                                      isSubActive
                                        ? 'text-blue-700 dark:text-blue-400 font-medium'
                                        : 'text-gray-600 dark:text-gray-400'
                                    }`}
                                  >
                                    {sub.label}
                                  </div>
                                  {sub.specRef && (
                                    <div className="text-xs text-gray-400 dark:text-gray-500">
                                      {sub.specRef}
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;
