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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="soft-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl space-y-5 border border-slate-200 animate-fade-in font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Calculator className="h-4 w-4" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Algorithm Verification: {data.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-xl transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 1. Traced Team 10 Inputs */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold text-orange-600 flex items-center space-x-1.5">
              <Lock className="h-3.5 w-3.5" />
              <span>Traced Team 10 Official Inputs</span>
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
              Verified Parameter Source
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            {data.parameterInputs.map((input, idx) => (
              <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">{input.label}</span>
                <strong className="text-slate-800">{input.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Step-by-Step Mathematical Derivations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Mathematical Derivations &amp; Proofs</span>
          </h4>

          {data.formulas.map((f, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="text-orange-600 font-bold text-xs">{idx + 1}. {f.title}:</div>
              <div className="text-slate-800 font-mono text-[11px] bg-white p-2.5 rounded-xl border border-slate-200">
                {f.equation}
              </div>
              <div className="text-emerald-700 font-bold text-sm">
                Result = {f.result}
              </div>
              {f.notes && <div className="text-slate-500 text-[10px] italic">{f.notes}</div>}
            </div>
          ))}
        </div>

        {/* 3. Detailed Step Trace Log */}
        {data.steps && data.steps.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900">Execution Step-by-Step Trace Log</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {data.steps.map((s, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-[11px]">
                  <span className="font-bold text-amber-600">{s.stepName}</span>
                  <span className="text-slate-700 font-mono">{s.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
          <span className="text-[10px] text-slate-500">Evaluator Proof &bull; All outputs computed dynamically</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md transition"
          >
            Close Verification
          </button>
        </div>
      </div>
    </div>
  );
};
