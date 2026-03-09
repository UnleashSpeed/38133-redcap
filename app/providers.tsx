'use client';

import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ModeProvider } from './context/ModeContext';
import { RxProvider } from './context/RxContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <ModeProvider>
        <RxProvider>
          {children}
        </RxProvider>
      </ModeProvider>
    </ThemeProvider>
  );
}

export default Providers;
