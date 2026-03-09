/**
 * Idle Mobility Types
 * 
 * 3GPP TS 38.133 Clause 4.2B - Cell Re-selection for RedCap
 * TypeScript type definitions
 */

// ============================================================================
// CONTENT MODE
// ============================================================================

/**
 * Content display mode for educational content
 * - 'fun': Simplified, engaging explanations
 * - 'researcher': Technical details with practical context
 * - 'spec': Precise 3GPP specification references
 */
export type ContentMode = 'fun' | 'researcher' | 'spec';

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Frequency Range for NR operation
 * - 'FR1': Sub-6GHz (450 MHz - 7.125 GHz)
 * - 'FR2': mmWave (24.25 GHz - 52.6 GHz)
 */
export type FrequencyRange = 'FR1' | 'FR2';

/**
 * Receiver configuration
 * - '1Rx': Single receive chain (power saving)
 * - '2Rx': Dual receive chains (better performance)
 */
export type RxConfig = '1Rx' | '2Rx';

/**
 * Mobility state for relaxed measurement criteria
 * - 'normal': Regular mobility
 * - 'stationary': UE is not moving
 * - 'low_mobility': UE moving slowly
 */
export type MobilityState = 'normal' | 'stationary' | 'low_mobility';

/**
 * Cell edge state for relaxed measurement criteria
 * - 'normal': At or near cell edge (Srxlev ≤ 4dB)
 * - 'not_at_edge': Good coverage (Srxlev > 4dB)
 */
export type CellEdgeState = 'normal' | 'not_at_edge';

/**
 * Measurement type
 * - 'intra': Same frequency measurements
 * - 'inter': Different frequency measurements
 */
export type MeasurementType = 'intra' | 'inter';

// ============================================================================
// DRX CONFIGURATION
// ============================================================================

/**
 * DRX (Discontinuous Reception) configuration
 */
export interface DRXConfig {
  /** DRX cycle length in seconds */
  cycle: number;
  /** Whether eDRX is enabled */
  isEDRX: boolean;
  /** Paging Time Window in seconds (eDRX only) */
  ptw?: number;
}

/**
 * SMTC (Synchronous Measurement Timing Configuration)
 */
export interface SMTCConfig {
  /** SMTC duration in ms */
  duration: number;
  /** SMTC periodicity in ms */
  periodicity: number;
}

// ============================================================================
// TIMING REQUIREMENTS
// ============================================================================

/**
 * Cell reselection timing requirements
 */
export interface TimingRequirements {
  /** Cell detection time in ms */
  tDetect: number;
  /** Signal measurement time in ms */
  tMeasure: number;
  /** Evaluation time in ms */
  tEvaluate: number;
  /** Number of DRX cycles for evaluation */
  nserv: number;
}

/**
 * Phase timing for timeline visualization
 */
export interface PhaseTiming {
  /** Detection phase duration in ms */
  detect: number;
  /** Measurement phase duration in ms */
  measure: number;
  /** Evaluation phase duration in ms */
  evaluate: number;
}

// ============================================================================
// RELAXED CRITERIA
// ============================================================================

/**
 * Relaxed measurement criteria factors (K1, K2, K3)
 * 
 * Per 3GPP TS 38.133 clause 4.2B.2.4
 */
export interface RelaxedFactors {
  /** K1: Stationary or low mobility */
  k1: boolean;
  /** K2: Not at cell edge (Srxlev > 4dB) */
  k2: boolean;
  /** K3: K1 AND K2 (both conditions) */
  k3: boolean;
}

/**
 * Relaxed criteria configuration
 */
export interface RelaxedCriteriaConfig {
  /** Whether relaxed criteria are enabled */
  enabled: boolean;
  /** Active factors */
  factors: RelaxedFactors;
  /** Multiplier applied to timing (e.g., 1.5, 2.0) */
  multiplier: number;
}

// ============================================================================
// TABLE DATA
// ============================================================================

/**
 * Nserv table entry for non-eDRX configuration
 */
export interface NservNoEDRXEntry {
  /** DRX cycle in seconds */
  drx: number;
  /** Nserv value */
  nserv: number;
}

/**
 * Nserv table entry for eDRX configuration
 */
export interface NservEDRXEntry {
  /** eDRX cycle in seconds */
  edrx: number;
  /** Paging Time Window in seconds */
  ptw: number;
  /** Nserv value */
  nserv: number;
}

/**
 * Timing formula entry
 */
export interface TimingFormula {
  /** Configuration type */
  config: RxConfig;
  /** Formula string */
  formula: string;
  /** Multiplier for SMTC */
  smtcMultiplier: number;
  /** Base time in ms */
  baseTime: number;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Props for components that support content modes
 */
export interface ContentModeProps {
  /** Current content display mode */
  mode: ContentMode;
}

/**
 * Props for calculator components
 */
export interface CalculatorProps extends ContentModeProps {
  /** Callback when calculation changes */
  onChange?: (result: number) => void;
}

/**
 * Props for visualization components
 */
export interface VisualizationProps extends ContentModeProps {
  /** Whether to show animations */
  animated?: boolean;
}

// ============================================================================
// CALCULATION RESULTS
// ============================================================================

/**
 * Nserv calculation result
 */
export interface NservResult {
  /** Base Nserv value from table */
  baseNserv: number;
  /** M1 factor (1 or 2) */
  m1Factor: number;
  /** Effective Nserv (base × M1) */
  effectiveNserv: number;
  /** DRX cycle used */
  drxCycle: number;
  /** Whether eDRX was used */
  isEDRX: boolean;
}

/**
 * Timing calculation result
 */
export interface TimingResult {
  /** Tdetect value in ms */
  tDetect: number;
  /** Tmeasure value in ms */
  tMeasure: number;
  /** Tevaluate value in ms */
  tEvaluate: number;
  /** Total reselection time in ms */
  totalTime: number;
  /** Whether relaxed criteria were applied */
  relaxed: boolean;
  /** Applied multiplier */
  multiplier: number;
}

// ============================================================================
// ANIMATION TYPES
// ============================================================================

/**
 * Timeline animation phase
 */
export type TimelinePhase = 'detect' | 'measure' | 'evaluate' | 'complete';

/**
 * Timeline animation state
 */
export interface TimelineState {
  /** Current phase */
  phase: TimelinePhase;
  /** Progress percentage (0-100) */
  progress: number;
  /** Whether animation is playing */
  isPlaying: boolean;
}

// ============================================================================
// CSSF VALUES
// ============================================================================

/**
 * CSSF (Cell Selection and re-Selection Factor) values
 * Per 3GPP TS 38.133
 */
export interface CSSFValues {
  /** Intra-frequency CSSF */
  intraFreq: number;
  /** Inter-frequency CSSF */
  interFreq: number;
  /** Inter-RAT CSSF */
  interRAT: number;
}
