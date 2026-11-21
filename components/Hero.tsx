'use client';

import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Code, Terminal, Boxes } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

export default function Hero() {
  const { element } = useTheme();

  const elementContent = {
    fire: { title: 'Igniting', subtitle: 'Digital Experiences' },
    thunder: { title: 'Striking', subtitle: 'Modern Architecture' },
    water: { title: 'Flowing', subtitle: 'Seamless Interfaces' },
    wind: { title: 'Refreshing', subtitle: 'User Potential' },
    earth: { title: 'Building', subtitle: 'Solid Foundations' },
    ice: { title: 'Chilling', subtitle: 'Pixel Perfection' },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-4 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] text-xs font-bold uppercase tracking-widest mb-6">
            Full Stack Developer & AI Innovator
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-display font-bold leading-tight mb-8"
        >
          {elementContent[element].title} <br />
          <span className="text-gradient-red">{elementContent[element].subtitle}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Hi, I&apos;m <span className="text-white font-bold">Waiz Monazzum</span>. 
          I craft high-performance, legendary web application using Next.js, AI, and elemental design principles.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a
            href="#projects"
            className="w-full sm:w-auto px-8 py-4 bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[var(--brand-glow)]"
          >
            Explore My Work
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto px-8 py-4 glass hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Get In Touch
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { icon: Sparkles, label: 'AI Driven' },
            { icon: Code, label: 'Clean Code' },
            { icon: Terminal, label: 'Scalable' },
            { icon: Boxes, label: 'Full Stack' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-[var(--brand-primary)]/50 transition-all">
                <item.icon className="text-neutral-500 group-hover:text-[var(--brand-primary)] transition-colors" size={20} />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 group-hover:text-white transition-colors">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative background effects handled by parent Home component */}
    </section>
  );
}
