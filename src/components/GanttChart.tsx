import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import type { ProcessScheduleResult } from '../types/os';

interface GanttChartProps {
  scheduleResult: ProcessScheduleResult;
  timeQuantum?: number;
}

export const GanttChart: React.FC<GanttChartProps> = ({ scheduleResult, timeQuantum }) => {
  const { ganttChart, steps } = scheduleResult;
  const maxTime = ganttChart.length > 0 ? ganttChart[ganttChart.length - 1].endTime : 25;

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= maxTime) {
            setIsPlaying(false);
            return maxTime;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, maxTime, playbackSpeed]);

  const handleStepNext = () => {
    setCurrentTime((prev) => Math.min(maxTime, prev + 1));
  };

  const handleStepPrev = () => {
    setCurrentTime((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const activeStepLog = steps.find((s: any) => s.time === currentTime) || steps[steps.length - 1];

  return (
    <div className="soft-card p-6 space-y-5 font-mono text-xs">
      {/* Top Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-sans">
              Dynamic Gantt Chart Execution Timeline
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              Algorithm: Round Robin {timeQuantum ? `(Quantum Q = ${timeQuantum})` : ''}
            </span>
          </div>
        </div>

        {/* Playback Control Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            title="Reset Timeline"
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={handleStepPrev}
            title="Step Back"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
          >
            &larr; Step
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-md shadow-orange-500/20 transition"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Simulation'}</span>
          </button>
          <button
            onClick={handleStepNext}
            title="Step Forward"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
          >
            Step &rarr;
          </button>

          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="bg-slate-100 border border-slate-200 rounded-xl px-2 py-1 text-slate-700 font-bold focus:outline-none text-[11px]"
          >
            <option value={1500}>0.5x Speed</option>
            <option value={1000}>1.0x Speed</option>
            <option value={500}>2.0x Speed</option>
          </select>
        </div>
      </div>

      {/* Gantt Bar Visualization Container */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-bold">Timeline Execution Progress:</span>
          <span className="text-orange-600 font-extrabold text-sm">
            Current Time: t = {currentTime} / {maxTime} units
          </span>
        </div>

        {/* Scaled Gantt Blocks Container */}
        <div className="relative w-full h-14 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex items-center p-1 shadow-inner">
          {ganttChart.map((block: any, idx: number) => {
            const duration = block.endTime - block.startTime;
            const widthPct = (duration / maxTime) * 100;
            const isActive = currentTime >= block.startTime && currentTime < block.endTime;
            const isCompleted = currentTime >= block.endTime;

            return (
              <div
                key={idx}
                style={{ width: `${widthPct}%`, backgroundColor: block.color }}
                className={`
                  h-full flex flex-col items-center justify-center text-white transition-all duration-300 relative border-r border-white/30 first:rounded-l-xl last:rounded-r-xl
                  ${isActive ? 'ring-4 ring-orange-500 ring-offset-2 scale-105 z-10 font-black' : isCompleted ? 'opacity-90' : 'opacity-50'}
                `}
                title={`${block.processName}: t=${block.startTime} to t=${block.endTime} (${duration} units)`}
              >
                <span className="text-xs font-extrabold drop-shadow">{block.processName}</span>
                <span className="text-[10px] text-white/90 drop-shadow font-mono">{duration}u</span>
              </div>
            );
          })}

          {/* Current Time Indicator Needle */}
          <div
            style={{ left: `${(currentTime / maxTime) * 100}%` }}
            className="absolute top-0 bottom-0 w-1 bg-slate-900 z-20 shadow-md transition-all duration-200 pointer-events-none"
          >
            <div className="w-3 h-3 bg-slate-900 rotate-45 -mt-1.5 -ml-1 border border-white"></div>
          </div>
        </div>

        {/* Gantt Time Scale Ticks */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
          <span>t = 0</span>
          {Array.from({ length: 5 }).map((_, i) => {
            const tickTime = Math.round((maxTime / 5) * (i + 1));
            return <span key={i}>t = {tickTime}</span>;
          })}
        </div>
      </div>

      {/* Active Step Live Context Card */}
      {activeStepLog && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>Ready Queue &amp; CPU Context Snapshot at t = {currentTime}</span>
            </span>
            <span className="text-[10px] text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full font-bold">
              {activeStepLog.activeProcessName ? `Executing: ${activeStepLog.activeProcessName}` : 'CPU IDLE'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Ready Queue (HEAD &rarr; TAIL):</span>
              <span className="font-bold text-slate-900">
                {activeStepLog.readyQueue.length > 0
                  ? `[ ${activeStepLog.readyQueue.join(', ')} ]`
                  : '[ Queue Empty ]'}
              </span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Context Event Description:</span>
              <span className="text-slate-700">{activeStepLog.description}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
