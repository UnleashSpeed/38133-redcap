/**
 * Sidelink Topology Visualizer
 * Shows UE nodes and their sidelink connections in a 2D space
 * Based on 3GPP TS 38.133 clause 10.1A (Sidelink measurements)
 */

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Wifi,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Signal,
  SignalHigh,
  SignalLow,
  Info,
  Play,
  Pause,
  RotateCcw,
  Users,
  Share2,
  Zap,
} from 'lucide-react';
import { SidelinkVisualizerProps, SidelinkUE, SidelinkConnection } from '../../types/sidelink';
import { useSidelinkSimulator } from '../../hooks/useSidelinkSimulator';

// Mode-specific content
const modeContent = {
  fun: {
    title: 'Device Connection Playground 🚗📱',
    description: 'See how devices talk to each other directly without going through a tower!',
    labels: {
      ue: 'Device',
      connection: 'Direct Link',
      signal: 'Signal Strength',
      battery: 'Battery Level',
    },
  },
  researcher: {
    title: 'Sidelink Topology Visualization',
    description: 'Direct UE-to-UE communication topology with real-time link quality metrics.',
    labels: {
      ue: 'UE',
      connection: 'Sidelink Connection',
      signal: 'Signal Strength (dBm)',
      battery: 'Battery Level (%)',
    },
  },
  spec: {
    title: 'Sidelink UE Topology (TS 38.133 clause 10.1A)',
    description: '3GPP compliant visualization of PC5 interface connections and measurements.',
    labels: {
      ue: 'UE (User Equipment)',
      connection: 'PC5 Sidelink',
      signal: 'RSRP/RSRQ',
      battery: 'Power Level',
    },
  },
};

// Get battery icon based on level
const getBatteryIcon = (level: number) => {
  if (level <= 20) return <BatteryLow className="w-4 h-4 text-red-500" />;
  if (level <= 50) return <BatteryMedium className="w-4 h-4 text-yellow-500" />;
  return <BatteryFull className="w-4 h-4 text-green-500" />;
};

// Get signal icon based on strength
const getSignalIcon = (strength: number) => {
  if (strength >= -70) return <SignalHigh className="w-4 h-4 text-green-500" />;
  if (strength >= -85) return <Signal className="w-4 h-4 text-yellow-500" />;
  return <SignalLow className="w-4 h-4 text-red-500" />;
};

// UE Node Component
interface UENodeProps {
  ue: SidelinkUE;
  isSelected: boolean;
  onClick: () => void;
  onDrag: (x: number, y: number) => void;
  mode: 'fun' | 'researcher' | 'spec';
}

const UENode: React.FC<UENodeProps> = ({ ue, isSelected, onClick, onDrag, mode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - ue.x,
      y: e.clientY - ue.y,
    };
  }, [ue.x, ue.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    onDrag(newX, newY);
  }, [isDragging, onDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getRoleIcon = () => {
    switch (ue.role) {
      case 'transmitter':
        return <Radio className="w-5 h-5" />;
      case 'receiver':
        return <Wifi className="w-5 h-5" />;
      case 'relay':
        return <Share2 className="w-5 h-5" />;
      case 'discoverable':
        return <Users className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getRoleLabel = () => {
    if (mode === 'fun') {
      switch (ue.role) {
        case 'transmitter': return 'Talker';
        case 'receiver': return 'Listener';
        case 'relay': return 'Helper';
        case 'discoverable': return 'Finder';
        default: return 'Device';
      }
    }
    return ue.role;
  };

  return (
    <motion.div
      ref={nodeRef}
      className={`absolute cursor-pointer select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ left: ue.x, top: ue.y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: ue.isActive ? 1 : 0.4 }}
      whileHover={{ scale: 1.1 }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={onClick}
    >
      {/* Selection ring */}
      {isSelected && (
        <motion.div
          className="absolute -inset-4 rounded-full border-2 border-dashed"
          style={{ borderColor: ue.color }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Sync indicator */}
      {ue.syncState === 'synced' && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      {ue.syncState === 'acquiring' && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-500"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}

      {/* Node circle */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-shadow"
        style={{ backgroundColor: ue.color }}
      >
        <span className="text-white">{getRoleIcon()}</span>
      </div>

      {/* Label */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{ue.name}</p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center">{getRoleLabel()}</p>
      </div>

      {/* Signal strength indicator */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white dark:bg-gray-800 rounded-full px-2 py-0.5 shadow-sm">
        {getSignalIcon(ue.signalStrength)}
        <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
          {Math.round(ue.signalStrength)} dBm
        </span>
      </div>
    </motion.div>
  );
};

// Connection Line Component
interface ConnectionLineProps {
  connection: SidelinkConnection;
  sourceUE: SidelinkUE;
  targetUE: SidelinkUE;
  isHighlighted: boolean;
  mode: 'fun' | 'researcher' | 'spec';
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  sourceUE,
  targetUE,
  isHighlighted,
  mode,
}) => {
  if (!sourceUE || !targetUE) return null;

  const dx = targetUE.x - sourceUE.x;
  const dy = targetUE.y - sourceUE.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  const getConnectionColor = () => {
    if (!connection.isActive) return '#9CA3AF';
    if (connection.sinr > 15) return '#22C55E';
    if (connection.sinr > 8) return '#EAB308';
    return '#EF4444';
  };

  const getConnectionStyle = () => {
    switch (connection.type) {
      case 'unicast':
        return { strokeDasharray: '0' };
      case 'groupcast':
        return { strokeDasharray: '5,5' };
      case 'broadcast':
        return { strokeDasharray: '10,5,2,5' };
      default:
        return { strokeDasharray: '0' };
    }
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: sourceUE.x + 24,
        top: sourceUE.y + 24,
        width: length,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 50%',
      }}
    >
      {/* Main line */}
      <div
        className="h-0.5 rounded-full"
        style={{
          width: '100%',
          backgroundColor: getConnectionColor(),
          opacity: isHighlighted ? 1 : 0.5,
          ...getConnectionStyle(),
        }}
      />

      {/* Data flow animation */}
      {connection.isActive && (
        <motion.div
          className="absolute top-0 w-2 h-2 rounded-full"
          style={{ backgroundColor: getConnectionColor() }}
          animate={{ left: ['0%', '100%'] }}
          transition={{ duration: 1 / (connection.dataRate / 50), repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Metrics tooltip on hover */}
      {isHighlighted && mode !== 'fun' && (
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 whitespace-nowrap z-10"
          style={{ transform: `rotate(${-angle}deg)` }}
        >
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {mode === 'spec' ? 'PC5 Link' : 'Sidelink'}
          </p>
          <p className="text-[10px] text-gray-500">RSRP: {Math.round(connection.rsrp)} dBm</p>
          <p className="text-[10px] text-gray-500">SINR: {Math.round(connection.sinr)} dB</p>
          <p className="text-[10px] text-gray-500">Latency: {connection.latency.toFixed(1)} ms</p>
        </div>
      )}
    </div>
  );
};

// Sync Signal Wave Component
interface SyncSignalWaveProps {
  x: number;
  y: number;
  radius: number;
  strength: number;
  color: string;
}

const SyncSignalWave: React.FC<SyncSignalWaveProps> = ({ x, y, radius, strength, color }) => {
  return (
    <motion.div
      className="absolute rounded-full border-2 pointer-events-none"
      style={{
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        borderColor: color,
        opacity: strength / 100,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: strength / 200 }}
      exit={{ opacity: 0 }}
    />
  );
};

// Main Component
export const SidelinkTopologyVisualizer: React.FC<SidelinkVisualizerProps> = ({
  mode,
  width = 600,
  height = 450,
  showGrid = true,
  enableInteraction = true,
}) => {
  const {
    ues,
    connections,
    syncSignals,
    selectedUE,
    isRunning,
    setSelectedUE,
    startSimulation,
    stopSimulation,
    resetSimulation,
    updateUEPosition,
    getUEConnections,
  } = useSidelinkSimulator({ autoStart: true, simulationSpeed: 500 });

  const content = modeContent[mode];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Share2 className="w-6 h-6 text-blue-500" />
          {content.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{content.description}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRunning ? stopSimulation : startSimulation}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Start'} Simulation
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetSimulation}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </motion.button>

        <div className="flex-1" />

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-green-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {mode === 'fun' ? 'Strong Link' : 'High SINR'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-yellow-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {mode === 'fun' ? 'Okay Link' : 'Medium SINR'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-red-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {mode === 'fun' ? 'Weak Link' : 'Low SINR'}
            </span>
          </div>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div
        className="relative bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden"
        style={{ width: '100%', height }}
      >
        {/* Grid */}
        {showGrid && (
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-400" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        )}

        {/* Sync signal waves */}
        <AnimatePresence>
          {syncSignals.map((signal) => (
            <SyncSignalWave
              key={signal.id}
              x={signal.x}
              y={signal.y}
              radius={signal.radius}
              strength={signal.strength}
              color="#8B5CF6"
            />
          ))}
        </AnimatePresence>

        {/* Connection lines */}
        {connections.map((connection) => {
          const sourceUE = ues.find((ue) => ue.id === connection.sourceId);
          const targetUE = ues.find((ue) => ue.id === connection.targetId);
          if (!sourceUE || !targetUE) return null;

          return (
            <ConnectionLine
              key={connection.id}
              connection={connection}
              sourceUE={sourceUE}
              targetUE={targetUE}
              isHighlighted={selectedUE === connection.sourceId || selectedUE === connection.targetId}
              mode={mode}
            />
          );
        })}

        {/* UE nodes */}
        {ues.map((ue) => (
          <UENode
            key={ue.id}
            ue={ue}
            isSelected={selectedUE === ue.id}
            onClick={() => setSelectedUE(selectedUE === ue.id ? null : ue.id)}
            onDrag={(x, y) => enableInteraction && updateUEPosition(ue.id, x, y)}
            mode={mode}
          />
        ))}

        {/* Selected UE info panel */}
        <AnimatePresence>
          {selectedUE && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 max-w-xs"
            >
              {(() => {
                const ue = ues.find((u) => u.id === selectedUE);
                if (!ue) return null;
                const ueConnections = getUEConnections(ue.id);

                return (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: ue.color }} />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{ue.name}</p>
                        <p className="text-xs text-gray-500">{ue.role}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{content.labels.signal}:</span>
                        <span className="font-medium">{Math.round(ue.signalStrength)} dBm</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{content.labels.battery}:</span>
                        <div className="flex items-center gap-1">
                          {getBatteryIcon(ue.batteryLevel)}
                          <span className="font-medium">{Math.round(ue.batteryLevel)}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Sync State:</span>
                        <span className={`font-medium ${
                          ue.syncState === 'synced' ? 'text-green-500' : 'text-yellow-500'
                        }`}>
                          {ue.syncState}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Active Links:</span>
                        <span className="font-medium">{ueConnections.filter(c => c.isActive).length}</span>
                      </div>
                    </div>

                    {mode !== 'fun' && ueConnections.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Link Metrics</p>
                        {ueConnections.slice(0, 3).map((conn) => (
                          <div key={conn.id} className="text-xs text-gray-500">
                            {mode === 'spec' ? `SINR: ${Math.round(conn.sinr)} dB` : `Quality: ${Math.round(conn.sinr)} dB SINR`}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info panel */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {mode === 'fun' ? (
              <>
                <p className="font-medium mb-1">How to explore:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Drag devices around to see how connections change</li>
                  <li>Click on a device to see its details</li>
                  <li>Green lines = strong connection, Red = weak connection</li>
                  <li>Purple waves = synchronization signals from relay devices</li>
                </ul>
              </>
            ) : mode === 'researcher' ? (
              <>
                <p className="font-medium mb-1">Sidelink Topology Information:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Visualizes PC5 interface connections between UEs. The topology shows real-time link quality 
                  metrics including RSRP, RSRQ, and SINR. Sidelink enables direct UE-to-UE communication 
                  bypassing the gNB for reduced latency in V2X scenarios.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium mb-1">3GPP TS 38.133 clause 10.1A:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Sidelink measurements for PC5 interface. Includes PSSCH-RSRP, PSSCH-RSRQ, and PSCCH measurements 
                  for resource selection and link maintenance. Supports both Mode 1 (scheduled) and Mode 2 
                  (autonomous) resource allocation.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidelinkTopologyVisualizer;
