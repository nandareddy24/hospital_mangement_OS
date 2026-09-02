import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  Bell,
  User,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  activeView: string;
  onResetData: () => void;
  onNavigateToView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onResetData,
  onNavigateToView
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const viewTitles: Record<string, { title: string; category: string }> = {
    dashboard: { title: 'Dashboard', category: 'Pages' },
    library: { title: 'Library Suite', category: 'Application Domain' },
    process: { title: 'Process Management', category: 'OS Kernels' },
    memory: { title: 'Memory Management', category: 'OS Kernels' },
    disk: { title: 'Disk Scheduling', category: 'OS Kernels' },
    results: { title: 'Results & Evaluation', category: 'Analysis' },
    team10: { title: 'System Parameters', category: 'Specifications' },
    testing: { title: 'Testing & Validation', category: 'Verification' },
    about: { title: 'Project Documentation', category: 'Academic' }
  };

  const currentView = viewTitles[activeView] || { title: 'Dashboard', category: 'Pages' };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all font-sans">
      {/* Left: Breadcrumbs & Dynamic View Header */}
      <div className="flex items-center space-x-4">
        <div>
          <nav className="flex items-center space-x-1.5 text-xs font-mono text-slate-400">
            <span>{currentView.category}</span>
            <span>/</span>
            <span className="text-cyan-400 font-bold">{currentView.title}</span>
          </nav>
          <h1 className="text-lg font-black tracking-tight text-white flex items-center space-x-2">
            <span>{currentView.title}</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              (OS Kernel Suite)
            </span>
          </h1>
        </div>
      </div>

      {/* Right: Quick Search, Status Pills & Action Icons */}
      <div className="flex items-center space-x-3">
        {/* Quick Search Input */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search OS Module / Book..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 lg:w-64 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-1.5 focus:outline-none transition-all placeholder:text-slate-500 font-mono"
          />
        </div>

        {/* Master Parameter Status Pill */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs px-3 py-1.5 rounded-xl font-mono font-bold shadow-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
          <span>Official Spec Locked</span>
        </div>

        {/* Reset Defaults Button */}
        <button
          onClick={onResetData}
          data-tooltip="Reset all sample data to official simulation values"
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold font-mono transition flex items-center space-x-1.5 shadow-xs"
        >
          <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Reset Defaults</span>
        </button>

        {/* Navigation Quick Shortcuts */}
        <button
          onClick={() => onNavigateToView('team10')}
          title="System Parameters"
          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-xl transition"
        >
          <Layers className="h-4 w-4" />
        </button>

        <button
          onClick={() => onNavigateToView('about')}
          title="Project Documentation"
          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-xl transition relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
        </button>

        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-cyan-500/20">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
};
