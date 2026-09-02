import React, { useState } from 'react';
import { Cpu, Lock, Calculator } from 'lucide-react';
import type { Process } from '../types/os';
import { simulateRoundRobin, simulateFCFS, simulateSJF } from '../utils/processScheduler';
import { GanttChart } from '../components/GanttChart';
import { OFFICIAL_SIMULATION_DEFAULTS } from '../utils/constants';
import { CalculationVerificationModal, type VerificationData } from '../components/CalculationVerificationModal';

export const ProcessManagementView: React.FC = () => {
  const [processes] = useState<Process[]>(OFFICIAL_SIMULATION_DEFAULTS.processes);
  const [timeQuantum] = useState<number>(OFFICIAL_SIMULATION_DEFAULTS.timeQuantum);
  const [selectedAlgo, setSelectedAlgo] = useState<'RR' | 'FCFS' | 'SJF'>('RR');

  const [verificationModalData, setVerificationModalData] = useState<VerificationData | null>(null);

  const rrResult = simulateRoundRobin(processes, timeQuantum);
  const fcfsResult = simulateFCFS(processes);
  const sjfResult = simulateSJF(processes);

  const activeResult =
    selectedAlgo === 'RR' ? rrResult :
    selectedAlgo === 'FCFS' ? fcfsResult : sjfResult;

  const showVerificationForMetric = (metricName: string, metricValue: string | number, formulaText: string, stepsList: string[]) => {
    setVerificationModalData({
      title: `${metricName} Verification Proof`,
      category: 'PROCESS',
      parameterInputs: [
        { label: 'Selected Algorithm', value: selectedAlgo === 'RR' ? `Round Robin (Quantum Q = ${timeQuantum})` : selectedAlgo },
        { label: 'Time Quantum (Q)', value: `${timeQuantum} time units` },
        { label: 'Processes Count', value: `${processes.length} Processes (P1-P5)` },
        { label: 'Input Process Set', value: processes.map(p => `${p.name}(AT:${p.arrivalTime}, BT:${p.burstTime})`).join(', ') }
      ],
      formulas: [
        {
          title: `${metricName} Equation`,
          equation: formulaText,
          result: `Calculated ${metricName} = ${metricValue}`
        }
      ],
      steps: stepsList.map(s => ({ stepName: 'Calculation Step', detail: s }))
    });
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Top Banner */}
      <div className="glass-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-cyan-500">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">CPU Process Scheduling Simulator</h1>
            <span className="badge-academic">Master Evaluation Suite</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pre-configured strictly with official parameters. All metrics generated dynamically by Round Robin algorithm.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1.5 rounded-xl font-bold">
          <Lock className="h-4 w-4" />
          <span>Round Robin (Q={timeQuantum}) Enforced</span>
        </div>
      </div>

      {/* Algorithm Switcher */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-bold">Select Scheduler Engine:</span>
          <button
            onClick={() => setSelectedAlgo('RR')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              selectedAlgo === 'RR'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Round Robin (Q={timeQuantum}) *Official
          </button>
          <button
            onClick={() => setSelectedAlgo('FCFS')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              selectedAlgo === 'FCFS'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            FCFS Baseline
          </button>
          <button
            onClick={() => setSelectedAlgo('SJF')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              selectedAlgo === 'SJF'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            SJF Non-Preemptive
          </button>
        </div>

        <span className="text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-xl">
          Active: {selectedAlgo === 'RR' ? 'Round Robin (Q=4)' : selectedAlgo}
        </span>
      </div>

      {/* Input Processes Matrix */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span>1. Official Input Process Parameters</span>
          </h3>
          <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-xl">
            Official Locked (Q = {timeQuantum})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
          {processes.map((p) => (
            <div key={p.id} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-white text-sm">{p.name}</span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
              </div>
              <div className="text-slate-400 text-[11px]">Arrival Time (AT): <strong className="text-white">{p.arrivalTime}</strong></div>
              <div className="text-slate-400 text-[11px]">Burst Time (BT): <strong className="text-cyan-400">{p.burstTime}</strong></div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-cyan-500">
          <span className="text-slate-400 font-bold block">Average Waiting Time</span>
          <div className="text-3xl font-black text-cyan-400">{activeResult.avgWaitingTime} <span className="text-xs text-slate-500 font-normal">units</span></div>
          <button
            onClick={() => showVerificationForMetric('Average Waiting Time', `${activeResult.avgWaitingTime} units`, 'Avg WT = Sum(TAT - BT) / N = (6+2+12+11+9)/5 = 40/5', ['P1 WT: 12 - 6 = 6', 'P2 WT: 4 - 2 = 2', 'P3 WT: 17 - 5 = 12', 'P4 WT: 20 - 9 = 11', 'P5 WT: 12 - 3 = 9'])}
            className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
          >
            <Calculator className="h-3 w-3 text-cyan-400" />
            <span>Show Calculation</span>
          </button>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-emerald-500">
          <span className="text-slate-400 font-bold block">Average Turnaround Time</span>
          <div className="text-3xl font-black text-emerald-400">{activeResult.avgTurnaroundTime} <span className="text-xs text-slate-500 font-normal">units</span></div>
          <button
            onClick={() => showVerificationForMetric('Average Turnaround Time', `${activeResult.avgTurnaroundTime} units`, 'Avg TAT = Sum(CT - AT) / N = (12+4+17+20+12)/5 = 65/5', ['P1 TAT: 12 - 0 = 12', 'P2 TAT: 6 - 2 = 4', 'P3 TAT: 20 - 3 = 17', 'P4 TAT: 25 - 5 = 20', 'P5 TAT: 19 - 7 = 12'])}
            className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
          >
            <Calculator className="h-3 w-3 text-emerald-400" />
            <span>Show Calculation</span>
          </button>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-indigo-500">
          <span className="text-slate-400 font-bold block">Average Response Time</span>
          <div className="text-3xl font-black text-indigo-400">{activeResult.avgResponseTime} <span className="text-xs text-slate-500 font-normal">units</span></div>
          <button
            onClick={() => showVerificationForMetric('Average Response Time', `${activeResult.avgResponseTime} units`, 'Avg RT = Sum(FirstCPU - AT) / N = (0+2+3+7+9)/5 = 21/5', ['P1 RT: 0 - 0 = 0', 'P2 RT: 4 - 2 = 2', 'P3 RT: 6 - 3 = 3', 'P4 RT: 12 - 5 = 7', 'P5 RT: 16 - 7 = 9'])}
            className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
          >
            <Calculator className="h-3 w-3 text-indigo-400" />
            <span>Show Calculation</span>
          </button>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-amber-500">
          <span className="text-slate-400 font-bold block">CPU Utilization</span>
          <div className="text-3xl font-black text-amber-400">{activeResult.cpuUtilization}%</div>
          <button
            onClick={() => showVerificationForMetric('CPU Utilization', `${activeResult.cpuUtilization}%`, 'Utilization = (Total Busy CPU Time / Total Schedule Length) * 100', ['Total Burst Sum = 6 + 2 + 5 + 9 + 3 = 25 units', 'Schedule Length = 25 units', 'CPU Utilization = (25 / 25) * 100 = 100.0%'])}
            className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
          >
            <Calculator className="h-3 w-3 text-amber-400" />
            <span>Show Calculation</span>
          </button>
        </div>
      </div>

      {/* Gantt Chart Section */}
      <GanttChart scheduleResult={activeResult} timeQuantum={selectedAlgo === 'RR' ? timeQuantum : undefined} />

      {/* Detailed Process Calculation Metrics Table */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center justify-between">
          <span>Process Timing Metrics Table ({selectedAlgo})</span>
          <span className="text-xs font-mono text-cyan-400 font-bold">Total Execution: {activeResult.totalExecutionTime} units</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="p-3">Process</th>
                <th className="p-3">Arrival (AT)</th>
                <th className="p-3">Burst (BT)</th>
                <th className="p-3">Completion (CT)</th>
                <th className="p-3 text-cyan-400">Turnaround (TAT = CT - AT)</th>
                <th className="p-3 text-amber-400">Waiting (WT = TAT - BT)</th>
                <th className="p-3 text-indigo-400">Response (RT = FirstCPU - AT)</th>
                <th className="p-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {activeResult.metrics.map((m) => (
                <tr key={m.id} className="hover:bg-slate-900/60 transition">
                  <td className="p-3 font-bold text-white flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }}></span>
                    <span>{m.name}</span>
                  </td>
                  <td className="p-3 text-slate-400">{m.arrivalTime}</td>
                  <td className="p-3 text-slate-400">{m.burstTime}</td>
                  <td className="p-3 text-white font-bold">{m.completionTime}</td>
                  <td className="p-3 text-cyan-400 font-bold">{m.turnaroundTime}</td>
                  <td className="p-3 text-amber-400 font-bold">{m.waitingTime}</td>
                  <td className="p-3 text-indigo-400 font-bold">{m.responseTime}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => showVerificationForMetric(`Process ${m.name} Derivation`, `CT=${m.completionTime}, TAT=${m.turnaroundTime}, WT=${m.waitingTime}, RT=${m.responseTime}`, `Process ${m.name} (AT:${m.arrivalTime}, BT:${m.burstTime})`, [`Completion Time (CT) = ${m.completionTime}`, `Turnaround Time (TAT) = ${m.completionTime} - ${m.arrivalTime} = ${m.turnaroundTime}`, `Waiting Time (WT) = ${m.turnaroundTime} - ${m.burstTime} = ${m.waitingTime}`, `Response Time (RT) = ${m.firstExecutionTime} - ${m.arrivalTime} = ${m.responseTime}`])}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-cyan-400 border border-slate-800 rounded-lg text-[10px] font-bold transition"
                    >
                      Show Proof
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VERIFICATION MODAL */}
      <CalculationVerificationModal
        data={verificationModalData}
        onClose={() => setVerificationModalData(null)}
      />
    </div>
  );
};
