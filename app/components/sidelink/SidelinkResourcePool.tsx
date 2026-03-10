/**
 * Sidelink Resource Pool Visualizer
 * Visualizes PRB (Physical Resource Block) allocation for sidelink communication
 * Based on 3GPP TS 38.214 (Sidelink resource allocation)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid3X3,
  Layers,
  Calendar,
  Settings2,
  Info,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  Radio,
  ArrowLeftRight,
} from 'lucide-react';
import { SidelinkVisualizerProps, SidelinkResourcePool, ResourcePoolType } from '../../types/sidelink';

// Mode-specific content
const modeContent = {
  fun: {
    title: 'Communication Channels 📡',
    description: 'See how devices share the airwaves to talk to each other!',
    labels: {
      prb: 'Channel Block',
      slot: 'Time Slot',
      transmission: 'Talk Channel',
      reception: 'Listen Channel',
      bilateral: 'Talk & Listen',
      poolName: 'Channel Group',
    },
  },
  researcher: {
    title: 'Sidelink Resource Pool Allocation',
    description: 'PRB and slot allocation visualization for sidelink transmission and reception.',
    labels: {
      prb: 'PRB',
      slot: 'Slot',
      transmission: 'Tx Pool',
      reception: 'Rx Pool',
      bilateral: 'Bi-directional',
      poolName: 'Resource Pool',
    },
  },
  spec: {
    title: 'Sidelink Resource Pool (TS 38.214)',
    description: 'PRB allocation for PSCCH (control) and PSSCH (data) per 3GPP specifications.',
    labels: {
      prb: 'PRB Index',
      slot: 'Slot Number',
      transmission: 'Tx (PSCCH/PSSCH)',
      reception: 'Rx (PSCCH/PSSCH)',
      bilateral: 'Shared Pool',
      poolName: 'SL Resource Pool',
    },
  },
};

// Pool configuration presets
const poolPresets: { name: string; pools: Omit<SidelinkResourcePool, 'id'>[] }[] = [
  {
    name: 'V2X Default',
    pools: [
      { name: 'PSCCH Control', type: 'transmission', startPRB: 0, numPRBs: 10, subframeBitmap: '1111111100000000', slotDuration: 1, isActive: true, color: 'rgba(0, 90, 255, 0.4)', priority: 1 },
      { name: 'PSSCH Data A', type: 'bilateral', startPRB: 10, numPRBs: 20, subframeBitmap: '0000000011111111', slotDuration: 1, isActive: true, color: 'rgba(0, 200, 83, 0.4)', priority: 2 },
      { name: 'PSSCH Data B', type: 'bilateral', startPRB: 30, numPRBs: 20, subframeBitmap: '1111000011110000', slotDuration: 1, isActive: true, color: 'rgba(255, 214, 0, 0.4)', priority: 2 },
    ],
  },
  {
    name: 'D2D Communication',
    pools: [
      { name: 'Discovery', type: 'reception', startPRB: 0, numPRBs: 6, subframeBitmap: '1010101010101010', slotDuration: 1, isActive: true, color: 'rgba(139, 92, 246, 0.4)', priority: 3 },
      { name: 'Data Primary', type: 'bilateral', startPRB: 6, numPRBs: 30, subframeBitmap: '1111111111111111', slotDuration: 1, isActive: true, color: 'rgba(236, 72, 153, 0.4)', priority: 1 },
      { name: 'Control', type: 'transmission', startPRB: 36, numPRBs: 10, subframeBitmap: '0000000000001111', slotDuration: 1, isActive: true, color: 'rgba(6, 182, 212, 0.4)', priority: 1 },
    ],
  },
  {
    name: 'Public Safety',
    pools: [
      { name: 'Emergency Tx', type: 'transmission', startPRB: 0, numPRBs: 15, subframeBitmap: '1111111111111111', slotDuration: 1, isActive: true, color: 'rgba(239, 68, 68, 0.4)', priority: 1 },
      { name: 'Emergency Rx', type: 'reception', startPRB: 15, numPRBs: 15, subframeBitmap: '1111111111111111', slotDuration: 1, isActive: true, color: 'rgba(249, 115, 22, 0.4)', priority: 1 },
      { name: 'General', type: 'bilateral', startPRB: 30, numPRBs: 20, subframeBitmap: '0000111100001111', slotDuration: 1, isActive: true, color: 'rgba(14, 165, 233, 0.4)', priority: 3 },
    ],
  },
];

// Pool card component
interface PoolCardProps {
  pool: SidelinkResourcePool;
  isActive: boolean;
  onToggle: () => void;
  mode: 'fun' | 'researcher' | 'spec';
  labels: typeof modeContent.researcher.labels;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, isActive, onToggle, mode, labels }) => {
  const getTypeIcon = () => {
    switch (pool.type) {
      case 'transmission':
        return <Radio className="w-4 h-4" />;
      case 'reception':
        return <ArrowLeftRight className="w-4 h-4" />;
      case 'bilateral':
        return <Layers className="w-4 h-4" />;
      default:
        return <Grid3X3 className="w-4 h-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (pool.type) {
      case 'transmission':
        return labels.transmission;
      case 'reception':
        return labels.reception;
      case 'bilateral':
        return labels.bilateral;
      default:
        return pool.type;
    }
  };

  return (
    <motion.div
      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
        isActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: pool.color.replace('0.4', '0.2') }}
        >
          <span style={{ color: pool.color.replace('0.4', '1') }}>{getTypeIcon()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{pool.name}</p>
          <p className="text-xs text-gray-500">{getTypeLabel()}</p>
        </div>
        <div
          className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
        />
      </div>
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex justify-between">
          <span>PRBs:</span>
          <span className="font-mono">{pool.startPRB}-{pool.startPRB + pool.numPRBs - 1}</span>
        </div>
        <div className="flex justify-between">
          <span>Priority:</span>
          <span>{pool.priority}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Resource grid cell
interface GridCellProps {
  poolId: string | null;
  poolColor: string;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const GridCell: React.FC<GridCellProps> = ({ poolId, poolColor, isActive, onHover, onLeave }) => {
  return (
    <motion.div
      className="w-full h-full rounded-sm"
      style={{
        backgroundColor: poolId ? poolColor : 'transparent',
        border: poolId ? 'none' : '1px dashed rgba(156, 163, 175, 0.3)',
      }}
      initial={false}
      animate={{
        opacity: isActive ? 1 : poolId ? 0.3 : 0.5,
        scale: isActive ? 1.05 : 1,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    />
  );
};

// Main component
export const SidelinkResourcePool: React.FC<SidelinkVisualizerProps> = ({
  mode,
  width = 600,
  height = 400,
  showGrid = true,
}) => {
  const content = modeContent[mode];
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [activePools, setActivePools] = useState<Set<string>>(() => 
    new Set(poolPresets[0].pools.map((_, i) => `pool-${i}`))
  );
  const [hoveredCell, setHoveredCell] = useState<{ slot: number; prb: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  // Create pools with IDs
  const pools: SidelinkResourcePool[] = useMemo(() => {
    return poolPresets[selectedPreset].pools.map((pool, index) => ({
      ...pool,
      id: `pool-${index}`,
    }));
  }, [selectedPreset]);

  // Grid dimensions
  const numPRBs = 50;
  const numSlots = 16;
  const cellSize = Math.min((width - 150) / numSlots, (height - 100) / numPRBs);

  // Get pool for a specific cell
  const getPoolForCell = (slot: number, prb: number): SidelinkResourcePool | null => {
    for (const pool of pools) {
      if (!activePools.has(pool.id)) continue;
      if (prb < pool.startPRB || prb >= pool.startPRB + pool.numPRBs) continue;
      // Check subframe bitmap
      const slotInPattern = slot % pool.subframeBitmap.length;
      if (pool.subframeBitmap[slotInPattern] === '1') {
        return pool;
      }
    }
    return null;
  };

  // Toggle pool
  const togglePool = (poolId: string) => {
    setActivePools((prev) => {
      const next = new Set(prev);
      if (next.has(poolId)) {
        next.delete(poolId);
      } else {
        next.add(poolId);
      }
      return next;
    });
  };

  // Change preset
  const changePreset = (index: number) => {
    setSelectedPreset(index);
    setActivePools(new Set(poolPresets[index].pools.map((_, i) => `pool-${i}`)));
  };

  // Calculate utilization
  const utilization = useMemo(() => {
    let allocated = 0;
    let total = numPRBs * numSlots;
    for (let slot = 0; slot < numSlots; slot++) {
      for (let prb = 0; prb < numPRBs; prb++) {
        if (getPoolForCell(slot, prb)) {
          allocated++;
        }
      }
    }
    return Math.round((allocated / total) * 100);
  }, [pools, activePools]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Grid3X3 className="w-6 h-6 text-blue-500" />
          {content.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{content.description}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Preset selector */}
        <div className="relative">
          <select
            value={selectedPreset}
            onChange={(e) => changePreset(Number(e.target.value))}
            className="appearance-none bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {poolPresets.map((preset, index) => (
              <option key={index} value={index}>
                {preset.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        <div className="flex-1" />

        {/* Animation toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAnimating(!isAnimating)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isAnimating
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isAnimating ? 'Pause' : 'Play'}
        </motion.button>

        {/* Stats */}
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400">Utilization:</span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{utilization}%</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Resource grid */}
        <div className="flex-1">
          <div
            className="relative bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden"
            style={{ height: height - 100 }}
          >
            {/* Grid container */}
            <div className="absolute inset-0 flex">
              {/* PRB labels */}
              <div className="w-12 flex flex-col justify-end pb-8 text-xs text-gray-500">
                {Array.from({ length: Math.min(10, numPRBs) }, (_, i) => (
                  <div key={i} className="flex-1 flex items-center justify-end pr-2">
                    {i * 5}
                  </div>
                )).reverse()}
              </div>

              {/* Main grid */}
              <div className="flex-1 p-4">
                <div
                  className="grid gap-0.5"
                  style={{
                    gridTemplateColumns: `repeat(${numSlots}, ${cellSize}px)`,
                    gridTemplateRows: `repeat(${numPRBs}, ${cellSize * 0.4}px)`,
                  }}
                >
                  {Array.from({ length: numPRBs }, (_, prb) =>
                    Array.from({ length: numSlots }, (_, slot) => {
                      const pool = getPoolForCell(slot, numPRBs - 1 - prb);
                      return (
                        <GridCell
                          key={`${slot}-${prb}`}
                          poolId={pool?.id || null}
                          poolColor={pool?.color || ''}
                          isActive={hoveredCell?.slot === slot && hoveredCell?.prb === numPRBs - 1 - prb}
                          onHover={() => setHoveredCell({ slot, prb: numPRBs - 1 - prb })}
                          onLeave={() => setHoveredCell(null)}
                        />
                      );
                    })
                  )}
                </div>

                {/* Slot labels */}
                <div className="flex mt-2 text-xs text-gray-500">
                  {Array.from({ length: numSlots }, (_, i) => (
                    <div
                      key={i}
                      className="text-center"
                      style={{ width: cellSize }}
                    >
                      {i}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hover info */}
            <AnimatePresence>
              {hoveredCell && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-4 left-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 text-sm"
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    {content.labels.slot}: {hoveredCell.slot}, {content.labels.prb}: {hoveredCell.prb}
                  </p>
                  {(() => {
                    const pool = getPoolForCell(hoveredCell.slot, hoveredCell.prb);
                    return pool ? (
                      <p className="text-gray-500" style={{ color: pool.color.replace('0.4', '1') }}>
                        {pool.name}
                      </p>
                    ) : (
                      <p className="text-gray-400">Unallocated</p>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Axis labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{mode === 'spec' ? 'PRB Index →' : 'Frequency →'}</span>
            <span>{mode === 'spec' ? 'Slot Number →' : 'Time →'}</span>
          </div>
        </div>

        {/* Pool configuration panel */}
        <div className="w-full lg:w-64 space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            {content.labels.poolName}s
          </h4>
          <div className="space-y-2">
            {pools.map((pool) => (
              <PoolCard
                key={pool.id}
                pool={pool}
                isActive={activePools.has(pool.id)}
                onToggle={() => togglePool(pool.id)}
                mode={mode}
                labels={content.labels}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Pattern Legend</h5>
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span>Active allocation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-dashed border-gray-400 rounded" />
                <span>Available</span>
              </div>
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
                <p className="font-medium mb-1">How channels work:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Each colored block is a communication channel</li>
                  <li>Devices take turns using channels in different time slots</li>
                  <li>Click the channel groups on the right to enable/disable them</li>
                  <li>Hover over the grid to see which channel is where</li>
                </ul>
              </>
            ) : mode === 'researcher' ? (
              <>
                <p className="font-medium mb-1">Sidelink Resource Pool:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  The grid shows PRB allocation across time slots. PSCCH (Physical Sidelink Control Channel) 
                  carries control information, while PSSCH (Physical Sidelink Shared Channel) carries data. 
                  Mode 1 uses gNB-scheduled resources; Mode 2 uses autonomous UE selection from the pool.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium mb-1">3GPP TS 38.214 Sidelink Resource Allocation:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Resource pools define sets of subchannels (PRB groups) and slots available for sidelink 
                  transmission. The subframeBitmap indicates which slots are valid for pool usage. 
                  PSCCH occupies the first PRBs of a subchannel, followed by PSSCH.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidelinkResourcePool;
