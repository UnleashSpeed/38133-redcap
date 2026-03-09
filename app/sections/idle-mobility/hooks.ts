/**
 * Idle Mobility Custom Hooks
 * 
 * 3GPP TS 38.133 Clause 4.2B - Cell Re-selection for RedCap
 * React hooks for calculations and state management
 */

import { useState, useMemo } from 'react';
import {
  FrequencyRange,
  RxConfig,
  calculateM1Factor,
  calculateNservNoEDRX,
  calculateNservEDRX,
  calculateTmeasureIntra,
  calculateTdetectInter,
  calculateRelaxedTiming,
} from './utils';

// ============================================================================
// NSERV CALCULATOR HOOK
// ============================================================================

export interface UseNservCalculatorReturn {
  /** Current DRX cycle value (non-eDRX mode) */
  drxCycle: number;
  /** Set DRX cycle value */
  setDrxCycle: (value: number) => void;
  /** Whether eDRX is enabled */
  isEDRX: boolean;
  /** Toggle eDRX mode */
  setIsEDRX: (value: boolean) => void;
  /** Current eDRX cycle value */
  edrxCycle: number;
  /** Set eDRX cycle value */
  setEdrxCycle: (value: number) => void;
  /** Current PTW value */
  ptw: number;
  /** Set PTW value */
  setPtw: (value: number) => void;
  /** Current frequency range */
  frequencyRange: FrequencyRange;
  /** Set frequency range */
  setFrequencyRange: (value: FrequencyRange) => void;
  /** Current SMTC periodicity */
  smtcPeriodicity: number;
  /** Set SMTC periodicity */
  setSmtcPeriodicity: (value: number) => void;
  /** Calculated base Nserv value */
  nserv: number;
  /** Calculated M1 factor */
  m1Factor: number;
  /** Effective Nserv (nserv × m1Factor) */
  effectiveNserv: number;
}

/**
 * Hook for Nserv_RedCap calculations
 * 
 * Manages state and calculations for Nserv based on DRX/eDRX configuration,
 * PTW settings, and SMTC periodicity.
 * 
 * @example
 * ```tsx
 * const calc = useNservCalculator();
 * console.log(calc.effectiveNserv); // Calculated Nserv value
 * ```
 */
export const useNservCalculator = (): UseNservCalculatorReturn => {
  const [drxCycle, setDrxCycle] = useState<number>(0.32);
  const [isEDRX, setIsEDRX] = useState<boolean>(false);
  const [edrxCycle, setEdrxCycle] = useState<number>(2.56);
  const [ptw, setPtw] = useState<number>(0.16);
  const [frequencyRange, setFrequencyRange] = useState<FrequencyRange>('FR1');
  const [smtcPeriodicity, setSmtcPeriodicity] = useState<number>(20);

  const nserv = useMemo(() => {
    if (isEDRX) {
      return calculateNservEDRX(edrxCycle, ptw, frequencyRange);
    }
    return calculateNservNoEDRX(drxCycle);
  }, [drxCycle, isEDRX, edrxCycle, ptw, frequencyRange]);

  const m1Factor = useMemo(() => {
    return calculateM1Factor(smtcPeriodicity, isEDRX ? edrxCycle : drxCycle);
  }, [smtcPeriodicity, drxCycle, edrxCycle, isEDRX]);

  const effectiveNserv = useMemo(() => {
    return nserv * m1Factor;
  }, [nserv, m1Factor]);

  return {
    drxCycle,
    setDrxCycle,
    isEDRX,
    setIsEDRX,
    edrxCycle,
    setEdrxCycle,
    ptw,
    setPtw,
    frequencyRange,
    setFrequencyRange,
    smtcPeriodicity,
    setSmtcPeriodicity,
    nserv,
    m1Factor,
    effectiveNserv,
  };
};

// ============================================================================
// TIMING CALCULATOR HOOK
// ============================================================================

export interface UseTimingCalculatorReturn {
  /** SMTC periodicity in ms */
  smtcPeriodicity: number;
  /** Set SMTC periodicity */
  setSmtcPeriodicity: (value: number) => void;
  /** MGRP in ms */
  mgrp: number;
  /** Set MGRP */
  setMgrp: (value: number) => void;
  /** Rx configuration */
  rxConfig: RxConfig;
  /** Set Rx configuration */
  setRxConfig: (value: RxConfig) => void;
  /** Measurement type */
  measurementType: 'intra' | 'inter';
  /** Set measurement type */
  setMeasurementType: (value: 'intra' | 'inter') => void;
  /** CSSF value */
  cssf: number;
  /** Set CSSF value */
  setCssf: (value: number) => void;
  /** K1 factor (stationary/low mobility) */
  k1: boolean;
  /** Set K1 factor */
  setK1: (value: boolean) => void;
  /** K2 factor (not at cell edge) */
  k2: boolean;
  /** Set K2 factor */
  setK2: (value: boolean) => void;
  /** Calculated Tmeasure */
  tMeasure: number;
  /** Calculated Tdetect */
  tDetect: number;
  /** Whether relaxed criteria are applied */
  isRelaxed: boolean;
}

/**
 * Hook for timing requirement calculations
 * 
 * Manages state and calculations for Tmeasure and Tdetect based on
 * SMTC periodicity, MGRP, Rx configuration, and relaxed criteria.
 * 
 * @example
 * ```tsx
 * const timing = useTimingCalculator();
 * console.log(timing.tMeasure); // Calculated measurement time
 * ```
 */
export const useTimingCalculator = (): UseTimingCalculatorReturn => {
  const [smtcPeriodicity, setSmtcPeriodicity] = useState<number>(20);
  const [mgrp, setMgrp] = useState<number>(40);
  const [rxConfig, setRxConfig] = useState<RxConfig>('2Rx');
  const [measurementType, setMeasurementType] = useState<'intra' | 'inter'>('intra');
  const [cssf, setCssf] = useState<number>(1);
  const [k1, setK1] = useState<boolean>(false);
  const [k2, setK2] = useState<boolean>(false);

  const baseTMeasure = useMemo(() => {
    if (measurementType === 'intra') {
      return calculateTmeasureIntra(smtcPeriodicity, rxConfig, cssf);
    }
    return 0;
  }, [smtcPeriodicity, rxConfig, cssf, measurementType]);

  const baseTDetect = useMemo(() => {
    if (measurementType === 'inter') {
      return calculateTdetectInter(smtcPeriodicity, mgrp, rxConfig, cssf);
    }
    return 0;
  }, [smtcPeriodicity, mgrp, rxConfig, cssf, measurementType]);

  const tMeasure = useMemo(() => {
    return calculateRelaxedTiming(baseTMeasure, k1, k2);
  }, [baseTMeasure, k1, k2]);

  const tDetect = useMemo(() => {
    return calculateRelaxedTiming(baseTDetect, k1, k2);
  }, [baseTDetect, k1, k2]);

  const isRelaxed = k1 || k2;

  return {
    smtcPeriodicity,
    setSmtcPeriodicity,
    mgrp,
    setMgrp,
    rxConfig,
    setRxConfig,
    measurementType,
    setMeasurementType,
    cssf,
    setCssf,
    k1,
    setK1,
    k2,
    setK2,
    tMeasure,
    tDetect,
    isRelaxed,
  };
};

// ============================================================================
// SCENARIO CONFIGURATION HOOK
// ============================================================================

export type MobilityState = 'normal' | 'stationary' | 'low_mobility';
export type CellEdgeState = 'normal' | 'not_at_edge';

export interface UseScenarioConfigReturn {
  /** Current mobility state */
  mobility: MobilityState;
  /** Set mobility state */
  setMobility: (value: MobilityState) => void;
  /** Current cell edge state */
  cellEdge: CellEdgeState;
  /** Set cell edge state */
  setCellEdge: (value: CellEdgeState) => void;
  /** Current Rx configuration */
  rxConfig: RxConfig;
  /** Set Rx configuration */
  setRxConfig: (value: RxConfig) => void;
  /** K1 factor active */
  k1: boolean;
  /** K2 factor active */
  k2: boolean;
  /** K3 factor active (K1 AND K2) */
  k3: boolean;
  /** Human-readable scenario description */
  scenarioDescription: string;
}

/**
 * Hook for scenario configuration
 * 
 * Manages mobility state, cell edge state, and Rx configuration
 * to determine which relaxed criteria factors are active.
 * 
 * @example
 * ```tsx
 * const scenario = useScenarioConfig();
 * console.log(scenario.k3); // Whether K3 (both K1 and K2) is active
 * ```
 */
export const useScenarioConfig = (): UseScenarioConfigReturn => {
  const [mobility, setMobility] = useState<MobilityState>('normal');
  const [cellEdge, setCellEdge] = useState<CellEdgeState>('normal');
  const [rxConfig, setRxConfig] = useState<RxConfig>('2Rx');

  const k1 = mobility !== 'normal';
  const k2 = cellEdge === 'not_at_edge';
  const k3 = k1 && k2;

  const scenarioDescription = useMemo(() => {
    const parts: string[] = [];
    
    if (mobility === 'stationary') parts.push('stationary');
    else if (mobility === 'low_mobility') parts.push('low mobility');
    else parts.push('normal mobility');

    if (cellEdge === 'not_at_edge') parts.push('good coverage');
    else parts.push('cell edge');

    parts.push(rxConfig);

    return parts.join(', ');
  }, [mobility, cellEdge, rxConfig]);

  return {
    mobility,
    setMobility,
    cellEdge,
    setCellEdge,
    rxConfig,
    setRxConfig,
    k1,
    k2,
    k3,
    scenarioDescription,
  };
};

// ============================================================================
// TIMELINE ANIMATION HOOK
// ============================================================================

export interface UseTimelineAnimationReturn {
  /** Whether animation is playing */
  isPlaying: boolean;
  /** Start animation */
  play: () => void;
  /** Pause animation */
  pause: () => void;
  /** Reset animation */
  reset: () => void;
  /** Current progress (0-100) */
  progress: number;
  /** Current phase */
  phase: 'detect' | 'measure' | 'evaluate' | 'complete';
  /** Time values */
  times: {
    tDetect: number;
    tMeasure: number;
    tEvaluate: number;
    total: number;
  };
}

/**
 * Hook for timeline animation
 * 
 * Manages the animation state for cell reselection timeline visualization.
 * 
 * @param tDetect - Detection time in ms
 * @param tMeasure - Measurement time in ms
 * @param tEvaluate - Evaluation time in ms
 * @returns Animation control and state
 * 
 * @example
 * ```tsx
 * const timeline = useTimelineAnimation(600, 200, 320);
 * console.log(timeline.phase); // Current phase
 * ```
 */
export const useTimelineAnimation = (
  tDetect: number = 600,
  tMeasure: number = 200,
  tEvaluate: number = 320
): UseTimelineAnimationReturn => {
  // This is a simplified version - the actual implementation would use
  // useEffect and setInterval for animation
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const total = tDetect + tMeasure + tEvaluate;

  const phase = useMemo(() => {
    const currentTime = (progress / 100) * total;
    if (currentTime < tDetect) return 'detect';
    if (currentTime < tDetect + tMeasure) return 'measure';
    if (currentTime < total) return 'evaluate';
    return 'complete';
  }, [progress, tDetect, tMeasure, total]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const reset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return {
    isPlaying,
    play,
    pause,
    reset,
    progress,
    phase,
    times: {
      tDetect,
      tMeasure,
      tEvaluate,
      total,
    },
  };
};
