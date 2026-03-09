'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useTheme } from '@/app/context/ThemeContext';
import {
  Sparkles,
  Zap,
  Battery,
  Cpu,
  Wifi,
  TrendingDown,
  Target,
  Layers,
  RefreshCw,
  Globe,
  Factory,
  HeartPulse,
  Car,
  Sprout,
  Quote,
  Lightbulb,
  ArrowRight,
  Timer,
  Settings,
  Activity,
} from 'lucide-react';

// Nokia Blue color
const NOKIA_BLUE = '#005AFF';

// Quote Card Component
interface QuoteCardProps {
  quote: string;
  source: string;
  delay?: number;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, source, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800"
    >
      <Quote className="absolute top-4 left-4 w-8 h-8 text-blue-300 dark:text-blue-700" />
      <p className="text-gray-700 dark:text-gray-300 italic pl-10 mb-4 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-right">
        — {source}
      </p>
    </motion.div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${NOKIA_BLUE}15` }}
      >
        <div style={{ color: NOKIA_BLUE }}>{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

// Marathon Runner Visual Component
const MarathonRunnerVisual: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative h-64 flex items-center justify-center">
      {/* Track */}
      <div className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
      
      {/* Runner */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex flex-col items-center"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${NOKIA_BLUE}20` }}
          >
            <Zap className="w-8 h-8" style={{ color: NOKIA_BLUE }} />
          </div>
          <span className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">RedCap</span>
        </motion.div>
      </motion.div>

      {/* Speed indicators */}
      <motion.div
        className="absolute right-10 flex flex-col gap-2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="h-1 rounded-full"
            style={{ 
              backgroundColor: `${NOKIA_BLUE}${40 + i * 20}`,
              width: `${60 - i * 15}px`,
            }}
            animate={{ scaleX: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>

      {/* Battery indicator */}
      <motion.div
        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        <Battery className="w-4 h-4 text-green-600 dark:text-green-400" />
        <span className="text-xs font-medium text-green-600 dark:text-green-400">85%</span>
      </motion.div>
    </div>
  );
};

// Timer Visualization Component
const TimerVisualization: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative h-48 flex items-center justify-center gap-8">
      {/* Traditional Timer */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <div className="relative w-20 h-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4 border-red-300 dark:border-red-700 border-t-red-500 dark:border-t-red-500"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-red-500">1s</span>
          </div>
        </div>
        <span className="mt-3 text-sm text-gray-500 dark:text-gray-400">Traditional</span>
        <span className="text-xs text-red-500">High Power</span>
      </motion.div>

      {/* Arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
      >
        <ArrowRight className="w-6 h-6 text-gray-400" />
      </motion.div>

      {/* Relaxed Timer */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <div className="relative w-20 h-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4"
            style={{ borderColor: `${NOKIA_BLUE}40`, borderTopColor: NOKIA_BLUE }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold" style={{ color: NOKIA_BLUE }}>10s</span>
          </div>
        </div>
        <span className="mt-3 text-sm text-gray-500 dark:text-gray-400">Relaxed</span>
        <span className="text-xs" style={{ color: NOKIA_BLUE }}>Power Saved</span>
      </motion.div>
    </div>
  );
};

// Use Case Card Component
interface UseCaseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  applications: string[];
  delay?: number;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ icon, title, description, applications, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${NOKIA_BLUE}15` }}
        >
          <div style={{ color: NOKIA_BLUE }}>{icon}</div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {applications.map((app, i) => (
          <span
            key={i}
            className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"
          >
            {app}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

// Section Header Component
interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, subtitle }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: `${NOKIA_BLUE}15` }}>
        <div style={{ color: NOKIA_BLUE }}>{icon}</div>
        <span className="text-sm font-medium" style={{ color: NOKIA_BLUE }}>{subtitle}</span>
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{title}</h2>
    </motion.div>
  );
};

// Main Beauty of RedCap Section
export function BeautyOfRedCapSection() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section
      ref={containerRef}
      id="beauty"
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
              : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          }}
        />
        {/* Decorative circles */}
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20"
          style={{ background: `radial-gradient(circle, ${NOKIA_BLUE}20 0%, transparent 70%)` }}
        />
        <div
          className="absolute bottom-40 right-10 w-96 h-96 rounded-full opacity-20"
          style={{ background: `radial-gradient(circle, ${NOKIA_BLUE}15 0%, transparent 70%)` }}
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
            style={{ backgroundColor: `${NOKIA_BLUE}15` }}
          >
            <Sparkles className="w-10 h-10" style={{ color: NOKIA_BLUE }} />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            The Beauty of{' '}
            <span style={{ color: NOKIA_BLUE }}>RedCap</span> RRM
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover the elegant intelligence behind 5G Reduced Capability devices—
            where smart compromises create extraordinary efficiency.
          </p>
        </motion.div>

        {/* Why RedCap Matters */}
        <div className="mb-24">
          <SectionHeader
            icon={<Lightbulb className="w-5 h-5" />}
            title="Why RedCap Matters"
            subtitle="The IoT Revolution"
          />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                The Internet of Things is transforming our world—from smart factories to 
                connected healthcare, from precision agriculture to intelligent cities. 
                But not every device needs the full power of 5G.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                RedCap (Reduced Capability) is 3GPP&apos;s elegant answer: a streamlined 
                5G standard that delivers exactly what IoT devices need—reliable connectivity, 
                lower power consumption, and reduced complexity—without the overhead of 
                full-featured 5G.
              </motion.p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <FeatureCard
                  icon={<Battery className="w-6 h-6" />}
                  title="Power Efficient"
                  description="Up to 70% power savings compared to full 5G devices"
                  delay={0.2}
                />
                <FeatureCard
                  icon={<Cpu className="w-6 h-6" />}
                  title="Cost Optimized"
                  description="Simpler hardware design reduces manufacturing costs"
                  delay={0.3}
                />
                <FeatureCard
                  icon={<Wifi className="w-6 h-6" />}
                  title="Reliable Coverage"
                  description="Maintains excellent link quality with relaxed requirements"
                  delay={0.4}
                />
                <FeatureCard
                  icon={<TrendingDown className="w-6 h-6" />}
                  title="Reduced Complexity"
                  description="Fewer antennas and simpler RF design"
                  delay={0.5}
                />
              </div>
            </div>

            <QuoteCard
              quote="RedCap is designed to address the mid-range use cases that fall between 
              low-complexity NB-IoT/LTE-M and high-performance 5G eMBB devices."
              source="3GPP TS 38.133, Introduction to RedCap"
              delay={0.3}
            />
          </div>
        </div>

        {/* The Elegance of Relaxation */}
        <div className="mb-24">
          <SectionHeader
            icon={<Timer className="w-5 h-5" />}
            title="The Elegance of Relaxation"
            subtitle="Smart Timing, Maximum Efficiency"
          />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <TimerVisualization />
            </motion.div>

            <div className="order-1 lg:order-2 space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                The genius of RedCap lies in its relaxed timers. While traditional 5G devices 
                monitor the radio link every second, RedCap devices can extend this to 10 seconds 
                or more—without significantly impacting reliability.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                This seemingly simple change has profound implications: the radio can stay asleep 
                longer, preserving precious battery life. For IoT sensors that only need to report 
                periodically, this translates to months or even years of operation on a single charge.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <strong>Key Insight:</strong> The 10x relaxation in monitoring frequency 
                    can yield up to 5-7x power savings, as the RF receiver—one of the most 
                    power-hungry components—stays off longer.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 1Rx vs 2Rx Trade-off */}
        <div className="mb-24">
          <SectionHeader
            icon={<Settings className="w-5 h-5" />}
            title="1Rx vs 2Rx: A Deliberate Trade-off"
            subtitle="Design Philosophy"
          />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                RedCap introduces a fundamental choice: 1Rx (single receive antenna) or 2Rx 
                (dual receive antennas). This isn&apos;t a limitation—it&apos;s a deliberate 
                design decision that empowers manufacturers to optimize for their specific use case.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                A 1Rx device is simpler, cheaper, and consumes less power—perfect for stationary 
                sensors in good coverage areas. A 2Rx device offers better reception in challenging 
                environments—ideal for mobile applications or areas with weak signals.
              </motion.p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="p-5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5" style={{ color: NOKIA_BLUE }} />
                    <span className="font-semibold text-gray-900 dark:text-white">1Rx Mode</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Lower cost
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Reduced power
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Simpler design
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="p-5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-5 h-5" style={{ color: NOKIA_BLUE }} />
                    <span className="font-semibold text-gray-900 dark:text-white">2Rx Mode</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Better coverage
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Higher throughput
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Mobility support
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>

            <QuoteCard
              quote="The support of 1Rx and 2Rx configurations allows RedCap devices to 
              balance cost, power consumption, and performance based on deployment requirements."
              source="3GPP TS 38.133, clause 8.1B"
              delay={0.3}
            />
          </div>
        </div>

        {/* The Intelligence of Adaptation */}
        <div className="mb-24">
          <SectionHeader
            icon={<Activity className="w-5 h-5" />}
            title="The Intelligence of Adaptation"
            subtitle="Dynamic Optimization"
          />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <MarathonRunnerVisual />
            </motion.div>

            <div className="order-1 lg:order-2 space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                RedCap isn&apos;t just about relaxed timers—it&apos;s about intelligent adaptation. 
                The Connection-based Sync Signal Frequency (CSSF) allows devices to dynamically 
                adjust their monitoring frequency based on actual network conditions.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                When signal quality is good, the device relaxes further. When conditions deteriorate, 
                it becomes more vigilant. This adaptive behavior ensures optimal power efficiency 
                while maintaining reliable connectivity—like a smart marathon runner who knows 
                exactly when to conserve energy and when to push harder.
              </motion.p>

              <div className="space-y-4 mt-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${NOKIA_BLUE}15` }}
                  >
                    <RefreshCw className="w-5 h-5" style={{ color: NOKIA_BLUE }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">CSSF Adaptation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Dynamically scales monitoring frequency from 1 to 8 based on link quality
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${NOKIA_BLUE}15` }}
                  >
                    <Layers className="w-5 h-5" style={{ color: NOKIA_BLUE }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Gap Sharing</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Intelligently combines multiple measurement gaps to minimize RF active time
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* RedCap in Action */}
        <div className="mb-16">
          <SectionHeader
            icon={<Globe className="w-5 h-5" />}
            title="RedCap in Action"
            subtitle="Real-World Applications"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UseCaseCard
              icon={<Factory className="w-6 h-6" />}
              title="Industrial IoT"
              description="Smart sensors monitoring equipment health, predicting maintenance needs, and optimizing production lines."
              applications={['Predictive Maintenance', 'Asset Tracking', 'Quality Control']}
              delay={0}
            />
            <UseCaseCard
              icon={<HeartPulse className="w-6 h-6" />}
              title="Healthcare"
              description="Remote patient monitoring devices that track vital signs and alert caregivers to anomalies."
              applications={['Remote Monitoring', 'Wearable Devices', 'Emergency Alerts']}
              delay={0.1}
            />
            <UseCaseCard
              icon={<Car className="w-6 h-6" />}
              title="Smart Transportation"
              description="Connected vehicle sensors and fleet management systems enabling safer, more efficient transport."
              applications={['Fleet Management', 'Vehicle Telematics', 'Traffic Optimization']}
              delay={0.2}
            />
            <UseCaseCard
              icon={<Sprout className="w-6 h-6" />}
              title="Smart Agriculture"
              description="Precision farming sensors monitoring soil conditions, weather, and crop health."
              applications={['Soil Monitoring', 'Irrigation Control', 'Livestock Tracking']}
              delay={0.3}
            />
            <UseCaseCard
              icon={<Wifi className="w-6 h-6" />}
              title="Smart Cities"
              description="Urban infrastructure sensors for lighting, parking, waste management, and environmental monitoring."
              applications={['Smart Lighting', 'Waste Management', 'Air Quality']}
              delay={0.4}
            />
            <UseCaseCard
              icon={<Zap className="w-6 h-6" />}
              title="Energy Management"
              description="Smart grid sensors and meters optimizing energy distribution and consumption."
              applications={['Smart Meters', 'Grid Monitoring', 'Demand Response']}
              delay={0.5}
            />
          </div>
        </div>

        {/* Final Quote */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <div
            className="p-8 rounded-3xl"
            style={{ backgroundColor: `${NOKIA_BLUE}10` }}
          >
            <Sparkles className="w-10 h-10 mx-auto mb-4" style={{ color: NOKIA_BLUE }} />
            <p className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200 italic leading-relaxed mb-4">
              &ldquo;RedCap represents the art of intelligent compromise—delivering exactly 
              what&apos;s needed, nothing more, nothing less. It&apos;s 5G, beautifully simplified.&rdquo;
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              — The Spirit of RedCap Design Philosophy
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default BeautyOfRedCapSection;
