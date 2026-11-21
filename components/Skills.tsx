'use client';

import { motion } from 'motion/react';
import { Code2, Database, Cpu, CreditCard, Sparkles } from 'lucide-react';

const skillCategories = [
  {
    title: 'Frontend Mastery',
    icon: <Code2 className="text-[var(--brand-primary)]" />,
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
  },
  {
    title: 'Backend & Cloud',
    icon: <Database className="text-[var(--brand-primary)]" />,
    skills: ['Node.js', 'Firebase', 'PostgreSQL', 'Redis', 'Cloudflare Workers', 'Serverless'],
  },
  {
    title: 'Architecture',
    icon: <Cpu className="text-[var(--brand-primary)]" />,
    skills: ['SaaS Architecture', 'PWA', 'Push Notifications', 'Real-time Sync', 'SEO Optimization'],
  },
  {
    title: 'Integrations',
    icon: <CreditCard className="text-[var(--brand-primary)]" />,
    skills: ['Stripe', 'Clerk Auth', 'Firebase Auth', 'Gemini API', 'OpenAI', 'WhatsApp API'],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 bg-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles size={12} />
            Capability Matrix
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Technical <span className="text-[var(--brand-primary)]">Arsenal</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A comprehensive stack focused on performance, scalability, and modern user experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-neutral-900 border border-white/5 hover:border-[var(--brand-primary)]/20 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--brand-primary)]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold mb-6 text-white">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-neutral-400 hover:text-white hover:bg-[var(--brand-primary)]/20 hover:border-[var(--brand-primary)]/30 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Proficiency Gauge */}
        <div className="mt-16 p-8 rounded-3xl bg-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h4 className="text-lg font-bold mb-2 text-white">Full Stack Proficiency</h4>
            <p className="text-neutral-500 text-sm">End-to-end development from database schema to pixel-perfect UI.</p>
          </div>
          <div className="flex-1 w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '95%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] shadow-[0_0_20px_var(--brand-glow)]"
            />
          </div>
          <span className="text-[var(--brand-primary)] font-bold font-mono">95%</span>
        </div>
      </div>
    </section>
  );
}
