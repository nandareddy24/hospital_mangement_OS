import React, { useState } from 'react';
import { Calculator, RotateCcw, Sliders } from 'lucide-react';
import { PageTableVisualizer } from '../components/PageTableVisualizer';
import { calculateTeam10MemoryStats, simulatePageReplacement } from '../utils/memoryManager';
import { OFFICIAL_SIMULATION_DEFAULTS } from '../utils/constants';
import { CalculationVerificationModal, type VerificationData } from '../components/CalculationVerificationModal';

export const MemoryManagementView: React.FC = () => {
  const [ramGB, setRamGB] = useState<number>(OFFICIAL_SIMULATION_DEFAULTS.ramGB);
  const [pageSizeKB, setPageSizeKB] = useState<number>(OFFICIAL_SIMULATION_DEFAULTS.pageSizeKB);
  const [logicalSpaceMB, setLogicalSpaceMB] = useState<number>(OFFICIAL_SIMULATION_DEFAULTS.logicalSpaceMB);
  const [numFrames, setNumFrames] = useState<number>(OFFICIAL_SIMULATION_DEFAULTS.numFrames);

  const [selectedReplacementAlgo, setSelectedReplacementAlgo] = useState<'FIFO' | 'LRU' | 'OPTIMAL'>('FIFO');
  const [pageReferenceString] = useState<number[]>([1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]);

  const [genericVerificationModal, setGenericVerificationModal] = useState<VerificationData | null>(null);

  const memoryStats = calculateTeam10MemoryStats(logicalSpaceMB * 1024 * 1024);
  const replacementResult = simulatePageReplacement(pageReferenceString, numFrames, selectedReplacementAlgo);

  const handleResetMemoryParams = () => {
    setRamGB(OFFICIAL_SIMULATION_DEFAULTS.ramGB);
    setPageSizeKB(OFFICIAL_SIMULATION_DEFAULTS.pageSizeKB);
    setLogicalSpaceMB(OFFICIAL_SIMULATION_DEFAULTS.logicalSpaceMB);
    setNumFrames(OFFICIAL_SIMULATION_DEFAULTS.numFrames);
  };

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
          equation: `Total Pages = Logical Space Bytes / Page Size Bytes = ${memoryStats.logicalSpaceBytes.toLocaleString()} / ${memoryStats.pageSizeBytes.toLocaleString()}`,
          result: `${memoryStats.numberOfPages.toLocaleString()} Virtual Pages`
        }
      ],
      steps: [
        `Step 1: Convert ${logicalSpaceMB} MB to Bytes: ${logicalSpaceMB} * 1024 * 1024 = ${memoryStats.logicalSpaceBytes.toLocaleString()} Bytes`,
        `Step 2: Convert ${pageSizeKB} KB to Bytes: ${pageSizeKB} * 1024 = ${memoryStats.pageSizeBytes.toLocaleString()} Bytes`,
        `Step 3: Divide ${memoryStats.logicalSpaceBytes.toLocaleString()} / ${memoryStats.pageSizeBytes.toLocaleString()} = ${memoryStats.numberOfPages.toLocaleString()} Pages`
      ]
    });
  };

  const showFrameAllocationProof = () => {
    setGenericVerificationModal({
      title: 'Physical Frame Allocation Proof',
      category: 'MEMORY',
      parameterInputs: [
        { label: 'System RAM', value: `${ramGB} GB` },
        { label: 'Allocated Frames', value: `${numFrames} Frames` },
        { label: 'Page Size', value: `${pageSizeKB} KB (${memoryStats.pageSizeBytes.toLocaleString()} Bytes)` }
      ],
      formulas: [
        {
          title: 'Physical Resident RAM Size',
          equation: `Resident RAM = Allocated Frames * Page Size = ${numFrames} * ${pageSizeKB} KB`,
          result: `${numFrames * pageSizeKB} KB Physical Resident RAM`
        }
      ]
    });
  };

  const showInternalFragProof = () => {
    setGenericVerificationModal({
      title: 'Internal Fragmentation Derivation',
      category: 'MEMORY',
      parameterInputs: [
        { label: 'Process Logical Space', value: `${logicalSpaceMB} MB (${memoryStats.logicalSpaceBytes.toLocaleString()} Bytes)` },
        { label: 'Page Size', value: `${pageSizeKB} KB (${memoryStats.pageSizeBytes.toLocaleString()} Bytes)` }
      ],
      formulas: [
        {
          title: 'Internal Fragmentation Formula',
          equation: 'Fragmentation = (Ceil(Logical Bytes / Page Bytes) * Page Bytes) - Logical Bytes',
          result: `${memoryStats.internalFragmentationBytes} Bytes Internal Fragmentation`
        }
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
            <span className="badge-academic">Interactive Customization</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manually customize System RAM, Page Size, Logical Address Space, and Resident Physical Frames.
          </p>
        </div>

        <button
          onClick={handleResetMemoryParams}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold font-mono border border-slate-700 transition flex items-center space-x-1.5 shadow-xs"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Input Memory Parameters Interactive Controls */}
      <div className="glass-card p-6 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <span>Interactive Input Memory Parameters &amp; Architecture Controls</span>
          </h3>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-xl">
            Live Address Translation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* RAM Control */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-slate-400 font-bold block">1. System RAM (GB):</label>
            <select
              value={ramGB}
              onChange={(e) => setRamGB(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value={1}>1 GB RAM</option>
              <option value={2}>2 GB RAM</option>
              <option value={4}>4 GB RAM (Default)</option>
              <option value={8}>8 GB RAM</option>
              <option value={16}>16 GB RAM</option>
            </select>
            <span className="text-[10px] text-slate-500 block">{(ramGB * 1024 * 1024 * 1024).toLocaleString()} Bytes</span>
          </div>

          {/* Page Size Control */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-slate-400 font-bold block">2. Page Size (KB):</label>
            <select
              value={pageSizeKB}
              onChange={(e) => setPageSizeKB(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-cyan-400 font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value={1}>1 KB (10 Offset Bits)</option>
              <option value={2}>2 KB (11 Offset Bits)</option>
              <option value={4}>4 KB (12 Offset Bits)</option>
              <option value={8}>8 KB (13 Offset Bits)</option>
              <option value={16}>16 KB (14 Offset Bits)</option>
            </select>
            <span className="text-[10px] text-slate-500 block">{(pageSizeKB * 1024).toLocaleString()} Bytes / Page</span>
          </div>

          {/* Logical Space Control */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-slate-400 font-bold block">3. Logical Space (MB):</label>
            <select
              value={logicalSpaceMB}
              onChange={(e) => setLogicalSpaceMB(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-purple-400 font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value={4}>4 MB Process Space</option>
              <option value={8}>8 MB Process Space</option>
              <option value={16}>16 MB Process Space</option>
              <option value={32}>32 MB Process Space (Default)</option>
              <option value={64}>64 MB Process Space</option>
              <option value={128}>128 MB Process Space</option>
            </select>
            <span className="text-[10px] text-slate-500 block">{(logicalSpaceMB * 1024 * 1024).toLocaleString()} Bytes</span>
          </div>

          {/* Frames Control */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-slate-400 font-bold block">4. Resident Physical Frames:</label>
            <input
              type="number"
              min="1"
              max="64"
              value={numFrames}
              onChange={(e) => setNumFrames(Math.max(1, Number(e.target.value)))}
              className="w-full bg-slate-900 border border-slate-700 text-amber-400 font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500 block">Resident Physical RAM: {numFrames * pageSizeKB} KB</span>
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
          <div className="text-3xl font-black text-amber-400">{memoryStats.internalFragmentationBytes} <span className="text-xs text-slate-500 font-normal">Bytes</span></div>
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
            <h3 className="text-base font-extrabold text-white">Page Replacement Simulator</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Demonstrates FIFO, LRU, and Optimal page replacement behavior across {numFrames} Frames.
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
