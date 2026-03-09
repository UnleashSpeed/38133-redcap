/**
 * P-Factor Calculator Hook
 * Manages P-Factor calculation state and logic
 */

import { useState, useCallback, useMemo } from 'react';
import { PFactorParams, FrequencyRange } from '../types/rlm';
import { calculatePFactor, T_SSB_VALUES, MGRP_VALUES } from '../utils/rlmCalculations';

interface UsePFactorCalculatorReturn {
  // Inputs
  tSSB_ms: number;
  mgrp_ms: number;
  smtcDuration_ms: number;
  smtcPeriodicity_ms: number;
  frequencyRange: FrequencyRange;
  gapOverlap: boolean;
  
  // Setters
  setTSSB: (value: number) => void;
  setMGRP: (value: number) => void;
  setSMTCDuration: (value: number) => void;
  setSMTCPeriodicity: (value: number) => void;
  setFrequencyRange: (value: FrequencyRange) => void;
  setGapOverlap: (value: boolean) => void;
  
  // Results
  pFactor: number;
  formula: string;
  explanation: string;
  
  // Options
  tSSBOptions: readonly number[];
  mgrpOptions: readonly number[];
}

export function usePFactorCalculator(): UsePFactorCalculatorReturn {
  const [tSSB_ms, setTSSB] = useState<number>(20);
  const [mgrp_ms, setMGRP] = useState<number>(40);
  const [smtcDuration_ms, setSMTCDuration] = useState<number>(2);
  const [smtcPeriodicity_ms, setSMTCPeriodicity] = useState<number>(20);
  const [frequencyRange, setFrequencyRange] = useState<FrequencyRange>('FR1');
  const [gapOverlap, setGapOverlap] = useState<boolean>(true);

  const params: PFactorParams = useMemo(() => ({
    tSSB_ms,
    mgrp_ms,
    smtcDuration_ms,
    smtcPeriodicity_ms,
    frequencyRange,
    gapOverlap,
  }), [tSSB_ms, mgrp_ms, smtcDuration_ms, smtcPeriodicity_ms, frequencyRange, gapOverlap]);

  const pFactor = useMemo(() => calculatePFactor(params), [params]);

  const formula = useMemo(() => {
    if (!gapOverlap) {
      return 'P = 1 (no gap overlap)';
    }
    
    if (frequencyRange === 'FR1') {
      return 'P = \\frac{1}{1 - \\frac{T_{SSB}}{MGRP}}';
    } else {
      if (smtcDuration_ms > 0 && smtcPeriodicity_ms > 0) {
        return 'P = \\frac{1}{1 - \\frac{T_{SSB}}{MGRP}} \\times \\frac{1}{1 - \\frac{SMTC_{duration}}{SMTC_{periodicity}}}';
      }
      return 'P = \\frac{1}{1 - \\frac{T_{SSB}}{MGRP}}';
    }
  }, [frequencyRange, gapOverlap, smtcDuration_ms, smtcPeriodicity_ms]);

  const explanation = useMemo(() => {
    if (!gapOverlap) {
      return 'When measurement gaps do not overlap with SSB, the P-factor is 1, meaning no additional scaling is needed.';
    }
    
    if (frequencyRange === 'FR1') {
      return `For FR1 with gap overlap, P-factor accounts for the fraction of time the UE cannot monitor due to gaps. 
With T_SSB = ${tSSB_ms}ms and MGRP = ${mgrp_ms}ms, the UE misses ${((tSSB_ms / mgrp_ms) * 100).toFixed(1)}% of SSB opportunities.`;
    } else {
      return `For FR2, P-factor includes both gap impact and SMTC configuration. 
The formula accounts for measurement gaps (MGRP = ${mgrp_ms}ms) and SMTC periodicity (${smtcPeriodicity_ms}ms).`;
    }
  }, [frequencyRange, gapOverlap, tSSB_ms, mgrp_ms, smtcPeriodicity_ms]);

  return {
    tSSB_ms,
    mgrp_ms,
    smtcDuration_ms,
    smtcPeriodicity_ms,
    frequencyRange,
    gapOverlap,
    setTSSB,
    setMGRP,
    setSMTCDuration,
    setSMTCPeriodicity,
    setFrequencyRange,
    setGapOverlap,
    pFactor,
    formula,
    explanation,
    tSSBOptions: T_SSB_VALUES,
    mgrpOptions: MGRP_VALUES,
  };
}
