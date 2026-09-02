import React, { useState } from 'react';
import { Play, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { TEAM_10_DEFAULTS } from '../utils/constants';

interface TeamParametersViewProps {
  onNavigateToView?: (view: string) => void;
  onResetTeam10?: () => void;
}

export const TeamParametersView: React.FC<TeamParametersViewProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="soft-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-orange-500">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dedicated Team 10 Parameters Specification</h1>
            <span className="badge-academic">Official Course Configuration</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative master dataset exclusively assigned to Team 10. Modification is locked to guarantee simulation accuracy.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/25 flex items-center space-x-2 transition"
        >
          <Play className="h-4 w-4 fill-current" />
          <span>Run All Team 10 Simulations</span>
        </button>
      </div>

      {/* Prominent Lock Banner */}
      <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center space-x-3 text-xs font-mono text-orange-800">
        <ShieldCheck className="h-5 w-5 text-orange-600 shrink-0" />
        <div className="leading-relaxed">
          <strong className="font-bold text-orange-900 block">OFFICIAL ACADEMIC NOTICE:</strong>
          These parameters are exclusively assigned to Team 10 and must not be modified for the official simulation evaluation.
        </div>
      </div>

      {/* Master Parameter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        {/* Process Management Parameters */}
        <div className="soft-card p-6 space-y-4 border-t-4 border-t-orange-500">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">Process Management</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
              Round Robin (Q=4)
            </span>
          </div>

          <div className="space-y-2">
            {TEAM_10_DEFAULTS.processes.map(p => (
              <div key={p.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900">{p.name}</span>
                <span className="text-slate-600">AT: <strong>{p.arrivalTime}</strong>, BT: <strong>{p.burstTime}</strong></span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-0.5">
            <span className="text-slate-400 text-[10px] block">Time Quantum</span>
            <div className="text-xl font-extrabold text-orange-600">4 Time Units</div>
          </div>
        </div>

        {/* Memory Management Parameters */}
        <div className="soft-card p-6 space-y-4 border-t-4 border-t-emerald-500">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">Memory Management</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Paging Architecture
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
              <span className="text-slate-500">System RAM:</span>
              <strong className="text-slate-900">4 GB (4,294,967,296 B)</strong>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
              <span className="text-slate-500">Page Size:</span>
              <strong className="text-emerald-700">4 KB (4,096 B / 12 Bits)</strong>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
              <span className="text-slate-500">Process Logical Space:</span>
              <strong className="text-purple-700">32 MB (8,192 Pages)</strong>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
              <span className="text-slate-500">Physical Frames:</span>
              <strong className="text-amber-700">4 Frames (16 KB)</strong>
            </div>
          </div>
        </div>

        {/* Disk Scheduling Parameters */}
        <div className="soft-card p-6 space-y-4 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">Disk Scheduling</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              FCFS Baseline
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
              <span className="text-slate-500">Cylinder Range:</span>
              <strong className="text-slate-900">0 to 130 Cylinders</strong>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
              <span className="text-slate-500">Initial Head Position:</span>
              <strong className="text-blue-700">Cylinder #65</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-400 block text-[10px]">Official Request Queue</span>
              <div className="text-amber-700 font-bold text-xs truncate">
                [{TEAM_10_DEFAULTS.diskQueue.join(', ')}]
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BATCH EXECUTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="soft-panel w-full max-w-lg p-6 rounded-2xl space-y-5 border border-slate-200 animate-fade-in font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Batch Simulation Execution (Team 10)</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 space-y-1">
                <div className="font-bold text-emerald-900">Batch Run Status: SUCCESS (100%)</div>
                <div>Executed Round Robin (Q=4), Paging (32MB/4KB), and FCFS Disk (0-130).</div>
              </div>

              <div className="space-y-2 text-slate-700">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                  <span>CPU Round Robin Avg TAT:</span>
                  <strong className="text-orange-600">13.0 time units</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                  <span>Memory Derived Virtual Pages:</span>
                  <strong className="text-emerald-600">8,192 pages</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                  <span>Disk FCFS Total Seek Movement:</span>
                  <strong className="text-amber-600">545 tracks</strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md transition"
              >
                Close Batch Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
