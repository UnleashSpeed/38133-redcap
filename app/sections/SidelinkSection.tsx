/**
 * Sidelink Section
 * Main section component for 3GPP TS 38.133 clause 10.1A - Sidelink measurements
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Share2,
  Radio,
  Search,
  Grid3X3,
  BookOpen,
  ChevronDown,
  Sparkles,
  Microscope,
  FileText,
} from 'lucide-react';
import { ContentMode } from '../types/rlm';
import {
  SidelinkTopologyVisualizer,
  SidelinkResourcePool,
  SidelinkDiscoveryVisualizer,
} from '../components/sidelink';

interface SidelinkSectionProps {
  defaultMode?: ContentMode;
}

const sectionContent = {
  fun: {
    title: 'Direct Device Communication',
    subtitle: 'When Devices Talk Directly! 🚗📱',
    description: 'Discover how devices communicate directly with each other without needing a cell tower!',
    intro: 'Imagine you\'re at a concert and want to share a photo with a friend nearby. Instead of sending it through the internet, your phones can talk directly to each other! That\'s what sidelink does.',
  },
  researcher: {
    title: 'Sidelink Communication',
    subtitle: '3GPP TS 38.133 clause 10.1A - Sidelink Measurements',
    description: 'Comprehensive analysis of PC5 interface and sidelink procedures for direct UE-to-UE communication.',
    intro: 'Sidelink enables direct device-to-device (D2D) communication over the PC5 interface, bypassing the cellular infrastructure. Critical for V2X (Vehicle-to-Everything), public safety, and IoT applications.',
  },
  spec: {
    title: 'clause 10.1A: Sidelink Measurements for RedCap',
    subtitle: '3GPP TS 38.133',
    description: 'Technical specification for sidelink measurements and procedures applicable to RedCap UEs.',
    intro: 'This clause specifies requirements for sidelink measurements for RedCap UEs, including PSSCH-RSRP, PSSCH-RSRQ, and PSCCH measurements for resource selection and link maintenance.',
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
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
};

export const SidelinkSection: React.FC<SidelinkSectionProps> = ({ defaultMode = 'researcher' }) => {
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
          className="mb-8 p-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white"
        >
          <p className="text-lg">{content.description}</p>
          <p className="mt-2 text-purple-100">{content.intro}</p>
        </motion.div>

        {/* Content Grid */}
        <div className="space-y-6">
          {/* Topology Visualizer */}
          <SectionCard
            title={mode === 'fun' ? 'Device Network Map' : mode === 'researcher' ? 'Sidelink Topology' : 'PC5 Interface Topology'}
            icon={<Share2 className="w-5 h-5 text-blue-600" />}
          >
            <SidelinkTopologyVisualizer mode={mode} />
          </SectionCard>

          {/* Resource Pool Visualizer */}
          <SectionCard
            title={mode === 'fun' ? 'Communication Channels' : mode === 'researcher' ? 'Resource Pool Allocation' : 'SL Resource Pool (38.214)'}
            icon={<Grid3X3 className="w-5 h-5 text-green-600" />}
          >
            <SidelinkResourcePool mode={mode} />
          </SectionCard>

          {/* Discovery Visualizer */}
          <SectionCard
            title={mode === 'fun' ? 'Find Friends Nearby' : mode === 'researcher' ? 'Sidelink Discovery' : 'Discovery Procedure (38.331)'}
            icon={<Search className="w-5 h-5 text-purple-600" />}
          >
            <SidelinkDiscoveryVisualizer mode={mode} />
          </SectionCard>

          {/* Key Concepts */}
          <SectionCard
            title={mode === 'fun' ? 'How It All Works' : mode === 'researcher' ? 'Key Concepts' : '3GPP Specifications'}
            icon={<BookOpen className="w-5 h-5 text-amber-600" />}
            defaultExpanded={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Radio className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {mode === 'fun' ? 'Direct Talking' : mode === 'researcher' ? 'PC5 Interface' : 'NR Sidelink'}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mode === 'fun'
                    ? 'Devices can send messages directly to each other without going through a cell tower, perfect for when towers are far away!'
                    : mode === 'researcher'
                    ? 'The PC5 interface enables direct communication between UEs using sidelink channels PSCCH (control) and PSSCH (data).'
                    : '3GPP Release 16+ defines NR Sidelink with PSCCH, PSSCH, PSBCH, and PSDCH channels operating on the PC5 interface.'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Grid3X3 className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {mode === 'fun' ? 'Shared Airwaves' : mode === 'researcher' ? 'Resource Pools' : 'Resource Allocation'}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mode === 'fun'
                    ? 'Devices share radio channels using a clever scheduling system so everyone gets a turn to talk!'
                    : mode === 'researcher'
                    ? 'Resource pools define sets of PRBs and subframes available for sidelink transmission. Mode 1 uses gNB scheduling; Mode 2 uses autonomous selection.'
                    : 'TS 38.214 defines two resource allocation modes: Mode 1 (scheduled by gNB) and Mode 2 (autonomous UE selection from configured pools).'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {mode === 'fun' ? 'Finding Friends' : mode === 'researcher' ? 'Discovery' : 'SL Discovery'}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mode === 'fun'
                    ? 'Devices can find nearby friends automatically, either broadcasting "I\'m here!" or quietly listening for friends.'
                    : mode === 'researcher'
                    ? 'Sidelink discovery uses Model A (open) for announcing presence and Model B (restricted) for targeted discovery of authorized UEs.'
                    : 'TS 38.331 defines sidelink discovery procedures with open discovery (announcement) and restricted discovery (monitoring for specific ProSe Application Codes).'}
                </p>
              </div>
            </div>
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
              ? '🎉 You\'ve learned how devices talk directly to each other!'
              : mode === 'researcher'
              ? 'Based on 3GPP TS 38.133 clause 10.1A, TS 38.214, and TS 38.331. For the latest specification, visit www.3gpp.org.'
              : '3GPP TS 38.133 V17.x.x clause 10.1A: Sidelink Measurements for RedCap.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SidelinkSection;
