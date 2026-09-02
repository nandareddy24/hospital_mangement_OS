import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Cpu,
  Database,
  HardDrive,
  BarChart3,
  Sliders,
  CheckSquare,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigateToView: (view: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigateToView,
  isOpen,
  onCloseMobile
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      tooltip: 'Overview of LMS operations and OS kernel metrics'
    },
    {
      id: 'library',
      label: 'Library Management',
      icon: BookOpen,
      tooltip: 'Books, Members, and Checkout Transactions'
    },
    {
      id: 'process',
      label: 'Process Management',
      icon: Cpu,
      tooltip: 'CPU scheduler using official parameters (Round Robin Q=4)'
    },
    {
      id: 'memory',
      label: 'Memory Management',
      icon: Database,
      tooltip: 'Paging architecture (32MB Logical, 4KB Pages, 4 Frames)'
    },
    {
      id: 'disk',
      label: 'Disk Scheduling',
      icon: HardDrive,
      tooltip: 'Disk trajectory scheduler (FCFS, 0-130 Cylinders, Head 65)'
    },
    {
      id: 'results',
      label: 'Results & Evaluation',
      icon: BarChart3,
      tooltip: 'Consolidated report & automated academic analysis'
    },
    {
      id: 'team10',
      label: 'System Parameters',
      icon: Sliders,
      tooltip: 'Enforced master parameters and full simulation batch execution'
    },
    {
      id: 'testing',
      label: 'Testing & Validation',
      icon: CheckSquare,
      tooltip: 'Automated 15-point verification test suite'
    },
    {
      id: 'about',
      label: 'Project Documentation',
      icon: HelpCircle,
      tooltip: '15 Academic sections explaining OS & LMS integration'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50 h-screen w-72 bg-slate-950/95 border-r border-slate-800/80
          flex flex-col justify-between p-4 transition-transform duration-300 font-sans text-xs
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="space-y-6">
          {/* Brand Logo Header */}
          <div className="flex items-center space-x-3 px-3 py-2 border-b border-slate-800/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white font-sans flex items-center space-x-1">
                <span>OS &amp; LMS Kernel</span>
              </div>
              <div className="text-[10px] font-mono text-cyan-400 font-bold flex items-center space-x-1">
                <ShieldCheck className="h-3 w-3" />
                <span>Academic Simulator</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5 font-mono">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 pb-1">
              Main Modules
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigateToView(item.id);
                    onCloseMobile();
                  }}
                  data-tooltip={item.tooltip}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all text-xs text-left
                    ${isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 text-white" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Documentation Card */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-slate-200 font-bold text-xs">Need Documentation?</div>
              <div className="text-[10px] text-slate-400">Check official OS documentation</div>
            </div>
          </div>

          <button
            onClick={() => {
              onNavigateToView('about');
              onCloseMobile();
            }}
            className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-cyan-500/20 transition flex items-center justify-center space-x-1"
          >
            <span>Documentation</span>
          </button>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Status: Active Engine</span>
            <span className="text-cyan-400 font-bold">v2.0 Dark</span>
          </div>
        </div>
      </aside>
    </>
  );
};
