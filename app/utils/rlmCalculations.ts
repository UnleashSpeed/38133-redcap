/**
 * RLM Calculation Utilities
 * Based on 3GPP TS 38.133 clause 8.1B
 */

import {
  PFactorParams,
  TEvaluateConfig,
  TEvaluateResult,
  RLMThresholds,
  RxConfig,
  FrequencyRange,
  PDCCHParams,
  RLMResourceConfig,
} from '../types/rlm';

// BLER thresholds from 8.1B.1
export const BLER_THRESHOLDS = {
  outOfSync: 0.10, // 10%
  inSync: 0.02,    // 2%
};

// NRLM resources from 8.1B.1
export const N_RLM_RESOURCES: Record<FrequencyRange, number> = {
  FR1: 2, // For ≤3GHz; 4 for >3GHz
  FR2: 8,
};

// Default Qout/Qin thresholds (approximate values)
export const DEFAULT_THRESHOLDS: RLMThresholds = {
  qOut_dB: -8,
  qIn_dB: -6,
  blerOut: 0.10,
  blerIn: 0.02,
};

// TSSB values (ms)
export const T_SSB_VALUES = [5, 10, 20, 40, 80, 160] as const;

// MGRP values (ms)
export const MGRP_VALUES = [20, 40, 80, 160] as const;

// CSI-RS periodicity values (ms)
export const T_CSIRS_VALUES = [5, 10, 20, 40] as const;

/**
 * Calculate P-Factor based on 3GPP TS 38.133
 * 
 * For FR1: P = 1 / (1 - T_SSB / MGRP) when gaps overlap SSB
 * For FR2: More complex formulas based on SMTC and gap overlap
 */
export function calculatePFactor(params: PFactorParams): number {
  const { tSSB_ms, mgrp_ms, frequencyRange, gapOverlap, smtcDuration_ms, smtcPeriodicity_ms } = params;

  if (!gapOverlap) {
    return 1; // No overlap, P = 1
  }

  if (frequencyRange === 'FR1') {
    // FR1 Formula: P = 1 / (1 - T_SSB / MGRP)
    if (mgrp_ms <= tSSB_ms) {
      return 1; // Invalid case, return 1
    }
    return 1 / (1 - tSSB_ms / mgrp_ms);
  } else {
    // FR2 Formulas (simplified based on spec)
    if (smtcDuration_ms && smtcPeriodicity_ms) {
      // When SMTC is configured
      if (gapOverlap) {
        // P = 1 / (1 - T_SSB / MGRP) * (1 / (1 - SMTC_duration / SMTC_periodicity))
        const p1 = 1 / (1 - tSSB_ms / mgrp_ms);
        const p2 = 1 / (1 - smtcDuration_ms / smtcPeriodicity_ms);
        return p1 * p2;
      }
    }
    return 1;
  }
}

/**
 * Calculate TEvaluate_out for SSB-based RLM
 * Based on Tables 8.1B.2.2-1, 8.1B.2.2-2, 8.1B.2.2-3
 */
export function calculateTEvaluateOut(config: TEvaluateConfig): TEvaluateResult {
  const { frequencyRange, rxConfig, drxCycle, pFactor, tSSB_ms, nResources = 1 } = config;

  let formula = '';
  let calculation = '';
  let result_ms = 0;

  if (frequencyRange === 'FR1') {
    if (rxConfig === '2Rx') {
      // FR1 2Rx: Max(200, Ceil(10 × P) × T_SSB)
      const ceilValue = Math.ceil(10 * pFactor);
      const product = ceilValue * tSSB_ms;
      result_ms = Math.max(200, product);
      formula = 'T_{Evaluate,out} = Max(200, Ceil(10 \\times P) \\times T_{SSB})';
      calculation = `Max(200, Ceil(10 \\times ${pFactor.toFixed(2)}) \\times ${tSSB_ms}) = Max(200, ${ceilValue} \\times ${tSSB_ms}) = ${result_ms} ms`;
    } else {
      // FR1 1Rx: Max(400, Ceil(20 × P) × T_SSB)
      const ceilValue = Math.ceil(20 * pFactor);
      const product = ceilValue * tSSB_ms;
      result_ms = Math.max(400, product);
      formula = 'T_{Evaluate,out} = Max(400, Ceil(20 \\times P) \\times T_{SSB})';
      calculation = `Max(400, Ceil(20 \\times ${pFactor.toFixed(2)}) \\times ${tSSB_ms}) = Max(400, ${ceilValue} \\times ${tSSB_ms}) = ${result_ms} ms`;
    }
  } else {
    // FR2
    if (rxConfig === '2Rx') {
      // FR2 2Rx: Max(200, Ceil(10 × P × N) × T_SSB)
      const ceilValue = Math.ceil(10 * pFactor * nResources);
      const product = ceilValue * tSSB_ms;
      result_ms = Math.max(200, product);
      formula = 'T_{Evaluate,out} = Max(200, Ceil(10 \\times P \\times N) \\times T_{SSB})';
      calculation = `Max(200, Ceil(10 \\times ${pFactor.toFixed(2)} \\times ${nResources}) \\times ${tSSB_ms}) = Max(200, ${ceilValue} \\times ${tSSB_ms}) = ${result_ms} ms`;
    } else {
      // FR2 1Rx: Max(400, Ceil(20 × P × N) × T_SSB)
      const ceilValue = Math.ceil(20 * pFactor * nResources);
      const product = ceilValue * tSSB_ms;
      result_ms = Math.max(400, product);
      formula = 'T_{Evaluate,out} = Max(400, Ceil(20 \\times P \\times N) \\times T_{SSB})';
      calculation = `Max(400, Ceil(20 \\times ${pFactor.toFixed(2)} \\times ${nResources}) \\times ${tSSB_ms}) = Max(400, ${ceilValue} \\times ${tSSB_ms}) = ${result_ms} ms`;
    }
  }

  // Convert to subframes (1 ms = 1 subframe)
  const result_sf = result_ms;

  return {
    formula,
    calculation,
    result_ms,
    result_sf,
  };
}

/**
 * Calculate TEvaluate_in for SSB-based RLM
 */
export function calculateTEvaluateIn(config: TEvaluateConfig): TEvaluateResult {
  const { frequencyRange, rxConfig, drxCycle, pFactor, tSSB_ms, nResources = 1 } = config;

  let formula = '';
  let calculation = '';
  let result_ms = 0;

  if (frequencyRange === 'FR1') {
    if (rxConfig === '2Rx') {
      // FR1 2Rx: Max(100, Ceil(2 × P) × T_SSB)
      const ceilValue = Math.ceil(2 * pFactor);
      const product = ceilValue * tSSB_ms;
      result_ms = Math.max(100, product);
      formula = 'T_{Evaluate,in} = Max(100, Ceil(2 \\times P) \\times T_{SSB})';
      calculation = `Max(100, Ceil(2 \\times ${pFactor.toFixed(2)}) \\times ${tSSB_ms}) = Max(100, ${ceilValue} \\times ${tSSB_ms}) = ${result_ms} ms`;
    } else {
      // FR1 1Rx: Max(200, Ceil(4 × P) × T_SSB)
      const ceilValue = Math.ceil(4 * pFactor);
      const product = ceilValue * tSSB_ms;
      result_ms = Math.max(200, product);
      formula = 'T_{Evaluate,in} = Max(200, Ceil(4 \\times P) \\times T_{SSB})';
      calculation = `Max(200, Ceil(4 \\times ${pFactor.toFixed(2)}) \\times ${tSSB_ms}) = Max(200, ${ceilValue} \\times ${tSSB_ms}) = ${result_ms} ms`;
    }
  } else {
    // FR2
    if (rxConfig === '2Rx') {
      // FR2 2Rx: Max(100, Ceil(2 × P × N) × T_SSB)
      const ceilValue = Math.ceil(2 * pFactor * nResources);
      const product = ceilValue * tSSB_ms;
      result_ms = Math.max(100, product);
      formula = 'T_{Evaluate,in} = Max(100, Ceil(2 \\times P \\times N) \\times T_{SSB})';
      calculation = `Max(100, Ceil(2 \\times ${pFactor.toFixed(2)} \\times ${nResources}) \\times ${tSSB_ms}) = Max(100, ${ceilValue} \\times ${tSSB_ms}) = ${result_ms} ms`;
    } else {
      // FR2 1Rx: Max(200, Ceil(4 × P × N) × T_SSB)
      const ceilValue = Math.ceil(4 * pFactor * nResources);
      const product = ceilValue * tSSB_ms;
      result_ms = Math.max(200, product);
      formula = 'T_{Evaluate,in} = Max(200, Ceil(4 \\times P \\times N) \\times T_{SSB})';
      calculation = `Max(200, Ceil(4 \\times ${pFactor.toFixed(2)} \\times ${nResources}) \\times ${tSSB_ms}) = Max(200, ${ceilValue} \\times ${tSSB_ms}) = ${result_ms} ms`;
    }
  }

  return {
    formula,
    calculation,
    result_ms,
    result_sf: result_ms,
  };
}

/**
 * Get PDCCH parameters for Out-of-Sync (Table 8.1B.2.1-1)
 */
export function getOutOfSyncPDCCHParams(rxConfig: RxConfig): PDCCHParams {
  if (rxConfig === '2Rx') {
    return {
      dciFormat: '1-0',
      ofdmSymbols: 2,
      aggregationLevel: 8,
      bandwidthPRBs: 24,
      ratioPDCCHtoSSS_dB: 4,
    };
  } else {
    return {
      dciFormat: '1-0',
      ofdmSymbols: 2,
      aggregationLevel: 16,
      bandwidthPRBs: 48,
      ratioPDCCHtoSSS_dB: 4,
    };
  }
}

/**
 * Get PDCCH parameters for In-Sync (Table 8.1B.2.1-2)
 */
export function getInSyncPDCCHParams(rxConfig: RxConfig): PDCCHParams {
  if (rxConfig === '2Rx') {
    return {
      dciFormat: '1-0',
      ofdmSymbols: 2,
      aggregationLevel: 4,
      bandwidthPRBs: 24,
      ratioPDCCHtoSSS_dB: 0,
    };
  } else {
    return {
      dciFormat: '1-0',
      ofdmSymbols: 2,
      aggregationLevel: 8,
      bandwidthPRBs: 48,
      ratioPDCCHtoSSS_dB: 0,
    };
  }
}

/**
 * Get RLM resource configuration
 */
export function getRLMResourceConfig(frequencyRange: FrequencyRange, freqGHz: number = 2): RLMResourceConfig {
  if (frequencyRange === 'FR1') {
    return {
      frequencyRange: 'FR1',
      maxNRLMResources: freqGHz > 3 ? 4 : 2,
      blerOut: BLER_THRESHOLDS.outOfSync,
      blerIn: BLER_THRESHOLDS.inSync,
    };
  } else {
    return {
      frequencyRange: 'FR2',
      maxNRLMResources: 8,
      blerOut: BLER_THRESHOLDS.outOfSync,
      blerIn: BLER_THRESHOLDS.inSync,
    };
  }
}

/**
 * Get M and N values for CSI-RS based RLM
 * From 8.1B.3
 */
export function getCSIRSMValues(rxConfig: RxConfig): { mOut: number; mIn: number } {
  if (rxConfig === '2Rx') {
    return { mOut: 20, mIn: 10 };
  } else {
    return { mOut: 40, mIn: 10 };
  }
}

/**
 * Calculate BLER from SNR (simplified model)
 */
export function calculateBLER(snr_dB: number): number {
  // Simplified BLER model: BLER = 1 / (1 + exp((SNR + 5) / 2))
  const bler = 1 / (1 + Math.exp((snr_dB + 5) / 2));
  return Math.min(Math.max(bler, 0), 1);
}

/**
 * Determine sync state based on BLER
 */
export function determineSyncState(bler: number): 'in-sync' | 'out-of-sync' | 'transitioning' {
  if (bler <= BLER_THRESHOLDS.inSync) {
    return 'in-sync';
  } else if (bler >= BLER_THRESHOLDS.outOfSync) {
    return 'out-of-sync';
  } else {
    return 'transitioning';
  }
}

/**
 * Format milliseconds to readable string
 */
export function formatMs(ms: number): string {
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(2)} s`;
  }
  return `${ms} ms`;
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
