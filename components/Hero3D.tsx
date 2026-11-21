'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { useTheme } from '@/lib/theme-context';
import { motion, AnimatePresence } from 'motion/react';

import FireBackground from './backgrounds/FireBackground';
import ThunderBackground from './backgrounds/ThunderBackground';
import WaterBackground from './backgrounds/WaterBackground';
import WindBackground from './backgrounds/WindBackground';
import EarthBackground from './backgrounds/EarthBackground';
import IceBackground from './backgrounds/IceBackground';

export default function Hero3D() {
  const { element } = useTheme();

  const renderBackground = () => {
    switch (element) {
      case 'fire': return <FireBackground />;
      case 'thunder': return <ThunderBackground />;
      case 'water': return <WaterBackground />;
      case 'wind': return <WindBackground />;
      case 'earth': return <EarthBackground />;
      case 'ice': return <IceBackground />;
      default: return <FireBackground />;
    }
  };

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-neutral-950" />
      
      <motion.div 
        key={element}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1 }}
        className="w-full h-full"
      >
        <Canvas eventPrefix="client" camera={{ position: [0, 0, 6], fov: 75 }}>
          <Suspense fallback={null}>
            {renderBackground()}
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/20 to-neutral-950 pointer-events-none" />
    </div>
  );
}
