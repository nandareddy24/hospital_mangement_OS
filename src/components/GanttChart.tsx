import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import type { ProcessScheduleResult } from '../types/os';

interface GanttChartProps {
  scheduleResult: ProcessScheduleResult;
  timeQuantum: number;
}

export const GanttChart: React.FC<GanttChartProps> = ({ scheduleResult, timeQuantum }) => {
  const { ganttChart, totalExecutionTime, steps } = scheduleResult;
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(steps.length - 1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000);

  useEffect(() => {
    setCurrentStepIdx(steps.length - 1);
  }, [scheduleResult]);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, speed]);

  const currentStep = steps[currentStepIdx] || steps[steps.length - 1];
  const ganttSoFar = currentStep?.ganttSoFar || ganttChart;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-xl bg-gray-900/60 border border-gray-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2.5 rounded-lg font-semibold flex items-center space-x-2 transition-all ${
              isPlaying 
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30' 
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20'
            }`}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="text-xs">{isPlaying ? 'Pause' : 'Play Simulation'}</span>
          </button>

          <button
            onClick={() => { setIsPlaying(false); setCurrentStepIdx(0); }}
            className="p-2 rounded-lg text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 transition"
            title="Reset to Step 0"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={() => { setIsPlaying(false); setCurrentStepIdx(prev => Math.max(0, prev - 1)); }}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-lg text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-40 transition"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={() => { setIsPlaying(false); setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1)); }}
            disabled={currentStepIdx >= steps.length - 1}
            className="p-2 rounded-lg text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-40 transition"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center space-x-3 flex-1 min-w-[200px] max-w-md">
          <span className="text-xs font-mono text-gray-400">
            Step {currentStepIdx + 1}/{steps.length}
          </span>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={currentStepIdx}
            onChange={(e) => { setIsPlaying(false); setCurrentStepIdx(Number(e.target.value)); }}
            className="flex-1 accent-blue-500 cursor-pointer h-1.5 bg-gray-800 rounded-lg"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-gray-400">Speed:</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded-lg px-2 py-1 focus:outline-none"
          >
            <option value={1500}>0.75x</option>
            <option value={1000}>1.0x</option>
            <option value={500}>2.0x</option>
            <option value={200}>5.0x</option>
          </select>
        </div>
      </div>

      {currentStep && (
        <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl text-xs font-mono text-blue-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            <span>{currentStep.description}</span>
          </div>
          <span className="text-gray-400 text-[11px]">Time = {currentStep.time}</span>
        </div>
      )}

      {currentStep && (
        <div className="glass-card p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Round Robin Ready Queue State (Quantum = {timeQuantum})</span>
            <span>Active Process: <strong className="text-emerald-400 font-mono">{currentStep.activeProcessName || 'CPU IDLE'}</strong></span>
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            <span className="text-xs font-mono text-gray-500">HEAD &rarr;</span>
            {currentStep.readyQueue.length === 0 ? (
              <span className="text-xs text-gray-500 italic">[ Queue Empty ]</span>
            ) : (
              currentStep.readyQueue.map((pid, idx) => (
                <div key={idx} className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs font-bold font-mono text-blue-300 shadow-sm">
                  {pid.toUpperCase()}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="glass-card p-5 rounded-xl space-y-3">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center justify-between">
          <span>Dynamic Gantt Chart Timeline</span>
          <span className="text-xs font-mono text-gray-400">Total Duration: {totalExecutionTime} time units</span>
        </h3>

        <div className="relative overflow-x-auto py-2">
          <div className="flex min-w-[600px] border border-gray-800 rounded-lg p-1 bg-gray-950/60">
            {ganttSoFar.map((block, idx) => {
              const duration = block.endTime - block.startTime;
              const widthPct = (duration / totalExecutionTime) * 100;
              return (
                <div
                  key={idx}
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: block.color
                  }}
                  className="gantt-bar-block text-xs group transition-all"
                  title={`${block.processName}: t=${block.startTime} to t=${block.endTime} (Duration ${duration})`}
                >
                  <span className="drop-shadow-md">{block.processName}</span>
                </div>
              );
            })}
          </div>

          <div className="flex min-w-[600px] justify-between text-[11px] font-mono text-gray-400 mt-2 px-1">
            {Array.from({ length: totalExecutionTime + 1 }).map((_, timeTick) => (
              <span key={timeTick} className="text-center" style={{ width: `${100 / (totalExecutionTime + 1)}%` }}>
                {timeTick}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
