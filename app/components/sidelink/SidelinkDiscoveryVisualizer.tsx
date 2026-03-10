/**
 * Sidelink Discovery Visualizer
 * Visualizes the discovery process for finding nearby UEs
 * Based on 3GPP TS 38.331 (Sidelink discovery procedures)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Radio,
  Users,
  Shield,
  Globe,
  Info,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Signal,
  Clock,
  Zap,
} from 'lucide-react';
import { SidelinkVisualizerProps, SidelinkDiscoveryType, DiscoveryMessage } from '../../types/sidelink';
import { useSidelinkSimulator } from '../../hooks/useSidelinkSimulator';

// Mode-specific content
const modeContent = {
  fun: {
    title: 'Find Nearby Friends 🔍',
    description: 'Watch how devices discover each other without any central help!',
    labels: {
      open: 'Public Hello',
      restricted: 'Private Invite',
      discovered: 'Found!',
      searching: 'Looking...',
      range: 'Range',
      power: 'Power',
    },
  },
  researcher: {
    title: 'Sidelink Discovery Procedure',
    description: 'Model A (open) and Model B (restricted) discovery mechanisms.',
    labels: {
      open: 'Model A (Open)',
      restricted: 'Model B (Restricted)',
      discovered: 'Discovered',
      searching: 'Announcing/Monitoring',
      range: 'Range (m)',
      power: 'Tx Power (dBm)',
    },
  },
  spec: {
    title: 'Sidelink Discovery (TS 38.331)',
    description: 'SL-RRC configured discovery procedures with open and restricted discovery.',
    labels: {
      open: 'Open Discovery (Announcement)',
      restricted: 'Restricted Discovery (Restricted Monitoring)',
      discovered: 'UE Discovered',
      searching: 'TX/RX Active',
      range: 'Discovery Range',
      power: 'TX Power',
    },
  },
};

// Discovery node component
interface DiscoveryNodeProps {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  isTransmitting: boolean;
  discoveryType: SidelinkDiscoveryType;
  isDiscovered: boolean;
  onClick: () => void;
  mode: 'fun' | 'researcher' | 'spec';
}

const DiscoveryNode: React.FC<DiscoveryNodeProps> = ({
  id,
  name,
  x,
  y,
  color,
  isTransmitting,
  discoveryType,
  isDiscovered,
  onClick,
  mode,
}) => {
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: x, top: y }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      {/* Discovery wave animation */}
      <AnimatePresence>
        {isTransmitting && (
          <>
            <motion.div
              className="absolute -inset-8 rounded-full border-2"
              style={{ borderColor: color }}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute -inset-8 rounded-full border-2"
              style={{ borderColor: color }}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Node */}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg relative z-10 ${
          isDiscovered ? 'ring-4 ring-green-400' : ''
        }`}
        style={{ backgroundColor: color }}
      >
        {discoveryType === 'open' ? (
          <Globe className="w-6 h-6 text-white" />
        ) : (
          <Shield className="w-6 h-6 text-white" />
        )}
      </div>

      {/* Status indicator */}
      {isTransmitting && (
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}

      {/* Discovered indicator */}
      {isDiscovered && (
        <motion.div
          className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Signal className="w-3 h-3 text-white" />
        </motion.div>
      )}

      {/* Label */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{name}</p>
        <p className="text-[10px] text-gray-500">
          {mode === 'fun'
            ? discoveryType === 'open'
              ? 'Public'
              : 'Private'
            : discoveryType}
        </p>
      </div>
    </motion.div>
  );
};

// Discovery message item
interface MessageItemProps {
  message: DiscoveryMessage & { sourceName: string };
  mode: 'fun' | 'researcher' | 'spec';
  labels: typeof modeContent.researcher.labels;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, mode, labels }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          message.type === 'open' ? 'bg-blue-500' : 'bg-purple-500'
        }`}
      >
        {message.type === 'open' ? (
          <Globe className="w-4 h-4 text-white" />
        ) : (
          <Shield className="w-4 h-4 text-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {message.sourceName}
        </p>
        <p className="text-xs text-gray-500">
          {message.type === 'open' ? labels.open : labels.restricted} • {message.payloadSize} bytes
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{Math.round(message.range)}m</p>
        <p className="text-[10px] text-gray-500">{Math.round(message.txPower)} dBm</p>
      </div>
    </motion.div>
  );
};

// Main component
export const SidelinkDiscoveryVisualizer: React.FC<SidelinkVisualizerProps> = ({
  mode,
  width = 600,
  height = 450,
  enableInteraction = true,
}) => {
  const content = modeContent[mode];
  const {
    ues,
    discoveryMessages,
    isRunning,
    startSimulation,
    stopSimulation,
    resetSimulation,
    sendDiscoveryMessage,
    getNeighborUEs,
  } = useSidelinkSimulator({ autoStart: true, simulationSpeed: 2000 });

  const [selectedUE, setSelectedUE] = useState<string | null>(null);
  const [discoveredPairs, setDiscoveredPairs] = useState<Set<string>>(new Set());

  // Initial positions for discovery nodes
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({
    ue1: { x: 150, y: 150 },
    ue2: { x: 400, y: 120 },
    ue3: { x: 300, y: 280 },
    ue4: { x: 100, y: 300 },
  });

  // Discovery types for each UE
  const [discoveryTypes, setDiscoveryTypes] = useState<Record<string, SidelinkDiscoveryType>>({
    ue1: 'open',
    ue2: 'restricted',
    ue3: 'open',
    ue4: 'restricted',
  });

  // Check for discoveries when messages are sent
  useEffect(() => {
    discoveryMessages.forEach((msg) => {
      const sourcePos = nodePositions[msg.sourceId];
      if (!sourcePos) return;

      ues.forEach((ue) => {
        if (ue.id === msg.sourceId) return;

        const targetPos = nodePositions[ue.id];
        if (!targetPos) return;

        const distance = Math.sqrt(
          Math.pow(targetPos.x - sourcePos.x, 2) + Math.pow(targetPos.y - sourcePos.y, 2)
        );

        // Check if within range
        const range = msg.range * 0.5; // Scale down for visualization
        if (distance <= range) {
          const pairId = [msg.sourceId, ue.id].sort().join('-');
          setDiscoveredPairs((prev) => new Set([...prev, pairId]));
        }
      });
    });
  }, [discoveryMessages, nodePositions, ues]);

  // Manual send discovery
  const handleSendDiscovery = useCallback(
    (ueId: string) => {
      const type = discoveryTypes[ueId] || 'open';
      sendDiscoveryMessage(ueId, type);
    },
    [discoveryTypes, sendDiscoveryMessage]
  );

  // Toggle discovery type
  const toggleDiscoveryType = useCallback((ueId: string) => {
    setDiscoveryTypes((prev) => ({
      ...prev,
      [ueId]: prev[ueId] === 'open' ? 'restricted' : 'open',
    }));
  }, []);

  // Get messages with source names
  const messagesWithNames = discoveryMessages.map((msg) => ({
    ...msg,
    sourceName: ues.find((ue) => ue.id === msg.sourceId)?.name || 'Unknown',
  }));

  // Check if UE is discovered by any other
  const isUEDiscovered = (ueId: string) => {
    return Array.from(discoveredPairs).some((pair) => pair.includes(ueId));
  };

  // Check if UE is currently transmitting
  const isTransmitting = (ueId: string) => {
    return messagesWithNames.some((msg) => msg.sourceId === ueId);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-blue-500" />
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
          {isRunning ? 'Pause' : 'Start'} Auto-Discovery
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetSimulation();
            setDiscoveredPairs(new Set());
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </motion.button>

        <div className="flex-1" />

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">{content.labels.open}</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-purple-500" />
            <span className="text-gray-600 dark:text-gray-400">{content.labels.restricted}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Discovery canvas */}
        <div className="flex-1">
          <div
            className="relative bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden"
            style={{ height }}
          >
            {/* Grid background */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="discovery-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill="currentColor" className="text-gray-400" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#discovery-grid)" />
              </svg>
            </div>

            {/* Discovery range circles for selected UE */}
            <AnimatePresence>
              {selectedUE && nodePositions[selectedUE] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute rounded-full border-2 border-blue-500"
                  style={{
                    left: nodePositions[selectedUE].x - 100,
                    top: nodePositions[selectedUE].y - 100,
                    width: 200,
                    height: 200,
                  }}
                />
              )}
            </AnimatePresence>

            {/* Discovery nodes */}
            {ues.slice(0, 4).map((ue) => (
              <DiscoveryNode
                key={ue.id}
                id={ue.id}
                name={ue.name}
                x={nodePositions[ue.id]?.x || 0}
                y={nodePositions[ue.id]?.y || 0}
                color={ue.color}
                isTransmitting={isTransmitting(ue.id)}
                discoveryType={discoveryTypes[ue.id] || 'open'}
                isDiscovered={isUEDiscovered(ue.id)}
                onClick={() => setSelectedUE(selectedUE === ue.id ? null : ue.id)}
                mode={mode}
              />
            ))}

            {/* Connection lines for discovered pairs */}
            <svg className="absolute inset-0 pointer-events-none">
              {Array.from(discoveredPairs).map((pairId) => {
                const [id1, id2] = pairId.split('-');
                const pos1 = nodePositions[id1];
                const pos2 = nodePositions[id2];
                if (!pos1 || !pos2) return null;

                return (
                  <motion.line
                    key={pairId}
                    x1={pos1.x + 28}
                    y1={pos1.y + 28}
                    x2={pos2.x + 28}
                    y2={pos2.y + 28}
                    stroke="#22C55E"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                  />
                );
              })}
            </svg>

            {/* Selected UE info panel */}
            <AnimatePresence>
              {selectedUE && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-4 left-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4"
                >
                  {(() => {
                    const ue = ues.find((u) => u.id === selectedUE);
                    if (!ue) return null;

                    return (
                      <>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: ue.color }}>
                            {discoveryTypes[ue.id] === 'open' ? (
                              <Globe className="w-4 h-4 text-white m-2" />
                            ) : (
                              <Shield className="w-4 h-4 text-white m-2" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{ue.name}</p>
                            <p className="text-xs text-gray-500">
                              {discoveryTypes[ue.id] === 'open' ? content.labels.open : content.labels.restricted}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button
                            onClick={() => handleSendDiscovery(ue.id)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <Radio className="w-4 h-4" />
                            Send Discovery
                          </button>

                          <button
                            onClick={() => toggleDiscoveryType(ue.id)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                          >
                            {discoveryTypes[ue.id] === 'open' ? (
                              <>
                                <Shield className="w-4 h-4" />
                                Switch to Restricted
                              </>
                            ) : (
                              <>
                                <Globe className="w-4 h-4" />
                                Switch to Open
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Messages panel */}
        <div className="w-full lg:w-72">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4" />
            Recent Messages
          </h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            <AnimatePresence>
              {messagesWithNames.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No discovery messages yet</p>
              ) : (
                messagesWithNames.slice(-5).reverse().map((msg) => (
                  <MessageItem
                    key={msg.id}
                    message={msg}
                    mode={mode}
                    labels={content.labels}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Stats */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Discovered pairs:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{discoveredPairs.size}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-gray-600 dark:text-gray-400">Messages sent:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{discoveryMessages.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info panel */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {mode === 'fun' ? (
              <>
                <p className="font-medium mb-1">How discovery works:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Click a device to send discovery messages</li>
                  <li>Public devices can be found by anyone nearby</li>
                  <li>Private devices only respond to authorized requests</li>
                  <li>Green lines show when devices have found each other</li>
                </ul>
              </>
            ) : mode === 'researcher' ? (
              <>
                <p className="font-medium mb-1">Sidelink Discovery Mechanisms:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Model A (Open):</strong> UE announces its presence with discovery messages. Any monitoring UE 
                  can receive and discover the announcing UE.<br />
                  <strong>Model B (Restricted):</strong> UE monitors for discovery messages from specific UEs. 
                  Discovery is restricted to authorized UE groups.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium mb-1">3GPP TS 38.331 Discovery Configuration:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Sidelink discovery procedures configured via SL-ConfigDedicatedEUTRA or SL-ConfigDedicatedNR. 
                  Discovery resources are configured per pool with specific PSDCH (Physical Sidelink Discovery Channel) 
                  resources. SL-RRC manages discovery message composition including ProSe Application Code and 
                  discovery message payload.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidelinkDiscoveryVisualizer;
