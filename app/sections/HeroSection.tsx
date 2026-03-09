'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useTheme } from '@/app/context/ThemeContext';
import {
  Signal,
  ChevronDown,
  Zap,
  BookOpen,
  Cpu,
  Wifi,
  Battery,
  Radio,
  ArrowRight,
  Play,
} from 'lucide-react';

// Nokia Blue color
const NOKIA_BLUE = '#005AFF';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface StatItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const stats: StatItem[] = [
  {
    value: '4',
    label: 'Key Clauses',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Core RLM specifications',
  },
  {
    value: '26',
    label: 'Gap Patterns',
    icon: <Wifi className="w-5 h-5" />,
    description: 'Measurement configurations',
  },
  {
    value: '100+',
    label: 'Spec Tables',
    icon: <Cpu className="w-5 h-5" />,
    description: 'Detailed requirements',
  },
  {
    value: '1Rx/2Rx',
    label: 'Dual Modes',
    icon: <Radio className="w-5 h-5" />,
    description: 'Flexible antenna support',
  },
];

// Signal Wave Component
const SignalWave: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  return (
    <motion.div
      className="absolute rounded-full border-2"
      style={{ borderColor: color }}
      initial={{ width: 60, height: 60, opacity: 0.8 }}
      animate={{
        width: [60, 200, 350],
        height: [60, 200, 350],
        opacity: [0.8, 0.4, 0],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        delay,
        ease: 'easeOut',
      }}
    />
  );
};

// Animated Signal Icon with waves
const AnimatedSignalIcon: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Signal waves */}
      <div className="absolute inset-0 flex items-center justify-center">
        <SignalWave delay={0} color={`${NOKIA_BLUE}60`} />
        <SignalWave delay={0.8} color={`${NOKIA_BLUE}40`} />
        <SignalWave delay={1.6} color={`${NOKIA_BLUE}20`} />
      </div>
      
      {/* Central icon */}
      <motion.div
        className="relative z-10 p-4 rounded-2xl"
        style={{ backgroundColor: `${NOKIA_BLUE}20` }}
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            `0 0 20px ${NOKIA_BLUE}30`,
            `0 0 40px ${NOKIA_BLUE}50`,
            `0 0 20px ${NOKIA_BLUE}30`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Signal className="w-10 h-10" style={{ color: NOKIA_BLUE }} />
      </motion.div>
    </div>
  );
};

// Floating Particle Background
const ParticleBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: theme === 'dark' ? `${NOKIA_BLUE}40` : `${NOKIA_BLUE}25`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Connection Lines Animation
const ConnectionLines: React.FC = () => {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 0.3,
      transition: {
        pathLength: {
          delay: i * 0.3,
          duration: 2,
          ease: 'easeInOut',
        },
        opacity: { delay: i * 0.3, duration: 0.5 },
      },
    }),
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={NOKIA_BLUE} stopOpacity="0" />
          <stop offset="50%" stopColor={NOKIA_BLUE} stopOpacity="0.5" />
          <stop offset="100%" stopColor={NOKIA_BLUE} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[...Array(5)].map((_, i) => (
        <motion.path
          key={i}
          d={`M ${-100 + i * 300} ${300 + i * 100} Q ${400 + i * 150} ${100 + i * 50} ${1500 + i * 200} ${400 + i * 80}`}
          stroke="url(#lineGradient)"
          strokeWidth="1"
          fill="none"
          custom={i}
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
      ))}
    </svg>
  );
};

// Stat Card Component
const StatCard: React.FC<{ stat: StatItem; index: number }> = ({ stat, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative group"
    >
      <div
        className="relative p-5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className="flex items-start gap-4">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${NOKIA_BLUE}15` }}
          >
            <div style={{ color: NOKIA_BLUE }}>{stat.icon}</div>
          </div>
          <div>
            <div
              className="text-2xl font-bold"
              style={{ color: NOKIA_BLUE }}
            >
              {stat.value}
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {stat.label}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stat.description}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Scroll Indicator Component
const ScrollIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    >
      <span className="text-xs text-gray-500 dark:text-gray-400">Scroll to explore</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </motion.div>
    </motion.div>
  );
};

// Main Hero Section Component
export function HeroSection() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
        }}
      />

      {/* Animated background elements */}
      <ParticleBackground />
      <ConnectionLines />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${NOKIA_BLUE} 1px, transparent 1px), linear-gradient(90deg, ${NOKIA_BLUE} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Main content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: `${NOKIA_BLUE}15` }}
            >
              <Zap className="w-4 h-4" style={{ color: NOKIA_BLUE }} />
              <span className="text-sm font-medium" style={{ color: NOKIA_BLUE }}>
                3GPP TS 38.133 Compliant
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              Master{' '}
              <span
                className="relative inline-block"
                style={{ color: NOKIA_BLUE }}
              >
                RedCap
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <motion.path
                    d="M2 10C50 2 150 2 198 10"
                    stroke={NOKIA_BLUE}
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </motion.svg>
              </span>{' '}
              RRM
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-4"
            >
              Radio Resource Management for Reduced Capability Devices
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Explore the elegant intelligence of 5G RedCap technology. From Radio Link Monitoring 
              to Idle Mobility, discover how relaxed timers and smart adaptations enable 
              power-efficient IoT connectivity.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('#rlm')}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-semibold shadow-lg shadow-blue-500/30 transition-all"
                style={{ backgroundColor: NOKIA_BLUE }}
              >
                <BookOpen className="w-5 h-5" />
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('#tools')}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold border-2 transition-all"
                style={{
                  borderColor: NOKIA_BLUE,
                  color: NOKIA_BLUE,
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${NOKIA_BLUE}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Play className="w-5 h-5" />
                Explore Interactive Tools
              </motion.button>
            </motion.div>
          </div>

          {/* Right column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative">
              {/* Animated signal icon */}
              <AnimatedSignalIcon />

              {/* Orbiting elements */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-lg"
                  style={{ border: `1px solid ${NOKIA_BLUE}30` }}
                >
                  <Battery className="w-5 h-5" style={{ color: NOKIA_BLUE }} />
                </div>
              </motion.div>

              <motion.div
                className="absolute inset-0"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              >
                <div
                  className="absolute top-1/2 -right-4 -translate-y-1/2 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-lg"
                  style={{ border: `1px solid ${NOKIA_BLUE}30` }}
                >
                  <Wifi className="w-5 h-5" style={{ color: NOKIA_BLUE }} />
                </div>
              </motion.div>

              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              >
                <div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-lg"
                  style={{ border: `1px solid ${NOKIA_BLUE}30` }}
                >
                  <Cpu className="w-5 h-5" style={{ color: NOKIA_BLUE }} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}

export default HeroSection;
