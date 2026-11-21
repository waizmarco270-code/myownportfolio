'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type ElementType = 'fire' | 'thunder' | 'water' | 'wind' | 'earth' | 'ice';

interface ThemeContextType {
  element: ElementType;
  setElement: (element: ElementType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [element, setElement] = useState<ElementType>('fire');

  useEffect(() => {
    const root = document.documentElement;
    const themes: Record<ElementType, { primary: string; secondary: string; glow: string }> = {
      fire: { primary: '#ef4444', secondary: '#f97316', glow: 'rgba(239, 68, 68, 0.5)' },
      thunder: { primary: '#facc15', secondary: '#eab308', glow: 'rgba(234, 179, 8, 0.5)' },
      water: { primary: '#3b82f6', secondary: '#60a5fa', glow: 'rgba(59, 130, 246, 0.5)' },
      wind: { primary: '#10b981', secondary: '#34d399', glow: 'rgba(16, 185, 129, 0.5)' },
      earth: { primary: '#d97706', secondary: '#fbbf24', glow: 'rgba(217, 119, 6, 0.5)' },
      ice: { primary: '#bae6fd', secondary: '#7dd3fc', glow: 'rgba(186, 230, 253, 0.5)' },
    };

    const currentTheme = themes[element];
    root.style.setProperty('--brand-primary', currentTheme.primary);
    root.style.setProperty('--brand-secondary', currentTheme.secondary);
    root.style.setProperty('--brand-glow', currentTheme.glow);
  }, [element]);

  return (
    <ThemeContext.Provider value={{ element, setElement }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
