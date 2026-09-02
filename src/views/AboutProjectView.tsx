import React from 'react';
import { Cpu, Database, HardDrive, ShieldCheck, Layers, Code2, CheckCircle2, FileText, Award } from 'lucide-react';

export const AboutProjectView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 rounded-2xl flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-gray-950 border border-blue-900/40">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="badge-academic">Academic Course Documentation</span>
            <span className="text-xs text-gray-400 font-mono">Team 10 Specification</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            1. Project Title: Library Management System – OS Resource Management Simulator
          </h1>
          <p className="text-xs md:text-sm text-gray-300 max-w-3xl leading-relaxed">
            An academic software system demonstrating the integration of high-level Library domain operations with low-level Operating System kernel resource management mechanisms.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-2 rounded-xl">
          <ShieldCheck className="h-4 w-4" />
          <span>Team 10 Official Documentation</span>
        </div>
      </div>

      {/* 2-6: Core Academic Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 font-mono text-xs">
        <div className="glass-card p-5 rounded-2xl space-y-2 border-l-4 border-l-blue-500">
          <span className="text-gray-400 text-[10px] block">5. Assigned Team</span>
          <div className="text-2xl font-bold text-white font-sans">Team 10</div>
          <p className="text-gray-400 text-[11px] font-sans">Official Course Assignment</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2 border-l-4 border-l-purple-500">
          <span className="text-gray-400 text-[10px] block">4. Application Domain</span>
          <div className="text-xl font-bold text-purple-300 font-sans">Library Management</div>
          <p className="text-gray-400 text-[11px] font-sans">Books, Members, Transactions</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2 border-l-4 border-l-emerald-500">
          <span className="text-gray-400 text-[10px] block">7. CPU Scheduling</span>
          <div className="text-xl font-bold text-emerald-400 font-sans">Round Robin</div>
          <p className="text-gray-400 text-[11px] font-sans">Time Quantum = 4 units</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2 border-l-4 border-l-amber-500">
          <span className="text-gray-400 text-[10px] block">9. Disk Scheduling</span>
          <div className="text-xl font-bold text-amber-400 font-sans">FCFS Baseline</div>
          <p className="text-gray-400 text-[11px] font-sans">Range 0–130, Initial Head 65</p>
        </div>
      </div>

      {/* 2 & 3: Problem Statement & Objective */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
        <div className="glass-card p-6 rounded-2xl space-y-3 border border-gray-800">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-mono">
            <FileText className="h-4 w-4 text-blue-400" />
            <span>2. Problem Statement</span>
          </h3>
          <p className="text-gray-300 leading-relaxed">
            In standard computer science education, application software (such as database CRUD web apps) and operating systems concepts (CPU scheduling, memory paging, disk head movements) are frequently taught as disjoint topics. Students lack a tangible tool demonstrating how high-level software transactions (e.g. issuing a library book) directly translate into low-level OS kernel hardware resource requests.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3 border border-gray-800">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-mono">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>3. Project Objective</span>
          </h3>
          <p className="text-gray-300 leading-relaxed">
            To build a unified, interactive web-based simulator that combines a fully functional Library Management System with three fundamental Operating System resource management modules (Process Scheduling, Memory Management, and Disk Scheduling). The simulator enforces exact Team 10 parameter constraints, generates dynamic mathematical derivations, and provides transparent evaluation tools.
          </p>
        </div>
      </div>

      {/* 6. Team 10 Parameters Specification Matrix */}
      <div className="glass-card p-6 rounded-2xl space-y-4 border border-blue-900/40">
        <h3 className="text-sm font-bold text-gray-200 flex items-center space-x-2 font-mono">
          <ShieldCheck className="h-4 w-4 text-blue-400" />
          <span>6. Authoritative Team 10 Master Parameters Set</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
            <span className="text-blue-400 font-bold block">Process Management:</span>
            <div className="text-gray-300 space-y-1 text-[11px]">
              <div>P1: Arrival 0, Burst 6</div>
              <div>P2: Arrival 2, Burst 2</div>
              <div>P3: Arrival 3, Burst 5</div>
              <div>P4: Arrival 5, Burst 9</div>
              <div>P5: Arrival 7, Burst 3</div>
              <div className="text-emerald-400 font-bold pt-1">Round Robin (Time Quantum = 4)</div>
            </div>
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
            <span className="text-emerald-400 font-bold block">Memory Management:</span>
            <div className="text-gray-300 space-y-1 text-[11px]">
              <div>System RAM: 4 GB (4,294,967,296 Bytes)</div>
              <div>Page Size: 4 KB (4,096 Bytes)</div>
              <div>Logical Space: 32 MB (33,554,432 Bytes)</div>
              <div className="text-emerald-400 font-bold pt-1">Physical Frames = 4 Frames (16 KB)</div>
            </div>
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
            <span className="text-amber-400 font-bold block">Disk Scheduling:</span>
            <div className="text-gray-300 space-y-1 text-[11px]">
              <div>Cylinder Range: 0 to 130</div>
              <div>Initial Head Position: Cylinder #65</div>
              <div className="text-amber-300 font-bold pt-1">
                Queue: [25, 105, 40, 115, 55, 90, 10, 120]
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7, 8, 9: Detailed Methodologies */}
      <div className="glass-card p-6 rounded-2xl space-y-6">
        <h3 className="text-sm font-bold text-gray-200 font-mono">
          Detailed Module Methodologies (OS Academic Perspective)
        </h3>

        <div className="space-y-4 font-sans text-xs text-gray-300 leading-relaxed">
          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-1.5">
            <h4 className="font-bold text-blue-400 font-mono text-sm flex items-center space-x-2">
              <Cpu className="h-4 w-4" />
              <span>7. Process Management Methodology</span>
            </h4>
            <p>
              Implements preemptive <strong>Round Robin (RR) CPU scheduling</strong> with a fixed Time Quantum Q = 4. Arriving processes enter the tail of the Ready Queue. When executing, a process runs for at most Q units before its quantum expires, triggering a context switch that moves the process back to the queue tail while the next process at the queue head takes the CPU. Metrics calculated include Completion Time (CT), Turnaround Time (TAT = CT - AT), Waiting Time (WT = TAT - BT), and Response Time (RT = FirstCPU - AT).
            </p>
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-1.5">
            <h4 className="font-bold text-emerald-400 font-mono text-sm flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>8. Memory Management Methodology</span>
            </h4>
            <p>
              Implements <strong>Non-Contiguous Paging Architecture</strong>. The 32 MB process logical address space is divided into 8,192 virtual pages of 4 KB (4,096 Bytes) each (12 bits Offset d, 13 bits Page Number p). The kernel maps virtual page numbers p to physical RAM frame numbers F via a Page Table. Physical addresses are derived as Physical = (F &times; 4096) + d. Internal fragmentation is calculated dynamically as (ceil(Payload / 4096) &times; 4096) - Payload.
            </p>
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-1.5">
            <h4 className="font-bold text-amber-400 font-mono text-sm flex items-center space-x-2">
              <HardDrive className="h-4 w-4" />
              <span>9. Disk Scheduling Methodology</span>
            </h4>
            <p>
              Implements <strong>First-Come First-Served (FCFS) Disk Scheduling</strong> as the official baseline for secondary storage I/O requests across cylinders 0–130 starting from head position 65. The driver processes cylinder requests in exact order of arrival. Individual seek distances are computed as the absolute difference between consecutive track locations (Seek = |Target - Current|). Total seek distance is the sum of all individual seeks, and average seek distance is Total Seek / N.
            </p>
          </div>
        </div>
      </div>

      {/* 10-12: Algorithms, Tech Stack, & Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <div className="glass-card p-5 rounded-2xl space-y-3 border border-gray-800">
          <h4 className="font-bold text-purple-400 text-sm flex items-center space-x-2">
            <Code2 className="h-4 w-4" />
            <span>10. Algorithms Implemented</span>
          </h4>
          <ul className="space-y-1 text-gray-300 text-[11px] list-disc list-inside">
            <li><strong>Round Robin (RR Q=4)</strong> *(Official)*</li>
            <li>First-Come First-Served (FCFS) CPU &amp; Disk</li>
            <li>Shortest Job First (SJF)</li>
            <li>SSTF, SCAN, C-SCAN, LOOK, C-LOOK</li>
            <li>FIFO, LRU, Optimal Page Replacement</li>
          </ul>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-3 border border-gray-800">
          <h4 className="font-bold text-blue-400 text-sm flex items-center space-x-2">
            <Layers className="h-4 w-4" />
            <span>11. Technologies Used</span>
          </h4>
          <ul className="space-y-1 text-gray-300 text-[11px] list-disc list-inside">
            <li>React 18 &amp; TypeScript</li>
            <li>Vite build engine</li>
            <li>TailwindCSS styling system</li>
            <li>HTML5 Canvas Vector Trajectory</li>
            <li>LocalStorage Persistence API</li>
          </ul>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-3 border border-gray-800">
          <h4 className="font-bold text-emerald-400 text-sm flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>12. System Architecture</span>
          </h4>
          <p className="text-gray-300 text-[11px] leading-relaxed font-sans">
            LMS Domain UI Layer &rarr; Simulation Event Logger &rarr; OS Engine Calculation Suite (Process, Memory, Disk) &rarr; Visual Canvas Plotters &amp; Verification Audit Tools.
          </p>
        </div>
      </div>

      {/* 13, 14, 15: Expected Outcomes, Calculated Results, & Conclusion */}
      <div className="glass-card p-6 rounded-2xl space-y-5 border border-emerald-900/40 bg-gradient-to-r from-emerald-950/20 via-gray-950 to-gray-950">
        <h3 className="text-sm font-bold text-gray-200 font-mono flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>13, 14 &amp; 15. Expected Outcomes, Calculated Results &amp; Conclusion</span>
        </h3>

        <div className="space-y-4 text-xs font-sans leading-relaxed text-gray-200">
          <div className="p-4 bg-gray-950/80 rounded-xl border border-gray-800 space-y-1">
            <h4 className="font-bold text-emerald-400 font-mono">13. Expected Outcomes</h4>
            <p className="text-gray-300">
              The project aimed to produce a zero-defect, deterministic simulator capable of calculating exact process completion times, virtual page mappings, and disk head seek trajectories without hard-coding any values.
            </p>
          </div>

          <div className="p-4 bg-gray-950/80 rounded-xl border border-gray-800 space-y-1">
            <h4 className="font-bold text-blue-400 font-mono">14. Final Calculated Results Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px] pt-1">
              <div className="p-2.5 bg-gray-900 rounded-lg">
                <span className="text-blue-400 font-bold block">Process Management:</span>
                Avg WT = 8.0u | Avg TAT = 13.0u | Avg RT = 4.2u | Utilization = 100%
              </div>
              <div className="p-2.5 bg-gray-900 rounded-lg">
                <span className="text-emerald-400 font-bold block">Memory Management:</span>
                8,192 Pages | 4 Physical Frames (16 KB) | Internal Frag = 0 Bytes
              </div>
              <div className="p-2.5 bg-gray-900 rounded-lg">
                <span className="text-amber-400 font-bold block">Disk Scheduling:</span>
                Total Seek = 545 tracks | Avg Seek = 68.13 tracks/request
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-800/60 space-y-1">
            <h4 className="font-bold text-purple-300 font-mono">15. Conclusion</h4>
            <p className="text-gray-300">
              The <strong>Library Management System – OS Resource Management Simulator</strong> successfully proves that user-level software transactions map cleanly onto low-level operating system kernel tasks. By enforcing official Team 10 parameter constraints and rendering step-by-step mathematical proofs, this application provides an effective academic demonstration of CPU scheduling, memory paging, and disk cylinder head trajectory servicing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
