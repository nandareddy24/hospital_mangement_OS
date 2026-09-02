import React, { useState } from 'react';
import { HardDrive, Lock, Calculator } from 'lucide-react';
import { simulateDiskScheduling } from '../utils/diskScheduler';
import { DiskTrajectoryCanvas } from '../components/DiskTrajectoryCanvas';
import { OFFICIAL_SIMULATION_DEFAULTS } from '../utils/constants';
import { CalculationVerificationModal, type VerificationData } from '../components/CalculationVerificationModal';

export const DiskSchedulingView: React.FC = () => {
  const [initialHead] = useState<number>(OFFICIAL_SIMULATION_DEFAULTS.initialHead);
  const [requestQueue] = useState<number[]>(OFFICIAL_SIMULATION_DEFAULTS.diskQueue);

  const [genericVerificationModal, setGenericVerificationModal] = useState<VerificationData | null>(null);

  const fcfsResult = simulateDiskScheduling(requestQueue, initialHead, 'FCFS', OFFICIAL_SIMULATION_DEFAULTS.cylinderMax);
  const activeResult = fcfsResult;

  const showTotalSeekCalculation = () => {
    setGenericVerificationModal({
      title: 'Total Head Movement (Seek Distance) Derivation',
      category: 'DISK',
      parameterInputs: [
        { label: 'Algorithm', value: activeResult.algorithm },
        { label: 'Initial Head Position', value: `Cylinder #${initialHead}` },
        { label: 'Cylinder Range', value: '0 to 130' },
        { label: 'Request Queue', value: `[${requestQueue.join(', ')}]` }
      ],
      formulas: [
        {
          title: 'Individual Seek Distances (|Target - Current|)',
          equation: 'Step 1: |25-65|=40 | Step 2: |105-25|=80 | Step 3: |40-105|=65 | Step 4: |115-40|=75 | Step 5: |55-115|=60 | Step 6: |90-55|=35 | Step 7: |10-90|=80 | Step 8: |120-10|=110',
          result: `Total Seek = ${fcfsResult.totalSeekDistance} tracks`
        }
      ],
      steps: fcfsResult.trajectory.map(s => ({
        stepName: `Step ${s.stepIndex}: ${s.fromCylinder} -> ${s.toCylinder}`,
        detail: `|${s.toCylinder} - ${s.fromCylinder}| = +${s.seekDistance} tracks (Cumulative: ${s.cumulativeSeek})`
      }))
    });
  };

  const showAvgSeekCalculation = () => {
    setGenericVerificationModal({
      title: 'Average Seek Distance Derivation',
      category: 'DISK',
      parameterInputs: [
        { label: 'Total Seek Distance', value: `${fcfsResult.totalSeekDistance} tracks` },
        { label: 'Total Requests (N)', value: `${requestQueue.length} requests` }
      ],
      formulas: [
        {
          title: 'Average Seek Distance Formula',
          equation: `Average Seek = Total Seek Distance / Total Requests = ${fcfsResult.totalSeekDistance} / ${requestQueue.length}`,
          result: `${fcfsResult.avgSeekDistance} tracks per request`
        }
      ]
    });
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Top Banner */}
      <div className="glass-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-amber-500">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Disk Scheduling &amp; Head Trajectory</h1>
            <span className="badge-academic">Master Evaluation Suite</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pre-configured strictly with official parameters. FCFS is the official algorithm baseline.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold">
          <Lock className="h-4 w-4" />
          <span>Cylinders: 0–130 | Initial Head: 65 | FCFS Baseline</span>
        </div>
      </div>

      {/* Input Parameters */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
            <HardDrive className="h-4 w-4 text-amber-400" />
            <span>Official Input Disk Parameters</span>
          </h3>
          <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-xl">
            FCFS Algorithm (Official)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-500">1. Disk Cylinder Range:</span>
            <div className="text-white font-extrabold text-sm">0 to 130</div>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-500">2. Initial Head Position:</span>
            <div className="text-cyan-400 font-extrabold text-sm">Cylinder #{initialHead}</div>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-500">3. Official Request Queue:</span>
            <div className="text-amber-400 font-bold text-xs truncate">
              [{requestQueue.join(', ')}]
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="glass-card p-4 rounded-xl space-y-1 border-l-4 border-l-amber-500">
          <span className="text-slate-400">Official Algorithm</span>
          <div className="text-xl font-black text-white">FCFS Disk Scheduling</div>
          <span className="text-[10px] text-slate-500">First-Come First-Served</span>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1 border-l-4 border-l-cyan-500">
          <span className="text-slate-400">Initial Head Position</span>
          <div className="text-xl font-black text-cyan-400">Cylinder 65</div>
          <span className="text-[10px] text-slate-500">Starting Point</span>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-amber-500">
          <span className="text-slate-400 block font-bold">5. Total Head Movement</span>
          <div className="text-2xl font-black text-amber-400">{activeResult.totalSeekDistance} <span className="text-xs text-slate-500 font-normal">tracks</span></div>
          <button
            onClick={showTotalSeekCalculation}
            className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
          >
            <Calculator className="h-3 w-3 text-amber-400" />
            <span>Show Calculation</span>
          </button>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-emerald-500">
          <span className="text-slate-400 block font-bold">6. Average Seek Distance</span>
          <div className="text-2xl font-black text-emerald-400">{activeResult.avgSeekDistance} <span className="text-xs text-slate-500 font-normal">tracks/req</span></div>
          <button
            onClick={showAvgSeekCalculation}
            className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center space-x-1"
          >
            <Calculator className="h-3 w-3 text-emerald-400" />
            <span>Show Calculation</span>
          </button>
        </div>
      </div>

      {/* Trajectory Derivation Cards */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
            <Calculator className="h-4 w-4 text-amber-400" />
            <span>Step-by-Step Seek Distance Derivation ({activeResult.algorithm})</span>
          </h3>
          <span className="text-xs font-mono text-slate-400 font-bold">Formula: Seek = |Target - Current|</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {activeResult.trajectory.map((step) => (
            <div key={step.stepIndex} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-white text-sm flex items-center space-x-2">
                  <span>Step {step.stepIndex}: {step.fromCylinder} &rarr; {step.toCylinder}</span>
                </div>
                <div className="text-[11px] text-slate-400">Seek = |{step.toCylinder} - {step.fromCylinder}| = <strong className="text-amber-400">+{step.seekDistance} tracks</strong></div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Cumulative</span>
                <span className="text-cyan-400 font-bold">{step.cumulativeSeek} tracks</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs font-mono text-amber-300 text-center font-bold">
          Total Head Movement Calculation = {activeResult.trajectory.map(s => s.seekDistance).join(' + ')} = <strong className="text-white">{activeResult.totalSeekDistance} tracks</strong>
        </div>
      </div>

      {/* Canvas Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-white flex items-center space-x-2 px-1">
          <span>8. Head Movement Trajectory Graph ({activeResult.algorithm})</span>
        </h3>
        <DiskTrajectoryCanvas result={activeResult} cylinderMax={OFFICIAL_SIMULATION_DEFAULTS.cylinderMax} />
      </div>

      {/* Trajectory Table */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center justify-between">
          <span>5. Seek Distance Detailed Table ({activeResult.algorithm})</span>
          <span className="text-xs font-mono text-amber-400 font-bold">
            Total Movement: <strong className="text-white text-sm">{activeResult.totalSeekDistance}</strong> tracks
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="p-3">Step #</th>
                <th className="p-3">From Cylinder</th>
                <th className="p-3">To Target Cylinder</th>
                <th className="p-3 text-amber-400">Absolute Seek Distance Formula</th>
                <th className="p-3 text-cyan-400">Cumulative Seek Tracks</th>
                <th className="p-3">Operation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {activeResult.trajectory.map((step) => (
                <tr key={step.stepIndex} className="hover:bg-slate-900/60">
                  <td className="p-3 font-bold text-slate-300">Step {step.stepIndex}</td>
                  <td className="p-3 text-slate-400">{step.fromCylinder}</td>
                  <td className="p-3 text-amber-400 font-bold">{step.toCylinder}</td>
                  <td className="p-3 text-amber-400 font-bold">
                    |{step.toCylinder} - {step.fromCylinder}| = +{step.seekDistance} tracks
                  </td>
                  <td className="p-3 text-cyan-400 font-bold">{step.cumulativeSeek} tracks</td>
                  <td className="p-3 text-slate-400 text-[11px]">{step.lmsOperation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VERIFICATION MODAL */}
      <CalculationVerificationModal
        data={genericVerificationModal}
        onClose={() => setGenericVerificationModal(null)}
      />
    </div>
  );
};
