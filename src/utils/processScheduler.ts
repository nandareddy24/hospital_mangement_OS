import type {
  Process,
  ProcessScheduleResult,
  GanttBlock,
  ProcessMetrics,
  ProcessExecutionStep,
  ExecutionInterval,
  WaitingInterval
} from '../types/os';

export function simulateRoundRobin(
  inputProcesses: Process[],
  timeQuantum: number = 4
): ProcessScheduleResult {
  const processes = [...inputProcesses].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const remainingBurst: Record<string, number> = {};
  const firstExecutionTime: Record<string, number> = {};
  const completionTime: Record<string, number> = {};
  const executionIntervalsMap: Record<string, ExecutionInterval[]> = {};
  const waitingIntervalsMap: Record<string, WaitingInterval[]> = {};

  const readyQueue: string[] = [];
  const ganttChart: GanttBlock[] = [];
  const steps: ProcessExecutionStep[] = [];

  processes.forEach(p => {
    remainingBurst[p.id] = p.burstTime;
    executionIntervalsMap[p.id] = [];
    waitingIntervalsMap[p.id] = [];
  });

  let currentTime = 0;
  let completedCount = 0;
  const totalProcesses = processes.length;
  const arrivedSet = new Set<string>();

  const checkArrivals = (time: number) => {
    processes.forEach(p => {
      if (p.arrivalTime <= time && !arrivedSet.has(p.id)) {
        readyQueue.push(p.id);
        arrivedSet.add(p.id);
      }
    });
  };

  checkArrivals(currentTime);

  let stepIdx = 0;

  steps.push({
    stepIndex: stepIdx++,
    time: currentTime,
    activeProcessId: null,
    activeProcessName: null,
    readyQueue: [...readyQueue],
    remainingBurstTimes: { ...remainingBurst },
    completedProcesses: [],
    ganttSoFar: [],
    description: `Simulation initialized at t=${currentTime}. Arriving processes: [${readyQueue.map(id => processes.find(p => p.id === id)?.name).join(', ')}]`
  });

  while (completedCount < totalProcesses) {
    if (readyQueue.length === 0) {
      const nextArrival = processes.find(p => !arrivedSet.has(p.id));
      if (nextArrival) {
        currentTime = nextArrival.arrivalTime;
        checkArrivals(currentTime);
        steps.push({
          stepIndex: stepIdx++,
          time: currentTime,
          activeProcessId: null,
          activeProcessName: null,
          readyQueue: [...readyQueue],
          remainingBurstTimes: { ...remainingBurst },
          completedProcesses: Object.keys(completionTime),
          ganttSoFar: [...ganttChart],
          description: `CPU was idle until t=${currentTime}. Process ${nextArrival.name} arrived.`
        });
      } else {
        break;
      }
    }

    const currentProcessId = readyQueue.shift()!;
    const currentProcess = processes.find(p => p.id === currentProcessId)!;

    if (!(currentProcessId in firstExecutionTime)) {
      firstExecutionTime[currentProcessId] = currentTime;
    }

    const executeTime = Math.min(remainingBurst[currentProcessId], timeQuantum);
    const startTime = currentTime;
    currentTime += executeTime;
    remainingBurst[currentProcessId] -= executeTime;

    // Record execution interval
    executionIntervalsMap[currentProcessId].push({ start: startTime, end: currentTime });

    // Record waiting interval for all other arrived and non-completed processes during startTime..currentTime
    processes.forEach(p => {
      if (p.id !== currentProcessId && p.arrivalTime <= startTime && !(p.id in completionTime)) {
        waitingIntervalsMap[p.id].push({
          start: startTime,
          end: currentTime,
          reason: `Waiting in ready queue while ${currentProcess.name} executed`
        });
      }
    });

    const lastGantt = ganttChart[ganttChart.length - 1];
    if (lastGantt && lastGantt.processId === currentProcessId) {
      lastGantt.endTime = currentTime;
    } else {
      ganttChart.push({
        processId: currentProcessId,
        processName: currentProcess.name,
        startTime,
        endTime: currentTime,
        color: currentProcess.color
      });
    }

    // Check newly arriving processes during execution interval startTime..currentTime
    processes.forEach(p => {
      if (p.arrivalTime > startTime && p.arrivalTime <= currentTime && !arrivedSet.has(p.id)) {
        readyQueue.push(p.id);
        arrivedSet.add(p.id);
      }
    });

    if (remainingBurst[currentProcessId] === 0) {
      completionTime[currentProcessId] = currentTime;
      completedCount++;
    } else {
      readyQueue.push(currentProcessId);
    }

    steps.push({
      stepIndex: stepIdx++,
      time: currentTime,
      activeProcessId: currentProcessId,
      activeProcessName: currentProcess.name,
      readyQueue: [...readyQueue],
      remainingBurstTimes: { ...remainingBurst },
      completedProcesses: Object.keys(completionTime),
      ganttSoFar: JSON.parse(JSON.stringify(ganttChart)),
      description: remainingBurst[currentProcessId] === 0
        ? `Process ${currentProcess.name} executed from t=${startTime} to t=${currentTime} and COMPLETED!`
        : `Process ${currentProcess.name} executed from t=${startTime} to t=${currentTime} (Quantum ${timeQuantum} expired, remaining: ${remainingBurst[currentProcessId]}). Re-queued at tail.`
    });
  }

  const metrics: ProcessMetrics[] = processes.map(p => {
    const ct = completionTime[p.id];
    const tat = ct - p.arrivalTime;
    const wt = tat - p.burstTime;
    const fet = firstExecutionTime[p.id] ?? p.arrivalTime;
    const rt = fet - p.arrivalTime;
    return {
      id: p.id,
      name: p.name,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      completionTime: ct,
      turnaroundTime: tat,
      waitingTime: wt,
      responseTime: rt,
      firstExecutionTime: fet,
      color: p.color,
      executionIntervals: executionIntervalsMap[p.id] || [],
      waitingIntervals: waitingIntervalsMap[p.id] || []
    };
  });

  const totalTat = metrics.reduce((sum, m) => sum + m.turnaroundTime, 0);
  const totalWt = metrics.reduce((sum, m) => sum + m.waitingTime, 0);
  const totalRt = metrics.reduce((sum, m) => sum + m.responseTime, 0);
  const totalBurst = processes.reduce((sum, p) => sum + p.burstTime, 0);
  const maxCompletionTime = Math.max(...metrics.map(m => m.completionTime));

  return {
    ganttChart,
    metrics,
    avgTurnaroundTime: Number((totalTat / totalProcesses).toFixed(2)),
    avgWaitingTime: Number((totalWt / totalProcesses).toFixed(2)),
    avgResponseTime: Number((totalRt / totalProcesses).toFixed(2)),
    cpuUtilization: Number(((totalBurst / maxCompletionTime) * 100).toFixed(2)),
    totalExecutionTime: maxCompletionTime,
    steps
  };
}

export function simulateFCFS(inputProcesses: Process[]): ProcessScheduleResult {
  const processes = [...inputProcesses].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;
  const ganttChart: GanttBlock[] = [];
  const metrics: ProcessMetrics[] = [];

  processes.forEach(p => {
    if (currentTime < p.arrivalTime) {
      currentTime = p.arrivalTime;
    }
    const startTime = currentTime;
    const fet = startTime;
    currentTime += p.burstTime;
    const ct = currentTime;
    const tat = ct - p.arrivalTime;
    const wt = tat - p.burstTime;
    const rt = fet - p.arrivalTime;

    ganttChart.push({
      processId: p.id,
      processName: p.name,
      startTime,
      endTime: ct,
      color: p.color
    });

    metrics.push({
      id: p.id,
      name: p.name,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      completionTime: ct,
      turnaroundTime: tat,
      waitingTime: wt,
      responseTime: rt,
      firstExecutionTime: fet,
      color: p.color,
      executionIntervals: [{ start: startTime, end: ct }],
      waitingIntervals: []
    });
  });

  const totalProcesses = processes.length;
  const totalTat = metrics.reduce((sum, m) => sum + m.turnaroundTime, 0);
  const totalWt = metrics.reduce((sum, m) => sum + m.waitingTime, 0);
  const totalRt = metrics.reduce((sum, m) => sum + m.responseTime, 0);
  const totalBurst = processes.reduce((sum, p) => sum + p.burstTime, 0);
  const maxCT = Math.max(...metrics.map(m => m.completionTime));

  return {
    ganttChart,
    metrics,
    avgTurnaroundTime: Number((totalTat / totalProcesses).toFixed(2)),
    avgWaitingTime: Number((totalWt / totalProcesses).toFixed(2)),
    avgResponseTime: Number((totalRt / totalProcesses).toFixed(2)),
    cpuUtilization: Number(((totalBurst / maxCT) * 100).toFixed(2)),
    totalExecutionTime: maxCT,
    steps: []
  };
}

export function simulateSJF(inputProcesses: Process[]): ProcessScheduleResult {
  const processes = inputProcesses.map(p => ({ ...p }));
  const completed: boolean[] = new Array(processes.length).fill(false);
  let currentTime = 0;
  let completedCount = 0;
  const ganttChart: GanttBlock[] = [];
  const metricsMap: Record<string, Partial<ProcessMetrics>> = {};

  while (completedCount < processes.length) {
    const available = processes.filter((p, idx) => p.arrivalTime <= currentTime && !completed[idx]);

    if (available.length === 0) {
      const nextArrival = Math.min(...processes.filter((_, idx) => !completed[idx]).map(p => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }

    available.sort((a, b) => a.burstTime - b.burstTime);
    const selected = available[0];
    const selectedIdx = processes.findIndex(p => p.id === selected.id);

    const startTime = currentTime;
    currentTime += selected.burstTime;
    const ct = currentTime;
    const tat = ct - selected.arrivalTime;
    const wt = tat - selected.burstTime;
    const rt = startTime - selected.arrivalTime;

    completed[selectedIdx] = true;
    completedCount++;

    ganttChart.push({
      processId: selected.id,
      processName: selected.name,
      startTime,
      endTime: ct,
      color: selected.color
    });

    metricsMap[selected.id] = {
      id: selected.id,
      name: selected.name,
      arrivalTime: selected.arrivalTime,
      burstTime: selected.burstTime,
      completionTime: ct,
      turnaroundTime: tat,
      waitingTime: wt,
      responseTime: rt,
      firstExecutionTime: startTime,
      color: selected.color,
      executionIntervals: [{ start: startTime, end: ct }],
      waitingIntervals: []
    };
  }

  const metrics = processes.map(p => metricsMap[p.id] as ProcessMetrics);
  const totalProcesses = processes.length;
  const totalTat = metrics.reduce((sum, m) => sum + m.turnaroundTime, 0);
  const totalWt = metrics.reduce((sum, m) => sum + m.waitingTime, 0);
  const totalRt = metrics.reduce((sum, m) => sum + m.responseTime, 0);
  const totalBurst = processes.reduce((sum, p) => sum + p.burstTime, 0);
  const maxCT = Math.max(...metrics.map(m => m.completionTime));

  return {
    ganttChart,
    metrics,
    avgTurnaroundTime: Number((totalTat / totalProcesses).toFixed(2)),
    avgWaitingTime: Number((totalWt / totalProcesses).toFixed(2)),
    avgResponseTime: Number((totalRt / totalProcesses).toFixed(2)),
    cpuUtilization: Number(((totalBurst / maxCT) * 100).toFixed(2)),
    totalExecutionTime: maxCT,
    steps: []
  };
}
