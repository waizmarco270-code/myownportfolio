'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, Github, Sparkles, Layout, ChevronLeft, ChevronRight, 
  Monitor, Code2, Terminal, Check, Copy, Maximize2, Sparkle, Globe, ArrowUpRight
} from 'lucide-react';
import Image from 'next/image';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';

const CHRONO_STANDBY_PROJECTS = [
  {
    title: 'MindMate SaaS Platform',
    category: 'SaaS / Wellness',
    description: 'A premium mental wellness platform managing real-time therapeutic routines, immersive audio loops, and sub-second progress sync.',
    link: 'https://mindmate.emitygate.com',
    logoBase64: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    tech: ['Next.js', 'Firebase', 'Tailwind', 'Web Audio'],
    features: ['10K+ Monthly Active', 'Sub-second Data Sync', 'Responsive UI', 'Ambient Soundscapes'],
    theme: 'aurora',
    order: 0
  },
  {
    title: 'EmityGate Core Portal',
    category: 'Corporate / Web3',
    description: 'Corporate headquarters portal orchestrating distributed cloud micro-services, secure client portals, and responsive brand assets.',
    link: 'https://www.emitygate.com',
    logoBase64: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
    tech: ['Next.js', 'TypeScript', 'Framer Motion', 'D3.js'],
    features: ['Enterprise Security', 'Custom Design System', '100% Core Web Vitals', 'Modular API Gateway'],
    theme: 'gold',
    order: 1
  },
  {
    title: 'Marco AI Operating System',
    category: 'AI / OS Engine',
    description: 'Immersive experimental cloud desktop mimicking native Operating Systems, powered by lightweight window layers and responsive system loops.',
    link: 'https://aios.emitygate.com',
    logoBase64: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    tech: ['React', 'Drizzle', 'Three.js', 'WebSockets'],
    features: ['Multi-Window Orchestrator', 'Low Latency State', 'Hardware Accelerated 3D', 'Client-run VM Sandbox'],
    theme: 'cyberpunk',
    order: 2
  },
  {
    title: 'Marco Omnichannel Assistant',
    category: 'Automation / Utility',
    description: 'High-speed automated workflow assistant designed to aggregate global calendar items, contact schemas, and client notification loops.',
    link: 'https://assistant.emitygate.com',
    logoBase64: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800&auto=format&fit=crop&q=80',
    tech: ['TypeScript', 'Firebase Auth', 'GraphQL', 'Stripe'],
    features: ['Automated CRON Tasks', 'Secure Stripe Integration', 'Dynamic Form Schemas', 'Push Notification Hub'],
    theme: 'void',
    order: 3
  },
  {
    title: 'NoteGate High-Performance Editor',
    category: 'Productivity / Editor',
    description: 'A hyper-fast local-first markdown note workspace powered by custom virtualization engines and offline syncing logic.',
    link: 'https://notegate.emitygate.com',
    logoBase64: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&auto=format&fit=crop&q=80',
    tech: ['Next.js', 'Redis', 'Web Workers', 'CRDTs'],
    features: ['Instant Startup Time', 'Responsive Live Preview', 'Optimistic State Updates', 'Robust Conflict Resolution'],
    theme: 'nebula',
    order: 4
  }
];

interface Project {
  id?: string;
  title: string;
  category: string;
  description: string;
  link: string;
  logoBase64: string;
  tech: string[];
  features: string[];
  theme: string;
  order: number;
}

const THEME_PRESETS: Record<string, { label: string; grad: string; text: string; glow: string; textHex: string }> = {
  cyberpunk: { 
    label: 'Cyberpunk', 
    grad: 'from-pink-500/20 via-fuchsia-600/10 to-blue-500/20 border-fuchsia-500/40', 
    text: 'text-fuchsia-400', 
    glow: 'shadow-[0_0_60px_rgba(217,70,239,0.2)]',
    textHex: '#D946EF'
  },
  aurora: { 
    label: 'Aurora Neon', 
    grad: 'from-emerald-500/20 via-teal-600/10 to-purple-500/20 border-emerald-500/40', 
    text: 'text-emerald-400', 
    glow: 'shadow-[0_0_60px_rgba(16,185,129,0.2)]',
    textHex: '#10B981'
  },
  gold: { 
    label: 'Royal Gold', 
    grad: 'from-amber-500/20 via-yellow-600/10 to-orange-700/20 border-amber-500/40', 
    text: 'text-amber-400', 
    glow: 'shadow-[0_0_60px_rgba(245,158,11,0.2)]',
    textHex: '#F59E0B'
  },
  void: { 
    label: 'Deep Void', 
    grad: 'from-neutral-800/30 via-neutral-900/20 to-black border-neutral-700/40', 
    text: 'text-neutral-400', 
    glow: 'shadow-[0_0_60px_rgba(255,255,255,0.06)]',
    textHex: '#A3A3A3'
  },
  nebula: { 
    label: 'Cosmic Nebula', 
    grad: 'from-indigo-500/20 via-purple-600/10 to-pink-500/20 border-purple-500/40', 
    text: 'text-purple-400', 
    glow: 'shadow-[0_0_60px_rgba(168,85,247,0.2)]',
    textHex: '#A855F7'
  },
  ocean: { 
    label: 'Deep Ocean', 
    grad: 'from-blue-500/20 via-sky-600/10 to-cyan-500/20 border-blue-500/40', 
    text: 'text-blue-400', 
    glow: 'shadow-[0_0_60px_rgba(59,130,246,0.2)]',
    textHex: '#3B82F6'
  },
  lava: { 
    label: 'Volcanic Lava', 
    grad: 'from-red-600/20 via-orange-600/10 to-yellow-500/20 border-red-500/40', 
    text: 'text-red-400', 
    glow: 'shadow-[0_0_60px_rgba(239,68,68,0.2)]',
    textHex: '#EF4444'
  },
  forest: { 
    label: 'Emerald Forest', 
    grad: 'from-green-600/20 via-emerald-700/10 to-teal-800/20 border-green-500/40', 
    text: 'text-green-400', 
    glow: 'shadow-[0_0_60px_rgba(34,197,94,0.2)]',
    textHex: '#22C55E'
  }
};

export default function Projects() {
  const [projectsList, setProjectsList] = useState<Project[]>(CHRONO_STANDBY_PROJECTS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'live' | 'site' | 'code'>('live');
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const autoSlideTimer = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Read projects from Firestore with clean realtime update support which keeps the dev panel working
  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const loadedProjects = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || '',
            category: data.category || '',
            description: data.description || '',
            link: data.link || '#',
            logoBase64: data.logoBase64 || 'https://picsum.photos/seed/placeholder/800/600',
            tech: Array.isArray(data.tech) ? data.tech : [],
            features: Array.isArray(data.features) ? data.features : [],
            theme: data.theme || 'cyberpunk',
            order: data.order || 0
          } as Project;
        });
        setProjectsList(loadedProjects);
      } else {
        setProjectsList(CHRONO_STANDBY_PROJECTS);
      }
    }, (error) => {
      console.warn('Realtime subscription fallback to default projects:', error);
      setProjectsList(CHRONO_STANDBY_PROJECTS);
    });

    return () => unsubscribe();
  }, []);

  // Filter project categories
  const categories = ['All', 'SaaS', 'AI', 'Corporation', 'Productivity'];
  
  const getCategorizedProjects = () => {
    if (activeCategory === 'All') return projectsList;
    return projectsList.filter(p => {
      const catLower = p.category?.toLowerCase() || '';
      const titleLower = p.title.toLowerCase();
      const descLower = p.description.toLowerCase();
      const searchStr = `${catLower} ${titleLower} ${descLower}`;
      
      if (activeCategory === 'SaaS') return searchStr.includes('saas') || searchStr.includes('wellness');
      if (activeCategory === 'AI') return searchStr.includes('ai') || searchStr.includes('os');
      if (activeCategory === 'Corporation') return searchStr.includes('corporate') || searchStr.includes('portal') || searchStr.includes('company');
      if (activeCategory === 'Productivity') return searchStr.includes('editor') || searchStr.includes('note') || searchStr.includes('workspace');
      return true;
    });
  };

  const filteredProjects = getCategorizedProjects();
  const currentActiveProject = filteredProjects[activeIndex] || filteredProjects[0] || projectsList[0];

  // Auto-slide trigger in 5 seconds
  const startAutoSlide = () => {
    if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
    autoSlideTimer.current = setInterval(() => {
      if (!isHoveredRef.current) {
        handleNextSlide();
      }
    }, 5000);
  };

  const resetAutoSlide = () => {
    startAutoSlide();
  };

  useEffect(() => {
    if (filteredProjects.length > 0) {
      if (activeIndex >= filteredProjects.length) {
        setActiveIndex(0);
      }
      startAutoSlide();
    }
    return () => {
      if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
    };
  }, [filteredProjects, activeIndex]);

  const handleNextSlide = () => {
    setActiveIndex((prev) => (filteredProjects.length > 0 ? (prev + 1) % filteredProjects.length : 0));
  };

  const handlePrevSlide = () => {
    setActiveIndex((prev) => (filteredProjects.length > 0 ? (prev - 1 + filteredProjects.length) % filteredProjects.length : 0));
  };

  const selectSlide = (index: number) => {
    setActiveIndex(index);
    resetAutoSlide();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const activePreset = THEME_PRESETS[currentActiveProject?.theme] || THEME_PRESETS.cyberpunk;

  // Render a simulated live iframe view based on project attributes
  const renderWebsiteMockup = (proj: Project) => {
    const pPreset = THEME_PRESETS[proj.theme] || THEME_PRESETS.cyberpunk;
    return (
      <div className="w-full h-full relative overflow-hidden flex flex-col bg-[#0b0c10] select-none text-left">
        {/* Browser Header Bar */}
        <div className="bg-[#121319] border-b border-white/5 px-4 py-3 flex items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:opacity-85 transition-opacity" onClick={() => setIsMaximized(false)} />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500 cursor-pointer" onClick={() => setIsMaximized(true)} />
          </div>
          {/* Dynamic Link URL with click-to-copy trigger */}
          <div 
            onClick={() => copyToClipboard(proj.link)}
            className="flex-1 max-w-xl mx-auto bg-black/40 border border-white/5 rounded-lg px-3 py-1 flex items-center justify-between text-[11px] font-mono text-neutral-400 hover:text-white cursor-pointer hover:border-white/10 transition-all select-none"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Globe size={11} className={`${pPreset.text}`} />
              <span className="truncate">{proj.link}</span>
            </div>
            <div className="text-[10px] text-neutral-500 hover:text-[var(--brand-primary)] shrink-0 flex items-center gap-1">
              {copiedUrl === proj.link ? (
                <span className="text-green-400 flex items-center gap-1 font-sans">
                  <Check size={10} className="animate-pulse" /> Copied!
                </span>
              ) : (
                <>
                  <Copy size={10} />
                  <span>Copy</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-neutral-400 bg-neutral-900/60 p-1 border border-white/5 rounded-xl shrink-0">
            <button 
              type="button"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all cursor-pointer ${previewMode === 'live' ? 'text-white bg-[var(--brand-primary)]/15 border border-[var(--brand-primary)]/30 scale-[1.02]' : 'hover:text-white hover:bg-white/5 border border-transparent'}`} 
              onClick={() => setPreviewMode('live')} 
              title="Live Website Sandbox"
              style={previewMode === 'live' ? { borderColor: 'rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.15)' } : {}}
            >
              <Globe size={11} className={`${previewMode === 'live' ? pPreset.text : ''}`} />
              <span>Live Site</span>
            </button>
            <button 
              type="button"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all cursor-pointer ${previewMode === 'site' ? 'text-white bg-white/10 border border-white/10' : 'hover:text-white hover:bg-white/5 border border-transparent'}`} 
              onClick={() => setPreviewMode('site')} 
              title="Interactive Dashboard Blueprint"
            >
              <Layout size={11} />
              <span>Mock UI</span>
            </button>
            <button 
              type="button"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all cursor-pointer ${previewMode === 'code' ? 'text-white bg-white/10 border border-white/10' : 'hover:text-white hover:bg-white/5 border border-transparent'}`} 
              onClick={() => setPreviewMode('code')} 
              title="Technical Specifications"
            >
              <Code2 size={11} />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Browser Canvas Content Area */}
        <div className={`flex-1 w-full relative ${previewMode === 'live' ? 'p-0 overflow-hidden' : 'p-6 overflow-y-auto overflow-x-hidden'} text-white transition-all duration-300 bg-radial from-[#121319] via-[#090a0f] to-[#040507]`}>
          {previewMode === 'live' ? (
            <div className="w-full h-full bg-[#040507] relative group/frame">
              <iframe 
                src={proj.link} 
                className="w-full h-full border-0 absolute inset-0"
                title={`${proj.title} Live Preview`}
                referrerPolicy="no-referrer"
                sandbox="allow-same-origin allow-scripts allow-popups"
              />
              <div className="absolute inset-0 bg-transparent pointer-events-none group-hover/frame:bg-black/5 transition-colors duration-300" />
            </div>
          ) : previewMode === 'site' ? (
            <div className="w-full h-full flex flex-col justify-between relative min-h-[300px]">
              {/* Visual Ambient Element Gradients matching theme */}
              <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[80px] bg-gradient-to-br ${pPreset.grad} opacity-40`} />
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-32 rounded-full blur-[100px] bg-white/5 opacity-20" />

              {/* Pseudo App Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-gradient-to-br ${pPreset.grad}`}>
                    {proj.title.charAt(0)}
                  </div>
                  <span className="font-display font-bold text-xs tracking-wide uppercase">{proj.title.split(' ')[0]}</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono border border-white/10 bg-white/5 text-neutral-400">v3.5 Live</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 font-bold uppercase`}>Active</span>
                </div>
              </div>

              {/* Main Banner Visual */}
              <div className="my-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="inline-flex gap-1 items-center px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-neutral-300 font-mono">
                    <Sparkles size={10} className={`${pPreset.text}`} />
                    <span>Next-Gen Cloud Orchestrator</span>
                  </div>
                  <h1 className="text-xl md:text-3xl font-display font-black tracking-tight leading-none">
                    Igniting Ultimate <span className={`bg-gradient-to-r bg-clip-text text-transparent ${proj.theme === 'cyberpunk' ? 'from-pink-400 to-blue-500' : proj.theme === 'aurora' ? 'from-emerald-400 to-indigo-500' : 'from-amber-400 to-orange-500'}`}>{proj.title}</span> Experience.
                  </h1>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">{proj.description}</p>
                  
                  {/* Dynamic Indicators matching user preview */}
                  <div className="flex items-center gap-4 pt-2">
                    <button className={`px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wide bg-white text-black hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-1 cursor-pointer`} onClick={() => window.open(proj.link, '_blank', 'noreferrer')}>
                      Launch Sandbox <ArrowUpRight size={11} className="stroke-[3]" />
                    </button>
                    <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                      Ready to Run
                    </span>
                  </div>
                </div>

                {/* Left side graphical mockup cards container */}
                <div className="relative h-44 rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-[#111218]/90">
                  <Image 
                    src={proj.logoBase64} 
                    alt={proj.title}
                    fill
                    className="object-cover opacity-85 hover:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3 flex flex-col justify-end text-left select-none">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-400">{proj.category}</span>
                    <h3 className="text-xs font-bold font-display text-white truncate">{proj.title}</h3>
                  </div>
                </div>
              </div>

              {/* Features Bottom Grid Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-white/5 pt-4">
                {proj.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1 text-left">
                    <span className="text-[9px] text-neutral-500 font-medium font-mono uppercase tracking-widest">Key Metric 0{i+1}</span>
                    <span className="text-[11px] font-bold text-neutral-200 line-clamp-1">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Technical Shell Preview Mode (Idea 1) */
            <div className="w-full h-full font-mono text-xs text-left leading-relaxed text-neutral-300 min-h-[300px]">
              <div className="flex items-center justify-between text-[11px] text-neutral-500 pb-3 border-b border-white/5 mb-4 font-mono">
                <div className="flex items-center gap-1.5">
                  <Terminal size={12} className={`${pPreset.text}`} />
                  <span>MARCO_SHELL v5.0_STABLE</span>
                </div>
                <span>REST_API OK</span>
              </div>
              <div className="space-y-2 p-1 font-mono text-[11px]">
                <p className="text-green-400">$ fetch_spec --target {proj.title.toLowerCase().replace(/[^a-z]/g, '')}</p>
                <div className="pl-4 py-2 border-l border-white/5 my-2 space-y-1">
                  <p><span className="text-neutral-500">{"{"}</span></p>
                  <p>&nbsp;&nbsp;<span className="text-blue-400">&quot;title&quot;</span>: <span className={`${pPreset.text}`}>&quot;{proj.title}&quot;</span>,</p>
                  <p>&nbsp;&nbsp;<span className="text-blue-400">&quot;category&quot;</span>: <span className="text-amber-300">&quot;{proj.category || 'Web Application'}&quot;</span>,</p>
                  <p>&nbsp;&nbsp;<span className="text-blue-400">&quot;active_url&quot;</span>: <span className="text-green-300">&quot;{proj.link}&quot;</span>,</p>
                  <p>&nbsp;&nbsp;<span className="text-blue-400">&quot;theme_palette&quot;</span>: <span className="text-orange-400">&quot;{proj.theme}&quot;</span>,</p>
                  <p>&nbsp;&nbsp;<span className="text-blue-400">&quot;stack&quot;</span>: <span className="text-purple-300">[ {proj.tech.map(t => `"${t}"`).join(', ')} ]</span>,</p>
                  <p>&nbsp;&nbsp;<span className="text-blue-400">&quot;architecture&quot;</span>: <span className="text-neutral-400">&quot;Next.js App Server + Firestore DB&quot;</span>,</p>
                  <p>&nbsp;&nbsp;<span className="text-blue-400">&quot;authorizations&quot;</span>: <span className="text-red-400">&quot;Secure RBAC Admin Guard&quot;</span></p>
                  <p><span className="text-neutral-500">{"}"}</span></p>
                </div>
                <p className="text-green-400">$ ping_analytics --sub_host {proj.link.replace('https://', '')}</p>
                <p className="text-neutral-400">⚡ COMPILING CORE METRICS... 100% OK.</p>
                <p className="text-neutral-500">// Features registered for dynamic carousel synchronization:</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {proj.tech.map(t => (
                    <span key={t} className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono border ${pPreset.grad}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Drag hander (Idea 4 - Swipe gesture recognition)
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 100;
    if (info.offset.x < -swipeThreshold) {
      handleNextSlide();
      resetAutoSlide();
    } else if (info.offset.x > swipeThreshold) {
      handlePrevSlide();
      resetAutoSlide();
    }
    setDragOffset(0);
  };

  return (
    <section id="projects" className="py-28 relative overflow-hidden bg-neutral-950">
      
      {/* Immersive background aura mapping to project theme context (Idea 4) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[160px] bg-gradient-to-tr ${activePreset.grad} opacity-15 transition-all duration-1000`} />
        {/* Abstract glowing starry dots */}
        <div className="absolute top-12 left-1/4 w-1 h-1 bg-white opacity-40 rounded-full animate-pulse" />
        <div className="absolute bottom-24 right-1/3 w-1 h-1 bg-white opacity-30 rounded-full animate-ping" />
        <div className="absolute bottom-1/2 right-12 w-1.5 h-1.5 bg-white/20 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Subtitle center-heading consistent with modern designs */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[10px] font-mono tracking-widest uppercase text-neutral-400`}
          >
            <Layout size={11} className={`${activePreset.text}`} />
            <span>Interactive Live Grid</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block shrink-0" />
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-tight">
            My <span className={`bg-gradient-to-r bg-clip-text text-transparent ${currentActiveProject?.theme === 'cyberpunk' ? 'from-fuchsia-400 via-pink-500 to-blue-500' : 'from-amber-400 to-orange-400'}`}>Work</span>
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            A dynamic, live portfolio of high-performance websites and automated solutions. Use the active mockup to test features or explore code directly.
          </p>

          {/* Interactive Categories Badged Filter (Idea 5) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => {
              const count = cat === 'All' ? projectsList.length : projectsList.filter(p => {
                const catLower = p.category?.toLowerCase() || '';
                const titleLower = p.title.toLowerCase();
                const descLower = p.description.toLowerCase();
                const str = `${catLower} ${titleLower} ${descLower}`;
                if (cat === 'SaaS') return str.includes('saas') || str.includes('wellness');
                if (cat === 'AI') return str.includes('ai') || str.includes('os');
                if (cat === 'Corporation') return str.includes('corporate') || str.includes('portal');
                if (cat === 'Productivity') return str.includes('editor') || str.includes('note');
                return false;
              }).length;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveIndex(0);
                    resetAutoSlide();
                  }}
                  className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-white border-white text-black'
                      : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                  <span className={`px-1.5 py-0.1 ml-0.5 rounded-full text-[9px] font-mono font-bold ${
                    activeCategory === cat ? 'bg-black text-white' : 'bg-white/10 text-neutral-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="py-12 text-center rounded-3xl bg-neutral-900 border border-white/5">
            <p className="text-sm text-neutral-400 font-mono">No projects matched this filter.</p>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* The 3D Layered Carousel Structure with hover-state pause controls */}
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-full max-w-4xl mx-auto h-[480px] flex items-center justify-center [perspective:1200px] select-none"
            >
              
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredProjects.map((project, index) => {
                  
                  // Compute carousel layout based on index distance from active index
                  let position = index - activeIndex;
                  
                  // Wrap index elements around
                  if (position < -1) {
                    if (position === - (filteredProjects.length - 1)) position = 1;
                    else position = -2;
                  }
                  if (position > 1) {
                    if (position === filteredProjects.length - 1) position = -1;
                    else position = 2;
                  }

                  // Skip rendering elements too far away to optimize render overhead
                  if (Math.abs(position) > 1) return null;

                  const isActive = position === 0;
                  const isLeft = position === -1;
                  const isRight = position === 1;

                  const themePreset = THEME_PRESETS[project.theme] || THEME_PRESETS.cyberpunk;

                  return (
                    <motion.div
                      key={project.id || project.title}
                      style={{
                        zIndex: isActive ? 15 : 5,
                        pointerEvents: isActive ? 'auto' : 'none'
                      }}
                      drag={isActive ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={handleDragEnd}
                      onDrag={(e, info) => setDragOffset(info.offset.x)}
                      initial={{
                        opacity: 0,
                        scale: 0.7,
                        x: isLeft ? -300 : isRight ? 300 : 0
                      }}
                      animate={{
                        opacity: isActive ? 1 : 0.35,
                        scale: isActive ? 1.05 : 0.8,
                        x: isLeft ? '-45%' : isRight ? '45%' : dragOffset,
                        rotateY: isLeft ? 15 : isRight ? -15 : dragOffset * 0.05,
                        filter: isActive ? 'blur(0px)' : 'blur(4px)',
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.7,
                        x: isLeft ? -300 : isRight ? 300 : 0
                      }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 300, 
                        damping: 25 
                      }}
                      className={`absolute w-full max-w-2xl h-[400px] rounded-3xl overflow-hidden border ${themePreset.grad} ${themePreset.glow} transition-colors backdrop-blur-xl duration-500`}
                    >
                      {/* Live preview dynamic component frame inside active card */}
                      {renderWebsiteMockup(project)}

                      {/* Cover click catcher for inactive sides */}
                      {!isActive && (
                        <div 
                          onClick={() => selectSlide(index)}
                          className="absolute inset-0 bg-transparent cursor-pointer z-40 pointer-events-auto"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Slider Floating Left Manual Override Anchor */}
              <button 
                onClick={handlePrevSlide}
                className="absolute left-6 md:-left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-white/5 hover:border-[var(--brand-primary)] hover:scale-110 active:scale-95 transition-all shadow-xl backdrop-blur-md z-40 cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Slider Floating Right Manual Override Anchor */}
              <button 
                onClick={handleNextSlide}
                className="absolute right-6 md:-right-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-white/5 hover:border-[var(--brand-primary)] hover:scale-110 active:scale-95 transition-all shadow-xl backdrop-blur-md z-40 cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Bottom details section for active project (Synchronized dynamic panel) */}
            <motion.div
              key={currentActiveProject?.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto text-center space-y-6 pt-4 border-t border-white/5"
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className={`px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono font-black uppercase tracking-widest ${activePreset.text}`}>
                  {currentActiveProject?.category || 'PRO PROJECT'}
                </span>
                
                {currentActiveProject?.tech.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] text-neutral-500 font-mono">#{tag}</span>
                ))}
              </div>

              <h3 className="text-3xl md:text-4xl font-display font-black text-white hover:text-[var(--brand-primary)] transition-colors">
                {currentActiveProject?.title}
              </h3>

              <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                {currentActiveProject?.description}
              </p>

              {/* Action Buttons list & slide counter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
                
                {/* Modern Index Pagination Indicator */}
                <div className="font-mono text-xs text-neutral-500 flex items-center gap-2">
                  <span className={`text-white font-black text-sm`}>
                    {(activeIndex + 1).toString().padStart(2, '0')}
                  </span>
                  <span>/</span>
                  <span>{filteredProjects.length.toString().padStart(2, '0')}</span>
                </div>

                {/* Primary Action Trigger Links */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => window.open(currentActiveProject?.link, '_blank', 'noreferrer')}
                    className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-white text-black hover:bg-neutral-100 hover:scale-105 transition-all shadow-lg flex items-center gap-2 cursor-pointer`}
                  >
                    Launch Live Site
                    <ExternalLink size={14} />
                  </button>

                  <button 
                    onClick={() => {
                      setPreviewMode(prev => {
                        if (prev === 'live') return 'site';
                        if (prev === 'site') return 'code';
                        return 'live';
                      });
                    }}
                    className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {previewMode === 'live' ? (
                      <>
                        <Layout size={14} className={`${activePreset.text}`} />
                        <span>Switch to Mock UI</span>
                      </>
                    ) : previewMode === 'site' ? (
                      <>
                        <Code2 size={14} className={`${activePreset.text}`} />
                        <span>Inspect JSON Specs</span>
                      </>
                    ) : (
                      <>
                        <Globe size={14} className={`${activePreset.text}`} />
                        <span>Show Live Site</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Immersive Full Screen Maximize Mode Lightbox (Idea 3) */}
      <AnimatePresence>
        {isMaximized && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[200] p-6 flex items-center justify-center"
          >
            <div className="relative w-full max-w-5xl h-[85vh] bg-[#0b0c10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col scale-100 animate-in fade-in zoom-in-95 duration-300">
              {/* Toolbar top */}
              <div className="bg-[#121319] border-b border-white/5 px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-500 cursor-pointer" onClick={() => setIsMaximized(false)} />
                  <span className="w-3.5 h-3.5 rounded-full bg-yellow-500" />
                  <span className="w-3.5 h-3.5 rounded-full bg-green-500" />
                </div>
                <div className="text-xs font-mono text-neutral-400 font-bold truncate">
                  {currentActiveProject?.title} IMMERSIVE SANDBOX
                </div>
                <button 
                  onClick={() => setIsMaximized(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white transition-all cursor-pointer"
                >
                  ESC Close
                </button>
              </div>

              {/* Live sandbox mockup inside lightbox */}
              <div className="flex-1 w-full overflow-y-auto">
                {renderWebsiteMockup(currentActiveProject)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
