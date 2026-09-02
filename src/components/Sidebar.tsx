import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Cpu,
  Database,
  HardDrive,
  BarChart3,
  Sliders,
  Info,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpenMobile?: boolean;
  setIsOpenMobile?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpenMobile, setIsOpenMobile }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      subtitle: 'Library & OS System Metrics',
      icon: LayoutDashboard,
      tooltip: 'Real-time overview of Library KPIs and active OS simulation streams'
    },
    {
      id: 'library',
      label: 'Library Management System',
      subtitle: 'Books, Members, Issue/Return',
      icon: BookOpen,
      tooltip: 'Functional library suite with CRUD, checkout transactions, and persistent storage'
    },
    {
      id: 'process',
      label: 'Process Management',
      subtitle: 'Round Robin CPU Scheduling',
      icon: Cpu,
      tooltip: 'CPU scheduler using Team 10 parameters (Round Robin Q=4)'
    },
    {
      id: 'memory',
      label: 'Memory Management',
      subtitle: 'Paging & Address Translation',
      icon: Database,
      tooltip: 'Virtual memory address translation and 4 RAM physical frames'
    },
    {
      id: 'disk',
      label: 'Disk Scheduling',
      subtitle: 'Cylinder Head Trajectory',
      icon: HardDrive,
      tooltip: 'Disk arm movement calculator (FCFS baseline 0–130 tracks)'
    },
    {
      id: 'results',
      label: 'Results & Analysis',
      subtitle: 'Comparative Reports & CSV',
      icon: BarChart3,
      tooltip: 'Unified OS evaluation report with CSV export and print view'
    },
    {
      id: 'testing',
      label: 'Testing & Validation',
      subtitle: 'Automated 15-Test Suite',
      icon: ShieldCheck,
      tooltip: 'Automated test suite verifying actual engine outputs against expected results'
    },
    {
      id: 'team10',
      label: 'Team 10 Parameters',
      subtitle: 'Official Parameter Set',
      icon: Sliders,
      tooltip: 'Enforced Team 10 master parameters and full simulation batch execution'
    },
    {
      id: 'about',
      label: 'About & Concept Mapping',
      subtitle: 'LMS-to-OS Architectural Matrix',
      icon: Info,
      tooltip: 'Detailed mapping matrix connecting library operations to OS kernel tasks'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile && setIsOpenMobile(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        ></div>
      )}

      <aside className={`
        fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full py-4 space-y-1 overflow-y-auto px-3">
          <div className="px-3 pb-2 mb-2 border-b border-slate-100">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Simulation Modules
            </span>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  if (setIsOpenMobile) setIsOpenMobile(false);
                }}
                data-tooltip={item.tooltip}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-2xl font-medium text-left transition group relative
                  ${isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className={`
                    w-8 h-8 rounded-xl flex items-center justify-center transition shrink-0
                    ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'}
                  `}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs tracking-tight truncate">{item.label}</div>
                    <div className={`text-[10px] font-mono truncate ${isActive ? 'text-orange-100' : 'text-slate-400'}`}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-white shrink-0" />}
              </button>
            );
          })}

          {/* Soft UI Help / Documentation Promo Box (Matching Soft UI Dashboard 3 reference image) */}
          <div className="mt-auto pt-4 px-1">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white space-y-2 relative overflow-hidden shadow-lg shadow-slate-900/10">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">Need help?</div>
                <div className="text-[10px] text-slate-300">Check official Team 10 OS documentation</div>
              </div>
              <button
                onClick={() => {
                  setActiveView('about');
                  if (setIsOpenMobile) setIsOpenMobile(false);
                }}
                className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 shadow-sm transition"
              >
                <span>Documentation</span>
                <ExternalLink className="h-3 w-3 text-slate-600" />
              </button>
            </div>

            <div className="mt-3 px-2 font-mono text-[10px] text-slate-400 space-y-0.5 text-center">
              <div className="text-slate-700 font-bold">Team 10 Academic Suite</div>
              <div>Soft UI Dashboard 3 v1.0</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
