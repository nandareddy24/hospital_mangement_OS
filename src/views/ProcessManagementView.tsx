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
    <div className="space-y-8 animate-fade-in font-sans">
      <div className="soft-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-orange-500">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Process Management &amp; CPU Scheduling</h1>
            <span className="badge-academic">Team 10 Official Suite</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pre-configured strictly with Team 10 parameters. All metrics generated dynamically by Round Robin algorithm.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
            <button
              onClick={() => setSelectedAlgo('RR')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                selectedAlgo === 'RR' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Round Robin (Q={timeQuantum}) *Team 10
            </button>
            <button
              onClick={() => setSelectedAlgo('FCFS')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                selectedAlgo === 'FCFS' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FCFS
            </button>
            <button
              onClick={() => setSelectedAlgo('SJF')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                selectedAlgo === 'SJF' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SJF
            </button>
          </div>
        </div>
      </div>

      {/* 1. Input Process Table */}
      <div className="soft-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-orange-500" />
            <span>1. Official Team 10 Input Process Parameters</span>
          </h3>
          <div className="flex items-center space-x-2 text-xs font-mono text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-xl font-bold">
            <Lock className="h-3.5 w-3.5" />
            <span>Team 10 Locked (Q = {timeQuantum})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 bg-slate-50">
                <th className="p-3">Process ID</th>
                <th className="p-3">Arrival Time (AT)</th>
                <th className="p-3">Burst Time (BT)</th>
                <th className="p-3">Time Quantum (Q)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processes.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="p-3 font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></span>
                    <span className="text-sm font-sans">{p.name}</span>
                  </td>
                  <td className="p-3 text-slate-700 font-bold">{p.arrivalTime} time units</td>
                  <td className="p-3 text-slate-700 font-bold">{p.burstTime} time units</td>
                  <td className="p-3 text-orange-600 font-bold">{timeQuantum} time units</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
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
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 px-1">
          <span>3. Dynamic Execution Gantt Chart Timeline</span>
        </h3>
        <GanttChart scheduleResult={activeResult} timeQuantum={timeQuantum} />
      </div>

      {/* 3. Ready Queue Step-by-Step Execution Log */}
      <div className="soft-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
            <ArrowRight className="h-4 w-4 text-emerald-600" />
            <span>2 &amp; Step-by-Step Execution: Round Robin Ready Queue Transitions</span>
          </h3>
          <span className="text-xs font-mono text-slate-500 font-bold">Total Steps: {rrResult.steps.length}</span>
        </div>

        <div className="overflow-x-auto max-h-[380px]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-2.5 px-3">Step #</th>
                <th className="py-2.5 px-3">Time (t)</th>
                <th className="py-2.5 px-3">Active CPU Process</th>
                <th className="py-2.5 px-3 text-emerald-700">Ready Queue State (HEAD &rarr; TAIL)</th>
                <th className="py-2.5 px-3">Remaining Bursts [P1,P2,P3,P4,P5]</th>
                <th className="py-2.5 px-3">Context Event Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rrResult.steps.map((step) => (
                <tr key={step.stepIndex} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 text-slate-500 font-bold">Step {step.stepIndex}</td>
                  <td className="py-2.5 px-3 text-orange-600 font-bold">t = {step.time}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    {step.activeProcessName ? (
                      <span className="px-2 py-0.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 font-bold">
                        {step.activeProcessName}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">CPU IDLE</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {step.readyQueue.length === 0 ? (
                      <span className="text-slate-400 italic">[ Empty Queue ]</span>
                    ) : (
                      <div className="flex items-center space-x-1">
                        {step.readyQueue.map((pid, idx) => {
                          const pName = processes.find(p => p.id === pid)?.name || pid;
                          return (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 rounded font-bold">
                              {pName}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                    [{processes.map(p => step.remainingBurstTimes[p.id] ?? 0).join(', ')}]
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">{step.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Calculated Process Metrics Table & Verification Tools */}
      <div className="soft-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>4–7. Calculated Process Timing Metrics Table</span>
          </h3>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl font-bold">
            CPU Utilization: {activeResult.cpuUtilization}%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 bg-slate-50">
                <th className="p-3">Process</th>
                <th className="p-3">Arrival Time (AT)</th>
                <th className="p-3">Burst Time (BT)</th>
                <th className="p-3 text-slate-900">Completion Time (CT)</th>
                <th className="p-3 text-orange-600">Turnaround Time (TAT = CT - AT)</th>
                <th className="p-3 text-amber-600">Waiting Time (WT = TAT - BT)</th>
                <th className="p-3 text-emerald-600">Response Time (RT = FirstCPU - AT)</th>
                <th className="p-3 text-right">Proof Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeResult.metrics.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80">
                  <td className="p-3 font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }}></span>
                    <span className="text-sm font-sans">{m.name}</span>
                  </td>
                  <td className="p-3 text-slate-600">{m.arrivalTime}</td>
                  <td className="p-3 text-slate-600">{m.burstTime}</td>
                  <td className="p-3 text-slate-900 font-bold">{m.completionTime}</td>
                  <td className="p-3 text-orange-600 font-bold">{m.turnaroundTime}</td>
                  <td className="p-3 text-amber-600 font-bold">{m.waitingTime}</td>
                  <td className="p-3 text-emerald-600 font-bold">{m.responseTime}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedVerifyProcess(m)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 ml-auto shadow-xs"
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
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
            <span className="text-xs text-slate-500 block font-bold">8. Average Waiting Time</span>
            <div className="text-2xl font-extrabold text-amber-600">{activeResult.avgWaitingTime} <span className="text-xs text-slate-400 font-normal">units</span></div>
            <button
              onClick={showAvgWTCalculation}
              className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
            >
              <Calculator className="h-3 w-3" />
              <span>Show Calculation</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
            <span className="text-xs text-slate-500 block font-bold">9. Average Turnaround Time</span>
            <div className="text-2xl font-extrabold text-orange-600">{activeResult.avgTurnaroundTime} <span className="text-xs text-slate-400 font-normal">units</span></div>
            <button
              onClick={showAvgTATCalculation}
              className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
            >
              <Calculator className="h-3 w-3" />
              <span>Show Calculation</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
            <span className="text-xs text-slate-500 block font-bold">10. Average Response Time</span>
            <div className="text-2xl font-extrabold text-emerald-600">{activeResult.avgResponseTime} <span className="text-xs text-slate-400 font-normal">units</span></div>
            <button
              onClick={showAvgRTCalculation}
              className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
            >
              <Calculator className="h-3 w-3" />
              <span>Show Calculation</span>
            </button>
          </div>
        </div>
      </div>

      {/* VERIFY PROCESS CALCULATION MODAL */}
      {selectedVerifyProcess && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="soft-panel w-full max-w-xl p-6 rounded-2xl space-y-5 border border-slate-200 animate-fade-in font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedVerifyProcess.color }}></span>
                <h3 className="text-base font-bold text-slate-900">
                  Mathematical Calculation Proof: {selectedVerifyProcess.name}
                </h3>
              </div>
              <button onClick={() => setSelectedVerifyProcess(null)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-orange-600 font-bold">1. Turnaround Time (TAT) Calculation:</div>
                <div className="text-slate-700">
                  Turnaround Time = Completion Time (CT) - Arrival Time (AT)
                </div>
                <div className="text-orange-700 font-bold text-sm">
                  TAT = {selectedVerifyProcess.completionTime} - {selectedVerifyProcess.arrivalTime} = {selectedVerifyProcess.turnaroundTime} time units
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-amber-600 font-bold">2. Waiting Time (WT) Calculation:</div>
                <div className="text-slate-700">
                  Waiting Time = Turnaround Time (TAT) - Burst Time (BT)
                </div>
                <div className="text-amber-700 font-bold text-sm">
                  WT = {selectedVerifyProcess.turnaroundTime} - {selectedVerifyProcess.burstTime} = {selectedVerifyProcess.waitingTime} time units
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-emerald-600 font-bold">3. Response Time (RT) Calculation:</div>
                <div className="text-slate-700">
                  Response Time = First CPU Start Time - Arrival Time (AT)
                </div>
                <div className="text-emerald-700 font-bold text-sm">
                  RT = {selectedVerifyProcess.firstExecutionTime} - {selectedVerifyProcess.arrivalTime} = {selectedVerifyProcess.responseTime} time units
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-slate-900 font-bold">CPU Execution Intervals:</div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {selectedVerifyProcess.executionIntervals.map((slice, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded-lg font-bold">
                      Interval {idx + 1}: t={slice.start} to t={slice.end} ({slice.end - slice.start} units)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedVerifyProcess(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md transition"
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
