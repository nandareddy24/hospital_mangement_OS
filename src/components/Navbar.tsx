import React from 'react';
import { Layers, Lock, RefreshCw, Menu, X, Search, Bell, Settings, User } from 'lucide-react';

interface NavbarProps {
  onResetTeam10: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onResetTeam10, isOpenMobile, setIsOpenMobile }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Brand Logo & Breadcrumb */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
        >
          {isOpenMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
              <span>Pages</span>
              <span>/</span>
              <span className="text-slate-800 font-bold">Dashboard</span>
            </div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Soft UI Simulator <span className="text-xs font-mono text-orange-600 font-semibold">(Team 10)</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Search, Status Pill & User Actions */}
      <div className="flex items-center space-x-3">
        {/* Soft UI Search Bar */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs text-slate-600 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition">
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Type here..."
            className="bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400 w-28 md:w-40 text-xs"
          />
        </div>

        {/* Team 10 Parameter Status Pill */}
        <div className="hidden md:flex items-center space-x-2 bg-orange-50 border border-orange-200/80 px-3 py-1.5 rounded-xl text-xs font-mono text-orange-700">
          <Lock className="h-3.5 w-3.5 text-orange-600" />
          <span className="font-bold">Team 10 Locked</span>
          <span className="text-[10px] text-orange-500">| RR Q=4 | 4GB | 0–130</span>
        </div>

        {/* Reset Team 10 Button */}
        <button
          onClick={onResetTeam10}
          data-tooltip="Reset all sample data to official Team 10 values"
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-mono shadow-md shadow-slate-900/10 flex items-center space-x-1.5 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset Team 10</span>
        </button>

        {/* Soft UI Icons */}
        <div className="flex items-center space-x-1 border-l border-slate-200 pl-2 text-slate-500">
          <button className="p-2 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition">
            <User className="h-4 w-4" />
          </button>
          <button className="p-2 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition">
            <Settings className="h-4 w-4" />
          </button>
          <button className="p-2 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
