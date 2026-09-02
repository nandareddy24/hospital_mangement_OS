import { simulateRoundRobin } from './processScheduler';
import { calculateTeam10MemoryStats, translateLogicalAddress } from './memoryManager';
import { simulateDiskScheduling } from './diskScheduler';
import { TEAM_10_DEFAULTS } from './constants';

export interface TestCaseResult {
  id: string;
  category: 'Process Management' | 'Memory Management' | 'Disk Scheduling';
  title: string;
  inputs: string;
  expectedResult: string;
  actualResult: string;
  status: 'PASSED' | 'FAILED';
  executionTimeMs: number;
}

export function runAllAutomatedTests(): TestCaseResult[] {
  const results: TestCaseResult[] = [];

  // Helper to push test case with execution timer & auto status calculation
  const addTest = (
    id: string,
    category: 'Process Management' | 'Memory Management' | 'Disk Scheduling',
    title: string,
    inputs: string,
    expectedResult: string,
    actualFn: () => string
  ) => {
    const start = performance.now();
    let actualResult = '';
    try {
      actualResult = actualFn();
    } catch (e: any) {
      actualResult = 'ERROR: ' + e.message;
    }
    const end = performance.now();

    const isMatch = actualResult.trim().toLowerCase() === expectedResult.trim().toLowerCase();
    results.push({
      id,
      category,
      title,
      inputs,
      expectedResult,
      actualResult,
      status: isMatch ? 'PASSED' : 'FAILED',
      executionTimeMs: Number((end - start).toFixed(2))
    });
  };

  // ==========================================
  // A. PROCESS MANAGEMENT TEST CASES
  // ==========================================
  const rrResult = simulateRoundRobin(TEAM_10_DEFAULTS.processes, TEAM_10_DEFAULTS.timeQuantum);

  addTest(
    'TC-PROC-01',
    'Process Management',
    'All processes arriving at different times',
    'P1@0(BT6), P2@2(BT2), P3@3(BT5), P4@5(BT9), P5@7(BT3)',
    'Average TAT = 13 time units',
    () => `Average TAT = ${rrResult.avgTurnaroundTime} time units`
  );

  addTest(
    'TC-PROC-02',
    'Process Management',
    'Process completion before another process arrives',
    'P2 burst=2 at t=4..6 completes before P4 execution at t=12',
    'Completion Time = 6 time units',
    () => {
      const p2 = rrResult.metrics.find(m => m.id === 'P2');
      return `Completion Time = ${p2?.completionTime} time units`;
    }
  );

  addTest(
    'TC-PROC-03',
    'Process Management',
    'Process requiring multiple Round Robin cycles',
    'P4 burst=9, Quantum=4 requires 3 CPU cycles (4u + 4u + 1u)',
    'Completion Time = 25 time units',
    () => {
      const p4 = rrResult.metrics.find(m => m.id === 'P4');
      return `Completion Time = ${p4?.completionTime} time units`;
    }
  );

  addTest(
    'TC-PROC-04',
    'Process Management',
    'Process completing exactly at a quantum boundary',
    'P1 burst=6, Quantum=4 (Cycle 1=4u, Cycle 2=2u completes at t=12)',
    'Completion Time = 12 time units',
    () => {
      const p1 = rrResult.metrics.find(m => m.id === 'P1');
      return `Completion Time = ${p1?.completionTime} time units`;
    }
  );

  addTest(
    'TC-PROC-05',
    'Process Management',
    'Correct ready queue handling & re-queuing',
    't=4 ready queue check after P1 quantum expiration',
    'Ready Queue = [P2, P3, P1]',
    () => {
      const stepAt4 = rrResult.steps.find(s => s.time === 4 && s.stepIndex > 0);
      const queueNames = stepAt4 ? stepAt4.readyQueue.map(pid => pid) : [];
      return `Ready Queue = [${queueNames.join(', ')}]`;
    }
  );

  // ==========================================
  // B. MEMORY MANAGEMENT TEST CASES
  // ==========================================
  const memStats = calculateTeam10MemoryStats(33554432);

  addTest(
    'TC-MEM-01',
    'Memory Management',
    'Page calculation (Logical Space / Page Size)',
    'Logical Space = 32 MB (33,554,432 B), Page Size = 4 KB (4,096 B)',
    'Derived Pages = 8,192 pages',
    () => `Derived Pages = ${memStats.numberOfPages.toLocaleString()} pages`
  );

  addTest(
    'TC-MEM-02',
    'Memory Management',
    'Frame allocation (4 physical frames)',
    'Allocated Frames = 4, Page Size = 4,096 Bytes',
    'Allocated Memory = 16,384 Bytes (16 KB)',
    () => `Allocated Memory = ${memStats.allocatedMemoryBytes.toLocaleString()} Bytes (16 KB)`
  );

  addTest(
    'TC-MEM-03',
    'Memory Management',
    'Logical-to-physical address translation mapping',
    'Logical Address = 49,316 B (Page 12, Offset 164 B) in Frame 0',
    'Physical Address = 0x000000A4 (164 B)',
    () => {
      const pageTable = [0, 1, 2, 3];
      const translated = translateLogicalAddress(49316, pageTable);
      return `Physical Address = ${translated.hexPhysical} (${translated.physicalAddress} B)`;
    }
  );

  addTest(
    'TC-MEM-04',
    'Memory Management',
    'Unit conversion accuracy (RAM 4GB to Bytes)',
    'RAM Size = 4 GB',
    'Bytes = 4,294,967,296 Bytes',
    () => `Bytes = ${memStats.ramBytes.toLocaleString()} Bytes`
  );

  addTest(
    'TC-MEM-05',
    'Memory Management',
    'Memory utilization calculation',
    '4 allocated frames / 8,192 total virtual pages',
    'Allocation Ratio = 0.0488%',
    () => `Allocation Ratio = ${memStats.frameAllocationRatio}%`
  );

  // ==========================================
  // C. DISK SCHEDULING TEST CASES
  // ==========================================
  const diskResult = simulateDiskScheduling(TEAM_10_DEFAULTS.diskQueue, TEAM_10_DEFAULTS.initialHead, 'FCFS', TEAM_10_DEFAULTS.cylinderMax);

  addTest(
    'TC-DISK-01',
    'Disk Scheduling',
    'First request movement calculation',
    'Initial Head = 65, First Request = 25',
    'First Seek = |25 - 65| = 40 tracks',
    () => {
      const step1 = diskResult.trajectory[0];
      return `First Seek = |${step1.toCylinder} - ${step1.fromCylinder}| = ${step1.seekDistance} tracks`;
    }
  );

  addTest(
    'TC-DISK-02',
    'Disk Scheduling',
    'Consecutive request movements tracking',
    'Request Queue = [25, 105, 40, 115, 55, 90, 10, 120]',
    'Total Step Transitions = 8 steps',
    () => `Total Step Transitions = ${diskResult.trajectory.length} steps`
  );

  addTest(
    'TC-DISK-03',
    'Disk Scheduling',
    'Cylinder boundary values validation',
    'Min Cylinder = 0, Max Cylinder = 130',
    'Boundary Range = 0 to 130 cylinders',
    () => `Boundary Range = 0 to ${TEAM_10_DEFAULTS.cylinderMax} cylinders`
  );

  addTest(
    'TC-DISK-04',
    'Disk Scheduling',
    'Total seek calculation (FCFS baseline)',
    'Seek sum: 40 + 80 + 65 + 75 + 60 + 35 + 80 + 110',
    'Total Seek = 545 tracks',
    () => `Total Seek = ${diskResult.totalSeekDistance} tracks`
  );

  addTest(
    'TC-DISK-05',
    'Disk Scheduling',
    'Average seek calculation (Total Seek / N)',
    '545 tracks / 8 requests',
    'Average Seek = 68.13 tracks/request',
    () => `Average Seek = ${diskResult.avgSeekDistance} tracks/request`
  );

  return results;
}
