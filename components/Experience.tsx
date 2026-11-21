'use client';

import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';

const experiences = [
  {
    company: 'Legendary Tech Solutions',
    role: 'Senior Full Stack Developer',
    period: '2022 - Present',
    location: 'Remote / Singapore',
    description: 'Leading development of enterprise-grade Next.js applications. Scaled system to support 100k+ concurrent users and integrated advanced AI agents.',
    bullets: ['Next.js 15 Migration', 'AI Integration', 'Architecture Lead'],
  },
  {
    company: 'Elemental Web Studio',
    role: 'Full Stack Engineer',
    period: '2020 - 2022',
    location: 'Lahore, Pakistan',
    description: 'Built high-conversion E-commerce platforms with custom 3D backgrounds and animations. Focused on Web Vitals and user engagement.',
    bullets: ['Performance Tuning', 'UI/UX Design', 'API Development'],
  },
  {
    company: 'Freelance AI Innovator',
    role: 'AI & Web Consultant',
    period: '2018 - 2020',
    location: 'Global',
    description: 'Developed custom AI models for content generation and automated developer workflows. Early adopter of GPT and Gemini technologies.',
    bullets: ['Prompt Engineering', 'Prototyping', 'Consultancy'],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            <Briefcase size={12} />
            Professional Journey
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Forged in <span className="text-[var(--brand-primary)]">Code</span>
          </h2>
        </div>

        <div className="space-y-12">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative pl-8 border-l border-white/10 group"
            >
              {/* Dot */}
              <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-neutral-800 border border-white/20 group-hover:bg-[var(--brand-primary)] group-hover:border-[var(--brand-primary)] transition-all duration-300 shadow-[0_0_0_4px_rgba(255,255,255,0.05)]" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-[var(--brand-primary)] transition-colors">
                  {exp.role}
                </h3>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {exp.period}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {exp.location}</span>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-lg font-display text-neutral-300 mb-2 block">{exp.company}</span>
                <p className="text-neutral-400 leading-relaxed max-w-2xl">
                  {exp.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {exp.bullets.map((bullet) => (
                  <span key={bullet} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-tighter text-neutral-500">
                    {bullet}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
