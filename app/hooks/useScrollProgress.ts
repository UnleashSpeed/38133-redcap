'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface ScrollProgressOptions {
  throttleMs?: number;
}

interface ScrollProgressReturn {
  progress: number; // 0 to 1
  scrollY: number;
  scrollHeight: number;
  clientHeight: number;
  isScrolled: boolean;
}

export function useScrollProgress(
  options: ScrollProgressOptions = {}
): ScrollProgressReturn {
  const { throttleMs = 16 } = options; // Default to ~60fps
  
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const lastUpdateRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const calculateProgress = useCallback(() => {
    const docElement = document.documentElement;
    const scrollTop = window.scrollY || docElement.scrollTop;
    const scrollHeight = docElement.scrollHeight - docElement.clientHeight;
    
    // Avoid division by zero
    const progressValue = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    
    setProgress(Math.min(Math.max(progressValue, 0), 1));
    setScrollY(scrollTop);
    setScrollHeight(docElement.scrollHeight);
    setClientHeight(docElement.clientHeight);
    setIsScrolled(scrollTop > 50);
  }, []);

  const throttledUpdate = useCallback(() => {
    const now = Date.now();
    
    if (now - lastUpdateRef.current >= throttleMs) {
      calculateProgress();
      lastUpdateRef.current = now;
    }
    
    rafRef.current = null;
  }, [calculateProgress, throttleMs]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(throttledUpdate);
      }
    };

    // Initial calculation
    calculateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateProgress);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [calculateProgress, throttledUpdate]);

  return {
    progress,
    scrollY,
    scrollHeight,
    clientHeight,
    isScrolled,
  };
}

// Hook for tracking scroll progress of a specific element
export function useElementScrollProgress(
  elementRef: React.RefObject<HTMLElement>,
  options: ScrollProgressOptions = {}
): ScrollProgressReturn {
  const { throttleMs = 16 } = options;
  
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const lastUpdateRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const calculateProgress = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + window.scrollY;
    const elementHeight = element.scrollHeight;
    const viewportHeight = window.innerHeight;
    
    // Calculate how much of the element has been scrolled through
    const scrollTop = window.scrollY - elementTop + viewportHeight;
    const scrollableHeight = elementHeight + viewportHeight;
    
    const progressValue = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;
    
    setProgress(Math.min(Math.max(progressValue, 0), 1));
    setScrollY(window.scrollY);
    setScrollHeight(elementHeight);
    setClientHeight(viewportHeight);
    setIsScrolled(window.scrollY > elementTop);
  }, [elementRef]);

  const throttledUpdate = useCallback(() => {
    const now = Date.now();
    
    if (now - lastUpdateRef.current >= throttleMs) {
      calculateProgress();
      lastUpdateRef.current = now;
    }
    
    rafRef.current = null;
  }, [calculateProgress, throttleMs]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(throttledUpdate);
      }
    };

    calculateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateProgress);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [calculateProgress, throttledUpdate]);

  return {
    progress,
    scrollY,
    scrollHeight,
    clientHeight,
    isScrolled,
  };
}

export default useScrollProgress;
