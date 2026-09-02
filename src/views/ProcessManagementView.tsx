import React, { useState } from 'react';
import { Cpu, Plus, Trash2, RotateCcw, Calculator, X } from 'lucide-react';
import type { Process } from '../types/os';
import { simulateRoundRobin, simulateFCFS, simulateSJF } from '../utils/processScheduler';
import { GanttChart } from '../components/GanttChart';
import { OFFICIAL_SIMULATION_DEFAULTS } from '../utils/constants';
import { CalculationVerificationModal, type VerificationData } from '../components/CalculationVerificationModal';

export const ProcessManagementView: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>(OFFICIAL_SIMULATION_DEFAULTS.processes);
  const [timeQuantum, setTimeQuantum] = useState<number>(OFFICIAL_SIMULATION_DEFAULTS.timeQuantum);
  const [selectedAlgo, setSelectedAlgo] = useState<'RR' | 'FCFS' | 'SJF'>('RR');

  const [verificationModalData, setVerificationModalData] = useState<VerificationData | null>(null);

  // Form state for adding custom process
  const [isAddProcessOpen, setIsAddProcessOpen] = useState(false);
  const [procName, setProcName] = useState(`P${processes.length + 1}`);
  const [arrivalTime, setArrivalTime] = useState<number>(0);
  const [burstTime, setBurstTime] = useState<number>(4);

  const rrResult = simulateRoundRobin(processes, timeQuantum);
  const fcfsResult = simulateFCFS(processes);
  const sjfResult = simulateSJF(processes);

  const activeResult =
    selectedAlgo === 'RR' ? rrResult :
    selectedAlgo === 'FCFS' ? fcfsResult : sjfResult;

  const handleAddProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!procName || burstTime <= 0) return;

    const colors = ['#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6'];
    const color = colors[processes.length % colors.length];

    const newProc: Process = {
      id: 'p-' + Math.random().toString(36).substring(2, 7),
      name: procName,
      arrivalTime: Number(arrivalTime),
      burstTime: Number(burstTime),
      color
    };

    setProcesses(prev => [...prev, newProc]);
    setProcName(`P${processes.length + 2}`);
    setBurstTime(4);
    setIsAddProcessOpen(false);
  };

  const handleDeleteProcess = (id: string) => {
    if (processes.length <= 1) return;
    setProcesses(prev => prev.filter(p => p.id !== id));
  };

  const handleResetProcesses = () => {
    setProcesses(OFFICIAL_SIMULATION_DEFAULTS.processes);
    setTimeQuantum(OFFICIAL_SIMULATION_DEFAULTS.timeQuantum);
  };

  const showVerificationForMetric = (metricName: string, metricValue: string | number, formulaText: string, stepsList: string[]) => {
    setVerificationModalData({
      title: `${metricName} Verification Proof`,
      category: 'PROCESS',
      parameterInputs: [
        { label: 'Selected Algorithm', value: selectedAlgo === 'RR' ? `Round Robin (Quantum Q = ${timeQuantum})` : selectedAlgo },
        { label: 'Time Quantum (Q)', value: `${timeQuantum} time units` },
        { label: 'Processes Count', value: `${processes.length} Processes` },
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
            <span className="badge-academic">Interactive Customization</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Add custom processes, modify burst/arrival times, and adjust Time Quantum dynamically.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono">
          <button
            onClick={() => setIsAddProcessOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center space-x-1.5 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Custom Process</span>
          </button>
          <button
            onClick={handleResetProcesses}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center space-x-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Algorithm Switcher & Time Quantum Control */}
      <div className="glass-card p-5 rounded-2xl space-y-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
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
              Round Robin (RR)
            </button>
            <button
              onClick={() => setSelectedAlgo('FCFS')}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                selectedAlgo === 'FCFS'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              FCFS
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

          {/* Time Quantum Input Field */}
          {selectedAlgo === 'RR' && (
            <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl">
              <label className="text-slate-400 font-bold">Time Quantum (Q):</label>
              <input
                type="number"
                min="1"
                max="20"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(Math.max(1, Number(e.target.value)))}
                className="w-16 bg-slate-900 border border-slate-700 text-cyan-400 font-black rounded-lg px-2 py-0.5 text-center focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-500 text-[10px]">units</span>
            </div>
          )}
        </div>
      </div>

      {/* Input Processes Matrix & Custom Controls */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span>Interactive Input Process Queue ({processes.length} Processes)</span>
          </h3>
          <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-xl">
            Live Calculation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
          {processes.map((p) => (
            <div key={p.id} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 relative group">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-white text-sm flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
                  <span>{p.name}</span>
                </span>
                {processes.length > 1 && (
                  <button
                    onClick={() => handleDeleteProcess(p.id)}
                    title="Remove Process"
                    className="text-slate-500 hover:text-rose-400 p-1 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Arrival (AT):</span>
                  <input
                    type="number"
                    min="0"
                    value={p.arrivalTime}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value));
                      setProcesses(prev => prev.map(item => item.id === p.id ? { ...item, arrivalTime: val } : item));
                    }}
                    className="w-14 bg-slate-900 border border-slate-700 text-white rounded font-bold px-1 py-0.5 text-right text-[11px]"
                  />
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Burst (BT):</span>
                  <input
                    type="number"
                    min="1"
                    value={p.burstTime}
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value));
                      setProcesses(prev => prev.map(item => item.id === p.id ? { ...item, burstTime: val } : item));
                    }}
                    className="w-14 bg-slate-900 border border-slate-700 text-cyan-400 rounded font-bold px-1 py-0.5 text-right text-[11px]"
                  />
                </div>
              </div>
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
            onClick={() => showVerificationForMetric('Average Waiting Time', `${activeResult.avgWaitingTime} units`, 'Avg WT = Sum(TAT - BT) / N', processes.map(p => {
              const m = activeResult.metrics.find(x => x.name === p.name);
              return `${p.name} WT: ${m?.turnaroundTime} - ${m?.burstTime} = ${m?.waitingTime}`;
            }))}
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
            onClick={() => showVerificationForMetric('Average Turnaround Time', `${activeResult.avgTurnaroundTime} units`, 'Avg TAT = Sum(CT - AT) / N', processes.map(p => {
              const m = activeResult.metrics.find(x => x.name === p.name);
              return `${p.name} TAT: ${m?.completionTime} - ${m?.arrivalTime} = ${m?.turnaroundTime}`;
            }))}
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
            onClick={() => showVerificationForMetric('Average Response Time', `${activeResult.avgResponseTime} units`, 'Avg RT = Sum(FirstCPU - AT) / N', processes.map(p => {
              const m = activeResult.metrics.find(x => x.name === p.name);
              return `${p.name} RT: ${m?.firstExecutionTime} - ${m?.arrivalTime} = ${m?.responseTime}`;
            }))}
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
            onClick={() => showVerificationForMetric('CPU Utilization', `${activeResult.cpuUtilization}%`, 'Utilization = (Total Busy CPU / Schedule Length) * 100', [`Total Burst Sum = ${processes.reduce((acc, p) => acc + p.burstTime, 0)} units`, `Schedule Length = ${activeResult.totalExecutionTime} units`])}
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

      {/* ADD PROCESS MODAL */}
      {isAddProcessOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl space-y-4 border border-slate-800 animate-fade-in font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Plus className="h-5 w-5 text-cyan-400" />
                <span>Add Custom Process</span>
              </h3>
              <button onClick={() => setIsAddProcessOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProcess} className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Process Identifier (Name):</label>
                <input
                  type="text"
                  required
                  value={procName}
                  onChange={(e) => setProcName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Arrival Time (AT):</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(Number(e.target.value))}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Burst Time (BT):</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={burstTime}
                    onChange={(e) => setBurstTime(Number(e.target.value))}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-cyan-400 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProcessOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold shadow-md shadow-cyan-500/20"
                >
                  Add Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERIFICATION MODAL */}
      <CalculationVerificationModal
        data={verificationModalData}
        onClose={() => setVerificationModalData(null)}
      />
    </div>
  );
};
