/**
 * RLM Simulator Hook
 * Manages signal quality simulation with Qout/Qin thresholds
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { SignalQuality, SyncState, RLMThresholds } from '../types/rlm';
import {
  calculateBLER,
  determineSyncState,
  DEFAULT_THRESHOLDS,
} from '../utils/rlmCalculations';

interface UseRLMSimulatorProps {
  initialSNR?: number;
  thresholds?: RLMThresholds;
  simulationSpeed?: number; // ms between updates
}

interface UseRLMSimulatorReturn {
  // Current state
  snr_dB: number;
  bler: number;
  syncState: SyncState;
  history: SignalQuality[];
  
  // Simulation control
  isRunning: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
  
  // Manual control
  setSNR: (snr: number) => void;
  degradeSignal: (amount?: number) => void;
  improveSignal: (amount?: number) => void;
  
  // Threshold info
  thresholds: RLMThresholds;
  qOutLevel: number;
  qInLevel: number;
}

export function useRLMSimulator({
  initialSNR = -5,
  thresholds = DEFAULT_THRESHOLDS,
  simulationSpeed = 100,
}: UseRLMSimulatorProps = {}): UseRLMSimulatorReturn {
  const [snr_dB, setSnr_dB] = useState(initialSNR);
  const [history, setHistory] = useState<SignalQuality[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const historyLimit = 100;

  // Calculate derived values
  const bler = calculateBLER(snr_dB);
  const syncState = determineSyncState(bler);

  // Add current state to history
  useEffect(() => {
    setHistory(prev => {
      const newEntry: SignalQuality = {
        snr_dB,
        rsrp_dBm: snr_dB - 100, // Approximate conversion
        bler_percent: bler * 100,
        timestamp: Date.now(),
      };
      const newHistory = [...prev, newEntry];
      if (newHistory.length > historyLimit) {
        return newHistory.slice(-historyLimit);
      }
      return newHistory;
    });
  }, [snr_dB, bler]);

  // Start automatic signal degradation simulation
  const startSimulation = useCallback(() => {
    if (intervalRef.current) return;
    
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSnr_dB(prev => {
        // Random walk with slight degradation bias
        const change = (Math.random() - 0.52) * 2;
        const newSNR = prev + change;
        return Math.max(-20, Math.min(10, newSNR));
      });
    }, simulationSpeed);
  }, [simulationSpeed]);

  const stopSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const resetSimulation = useCallback(() => {
    stopSimulation();
    setSnr_dB(initialSNR);
    setHistory([]);
  }, [initialSNR, stopSimulation]);

  const setSNR = useCallback((snr: number) => {
    setSnr_dB(Math.max(-20, Math.min(10, snr)));
  }, []);

  const degradeSignal = useCallback((amount: number = 2) => {
    setSnr_dB(prev => Math.max(-20, prev - amount));
  }, []);

  const improveSignal = useCallback((amount: number = 2) => {
    setSnr_dB(prev => Math.min(10, prev + amount));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    snr_dB,
    bler,
    syncState,
    history,
    isRunning,
    startSimulation,
    stopSimulation,
    resetSimulation,
    setSNR,
    degradeSignal,
    improveSignal,
    thresholds,
    qOutLevel: thresholds.qOut_dB,
    qInLevel: thresholds.qIn_dB,
  };
}
