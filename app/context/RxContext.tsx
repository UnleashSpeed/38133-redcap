'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type RxMode = '1rx' | '2rx';

interface RxContextType {
  rxMode: RxMode;
  setRxMode: (mode: RxMode) => void;
  toggleRxMode: () => void;
  is1Rx: boolean;
  is2Rx: boolean;
}

const RxContext = createContext<RxContextType | undefined>(undefined);

const rxLabels: Record<RxMode, string> = {
  '1rx': '1Rx (Single Antenna)',
  '2rx': '2Rx (Dual Antenna)',
};

const rxDescriptions: Record<RxMode, string> = {
  '1rx': 'Single receive antenna - lower power, reduced performance',
  '2rx': 'Dual receive antennas - better performance, higher power',
};

export function RxProvider({ children }: { children: React.ReactNode }) {
  const [rxMode, setRxModeState] = useState<RxMode>('2rx');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedRxMode = localStorage.getItem('redcap-rx-mode') as RxMode | null;
    if (savedRxMode && ['1rx', '2rx'].includes(savedRxMode)) {
      setRxModeState(savedRxMode);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('redcap-rx-mode', rxMode);
    }
  }, [rxMode, mounted]);

  const setRxMode = (newMode: RxMode) => {
    setRxModeState(newMode);
  };

  const toggleRxMode = () => {
    setRxModeState((prev) => (prev === '1rx' ? '2rx' : '1rx'));
  };

  const value: RxContextType = {
    rxMode,
    setRxMode,
    toggleRxMode,
    is1Rx: rxMode === '1rx',
    is2Rx: rxMode === '2rx',
  };

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <RxContext.Provider value={value}>
      {children}
    </RxContext.Provider>
  );
}

export function useRx() {
  const context = useContext(RxContext);
  if (context === undefined) {
    throw new Error('useRx must be used within a RxProvider');
  }
  return context;
}

export { rxLabels, rxDescriptions };
export default RxContext;
