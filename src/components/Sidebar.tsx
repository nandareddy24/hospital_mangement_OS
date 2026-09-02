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
  ShieldCheck
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      <aside className={`
        fixed top-16 bottom-0 left-0 z-40 w-64 glass-panel border-r border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full py-4 space-y-1 overflow-y-auto px-3">
          <div className="px-3 pb-3 mb-2 border-b border-gray-800/80">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
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
                  w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-left transition group relative
                  ${isActive
                    ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-500/20 font-bold'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/50'
                  }
                `}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-400'}`} />
                  <div className="truncate">
                    <div className="text-xs tracking-tight truncate">{item.label}</div>
                    <div className={`text-[10px] font-mono truncate ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-white shrink-0" />}
              </button>
            );
          })}

          <div className="mt-auto pt-4 px-3 border-t border-gray-800/80 font-mono text-[10px] text-gray-400 space-y-1">
            <div className="text-gray-300 font-bold">Team 10 Academic Project</div>
            <div>OS Resource Management Simulator</div>
            <div className="text-emerald-400 font-semibold">Status: Verified &amp; Running</div>
          </div>
        </div>
      </aside>
    </>
  );
};
