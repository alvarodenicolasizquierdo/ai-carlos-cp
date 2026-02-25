import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  resetDemo: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(() => 
    sessionStorage.getItem('carlos_demo_mode') === 'true'
  );

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode(prev => {
      const next = !prev;
      if (next) {
        sessionStorage.setItem('carlos_demo_mode', 'true');
      } else {
        sessionStorage.removeItem('carlos_demo_mode');
      }
      return next;
    });
  }, []);

  const resetDemo = useCallback(() => {
    window.location.href = '/';
  }, []);

  // Block internal keyboard shortcuts in demo mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isDemoMode) return;
      const combo = [
        e.ctrlKey && 'ctrl',
        e.shiftKey && 'shift',
        e.altKey && 'alt',
        e.key.toLowerCase(),
      ].filter(Boolean).join('+');
      const BLOCKED = ['ctrl+shift+d', 'ctrl+shift+i', 'ctrl+shift+a', 'ctrl+shift+p'];
      if (BLOCKED.includes(combo)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isDemoMode]);

  return (
    <DemoModeContext.Provider value={{ isDemoMode, toggleDemoMode, resetDemo }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}
