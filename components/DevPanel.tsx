'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs,
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  setDoc,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Edit2, X, Upload, Loader2, Save, Database, 
  Sparkles, Settings, Layout, BarChart3, ArrowUp, ArrowDown,
  Globe, Github, Linkedin, Twitter, Mail
} from 'lucide-react';
import Image from 'next/image';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

const ADMIN_EMAIL = "waizmonazzum270@gmail.com";

const INITIAL_PROJECTS = [
  {
    title: 'MindMate',
    category: 'SaaS / Wellness',
    description: 'A SaaS-level mental wellness platform with 10,000+ active users.',
    link: 'https://mindmate.emitygate.com',
    logoBase64: 'https://picsum.photos/seed/mindmate/200/200',
    tech: ['Next.js', 'Firebase'],
    features: ['SaaS', '10K+ Users'],
    order: 0,
    theme: 'aurora'
  },
  {
    title: 'EmityGate',
    category: 'Corporate / Web3',
    description: 'The official platform for EmityGate digital ecosystems.',
    link: 'https://www.emitygate.com',
    logoBase64: 'https://picsum.photos/seed/emitygate/200/200',
    tech: ['Next.js', 'TypeScript'],
    features: ['Corporate', 'Performance'],
    order: 1,
    theme: 'gold'
  },
  {
    title: 'Marco AI OS',
    category: 'AI / OS Engine',
    description: 'An experimental AI-driven operating system interface.',
    link: 'https://aios.emitygate.com',
    logoBase64: 'https://picsum.photos/seed/aios/200/200',
    tech: ['Next.js', 'Gemini API'],
    features: ['AI Integration', '3D UI'],
    order: 2,
    theme: 'cyberpunk'
  },
  {
    title: 'Marco Assistant',
    category: 'Automation / Utility',
    description: 'A personalized AI assistant for intelligent responses.',
    link: 'https://assistant.emitygate.com',
    logoBase64: 'https://picsum.photos/seed/assistant/200/200',
    tech: ['TypeScript', 'Firebase'],
    features: ['Automation', 'Voice'],
    order: 3,
    theme: 'void'
  },
  {
    title: 'NoteGate',
    category: 'Productivity / Editor',
    description: 'High-performance note-taking application.',
    link: 'https://notegate.emitygate.com',
    logoBase64: 'https://picsum.photos/seed/notegate/200/200',
    tech: ['Next.js', 'Redis'],
    features: ['Real-time', 'Markdown'],
    order: 4,
    theme: 'nebula'
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
  order: number;
  theme: string;
}

interface SiteSettings {
  name: string;
  role: string;
  bio: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

const THEMES = [
  { id: 'cyberpunk', name: 'Cyberpunk', colors: 'from-fuchsia-600 to-blue-600' },
  { id: 'aurora', name: 'Aurora', colors: 'from-emerald-400 to-purple-600' },
  { id: 'gold', name: 'Royal Gold', colors: 'from-amber-400 to-yellow-700' },
  { id: 'void', name: 'Deep Void', colors: 'from-neutral-800 to-black' },
  { id: 'ocean', name: 'Deep Ocean', colors: 'from-blue-600 to-cyan-400' },
  { id: 'lava', name: 'Volcanic', colors: 'from-red-600 to-orange-500' },
  { id: 'forest', name: 'Emerald', colors: 'from-green-600 to-emerald-900' },
  { id: 'nebula', name: 'Cosmic', colors: 'from-indigo-600 to-pink-500' },
  { id: 'glass', name: 'Glassmorphism', colors: 'from-white/20 to-white/5' },
  { id: 'matrix', name: 'Matrix', colors: 'from-green-500 to-black' },
];

export default function DevPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'settings' | 'stats' | 'messages'>('projects');
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [settings, setSettings] = useState<SiteSettings & { effects?: any }>({
    name: 'Mohammed Waiz Monazzum',
    role: 'Full Stack Developer & Founder',
    bio: 'Architecting Scalable Digital Products. Engineering Real-World Excellence.',
    effects: {
      glowMode: true,
      glitchAccents: false,
      particleBackground: true
    }
  });
  const [isEditing, setIsEditing] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCheckingLinks, setIsCheckingLinks] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isBypassed, setIsBypassed] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const isAuthorized = user?.email === ADMIN_EMAIL || isBypassed;

  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '',
    category: '',
    description: '',
    link: '',
    logoBase64: '',
    tech: [],
    features: [],
    order: 0,
    theme: 'cyberpunk'
  });

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('open-dev-panel', handleToggle);
    return () => window.removeEventListener('open-dev-panel', handleToggle);
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user?.email !== ADMIN_EMAIL) {
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setProjects(projs);
        setIsLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'projects');
      });

      // Load Settings
      const loadSettings = async () => {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(prev => ({ ...prev, ...docSnap.data() }));
        }
      };
      loadSettings();

      // Load Messages
      const qMsg = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const unsubscribeMsg = onSnapshot(qMsg, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      return () => {
        unsubscribe();
        unsubscribeMsg();
      };
    }
  }, [user, isAuthorized]);

  const handleAiImprove = async () => {
    if (!formData.description && !formData.title) return;
    setIsAiLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Improve this project description for a professional portfolio. Keep it concise but impactful (max 2 sentences).
        Project Title: ${formData.title}
        Current Description: ${formData.description}`,
      });
      if (response.text) {
        setFormData(prev => ({ ...prev, description: response.text.trim() }));
        setStatus({ type: 'success', message: 'AI improved your description!' });
      }
    } catch (error) {
      console.error("AI Error:", error);
      setStatus({ type: 'error', message: 'AI failed to improve description.' });
    } finally {
      setIsAiLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleAiBio = async (style: 'professional' | 'creative' | 'minimalist') => {
    setIsAiLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Rewrite this portfolio bio in a ${style} style. Keep it under 150 characters.
        Current Bio: ${settings.bio}
        Role: ${settings.role}
        Name: ${settings.name}`,
      });
      if (response.text) {
        setSettings(prev => ({ ...prev, bio: response.text.trim() }));
        setStatus({ type: 'success', message: `Bio rewritten in ${style} style!` });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'AI failed to rewrite bio.' });
    } finally {
      setIsAiLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      setStatus({ type: 'success', message: 'Global settings updated successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update settings.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const index = projects.findIndex(p => p.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];

    const batch = writeBatch(db);
    newProjects.forEach((p, i) => {
      if (p.id) {
        batch.update(doc(db, 'projects', p.id), { order: i });
      }
    });
    await batch.commit();
  };

  const handleCheckLinks = async () => {
    setIsCheckingLinks(true);
    let brokenCount = 0;
    try {
      for (const proj of projects) {
        try {
          const res = await fetch(proj.link, { mode: 'no-cors' });
          // Note: no-cors won't give us status, but if it throws it's definitely broken
        } catch (e) {
          brokenCount++;
        }
      }
      setStatus({ 
        type: brokenCount > 0 ? 'error' : 'success', 
        message: brokenCount > 0 ? `Found ${brokenCount} potentially broken links.` : 'All links appear healthy!' 
      });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to check links.' });
    } finally {
      setIsCheckingLinks(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setStatus({ type: 'error', message: 'File is too large. Please select an image under 10MB.' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = document.createElement('img');
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions for logo
          const MAX_DIM = 800;
          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to WebP with 0.8 quality
          const compressedBase64 = canvas.toDataURL('image/webp', 0.8);
          
          if (compressedBase64.length > 900000) {
            setStatus({ type: 'error', message: 'Image is still too large after compression. Try a smaller image.' });
            return;
          }

          setFormData(prev => ({ ...prev, logoBase64: compressedBase64 }));
          setStatus({ type: 'success', message: 'Logo compressed successfully!' });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) return;

    setIsSaving(true);
    setStatus(null);

    // Final size check for Firestore 1MB limit
    const docSize = JSON.stringify(formData).length;
    if (docSize > 1000000) {
      setStatus({ type: 'error', message: 'Project data is too large (max 1MB). The logo has been compressed but is still too big. Try a smaller image.' });
      setIsSaving(false);
      return;
    }

    try {
      if (isEditing?.id) {
        await updateDoc(doc(db, 'projects', isEditing.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        setStatus({ type: 'success', message: 'Project updated successfully!' });
      } else {
        await addDoc(collection(db, 'projects'), {
          ...formData,
          createdAt: serverTimestamp(),
          order: projects.length
        });
        setStatus({ type: 'success', message: 'Project added successfully!' });
      }
      setFormData({
        title: '',
        category: '',
        description: '',
        link: '',
        logoBase64: '',
        tech: [],
        features: [],
        order: projects.length,
        theme: 'cyberpunk'
      });
      setIsEditing(null);
    } catch (error) {
      handleFirestoreError(error, isEditing ? OperationType.UPDATE : OperationType.CREATE, 'projects');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      setStatus({ type: 'success', message: 'Project deleted successfully.' });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  const seedProjects = async () => {
    console.log("Starting clean seedProjects...");
    setIsSaving(true);
    setStatus(null);
    try {
      // 1. Clear existing projects first
      const q = query(collection(db, 'projects'));
      const snapshot = await getDocs(q);
      console.log(`Deleting ${snapshot.size} existing projects...`);
      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'projects', d.id)));
      await Promise.all(deletePromises);

      // 2. Restore all 5 projects
      let count = 0;
      for (const proj of INITIAL_PROJECTS) {
        console.log(`Restoring: ${proj.title}`);
        await addDoc(collection(db, 'projects'), {
          ...proj,
          createdAt: serverTimestamp(),
          order: count
        });
        count++;
      }
      console.log(`Successfully restored ${count} projects.`);
      setStatus({ type: 'success', message: `Cleaned database and restored all ${count} projects successfully!` });
    } catch (error) {
      console.error("Seeding error details:", error);
      setStatus({ type: 'error', message: `Failed to restore: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsSaving(true);
    setStatus(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setStatus({ type: 'success', message: 'Signed in successfully!' });
    } catch (error: any) {
      console.error("Sign in error:", error);
      setStatus({ type: 'error', message: `Sign in failed: ${error.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    setIsSaving(true);
    setStatus(null);
    try {
      await signOut(auth);
      setStatus({ type: 'success', message: 'Signed out successfully.' });
    } catch (error: any) {
      console.error("Sign out error:", error);
      setStatus({ type: 'error', message: `Sign out failed: ${error.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-[100] bg-neutral-950/95 backdrop-blur-md flex items-center justify-center p-6">
        <div className="relative max-w-md w-full bg-neutral-900 border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center">
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="w-16 h-16 bg-brand-red/10 border border-brand-red/25 rounded-2xl flex items-center justify-center text-brand-red mb-6">
            <Settings size={32} className="text-[var(--brand-primary)]" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 font-display">Command Center</h2>
          <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
            Developer authorization is required to access the administrative control panel. Only authorized creators can make changes.
          </p>

          {status && (
            <div className={`w-full mb-6 p-4 rounded-xl text-xs font-medium text-left ${
              status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {status.message}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <Loader2 className="animate-spin text-brand-red" size={32} style={{ color: 'var(--brand-primary)' }} />
              <p className="text-xs text-neutral-500 font-medium">Verifying credentials...</p>
            </div>
          ) : (
            <div className="w-full space-y-6">
              {!user ? (
                <button
                  onClick={handleSignIn}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-3 bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[var(--brand-glow)] disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Database size={20} />}
                  Authorize with Google
                </button>
              ) : (
                <div className="p-4 bg-red-400/5 border border-red-500/15 rounded-2xl text-left">
                  <p className="text-xs text-neutral-500 mb-1 font-semibold uppercase tracking-wider">Authenticated As</p>
                  <p className="text-sm font-bold text-white truncate">{user.displayName || 'Visitor'}</p>
                  <p className="text-xs font-mono text-neutral-400 truncate mt-0.5">{user.email}</p>
                  <p className="text-red-400 text-xs font-semibold mt-3 flex items-center gap-1.5">
                    ⚠️ This account is unauthorized.
                  </p>
                </div>
              )}

              {/* Secure Developer Passcode Bypass Option (Perfect for iframe contexts!) */}
              <div className="border-t border-white/5 pt-6 text-left">
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-2.5">
                  Or bypass with Master&apos;s Developer PIN (iframe safe)
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Enter Secret Developer PIN..."
                    value={pinValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPinValue(val);
                      if (val.toLowerCase() === 'waiz' || val === '2026') {
                        setIsBypassed(true);
                        setStatus({ type: 'success', message: 'Authorized as Master Creator!' });
                        setTimeout(() => setStatus(null), 3000);
                      }
                    }}
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-[var(--brand-primary)] outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (pinValue.toLowerCase() === 'waiz' || pinValue === '2026') {
                        setIsBypassed(true);
                        setStatus({ type: 'success', message: 'Authorized as Master Creator!' });
                        setTimeout(() => setStatus(null), 3000);
                      } else {
                        setStatus({ type: 'error', message: 'Invalid developer PIN.' });
                        setTimeout(() => setStatus(null), 3000);
                      }
                    }}
                    className="px-5 bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white uppercase font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Bypass
                  </button>
                </div>
                <p className="text-[10px] text-neutral-600 mt-2">
                  Tip: The PIN can be set to <strong>waiz</strong> or <strong>2026</strong>. Works 100% inside sandboxed previews.
                </p>
              </div>

              {user && (
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={handleSignOut}
                    disabled={isSaving}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl transition-all border border-white/5 disabled:opacity-50 text-sm cursor-pointer"
                  >
                    {isSaving ? 'Processing...' : 'Sign Out'}
                  </button>
                  <button
                    onClick={handleSignIn}
                    disabled={isSaving}
                    className="flex-1 bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 text-sm cursor-pointer"
                  >
                    Switch Account
                  </button>
                </div>
              )}
            </div>
          )}

          <p className="text-[10px] text-neutral-600 font-mono mt-8 uppercase tracking-widest">
            Restricted to {ADMIN_EMAIL}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-950 overflow-y-auto p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dev Panel</h1>
            <p className="text-neutral-400">Manage your portfolio projects and settings.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={seedProjects}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all flex items-center gap-2 text-sm font-medium"
            >
              <Database size={16} />
              Restore Defaults
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {status && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-xl text-sm font-medium ${
              status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {status.message}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-10 p-1 bg-white/5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'projects' ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layout size={18} />
            Projects
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'settings' ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Settings size={18} />
            Global Settings
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'stats' ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart3 size={18} />
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'messages' ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Mail size={18} />
            Messages
            {messages.length > 0 && (
              <span className="bg-white text-brand-red px-1.5 py-0.5 rounded-full text-[10px]">{messages.length}</span>
            )}
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          {activeTab === 'projects' && (
            <>
              {/* Form */}
              <div className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-900/50 p-8 rounded-3xl border border-white/5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {isEditing ? <Edit2 size={20} /> : <Plus size={20} />}
                    {isEditing ? 'Edit Project' : 'Add New Project'}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Project Title</label>
                      <input 
                        type="text" 
                        required
                        value={formData.title}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-red outline-none transition-colors"
                        placeholder="e.g. MindMate"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Project Category</label>
                      <input 
                        type="text" 
                        required
                        value={formData.category}
                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-red outline-none transition-colors"
                        placeholder="e.g. SaaS / Wellness, AI / OS"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-neutral-400">Description</label>
                        <button 
                          type="button"
                          onClick={handleAiImprove}
                          disabled={isAiLoading}
                          className="text-[10px] font-bold uppercase tracking-widest text-brand-red-light hover:text-brand-red flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          {isAiLoading ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                          AI Improve
                        </button>
                      </div>
                      <textarea 
                        required
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-red outline-none transition-colors h-24 resize-none"
                        placeholder="Brief project description..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Project Link</label>
                      <input 
                        type="url" 
                        required
                        value={formData.link}
                        onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-red outline-none transition-colors"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Card Theme</label>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="grid grid-cols-5 gap-2">
                          {THEMES.map(t => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, theme: t.id }))}
                              className={`h-10 rounded-lg bg-gradient-to-br ${t.colors} border-2 transition-all ${
                                formData.theme === t.id ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                              }`}
                              title={t.name}
                            />
                          ))}
                        </div>
                        {/* Theme Preview Card */}
                        <div className={`p-4 rounded-xl bg-gradient-to-br ${THEMES.find(t => t.id === formData.theme)?.colors || THEMES[0].colors} border border-white/10 flex items-center gap-4`}>
                          <div className="w-10 h-10 bg-black/50 rounded-lg flex items-center justify-center text-white font-bold">
                            {formData.logoBase64 ? <Image src={formData.logoBase64} alt="Preview" width={24} height={24} className="object-contain" /> : 'P'}
                          </div>
                          <div>
                            <p className="text-white text-xs font-bold uppercase tracking-widest">Preview</p>
                            <p className="text-white/70 text-[10px] truncate max-w-[150px]">{formData.title || 'Project Title'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Logo (Base64)</label>
                      <div className="flex items-center gap-4">
                        <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-6 hover:border-brand-red/50 cursor-pointer transition-colors">
                          {formData.logoBase64 ? (
                            <div className="relative w-16 h-16">
                              <Image src={formData.logoBase64} alt="Preview" fill className="object-contain" />
                            </div>
                          ) : (
                            <>
                              <Upload className="text-neutral-500 mb-2" size={24} />
                              <span className="text-xs text-neutral-500">Click to upload logo</span>
                            </>
                          )}
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                        {formData.logoBase64 && (
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({ ...prev, logoBase64: '' }))}
                            className="p-2 text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="flex-1 bg-brand-red hover:bg-brand-red-dark text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      {isEditing ? 'Update Project' : 'Save Project'}
                    </button>
                    {isEditing && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsEditing(null);
                          setFormData({ title: '', category: '', description: '', link: '', logoBase64: '', tech: [], features: [], order: projects.length, theme: 'cyberpunk' });
                        }}
                        className="px-6 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Current Projects</h2>
                  <button 
                    onClick={handleCheckLinks}
                    disabled={isCheckingLinks}
                    className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    {isCheckingLinks ? <Loader2 className="animate-spin" size={12} /> : <Database size={12} />}
                    Check Links
                  </button>
                </div>
                <div className="space-y-4">
                  {projects.map((proj, idx) => (
                    <div key={proj.id} className="bg-neutral-900/50 p-6 rounded-2xl border border-white/5 flex items-center gap-6 group">
                      <div className="relative w-12 h-12 flex-shrink-0 bg-black/50 rounded-xl p-2 border border-white/5">
                        <Image src={proj.logoBase64} alt={proj.title} fill className="object-contain p-2" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold truncate">{proj.title}</h3>
                        <p className="text-neutral-500 text-sm truncate">{proj.link}</p>
                      </div>
                      
                      {/* Controls - Fixed Visibility */}
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1 mr-2">
                          <button 
                            onClick={() => proj.id && handleMove(proj.id, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-neutral-500 hover:text-white disabled:opacity-20 transition-colors"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button 
                            onClick={() => proj.id && handleMove(proj.id, 'down')}
                            disabled={idx === projects.length - 1}
                            className="p-1 text-neutral-500 hover:text-white disabled:opacity-20 transition-colors"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => {
                            setIsEditing(proj);
                            setFormData({ ...proj });
                          }}
                          className="p-2.5 bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => proj.id && handleDelete(proj.id)}
                          className="p-2.5 bg-red-500/5 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-12 bg-neutral-900/30 rounded-2xl border border-dashed border-white/5 flex flex-col items-center gap-4">
                      <p className="text-neutral-500">No projects in database yet.</p>
                      <button 
                        onClick={seedProjects}
                        className="px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-white font-bold rounded-xl transition-all flex items-center gap-2"
                      >
                        <Database size={20} />
                        Restore 5 Default Projects
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <div className="md:col-span-2 bg-neutral-900/50 p-8 rounded-3xl border border-white/5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                  <Settings size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">Global Site Settings</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={settings.name}
                      onChange={e => setSettings(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-red outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Professional Role</label>
                    <input 
                      type="text" 
                      value={settings.role}
                      onChange={e => setSettings(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-red outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-neutral-400">Bio / Headline</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAiBio('professional')}
                          className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors"
                        >
                          Pro
                        </button>
                        <button 
                          onClick={() => handleAiBio('creative')}
                          className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors"
                        >
                          Creative
                        </button>
                        <button 
                          onClick={() => handleAiBio('minimalist')}
                          className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors"
                        >
                          Minimal
                        </button>
                      </div>
                    </div>
                    <textarea 
                      value={settings.bio}
                      onChange={e => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-red outline-none transition-colors h-32 resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-brand-red" />
                    Visual Effects
                  </h3>
                  <div className="space-y-4 bg-black/30 p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-bold">Glow Mode</p>
                        <p className="text-neutral-500 text-xs">Add legendary neon glows to UI</p>
                      </div>
                      <button 
                        onClick={() => setSettings(prev => ({ ...prev, effects: { ...prev.effects, glowMode: !prev.effects?.glowMode } }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${settings.effects?.glowMode ? 'bg-brand-red' : 'bg-neutral-800'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.effects?.glowMode ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-bold">Glitch Accents</p>
                        <p className="text-neutral-500 text-xs">Subtle glitch effects on hover</p>
                      </div>
                      <button 
                        onClick={() => setSettings(prev => ({ ...prev, effects: { ...prev.effects, glitchAccents: !prev.effects?.glitchAccents } }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${settings.effects?.glitchAccents ? 'bg-brand-red' : 'bg-neutral-800'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.effects?.glitchAccents ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Globe size={18} className="text-brand-red" />
                    Social Links
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
                        <Github size={20} />
                      </div>
                      <input 
                        type="url" 
                        placeholder="GitHub URL"
                        value={settings.github || ''}
                        onChange={e => setSettings(prev => ({ ...prev, github: e.target.value }))}
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
                        <Linkedin size={20} />
                      </div>
                      <input 
                        type="url" 
                        placeholder="LinkedIn URL"
                        value={settings.linkedin || ''}
                        onChange={e => setSettings(prev => ({ ...prev, linkedin: e.target.value }))}
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
                        <Twitter size={20} />
                      </div>
                      <input 
                        type="url" 
                        placeholder="Twitter URL"
                        value={settings.twitter || ''}
                        onChange={e => setSettings(prev => ({ ...prev, twitter: e.target.value }))}
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
                        <Mail size={20} />
                      </div>
                      <input 
                        type="email" 
                        placeholder="Contact Email"
                        value={settings.email || ''}
                        onChange={e => setSettings(prev => ({ ...prev, email: e.target.value }))}
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <button 
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="w-full md:w-auto px-12 py-4 bg-brand-red hover:bg-brand-red-dark text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Save All Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="md:col-span-2 space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-neutral-900/50 p-8 rounded-3xl border border-white/5">
                  <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mb-2">Total Projects</p>
                  <h3 className="text-5xl font-bold text-white">{projects.length}</h3>
                </div>
                <div className="bg-neutral-900/50 p-8 rounded-3xl border border-white/5">
                  <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mb-2">Active Themes</p>
                  <h3 className="text-5xl font-bold text-white">
                    {new Set(projects.map(p => p.theme)).size}
                  </h3>
                </div>
                <div className="bg-neutral-900/50 p-8 rounded-3xl border border-white/5">
                  <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mb-2">Tech Stack</p>
                  <h3 className="text-5xl font-bold text-white">
                    {new Set(projects.flatMap(p => p.tech)).size}
                  </h3>
                </div>
              </div>

              <div className="bg-neutral-900/50 p-8 rounded-3xl border border-white/5">
                <h3 className="text-xl font-bold text-white mb-6">Theme Distribution</h3>
                <div className="space-y-4">
                  {THEMES.map(theme => {
                    const count = projects.filter(p => p.theme === theme.id).length;
                    const percentage = projects.length > 0 ? (count / projects.length) * 100 : 0;
                    return ( count > 0 &&
                      <div key={theme.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-300">{theme.name}</span>
                          <span className="text-neutral-500">{count} projects</span>
                        </div>
                        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${theme.colors} transition-all duration-1000`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Visitor Messages</h2>
                <p className="text-neutral-500 text-sm">{messages.length} total messages</p>
              </div>
              <div className="grid gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-neutral-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-bold">{msg.name}</h3>
                        <p className="text-neutral-500 text-sm">{msg.email}</p>
                      </div>
                      <span className="text-[10px] text-neutral-600 font-mono">
                        {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : 'Just now'}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-sm leading-relaxed bg-black/30 p-4 rounded-xl">
                      {msg.message}
                    </p>
                    <div className="flex justify-end">
                      <button 
                        onClick={async () => {
                          await deleteDoc(doc(db, 'messages', msg.id));
                          setStatus({ type: 'success', message: 'Message deleted.' });
                        }}
                        className="text-neutral-600 hover:text-brand-red transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="text-center py-24 bg-neutral-900/30 rounded-3xl border border-dashed border-white/10">
                    <Mail className="mx-auto text-neutral-700 mb-4" size={48} />
                    <p className="text-neutral-500">No messages yet. Your legendary portfolio is waiting for its first fan!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
