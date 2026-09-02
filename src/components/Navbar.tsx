import React from 'react';
import { BookOpen, ShieldCheck, Menu, X, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onResetTeam10: () => void;
  isOpenMobile?: boolean;
  setIsOpenMobile?: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onResetTeam10, isOpenMobile, setIsOpenMobile }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-panel border-b border-gray-800 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsOpenMobile && setIsOpenMobile(!isOpenMobile)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden"
        >
          {isOpenMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold text-white tracking-tight font-sans">
                Library Management System
              </h1>
              <span className="hidden sm:inline-block badge-academic">OS Resource Simulator</span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono hidden md:block">
              Team 10 Official Suite &bull; Process (RR Q=4) | Memory (4GB / 4KB) | Disk (FCFS 0–130)
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden lg:flex items-center space-x-2 text-xs font-mono bg-gray-900/90 border border-gray-800 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-gray-300">Team 10 Locked</span>
          <span className="text-gray-500">|</span>
          <span className="text-blue-400 font-bold">RR Q=4</span>
          <span className="text-gray-500">|</span>
          <span className="text-emerald-400 font-bold">RAM 4GB</span>
          <span className="text-gray-500">|</span>
          <span className="text-amber-400 font-bold">Disk 0–130</span>
        </div>

        <button
          onClick={onResetTeam10}
          data-tooltip="Restores sample library catalog and locks official Team 10 OS parameters"
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
        >
          <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
          <span className="hidden sm:inline">Reset Team 10</span>
        </button>
      </div>
    </header>
  );
};
