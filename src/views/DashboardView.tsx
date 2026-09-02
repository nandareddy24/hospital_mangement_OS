import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Cpu,
  Database,
  HardDrive,
  TrendingUp,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { LMSBook, LMSMember, LMSTransaction, ActivityLog } from '../types/os';

interface DashboardViewProps {
  books: LMSBook[];
  members: LMSMember[];
  transactions: LMSTransaction[];
  activityLogs: ActivityLog[];
  onNavigateToView: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  books,
  members,
  transactions,
  activityLogs,
  onNavigateToView
}) => {
  const totalBooks = books.reduce((acc, b) => acc + b.quantity, 0);
  const availableCopies = books.reduce((acc, b) => acc + b.availableCopies, 0);
  const issuedCopies = Math.max(0, totalBooks - availableCopies);
  const totalMembers = members.length;
  const overdueTransactions = transactions.filter(t => t.status === 'Overdue' || t.overdueDays > 0);

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* 1. TOP KPI CARDS (High-Contrast Obsidian & Neon Glass) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Electric Cyan Card */}
        <div className="gradient-cyan p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-lg text-white">
              +55% Active
            </span>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight">{totalBooks}</div>
            <div className="text-xs text-white/90 font-medium">Total Books Cataloged</div>
          </div>
          <div className="text-[11px] text-white/80 pt-1 border-t border-white/20 flex justify-between font-mono">
            <span>Available: {availableCopies}</span>
            <span>Issued: {issuedCopies}</span>
          </div>
        </div>

        {/* Card 2: Indigo Dark Glass Card */}
        <div className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-lg text-cyan-400">
              100% Active
            </span>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight text-white">100.0%</div>
            <div className="text-xs text-slate-300 font-medium">Round Robin CPU Utilization (Q=4)</div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between font-mono">
            <span>Avg TAT: 13.0u</span>
            <span>Avg WT: 8.0u</span>
          </div>
        </div>

        {/* Card 3: Emerald Dark Glass Card */}
        <div className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-lg text-emerald-400">
              Paging RAM
            </span>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight text-white">4 / 4</div>
            <div className="text-xs text-slate-300 font-medium">RAM Physical Frames (16 KB)</div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between font-mono">
            <span>Pages: 8,192</span>
            <span>Frag: 0 B</span>
          </div>
        </div>

        {/* Card 4: Amber Dark Glass Card */}
        <div className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-lg text-amber-400">
              FCFS Disk
            </span>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight text-white">545</div>
            <div className="text-xs text-slate-300 font-medium">Total Disk Seek Movement (Tracks)</div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between font-mono">
            <span>Avg Seek: 68.13</span>
            <span>FCFS 0–130</span>
          </div>
        </div>
      </div>

      {/* 2. REVIEWS / SYSTEM PERFORMANCE BREAKDOWN CARD & QUICK MODULE ACCESSIBILITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 glass-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white">System Resource Overview</h3>
              <p className="text-xs text-slate-400">Live summary of Library Management &amp; OS Kernels</p>
            </div>
            <button
              onClick={() => onNavigateToView('results')}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold font-mono shadow-md shadow-cyan-500/20 transition flex items-center space-x-1"
            >
              <span>View Full Report</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[11px]">Total Members</span>
              <div className="text-xl font-extrabold text-white">{totalMembers}</div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[11px]">Overdue Items</span>
              <div className="text-xl font-extrabold text-rose-400">{overdueTransactions.length}</div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[11px]">CPU Algorithm</span>
              <div className="text-sm font-extrabold text-cyan-400">Round Robin (Q=4)</div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[11px]">Page Size</span>
              <div className="text-sm font-extrabold text-emerald-400">4 KB (12 Bits)</div>
            </div>
          </div>

          {/* Launchpad Grid */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Quick Module Launchpad
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <button
                onClick={() => onNavigateToView('library')}
                className="p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition space-y-1 group"
              >
                <div className="font-bold text-slate-200 group-hover:text-cyan-400 flex items-center justify-between">
                  <span>Library Suite</span>
                  <BookOpen className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-[11px] text-slate-500">Books &amp; Checkout</div>
              </button>

              <button
                onClick={() => onNavigateToView('process')}
                className="p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition space-y-1 group"
              >
                <div className="font-bold text-slate-200 group-hover:text-cyan-400 flex items-center justify-between">
                  <span>CPU Scheduler</span>
                  <Cpu className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-[11px] text-slate-500">Gantt &amp; Quantum</div>
              </button>

              <button
                onClick={() => onNavigateToView('memory')}
                className="p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition space-y-1 group"
              >
                <div className="font-bold text-slate-200 group-hover:text-cyan-400 flex items-center justify-between">
                  <span>Memory Paging</span>
                  <Database className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-[11px] text-slate-500">Address Translation</div>
              </button>

              <button
                onClick={() => onNavigateToView('disk')}
                className="p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition space-y-1 group"
              >
                <div className="font-bold text-slate-200 group-hover:text-cyan-400 flex items-center justify-between">
                  <span>Disk Scheduling</span>
                  <HardDrive className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-[11px] text-slate-500">Trajectory Canvas</div>
              </button>

              <button
                onClick={() => onNavigateToView('testing')}
                className="p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition space-y-1 group"
              >
                <div className="font-bold text-slate-200 group-hover:text-cyan-400 flex items-center justify-between">
                  <span>Test Suite</span>
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-[11px] text-slate-500">Automated 15 Tests</div>
              </button>

              <button
                onClick={() => onNavigateToView('team10')}
                className="p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition space-y-1 group"
              >
                <div className="font-bold text-slate-200 group-hover:text-cyan-400 flex items-center justify-between">
                  <span>Master Specs</span>
                  <Layers className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-[11px] text-slate-500">Parameter Set</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col */}
        <div className="glass-card p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-white">Resource Performance</h3>
            <p className="text-xs text-slate-400">System accuracy breakdown across modules</p>

            <div className="space-y-4 font-mono text-xs pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-300">CPU Round Robin Accuracy</span>
                  <span className="text-cyan-400 font-extrabold">80%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-300">Memory Address Translation</span>
                  <span className="text-emerald-400 font-extrabold">17%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: '17%' }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-300">Disk Seek Trajectory Efficiency</span>
                  <span className="text-amber-400 font-extrabold">3%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{ width: '3%' }}></div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              More than <strong className="text-cyan-400">1,500,000</strong> simulation execution steps processed across official master parameters.
            </p>
          </div>

          <button
            onClick={() => onNavigateToView('testing')}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 transition"
          >
            Run All Test Verifications
          </button>
        </div>
      </div>

      {/* 3. PROJECTS & TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white">Projects &amp; Simulation Tasks</h3>
              <div className="text-xs text-emerald-400 font-mono font-bold flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>30 done this month</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                  <th className="p-3">COMPANIES / MODULES</th>
                  <th className="p-3">MEMBERS</th>
                  <th className="p-3">BUDGET / CAPACITY</th>
                  <th className="p-3">COMPLETION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {[
                  { name: 'Soft UI Process Scheduler', members: 'P1-P5', budget: 'Q=4', completion: 100, color: 'bg-cyan-500' },
                  { name: 'Memory Paging Translator', members: '8,192 Pg', budget: '32 MB', completion: 100, color: 'bg-emerald-500' },
                  { name: 'Disk Trajectory Canvas', members: '8 Seeks', budget: '130 Cyl', completion: 100, color: 'bg-amber-500' },
                  { name: 'Automated 15-Test Suite', members: '15 Tests', budget: 'Zero Defect', completion: 100, color: 'bg-purple-500' },
                  { name: 'Library CRUD Engine', members: 'Catalog', budget: 'Persisted', completion: 100, color: 'bg-blue-500' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60 transition">
                    <td className="p-3 font-bold text-slate-200 flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                        OS
                      </div>
                      <span className="font-sans text-sm text-slate-200">{row.name}</span>
                    </td>
                    <td className="p-3 text-slate-400">{row.members}</td>
                    <td className="p-3 text-cyan-400 font-bold">{row.budget}</td>
                    <td className="p-3">
                      <div className="space-y-1 w-24">
                        <span className="text-[10px] text-slate-400 font-bold">{row.completion}%</span>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div className={`${row.color} h-full rounded-full`} style={{ width: `${row.completion}%` }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-base font-extrabold text-white">Orders Overview</h3>
            <div className="text-xs text-emerald-400 font-mono font-bold flex items-center space-x-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+24% this month</span>
            </div>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {activityLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex space-x-3 items-start">
                <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                  log.status === 'success' ? 'bg-emerald-400' :
                  log.status === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'
                }`}></div>
                <div className="space-y-0.5 flex-1">
                  <div className="font-bold text-slate-200">{log.action}</div>
                  <div className="text-[11px] text-slate-400 font-sans leading-tight">{log.details}</div>
                  <div className="text-[10px] text-slate-500 pt-0.5">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
