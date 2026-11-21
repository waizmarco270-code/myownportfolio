'use client';

import { motion } from 'motion/react';
import { Heart, Github, Linkedin, Twitter, ArrowUp } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-20 bg-neutral-950 border-t border-white/5 relative overflow-hidden">
      {/* Decorative backdrop */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[var(--brand-primary)]/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[var(--brand-primary)] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                W
              </div>
              <span className="font-display font-bold text-xl tracking-tight">waizmarco</span>
            </Link>
            <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
              Crafting digital excellence through elemental engineering and artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 underline decoration-[var(--brand-primary)] decoration-2 underline-offset-4">Navigation</span>
               <a href="#about" className="text-sm text-neutral-400 hover:text-white transition-colors">About</a>
               <a href="#projects" className="text-sm text-neutral-400 hover:text-white transition-colors">Projects</a>
               <a href="#skills" className="text-sm text-neutral-400 hover:text-white transition-colors">Skills</a>
            </div>
            <div className="flex flex-col gap-4">
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 underline decoration-[var(--brand-primary)] decoration-2 underline-offset-4">Connect</span>
               <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">GitHub</a>
               <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">LinkedIn</a>
               <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Twitter</a>
            </div>
            <div className="hidden sm:flex flex-col gap-4">
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 underline decoration-[var(--brand-primary)] decoration-2 underline-offset-4">Legal</span>
               <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Privacy</a>
               <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="text-neutral-600 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
             © {currentYear} waizmarco / EmityGate. Built with <Heart size={10} className="text-[var(--brand-primary)] fill-[var(--brand-primary)]" /> and Next.js 15.
           </div>

           <button 
             onClick={scrollToTop}
             className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors group"
           >
             Back to Top
             <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
           </button>
        </div>
      </div>
    </footer>
  );
}
