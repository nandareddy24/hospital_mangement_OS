import React from 'react';
import { X, Calculator } from 'lucide-react';

export interface VerificationFormula {
  title: string;
  equation: string;
  result: string;
}

export interface VerificationStep {
  stepName: string;
  detail: string;
}

export interface VerificationData {
  title: string;
  category: 'PROCESS' | 'MEMORY' | 'DISK';
  parameterInputs: { label: string; value: string }[];
  formulas: VerificationFormula[];
  steps?: (VerificationStep | string)[];
}

interface CalculationVerificationModalProps {
  data: VerificationData | null;
  onClose: () => void;
}

export const CalculationVerificationModal: React.FC<CalculationVerificationModalProps> = ({
  data,
  onClose
}) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl space-y-5 border border-slate-800 animate-fade-in font-mono text-xs text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-extrabold text-white font-sans">{data.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 1. Traced Inputs */}
        <div className="space-y-2">
          <span className="text-slate-400 font-bold block text-[11px] uppercase tracking-wider">
            1. Traced Official Inputs
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {data.parameterInputs.map((input, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-500">{input.label}:</span>
                <strong className="text-cyan-400">{input.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Formulas & Mathematical Derivations */}
        <div className="space-y-3">
          <span className="text-slate-400 font-bold block text-[11px] uppercase tracking-wider">
            2. Mathematical Proof &amp; Formula Derivation
          </span>

          {data.formulas.map((f, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
              <div className="font-bold text-white text-xs">{f.title}:</div>
              <div className="p-2 bg-slate-900 rounded-lg text-slate-300 font-mono text-[11px] border border-slate-800">
                {f.equation}
              </div>
              <div className="text-right text-emerald-400 font-bold text-xs pt-1">
                &rarr; {f.result}
              </div>
            </div>
          ))}
        </div>

        {/* 3. Detailed Calculation Steps (if any) */}
        {data.steps && data.steps.length > 0 && (
          <div className="space-y-2">
            <span className="text-slate-400 font-bold block text-[11px] uppercase tracking-wider">
              3. Execution Trace Steps
            </span>
            <div className="space-y-1.5 text-[11px]">
              {data.steps.map((st, idx) => {
                const stepName = typeof st === 'string' ? `Step ${idx + 1}` : st.stepName;
                const detail = typeof st === 'string' ? st : st.detail;
                return (
                  <div key={idx} className="p-2 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-cyan-400">{stepName}:</span>
                    <span className="text-slate-300">{detail}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold shadow-md transition"
          >
            Close Proof Verification
          </button>
        </div>
      </div>
    </div>
  );
};
