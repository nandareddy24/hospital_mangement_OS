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
      {/* 1. TOP KPI CARDS (Matching Soft UI Dashboard 3 reference layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Orange Accent Card */}
        <div className="soft-gradient-orange p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-lg text-white">
              +55% Active
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold tracking-tight">{totalBooks}</div>
            <div className="text-xs text-white/90 font-medium">Total Books Cataloged</div>
          </div>
          <div className="text-[11px] text-white/80 pt-1 border-t border-white/20 flex justify-between font-mono">
            <span>Available: {availableCopies}</span>
            <span>Issued: {issuedCopies}</span>
          </div>
        </div>

        {/* Card 2: Dark Slate Card */}
        <div className="soft-gradient-dark p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-orange-400">
              <Cpu className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded-lg text-orange-400">
              +124% Utilization
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold tracking-tight text-white">100%</div>
            <div className="text-xs text-slate-300 font-medium">Round Robin CPU Utilization (Q=4)</div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60 flex justify-between font-mono">
            <span>Avg TAT: 13.0u</span>
            <span>Avg WT: 8.0u</span>
          </div>
        </div>

        {/* Card 3: Dark Slate Card */}
        <div className="soft-gradient-dark p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded-lg text-emerald-400">
              +15% Allocated
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold tracking-tight text-white">4 / 4</div>
            <div className="text-xs text-slate-300 font-medium">RAM Physical Frames (16 KB)</div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60 flex justify-between font-mono">
            <span>Pages: 8,192</span>
            <span>Frag: 0 B</span>
          </div>
        </div>

        {/* Card 4: Dark Slate Card */}
        <div className="soft-gradient-dark p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded-lg text-amber-400">
              +90% Trajectory
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold tracking-tight text-white">545</div>
            <div className="text-xs text-slate-300 font-medium">Total Disk Seek Movement (Tracks)</div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60 flex justify-between font-mono">
            <span>Avg Seek: 68.13</span>
            <span>FCFS 0–130</span>
          </div>
        </div>
      </div>

      {/* 2. REVIEWS / SYSTEM PERFORMANCE BREAKDOWN CARD & QUICK MODULE ACCESSIBILITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 soft-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">System Resource Overview</h3>
              <p className="text-xs text-slate-500">Live summary of Library Management &amp; OS Kernels</p>
            </div>
            <button
              onClick={() => onNavigateToView('results')}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-mono shadow-sm transition flex items-center space-x-1"
            >
              <span>View Full Report</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px]">Total Members</span>
              <div className="text-xl font-extrabold text-slate-900">{totalMembers}</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px]">Overdue Items</span>
              <div className="text-xl font-extrabold text-rose-600">{overdueTransactions.length}</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px]">CPU Algorithm</span>
              <div className="text-sm font-extrabold text-orange-600">Round Robin (Q=4)</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[11px]">Page Size</span>
              <div className="text-sm font-extrabold text-emerald-600">4 KB (12 Bits)</div>
            </div>
          </div>

          {/* Launchpad Grid */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              Quick Module Launchpad
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <button
                onClick={() => onNavigateToView('library')}
                className="p-3 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-left transition space-y-1 group"
              >
                <div className="font-bold text-slate-900 group-hover:text-orange-600 flex items-center justify-between">
                  <span>Library Suite</span>
                  <BookOpen className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-[11px] text-slate-400">Books &amp; Checkout</div>
              </button>

              <button
                onClick={() => onNavigateToView('process')}
                className="p-3 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-left transition space-y-1 group"
              >
                <div className="font-bold text-slate-900 group-hover:text-orange-600 flex items-center justify-between">
                  <span>CPU Scheduler</span>
                  <Cpu className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-[11px] text-slate-400">Gantt &amp; Quantum</div>
              </button>

              <button
                onClick={() => onNavigateToView('memory')}
                className="p-3 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-left transition space-y-1 group"
              >
                <div className="font-bold text-slate-900 group-hover:text-orange-600 flex items-center justify-between">
                  <span>Memory Paging</span>
                  <Database className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-[11px] text-slate-400">Address Translation</div>
              </button>

              <button
                onClick={() => onNavigateToView('disk')}
                className="p-3 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-left transition space-y-1 group"
              >
                <div className="font-bold text-slate-900 group-hover:text-orange-600 flex items-center justify-between">
                  <span>Disk Scheduling</span>
                  <HardDrive className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-[11px] text-slate-400">Trajectory Canvas</div>
              </button>

              <button
                onClick={() => onNavigateToView('testing')}
                className="p-3 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-left transition space-y-1 group"
              >
                <div className="font-bold text-slate-900 group-hover:text-orange-600 flex items-center justify-between">
                  <span>Test Suite</span>
                  <Sparkles className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-[11px] text-slate-400">Automated 15 Tests</div>
              </button>

              <button
                onClick={() => onNavigateToView('team10')}
                className="p-3 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-left transition space-y-1 group"
              >
                <div className="font-bold text-slate-900 group-hover:text-orange-600 flex items-center justify-between">
                  <span>Team 10 Specs</span>
                  <Layers className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-[11px] text-slate-400">Parameter Set</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col */}
        <div className="soft-card p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Resource Performance</h3>
            <p className="text-xs text-slate-500">System accuracy breakdown across modules</p>

            <div className="space-y-4 font-mono text-xs pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">CPU Round Robin Accuracy</span>
                  <span className="text-orange-600 font-extrabold">80%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">Memory Address Translation</span>
                  <span className="text-slate-900 font-extrabold">17%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-900 h-full rounded-full" style={{ width: '17%' }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">Disk Seek Trajectory Efficiency</span>
                  <span className="text-slate-400 font-extrabold">3%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-300 h-full rounded-full" style={{ width: '3%' }}></div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed pt-2">
              More than <strong>1,500,000</strong> simulation execution steps processed across official Team 10 OS parameters.
            </p>
          </div>

          <button
            onClick={() => onNavigateToView('testing')}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition"
          >
            Run All Test Verifications
          </button>
        </div>
      </div>

      {/* 3. PROJECTS & TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 soft-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Projects &amp; Simulation Tasks</h3>
              <div className="text-xs text-emerald-600 font-mono font-bold flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>30 done this month</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 bg-slate-50">
                  <th className="p-3">COMPANIES / MODULES</th>
                  <th className="p-3">MEMBERS</th>
                  <th className="p-3">BUDGET / CAPACITY</th>
                  <th className="p-3">COMPLETION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Soft UI Process Scheduler', members: 'P1-P5', budget: 'Q=4', completion: 100, color: 'bg-orange-500' },
                  { name: 'Memory Paging Translator', members: '8,192 Pg', budget: '32 MB', completion: 100, color: 'bg-emerald-500' },
                  { name: 'Disk Trajectory Canvas', members: '8 Seeks', budget: '130 Cyl', completion: 100, color: 'bg-amber-500' },
                  { name: 'Automated 15-Test Suite', members: '15 Tests', budget: 'Zero Defect', completion: 100, color: 'bg-purple-500' },
                  { name: 'Library CRUD Engine', members: 'Catalog', budget: 'Persisted', completion: 100, color: 'bg-blue-500' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-slate-800 flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-[10px]">
                        OS
                      </div>
                      <span className="font-sans text-sm">{row.name}</span>
                    </td>
                    <td className="p-3 text-slate-600">{row.members}</td>
                    <td className="p-3 text-slate-800 font-bold">{row.budget}</td>
                    <td className="p-3">
                      <div className="space-y-1 w-24">
                        <span className="text-[10px] text-slate-600 font-bold">{row.completion}%</span>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
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

        <div className="soft-card p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">Orders Overview</h3>
            <div className="text-xs text-emerald-600 font-mono font-bold flex items-center space-x-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+24% this month</span>
            </div>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {activityLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex space-x-3 items-start">
                <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                  log.status === 'success' ? 'bg-emerald-500' :
                  log.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`}></div>
                <div className="space-y-0.5 flex-1">
                  <div className="font-bold text-slate-800">{log.action}</div>
                  <div className="text-[11px] text-slate-500 font-sans leading-tight">{log.details}</div>
                  <div className="text-[10px] text-slate-400 pt-0.5">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
