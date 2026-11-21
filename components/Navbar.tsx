'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn, Github, Linkedin, Twitter } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { element } = useTheme();
  const [logoError, setLogoError] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (clickCount + 1 >= 3) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-dev-panel'));
      }, 0);
      setClickCount(0);
    } else {
      setClickCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'AI Expert', href: '#ai' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass rounded-2xl p-4 flex items-center justify-between border-white/10 transition-all duration-500 ${isScrolled ? 'shadow-2xl translate-y-0' : 'bg-transparent border-transparent'}`}>
          <Link href="/" className="flex items-center gap-2 group">
            <div 
              onClick={handleLogoClick}
              className="w-10 h-10 bg-[var(--brand-primary)] rounded-xl flex items-center justify-center text-white font-bold text-xl overflow-hidden transition-transform group-hover:rotate-12 relative cursor-pointer"
            >
              {!logoError ? (
                <Image
                  src="/logo.png"
                  alt="W Logo"
                  fill
                  className="object-cover"
                  onError={() => setLogoError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                "W"
              )}
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block">waizmarco</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {link.name}
              </a>
            ))}
            <div className="w-px h-6 bg-white/10 mx-2" />
            <a 
              href="https://github.com" 
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={20} />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:block px-6 py-2 rounded-xl bg-[var(--brand-primary)] text-white text-sm font-bold shadow-lg shadow-[var(--brand-glow)] hover:opacity-90 transition-all">
              Legendary Build
            </button>
            
            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full px-6 py-4 md:hidden"
          >
            <div className="glass rounded-2xl p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-bold text-white py-2 border-b border-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex gap-4 pt-4">
                <Github className="text-neutral-400" />
                <Linkedin className="text-neutral-400" />
                <Twitter className="text-neutral-400" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
