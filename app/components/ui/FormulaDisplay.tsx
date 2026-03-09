'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Calculator, Info, ChevronDown, ChevronUp } from 'lucide-react';

// Nokia Blue color
const NOKIA_BLUE = '#005AFF';

interface VariableExplanation {
  symbol: string;
  name: string;
  description: string;
  unit?: string;
  example?: string;
}

interface FormulaDisplayProps {
  formula: string;
  title?: string;
  description?: string;
  specRef?: string;
  variables?: VariableExplanation[];
  latex?: string;
  showVariables?: boolean;
  className?: string;
}

// Simple KaTeX-like rendering for formulas
function renderFormula(formula: string): React.ReactNode {
  // Handle subscripts (e.g., P_max -> P<sub>max</sub>)
  const parts = formula.split(/(_\{[^}]+\}|_[a-zA-Z0-9])/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('_{') && part.endsWith('}')) {
      return <sub key={index}>{part.slice(2, -1)}</sub>;
    }
    if (part.startsWith('_') && part.length > 1) {
      return <sub key={index}>{part.slice(1)}</sub>;
    }
    // Handle superscripts (^)
    if (part.startsWith('^{') && part.endsWith('}')) {
      return <sup key={index}>{part.slice(2, -1)}</sup>;
    }
    if (part.startsWith('^') && part.length > 1) {
      return <sup key={index}>{part.slice(1)}</sup>;
    }
    return part;
  });
}

export function FormulaDisplay({
  formula,
  title,
  description,
  specRef,
  variables = [],
  latex,
  showVariables: initialShowVariables = true,
  className = '',
}: FormulaDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showVariables, setShowVariables] = useState(initialShowVariables);
  const [isLatexLoaded, setIsLatexLoaded] = useState(false);
  const formulaRef = useRef<HTMLDivElement>(null);

  // Try to load KaTeX if available
  useEffect(() => {
    if (latex && typeof window !== 'undefined') {
      // Check if KaTeX is available
      const checkKatex = () => {
        if ((window as unknown as { katex?: { render: (latex: string, element: HTMLElement) => void } }).katex && formulaRef.current) {
          setIsLatexLoaded(true);
          try {
            (window as unknown as { katex: { render: (latex: string, element: HTMLElement) => void } }).katex.render(
              latex,
              formulaRef.current
            );
          } catch (e) {
            console.warn('KaTeX rendering failed:', e);
          }
        }
      };

      // Check immediately and after a short delay
      checkKatex();
      const timer = setTimeout(checkKatex, 100);
      return () => clearTimeout(timer);
    }
  }, [latex]);

  const handleCopy = async () => {
    const textToCopy = latex || formula;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy formula:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden ${className}`}
    >
      {/* Header */}
      {(title || specRef) && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5" style={{ color: NOKIA_BLUE }} />
              <div>
                {title && (
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                )}
                {specRef && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {specRef}
                  </p>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Copy formula"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
      )}

      {/* Formula Display */}
      <div className="p-6 bg-gray-50 dark:bg-slate-800/30">
        <div className="flex items-center justify-center">
          <div
            ref={formulaRef}
            className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 dark:text-white text-center py-4 px-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            {!isLatexLoaded && renderFormula(formula)}
          </div>
        </div>

        {description && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            {description}
          </p>
        )}
      </div>

      {/* Variables Section */}
      {variables.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setShowVariables(!showVariables)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" style={{ color: NOKIA_BLUE }} />
              <span>Variable Definitions ({variables.length})</span>
            </div>
            <motion.div
              animate={{ rotate: showVariables ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: showVariables ? 'auto' : 0,
              opacity: showVariables ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div className="grid gap-3">
                {variables.map((variable, index) => (
                  <motion.div
                    key={variable.symbol}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50"
                  >
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-mono text-lg font-bold"
                      style={{
                        backgroundColor: `${NOKIA_BLUE}15`,
                        color: NOKIA_BLUE,
                      }}
                    >
                      {variable.symbol}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {variable.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        {variable.description}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        {variable.unit && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            Unit: {variable.unit}
                          </span>
                        )}
                        {variable.example && (
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            e.g., {variable.example}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// Interactive formula calculator component
interface FormulaCalculatorProps {
  formula: string;
  variables: Array<VariableExplanation & { value: number; min?: number; max?: number; step?: number }>;
  onCalculate: (values: Record<string, number>) => number;
  title?: string;
  unit?: string;
}

export function FormulaCalculator({
  formula,
  variables,
  onCalculate,
  title = 'Formula Calculator',
  unit = '',
}: FormulaCalculatorProps) {
  const [values, setValues] = useState<Record<string, number>>(() =>
    variables.reduce((acc, v) => ({ ...acc, [v.symbol]: v.value }), {})
  );
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    const calculatedResult = onCalculate(values);
    setResult(calculatedResult);
  };

  useEffect(() => {
    handleCalculate();
  }, [values]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5" style={{ color: NOKIA_BLUE }} />
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      </div>

      <div className="p-4">
        {/* Formula Display */}
        <div className="text-center text-xl font-serif text-gray-900 dark:text-white mb-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
          {renderFormula(formula)}
        </div>

        {/* Input Sliders */}
        <div className="space-y-4">
          {variables.map((variable) => (
            <div key={variable.symbol} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {variable.name} ({variable.symbol})
                </label>
                <span className="text-sm font-mono text-blue-600 dark:text-blue-400">
                  {values[variable.symbol]}
                  {variable.unit}
                </span>
              </div>
              <input
                type="range"
                min={variable.min ?? 0}
                max={variable.max ?? 100}
                step={variable.step ?? 1}
                value={values[variable.symbol]}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [variable.symbol]: parseFloat(e.target.value),
                  }))
                }
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {variable.min ?? 0}
                  {variable.unit}
                </span>
                <span>
                  {variable.max ?? 100}
                  {variable.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Result */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 rounded-xl text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Result</div>
          <div
            className="text-3xl font-bold"
            style={{ color: NOKIA_BLUE }}
          >
            {result?.toFixed(2) ?? '--'}
            {unit}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormulaDisplay;
