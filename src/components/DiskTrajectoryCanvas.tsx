import React, { useRef, useEffect } from 'react';
import type { DiskScheduleResult } from '../types/os';

interface DiskTrajectoryCanvasProps {
  result: DiskScheduleResult;
  cylinderMax?: number;
}

export const DiskTrajectoryCanvas: React.FC<DiskTrajectoryCanvasProps> = ({
  result,
  cylinderMax = 130
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const initialHead = result.trajectory.length > 0 ? result.trajectory[0].fromCylinder : 65;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const paddingLeft = 50;
    const paddingRight = 40;
    const paddingTop = 40;
    const paddingBottom = 40;

    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingTop - paddingBottom;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;

    for (let c = 0; c <= cylinderMax; c += 10) {
      const x = paddingLeft + (c / cylinderMax) * graphWidth;
      ctx.beginPath();
      ctx.moveTo(x, paddingTop);
      ctx.lineTo(x, height - paddingBottom);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${c}`, x, paddingTop - 10);
    }

    const points = [
      { step: 0, cylinder: initialHead, label: `Start (${initialHead})` },
      ...result.trajectory.map((t) => ({
        step: t.stepIndex,
        cylinder: t.toCylinder,
        label: `Step ${t.stepIndex}: #${t.toCylinder}`
      }))
    ];

    const numSteps = points.length;

    ctx.beginPath();
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    points.forEach((pt, idx) => {
      const x = paddingLeft + (pt.cylinder / cylinderMax) * graphWidth;
      const y = paddingTop + (idx / (numSteps - 1)) * graphHeight;

      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    points.forEach((pt, idx) => {
      const x = paddingLeft + (pt.cylinder / cylinderMax) * graphWidth;
      const y = paddingTop + (idx / (numSteps - 1)) * graphHeight;

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? '#3b82f6' : '#ea580c';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = x > width / 2 ? 'right' : 'left';
      const textX = x > width / 2 ? x - 12 : x + 12;
      ctx.fillText(pt.label, textX, y + 3);
    });
  }, [result, cylinderMax, initialHead]);

  return (
    <div className="soft-card p-6 space-y-3 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm font-sans">
            Disk Cylinder Trajectory Vector Canvas (0 to {cylinderMax})
          </h4>
          <p className="text-slate-500 text-[11px] font-mono mt-0.5">
            Initial Head: Cylinder #{initialHead} &bull; Total Seek Movement: {result.totalSeekDistance} Tracks
          </p>
        </div>
        <span className="px-3 py-1 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl font-bold text-xs">
          {result.algorithm} Trajectory Graph
        </span>
      </div>

      <div className="w-full overflow-x-auto bg-white rounded-2xl p-2 border border-slate-200 shadow-xs">
        <canvas
          ref={canvasRef}
          width={800}
          height={380}
          className="w-full h-auto min-w-[700px] block"
        />
      </div>
    </div>
  );
};
