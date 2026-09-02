import React from 'react';
import {
  Cpu,
  Database,
  HardDrive,
  BookOpen,
  ArrowRight,
  Zap,
  CheckCircle2,
  Activity,
  Users,
  Clock,
  BookMarked
} from 'lucide-react';
import { TEAM_10_DEFAULTS } from '../utils/constants';
import type { ActivityLog, LMSBook, LMSMember, LMSTransaction } from '../types/os';

interface DashboardViewProps {
  onNavigateToView?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  activityLogs?: ActivityLog[];
  logs?: ActivityLog[];
  books?: LMSBook[];
  members?: LMSMember[];
  transactions?: LMSTransaction[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToView,
  setActiveTab,
  activityLogs = [],
  logs = [],
  books = [],
  members = [],
  transactions = []
}) => {
  const navigate = (tab: string) => {
    if (onNavigateToView) onNavigateToView(tab);
    else if (setActiveTab) setActiveTab(tab);
  };

  const activeLogs = activityLogs.length > 0 ? activityLogs : logs;

  const totalBooks = books.length;
  const availableCopies = books.reduce((sum, b) => sum + b.availableCopies, 0);
  const issuedCopies = books.reduce((sum, b) => sum + (b.quantity - b.availableCopies), 0);
  const totalMembers = members.length;
  const overdueTransactions = transactions.filter(t => t.status === 'Overdue' || (t.status === 'Issued' && new Date(t.dueDate) < new Date()));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden glass-card p-6 md:p-8 rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-gray-950 border border-blue-900/40">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-3">
            <span className="badge-academic">Academic Project &bull; Team 10</span>
            <span className="text-xs text-gray-400 font-mono">v1.0.0 Verified</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Library Management System – OS Resource Management Simulator
          </h1>
          <p className="text-gray-300 text-sm max-w-3xl leading-relaxed">
            Integrating functional Library operations with low-level Operating System kernel abstractions: Process CPU Scheduling (Round Robin Q=4), Memory Paging (Virtual-to-Physical translation), and Disk Cylinder Head Trajectory (FCFS 0–130).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('library')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-blue-500/25 transition-all"
            >
              <BookOpen className="h-4 w-4" />
              <span>Launch LMS Operations</span>
            </button>
            <button
              onClick={() => navigate('results')}
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-semibold flex items-center space-x-2 border border-gray-700 transition-all"
            >
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>View Results &amp; Analysis Report</span>
            </button>
          </div>
        </div>

        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Library Domain Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 font-mono text-xs">
        <div className="glass-card p-4 rounded-xl space-y-1 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between text-gray-400">
            <span>Total Titles</span>
            <BookOpen className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalBooks}</div>
          <span className="text-[10px] text-gray-500">Book catalog titles</span>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-gray-400">
            <span>Available Copies</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{availableCopies}</div>
          <span className="text-[10px] text-gray-500">Ready for checkout</span>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between text-gray-400">
            <span>Issued Copies</span>
            <BookMarked className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400">{issuedCopies}</div>
          <span className="text-[10px] text-gray-500">Currently checked out</span>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between text-gray-400">
            <span>Total Members</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-400">{totalMembers}</div>
          <span className="text-[10px] text-gray-500">Students &amp; Faculty</span>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between text-gray-400">
            <span>Overdue Fines</span>
            <Clock className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{overdueTransactions.length}</div>
          <span className="text-[10px] text-gray-500">Past due date</span>
        </div>
      </div>

      {/* OS Simulation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          onClick={() => navigate('process')}
          className="glass-card p-5 rounded-2xl cursor-pointer hover:border-blue-500/50 transition-all group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
              <Cpu className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono text-blue-400 font-bold">RR (Q=4)</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-white font-mono">25</span>
            <span className="text-xs text-gray-400 ml-1">time units</span>
            <h4 className="text-xs font-semibold text-gray-300 mt-1">CPU Process Scheduling</h4>
          </div>
          <div className="text-[11px] text-gray-400 border-t border-gray-800 pt-2 flex justify-between font-mono">
            <span>5 Processes (P1-P5)</span>
            <span className="text-blue-400 flex items-center">Open Engine <ArrowRight className="h-3 w-3 ml-0.5" /></span>
          </div>
        </div>

        <div 
          onClick={() => navigate('memory')}
          className="glass-card p-5 rounded-2xl cursor-pointer hover:border-emerald-500/50 transition-all group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">4 Frames</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-white font-mono">4 GB</span>
            <span className="text-xs text-gray-400 ml-1">RAM</span>
            <h4 className="text-xs font-semibold text-gray-300 mt-1">Memory Paging System</h4>
          </div>
          <div className="text-[11px] text-gray-400 border-t border-gray-800 pt-2 flex justify-between font-mono">
            <span>4 KB Page Size</span>
            <span className="text-emerald-400 flex items-center">Open Engine <ArrowRight className="h-3 w-3 ml-0.5" /></span>
          </div>
        </div>

        <div 
          onClick={() => navigate('disk')}
          className="glass-card p-5 rounded-2xl cursor-pointer hover:border-amber-500/50 transition-all group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <HardDrive className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">FCFS Baseline</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-white font-mono">545</span>
            <span className="text-xs text-gray-400 ml-1">seeks</span>
            <h4 className="text-xs font-semibold text-gray-300 mt-1">Disk Head Trajectory</h4>
          </div>
          <div className="text-[11px] text-gray-400 border-t border-gray-800 pt-2 flex justify-between font-mono">
            <span>Initial Head: 65</span>
            <span className="text-amber-400 flex items-center">Open Engine <ArrowRight className="h-3 w-3 ml-0.5" /></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-200 flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Team 10 Master Configuration</span>
            </h3>
            <span className="text-[10px] bg-blue-900/40 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded font-mono">
              EXACT PRESET
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800 space-y-1.5">
              <span className="text-blue-400 font-semibold block">Process Scheduling (Round Robin):</span>
              <div className="text-gray-300 space-y-1 text-[11px]">
                <div>P1: AT 0, BT 6 | P2: AT 2, BT 2</div>
                <div>P3: AT 3, BT 5 | P4: AT 5, BT 9</div>
                <div>P5: AT 7, BT 3</div>
                <div className="text-emerald-400 pt-1 font-bold">Time Quantum = 4</div>
              </div>
            </div>

            <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800 space-y-1.5">
              <span className="text-emerald-400 font-semibold block">Memory Management (Paging):</span>
              <div className="text-gray-300 space-y-1 text-[11px]">
                <div>RAM: {TEAM_10_DEFAULTS.ramGB} GB | Page Size: {TEAM_10_DEFAULTS.pageSizeKB} KB</div>
                <div>Process Logical Space: {TEAM_10_DEFAULTS.logicalSpaceMB} MB</div>
                <div className="text-emerald-400 pt-1 font-bold">Physical Frames = 4</div>
              </div>
            </div>

            <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800 space-y-1.5">
              <span className="text-amber-400 font-semibold block">Disk Scheduling:</span>
              <div className="text-gray-300 space-y-1 text-[11px]">
                <div>Cylinder Range: {TEAM_10_DEFAULTS.cylinderMin}–{TEAM_10_DEFAULTS.cylinderMax}</div>
                <div>Initial Head Position: {TEAM_10_DEFAULTS.initialHead}</div>
                <div className="text-amber-300 pt-1 truncate">
                  Queue: [{TEAM_10_DEFAULTS.diskQueue.join(', ')}]
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('team10')}
            className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-xl transition font-mono"
          >
            Inspect Full Team Config &rarr;
          </button>
        </div>

        <div className="lg:col-span-2 glass-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-200 flex items-center space-x-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Real-Time OS Simulation Event Stream</span>
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {activeLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-gray-950/70 border border-gray-800/80 flex items-start space-x-3 text-xs"
              >
                <div className={`mt-0.5 px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                  log.module === 'LMS' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                  log.module === 'PROCESS' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                  log.module === 'MEMORY' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {log.module}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-200">{log.action}</span>
                    <span className="text-[10px] font-mono text-gray-500">{log.timestamp}</span>
                  </div>
                  <p className="text-gray-400 text-[11px] font-mono">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
