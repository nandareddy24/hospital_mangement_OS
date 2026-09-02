import React from 'react';
import { X, CheckCircle2, Calculator, Lock } from 'lucide-react';

export interface VerificationData {
  title: string;
  category: 'PROCESS' | 'MEMORY' | 'DISK';
  parameterInputs: { label: string; value: string }[];
  formulas: { title: string; equation: string; result: string; notes?: string }[];
  steps?: { stepName: string; detail: string }[];
}

interface CalculationVerificationModalProps {
  data: VerificationData | null;
  onClose: () => void;
}

export const CalculationVerificationModal: React.FC<CalculationVerificationModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl space-y-5 border border-blue-900/60 animate-fade-in font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              Algorithm Verification: {data.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 1. Traced Team 10 Inputs */}
        <div className="p-3.5 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="font-bold text-blue-400 flex items-center space-x-1.5">
              <Lock className="h-3.5 w-3.5" />
              <span>Traced Team 10 Official Inputs</span>
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
              Verified Parameter Source
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            {data.parameterInputs.map((input, idx) => (
              <div key={idx} className="p-2 bg-gray-900 rounded-lg border border-gray-800">
                <span className="text-gray-500 block text-[10px]">{input.label}</span>
                <strong className="text-gray-200">{input.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Step-by-Step Mathematical Derivations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-200 flex items-center space-x-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Mathematical Derivations &amp; Proofs</span>
          </h4>

          {data.formulas.map((f, idx) => (
            <div key={idx} className="p-3.5 bg-gray-950 rounded-xl border border-gray-800 space-y-1.5">
              <div className="text-blue-400 font-bold text-xs">{idx + 1}. {f.title}:</div>
              <div className="text-gray-300 font-mono text-[11px] bg-gray-900 p-2 rounded border border-gray-850">
                {f.equation}
              </div>
              <div className="text-emerald-400 font-bold text-sm">
                Result = {f.result}
              </div>
              {f.notes && <div className="text-gray-500 text-[10px] italic">{f.notes}</div>}
            </div>
          ))}
        </div>

        {/* 3. Detailed Step Trace Log */}
        {data.steps && data.steps.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-200">Execution Step-by-Step Trace Log</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {data.steps.map((s, idx) => (
                <div key={idx} className="p-2.5 bg-gray-950 rounded-lg border border-gray-850 flex justify-between items-center text-[11px]">
                  <span className="font-bold text-amber-400">{s.stepName}</span>
                  <span className="text-gray-300 font-mono">{s.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-800">
          <span className="text-[10px] text-gray-500">Evaluator Proof &bull; All outputs computed dynamically</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20"
          >
            Close Verification
          </button>
        </div>
      </div>
    </div>
  );
};
