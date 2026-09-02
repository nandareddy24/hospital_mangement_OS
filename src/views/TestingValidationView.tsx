import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, XCircle, Filter, RefreshCw } from 'lucide-react';
import { runAllAutomatedTests, type TestCaseResult } from '../utils/testRunner';

export const TestingValidationView: React.FC = () => {
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'PASSED' | 'FAILED'>('All');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    setTestResults(runAllAutomatedTests());
  }, []);

  const handleRunAllTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      setTestResults(runAllAutomatedTests());
      setIsRunning(false);
    }, 400);
  };

  const filteredTests = testResults.filter(t => {
    const matchesCat = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesCat && matchesStatus;
  });

  const totalTests = testResults.length;
  const passedTests = testResults.filter(t => t.status === 'PASSED').length;
  const failedTests = testResults.filter(t => t.status === 'FAILED').length;
  const passRatePercentage = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/60 via-indigo-950/40 to-gray-950 border border-emerald-900/40">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Testing &amp; Validation Module</h1>
            <span className="badge-academic bg-emerald-950 text-emerald-300 border-emerald-800">Automated Test Suite</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Verification suite executing 15 automated test cases comparing actual engine outputs with expected results.
          </p>
        </div>

        <button
          onClick={handleRunAllTests}
          disabled={isRunning}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold flex items-center space-x-2 shadow-lg shadow-emerald-500/25 transition"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Executing Tests...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>Run All Automated Tests</span>
            </>
          )}
        </button>
      </div>

      {/* Test Suite Summary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="glass-card p-4 rounded-xl space-y-1 border-l-4 border-l-blue-500">
          <span className="text-gray-400">Total Test Cases</span>
          <div className="text-2xl font-bold text-white">{totalTests}</div>
          <span className="text-[10px] text-gray-500">Across 3 OS Modules</span>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1 border-l-4 border-l-emerald-500">
          <span className="text-gray-400">Passed Tests</span>
          <div className="text-2xl font-bold text-emerald-400">{passedTests}</div>
          <span className="text-[10px] text-emerald-500 font-semibold">100% Match with Expected</span>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1 border-l-4 border-l-rose-500">
          <span className="text-gray-400">Failed Tests</span>
          <div className="text-2xl font-bold text-rose-400">{failedTests}</div>
          <span className="text-[10px] text-gray-500">Zero tolerance assertion</span>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1 border-l-4 border-l-purple-500">
          <span className="text-gray-400">Test Suite Pass Rate</span>
          <div className="text-2xl font-bold text-purple-400">{passRatePercentage}%</div>
          <span className="text-[10px] text-purple-300 font-semibold">Automated Validation Pass</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-xl text-xs font-mono">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400 font-bold">Module Filter:</span>
          <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
            {['All', 'Process Management', 'Memory Management', 'Disk Scheduling'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg transition ${
                  categoryFilter === cat ? 'bg-emerald-600 text-white font-bold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-gray-400 font-bold">Status:</span>
          <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
            {(['All', 'PASSED', 'FAILED'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === st ? 'bg-emerald-600 text-white font-bold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Test Cases Results Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-emerald-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-950/60 text-gray-400">
                <th className="p-3">Test Case ID</th>
                <th className="p-3">OS Module</th>
                <th className="p-3">Test Case Description</th>
                <th className="p-3">Input Parameters</th>
                <th className="p-3 text-blue-400">Expected Result</th>
                <th className="p-3 text-emerald-400">Actual Engine Result</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80">
              {filteredTests.map(tc => (
                <tr key={tc.id} className="hover:bg-gray-900/50 transition">
                  <td className="p-3 font-bold text-amber-400">{tc.id}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tc.category === 'Process Management' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                      tc.category === 'Memory Management' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {tc.category}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-white font-sans text-sm">{tc.title}</td>
                  <td className="p-3 text-gray-400 text-[11px] max-w-xs truncate" title={tc.inputs}>
                    {tc.inputs}
                  </td>
                  <td className="p-3 text-blue-300 font-semibold">{tc.expectedResult}</td>
                  <td className="p-3 text-emerald-300 font-semibold">{tc.actualResult}</td>
                  <td className="p-3 text-right">
                    {tc.status === 'PASSED' ? (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800 inline-flex items-center space-x-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>PASSED</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-950 text-rose-300 border border-rose-800 inline-flex items-center space-x-1">
                        <XCircle className="h-3.5 w-3.5" />
                        <span>FAILED</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
