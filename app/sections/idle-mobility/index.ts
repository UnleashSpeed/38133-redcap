/**
 * Idle Mobility Section - Index
 * 
 * 3GPP TS 38.133 Clause 4.2B - Cell Re-selection for RedCap
 * 
 * Exports all components, hooks, and utilities for the Idle Mobility section.
 */

// ============================================================================
// MAIN SECTION
// ============================================================================

export { default as IdleMobilitySection } from '../IdleMobilitySection';
export { default } from '../IdleMobilitySection';

// ============================================================================
// TYPES
// ============================================================================

export type {
  ContentMode,
  FrequencyRange,
  RxConfig,
  MobilityState,
  CellEdgeState,
  MeasurementType,
  DRXConfig,
  SMTCConfig,
  TimingRequirements,
  PhaseTiming,
  RelaxedFactors,
  RelaxedCriteriaConfig,
  NservNoEDRXEntry,
  NservEDRXEntry,
  TimingFormula,
  ContentModeProps,
  CalculatorProps,
  VisualizationProps,
  NservResult,
  TimingResult,
  TimelinePhase,
  TimelineState,
  CSSFValues,
} from './types';

// ============================================================================
// UTILITIES
// ============================================================================

export {
  // Data Tables
  NSERV_TABLE_NO_EDRX,
  NSERV_TABLE_EDRX_FR1,
  NSERV_TABLE_EDRX_FR2,
  TMEASURE_INTRA_2RX,
  TMEASURE_INTRA_1RX,
  TDETECT_INTER_2RX,
  TDETECT_INTER_1RX,
  CSSF_VALUES,
  
  // Calculation Functions
  calculateM1Factor,
  calculateNservNoEDRX,
  calculateNservEDRX,
  calculateTmeasureIntra,
  calculateTdetectInter,
  calculateRelaxedTiming,
  formatTime,
  getDRXOptions,
  getEDRXOptions,
  getPTWOptions,
  calculateTotalReselectionTime,
  getTimingRequirements,
} from './utils';

// ============================================================================
// HOOKS
// ============================================================================

export {
  useNservCalculator,
  useTimingCalculator,
  useScenarioConfig,
  useTimelineAnimation,
} from './hooks';

export type {
  UseNservCalculatorReturn,
  UseTimingCalculatorReturn,
  UseScenarioConfigReturn,
  UseTimelineAnimationReturn,
} from './hooks';

// ============================================================================
// COMPONENTS
// ============================================================================

export {
  ModeSelector,
  NservCalculator,
  TimelineAnimator,
  RelaxedCriteriaVisualizer,
  RxComparisonDashboard,
  ScenarioToggles,
  InteractiveTables,
} from './components';
