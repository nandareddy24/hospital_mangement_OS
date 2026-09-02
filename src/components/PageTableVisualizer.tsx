import React, { useState } from 'react';
import { translateLogicalAddress } from '../utils/memoryManager';
import { DEFAULT_NUM_FRAMES } from '../utils/memoryManager';
import { Cpu } from 'lucide-react';

export const PageTableVisualizer: React.FC = () => {
  const [frames, setFrames] = useState<(number | null)[]>([12, 48, 102, 256]);
  const [inputAddress, setInputAddress] = useState<string>('0x0000C0A4');

  let rawAddr = 49316;
  if (inputAddress.startsWith('0x') || inputAddress.startsWith('0X')) {
    rawAddr = parseInt(inputAddress, 16) || 0;
  } else {
    rawAddr = parseInt(inputAddress, 10) || 0;
  }

  const samplePageTable: (number | null)[] = new Array(8192).fill(null);
  frames.forEach((pNum, fIdx) => {
    if (pNum !== null) {
      samplePageTable[pNum] = fIdx;
    }
  });

  const translation = translateLogicalAddress(rawAddr, samplePageTable);

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 rounded-xl space-y-4 bg-gray-900/60 border border-gray-800">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center space-x-2">
          <Cpu className="h-4 w-4 text-emerald-400" />
          <span>Interactive 32-Bit Logical Address Translator</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-mono">Logical Address (Hex or Decimal):</label>
            <input
              type="text"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. 0x0000C0A4 or 49316"
            />
          </div>

          <div className="p-3 bg-gray-950 rounded-lg border border-gray-800 space-y-1 font-mono text-xs">
            <div className="text-gray-400 flex justify-between">
              <span>Page Number (p):</span>
              <span className="text-blue-400 font-bold">{translation.pageNumber}</span>
            </div>
            <div className="text-gray-400 flex justify-between">
              <span>Offset (d):</span>
              <span className="text-amber-400 font-bold">{translation.offset} B</span>
            </div>
          </div>

          <div className="p-3 bg-gray-950 rounded-lg border border-gray-800 space-y-1 font-mono text-xs">
            <div className="text-gray-400 flex justify-between">
              <span>Frame Result:</span>
              <span className={translation.isHit ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                {translation.isHit ? `Frame ${translation.frameNumber}` : 'PAGE FAULT'}
              </span>
            </div>
            <div className="text-gray-400 flex justify-between">
              <span>Physical Addr:</span>
              <span className="text-cyan-400 font-bold">
                {translation.hexPhysical ?? 'N/A (Load needed)'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-950/70 border border-gray-800/80 rounded-lg text-xs font-mono text-gray-300 space-y-1">
          <div className="text-blue-400 font-semibold">Translation Math Breakdown (Page Size = 4 KB = 4,096 B):</div>
          <div>Page Number = floor({rawAddr} / 4096) = <strong>{translation.pageNumber}</strong></div>
          <div>Offset = {rawAddr} % 4096 = <strong>{translation.offset}</strong></div>
          {translation.isHit && (
            <div>Physical Address = (Frame {translation.frameNumber} &times; 4096) + {translation.offset} = <strong>{translation.physicalAddress} ({translation.hexPhysical})</strong></div>
          )}
        </div>
      </div>

      <div className="glass-card p-5 rounded-xl space-y-4">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center justify-between">
          <span>Physical Memory RAM Allocation (Team 10: 4 Frames)</span>
          <span className="text-xs font-mono text-emerald-400">RAM: 4 GB | Frame Size: 4 KB</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: DEFAULT_NUM_FRAMES }).map((_, fIdx) => {
            const loadedPage = frames[fIdx];
            const isTargetFrame = translation.isHit && translation.frameNumber === fIdx;

            return (
              <div
                key={fIdx}
                className={`p-4 rounded-xl border transition-all ${
                  isTargetFrame
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'bg-gray-950/80 border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-gray-400 font-semibold">Frame {fIdx}</span>
                  <span className="text-[10px] text-gray-500">Base: 0x{(fIdx * 4096).toString(16).toUpperCase().padStart(4, '0')}</span>
                </div>

                <div className="space-y-2">
                  {loadedPage !== null ? (
                    <div className="p-3 bg-blue-900/20 border border-blue-700/40 rounded-lg text-center">
                      <span className="text-xs text-blue-400 font-mono block">Loaded Page</span>
                      <span className="text-lg font-bold font-mono text-white">Page #{loadedPage}</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-900 border border-dashed border-gray-800 rounded-lg text-center text-xs text-gray-500 font-mono">
                      [ Empty Frame ]
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-1">
                    <span className="text-[11px] text-gray-400 font-mono">Assign Pg:</span>
                    <input
                      type="number"
                      value={loadedPage ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : Number(e.target.value);
                        const newFrames = [...frames];
                        newFrames[fIdx] = val;
                        setFrames(newFrames);
                      }}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs font-mono text-white"
                      placeholder="e.g. 12"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
