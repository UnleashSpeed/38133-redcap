'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ContentMode = 'fun' | 'researcher' | 'spec';

interface ModeContextType {
  mode: ContentMode;
  setMode: (mode: ContentMode) => void;
  isFun: boolean;
  isResearcher: boolean;
  isSpec: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

const modeLabels: Record<ContentMode, string> = {
  fun: 'Fun Explorer',
  researcher: 'Researcher',
  spec: 'Spec Purist',
};

const modeDescriptions: Record<ContentMode, string> = {
  fun: 'Learn with cartoons, analogies, and fun examples',
  researcher: 'Clear explanations with technical depth',
  spec: 'Exact 3GPP specification tables and text',
};

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ContentMode>('researcher');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('redcap-mode') as ContentMode | null;
    if (savedMode && ['fun', 'researcher', 'spec'].includes(savedMode)) {
      setModeState(savedMode);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('redcap-mode', mode);
    }
  }, [mode, mounted]);

  const setMode = (newMode: ContentMode) => {
    setModeState(newMode);
  };

  const value: ModeContextType = {
    mode,
    setMode,
    isFun: mode === 'fun',
    isResearcher: mode === 'researcher',
    isSpec: mode === 'spec',
  };

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}

export { modeLabels, modeDescriptions };
export default ModeContext;
