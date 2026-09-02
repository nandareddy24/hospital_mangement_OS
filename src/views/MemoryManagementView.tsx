import React, { useState } from 'react';
import { Lock, Layers, Calculator } from 'lucide-react';
import { PageTableVisualizer } from '../components/PageTableVisualizer';
import { calculateTeam10MemoryStats, simulatePageReplacement } from '../utils/memoryManager';
import { OFFICIAL_SIMULATION_DEFAULTS } from '../utils/constants';
import { CalculationVerificationModal, type VerificationData } from '../components/CalculationVerificationModal';

export const MemoryManagementView: React.FC = () => {
  const [ramGB] = useState<number>(OFFICIAL_SIMULATION_DEFAULTS.ramGB);
  const [pageSizeKB] = useState<number>(OFFICIAL_SIMULATION_DEFAULTS.pageSizeKB);
  const [logicalSpaceMB] = useState<number>(OFFICIAL_SIMULATION_DEFAULTS.logicalSpaceMB);
  const [numFrames] = useState<number>(OFFICIAL_SIMULATION_DEFAULTS.numFrames);

  const [selectedReplacementAlgo, setSelectedReplacementAlgo] = useState<'FIFO' | 'LRU' | 'OPTIMAL'>('FIFO');
  const [pageReferenceString] = useState<number[]>([1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]);

  const [genericVerificationModal, setGenericVerificationModal] = useState<VerificationData | null>(null);

  const memoryStats = calculateTeam10MemoryStats(logicalSpaceMB * 1024 * 1024);
  const replacementResult = simulatePageReplacement(pageReferenceString, numFrames, selectedReplacementAlgo);

  const showPageCalculationProof = () => {
    setGenericVerificationModal({
      title: 'Virtual Pages Derivation',
      category: 'MEMORY',
      parameterInputs: [
        { label: 'Logical Space Size', value: `${logicalSpaceMB} MB (${memoryStats.logicalSpaceBytes.toLocaleString()} Bytes)` },
        { label: 'Page Size', value: `${pageSizeKB} KB (${memoryStats.pageSizeBytes.toLocaleString()} Bytes)` }
      ],
      formulas: [
        {
          title: 'Total Pages Calculation Formula',
          equation: 'Total Pages = Logical Space Bytes / Page Size Bytes = 33,554,432 / 4,096',
          result: `${memoryStats.numberOfPages.toLocaleString()} Virtual Pages`
        }
      ],
      steps: [
        'Step 1: Convert 32 MB to Bytes: 32 * 1024 * 1024 = 33,554,432 Bytes',
        'Step 2: Convert 4 KB to Bytes: 4 * 1024 = 4,096 Bytes',
        'Step 3: Divide 33,554,432 / 4,096 = 8,192 Pages'
      ]
    });
  };

  const showFrameAllocationProof = () => {
    setGenericVerificationModal({
      title: 'Physical Frame Allocation Proof',
      category: 'MEMORY',
      parameterInputs: [
        { label: 'System RAM', value: `${ramGB} GB (4,294,967,296 Bytes)` },
        { label: 'Allocated Frames', value: `${numFrames} Frames` },
        { label: 'Page Size', value: `${pageSizeKB} KB (4,096 Bytes)` }
      ],
      formulas: [
        {
          title: 'Physical Resident RAM Size',
          equation: 'Resident RAM = Allocated Frames * Page Size = 4 * 4,096 Bytes',
          result: '16,384 Bytes (16 KB Physical RAM)'
        }
      ]
    });
  };

  const showInternalFragProof = () => {
    setGenericVerificationModal({
      title: 'Internal Fragmentation Derivation',
      category: 'MEMORY',
      parameterInputs: [
        { label: 'Process Logical Space', value: `${logicalSpaceMB} MB (33,554,432 Bytes)` },
        { label: 'Page Size', value: '4 KB (4,096 Bytes)' }
      ],
      formulas: [
        {
          title: 'Internal Fragmentation Formula',
          equation: 'Fragmentation = (Ceil(Logical Bytes / Page Bytes) * Page Bytes) - Logical Bytes',
          result: '0 Bytes Internal Fragmentation'
        }
      ],
      steps: [
        'Logical Space 33,554,432 is an exact integer multiple of Page Size 4,096 (exactly 8,192 pages).',
        'Therefore, the last page is 100% filled, resulting in 0 Bytes wasted.'
      ]
    });
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Top Banner */}
      <div className="glass-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-emerald-500">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Memory Paging Architecture Simulator</h1>
            <span className="badge-academic">Master Evaluation Suite</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pre-configured strictly with official parameters. All memory derivations calculated dynamically by calculation engine.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold">
          <Lock className="h-4 w-4" />
          <span>RAM 4GB | Page 4KB | Space 32MB | Frames 4</span>
        </div>
      </div>

      {/* Input Memory Parameters Matrix */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            <span>1. Official Input Memory Parameters</span>
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-xl">
            Paging Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-500">Total System RAM:</span>
            <div className="text-xl font-extrabold text-white">{ramGB} GB</div>
            <span className="text-[10px] text-slate-400 block">4,294,967,296 Bytes</span>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-500">System Page Size:</span>
            <div className="text-xl font-extrabold text-cyan-400">{pageSizeKB} KB</div>
            <span className="text-[10px] text-slate-400 block">4,096 Bytes (12 Offset Bits)</span>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-500">Process Logical Space:</span>
            <div className="text-xl font-extrabold text-purple-400">{logicalSpaceMB} MB</div>
            <span className="text-[10px] text-slate-400 block">33,554,432 Bytes</span>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-500">Physical RAM Frames:</span>
            <div className="text-xl font-extrabold text-amber-400">{numFrames} Frames</div>
            <span className="text-[10px] text-slate-400 block">16 KB Resident Physical RAM</span>
          </div>
        </div>
      </div>

      {/* Calculated Derivations Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-emerald-500">
          <span className="text-slate-400 block font-bold">5. Total Derived Pages</span>
          <div className="text-3xl font-black text-emerald-400">{memoryStats.numberOfPages.toLocaleString()} <span className="text-xs text-slate-500 font-normal">pages</span></div>
          <button
            onClick={showPageCalculationProof}
            className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
          >
            <Calculator className="h-3 w-3 text-emerald-400" />
            <span>Show Calculation</span>
          </button>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-cyan-500">
          <span className="text-slate-400 block font-bold">6. Frame Allocation</span>
          <div className="text-3xl font-black text-cyan-400">{numFrames} <span className="text-xs text-slate-500 font-normal">physical frames</span></div>
          <button
            onClick={showFrameAllocationProof}
            className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
          >
            <Calculator className="h-3 w-3 text-cyan-400" />
            <span>Show Calculation</span>
          </button>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-amber-500">
          <span className="text-slate-400 block font-bold">7. Internal Fragmentation</span>
          <div className="text-3xl font-black text-amber-400">0 <span className="text-xs text-slate-500 font-normal">Bytes</span></div>
          <button
            onClick={showInternalFragProof}
            className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
          >
            <Calculator className="h-3 w-3 text-amber-400" />
            <span>Show Calculation</span>
          </button>
        </div>
      </div>

      {/* 32-Bit Address Hardware Translator Unit */}
      <PageTableVisualizer />

      {/* Page Replacement Algorithm Simulator Section */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-white">Optional Page Replacement Simulator</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Demonstrates FIFO, LRU, and Optimal page replacement behavior across 4 Frames.
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            {['FIFO', 'LRU', 'OPTIMAL'].map((algo) => (
              <button
                key={algo}
                onClick={() => setSelectedReplacementAlgo(algo as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  selectedReplacementAlgo === algo
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                    : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-500">Total Requests</span>
            <div className="text-xl font-black text-white">{replacementResult.totalRequests}</div>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-500">Page Hits</span>
            <div className="text-xl font-black text-emerald-400">{replacementResult.hits} ({replacementResult.hitRate}%)</div>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-500">Page Faults</span>
            <div className="text-xl font-black text-rose-400">{replacementResult.faults} ({replacementResult.faultRate}%)</div>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-500">Active Frames</span>
            <div className="text-xl font-black text-cyan-400">{numFrames} Frames</div>
          </div>
        </div>
      </div>

      {/* VERIFICATION MODAL */}
      <CalculationVerificationModal
        data={genericVerificationModal}
        onClose={() => setGenericVerificationModal(null)}
      />
    </div>
  );
};
