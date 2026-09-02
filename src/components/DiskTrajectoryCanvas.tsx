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

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    ctx.fillStyle = '#0B0F19';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let c = 0; c <= cylinderMax; c += 10) {
      const x = paddingLeft + (c / cylinderMax) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, paddingTop);
      ctx.lineTo(x, height - paddingBottom);
      ctx.stroke();

      ctx.fillStyle = '#6B7280';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(c.toString(), x, height - paddingBottom + 16);
    }

    const stepsCount = result.sequence.length;
    const stepHeight = chartHeight / Math.max(1, stepsCount - 1);

    for (let i = 0; i < stepsCount; i++) {
      const y = paddingTop + i * stepHeight;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Step ${i}`, paddingLeft - 10, y + 4);
    }

    if (result.sequence.length > 1) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      result.sequence.forEach((cyl, idx) => {
        const x = paddingLeft + (cyl / cylinderMax) * chartWidth;
        const y = paddingTop + idx * stepHeight;
        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      result.sequence.forEach((cyl, idx) => {
        const x = paddingLeft + (cyl / cylinderMax) * chartWidth;
        const y = paddingTop + idx * stepHeight;

        ctx.beginPath();
        ctx.arc(x, y, idx === 0 ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = idx === 0 ? '#F59E0B' : '#06B6D4';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#F9FAFB';
        ctx.font = '11px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${cyl}`, x, y - 10);

        if (idx > 0) {
          const prevCyl = result.sequence[idx - 1];
          const prevX = paddingLeft + (prevCyl / cylinderMax) * chartWidth;
          const prevY = paddingTop + (idx - 1) * stepHeight;
          const midX = (prevX + x) / 2;
          const midY = (prevY + y) / 2;
          const seek = Math.abs(cyl - prevCyl);

          ctx.fillStyle = '#10B981';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(`+${seek}`, midX + 12, midY);
        }
      });
    }
  }, [result, cylinderMax]);

  return (
    <div className="w-full overflow-x-auto glass-card p-4 rounded-xl">
      <div className="flex items-center justify-between mb-3 text-xs text-gray-400 font-mono">
        <span>Disk Cylinder Trajectory (Range: 0 – {cylinderMax})</span>
        <span className="text-blue-400 font-bold">Total Seek: {result.totalSeekDistance} tracks</span>
      </div>
      <canvas
        ref={canvasRef}
        width={780}
        height={380}
        className="w-full h-[380px] rounded-lg border border-gray-800 bg-gray-950"
      />
    </div>
  );
};
