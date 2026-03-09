'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/context/ThemeContext';
import {
  Signal,
  ExternalLink,
  Github,
  BookOpen,
  FileText,
  Mail,
} from 'lucide-react';

// Nokia Blue color
const NOKIA_BLUE = '#005AFF';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: '3GPP Specifications',
    links: [
      {
        label: 'TS 38.133 (RedCap)',
        href: 'https://www.3gpp.org/specifications',
        external: true,
      },
      {
        label: 'TS 38.101 (UE Radio)',
        href: 'https://www.3gpp.org/specifications',
        external: true,
      },
      {
        label: 'TS 38.214 (Physical Layer)',
        href: 'https://www.3gpp.org/specifications',
        external: true,
      },
      {
        label: 'TS 38.331 (RRC Protocol)',
        href: 'https://www.3gpp.org/specifications',
        external: true,
      },
    ],
  },
  {
    title: 'Sections',
    links: [
      { label: 'RLM (8.1B)', href: '#rlm' },
      { label: 'Measurement (9.1A)', href: '#measurement' },
      { label: 'Idle Mobility (4.2B)', href: '#idle-mobility' },
      { label: 'Performance (10.1A)', href: '#performance' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Interactive Tools', href: '#tools' },
      { label: 'Beauty of RedCap', href: '#beauty' },
      { label: 'Documentation', href: '#docs' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
];

export function Footer() {
  const { theme } = useTheme();

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
      {/* Top accent line */}
      <div className="h-1 w-full" style={{ backgroundColor: NOKIA_BLUE }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${NOKIA_BLUE}15` }}
                >
                  <Signal
                    className="w-6 h-6"
                    style={{ color: NOKIA_BLUE }}
                  />
                </div>
                <div>
                  <span
                    className="text-xl font-bold"
                    style={{ color: NOKIA_BLUE }}
                  >
                    RedCap
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    RRM Educational
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
                An interactive educational resource for understanding 5G NR RedCap 
                (Reduced Capability) Radio Resource Management based on 3GPP 
                specifications.
              </p>

              {/* 3GPP Reference Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <BookOpen className="w-4 h-4" style={{ color: NOKIA_BLUE }} />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Based on
                  </div>
                  <div className="text-sm font-semibold" style={{ color: NOKIA_BLUE }}>
                    3GPP TS 38.133
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800" />

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400"
          >
            <span>© {new Date().getFullYear()} RedCap RRM Educational</span>
            <span className="hidden sm:inline">•</span>
            <span>Version 1.0.0</span>
            <span className="hidden sm:inline">•</span>
            <span>Built for learning</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="mailto:contact@redcap-edu.org"
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://www.3gpp.org/specifications"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="3GPP Specifications"
            >
              <FileText className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
