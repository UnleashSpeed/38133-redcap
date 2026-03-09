/**
 * RLM (Radio Link Monitoring) Section
 * Main section component for 3GPP TS 38.133 clause 8.1B - RedCap RLM
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Calculator,
  Clock,
  Radio,
  BookOpen,
  Antenna,
  Percent,
  ChevronDown,
  Sparkles,
  Microscope,
  FileText,
} from 'lucide-react';
import { ContentMode } from '../types/rlm';
import {
  RLMSignalSimulator,
  PFactorCalculator,
  TEvaluateCalculator,
  RLMMethodComparison,
  RLMSpecTables,
  RxComparison,
  BLERConfiguration,
} from '../components/rlm';

interface RLMSectionProps {
  defaultMode?: ContentMode;
}

const sectionContent = {
  fun: {
    title: 'Radio Link Monitoring Adventure',
    subtitle: 'How Your Device Knows If the Signal Is Still Good!',
    description: 'Join us on a journey to discover how RedCap devices keep an eye on their connection to the network!',
    intro: 'Imagine your device is like a person trying to hear their friend in a noisy room. Radio Link Monitoring is how your device "listens" to check if it can still hear the network clearly!',
  },
  researcher: {
    title: 'Radio Link Monitoring (RLM)',
    subtitle: '3GPP TS 38.133 clause 8.1B - RedCap RLM',
    description: 'Comprehensive analysis of Radio Link Monitoring procedures for Reduced Capability (RedCap) devices.',
    intro: 'Radio Link Monitoring enables UE to assess downlink radio link quality and detect out-of-sync and in-sync conditions. For RedCap devices, specific requirements apply per clause 8.1B.',
  },
  spec: {
    title: 'clause 8.1B: Radio Link Monitoring for RedCap',
    subtitle: '3GPP TS 38.133',
    description: 'Technical specification for RLM procedures applicable to RedCap UEs.',
    intro: 'This clause specifies requirements for radio link monitoring for RedCap UEs, including SSB-based and CSI-RS-based RLM, TEvaluate periods, and P-factor calculations.',
  },
};

interface ModeSelectorProps {
  currentMode: ContentMode;
  onModeChange: (mode: ContentMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const modes: { id: ContentMode; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'fun', label: 'Fun', icon: <Sparkles className="w-4 h-4" />, color: 'bg-pink-500' },
    { id: 'researcher', label: 'Researcher', icon: <Microscope className="w-4 h-4" />, color: 'bg-blue-500' },
    { id: 'spec', label: 'Spec', icon: <FileText className="w-4 h-4" />, color: 'bg-gray-700' },
  ];

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            currentMode === mode.id
              ? `${mode.color} text-white shadow-sm`
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {mode.icon}
          {mode.label}
        </button>
      ))}
    </div>
  );
};

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 hover:from-gray-100 dark:hover:from-gray-750 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            {icon}
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const RLMSection: React.FC<RLMSectionProps> = ({ defaultMode = 'researcher' }) => {
  const [mode, setMode] = useState<ContentMode>(defaultMode);
  const content = sectionContent[mode];

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                {content.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-blue-600 dark:text-blue-400 font-medium"
              >
                {content.subtitle}
              </motion.p>
            </div>
            <ModeSelector currentMode={mode} onModeChange={setMode} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white"
        >
          <p className="text-lg">{content.description}</p>
          <p className="mt-2 text-blue-100">{content.intro}</p>
        </motion.div>

        {/* Content Grid */}
        <div className="space-y-6">
          {/* Signal Simulator */}
          <SectionCard
            title={mode === 'fun' ? 'Signal Strength Adventure' : mode === 'researcher' ? 'RLM Signal Simulator' : 'Signal Quality Simulation'}
            icon={<Activity className="w-5 h-5 text-blue-600" />}
          >
            <RLMSignalSimulator mode={mode} />
          </SectionCard>

          {/* BLER Configuration */}
          <SectionCard
            title={mode === 'fun' ? 'Error Rate Limits' : mode === 'researcher' ? 'BLER Thresholds' : 'BLER Configuration (8.1B.1)'}
            icon={<Percent className="w-5 h-5 text-rose-600" />}
          >
            <BLERConfiguration mode={mode} />
          </SectionCard>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* P-Factor Calculator */}
            <SectionCard
              title={mode === 'fun' ? 'Gap Multiplier Magic' : mode === 'researcher' ? 'P-Factor Calculator' : 'P-Factor (8.1B.2.2)'}
              icon={<Calculator className="w-5 h-5 text-purple-600" />}
            >
              <PFactorCalculator mode={mode} />
            </SectionCard>

            {/* TEvaluate Calculator */}
            <SectionCard
              title={mode === 'fun' ? 'How Long to Wait?' : mode === 'researcher' ? 'TEvaluate Calculator' : 'TEvaluate (8.1B.2.2)'}
              icon={<Clock className="w-5 h-5 text-amber-600" />}
            >
              <TEvaluateCalculator mode={mode} />
            </SectionCard>
          </div>

          {/* RLM Method Comparison */}
          <SectionCard
            title={mode === 'fun' ? 'Two Ways to Watch Your Signal' : mode === 'researcher' ? 'SSB vs CSI-RS RLM' : 'RLM Methods (8.1B.2, 8.1B.3)'}
            icon={<Radio className="w-5 h-5 text-indigo-600" />}
          >
            <RLMMethodComparison mode={mode} />
          </SectionCard>

          {/* 1Rx vs 2Rx Comparison */}
          <SectionCard
            title={mode === 'fun' ? 'One Antenna vs Two Antennas' : mode === 'researcher' ? '1Rx vs 2Rx Comparison' : 'Receiver Configurations'}
            icon={<Antenna className="w-5 h-5 text-cyan-600" />}
          >
            <RxComparison mode={mode} />
          </SectionCard>

          {/* Specification Tables */}
          <SectionCard
            title={mode === 'fun' ? 'The Rule Book' : mode === 'researcher' ? '3GPP Specification Tables' : 'TS 38.133 Tables'}
            icon={<BookOpen className="w-5 h-5 text-emerald-600" />}
            defaultExpanded={false}
          >
            <RLMSpecTables mode={mode} />
          </SectionCard>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl text-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mode === 'fun'
              ? '🎉 You\'ve learned how RedCap devices keep their connection healthy!'
              : mode === 'researcher'
              ? 'Based on 3GPP TS 38.133 clause 8.1B. For the latest specification, visit www.3gpp.org.'
              : '3GPP TS 38.133 V17.x.x clause 8.1B: Radio Link Monitoring for RedCap.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default RLMSection;
