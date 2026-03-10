/**
 * Sidelink (SL) Types for RedCap
 * Based on 3GPP TS 38.133 clause 10.1A (Sidelink measurements)
 * and TS 38.331 (Sidelink resource allocation)
 */

import { ContentMode } from './rlm';

export type SidelinkMode = 'unicast' | 'groupcast' | 'broadcast';
export type SidelinkResourceAllocation = 'mode1' | 'mode2'; // Mode 1 = scheduled, Mode 2 = autonomous
export type SidelinkDiscoveryType = 'open' | 'restricted';
export type SidelinkSyncSource = 'gnb' | 'ue' | 'independent';
export type ResourcePoolType = 'transmission' | 'reception' | 'bilateral';

// Sidelink UE (User Equipment) node
export interface SidelinkUE {
  id: string;
  name: string;
  x: number;
  y: number;
  role: 'transmitter' | 'receiver' | 'relay' | 'discoverable';
  signalStrength: number; // dBm
  syncState: 'synced' | 'unsynced' | 'acquiring';
  batteryLevel: number; // percentage
  isActive: boolean;
  color: string;
}

// Sidelink connection/link between UEs
export interface SidelinkConnection {
  id: string;
  sourceId: string;
  targetId: string;
  type: SidelinkMode;
  rsrp: number; // Reference Signal Received Power
  rsrq: number; // Reference Signal Received Quality
  sinr: number; // Signal to Interference plus Noise Ratio
  latency: number; // ms
  isActive: boolean;
  dataRate: number; // Mbps
}

// Sidelink Resource Pool
export interface SidelinkResourcePool {
  id: string;
  name: string;
  type: ResourcePoolType;
  startPRB: number;
  numPRBs: number;
  subframeBitmap: string; // Bitmap for subframe allocation
  slotDuration: number; // ms
  isActive: boolean;
  color: string;
  priority: number;
}

// PSCCH (Physical Sidelink Control Channel) configuration
export interface PSCCHConfig {
  numSubchannels: number;
  subchannelSize: number; // PRBs
  startRB: number;
  reservedRBs: number[];
}

// PSSCH (Physical Sidelink Shared Channel) configuration
export interface PSSCHConfig {
  mcs: number; // Modulation and Coding Scheme
  numLayers: number;
  dmrsType: 'type1' | 'type2';
}

// Sidelink Discovery message
export interface DiscoveryMessage {
  id: string;
  sourceId: string;
  targetId?: string; // undefined for broadcast discovery
  type: SidelinkDiscoveryType;
  payloadSize: number; // bytes
  txPower: number; // dBm
  range: number; // meters
  discovered: boolean;
  timestamp: number;
}

// Sidelink synchronization signal
export interface SidelinkSyncSignal {
  id: string;
  sourceId: string;
  x: number;
  y: number;
  radius: number;
  strength: number;
  timestamp: number;
  sourceType: SidelinkSyncSource;
}

// Sidelink measurement results
export interface SidelinkMeasurement {
  ueId: string;
  targetUeId: string;
  rsrp_dBm: number;
  rsrq_dB: number;
  sinr_dB: number;
  timestamp: number;
}

// Simulation state for sidelink
export interface SidelinkSimulationState {
  ues: SidelinkUE[];
  connections: SidelinkConnection[];
  resourcePools: SidelinkResourcePool[];
  discoveryMessages: DiscoveryMessage[];
  syncSignals: SidelinkSyncSignal[];
  measurements: SidelinkMeasurement[];
  selectedUE: string | null;
  isRunning: boolean;
  simulationTime: number;
}

// Sidelink visualization props
export interface SidelinkVisualizerProps {
  mode: ContentMode;
  width?: number;
  height?: number;
  showGrid?: boolean;
  enableInteraction?: boolean;
}

// Resource pool visualization data
export interface ResourcePoolGrid {
  totalPRBs: number;
  totalSlots: number;
  poolAllocations: {
    poolId: string;
    color: string;
    slots: number[];
    prbs: number[];
  }[];
}

// Sidelink zone configuration for broadcast
export interface SidelinkZone {
  id: string;
  name: string;
  centerX: number;
  centerY: number;
  radius: number;
  type: 'coverage' | 'interference' | 'restricted';
  color: string;
  opacity: number;
}

// Mode-specific content
export interface SidelinkContent {
  title: string;
  description: string;
  labels: {
    ue: string;
    connection: string;
    resourcePool: string;
    discovery: string;
    sync: string;
  };
}
