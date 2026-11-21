'use client';

import { motion } from 'motion/react';
import { Send, Mail, MapPin, Phone, Github, Linkedin, Twitter } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--brand-primary)]/5 blur-3xl -z-10" />
          
          <div className="flex flex-col lg:flex-row">
            {/* Left Side: Info */}
            <div className="lg:w-1/3 p-12 bg-white/5 border-r border-white/5">
              <h2 className="text-3xl font-display font-bold mb-8">Let&apos;s Build <br /> Something <span className="text-[var(--brand-primary)]">Legendary</span></h2>
              <p className="text-neutral-400 mb-12 text-sm leading-relaxed">
                Whether you have a specific project in mind or just want to explore possibilities, my inbox is always open for innovators.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@waizmarco.dev' },
                  { icon: MapPin, label: 'Location', value: 'Singapore / Remote' },
                  { icon: Phone, label: 'Communication', value: 'Legendary Sync Available' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center border border-white/5 group-hover:border-[var(--brand-primary)]/50 transition-all">
                      <item.icon size={18} className="text-neutral-500 group-hover:text-[var(--brand-primary)]" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">{item.label}</div>
                      <div className="text-sm font-medium text-white">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-12">
                {[Github, Linkedin, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[var(--brand-primary)] hover:text-white transition-all">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="lg:w-2/3 p-12">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 ml-2">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-[var(--brand-primary)]/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 ml-2">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-[var(--brand-primary)]/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 ml-2">Project Subject</label>
                  <input 
                    type="text" 
                    placeholder="E.g. AI-Powered Dashboard" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-[var(--brand-primary)]/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 ml-2">Message</label>
                  <textarea 
                    rows={6} 
                    placeholder="Tell me about your vision..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-[var(--brand-primary)]/50 transition-all resize-none"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-5 bg-[var(--brand-primary)] text-white font-bold rounded-2xl shadow-xl shadow-[var(--brand-glow)] hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
                >
                  Send Legendary Message
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
