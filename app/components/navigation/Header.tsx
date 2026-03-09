'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/context/ThemeContext';
import { useRx } from '@/app/context/RxContext';
import { useScrollProgress } from '@/app/hooks/useScrollProgress';
import {
  Signal,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  Antenna,
  ChevronDown,
} from 'lucide-react';

// Nokia Blue color
const NOKIA_BLUE = '#005AFF';

interface NavLink {
  label: string;
  href: string;
  subsections?: { label: string; href: string }[];
}

const navLinks: NavLink[] = [
  {
    label: 'RLM',
    href: '#rlm',
    subsections: [
      { label: 'Overview', href: '#rlm-overview' },
      { label: 'SSB-Based', href: '#rlm-ssb' },
      { label: 'CSI-RS-Based', href: '#rlm-csi-rs' },
    ],
  },
  { label: 'Measurement', href: '#measurement' },
  { label: 'Idle Mobility', href: '#idle-mobility' },
  { label: 'Performance', href: '#performance' },
  { label: 'Interactive Tools', href: '#tools' },
  { label: 'Beauty of RedCap', href: '#beauty' },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { rxMode, toggleRxMode } = useRx();
  const { isScrolled, progress } = useScrollProgress();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Dispatch custom search event
      window.dispatchEvent(new CustomEvent('redcap-search', {
        detail: { query: searchQuery.trim() },
      }));
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg'
            : 'bg-white dark:bg-slate-900'
        }`}
        style={{ borderBottom: `2px solid ${NOKIA_BLUE}` }}
      >
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-gray-200 dark:bg-gray-700 w-full">
          <motion.div
            className="h-full transition-all duration-100"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: NOKIA_BLUE,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${NOKIA_BLUE}15` }}
                >
                  <Signal
                    className="w-6 h-6"
                    style={{ color: NOKIA_BLUE }}
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-lg font-bold tracking-tight"
                    style={{ color: NOKIA_BLUE }}
                  >
                    RedCap
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                    RRM Educational
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.subsections && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => scrollToSection(link.href)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-white transition-colors"
                    style={{
                      ['--hover-bg' as string]: NOKIA_BLUE,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = NOKIA_BLUE;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {link.label}
                    {link.subsections && (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </motion.button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.subsections && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        {link.subsections.map((sub) => (
                          <button
                            key={sub.href}
                            onClick={() => scrollToSection(sub.href)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* 1Rx/2Rx Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleRxMode}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: rxMode === '2rx' ? `${NOKIA_BLUE}20` : '#f3f4f6',
                  color: rxMode === '2rx' ? NOKIA_BLUE : '#6b7280',
                  border: `1px solid ${rxMode === '2rx' ? NOKIA_BLUE : '#e5e7eb'}`,
                }}
                title={rxMode === '2rx' ? 'Dual antenna mode' : 'Single antenna mode'}
              >
                <Antenna className="w-4 h-4" />
                <span className="uppercase">{rxMode}</span>
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                <AnimatePresence mode="wait">
                  {theme === 'light' ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800"
            >
              <nav className="px-4 py-4 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 font-medium transition-colors"
                    >
                      {link.label}
                    </button>
                    {link.subsections && (
                      <div className="ml-4 mt-1 space-y-1">
                        {link.subsections.map((sub) => (
                          <button
                            key={sub.href}
                            onClick={() => scrollToSection(sub.href)}
                            className="block w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {/* Mobile 1Rx/2Rx Toggle */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={toggleRxMode}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Antenna className="w-5 h-5" style={{ color: NOKIA_BLUE }} />
                    <span className="font-medium">Switch to {rxMode === '1rx' ? '2Rx' : '1Rx'}</span>
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="flex items-center p-4">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search RedCap RRM topics..."
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
              <div className="px-4 pb-4 text-xs text-gray-500 dark:text-gray-400">
                Press Enter to search or ESC to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
