'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Navigation Components
import { Header } from './components/navigation/Header';
import { Footer } from './components/navigation/Footer';
import { Sidebar } from './components/navigation/Sidebar';

// Section Components
import { HeroSection } from './sections/HeroSection';
import { RLMSection } from './sections/RLMSection';
import MeasurementSection from './sections/MeasurementSection';
import IdleMobilitySection from './sections/IdleMobilitySection';
import PerformanceSection from './sections/PerformanceSection';
import InteractiveToolsSection from './sections/InteractiveToolsSection';
import GamificationSection from './sections/GamificationSection';
import { BeautyOfRedCapSection } from './sections/BeautyOfRedCapSection';

// Chatbot Component
import Chatbot from './components/chatbot/Chatbot';

// Nokia Blue color
const NOKIA_BLUE = '#005AFF';

// Loading Screen Component
const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-slate-900"
    >
      <div className="flex flex-col items-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          {/* Signal waves */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: `${NOKIA_BLUE}${40 + i * 20}` }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2 + i * 0.5, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeOut',
              }}
            />
          ))}
          
          {/* Center icon */}
          <motion.div
            className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${NOKIA_BLUE}15` }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg
              className="w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke={NOKIA_BLUE}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 20h.01" />
              <path d="M7 20v-4" />
              <path d="M12 20v-8" />
              <path d="M17 20V8" />
              <path d="M22 4v16" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Loading text */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
        >
          RedCap RRM
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 dark:text-gray-400"
        >
          Loading educational content...
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="mt-6 h-1 rounded-full"
          style={{ backgroundColor: NOKIA_BLUE }}
        />
      </div>
    </motion.div>
  );
};

// Scroll to Top Button
const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
          style={{ borderColor: `${NOKIA_BLUE}30` }}
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke={NOKIA_BLUE}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Main Page Component
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        {/* Header */}
        <Header />

        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content */}
        <div className="lg:ml-72">
          {/* Hero Section */}
          <section id="hero">
            <HeroSection />
          </section>

          {/* RLM Section (8.1B) */}
          <section id="rlm" className="scroll-mt-16">
            <RLMSection defaultMode="researcher" />
          </section>

          {/* Measurement Section (9.1A) */}
          <section id="measurement" className="scroll-mt-16">
            <MeasurementSection />
          </section>

          {/* Idle Mobility Section (4.2B) */}
          <section id="idle-mobility" className="scroll-mt-16">
            <IdleMobilitySection />
          </section>

          {/* Performance Section (10.1A) */}
          <section id="performance" className="scroll-mt-16">
            <PerformanceSection mode="researcher" />
          </section>

          {/* Interactive Tools Section */}
          <section id="tools" className="scroll-mt-16">
            <InteractiveToolsSection />
          </section>

          {/* Gamification Section */}
          <section id="gamification" className="scroll-mt-16">
            <GamificationSection />
          </section>

          {/* Beauty of RedCap Section */}
          <section id="beauty" className="scroll-mt-16">
            <BeautyOfRedCapSection />
          </section>

          {/* Footer */}
          <Footer />
        </div>

        {/* Chatbot */}
        <Chatbot />

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </motion.main>
    </>
  );
}
