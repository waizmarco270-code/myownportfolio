'use client';

import { motion, AnimatePresence } from 'motion/react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import AISection from '@/components/AISection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import DevPanel from '@/components/DevPanel';
import { useTheme } from '@/lib/theme-context';
import FireBackground from '@/components/backgrounds/FireBackground';
import ThunderBackground from '@/components/backgrounds/ThunderBackground';
import WaterBackground from '@/components/backgrounds/WaterBackground';
import WindBackground from '@/components/backgrounds/WindBackground';
import EarthBackground from '@/components/backgrounds/EarthBackground';
import IceBackground from '@/components/backgrounds/IceBackground';

export default function Home() {
  const { element } = useTheme();

  const backgrounds = {
    fire: <FireBackground />,
    thunder: <ThunderBackground />,
    water: <WaterBackground />,
    wind: <WindBackground />,
    earth: <EarthBackground />,
    ice: <IceBackground />,
  };

  return (
    <main className="relative">
      <Navbar />
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={element}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-full h-full"
          >
            {backgrounds[element]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <AISection />
        <Contact />
        <Footer />
        <DevPanel />
      </div>
    </main>
  );
}
