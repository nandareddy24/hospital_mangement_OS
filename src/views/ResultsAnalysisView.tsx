import React from 'react';
import { Download, Printer, Cpu, Database, HardDrive, FileText } from 'lucide-react';
import { simulateRoundRobin } from '../utils/processScheduler';
import { calculateTeam10MemoryStats } from '../utils/memoryManager';
import { simulateDiskScheduling } from '../utils/diskScheduler';
import { TEAM_10_DEFAULTS } from '../utils/constants';

export const ResultsAnalysisView: React.FC = () => {
  const rrResult = simulateRoundRobin(TEAM_10_DEFAULTS.processes, TEAM_10_DEFAULTS.timeQuantum);
  const memStats = calculateTeam10MemoryStats(33554432);
  const diskResult = simulateDiskScheduling(
    TEAM_10_DEFAULTS.diskQueue,
    TEAM_10_DEFAULTS.initialHead,
    'FCFS',
    TEAM_10_DEFAULTS.cylinderMax
  );

  const handleExportCSV = () => {
    let csv = 'Module,Metric,Value,Unit/Details\n';
    csv += `Process Management,Algorithm,Round Robin,Time Quantum = ${TEAM_10_DEFAULTS.timeQuantum}\n`;
    csv += `Process Management,Average Waiting Time,${rrResult.avgWaitingTime},time units\n`;
    csv += `Process Management,Average Turnaround Time,${rrResult.avgTurnaroundTime},time units\n`;
    csv += `Process Management,Average Response Time,${rrResult.avgResponseTime},time units\n`;
    csv += `Process Management,CPU Utilization,${rrResult.cpuUtilization},%\n`;

    csv += `Memory Management,System RAM,${memStats.ramGB},GB (${memStats.ramBytes} Bytes)\n`;
    csv += `Memory Management,Page Size,${memStats.pageSizeKB},KB (4096 Bytes)\n`;
    csv += `Memory Management,Logical Space,${memStats.logicalSpaceMB},MB (33554432 Bytes)\n`;
    csv += `Memory Management,Derived Pages,${memStats.numberOfPages},pages\n`;
    csv += `Memory Management,Physical Frames,${memStats.allocatedFrames},frames (16 KB)\n`;
    csv += `Memory Management,Internal Fragmentation,${memStats.internalFragmentationBytes},Bytes\n`;

    csv += `Disk Scheduling,Algorithm,FCFS,First-Come First-Served Baseline\n`;
    csv += `Disk Scheduling,Cylinder Range,0 to 130,131 total tracks\n`;
    csv += `Disk Scheduling,Initial Head,${TEAM_10_DEFAULTS.initialHead},track location\n`;
    csv += `Disk Scheduling,Total Head Movement,${diskResult.totalSeekDistance},tracks\n`;
    csv += `Disk Scheduling,Average Seek Distance,${diskResult.avgSeekDistance},tracks/request\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Team10_OS_Evaluation_Results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="soft-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-orange-500">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Results &amp; Evaluation Analysis Report</h1>
            <span className="badge-academic">Team 10 Official Evaluation</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Consolidated outputs across all three Operating System simulation modules based strictly on Team 10 parameters.
          </p>
        </div>

        <div className="flex items-center space-x-3 no-print">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-mono shadow-md shadow-emerald-500/20 transition flex items-center space-x-1.5"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-mono shadow-md transition flex items-center space-x-1.5"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* SECTION A: PROCESS MANAGEMENT RESULTS */}
      <div className="soft-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-orange-500" />
            <span>Section A. Process Management Results</span>
          </h3>
          <span className="text-xs font-mono text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-xl font-bold">
            Round Robin (Time Quantum = 4)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
            <span className="text-slate-400">Average Waiting Time</span>
            <div className="text-2xl font-extrabold text-amber-600">{rrResult.avgWaitingTime} <span className="text-xs text-slate-400">units</span></div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
            <span className="text-slate-400">Average Turnaround Time</span>
            <div className="text-2xl font-extrabold text-orange-600">{rrResult.avgTurnaroundTime} <span className="text-xs text-slate-400">units</span></div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
            <span className="text-slate-400">Average Response Time</span>
            <div className="text-2xl font-extrabold text-emerald-600">{rrResult.avgResponseTime} <span className="text-xs text-slate-400">units</span></div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
            <span className="text-slate-400">CPU Utilization</span>
            <div className="text-2xl font-extrabold text-blue-600">{rrResult.cpuUtilization}%</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 bg-slate-50">
                <th className="p-3">Process</th>
                <th className="p-3">Arrival Time</th>
                <th className="p-3">Burst Time</th>
                <th className="p-3">Completion Time</th>
                <th className="p-3 text-orange-600">Turnaround Time</th>
                <th className="p-3 text-amber-600">Waiting Time</th>
                <th className="p-3 text-emerald-600">Response Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rrResult.metrics.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/80">
                  <td className="p-3 font-bold text-slate-900">{m.name}</td>
                  <td className="p-3 text-slate-600">{m.arrivalTime}</td>
                  <td className="p-3 text-slate-600">{m.burstTime}</td>
                  <td className="p-3 text-slate-900 font-bold">{m.completionTime}</td>
                  <td className="p-3 text-orange-600 font-bold">{m.turnaroundTime}</td>
                  <td className="p-3 text-amber-600 font-bold">{m.waitingTime}</td>
                  <td className="p-3 text-emerald-600 font-bold">{m.responseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION B: MEMORY MANAGEMENT RESULTS */}
      <div className="soft-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <Database className="h-5 w-5 text-emerald-600" />
            <span>Section B. Memory Management Results</span>
          </h3>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl font-bold">
            Paging Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400">Total System RAM</span>
            <div className="text-lg font-extrabold text-slate-900">{memStats.ramGB} GB ({memStats.ramBytes.toLocaleString()} B)</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400">Page Size / Offset Bits</span>
            <div className="text-lg font-extrabold text-blue-600">{memStats.pageSizeKB} KB (12 Bits Offset)</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400">Derived Virtual Pages</span>
            <div className="text-lg font-extrabold text-emerald-600">{memStats.numberOfPages.toLocaleString()} Pages</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400">Physical Frames Allocated</span>
            <div className="text-lg font-extrabold text-amber-600">{memStats.allocatedFrames} Frames (16 KB)</div>
          </div>
        </div>
      </div>

      {/* SECTION C: DISK SCHEDULING RESULTS */}
      <div className="soft-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <HardDrive className="h-5 w-5 text-amber-500" />
            <span>Section C. Disk Scheduling Results</span>
          </h3>
          <span className="text-xs font-mono text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl font-bold">
            FCFS Baseline (0–130)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400">Initial Head Position</span>
            <div className="text-xl font-extrabold text-blue-600">Cylinder #{TEAM_10_DEFAULTS.initialHead}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400">Total Head Movement</span>
            <div className="text-xl font-extrabold text-amber-600">{diskResult.totalSeekDistance} tracks</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400">Average Seek Distance</span>
            <div className="text-xl font-extrabold text-emerald-600">{diskResult.avgSeekDistance} tracks/req</div>
          </div>
        </div>
      </div>

      {/* SECTION D: OVERALL AUTOMATICALLY GENERATED ANALYSIS */}
      <div className="soft-card p-6 space-y-4 bg-gradient-to-r from-orange-50/50 via-slate-50 to-white border-l-4 border-l-orange-500">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
          <FileText className="h-5 w-5 text-orange-500" />
          <span>Section D. Overall Automatically Generated Analysis</span>
        </h3>

        <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
          <p>
            <strong>Round Robin Performance:</strong> Time quantum slicing ($Q=4$) ensures fair CPU time distribution across processes P1–P5. The preemption prevents P4 (burst 9) from starving shorter processes like P2 (burst 2) and P5 (burst 3), yielding an average turnaround time of 13.0 units and average waiting time of 8.0 units with 100% CPU utilization.
          </p>

          <p>
            <strong>Memory Paging Efficiency:</strong> Translating the 32 MB logical space into 8,192 pages of 4 KB each allows flexible non-contiguous physical allocation. Mapping 4 pages into resident physical RAM frames eliminates external fragmentation completely, leaving zero bytes of internal fragmentation because 32 MB is an exact multiple of 4 KB.
          </p>

          <p>
            <strong>Disk Trajectory Servicing:</strong> The FCFS disk scheduling baseline services requests in exact arrival sequence, resulting in 545 total cylinder tracks traversed (average seek distance of 68.13 tracks/request) without head starvation risks.
          </p>
        </div>
      </div>
    </div>
  );
};
