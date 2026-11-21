'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, Flame, Zap, Droplets, Wind, Mountain, Snowflake } from 'lucide-react';
import { useTheme, ElementType } from '@/lib/theme-context';

const elements: { type: ElementType; label: string; icon: any }[] = [
  { type: 'fire', label: 'Fire', icon: Flame },
  { type: 'thunder', label: 'Thunder', icon: Zap },
  { type: 'water', label: 'Water', icon: Droplets },
  { type: 'wind', label: 'Wind', icon: Wind },
  { type: 'earth', label: 'Earth', icon: Mountain },
  { type: 'ice', label: 'Ice', icon: Snowflake },
];

export default function ThemeSwitcher() {
  const { element, setElement } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  // Trigger flash effect when element changes, avoiding synchronous state update in render
  useEffect(() => {
    // We use a separate effect to trigger the flash
    setShowFlash(true);
    const timer = setTimeout(() => setShowFlash(false), 800);
    return () => clearTimeout(timer);
  }, [element]);

  return (
    <>
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ backgroundColor: 'var(--brand-primary)' }}
            className="fixed inset-0 z-[100] pointer-events-none mix-blend-screen opacity-20"
          />
        )}
      </AnimatePresence>

      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
        <div className="relative flex flex-col items-center gap-4">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-white border-[var(--brand-primary)]/20 shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[var(--brand-primary)]/10 group-hover:bg-[var(--brand-primary)]/20 transition-colors" />
            <Settings2 className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-3"
              >
                {elements.map((item) => (
                  <motion.button
                    key={item.type}
                    onClick={() => setElement(item.type)}
                    whileHover={{ scale: 1.1, x: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative group ${
                      element === item.type 
                        ? 'bg-neutral-800 border-2 border-[var(--brand-primary)] shadow-[0_0_15px_var(--brand-glow)]' 
                        : 'glass border-white/5 opacity-60 hover:opacity-100'
                    }`}
                    title={item.label}
                  >
                    <item.icon 
                      size={18} 
                      style={{ color: element === item.type ? 'var(--brand-primary)' : 'white' }}
                      className="z-10"
                    />
                    {element === item.type && (
                      <motion.div
                        layoutId="active-bg"
                        className="absolute inset-0 bg-[var(--brand-primary)]/10 rounded-full -z-10"
                      />
                    )}
                    
                    <div className="absolute left-14 px-2 py-1 rounded bg-neutral-900 border border-white/10 text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                      {item.label}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
