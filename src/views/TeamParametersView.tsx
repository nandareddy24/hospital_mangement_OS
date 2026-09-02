import React, { useState } from 'react';
import { Lock, Play, Cpu, Database, HardDrive, CheckCircle2, BookOpen, AlertTriangle, Layers, RotateCcw } from 'lucide-react';
import { simulateRoundRobin } from '../utils/processScheduler';
import { calculateTeam10MemoryStats } from '../utils/memoryManager';
import { simulateDiskScheduling } from '../utils/diskScheduler';
import { TEAM_10_DEFAULTS } from '../utils/constants';

interface TeamParametersViewProps {
  onNavigateToView?: (view: string) => void;
  onResetTeam10?: () => void;
}

export const TeamParametersView: React.FC<TeamParametersViewProps> = ({ onNavigateToView, onResetTeam10 }) => {
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [showConsolidatedResults, setShowConsolidatedResults] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PROCESS' | 'MEMORY' | 'DISK'>('OVERVIEW');

  const processResult = simulateRoundRobin(TEAM_10_DEFAULTS.processes, TEAM_10_DEFAULTS.timeQuantum);
  const memoryStats = calculateTeam10MemoryStats(33554432);
  const diskResult = simulateDiskScheduling(TEAM_10_DEFAULTS.diskQueue, TEAM_10_DEFAULTS.initialHead, 'FCFS', TEAM_10_DEFAULTS.cylinderMax);

  const handleRunAllSimulations = () => {
    setIsRunningAll(true);
    setShowConsolidatedResults(false);
    setTimeout(() => {
      setIsRunningAll(false);
      setShowConsolidatedResults(true);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-gray-950 border border-blue-900/40">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Official Team 10 Parameters Specification</h1>
            <span className="badge-academic">Team 10 Master Config</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Authoritative parameters assigned exclusively to Team 10 for the OS Resource Management Simulator.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {onResetTeam10 && (
            <button
              onClick={onResetTeam10}
              className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-gray-700 transition"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
              <span>Reset Team 10</span>
            </button>
          )}
          <button
            onClick={handleRunAllSimulations}
            disabled={isRunningAll}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center space-x-2 shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
          >
            {isRunningAll ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Executing All Engines...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Run All Team 10 Simulations</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prominent Academic Constraint Note */}
      <div className="p-4 bg-amber-950/50 border border-amber-800/80 rounded-2xl flex items-start space-x-3 text-amber-200 text-xs font-mono shadow-md">
        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-amber-300 text-sm">IMPORTANT ACADEMIC CONSTRAINT:</div>
          <p className="text-amber-200/90 font-semibold leading-relaxed">
            &quot;These parameters are exclusively assigned to Team 10 and must not be modified for the official simulation.&quot;
          </p>
        </div>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex space-x-2 border-b border-gray-800 pb-2 text-xs font-mono">
        {[
          { key: 'OVERVIEW', label: 'All Modules Overview', icon: Layers },
          { key: 'PROCESS', label: 'Process Management Spec', icon: Cpu },
          { key: 'MEMORY', label: 'Memory Management Spec', icon: Database },
          { key: 'DISK', label: 'Disk Scheduling Spec', icon: HardDrive },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center space-x-1.5 transition ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/60'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Master Parameter Tables */}
      <div className="space-y-6">
        {/* Application Domain Specification */}
        {(activeTab === 'OVERVIEW') && (
          <div className="glass-card p-5 rounded-2xl space-y-3 border border-gray-800">
            <h3 className="text-sm font-bold text-gray-200 flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>Application Domain Specification</span>
            </h3>
            <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 font-mono text-xs flex justify-between items-center">
              <div>
                <span className="text-gray-400">Target Application System:</span>
                <span className="text-white font-bold text-sm block">Library Management System</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Team 10 Assigned Domain
              </span>
            </div>
          </div>
        )}

        {/* Process Management Parameters Table */}
        {(activeTab === 'OVERVIEW' || activeTab === 'PROCESS') && (
          <div className="glass-card p-5 rounded-2xl space-y-4 border border-blue-900/40">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-200 flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-blue-400" />
                <span>Process Management Official Parameter Set</span>
              </h3>
              <div className="flex items-center space-x-2 text-xs font-mono text-blue-400">
                <Lock className="h-3.5 w-3.5" />
                <span>Algorithm = Round Robin | Time Quantum = 4</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 bg-gray-950/60">
                    <th className="p-3">Process ID</th>
                    <th className="p-3">Arrival Time (AT)</th>
                    <th className="p-3">Burst Time (BT)</th>
                    <th className="p-3">Assigned Algorithm</th>
                    <th className="p-3">Time Quantum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80">
                  {TEAM_10_DEFAULTS.processes.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-900/40">
                      <td className="p-3 font-bold text-white flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
                        <span className="font-sans text-sm">{p.name}</span>
                      </td>
                      <td className="p-3 text-gray-200 font-bold">{p.arrivalTime} time units</td>
                      <td className="p-3 text-gray-200 font-bold">{p.burstTime} time units</td>
                      <td className="p-3 text-blue-400 font-bold">Round Robin</td>
                      <td className="p-3 text-emerald-400 font-bold">4 time units</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Memory Management Parameters Table */}
        {(activeTab === 'OVERVIEW' || activeTab === 'MEMORY') && (
          <div className="glass-card p-5 rounded-2xl space-y-4 border border-emerald-900/40">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-200 flex items-center space-x-2">
                <Database className="h-4 w-4 text-emerald-400" />
                <span>Memory Management Official Parameter Set</span>
              </h3>
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                <Lock className="h-3.5 w-3.5" />
                <span>Paging Architecture Enforced</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-3.5 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
                <span className="text-gray-400">RAM Size:</span>
                <div className="text-lg font-bold text-white">4 GB</div>
                <span className="text-[10px] text-gray-500 block">4,294,967,296 Bytes</span>
              </div>

              <div className="p-3.5 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
                <span className="text-gray-400">Page Size:</span>
                <div className="text-lg font-bold text-blue-400">4 KB</div>
                <span className="text-[10px] text-gray-500 block">4,096 Bytes (12 Offset Bits)</span>
              </div>

              <div className="p-3.5 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
                <span className="text-gray-400">Logical Space:</span>
                <div className="text-lg font-bold text-purple-400">32 MB</div>
                <span className="text-[10px] text-gray-500 block">33,554,432 Bytes (25 Address Bits)</span>
              </div>

              <div className="p-3.5 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
                <span className="text-gray-400">Physical Frames:</span>
                <div className="text-lg font-bold text-emerald-400">4 Frames</div>
                <span className="text-[10px] text-gray-500 block">16,384 Bytes Allocated</span>
              </div>
            </div>
          </div>
        )}

        {/* Disk Scheduling Parameters Table */}
        {(activeTab === 'OVERVIEW' || activeTab === 'DISK') && (
          <div className="glass-card p-5 rounded-2xl space-y-4 border border-amber-900/40">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-200 flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-amber-400" />
                <span>Disk Scheduling Official Parameter Set</span>
              </h3>
              <div className="flex items-center space-x-2 text-xs font-mono text-amber-400">
                <Lock className="h-3.5 w-3.5" />
                <span>Algorithm = FCFS Baseline</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3.5 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
                <span className="text-gray-400">Cylinder Range:</span>
                <div className="text-lg font-bold text-white">0 to 130</div>
                <span className="text-[10px] text-gray-500 block">131 total cylinders</span>
              </div>

              <div className="p-3.5 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
                <span className="text-gray-400">Initial Head Position:</span>
                <div className="text-lg font-bold text-amber-400">Cylinder #65</div>
                <span className="text-[10px] text-gray-500 block">Starting arm location</span>
              </div>

              <div className="p-3.5 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
                <span className="text-gray-400">Official Request Queue:</span>
                <div className="text-sm font-bold text-amber-300 truncate">
                  [{TEAM_10_DEFAULTS.diskQueue.join(', ')}]
                </div>
                <span className="text-[10px] text-gray-500 block">8 requested cylinders</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CONSOLIDATED SIMULATION RESULTS MODAL */}
      {showConsolidatedResults && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl space-y-6 border border-blue-900/60 animate-fade-in font-mono text-xs">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">
                  Consolidated Team 10 Simulation Execution Results
                </h2>
              </div>
              <button
                onClick={() => setShowConsolidatedResults(false)}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-semibold"
              >
                Close Summary
              </button>
            </div>

            {/* Consolidated Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Process Management Consolidated Summary */}
              <div className="p-4 bg-blue-950/30 rounded-xl border border-blue-800/60 space-y-2">
                <div className="flex items-center justify-between font-bold text-blue-400 text-sm">
                  <span className="flex items-center space-x-1.5">
                    <Cpu className="h-4 w-4" />
                    <span>Process (Round Robin)</span>
                  </span>
                </div>
                <div className="space-y-1 text-gray-300 border-t border-blue-900/60 pt-2 text-[11px]">
                  <div className="flex justify-between">
                    <span>Total Execution:</span>
                    <strong className="text-white">{processResult.totalExecutionTime} units</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Waiting Time:</span>
                    <strong className="text-amber-400">{processResult.avgWaitingTime} units</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Turnaround Time:</span>
                    <strong className="text-blue-400">{processResult.avgTurnaroundTime} units</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Response Time:</span>
                    <strong className="text-emerald-400">{processResult.avgResponseTime} units</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>CPU Utilization:</span>
                    <strong className="text-purple-400">{processResult.cpuUtilization}%</strong>
                  </div>
                </div>
              </div>

              {/* 2. Memory Management Consolidated Summary */}
              <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-800/60 space-y-2">
                <div className="flex items-center justify-between font-bold text-emerald-400 text-sm">
                  <span className="flex items-center space-x-1.5">
                    <Database className="h-4 w-4" />
                    <span>Memory Paging</span>
                  </span>
                </div>
                <div className="space-y-1 text-gray-300 border-t border-emerald-900/60 pt-2 text-[11px]">
                  <div className="flex justify-between">
                    <span>Derived Pages:</span>
                    <strong className="text-white">{memoryStats.numberOfPages.toLocaleString()} pages</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Allocated Frames:</span>
                    <strong className="text-emerald-400">4 Frames (16 KB)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Page Capacity Fill:</span>
                    <strong className="text-blue-400">100.0%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Frame Alloc Ratio:</span>
                    <strong className="text-purple-400">0.0488%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Internal Fragmentation:</span>
                    <strong className="text-rose-400">0 Bytes</strong>
                  </div>
                </div>
              </div>

              {/* 3. Disk Scheduling Consolidated Summary */}
              <div className="p-4 bg-amber-950/30 rounded-xl border border-amber-800/60 space-y-2">
                <div className="flex items-center justify-between font-bold text-amber-400 text-sm">
                  <span className="flex items-center space-x-1.5">
                    <HardDrive className="h-4 w-4" />
                    <span>Disk (FCFS)</span>
                  </span>
                </div>
                <div className="space-y-1 text-gray-300 border-t border-amber-900/60 pt-2 text-[11px]">
                  <div className="flex justify-between">
                    <span>Initial Head:</span>
                    <strong className="text-white">Cylinder #65</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Seek Movement:</span>
                    <strong className="text-amber-400">{diskResult.totalSeekDistance} tracks</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Seek Distance:</span>
                    <strong className="text-emerald-400">{diskResult.avgSeekDistance} tracks/req</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Requested Cylinders:</span>
                    <strong className="text-blue-400">8 requests</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800">
              <span className="text-gray-400 text-[11px]">Jump to detailed module view:</span>
              <div className="flex items-center space-x-2">
                {onNavigateToView && (
                  <button
                    onClick={() => { setShowConsolidatedResults(false); onNavigateToView('results'); }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20"
                  >
                    View Full Results &amp; Analysis Report &rarr;
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
