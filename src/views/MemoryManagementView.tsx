import React, { useState } from 'react';
import { Lock, Layers, Calculator } from 'lucide-react';
import { PageTableVisualizer } from '../components/PageTableVisualizer';
import { calculateTeam10MemoryStats, simulatePageReplacement } from '../utils/memoryManager';
import { TEAM_10_DEFAULTS } from '../utils/constants';
import { CalculationVerificationModal, type VerificationData } from '../components/CalculationVerificationModal';

export const MemoryManagementView: React.FC = () => {
  const [customPayloadBytes, setCustomPayloadBytes] = useState<number>(33554432);
  const [genericVerificationModal, setGenericVerificationModal] = useState<VerificationData | null>(null);

  const stats = calculateTeam10MemoryStats(customPayloadBytes);

  const [pageSequenceStr, setPageSequenceStr] = useState<string>('12, 48, 102, 256, 12, 384, 512, 48, 640, 800, 12, 102');
  const [algorithm, setAlgorithm] = useState<'FIFO' | 'LRU' | 'OPTIMAL'>('FIFO');

  const pageRequests = pageSequenceStr
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n));

  const replacementResult = simulatePageReplacement(
    pageRequests,
    TEAM_10_DEFAULTS.numFrames,
    algorithm
  );

  const showPageCalculation = () => {
    setGenericVerificationModal({
      title: 'Number of Pages Required Derivation',
      category: 'MEMORY',
      parameterInputs: [
        { label: 'Logical Address Space', value: '32 MB (33,554,432 Bytes)' },
        { label: 'Page Size', value: '4 KB (4,096 Bytes)' }
      ],
      formulas: [
        {
          title: 'Pages Derivation Formula',
          equation: 'Number of Pages = Logical Space Bytes / Page Size Bytes',
          result: '33,554,432 / 4,096 = 8,192 Pages',
          notes: '8,192 virtual pages indexed from 0 to 8191 (2^13 pages).'
        }
      ]
    });
  };

  const showPageSizeConversion = () => {
    setGenericVerificationModal({
      title: 'Page Size & Address Offset Bit Conversion',
      category: 'MEMORY',
      parameterInputs: [
        { label: 'Page Size Specification', value: '4 KB' }
      ],
      formulas: [
        {
          title: 'Byte Conversion & Offset Bits Derivation',
          equation: 'Page Size Bytes = 4 * 1024 = 4,096 Bytes = 2^12 Bytes',
          result: '4,096 Bytes (12 Offset Bits)',
          notes: '12 bits are reserved for offset d in any 32-bit logical address.'
        }
      ]
    });
  };

  const showMemoryUtilizationCalculation = () => {
    setGenericVerificationModal({
      title: 'Memory Utilization Metrics Derivation',
      category: 'MEMORY',
      parameterInputs: [
        { label: 'Allocated Physical Frames', value: '4 Frames (16,384 Bytes)' },
        { label: 'Total Virtual Pages', value: '8,192 Pages (33,554,432 Bytes)' }
      ],
      formulas: [
        {
          title: 'Frame Allocation Ratio',
          equation: 'Frame Ratio = Allocated Frames / Total Virtual Pages = 4 / 8,192',
          result: '0.0488% of process pages resident in RAM at any instant'
        },
        {
          title: 'Frame Capacity Utilization',
          equation: 'Occupied Frame Bytes / Allocated Capacity Bytes = 16,384 / 16,384',
          result: '100.0% frame capacity fill'
        }
      ]
    });
  };

  const showFragmentationCalculation = () => {
    setGenericVerificationModal({
      title: 'Internal Fragmentation Derivation',
      category: 'MEMORY',
      parameterInputs: [
        { label: 'Process Payload', value: `${stats.processPayloadBytes.toLocaleString()} Bytes` },
        { label: 'Page Size', value: '4,096 Bytes' }
      ],
      formulas: [
        {
          title: 'Internal Fragmentation Formula',
          equation: 'Fragmentation = (ceil(Payload / PageSize) * PageSize) - Payload',
          result: `${stats.internalFragmentationBytes} Bytes`,
          notes: stats.internalFragmentationBytes === 0
            ? 'Because 32 MB (33,554,432 B) is an exact multiple of 4 KB (4,096 B), internal fragmentation is 0 Bytes.'
            : `Unused bytes in last allocated page frame.`
        }
      ]
    });
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="soft-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-emerald-500">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Memory Management &amp; Paging Simulation</h1>
            <span className="badge-academic">Team 10 Official Suite</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pre-configured strictly with Team 10 parameters. All memory derivations calculated dynamically by calculation engine.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold">
          <Lock className="h-4 w-4" />
          <span>RAM: 4GB | Page Size: 4KB | Logical: 32MB | Frames: 4</span>
        </div>
      </div>

      {/* 1. Official Parameters & Mathematical Derivation Engine */}
      <div className="soft-card p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
            <Calculator className="h-4 w-4 text-emerald-600" />
            <span>Calculation Details &amp; Mathematical Derivations Engine</span>
          </h3>
          <span className="text-xs font-mono text-slate-400 font-bold">Dynamic Unit Conversions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="text-slate-500 font-semibold flex items-center justify-between">
              <span>1. Total RAM Size</span>
              <span className="text-emerald-600 font-bold">RAM</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">{stats.ramGB} GB</div>
            <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-200 pt-1.5">
              <div>= {stats.ramMB.toLocaleString()} MB</div>
              <div>= {stats.ramKB.toLocaleString()} KB</div>
              <div className="text-emerald-700 font-bold">= {stats.ramBytes.toLocaleString()} Bytes</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative group">
            <div className="text-slate-500 font-semibold flex items-center justify-between">
              <span>2. Page Size</span>
              <span className="text-blue-600 font-bold">Size</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">{stats.pageSizeKB} KB</div>
            <button
              onClick={showPageSizeConversion}
              className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
            >
              <Calculator className="h-3 w-3" />
              <span>Show Calculation</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="text-slate-500 font-semibold flex items-center justify-between">
              <span>3. Logical Address Space</span>
              <span className="text-purple-600 font-bold">Space</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">{stats.logicalSpaceMB} MB</div>
            <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-200 pt-1.5">
              <div>= {stats.logicalSpaceKB.toLocaleString()} KB</div>
              <div className="text-purple-700 font-bold">= {stats.logicalSpaceBytes.toLocaleString()} Bytes (25 Bits)</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-l-emerald-500 border border-slate-200 space-y-2">
            <div className="text-slate-500 font-semibold flex items-center justify-between">
              <span>4. Number of Pages</span>
              <span className="text-emerald-600 font-bold">Derived</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-600">{stats.numberOfPages.toLocaleString()}</div>
            <button
              onClick={showPageCalculation}
              className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
            >
              <Calculator className="h-3 w-3" />
              <span>Show Calculation</span>
            </button>
          </div>
        </div>

        {/* Second Row of Calculations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="text-slate-500 font-semibold">5 &amp; 6. Frames Allocated to Process</div>
            <div className="text-xl font-extrabold text-amber-600">{stats.allocatedFrames} Physical Frames</div>
            <div className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-200 pt-1.5">
              Allocated RAM = 4 &times; 4,096 B = 16,384 Bytes (16 KB).
              <br />
              Total System RAM Frames = 4,294,967,296 / 4,096 = 1,048,576 frames.
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="text-slate-500 font-semibold">8. Memory Utilization Metrics</div>
            <div className="text-xl font-extrabold text-blue-600">{stats.pageCapacityUtilization}% Frame Capacity</div>
            <button
              onClick={showMemoryUtilizationCalculation}
              className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
            >
              <Calculator className="h-3 w-3" />
              <span>Show Calculation</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="text-slate-500 font-semibold flex items-center justify-between">
              <span>9. Internal Fragmentation</span>
              <span className="text-rose-600 font-bold">Calculator</span>
            </div>
            <div className="text-xl font-extrabold text-rose-600">{stats.internalFragmentationBytes} Bytes</div>
            <div className="flex items-center space-x-2 text-[11px] font-mono">
              <span className="text-slate-500">Payload:</span>
              <input
                type="number"
                value={customPayloadBytes}
                onChange={(e) => setCustomPayloadBytes(Number(e.target.value))}
                className="w-28 bg-white border border-slate-200 rounded px-2 py-0.5 text-slate-900 font-bold text-xs"
              />
            </div>
            <button
              onClick={showFragmentationCalculation}
              className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
            >
              <Calculator className="h-3 w-3" />
              <span>Show Calculation</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Visual Memory Frame Representation */}
      <div className="soft-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
            <Layers className="h-4 w-4 text-emerald-600" />
            <span>Visual Memory Representation: 4 Physical RAM Frames</span>
          </h3>
          <span className="text-xs font-mono text-emerald-700 font-bold">Allocated RAM: 16 KB (16,384 Bytes)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { frameIdx: 0, defaultPage: 12, baseAddr: '0x00000000', endAddr: '0x00000FFF', color: 'from-blue-500 to-indigo-600' },
            { frameIdx: 1, defaultPage: 48, baseAddr: '0x00001000', endAddr: '0x00001FFF', color: 'from-emerald-500 to-teal-600' },
            { frameIdx: 2, defaultPage: 102, baseAddr: '0x00002000', endAddr: '0x00002FFF', color: 'from-amber-500 to-orange-600' },
            { frameIdx: 3, defaultPage: 256, baseAddr: '0x00003000', endAddr: '0x00003FFF', color: 'from-purple-500 to-violet-600' },
          ].map((f) => (
            <div key={f.frameIdx} className="soft-card p-4 rounded-xl space-y-3 relative overflow-hidden group hover:border-emerald-400 transition">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-extrabold text-slate-900 text-sm">FRAME {f.frameIdx}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Allocated
                </span>
              </div>

              <div className={`p-4 rounded-xl bg-gradient-to-br ${f.color} text-center space-y-1 shadow-md text-white`}>
                <span className="text-[11px] text-white/90 font-mono block">Occupying Virtual Page</span>
                <div className="text-2xl font-extrabold font-mono text-white drop-shadow-md">Page #{f.defaultPage}</div>
                <span className="text-[10px] text-white/80 font-mono block">Size: 4,096 Bytes</span>
              </div>

              <div className="text-[11px] font-mono text-slate-500 space-y-0.5 border-t border-slate-100 pt-2">
                <div className="flex justify-between">
                  <span>Base Addr:</span>
                  <span className="text-slate-800 font-bold">{f.baseAddr}</span>
                </div>
                <div className="flex justify-between">
                  <span>End Addr:</span>
                  <span className="text-slate-800 font-bold">{f.endAddr}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Page Table & 32-Bit Address Translator Unit */}
      <PageTableVisualizer />

      {/* 4. Separated Page Replacement Demonstration Sandbox */}
      <div className="soft-card p-6 rounded-2xl space-y-5 border border-dashed border-slate-300 bg-slate-50/50">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="badge-academic bg-amber-50 text-amber-700 border-amber-200">Demonstration Sandbox</span>
              <h3 className="text-sm font-extrabold text-slate-900">Page Replacement Simulator</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Separated from official Team 10 parameter calculations. Demonstrates FIFO, LRU, and Optimal page replacement behavior.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-500 font-mono font-bold">Algorithm:</span>
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 font-mono shadow-xs">
              <button
                onClick={() => setAlgorithm('FIFO')}
                className={`px-3 py-1 rounded-lg transition ${
                  algorithm === 'FIFO' ? 'bg-orange-500 text-white font-bold' : 'text-slate-600'
                }`}
              >
                FIFO
              </button>
              <button
                onClick={() => setAlgorithm('LRU')}
                className={`px-3 py-1 rounded-lg transition ${
                  algorithm === 'LRU' ? 'bg-orange-500 text-white font-bold' : 'text-slate-600'
                }`}
              >
                LRU
              </button>
              <button
                onClick={() => setAlgorithm('OPTIMAL')}
                className={`px-3 py-1 rounded-lg transition ${
                  algorithm === 'OPTIMAL' ? 'bg-orange-500 text-white font-bold' : 'text-slate-600'
                }`}
              >
                Optimal
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <label className="text-slate-600 font-bold">
            Reference Sequence (Comma separated virtual page numbers 0–8191):
          </label>
          <input
            type="text"
            value={pageSequenceStr}
            onChange={(e) => setPageSequenceStr(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-orange-500 shadow-xs"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-slate-400">Total Requests</span>
            <div className="text-lg font-bold text-slate-900">{replacementResult.totalRequests}</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-slate-400">Page Hits</span>
            <div className="text-lg font-bold text-emerald-600">{replacementResult.hits}</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-slate-400">Page Faults</span>
            <div className="text-lg font-bold text-rose-600">{replacementResult.faults}</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-slate-400">Hit Rate %</span>
            <div className="text-lg font-bold text-blue-600">{replacementResult.hitRate}%</div>
          </div>
        </div>

        {/* Step-by-Step Frame Matrix */}
        <div className="space-y-2 font-mono text-xs">
          <h4 className="font-bold text-slate-800">Step-by-Step Frame Allocation History Grid</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 bg-white">
                  <th className="py-2 text-left px-2">Frame / Step</th>
                  {replacementResult.steps.map((s) => (
                    <th key={s.stepIndex} className="py-2 px-1">
                      <div className="text-slate-800 font-bold">Step {s.stepIndex}</div>
                      <div className="text-[10px] text-orange-600">Pg #{s.referencedPage}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {Array.from({ length: TEAM_10_DEFAULTS.numFrames }).map((_, fIdx) => (
                  <tr key={fIdx}>
                    <td className="py-2.5 text-left font-bold text-slate-500 px-2">FRAME {fIdx}</td>
                    {replacementResult.steps.map((s) => {
                      const pageInFrame = s.frames[fIdx];
                      const isJustLoaded = pageInFrame === s.referencedPage && s.isPageFault;
                      return (
                        <td key={s.stepIndex} className="py-2.5 px-1">
                          <div className={`p-1.5 rounded font-bold ${
                            isJustLoaded
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : pageInFrame !== null
                              ? 'bg-slate-100 text-slate-800'
                              : 'text-slate-400'
                          }`}>
                            {pageInFrame !== null ? `Pg ${pageInFrame}` : '-'}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                <tr className="bg-slate-50 font-bold">
                  <td className="py-2 text-left text-slate-500 px-2">Status</td>
                  {replacementResult.steps.map((s) => (
                    <td key={s.stepIndex} className="py-2 px-1">
                      {s.isPageFault ? (
                        <span className="text-[10px] text-rose-600 font-bold">FAULT</span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold">HIT</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* GENERIC VERIFICATION MODAL */}
      <CalculationVerificationModal
        data={genericVerificationModal}
        onClose={() => setGenericVerificationModal(null)}
      />
    </div>
  );
};
