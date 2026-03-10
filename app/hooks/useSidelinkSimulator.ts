/**
 * Sidelink Simulator Hook
 * Manages state and simulation logic for sidelink visualizations
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  SidelinkUE,
  SidelinkConnection,
  SidelinkResourcePool,
  DiscoveryMessage,
  SidelinkSyncSignal,
  SidelinkMeasurement,
  SidelinkMode,
  ResourcePoolType,
  SidelinkDiscoveryType,
} from '../types/sidelink';

// Initial demo data
const createInitialUEs = (): SidelinkUE[] => [
  {
    id: 'ue1',
    name: 'Vehicle A',
    x: 200,
    y: 200,
    role: 'transmitter',
    signalStrength: -75,
    syncState: 'synced',
    batteryLevel: 85,
    isActive: true,
    color: '#005AFF',
  },
  {
    id: 'ue2',
    name: 'Vehicle B',
    x: 400,
    y: 150,
    role: 'receiver',
    signalStrength: -82,
    syncState: 'synced',
    batteryLevel: 72,
    isActive: true,
    color: '#00C853',
  },
  {
    id: 'ue3',
    name: 'Pedestrian',
    x: 300,
    y: 350,
    role: 'discoverable',
    signalStrength: -68,
    syncState: 'synced',
    batteryLevel: 45,
    isActive: true,
    color: '#FFD600',
  },
  {
    id: 'ue4',
    name: 'RSU',
    x: 500,
    y: 300,
    role: 'relay',
    signalStrength: -60,
    syncState: 'synced',
    batteryLevel: 100,
    isActive: true,
    color: '#8B5CF6',
  },
  {
    id: 'ue5',
    name: 'Cyclist',
    x: 150,
    y: 400,
    role: 'transmitter',
    signalStrength: -88,
    syncState: 'acquiring',
    batteryLevel: 30,
    isActive: true,
    color: '#EC4899',
  },
];

const createInitialConnections = (): SidelinkConnection[] => [
  {
    id: 'conn1',
    sourceId: 'ue1',
    targetId: 'ue2',
    type: 'unicast',
    rsrp: -78,
    rsrq: -12,
    sinr: 15,
    latency: 5,
    isActive: true,
    dataRate: 50,
  },
  {
    id: 'conn2',
    sourceId: 'ue1',
    targetId: 'ue3',
    type: 'broadcast',
    rsrp: -85,
    rsrq: -15,
    sinr: 8,
    latency: 10,
    isActive: true,
    dataRate: 20,
  },
  {
    id: 'conn3',
    sourceId: 'ue4',
    targetId: 'ue2',
    type: 'unicast',
    rsrp: -72,
    rsrq: -10,
    sinr: 20,
    latency: 3,
    isActive: true,
    dataRate: 100,
  },
];

const createInitialResourcePools = (): SidelinkResourcePool[] => [
  {
    id: 'pool1',
    name: 'Control Pool',
    type: 'transmission',
    startPRB: 0,
    numPRBs: 10,
    subframeBitmap: '1111111100000000',
    slotDuration: 1,
    isActive: true,
    color: 'rgba(0, 90, 255, 0.3)',
    priority: 1,
  },
  {
    id: 'pool2',
    name: 'Data Pool A',
    type: 'bilateral',
    startPRB: 10,
    numPRBs: 20,
    subframeBitmap: '0000000011111111',
    slotDuration: 1,
    isActive: true,
    color: 'rgba(0, 200, 83, 0.3)',
    priority: 2,
  },
  {
    id: 'pool3',
    name: 'Discovery Pool',
    type: 'reception',
    startPRB: 30,
    numPRBs: 5,
    subframeBitmap: '1010101010101010',
    slotDuration: 1,
    isActive: true,
    color: 'rgba(255, 214, 0, 0.3)',
    priority: 3,
  },
];

export interface UseSidelinkSimulatorOptions {
  autoStart?: boolean;
  simulationSpeed?: number; // ms per tick
  enableDiscovery?: boolean;
  enableSyncSignals?: boolean;
}

export const useSidelinkSimulator = (options: UseSidelinkSimulatorOptions = {}) => {
  const { autoStart = false, simulationSpeed = 1000, enableDiscovery = true, enableSyncSignals = true } = options;

  const [ues, setUes] = useState<SidelinkUE[]>(createInitialUEs());
  const [connections, setConnections] = useState<SidelinkConnection[]>(createInitialConnections());
  const [resourcePools, setResourcePools] = useState<SidelinkResourcePool[]>(createInitialResourcePools());
  const [discoveryMessages, setDiscoveryMessages] = useState<DiscoveryMessage[]>([]);
  const [syncSignals, setSyncSignals] = useState<SidelinkSyncSignal[]>([]);
  const [measurements, setMeasurements] = useState<SidelinkMeasurement[]>([]);
  const [selectedUE, setSelectedUE] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [simulationTime, setSimulationTime] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const simulationTickRef = useRef(0);

  // Start simulation
  const startSimulation = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setUes(createInitialUEs());
    setConnections(createInitialConnections());
    setResourcePools(createInitialResourcePools());
    setDiscoveryMessages([]);
    setSyncSignals([]);
    setMeasurements([]);
    setSimulationTime(0);
    simulationTickRef.current = 0;
  }, []);

  // Add a new UE
  const addUE = useCallback((ue: Omit<SidelinkUE, 'id'>) => {
    const newUE: SidelinkUE = {
      ...ue,
      id: `ue${Date.now()}`,
    };
    setUes((prev) => [...prev, newUE]);
    return newUE.id;
  }, []);

  // Remove a UE
  const removeUE = useCallback((ueId: string) => {
    setUes((prev) => prev.filter((ue) => ue.id !== ueId));
    setConnections((prev) => prev.filter((conn) => conn.sourceId !== ueId && conn.targetId !== ueId));
  }, []);

  // Update UE position
  const updateUEPosition = useCallback((ueId: string, x: number, y: number) => {
    setUes((prev) =>
      prev.map((ue) => (ue.id === ueId ? { ...ue, x, y } : ue))
    );
  }, []);

  // Toggle UE active state
  const toggleUE = useCallback((ueId: string) => {
    setUes((prev) =>
      prev.map((ue) => (ue.id === ueId ? { ...ue, isActive: !ue.isActive } : ue))
    );
  }, []);

  // Add connection
  const addConnection = useCallback(
    (sourceId: string, targetId: string, type: SidelinkMode = 'unicast') => {
      const newConnection: SidelinkConnection = {
        id: `conn${Date.now()}`,
        sourceId,
        targetId,
        type,
        rsrp: -80 + Math.random() * 20,
        rsrq: -15 + Math.random() * 8,
        sinr: 5 + Math.random() * 20,
        latency: 2 + Math.random() * 10,
        isActive: true,
        dataRate: 10 + Math.random() * 90,
      };
      setConnections((prev) => [...prev, newConnection]);
      return newConnection.id;
    },
    []
  );

  // Remove connection
  const removeConnection = useCallback((connectionId: string) => {
    setConnections((prev) => prev.filter((conn) => conn.id !== connectionId));
  }, []);

  // Send discovery message
  const sendDiscoveryMessage = useCallback(
    (sourceId: string, type: SidelinkDiscoveryType, targetId?: string) => {
      const newMessage: DiscoveryMessage = {
        id: `disc${Date.now()}`,
        sourceId,
        targetId,
        type,
        payloadSize: 50 + Math.floor(Math.random() * 200),
        txPower: 10 + Math.random() * 13,
        range: 100 + Math.random() * 400,
        discovered: false,
        timestamp: Date.now(),
      };
      setDiscoveryMessages((prev) => [...prev.slice(-9), newMessage]);
      return newMessage.id;
    },
    []
  );

  // Update resource pool
  const updateResourcePool = useCallback((poolId: string, updates: Partial<SidelinkResourcePool>) => {
    setResourcePools((prev) =>
      prev.map((pool) => (pool.id === poolId ? { ...pool, ...updates } : pool))
    );
  }, []);

  // Toggle resource pool active state
  const toggleResourcePool = useCallback((poolId: string) => {
    setResourcePools((prev) =>
      prev.map((pool) => (pool.id === poolId ? { ...pool, isActive: !pool.isActive } : pool))
    );
  }, []);

  // Get UE by ID
  const getUE = useCallback(
    (ueId: string) => {
      return ues.find((ue) => ue.id === ueId);
    },
    [ues]
  );

  // Get connections for UE
  const getUEConnections = useCallback(
    (ueId: string) => {
      return connections.filter((conn) => conn.sourceId === ueId || conn.targetId === ueId);
    },
    [connections]
  );

  // Get neighbor UEs (within range)
  const getNeighborUEs = useCallback(
    (ueId: string, range: number = 200) => {
      const ue = getUE(ueId);
      if (!ue) return [];

      return ues.filter((other) => {
        if (other.id === ueId) return false;
        const distance = Math.sqrt(Math.pow(other.x - ue.x, 2) + Math.pow(other.y - ue.y, 2));
        return distance <= range;
      });
    },
    [ues, getUE]
  );

  // Simulation tick effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        simulationTickRef.current += 1;
        setSimulationTime((prev) => prev + simulationSpeed);

        // Update signal strengths with some randomness
        setUes((prev) =>
          prev.map((ue) => ({
            ...ue,
            signalStrength: ue.signalStrength + (Math.random() - 0.5) * 2,
            batteryLevel: Math.max(0, ue.batteryLevel - 0.01),
          }))
        );

        // Update connection metrics
        setConnections((prev) =>
          prev.map((conn) => ({
            ...conn,
            rsrp: conn.rsrp + (Math.random() - 0.5) * 3,
            sinr: Math.max(0, conn.sinr + (Math.random() - 0.5) * 2),
            latency: Math.max(1, conn.latency + (Math.random() - 0.5)),
          }))
        );

        // Random discovery messages
        if (enableDiscovery && Math.random() < 0.3) {
          const randomUE = ues[Math.floor(Math.random() * ues.length)];
          if (randomUE) {
            sendDiscoveryMessage(randomUE.id, Math.random() < 0.5 ? 'open' : 'restricted');
          }
        }

        // Sync signals from gNB-like UEs
        if (enableSyncSignals && simulationTickRef.current % 5 === 0) {
          const syncUE = ues.find((ue) => ue.role === 'relay');
          if (syncUE) {
            const newSignal: SidelinkSyncSignal = {
              id: `sync${Date.now()}`,
              sourceId: syncUE.id,
              x: syncUE.x,
              y: syncUE.y,
              radius: 0,
              strength: 100,
              timestamp: Date.now(),
              sourceType: 'ue',
            };
            setSyncSignals((prev) => [...prev.slice(-4), newSignal]);
          }
        }

        // Update sync signal radii
        setSyncSignals((prev) =>
          prev
            .map((signal) => ({
              ...signal,
              radius: signal.radius + 5,
              strength: signal.strength * 0.95,
            }))
            .filter((signal) => signal.strength > 10)
        );
      }, simulationSpeed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, simulationSpeed, enableDiscovery, enableSyncSignals, ues, sendDiscoveryMessage]);

  return {
    // State
    ues,
    connections,
    resourcePools,
    discoveryMessages,
    syncSignals,
    measurements,
    selectedUE,
    isRunning,
    simulationTime,

    // Actions
    setSelectedUE,
    startSimulation,
    stopSimulation,
    resetSimulation,
    addUE,
    removeUE,
    updateUEPosition,
    toggleUE,
    addConnection,
    removeConnection,
    sendDiscoveryMessage,
    updateResourcePool,
    toggleResourcePool,

    // Queries
    getUE,
    getUEConnections,
    getNeighborUEs,
  };
};

export default useSidelinkSimulator;
