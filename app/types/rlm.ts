/**
 * RLM (Radio Link Monitoring) Types for RedCap
 * Based on 3GPP TS 38.133 clause 8.1B
 */

export type RLMMode = 'SSB' | 'CSI-RS';
export type RxConfig = '1Rx' | '2Rx';
export type FrequencyRange = 'FR1' | 'FR2';
export type ContentMode = 'fun' | 'researcher' | 'spec';
export type SyncState = 'in-sync' | 'out-of-sync' | 'transitioning';

// PDCCH Parameters from Tables 8.1B.2.1-1 and 8.1B.2.1-2
export interface PDCCHParams {
  dciFormat: string;
  ofdmSymbols: number;
  aggregationLevel: number;
  bandwidthPRBs: number;
  ratioPDCCHtoSSS_dB: number;
}

// TEvaluate period configuration
export interface TEvaluateConfig {
  frequencyRange: FrequencyRange;
  rxConfig: RxConfig;
  drxCycle: 'no-drx' | '320ms' | '640ms' | '1280ms';
  pFactor: number;
  tSSB_ms: number;
  nResources?: number; // N for FR2
}

// RLM Resource Configuration
export interface RLMResourceConfig {
  frequencyRange: FrequencyRange;
  maxNRLMResources: number;
  blerOut: number;
  blerIn: number;
}

// CSI-RS Configuration
export interface CSIRSConfig {
  rxConfig: RxConfig;
  mOut: number;
  mIn: number;
  tCSIRS_ms: number;
}

// P-Factor calculation parameters
export interface PFactorParams {
  tSSB_ms: number;
  mgrp_ms: number;
  smtcDuration_ms?: number;
  smtcPeriodicity_ms?: number;
  frequencyRange: FrequencyRange;
  gapOverlap: boolean;
}

// Signal quality metrics
export interface SignalQuality {
  snr_dB: number;
  rsrp_dBm: number;
  bler_percent: number;
  timestamp: number;
}

// Qout/Qin thresholds
export interface RLMThresholds {
  qOut_dB: number;
  qIn_dB: number;
  blerOut: number;
  blerIn: number;
}

// Evaluation period result
export interface TEvaluateResult {
  formula: string;
  calculation: string;
  result_ms: number;
  result_sf: number;
}

// Table data for interactive tables
export interface TableRow {
  [key: string]: string | number;
}

export interface SpecTable {
  id: string;
  title: string;
  clause: string;
  headers: string[];
  rows: TableRow[];
  footnotes?: string[];
}
