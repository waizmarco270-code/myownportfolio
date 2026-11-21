'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Sparkles, Target, Zap } from 'lucide-react';
import Image from 'next/image';

export default function About() {
  const [imgError, setImgError] = useState(false);
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[var(--brand-primary)]" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[var(--brand-primary)]" />
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/20 to-transparent rounded-3xl" />
              
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                 <Image
                    src={imgError ? "https://picsum.photos/seed/waiz/600/600" : "/logo.png"}
                    alt="Waiz Monazzum"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    onError={() => setImgError(true)}
                    referrerPolicy="no-referrer"
                 />
              </div>

              {/* Stats Overlay */}
              <div className="absolute -right-8 bottom-12 glass p-4 rounded-2xl shadow-xl hidden md:block">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500">
                      <Zap size={20} />
                   </div>
                   <div>
                     <div className="text-xl font-bold">50+</div>
                     <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Projects Done</div>
                   </div>
                 </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] text-[10px] font-bold uppercase tracking-widest mb-6">
              <User size={12} />
              Identity
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
              Architecting the <br />
              <span className="text-gradient-red">Future Context</span>
            </h2>
            <div className="space-y-6 text-neutral-400 text-lg leading-relaxed">
              <p>
                I am <span className="text-white font-bold">Waiz Monazzum</span>, a developer who believes that engineering is the bridge between imagination and reality. My work resides at the intersection of technical excellence and artistic expression.
              </p>
              <p>
                With a deep specialization in the <span className="text-white font-bold">Next.js ecosystem</span> and <span className="text-white font-bold">Generative AI</span>, I build applications that are not just functional, but legendary in their performance and user experience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12">
               {[
                 { icon: Target, title: 'Mission', desc: 'Crafting high-impact digital products.' },
                 { icon: Sparkles, title: 'Vision', desc: 'Democratizing AI through seamless UI.' },
               ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                   <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center shrink-0">
                     <item.icon size={20} className="text-[var(--brand-primary)]" />
                   </div>
                   <div>
                     <h4 className="font-bold text-white mb-1">{item.title}</h4>
                     <p className="text-xs text-neutral-500 leading-tight">{item.desc}</p>
                   </div>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
