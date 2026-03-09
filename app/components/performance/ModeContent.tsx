/**
 * ModeContent.tsx
 * 
 * Content display component for different display modes (Fun/Researcher/Spec)
 * Provides mode-appropriate explanations and context
 */

import React from 'react';
import { BookOpen, Microscope, Gamepad2, FileText } from 'lucide-react';

export type DisplayMode = 'fun' | 'researcher' | 'spec';
export type MetricType = 'RSRP' | 'RSRQ' | 'SINR' | 'L1-RSRP';

interface ModeContentProps {
  mode: DisplayMode;
  metric: MetricType;
  showIcon?: boolean;
  className?: string;
}

interface ContentData {
  title: string;
  description: string;
  points: string[];
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const CONTENT: Record<DisplayMode, Record<MetricType, ContentData>> = {
  fun: {
    RSRP: {
      title: '📡 Signal Strength Detective',
      description: 'RSRP is like measuring how loud your friend is shouting across a playground! The stronger the signal, the easier it is to measure accurately.',
      points: [
        '🎯 Better accuracy means your phone knows EXACTLY which tower is closest',
        '📶 2Rx is like having two ears - you hear the signal twice as clearly!',
        '🌟 When signals are strong (Io > -80dBm), measurements are super precise',
        '🌙 Weak signals are harder to measure accurately (like whispering from far away)',
        '🎮 RedCap devices use this to pick the best cell tower to connect to!'
      ],
      icon: <Gamepad2 className="w-6 h-6" />,
      color: 'text-pink-600',
      bgColor: 'bg-gradient-to-r from-pink-50 to-purple-50'
    },
    RSRQ: {
      title: '✨ Signal Quality Checker',
      description: 'RSRQ tells us not just how LOUD the signal is, but how CLEAR it is! Like checking if music is crisp or full of static.',
      points: [
        '🎵 Quality matters more than just strength for fast internet!',
        '📊 RSRQ = Signal Power ÷ Total Power (including noise)',
        '🔄 2Rx helps filter out noise for crystal-clear measurements',
        '🏆 Good RSRQ = smooth video calls and fast downloads!',
        '📱 Your phone uses RSRQ to decide when to switch towers'
      ],
      icon: <Gamepad2 className="w-6 h-6" />,
      color: 'text-pink-600',
      bgColor: 'bg-gradient-to-r from-pink-50 to-purple-50'
    },
    SINR: {
      title: '🔊 Signal vs Noise Battle',
      description: 'SINR shows how much the signal "stands out" from background noise. It\'s like spotting your friend in a crowded room!',
      points: [
        '⚔️ It\'s a battle between your signal and interfering signals',
        '🏔️ Higher SINR = the signal "mountain" rises above the noise "valley"',
        '🚀 Great SINR means super-fast data speeds!',
        '📡 RedCap needs accurate SINR to pick the best frequencies',
        '🎯 SINR helps your phone choose the best time to transmit data'
      ],
      icon: <Gamepad2 className="w-6 h-6" />,
      color: 'text-pink-600',
      bgColor: 'bg-gradient-to-r from-pink-50 to-purple-50'
    },
    'L1-RSRP': {
      title: '⚡ Super-Fast Beam Finder',
      description: 'L1-RSRP works at lightning speed to find the best signal beam! Perfect for quickly switching between different directions.',
      points: [
        '💨 Layer 1 measurements are INSTANT - no waiting around!',
        '🎯 Perfect for quickly switching between different beams',
        '📱 Helps your phone stay connected while moving around',
        '🌟 Both SSB and CSI-RS beams can be measured accurately!',
        '🚀 Beam management keeps your signal strong as you move!'
      ],
      icon: <Gamepad2 className="w-6 h-6" />,
      color: 'text-pink-600',
      bgColor: 'bg-gradient-to-r from-pink-50 to-purple-50'
    }
  },
  researcher: {
    RSRP: {
      title: 'RSRP Measurement Accuracy Analysis',
      description: 'Reference Signal Received Power (RSRP) measures the linear average of reference signal power across resource elements. Critical for cell selection and handover decisions.',
      points: [
        'FR1 accuracy varies with Io: ±7 to ±11 dB (1Rx normal), ±5.5 to ±11 dB (2Rx normal)',
        'FR2 maintains consistent accuracy: ±8 dB (1Rx), ±6 dB (2Rx) across all Io ranges',
        '2Rx configuration provides 1.5-2 dB improvement in measurement accuracy through diversity gain',
        'Extreme conditions add 3 dB tolerance to all measurements due to environmental stressors',
        'RSRP is the primary metric for cell selection, reselection, and handover procedures'
      ],
      icon: <Microscope className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50'
    },
    RSRQ: {
      title: 'RSRQ Measurement Accuracy Analysis',
      description: 'Reference Signal Received Quality (RSRQ) combines RSRP with RSSI to provide a quality metric that accounts for interference and load conditions.',
      points: [
        'FR1: ±3.5 dB (1Rx normal), ±3 dB (2Rx normal) - 0.5 dB improvement with 2Rx',
        'FR2: ±4.5 dB (1Rx normal), ±3.5 dB (2Rx normal) - 1 dB improvement with 2Rx',
        'RSRQ = N × RSRP / RSSI, where N is the number of resource blocks',
        'Critical for cell selection, reselection, and handover decisions under load',
        'RSRQ is independent of Io range, providing consistent quality assessment'
      ],
      icon: <Microscope className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50'
    },
    SINR: {
      title: 'SINR Measurement Accuracy Analysis',
      description: 'Signal-to-Interference-plus-Noise Ratio (SINR) determines the achievable throughput and link adaptation decisions in the physical layer.',
      points: [
        'Identical accuracy requirements to RSRQ: ±3.5/±3 dB (FR1), ±4.5/±3.5 dB (FR2)',
        'Applies to both CSI-SINR and PDSCH SINR measurements for link adaptation',
        'SINR directly impacts link adaptation and scheduling decisions',
        'Accurate SINR measurement enables optimal MCS selection and throughput',
        'Critical for CSI reporting and downlink performance optimization'
      ],
      icon: <Microscope className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50'
    },
    'L1-RSRP': {
      title: 'L1-RSRP Measurement Accuracy Analysis',
      description: 'Layer 1 RSRP provides rapid measurements for beam management and mobility procedures with reduced reporting latency compared to RRC-layer measurements.',
      points: [
        'Absolute accuracy: ±7/±5.5 dB (FR1), ±8/±6 dB (FR2) for normal conditions',
        'Relative accuracy (FR1 only): ±6/±5 dB for comparing beam measurements',
        'Applicable to both SSB-based and CSI-RS based L1-RSRP measurements',
        'Reduced reporting latency compared to RRC-layer measurements',
        'Critical for beam selection in FR2 and mobility procedures'
      ],
      icon: <Microscope className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50'
    }
  },
  spec: {
    RSRP: {
      title: 'TS 38.133 clause 10.1A.1.1 - RSRP Measurement Accuracy',
      description: 'Reference Signal Received Power measurement accuracy requirements for RedCap UE with 1Rx and 2Rx configurations under normal and extreme conditions.',
      points: [
        'Table 10.1A.1.1-1 (FR1): Io-dependent accuracy with 3 ranges: >-80, -80 to -90, -90 to -100 dBm',
        'Table 10.1A.1.1-2 (FR2): Single accuracy value across all Io ranges',
        'Normal conditions: 3GPP TS 38.133 Annex C (15°C to 35°C, nominal voltage)',
        'Extreme conditions: 3GPP TS 38.133 Annex D (temperature/voltage extremes)',
        'Measurement period: 200ms (FR1), 400ms (FR2) per TS 38.133 Table 10.1A.1.1-3'
      ],
      icon: <FileText className="w-6 h-6" />,
      color: 'text-slate-700',
      bgColor: 'bg-gradient-to-r from-slate-100 to-slate-200'
    },
    RSRQ: {
      title: 'TS 38.133 clause 10.1A.1.2 - RSRQ Measurement Accuracy',
      description: 'Reference Signal Received Quality measurement accuracy requirements for RedCap UE.',
      points: [
        'Table 10.1A.1.2-1 (FR1): ±3.5 dB (1Rx normal), ±3 dB (2Rx normal)',
        'Table 10.1A.1.2-2 (FR2): ±4.5 dB (1Rx normal), ±3.5 dB (2Rx normal)',
        'RSRQ = N × RSRP / RSSI, where N is number of resource blocks',
        'Measurement period: 200ms for FR1, 400ms for FR2',
        'Reporting range: -30 dB to -3 dB with 0.5 dB resolution'
      ],
      icon: <FileText className="w-6 h-6" />,
      color: 'text-slate-700',
      bgColor: 'bg-gradient-to-r from-slate-100 to-slate-200'
    },
    SINR: {
      title: 'TS 38.133 clause 10.1A.1.3 - SINR Measurement Accuracy',
      description: 'Signal-to-Interference-plus-Noise Ratio measurement accuracy requirements for RedCap UE.',
      points: [
        'Table 10.1A.1.3-1 (FR1): Same values as RSRQ accuracy',
        'Table 10.1A.1.3-2 (FR2): Same values as RSRQ accuracy',
        'Applies to CSI-SINR and PDSCH SINR measurements',
        'SINR accuracy affects CSI reporting and link adaptation',
        'Measurement period: 200ms (FR1), 400ms (FR2)'
      ],
      icon: <FileText className="w-6 h-6" />,
      color: 'text-slate-700',
      bgColor: 'bg-gradient-to-r from-slate-100 to-slate-200'
    },
    'L1-RSRP': {
      title: 'TS 38.133 clause 10.1A.2 - L1-RSRP Measurement Accuracy',
      description: 'Layer 1 RSRP measurement accuracy for beam reporting in RedCap UE.',
      points: [
        'clause 10.1A.2.1: Absolute accuracy for SSB and CSI-RS based measurements',
        'clause 10.1A.2.2: Relative accuracy for FR1 (inter-beam comparison)',
        'Measurement period: 40ms (FR1), 80ms (FR2) for SSB',
        'Reporting range: -140 dBm to -44 dBm with 1 dB resolution',
        'Filter coefficient: K=1 for L1 measurements'
      ],
      icon: <FileText className="w-6 h-6" />,
      color: 'text-slate-700',
      bgColor: 'bg-gradient-to-r from-slate-100 to-slate-200'
    }
  }
};

export const ModeContent: React.FC<ModeContentProps> = ({
  mode,
  metric,
  showIcon = true,
  className = ''
}) => {
  const content = CONTENT[mode][metric];

  return (
    <div className={`${content.bgColor} rounded-xl p-6 border border-slate-200 ${className}`}>
      <div className="flex items-start gap-4">
        {showIcon && (
          <div className={`p-3 bg-white rounded-xl shadow-sm ${content.color}`}>
            {content.icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-2 ${content.color}`}>
            {content.title}
          </h3>
          <p className="text-slate-600 mb-4 leading-relaxed">
            {content.description}
          </p>
          <ul className="space-y-2">
            {content.points.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  mode === 'fun' ? 'bg-pink-400' : 
                  mode === 'researcher' ? 'bg-blue-400' : 'bg-slate-400'
                }`}></span>
                <span className="text-slate-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

/**
 * Mode selector component
 */
interface ModeSelectorProps {
  currentMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
  className?: string;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onModeChange,
  className = ''
}) => {
  const modes: { id: DisplayMode; label: string; icon: React.ReactNode; color: string }[] = [
    { 
      id: 'fun', 
      label: 'Fun', 
      icon: <Gamepad2 className="w-4 h-4" />,
      color: 'text-pink-600 bg-pink-50 border-pink-200'
    },
    { 
      id: 'researcher', 
      label: 'Researcher', 
      icon: <Microscope className="w-4 h-4" />,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    { 
      id: 'spec', 
      label: 'Spec', 
      icon: <BookOpen className="w-4 h-4" />,
      color: 'text-slate-600 bg-slate-100 border-slate-200'
    }
  ];

  return (
    <div className={`flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm ${className}`}>
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${currentMode === mode.id 
              ? `${mode.color} shadow-sm` 
              : 'text-slate-600 hover:bg-slate-50'
            }
          `}
        >
          {mode.icon}
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default ModeContent;
