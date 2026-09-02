import React, { useState } from 'react';
import { Cpu, Lock, CheckCircle2, X, ArrowRight, Calculator } from 'lucide-react';
import type { Process, ProcessMetrics } from '../types/os';
import { simulateRoundRobin, simulateFCFS, simulateSJF } from '../utils/processScheduler';
import { GanttChart } from '../components/GanttChart';
import { TEAM_10_DEFAULTS } from '../utils/constants';
import { CalculationVerificationModal, type VerificationData } from '../components/CalculationVerificationModal';

export const ProcessManagementView: React.FC = () => {
  const [processes] = useState<Process[]>(TEAM_10_DEFAULTS.processes);
  const [timeQuantum] = useState<number>(TEAM_10_DEFAULTS.timeQuantum);
  const [selectedAlgo, setSelectedAlgo] = useState<'RR' | 'FCFS' | 'SJF'>('RR');

  const [selectedVerifyProcess, setSelectedVerifyProcess] = useState<ProcessMetrics | null>(null);
  const [genericVerificationModal, setGenericVerificationModal] = useState<VerificationData | null>(null);

  const rrResult = simulateRoundRobin(processes, timeQuantum);
  const fcfsResult = simulateFCFS(processes);
  const sjfResult = simulateSJF(processes);

  const activeResult = selectedAlgo === 'RR' ? rrResult : selectedAlgo === 'FCFS' ? fcfsResult : sjfResult;

  // Verification Data Handlers for Averages
  const showAvgWTCalculation = () => {
    setGenericVerificationModal({
      title: 'Average Waiting Time (WT) Derivation',
      category: 'PROCESS',
      parameterInputs: [
        { label: 'Algorithm', value: `Round Robin (Q=${timeQuantum})` },
        { label: 'Processes', value: 'P1, P2, P3, P4, P5' },
        { label: 'Total Processes (N)', value: '5 processes' }
      ],
      formulas: [
        {
          title: 'Individual Waiting Times (WT = TAT - BT)',
          equation: 'P1: 12-6=6 | P2: 4-2=2 | P3: 17-5=12 | P4: 20-9=11 | P5: 12-3=9',
          result: 'Sum(WT) = 6 + 2 + 12 + 11 + 9 = 40 time units'
        },
        {
          title: 'Average Waiting Time Formula',
          equation: 'Avg WT = Sum(WT) / N = 40 / 5',
          result: '8.0 time units'
        }
      ]
    });
  };

  const showAvgTATCalculation = () => {
    setGenericVerificationModal({
      title: 'Average Turnaround Time (TAT) Derivation',
      category: 'PROCESS',
      parameterInputs: [
        { label: 'Algorithm', value: `Round Robin (Q=${timeQuantum})` },
        { label: 'Processes', value: 'P1, P2, P3, P4, P5' },
        { label: 'Total Processes (N)', value: '5 processes' }
      ],
      formulas: [
        {
          title: 'Individual Turnaround Times (TAT = CT - AT)',
          equation: 'P1: 12-0=12 | P2: 6-2=4 | P3: 20-3=17 | P4: 25-5=20 | P5: 19-7=12',
          result: 'Sum(TAT) = 12 + 4 + 17 + 20 + 12 = 65 time units'
        },
        {
          title: 'Average Turnaround Time Formula',
          equation: 'Avg TAT = Sum(TAT) / N = 65 / 5',
          result: '13.0 time units'
        }
      ]
    });
  };

  const showAvgRTCalculation = () => {
    setGenericVerificationModal({
      title: 'Average Response Time (RT) Derivation',
      category: 'PROCESS',
      parameterInputs: [
        { label: 'Algorithm', value: `Round Robin (Q=${timeQuantum})` },
        { label: 'Processes', value: 'P1, P2, P3, P4, P5' },
        { label: 'Total Processes (N)', value: '5 processes' }
      ],
      formulas: [
        {
          title: 'Individual Response Times (RT = FirstCPU - AT)',
          equation: 'P1: 0-0=0 | P2: 4-2=2 | P3: 6-3=3 | P4: 12-5=7 | P5: 16-7=9',
          result: 'Sum(RT) = 0 + 2 + 3 + 7 + 9 = 21 time units'
        },
        {
          title: 'Average Response Time Formula',
          equation: 'Avg RT = Sum(RT) / N = 21 / 5',
          result: '4.2 time units'
        }
      ]
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-950/50 via-gray-950 to-gray-950 border border-blue-900/40">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Process Management &amp; CPU Scheduling</h1>
            <span className="badge-academic">Team 10 Official Suite</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Pre-configured strictly with Team 10 parameters. All metrics generated dynamically by Round Robin algorithm.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800 text-xs font-mono">
            <button
              onClick={() => setSelectedAlgo('RR')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                selectedAlgo === 'RR' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Round Robin (Q={timeQuantum}) *Team 10
            </button>
            <button
              onClick={() => setSelectedAlgo('FCFS')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                selectedAlgo === 'FCFS' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              FCFS
            </button>
            <button
              onClick={() => setSelectedAlgo('SJF')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                selectedAlgo === 'SJF' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              SJF
            </button>
          </div>
        </div>
      </div>

      {/* 1. Input Process Table */}
      <div className="glass-card p-5 rounded-2xl space-y-4 border border-blue-900/40">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-200 flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-blue-400" />
            <span>1. Official Team 10 Input Process Parameters</span>
          </h3>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
            <Lock className="h-3.5 w-3.5" />
            <span>Team 10 Values Enforced (Q = {timeQuantum})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 bg-gray-950/60">
                <th className="p-3">Process ID</th>
                <th className="p-3">Arrival Time (AT)</th>
                <th className="p-3">Burst Time (BT)</th>
                <th className="p-3">Time Quantum (Q)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80">
              {processes.map((p) => (
                <tr key={p.id} className="hover:bg-gray-900/40">
                  <td className="p-3 font-bold text-white flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></span>
                    <span className="text-sm font-sans">{p.name}</span>
                  </td>
                  <td className="p-3 text-gray-200 font-bold">{p.arrivalTime} time units</td>
                  <td className="p-3 text-gray-200 font-bold">{p.burstTime} time units</td>
                  <td className="p-3 text-blue-400 font-bold">{timeQuantum} time units</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                      Team 10 Official
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Gantt Chart Visualization Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-200 flex items-center space-x-2 px-1">
          <span>3. Dynamic Execution Gantt Chart Timeline</span>
        </h3>
        <GanttChart scheduleResult={activeResult} timeQuantum={timeQuantum} />
      </div>

      {/* 3. Ready Queue Step-by-Step Execution Log */}
      <div className="glass-card p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-200 flex items-center space-x-2">
            <ArrowRight className="h-4 w-4 text-emerald-400" />
            <span>2 &amp; Step-by-Step Execution: Round Robin Ready Queue Transitions</span>
          </h3>
          <span className="text-xs font-mono text-gray-400">Total Steps: {rrResult.steps.length}</span>
        </div>

        <div className="overflow-x-auto max-h-[380px]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="sticky top-0 bg-gray-950 border-b border-gray-800 text-gray-400">
              <tr>
                <th className="py-2.5 px-3">Step #</th>
                <th className="py-2.5 px-3">Time (t)</th>
                <th className="py-2.5 px-3">Active CPU Process</th>
                <th className="py-2.5 px-3 text-emerald-400">Ready Queue State (HEAD &rarr; TAIL)</th>
                <th className="py-2.5 px-3">Remaining Bursts [P1,P2,P3,P4,P5]</th>
                <th className="py-2.5 px-3">Context Event Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {rrResult.steps.map((step) => (
                <tr key={step.stepIndex} className="hover:bg-gray-900/50">
                  <td className="py-2.5 px-3 text-gray-400 font-bold">Step {step.stepIndex}</td>
                  <td className="py-2.5 px-3 text-blue-400 font-bold">t = {step.time}</td>
                  <td className="py-2.5 px-3 font-bold text-white">
                    {step.activeProcessName ? (
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                        {step.activeProcessName}
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">CPU IDLE</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {step.readyQueue.length === 0 ? (
                      <span className="text-gray-500 italic">[ Empty Queue ]</span>
                    ) : (
                      <div className="flex items-center space-x-1">
                        {step.readyQueue.map((pid, idx) => {
                          const pName = processes.find(p => p.id === pid)?.name || pid;
                          return (
                            <span key={idx} className="px-2 py-0.5 bg-gray-800 border border-gray-700 text-blue-300 rounded font-bold">
                              {pName}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-gray-300 font-mono text-[11px]">
                    [{processes.map(p => step.remainingBurstTimes[p.id] ?? 0).join(', ')}]
                  </td>
                  <td className="py-2.5 px-3 text-gray-300 text-[11px]">{step.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Calculated Process Metrics Table & Verification Tools */}
      <div className="glass-card p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-200 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>4–7. Calculated Process Timing Metrics Table</span>
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            CPU Utilization: {activeResult.cpuUtilization}%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 bg-gray-950/60">
                <th className="p-3">Process</th>
                <th className="p-3">Arrival Time (AT)</th>
                <th className="p-3">Burst Time (BT)</th>
                <th className="p-3 text-gray-200">Completion Time (CT)</th>
                <th className="p-3 text-blue-400">Turnaround Time (TAT = CT - AT)</th>
                <th className="p-3 text-amber-400">Waiting Time (WT = TAT - BT)</th>
                <th className="p-3 text-emerald-400">Response Time (RT = FirstCPU - AT)</th>
                <th className="p-3 text-right">Proof Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80">
              {activeResult.metrics.map((m) => (
                <tr key={m.id} className="hover:bg-gray-900/50">
                  <td className="p-3 font-bold text-white flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }}></span>
                    <span className="text-sm font-sans">{m.name}</span>
                  </td>
                  <td className="p-3 text-gray-300">{m.arrivalTime}</td>
                  <td className="p-3 text-gray-300">{m.burstTime}</td>
                  <td className="p-3 text-white font-bold">{m.completionTime}</td>
                  <td className="p-3 text-blue-400 font-bold">{m.turnaroundTime}</td>
                  <td className="p-3 text-amber-400 font-bold">{m.waitingTime}</td>
                  <td className="p-3 text-emerald-400 font-bold">{m.responseTime}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedVerifyProcess(m)}
                      className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ml-auto"
                    >
                      <Calculator className="h-3.5 w-3.5" />
                      <span>Show Calculation</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Averages Display Cards with "Show Calculation" Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono">
          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 text-center space-y-2 relative group">
            <span className="text-xs text-gray-400 block">8. Average Waiting Time</span>
            <div className="text-2xl font-bold text-amber-400">{activeResult.avgWaitingTime} <span className="text-xs text-gray-500 font-normal">units</span></div>
            <button
              onClick={showAvgWTCalculation}
              className="w-full py-1 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 rounded-lg text-[11px] font-semibold transition flex items-center justify-center space-x-1"
            >
              <Calculator className="h-3 w-3" />
              <span>Show Calculation</span>
            </button>
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 text-center space-y-2 relative group">
            <span className="text-xs text-gray-400 block">9. Average Turnaround Time</span>
            <div className="text-2xl font-bold text-blue-400">{activeResult.avgTurnaroundTime} <span className="text-xs text-gray-500 font-normal">units</span></div>
            <button
              onClick={showAvgTATCalculation}
              className="w-full py-1 bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-800/60 rounded-lg text-[11px] font-semibold transition flex items-center justify-center space-x-1"
            >
              <Calculator className="h-3 w-3" />
              <span>Show Calculation</span>
            </button>
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 text-center space-y-2 relative group">
            <span className="text-xs text-gray-400 block">10. Average Response Time</span>
            <div className="text-2xl font-bold text-emerald-400">{activeResult.avgResponseTime} <span className="text-xs text-gray-500 font-normal">units</span></div>
            <button
              onClick={showAvgRTCalculation}
              className="w-full py-1 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 rounded-lg text-[11px] font-semibold transition flex items-center justify-center space-x-1"
            >
              <Calculator className="h-3 w-3" />
              <span>Show Calculation</span>
            </button>
          </div>
        </div>
      </div>

      {/* VERIFY PROCESS CALCULATION MODAL */}
      {selectedVerifyProcess && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl p-6 rounded-2xl space-y-5 border border-blue-900/50 animate-fade-in font-mono text-xs">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedVerifyProcess.color }}></span>
                <h3 className="text-base font-bold text-white">
                  Mathematical Calculation Proof: {selectedVerifyProcess.name}
                </h3>
              </div>
              <button onClick={() => setSelectedVerifyProcess(null)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
                <div className="text-blue-400 font-bold">1. Turnaround Time (TAT) Calculation:</div>
                <div className="text-gray-200">
                  Turnaround Time = Completion Time (CT) - Arrival Time (AT)
                </div>
                <div className="text-emerald-400 font-bold text-sm">
                  TAT = {selectedVerifyProcess.completionTime} - {selectedVerifyProcess.arrivalTime} = {selectedVerifyProcess.turnaroundTime} time units
                </div>
              </div>

              <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
                <div className="text-amber-400 font-bold">2. Waiting Time (WT) Calculation:</div>
                <div className="text-gray-200">
                  Waiting Time = Turnaround Time (TAT) - Burst Time (BT)
                </div>
                <div className="text-amber-300 font-bold text-sm">
                  WT = {selectedVerifyProcess.turnaroundTime} - {selectedVerifyProcess.burstTime} = {selectedVerifyProcess.waitingTime} time units
                </div>
              </div>

              <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
                <div className="text-emerald-400 font-bold">3. Response Time (RT) Calculation:</div>
                <div className="text-gray-200">
                  Response Time = First CPU Start Time - Arrival Time (AT)
                </div>
                <div className="text-emerald-300 font-bold text-sm">
                  RT = {selectedVerifyProcess.firstExecutionTime} - {selectedVerifyProcess.arrivalTime} = {selectedVerifyProcess.responseTime} time units
                </div>
              </div>

              <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
                <div className="text-purple-400 font-bold">CPU Execution Intervals:</div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {selectedVerifyProcess.executionIntervals.map((slice, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-blue-950 text-blue-300 border border-blue-800 rounded font-bold">
                      Interval {idx + 1}: t={slice.start} to t={slice.end} ({slice.end - slice.start} units)
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
                <div className="text-rose-400 font-bold">Ready Queue Waiting Intervals:</div>
                <div className="space-y-1 text-[11px] text-gray-300">
                  {selectedVerifyProcess.waitingIntervals.map((wait, idx) => (
                    <div key={idx} className="flex justify-between border-b border-gray-900 pb-0.5">
                      <span>Wait Phase {idx + 1}: t={wait.start} to t={wait.end} ({wait.end - wait.start} units)</span>
                      <span className="text-gray-500 text-[10px]">{wait.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedVerifyProcess(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20"
              >
                Close Proof
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERIC VERIFICATION MODAL */}
      <CalculationVerificationModal
        data={genericVerificationModal}
        onClose={() => setGenericVerificationModal(null)}
      />
    </div>
  );
};
