import React, { useState } from 'react';
import { Database, Binary, CheckCircle2 } from 'lucide-react';
import { translateLogicalAddress } from '../utils/memoryManager';

export const PageTableVisualizer: React.FC = () => {
  const [testLogicalAddress, setTestLogicalAddress] = useState<number>(49316);
  const [pageTable] = useState<number[]>([0, 1, 2, 3]);

  const translation = translateLogicalAddress(testLogicalAddress, pageTable);

  return (
    <div className="soft-card p-6 space-y-6 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 font-sans">
            <Database className="h-4 w-4 text-emerald-600" />
            <span>7. Page Table &amp; 32-Bit Address Translator Unit</span>
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Converts 32-Bit Logical Address $(p \parallel d)$ to Physical RAM Address $(F \parallel d)$
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Page Size: 4 KB (12 Offset Bits)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Dynamic 32-Bit Address Translator Form */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <div className="font-extrabold text-slate-900 flex items-center space-x-2">
            <Binary className="h-4 w-4 text-orange-500" />
            <span>32-Bit Address Hardware Translator Simulator</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-600 font-bold text-[11px]">
              Input Logical Address (Decimal Bytes, 0 to 33,554,431):
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                max="33554431"
                value={testLogicalAddress}
                onChange={(e) => setTestLogicalAddress(Math.max(0, Number(e.target.value)))}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
              />
              <button
                onClick={() => setTestLogicalAddress(Math.floor(Math.random() * 33554431))}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Random
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 text-[11px]">
            <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500">Target Page Number (p = Address / 4096):</span>
              <strong className="text-orange-600 font-extrabold">Page #{translation.pageNumber}</strong>
            </div>

            <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500">Page Offset (d = Address % 4096):</span>
              <strong className="text-blue-600 font-extrabold">{translation.offset} Bytes</strong>
            </div>

            <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500">Physical Frame Mapping (F):</span>
              <strong className={translation.frameNumber === null ? 'text-rose-600 font-extrabold' : 'text-emerald-700 font-extrabold'}>
                {translation.frameNumber === null ? 'PAGE FAULT (Not Resident)' : `Physical FRAME #${translation.frameNumber}`}
              </strong>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <div className="text-emerald-800 font-bold">Physical Memory Address Result:</div>
              <div className="text-slate-900 font-bold text-sm">
                Decimal: {translation.physicalAddress} Bytes &bull; Hex: <span className="text-emerald-700">{translation.hexPhysical}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Page Table Register Matrix */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <div className="font-extrabold text-slate-900 flex items-center justify-between">
            <span>Kernel Page Table Register Matrix</span>
            <span className="text-[10px] text-slate-500 font-normal">Page &rarr; Frame Mapping</span>
          </div>

          <div className="overflow-x-auto max-h-[220px]">
            <table className="w-full text-center text-xs font-mono">
              <thead className="sticky top-0 bg-white border-b border-slate-200 text-slate-400">
                <tr>
                  <th className="py-2 px-2 text-left">Virtual Page Number (p)</th>
                  <th className="py-2 px-2">Valid Bit</th>
                  <th className="py-2 px-2">Physical Frame Number (F)</th>
                  <th className="py-2 px-2 text-right">Physical Base Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {[
                  { page: 12, frame: 0, valid: 1, base: '0x00000000' },
                  { page: 48, frame: 1, valid: 1, base: '0x00001000' },
                  { page: 102, frame: 2, valid: 1, base: '0x00002000' },
                  { page: 256, frame: 3, valid: 1, base: '0x00003000' },
                  { page: translation.pageNumber, frame: translation.frameNumber, valid: translation.frameNumber === null ? 0 : 1, base: translation.hexPhysical },
                ].map((row, idx) => (
                  <tr key={idx} className={row.page === translation.pageNumber ? 'bg-orange-50/80 font-bold' : 'hover:bg-slate-50/80'}>
                    <td className="py-2 px-2 text-left text-slate-900 font-bold">Page #{row.page}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.valid === 1 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                        {row.valid} ({row.valid === 1 ? 'Valid' : 'Fault'})
                      </span>
                    </td>
                    <td className="py-2 px-2 text-slate-800 font-bold">{row.frame !== null ? `Frame ${row.frame}` : 'None'}</td>
                    <td className="py-2 px-2 text-right font-mono text-slate-600">{row.base}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
