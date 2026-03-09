/**
 * TEvaluate Calculator Hook
 * Manages TEvaluate period calculation state and logic
 */

import { useState, useCallback, useMemo } from 'react';
import { TEvaluateConfig, TEvaluateResult, RxConfig, FrequencyRange } from '../types/rlm';
import { calculateTEvaluateOut, calculateTEvaluateIn, T_SSB_VALUES } from '../utils/rlmCalculations';

type DRXCycle = 'no-drx' | '320ms' | '640ms' | '1280ms';

interface UseTEvaluateCalculatorReturn {
  // Inputs
  frequencyRange: FrequencyRange;
  rxConfig: RxConfig;
  drxCycle: DRXCycle;
  pFactor: number;
  tSSB_ms: number;
  nResources: number;
  syncState: 'out' | 'in';
  
  // Setters
  setFrequencyRange: (value: FrequencyRange) => void;
  setRxConfig: (value: RxConfig) => void;
  setDRXCycle: (value: DRXCycle) => void;
  setPFactor: (value: number) => void;
  setTSSB: (value: number) => void;
  setNResources: (value: number) => void;
  setSyncState: (value: 'out' | 'in') => void;
  
  // Results
  result: TEvaluateResult;
  
  // Options
  tSSBOptions: readonly number[];
  drxOptions: DRXCycle[];
  nResourceOptions: number[];
}

export function useTEvaluateCalculator(): UseTEvaluateCalculatorReturn {
  const [frequencyRange, setFrequencyRange] = useState<FrequencyRange>('FR1');
  const [rxConfig, setRxConfig] = useState<RxConfig>('2Rx');
  const [drxCycle, setDRXCycle] = useState<DRXCycle>('no-drx');
  const [pFactor, setPFactor] = useState<number>(1.0);
  const [tSSB_ms, setTSSB] = useState<number>(20);
  const [nResources, setNResources] = useState<number>(2);
  const [syncState, setSyncState] = useState<'out' | 'in'>('out');

  const config: TEvaluateConfig = useMemo(() => ({
    frequencyRange,
    rxConfig,
    drxCycle,
    pFactor,
    tSSB_ms,
    nResources: frequencyRange === 'FR2' ? nResources : 1,
  }), [frequencyRange, rxConfig, drxCycle, pFactor, tSSB_ms, nResources]);

  const result = useMemo(() => {
    if (syncState === 'out') {
      return calculateTEvaluateOut(config);
    } else {
      return calculateTEvaluateIn(config);
    }
  }, [config, syncState]);

  const nResourceOptions = useMemo(() => {
    if (frequencyRange === 'FR1') {
      return [2, 4];
    } else {
      return [8];
    }
  }, [frequencyRange]);

  const drxOptions: DRXCycle[] = ['no-drx', '320ms', '640ms', '1280ms'];

  return {
    frequencyRange,
    rxConfig,
    drxCycle,
    pFactor,
    tSSB_ms,
    nResources,
    syncState,
    setFrequencyRange,
    setRxConfig,
    setDRXCycle,
    setPFactor,
    setTSSB,
    setNResources,
    setSyncState,
    result,
    tSSBOptions: T_SSB_VALUES,
    drxOptions,
    nResourceOptions,
  };
}
