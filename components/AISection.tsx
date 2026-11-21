'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, Terminal, Cpu, Info } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '@/lib/theme-context';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AISection() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I am Waiz&apos;s AI assistant. I can tell you about his expertise in Next.js, Firebase, and legendary elemental design. How can I help you today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { element } = useTheme();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages, userMessage].map(m => ({ 
          role: m.role === 'user' ? 'user' : 'model', 
          parts: [{ text: m.content }] 
        })),
        config: {
          systemInstruction: `You are the AI assistant for Waiz Monazzum, a legendary Full Stack Developer. 
          Your tone is professional, innovative, and slightly "elemental" to match the portfolio theme (Fire, Thunder, Water, Wind, Earth, Ice).
          Current active element theme is: ${element}.
          Waiz's key skills: Next.js 15, React 19, TypeScript, Tailwind 4, Firebase, Google Gemini API, Three.js.
          Keep responses concise and helpful. If asked about his projects, mention his focus on performance and AI integration.`,
        }
      });

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.text || "I'm sorry, I couldn't process that request." 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'There was an error connecting to my core. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            <Cpu size={12} />
            AI Expert System
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Chat with the <span className="text-gradient-red">Architect</span>
          </h2>
          <p className="text-neutral-400">Ask anything about Waiz&apos;s skills, projects, or technical philosophy.</p>
        </div>

        <div className="glass rounded-3xl border-white/10 overflow-hidden shadow-2xl flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)]/20 flex items-center justify-center">
                <Bot size={20} className="text-[var(--brand-primary)]" />
              </div>
              <div>
                <div className="text-sm font-bold">Legendary AI</div>
                <div className="text-[10px] text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Online & Ready
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <Info size={16} className="text-neutral-500" />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 space-y-6 custom-scrollbar">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-neutral-800' : 'bg-[var(--brand-primary)]/20'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-[var(--brand-primary)]" />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-neutral-800 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-neutral-300 rounded-tl-none'
                }`}>
                  <ReactMarkdown className="markdown-body">{msg.content}</ReactMarkdown>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/20 flex items-center justify-center">
                  <Bot size={16} className="text-[var(--brand-primary)]" />
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                  <span className="w-1 h-1 bg-[var(--brand-primary)] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 bg-[var(--brand-primary)] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 bg-[var(--brand-primary)] rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-neutral-900 border-t border-white/5">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Waiz's expertise..."
                className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-[var(--brand-primary)]/50 transition-all text-sm"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[var(--brand-primary)] flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-50"
              >
                <Send size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
