import React from 'react';
import { Download, Printer, Cpu, Database, HardDrive, FileText, Layers } from 'lucide-react';
import { simulateRoundRobin } from '../utils/processScheduler';
import { calculateTeam10MemoryStats } from '../utils/memoryManager';
import { simulateDiskScheduling } from '../utils/diskScheduler';
import { TEAM_10_DEFAULTS } from '../utils/constants';

export const ResultsAnalysisView: React.FC = () => {
  const processResult = simulateRoundRobin(TEAM_10_DEFAULTS.processes, TEAM_10_DEFAULTS.timeQuantum);
  const memoryStats = calculateTeam10MemoryStats(33554432); // 32 MB
  const diskResult = simulateDiskScheduling(TEAM_10_DEFAULTS.diskQueue, TEAM_10_DEFAULTS.initialHead, 'FCFS', TEAM_10_DEFAULTS.cylinderMax);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvLines = [
      "Team 10 Academic Evaluation Summary Report",
      "Module,Parameter / Metric,Calculated Value",
      `Process Management,Algorithm,Round Robin (Time Quantum = 4)`,
      `Process Management,Processes,P1(0;6) P2(2;2) P3(3;5) P4(5;9) P5(7;3)`,
      `Process Management,Total Execution Time,${processResult.totalExecutionTime} time units`,
      `Process Management,Average Turnaround Time,${processResult.avgTurnaroundTime} time units`,
      `Process Management,Average Waiting Time,${processResult.avgWaitingTime} time units`,
      `Process Management,Average Response Time,${processResult.avgResponseTime} time units`,
      `Process Management,CPU Utilization,${processResult.cpuUtilization}%`,
      `Memory Management,RAM Size,4 GB (${memoryStats.ramBytes.toLocaleString()} Bytes)`,
      `Memory Management,Page Size,4 KB (${memoryStats.pageSizeBytes.toLocaleString()} Bytes)`,
      `Memory Management,Logical Space,32 MB (${memoryStats.logicalSpaceBytes.toLocaleString()} Bytes)`,
      `Memory Management,Allocated Frames,4 Frames (${memoryStats.allocatedMemoryBytes.toLocaleString()} Bytes)`,
      `Memory Management,Number of Pages,${memoryStats.numberOfPages.toLocaleString()} pages`,
      `Memory Management,Internal Fragmentation,${memoryStats.internalFragmentationBytes} Bytes`,
      `Disk Scheduling,Algorithm,FCFS (First-Come First-Served)`,
      `Disk Scheduling,Cylinder Range,0 to 130`,
      `Disk Scheduling,Initial Head Position,${TEAM_10_DEFAULTS.initialHead}`,
      `Disk Scheduling,Request Queue,${TEAM_10_DEFAULTS.diskQueue.join(' -> ')}`,
      `Disk Scheduling,Total Head Movement,${diskResult.totalSeekDistance} tracks`,
      `Disk Scheduling,Average Seek Distance,${diskResult.avgSeekDistance} tracks/request`
    ];

    const blob = new Blob([csvLines.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Team10_OS_Evaluation_Results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in print:p-0 print:text-black">
      {/* Top Action Header */}
      <div className="glass-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-gray-950 border border-blue-900/40 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Results &amp; Evaluation Analysis</h1>
            <span className="badge-academic">Team 10 Summary Report</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Unified OS performance report combining Process Management, Memory Management, and Disk Scheduling.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-semibold flex items-center space-x-2 border border-gray-700 transition"
          >
            <Download className="h-4 w-4 text-blue-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-blue-500/20 transition"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Title Header */}
      <div className="hidden print:block border-b-2 border-black pb-4 mb-6">
        <h1 className="text-2xl font-bold">Team 10: Academic OS Resource Management Simulator Report</h1>
        <p className="text-sm">Course Project Report &bull; Integrated Library OS Simulator</p>
      </div>

      {/* SECTION A: PROCESS MANAGEMENT RESULTS */}
      <div className="glass-card p-6 rounded-2xl space-y-5 border border-blue-900/40">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-blue-400" />
            <span>A. Process Management Results</span>
          </h2>
          <span className="text-xs font-mono text-blue-400 font-bold bg-blue-950 border border-blue-800 px-2.5 py-0.5 rounded">
            Round Robin (Time Quantum = {TEAM_10_DEFAULTS.timeQuantum})
          </span>
        </div>

        {/* Process Metrics Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-300 font-mono">Process Execution &amp; Timing Metrics Table</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 bg-gray-950/60">
                  <th className="p-3">Process</th>
                  <th className="p-3">Arrival Time (AT)</th>
                  <th className="p-3">Burst Time (BT)</th>
                  <th className="p-3 text-white">Completion Time (CT)</th>
                  <th className="p-3 text-blue-400">Turnaround Time (TAT = CT - AT)</th>
                  <th className="p-3 text-amber-400">Waiting Time (WT = TAT - BT)</th>
                  <th className="p-3 text-emerald-400">Response Time (RT = FirstCPU - AT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {processResult.metrics.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-900/40">
                    <td className="p-3 font-bold text-white flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }}></span>
                      <span className="font-sans text-sm">{m.name}</span>
                    </td>
                    <td className="p-3 text-gray-300">{m.arrivalTime}</td>
                    <td className="p-3 text-gray-300">{m.burstTime}</td>
                    <td className="p-3 text-white font-bold">{m.completionTime}</td>
                    <td className="p-3 text-blue-400 font-bold">{m.turnaroundTime}</td>
                    <td className="p-3 text-amber-400 font-bold">{m.waitingTime}</td>
                    <td className="p-3 text-emerald-400 font-bold">{m.responseTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gantt Chart Block Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-300 font-mono">Gantt Chart Execution Blocks</h4>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {processResult.ganttChart.map((block, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-lg border font-bold text-white flex items-center space-x-1.5 shadow"
                style={{ backgroundColor: block.color, borderColor: `${block.color}80` }}
              >
                <span>{block.processName}</span>
                <span className="text-[10px] opacity-80">({block.startTime}&ndash;{block.endTime})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Process Averages */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs pt-2">
          <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 text-center space-y-0.5">
            <span className="text-gray-400 text-[11px]">Avg Waiting Time</span>
            <div className="text-xl font-bold text-amber-400">{processResult.avgWaitingTime} units</div>
          </div>
          <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 text-center space-y-0.5">
            <span className="text-gray-400 text-[11px]">Avg Turnaround Time</span>
            <div className="text-xl font-bold text-blue-400">{processResult.avgTurnaroundTime} units</div>
          </div>
          <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 text-center space-y-0.5">
            <span className="text-gray-400 text-[11px]">Avg Response Time</span>
            <div className="text-xl font-bold text-emerald-400">{processResult.avgResponseTime} units</div>
          </div>
          <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 text-center space-y-0.5">
            <span className="text-gray-400 text-[11px]">CPU Utilization</span>
            <div className="text-xl font-bold text-purple-400">{processResult.cpuUtilization}%</div>
          </div>
        </div>
      </div>

      {/* SECTION B: MEMORY MANAGEMENT RESULTS */}
      <div className="glass-card p-6 rounded-2xl space-y-5 border border-emerald-900/40">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Database className="h-5 w-5 text-emerald-400" />
            <span>B. Memory Management Results</span>
          </h2>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded">
            Paging Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
            <span className="text-gray-400 text-[11px] block">RAM Size</span>
            <span className="text-white font-bold text-sm">4 GB ({memoryStats.ramBytes.toLocaleString()} B)</span>
          </div>

          <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
            <span className="text-gray-400 text-[11px] block">Page Size</span>
            <span className="text-blue-400 font-bold text-sm">4 KB ({memoryStats.pageSizeBytes.toLocaleString()} B)</span>
          </div>

          <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
            <span className="text-gray-400 text-[11px] block">Logical Address Space</span>
            <span className="text-purple-400 font-bold text-sm">32 MB ({memoryStats.logicalSpaceBytes.toLocaleString()} B)</span>
          </div>

          <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
            <span className="text-gray-400 text-[11px] block">Allocated Frames</span>
            <span className="text-amber-400 font-bold text-sm">4 Frames ({memoryStats.allocatedMemoryBytes.toLocaleString()} B)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
            <span className="text-gray-400">Derived Number of Pages:</span>
            <div className="text-xl font-bold text-emerald-400">{memoryStats.numberOfPages.toLocaleString()} pages</div>
            <div className="text-[10px] text-gray-500">Logical Space (33,554,432) / Page Size (4,096)</div>
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
            <span className="text-gray-400">Memory Utilization:</span>
            <div className="text-xl font-bold text-blue-400">{memoryStats.pageCapacityUtilization}% Capacity</div>
            <div className="text-[10px] text-gray-500">0.0488% frame allocation ratio (4/8,192 pages resident)</div>
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
            <span className="text-gray-400">Internal Fragmentation:</span>
            <div className="text-xl font-bold text-rose-400">{memoryStats.internalFragmentationBytes} Bytes</div>
            <div className="text-[10px] text-gray-500">Exact 4KB page alignment (32MB mod 4096 = 0)</div>
          </div>
        </div>

        {/* Page Table Overview */}
        <div className="space-y-2 font-mono text-xs">
          <h4 className="font-semibold text-gray-300">Page Table Allocation Overview (4 Resident Physical Frames)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { frame: 0, page: 12, range: '0x00000000 – 0x00000FFF' },
              { frame: 1, page: 48, range: '0x00001000 – 0x00001FFF' },
              { frame: 2, page: 102, range: '0x00002000 – 0x00002FFF' },
              { frame: 3, page: 256, range: '0x00003000 – 0x00003FFF' }
            ].map(entry => (
              <div key={entry.frame} className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                <div className="flex justify-between font-bold">
                  <span className="text-white">FRAME {entry.frame}</span>
                  <span className="text-emerald-400">Page #{entry.page}</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-1">{entry.range}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION C: DISK SCHEDULING RESULTS */}
      <div className="glass-card p-6 rounded-2xl space-y-5 border border-amber-900/40">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <HardDrive className="h-5 w-5 text-amber-400" />
            <span>C. Disk Scheduling Results</span>
          </h2>
          <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950 border border-amber-800 px-2.5 py-0.5 rounded">
            FCFS Algorithm (Official Baseline)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
            <span className="text-gray-400 text-[11px] block">Cylinder Range</span>
            <span className="text-white font-bold text-sm">0 to 130 Cylinders</span>
          </div>

          <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
            <span className="text-gray-400 text-[11px] block">Initial Head Position</span>
            <span className="text-amber-400 font-bold text-sm">Cylinder #65</span>
          </div>

          <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
            <span className="text-gray-400 text-[11px] block">Total Head Movement</span>
            <span className="text-amber-400 font-bold text-sm">{diskResult.totalSeekDistance} tracks</span>
          </div>

          <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
            <span className="text-gray-400 text-[11px] block">Average Seek Distance</span>
            <span className="text-emerald-400 font-bold text-sm">{diskResult.avgSeekDistance} tracks/request</span>
          </div>
        </div>

        {/* Head Movement Sequence & Seek Table */}
        <div className="space-y-2 font-mono text-xs">
          <h4 className="font-semibold text-gray-300">FCFS Head Movement Sequence &amp; Absolute Seek Table</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 bg-gray-950/60">
                  <th className="p-2.5">Step #</th>
                  <th className="p-2.5">Head Movement Path</th>
                  <th className="p-2.5 text-amber-400">Absolute Seek Distance Formula</th>
                  <th className="p-2.5 text-blue-400">Cumulative Seek Tracks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {diskResult.trajectory.map(step => (
                  <tr key={step.stepIndex} className="hover:bg-gray-900/40">
                    <td className="p-2.5 font-bold text-gray-400">Step {step.stepIndex}</td>
                    <td className="p-2.5 font-bold text-white">{step.fromCylinder} &rarr; {step.toCylinder}</td>
                    <td className="p-2.5 text-amber-400 font-bold">|{step.toCylinder} - {step.fromCylinder}| = +{step.seekDistance} tracks</td>
                    <td className="p-2.5 text-blue-400 font-bold">{step.cumulativeSeek} tracks</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION D: OVERALL ANALYSIS */}
      <div className="glass-card p-6 rounded-2xl space-y-5 border border-purple-900/40 bg-gradient-to-r from-purple-950/20 via-gray-950 to-gray-950">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FileText className="h-5 w-5 text-purple-400" />
            <span>D. Overall Automatically Generated Evaluation Analysis</span>
          </h2>
          <span className="text-xs font-mono text-purple-300 font-bold bg-purple-950 border border-purple-800 px-2.5 py-0.5 rounded">
            Generated from Calculated Engine Outputs
          </span>
        </div>

        <div className="space-y-4 text-xs font-sans leading-relaxed text-gray-200">
          <div className="p-4 bg-gray-950/80 rounded-xl border border-gray-800 space-y-1.5">
            <h4 className="font-bold text-blue-400 flex items-center space-x-2 font-mono">
              <Cpu className="h-4 w-4" />
              <span>1. Round Robin CPU Process Scheduling Performance</span>
            </h4>
            <p className="text-gray-300">
              The Round Robin scheduler with Time Quantum = 4 executed all 5 processes (P1–P5) over a total span of <strong>{processResult.totalExecutionTime} time units</strong>, achieving <strong>{processResult.cpuUtilization}% CPU utilization</strong> with zero CPU idle gaps. Because Round Robin enforces context switches at quantum boundaries, shorter processes such as P2 (burst = 2) finish early at t=6 with a waiting time of only 2 time units. The overall system achieved an <strong>average waiting time of {processResult.avgWaitingTime} units</strong>, an <strong>average turnaround time of {processResult.avgTurnaroundTime} units</strong>, and a low <strong>average response time of {processResult.avgResponseTime} units</strong>, ensuring interactive time-sharing fairness.
            </p>
          </div>

          <div className="p-4 bg-gray-950/80 rounded-xl border border-gray-800 space-y-1.5">
            <h4 className="font-bold text-emerald-400 flex items-center space-x-2 font-mono">
              <Database className="h-4 w-4" />
              <span>2. Memory Paging &amp; Virtual-to-Physical Address Translation</span>
            </h4>
            <p className="text-gray-300">
              The Memory Paging unit divides the 32 MB process logical space ($33,554,432$ Bytes) into <strong>8,192 virtual pages</strong> of 4 KB ($4,096$ Bytes) each. The system allocates <strong>4 physical RAM frames</strong> ($16,384$ Bytes = 16 KB) for active execution. Because the process logical space of 32 MB is an exact integer multiple of the 4 KB page size ($33,554,432 \pmod{4096} = 0$), the calculated internal fragmentation across the process space is exactly <strong>0 Bytes</strong>.
            </p>
          </div>

          <div className="p-4 bg-gray-950/80 rounded-xl border border-gray-800 space-y-1.5">
            <h4 className="font-bold text-amber-400 flex items-center space-x-2 font-mono">
              <HardDrive className="h-4 w-4" />
              <span>3. Disk Cylinder Trajectory &amp; FCFS Head Movement</span>
            </h4>
            <p className="text-gray-300">
              The First-Come First-Served (FCFS) disk driver serviced the 8 requested cylinders ($25, 105, 40, 115, 55, 90, 10, 120$) starting from initial head position 65 across cylinder range 0–130. FCFS moves strictly in arrival sequence, yielding individual seek distances of 40, 80, 65, 75, 60, 35, 80, and 110 tracks. This resulted in a <strong>total head movement of {diskResult.totalSeekDistance} tracks</strong> and an <strong>average seek distance of {diskResult.avgSeekDistance} tracks per request</strong>.
            </p>
          </div>

          <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-800/60 space-y-1.5">
            <h4 className="font-bold text-purple-300 flex items-center space-x-2 font-mono">
              <Layers className="h-4 w-4" />
              <span>4. Integrated Domain Evaluation (Library Operations &rarr; OS Kernel)</span>
            </h4>
            <p className="text-gray-300">
              In this academic application, functional Library transactions map directly to OS kernel requests. Borrowing a book spawns a CPU process execution burst (scheduled via Round Robin Q=4), looks up book catalog index pages in virtual RAM (translating 32-bit logical addresses to physical frames), and issues a disk cylinder read request (serviced by FCFS disk head movements). This integration demonstrates the complete operational lifecycle of modern Operating System resource management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
