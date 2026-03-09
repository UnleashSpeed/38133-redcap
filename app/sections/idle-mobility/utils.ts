/**
 * Idle Mobility Utilities
 * 
 * 3GPP TS 38.133 Clause 4.2B - Cell Re-selection for RedCap
 * Data tables and calculation utilities
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type FrequencyRange = 'FR1' | 'FR2';
export type RxConfig = '1Rx' | '2Rx';

// ============================================================================
// DATA TABLES (3GPP TS 38.133 Clause 4.2B)
// ============================================================================

/**
 * Table 4.2B.2.2-1: Nserv_RedCap - No eDRX (DRX cycles 0.32s to 2.56s)
 * 
 * Nserv defines the number of DRX cycles for cell reselection evaluation
 * when eDRX is not configured.
 */
export const NSERV_TABLE_NO_EDRX: { drx: number; nserv: number }[] = [
  { drx: 0.32, nserv: 4 },
  { drx: 0.64, nserv: 4 },
  { drx: 1.28, nserv: 8 },
  { drx: 2.56, nserv: 8 },
];

/**
 * Table 4.2B.2.2-2: Nserv_RedCap - eDRX for FR1 (eDRX 2.56s to 10485.76s)
 * 
 * Nserv values for extended DRX configuration in Frequency Range 1 (sub-6GHz).
 * Values depend on both eDRX cycle length and PTW (Paging Time Window).
 */
export const NSERV_TABLE_EDRX_FR1: { edrx: number; ptw: number; nserv: number }[] = [
  { edrx: 2.56, ptw: 0.16, nserv: 4 },
  { edrx: 2.56, ptw: 0.32, nserv: 4 },
  { edrx: 2.56, ptw: 0.64, nserv: 4 },
  { edrx: 5.12, ptw: 0.16, nserv: 8 },
  { edrx: 5.12, ptw: 0.32, nserv: 8 },
  { edrx: 5.12, ptw: 0.64, nserv: 4 },
  { edrx: 7.68, ptw: 0.16, nserv: 12 },
  { edrx: 7.68, ptw: 0.32, nserv: 8 },
  { edrx: 7.68, ptw: 0.64, nserv: 4 },
  { edrx: 10.24, ptw: 0.16, nserv: 16 },
  { edrx: 10.24, ptw: 0.32, nserv: 8 },
  { edrx: 10.24, ptw: 0.64, nserv: 4 },
  { edrx: 20.48, ptw: 0.32, nserv: 16 },
  { edrx: 20.48, ptw: 0.64, nserv: 8 },
  { edrx: 20.48, ptw: 1.28, nserv: 4 },
  { edrx: 40.96, ptw: 0.32, nserv: 32 },
  { edrx: 40.96, ptw: 0.64, nserv: 16 },
  { edrx: 40.96, ptw: 1.28, nserv: 8 },
  { edrx: 61.44, ptw: 0.32, nserv: 48 },
  { edrx: 61.44, ptw: 0.64, nserv: 24 },
  { edrx: 61.44, ptw: 1.28, nserv: 12 },
  { edrx: 81.92, ptw: 0.32, nserv: 64 },
  { edrx: 81.92, ptw: 0.64, nserv: 32 },
  { edrx: 81.92, ptw: 1.28, nserv: 16 },
  { edrx: 163.84, ptw: 0.64, nserv: 64 },
  { edrx: 163.84, ptw: 1.28, nserv: 32 },
  { edrx: 163.84, ptw: 2.56, nserv: 16 },
  { edrx: 327.68, ptw: 0.64, nserv: 128 },
  { edrx: 327.68, ptw: 1.28, nserv: 64 },
  { edrx: 327.68, ptw: 2.56, nserv: 32 },
  { edrx: 655.36, ptw: 0.64, nserv: 256 },
  { edrx: 655.36, ptw: 1.28, nserv: 128 },
  { edrx: 655.36, ptw: 2.56, nserv: 64 },
  { edrx: 1310.72, ptw: 0.64, nserv: 512 },
  { edrx: 1310.72, ptw: 1.28, nserv: 256 },
  { edrx: 1310.72, ptw: 2.56, nserv: 128 },
  { edrx: 2621.44, ptw: 1.28, nserv: 512 },
  { edrx: 2621.44, ptw: 2.56, nserv: 256 },
  { edrx: 2621.44, ptw: 5.12, nserv: 128 },
  { edrx: 5242.88, ptw: 1.28, nserv: 1024 },
  { edrx: 5242.88, ptw: 2.56, nserv: 512 },
  { edrx: 5242.88, ptw: 5.12, nserv: 256 },
  { edrx: 10485.76, ptw: 1.28, nserv: 2048 },
  { edrx: 10485.76, ptw: 2.56, nserv: 1024 },
  { edrx: 10485.76, ptw: 5.12, nserv: 512 },
];

/**
 * Table 4.2B.2.2-3: Nserv_RedCap - eDRX for FR2
 * 
 * Nserv values for extended DRX configuration in Frequency Range 2 (mmWave).
 * Note: FR2 values are generally higher than FR1 due to more challenging propagation.
 */
export const NSERV_TABLE_EDRX_FR2: { edrx: number; ptw: number; nserv: number }[] = [
  { edrx: 2.56, ptw: 0.16, nserv: 8 },
  { edrx: 2.56, ptw: 0.32, nserv: 4 },
  { edrx: 2.56, ptw: 0.64, nserv: 4 },
  { edrx: 5.12, ptw: 0.16, nserv: 16 },
  { edrx: 5.12, ptw: 0.32, nserv: 8 },
  { edrx: 5.12, ptw: 0.64, nserv: 4 },
  { edrx: 7.68, ptw: 0.16, nserv: 24 },
  { edrx: 7.68, ptw: 0.32, nserv: 12 },
  { edrx: 7.68, ptw: 0.64, nserv: 8 },
  { edrx: 10.24, ptw: 0.16, nserv: 32 },
  { edrx: 10.24, ptw: 0.32, nserv: 16 },
  { edrx: 10.24, ptw: 0.64, nserv: 8 },
  { edrx: 20.48, ptw: 0.32, nserv: 32 },
  { edrx: 20.48, ptw: 0.64, nserv: 16 },
  { edrx: 20.48, ptw: 1.28, nserv: 8 },
  { edrx: 40.96, ptw: 0.32, nserv: 64 },
  { edrx: 40.96, ptw: 0.64, nserv: 32 },
  { edrx: 40.96, ptw: 1.28, nserv: 16 },
  { edrx: 61.44, ptw: 0.32, nserv: 96 },
  { edrx: 61.44, ptw: 0.64, nserv: 48 },
  { edrx: 61.44, ptw: 1.28, nserv: 24 },
  { edrx: 81.92, ptw: 0.32, nserv: 128 },
  { edrx: 81.92, ptw: 0.64, nserv: 64 },
  { edrx: 81.92, ptw: 1.28, nserv: 32 },
  { edrx: 163.84, ptw: 0.64, nserv: 128 },
  { edrx: 163.84, ptw: 1.28, nserv: 64 },
  { edrx: 163.84, ptw: 2.56, nserv: 32 },
  { edrx: 327.68, ptw: 0.64, nserv: 256 },
  { edrx: 327.68, ptw: 1.28, nserv: 128 },
  { edrx: 327.68, ptw: 2.56, nserv: 64 },
  { edrx: 655.36, ptw: 0.64, nserv: 512 },
  { edrx: 655.36, ptw: 1.28, nserv: 256 },
  { edrx: 655.36, ptw: 2.56, nserv: 128 },
  { edrx: 1310.72, ptw: 0.64, nserv: 1024 },
  { edrx: 1310.72, ptw: 1.28, nserv: 512 },
  { edrx: 1310.72, ptw: 2.56, nserv: 256 },
  { edrx: 2621.44, ptw: 1.28, nserv: 1024 },
  { edrx: 2621.44, ptw: 2.56, nserv: 512 },
  { edrx: 2621.44, ptw: 5.12, nserv: 256 },
  { edrx: 5242.88, ptw: 1.28, nserv: 2048 },
  { edrx: 5242.88, ptw: 2.56, nserv: 1024 },
  { edrx: 5242.88, ptw: 5.12, nserv: 512 },
  { edrx: 10485.76, ptw: 1.28, nserv: 4096 },
  { edrx: 10485.76, ptw: 2.56, nserv: 2048 },
  { edrx: 10485.76, ptw: 5.12, nserv: 1024 },
];

/**
 * Table 4.2B.2.3-1: Tmeasure for intra-frequency measurements
 * 
 * The time allowed for measurements on the serving frequency.
 */
export const TMEASURE_INTRA_2RX = 'max(200ms, 5 × SMTC) × CSSF';
export const TMEASURE_INTRA_1RX = 'max(200ms, 7 × SMTC) × CSSF';

/**
 * Table 4.2B.2.3-2: Tdetect for inter-frequency measurements
 * 
 * The time allowed for detecting cells on a different frequency.
 */
export const TDETECT_INTER_2RX = 'max(600ms, 8 × max(MGRP, SMTC)) × CSSF';
export const TDETECT_INTER_1RX = 'max(600ms, 10 × max(MGRP, SMTC)) × CSSF';

/**
 * CSSF (Cell Selection and re-Selection Factor) values
 * 
 * CSSF accounts for measurement gaps and other constraints.
 */
export const CSSF_VALUES = {
  intraFreq: 1,
  interFreq: 1,
  interRAT: 1.5,
};

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate the M1 factor for Nserv adjustment
 * 
 * M1 = 2 if SMTC > 20ms AND DRX ≤ 0.64s, else 1
 * 
 * @param smtcPeriodicity - SMTC periodicity in ms
 * @param drxCycle - DRX cycle in seconds
 * @returns M1 factor (1 or 2)
 */
export const calculateM1Factor = (smtcPeriodicity: number, drxCycle: number): number => {
  return smtcPeriodicity > 20 && drxCycle <= 0.64 ? 2 : 1;
};

/**
 * Calculate Nserv for non-eDRX configuration
 * 
 * @param drxCycle - DRX cycle in seconds
 * @returns Nserv value
 */
export const calculateNservNoEDRX = (drxCycle: number): number => {
  const entry = NSERV_TABLE_NO_EDRX.find(e => e.drx === drxCycle);
  return entry?.nserv || 4;
};

/**
 * Calculate Nserv for eDRX configuration
 * 
 * @param edrxCycle - eDRX cycle in seconds
 * @param ptw - Paging Time Window in seconds
 * @param fr - Frequency Range ('FR1' or 'FR2')
 * @returns Nserv value
 */
export const calculateNservEDRX = (
  edrxCycle: number,
  ptw: number,
  fr: FrequencyRange
): number => {
  const table = fr === 'FR1' ? NSERV_TABLE_EDRX_FR1 : NSERV_TABLE_EDRX_FR2;
  
  // Find exact match
  const entry = table.find(e => e.edrx === edrxCycle && e.ptw === ptw);
  if (entry) return entry.nserv;
  
  // Find closest eDRX cycle
  const closeEntries = table.filter(e => Math.abs(e.edrx - edrxCycle) < 0.1);
  if (closeEntries.length > 0) {
    // Try to find PTW match
    const ptwMatch = closeEntries.find(e => Math.abs(e.ptw - ptw) < 0.1);
    if (ptwMatch) return ptwMatch.nserv;
    return closeEntries[0].nserv;
  }
  
  // Default values
  return fr === 'FR1' ? 4 : 8;
};

/**
 * Calculate Tmeasure for intra-frequency measurements
 * 
 * @param smtcPeriodicity - SMTC periodicity in ms
 * @param rxConfig - '1Rx' or '2Rx'
 * @param cssf - CSSF value (default 1)
 * @returns Tmeasure in ms
 */
export const calculateTmeasureIntra = (
  smtcPeriodicity: number,
  rxConfig: RxConfig,
  cssf: number = 1
): number => {
  const multiplier = rxConfig === '2Rx' ? 5 : 7;
  return Math.max(200, multiplier * smtcPeriodicity) * cssf;
};

/**
 * Calculate Tdetect for inter-frequency measurements
 * 
 * @param smtcPeriodicity - SMTC periodicity in ms
 * @param mgrp - Measurement Gap Repetition Period in ms
 * @param rxConfig - '1Rx' or '2Rx'
 * @param cssf - CSSF value (default 1)
 * @returns Tdetect in ms
 */
export const calculateTdetectInter = (
  smtcPeriodicity: number,
  mgrp: number,
  rxConfig: RxConfig,
  cssf: number = 1
): number => {
  const multiplier = rxConfig === '2Rx' ? 8 : 10;
  return Math.max(600, multiplier * Math.max(mgrp, smtcPeriodicity)) * cssf;
};

/**
 * Calculate relaxed timing based on K1, K2, K3 factors
 * 
 * K1: Stationary/low mobility
 * K2: Not at cell edge (Srxlev > 4dB)
 * K3: K1 AND K2
 * 
 * @param normalTiming - Normal timing requirement in ms
 * @param k1 - K1 factor active
 * @param k2 - K2 factor active
 * @returns Relaxed timing in ms
 */
export const calculateRelaxedTiming = (
  normalTiming: number,
  k1: boolean,
  k2: boolean
): number => {
  const k3 = k1 && k2;
  if (k3) {
    return Math.max(2 * normalTiming, 1000); // max(2×T, 1s)
  } else if (k1 || k2) {
    return Math.max(1.5 * normalTiming, 750); // Partial relaxation
  }
  return normalTiming;
};

/**
 * Format time in milliseconds to human-readable string
 * 
 * @param ms - Time in milliseconds
 * @returns Formatted string
 */
export const formatTime = (ms: number): string => {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}min`;
};

/**
 * Get all available DRX cycle options
 */
export const getDRXOptions = (): number[] => {
  return NSERV_TABLE_NO_EDRX.map(e => e.drx);
};

/**
 * Get all available eDRX cycle options
 */
export const getEDRXOptions = (): number[] => {
  return [...new Set(NSERV_TABLE_EDRX_FR1.map(e => e.edrx))];
};

/**
 * Get all available PTW options
 */
export const getPTWOptions = (): number[] => {
  return [...new Set(NSERV_TABLE_EDRX_FR1.map(e => e.ptw))];
};

/**
 * Calculate total cell reselection time
 * 
 * @param tDetect - Detection time in ms
 * @param tMeasure - Measurement time in ms
 * @param nserv - Nserv value
 * @param drxCycle - DRX cycle in ms
 * @returns Total reselection time in ms
 */
export const calculateTotalReselectionTime = (
  tDetect: number,
  tMeasure: number,
  nserv: number,
  drxCycle: number
): number => {
  const tEvaluate = nserv * drxCycle;
  return tDetect + tMeasure + tEvaluate;
};

/**
 * Get timing requirements for a specific scenario
 * 
 * @param params - Scenario parameters
 * @returns Timing requirements object
 */
export const getTimingRequirements = (params: {
  smtcPeriodicity: number;
  mgrp?: number;
  rxConfig: RxConfig;
  measurementType: 'intra' | 'inter';
  cssf?: number;
  k1?: boolean;
  k2?: boolean;
}): {
  tDetect: number;
  tMeasure: number;
  relaxed: boolean;
} => {
  const { smtcPeriodicity, mgrp = 40, rxConfig, measurementType, cssf = 1, k1 = false, k2 = false } = params;
  
  let tMeasure = 0;
  let tDetect = 0;
  
  if (measurementType === 'intra') {
    tMeasure = calculateTmeasureIntra(smtcPeriodicity, rxConfig, cssf);
    tMeasure = calculateRelaxedTiming(tMeasure, k1, k2);
  } else {
    tDetect = calculateTdetectInter(smtcPeriodicity, mgrp, rxConfig, cssf);
    tDetect = calculateRelaxedTiming(tDetect, k1, k2);
  }
  
  return {
    tDetect,
    tMeasure,
    relaxed: k1 || k2,
  };
};
