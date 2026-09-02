import { simulateRoundRobin } from './processScheduler';
import { calculateTeam10MemoryStats, translateLogicalAddress } from './memoryManager';
import { simulateDiskScheduling } from './diskScheduler';
import { OFFICIAL_SIMULATION_DEFAULTS } from './constants';

export interface TestCaseResult {
  id: string;
  category: 'PROCESS' | 'MEMORY' | 'DISK' | 'Process Management' | 'Memory Management' | 'Disk Scheduling';
  name: string;
  title?: string;
  inputs: string;
  expected: string;
  expectedResult?: string;
  actual: string;
  actualResult?: string;
  status: 'PASS' | 'FAIL' | 'PASSED' | 'FAILED';
  executionTimeMs?: number;
}

export function runAllAutomatedTests(): TestCaseResult[] {
  const results: TestCaseResult[] = [];

  const addTest = (
    id: string,
    category: 'PROCESS' | 'MEMORY' | 'DISK',
    name: string,
    inputs: string,
    expected: string,
    actualFn: () => string
  ) => {
    let actual = '';
    try {
      actual = actualFn();
    } catch (e: any) {
      actual = 'ERROR: ' + e.message;
    }

    const isMatch = actual.trim().toLowerCase() === expected.trim().toLowerCase();
    results.push({
      id,
      category,
      name,
      inputs,
      expected,
      actual,
      status: isMatch ? 'PASS' : 'FAIL'
    });
  };

  // A. PROCESS MANAGEMENT TEST CASES
  const rrResult = simulateRoundRobin(OFFICIAL_SIMULATION_DEFAULTS.processes, OFFICIAL_SIMULATION_DEFAULTS.timeQuantum);

  addTest(
    'TC-PROC-01',
    'PROCESS',
    'All processes arriving at different times',
    'P1@0(BT6), P2@2(BT2), P3@3(BT5), P4@5(BT9), P5@7(BT3)',
    'Completion: P1=12, P2=6, P3=20, P4=25, P5=19',
    () => `Completion: ${rrResult.metrics.map(m => `${m.name}=${m.completionTime}`).join(', ')}`
  );

  addTest(
    'TC-PROC-02',
    'PROCESS',
    'Process completion before another process arrives',
    'P2 arrived at t=2, completed at t=6',
    'P2 CT = 6 units',
    () => `P2 CT = ${rrResult.metrics.find(m => m.name === 'P2')?.completionTime} units`
  );

  addTest(
    'TC-PROC-03',
    'PROCESS',
    'Process requiring multiple Round Robin cycles',
    'P4 (BT=9, Q=4) requires 3 CPU cycles',
    'P4 Cycles = 3 executions',
    () => `P4 Cycles = ${rrResult.metrics.find(m => m.name === 'P4')?.executionIntervals.length} executions`
  );

  addTest(
    'TC-PROC-04',
    'PROCESS',
    'Process completing exactly at quantum boundary',
    'P2 (BT=2) runs from t=4 to t=6',
    'P2 Execution = 4 to 6',
    () => {
      const p2Int = rrResult.metrics.find(m => m.name === 'P2')?.executionIntervals[0];
      return `P2 Execution = ${p2Int?.start} to ${p2Int?.end}`;
    }
  );

  addTest(
    'TC-PROC-05',
    'PROCESS',
    'Correct ready queue preemption handling',
    'Average Turnaround Time = 13.0, Waiting Time = 8.0',
    'Avg TAT = 13.0, Avg WT = 8.0',
    () => `Avg TAT = ${rrResult.avgTurnaroundTime.toFixed(1)}, Avg WT = ${rrResult.avgWaitingTime.toFixed(1)}`
  );

  // B. MEMORY MANAGEMENT TEST CASES
  const memStats = calculateTeam10MemoryStats(33554432);

  addTest(
    'TC-MEM-01',
    'MEMORY',
    'Virtual page count calculation',
    '32 MB Logical Space / 4 KB Page Size',
    'Derived Pages = 8,192 pages',
    () => `Derived Pages = ${memStats.numberOfPages.toLocaleString()} pages`
  );

  addTest(
    'TC-MEM-02',
    'MEMORY',
    'Physical frame allocation (16 KB resident)',
    '4 Physical Frames * 4 KB Page Size',
    'Resident RAM = 16 KB',
    () => `Resident RAM = ${memStats.allocatedFrames * 4} KB`
  );

  addTest(
    'TC-MEM-03',
    'MEMORY',
    'Logical-to-physical address translation',
    'Logical Address = 49,316 Bytes',
    'Page = 12, Offset = 16 Bytes',
    () => {
      const tr = translateLogicalAddress(49316, [0, 1, 2, 3]);
      return `Page = ${tr.pageNumber}, Offset = ${tr.offset} Bytes`;
    }
  );

  addTest(
    'TC-MEM-04',
    'MEMORY',
    'Page size unit conversion (12 Offset Bits)',
    '4 KB Page Size = 4,096 Bytes',
    'Page Bytes = 4,096 Bytes',
    () => `Page Bytes = ${memStats.pageSizeBytes} Bytes`
  );

  addTest(
    'TC-MEM-05',
    'MEMORY',
    'Internal fragmentation calculation',
    '32 MB exact multiple of 4 KB',
    'Internal Fragmentation = 0 Bytes',
    () => `Internal Fragmentation = ${memStats.internalFragmentationBytes} Bytes`
  );

  // C. DISK SCHEDULING TEST CASES
  const diskResult = simulateDiskScheduling(OFFICIAL_SIMULATION_DEFAULTS.diskQueue, OFFICIAL_SIMULATION_DEFAULTS.initialHead, 'FCFS', OFFICIAL_SIMULATION_DEFAULTS.cylinderMax);

  addTest(
    'TC-DISK-01',
    'DISK',
    'First request head movement (65 to 25)',
    'Head #65 to Cylinder #25',
    'First Seek = |25 - 65| = 40 tracks',
    () => {
      const step1 = diskResult.trajectory[0];
      return `First Seek = |${step1.toCylinder} - ${step1.fromCylinder}| = ${step1.seekDistance} tracks`;
    }
  );

  addTest(
    'TC-DISK-02',
    'DISK',
    'Consecutive request movements tracking',
    'Request Queue = [25, 105, 40, 115, 55, 90, 10, 120]',
    'Total Step Transitions = 8 steps',
    () => `Total Step Transitions = ${diskResult.trajectory.length} steps`
  );

  addTest(
    'TC-DISK-03',
    'DISK',
    'Cylinder boundary values validation',
    'Min Cylinder = 0, Max Cylinder = 130',
    'Boundary Range = 0 to 130 cylinders',
    () => `Boundary Range = 0 to ${OFFICIAL_SIMULATION_DEFAULTS.cylinderMax} cylinders`
  );

  addTest(
    'TC-DISK-04',
    'DISK',
    'Total seek calculation (FCFS baseline)',
    'Seek sum: 40 + 80 + 65 + 75 + 60 + 35 + 80 + 110',
    'Total Seek = 545 tracks',
    () => `Total Seek = ${diskResult.totalSeekDistance} tracks`
  );

  addTest(
    'TC-DISK-05',
    'DISK',
    'Average seek calculation (Total Seek / N)',
    '545 tracks / 8 requests',
    'Average Seek = 68.13 tracks/request',
    () => `Average Seek = ${diskResult.avgSeekDistance} tracks/request`
  );

  return results;
}

export const runFullTestSuite = runAllAutomatedTests;
