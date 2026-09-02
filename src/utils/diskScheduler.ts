import type { DiskScheduleResult, DiskTrajectoryStep } from '../types/os';

export function simulateDiskScheduling(
  queue: number[],
  initialHead: number = 65,
  algorithm: 'FCFS' | 'SSTF' | 'SCAN' | 'C-SCAN' | 'LOOK' | 'C-LOOK' = 'FCFS',
  cylinderMax: number = 130
): DiskScheduleResult {
  const trajectory: DiskTrajectoryStep[] = [];
  let currentHead = initialHead;
  let cumulativeSeek = 0;
  const sequence: number[] = [initialHead];
  const pendingQueue = [...queue];
  const visitedQueue: number[] = [];

  if (algorithm === 'FCFS') {
    pendingQueue.forEach((req, idx) => {
      const seek = Math.abs(req - currentHead);
      cumulativeSeek += seek;
      sequence.push(req);
      visitedQueue.push(req);

      trajectory.push({
        stepIndex: idx + 1,
        fromCylinder: currentHead,
        toCylinder: req,
        seekDistance: seek,
        cumulativeSeek,
        remainingQueue: pendingQueue.slice(idx + 1),
        visitedQueue: [...visitedQueue],
        lmsOperation: `FCFS seek from cylinder ${currentHead} to ${req} (Distance: |${req} - ${currentHead}| = ${seek})`
      });

      currentHead = req;
    });
  } else if (algorithm === 'SSTF') {
    const remaining = [...queue];
    let stepCount = 1;

    while (remaining.length > 0) {
      let closestIdx = 0;
      let minDistance = Math.abs(remaining[0] - currentHead);

      for (let i = 1; i < remaining.length; i++) {
        const dist = Math.abs(remaining[i] - currentHead);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      }

      const nextCylinder = remaining[closestIdx];
      const seek = minDistance;
      cumulativeSeek += seek;
      sequence.push(nextCylinder);
      visitedQueue.push(nextCylinder);
      remaining.splice(closestIdx, 1);

      trajectory.push({
        stepIndex: stepCount++,
        fromCylinder: currentHead,
        toCylinder: nextCylinder,
        seekDistance: seek,
        cumulativeSeek,
        remainingQueue: [...remaining],
        visitedQueue: [...visitedQueue],
        lmsOperation: `SSTF selected cylinder ${nextCylinder} (Distance: |${nextCylinder} - ${currentHead}| = ${seek})`
      });

      currentHead = nextCylinder;
    }
  } else if (algorithm === 'SCAN') {
    const remaining = [...queue].sort((a, b) => a - b);
    const right = remaining.filter(c => c >= currentHead);
    const left = remaining.filter(c => c < currentHead).reverse();

    let stepCount = 1;

    right.forEach(req => {
      const seek = Math.abs(req - currentHead);
      cumulativeSeek += seek;
      sequence.push(req);
      visitedQueue.push(req);
      trajectory.push({
        stepIndex: stepCount++,
        fromCylinder: currentHead,
        toCylinder: req,
        seekDistance: seek,
        cumulativeSeek,
        remainingQueue: [...right.slice(right.indexOf(req) + 1), ...left],
        visitedQueue: [...visitedQueue],
        lmsOperation: `SCAN forward seek to ${req}`
      });
      currentHead = req;
    });

    if (left.length > 0) {
      if (currentHead !== cylinderMax) {
        const seekBoundary = Math.abs(cylinderMax - currentHead);
        cumulativeSeek += seekBoundary;
        sequence.push(cylinderMax);
        trajectory.push({
          stepIndex: stepCount++,
          fromCylinder: currentHead,
          toCylinder: cylinderMax,
          seekDistance: seekBoundary,
          cumulativeSeek,
          remainingQueue: [...left],
          visitedQueue: [...visitedQueue],
          lmsOperation: `SCAN hit boundary cylinder ${cylinderMax}`
        });
        currentHead = cylinderMax;
      }

      left.forEach(req => {
        const seek = Math.abs(req - currentHead);
        cumulativeSeek += seek;
        sequence.push(req);
        visitedQueue.push(req);
        trajectory.push({
          stepIndex: stepCount++,
          fromCylinder: currentHead,
          toCylinder: req,
          seekDistance: seek,
          cumulativeSeek,
          remainingQueue: left.slice(left.indexOf(req) + 1),
          visitedQueue: [...visitedQueue],
          lmsOperation: `SCAN reverse seek to ${req}`
        });
        currentHead = req;
      });
    }
  } else if (algorithm === 'C-SCAN') {
    const remaining = [...queue].sort((a, b) => a - b);
    const right = remaining.filter(c => c >= currentHead);
    const left = remaining.filter(c => c < currentHead);

    let stepCount = 1;

    right.forEach(req => {
      const seek = Math.abs(req - currentHead);
      cumulativeSeek += seek;
      sequence.push(req);
      visitedQueue.push(req);
      trajectory.push({
        stepIndex: stepCount++,
        fromCylinder: currentHead,
        toCylinder: req,
        seekDistance: seek,
        cumulativeSeek,
        remainingQueue: [...right.slice(right.indexOf(req) + 1), ...left],
        visitedQueue: [...visitedQueue],
        lmsOperation: `C-SCAN forward seek to ${req}`
      });
      currentHead = req;
    });

    if (left.length > 0) {
      if (currentHead !== cylinderMax) {
        const seekBoundary = Math.abs(cylinderMax - currentHead);
        cumulativeSeek += seekBoundary;
        sequence.push(cylinderMax);
        trajectory.push({
          stepIndex: stepCount++,
          fromCylinder: currentHead,
          toCylinder: cylinderMax,
          seekDistance: seekBoundary,
          cumulativeSeek,
          remainingQueue: [...left],
          visitedQueue: [...visitedQueue],
          lmsOperation: `C-SCAN boundary seek to ${cylinderMax}`
        });
        currentHead = cylinderMax;
      }

      // Jump to cylinder 0
      const jumpSeek = cylinderMax;
      cumulativeSeek += jumpSeek;
      sequence.push(0);
      trajectory.push({
        stepIndex: stepCount++,
        fromCylinder: currentHead,
        toCylinder: 0,
        seekDistance: jumpSeek,
        cumulativeSeek,
        remainingQueue: [...left],
        visitedQueue: [...visitedQueue],
        lmsOperation: `C-SCAN circular return jump to cylinder 0`
      });
      currentHead = 0;

      left.forEach(req => {
        const seek = Math.abs(req - currentHead);
        cumulativeSeek += seek;
        sequence.push(req);
        visitedQueue.push(req);
        trajectory.push({
          stepIndex: stepCount++,
          fromCylinder: currentHead,
          toCylinder: req,
          seekDistance: seek,
          cumulativeSeek,
          remainingQueue: left.slice(left.indexOf(req) + 1),
          visitedQueue: [...visitedQueue],
          lmsOperation: `C-SCAN resume forward seek to ${req}`
        });
        currentHead = req;
      });
    }
  } else if (algorithm === 'LOOK') {
    const remaining = [...queue].sort((a, b) => a - b);
    const right = remaining.filter(c => c >= currentHead);
    const left = remaining.filter(c => c < currentHead).reverse();

    let stepCount = 1;

    right.forEach(req => {
      const seek = Math.abs(req - currentHead);
      cumulativeSeek += seek;
      sequence.push(req);
      visitedQueue.push(req);
      trajectory.push({
        stepIndex: stepCount++,
        fromCylinder: currentHead,
        toCylinder: req,
        seekDistance: seek,
        cumulativeSeek,
        remainingQueue: [...right.slice(right.indexOf(req) + 1), ...left],
        visitedQueue: [...visitedQueue],
        lmsOperation: `LOOK forward seek to ${req}`
      });
      currentHead = req;
    });

    left.forEach(req => {
      const seek = Math.abs(req - currentHead);
      cumulativeSeek += seek;
      sequence.push(req);
      visitedQueue.push(req);
      trajectory.push({
        stepIndex: stepCount++,
        fromCylinder: currentHead,
        toCylinder: req,
        seekDistance: seek,
        cumulativeSeek,
        remainingQueue: left.slice(left.indexOf(req) + 1),
        visitedQueue: [...visitedQueue],
        lmsOperation: `LOOK reverse seek to ${req}`
      });
      currentHead = req;
    });
  } else if (algorithm === 'C-LOOK') {
    const remaining = [...queue].sort((a, b) => a - b);
    const right = remaining.filter(c => c >= currentHead);
    const left = remaining.filter(c => c < currentHead);

    let stepCount = 1;

    right.forEach(req => {
      const seek = Math.abs(req - currentHead);
      cumulativeSeek += seek;
      sequence.push(req);
      visitedQueue.push(req);
      trajectory.push({
        stepIndex: stepCount++,
        fromCylinder: currentHead,
        toCylinder: req,
        seekDistance: seek,
        cumulativeSeek,
        remainingQueue: [...right.slice(right.indexOf(req) + 1), ...left],
        visitedQueue: [...visitedQueue],
        lmsOperation: `C-LOOK forward seek to ${req}`
      });
      currentHead = req;
    });

    if (left.length > 0) {
      const firstLeft = left[0];
      const jumpSeek = Math.abs(currentHead - firstLeft);
      cumulativeSeek += jumpSeek;
      sequence.push(firstLeft);
      visitedQueue.push(firstLeft);
      trajectory.push({
        stepIndex: stepCount++,
        fromCylinder: currentHead,
        toCylinder: firstLeft,
        seekDistance: jumpSeek,
        cumulativeSeek,
        remainingQueue: left.slice(1),
        visitedQueue: [...visitedQueue],
        lmsOperation: `C-LOOK circular return jump to lowest request ${firstLeft}`
      });
      currentHead = firstLeft;

      left.slice(1).forEach(req => {
        const seek = Math.abs(req - currentHead);
        cumulativeSeek += seek;
        sequence.push(req);
        visitedQueue.push(req);
        trajectory.push({
          stepIndex: stepCount++,
          fromCylinder: currentHead,
          toCylinder: req,
          seekDistance: seek,
          cumulativeSeek,
          remainingQueue: left.slice(left.indexOf(req) + 1),
          visitedQueue: [...visitedQueue],
          lmsOperation: `C-LOOK resume forward seek to ${req}`
        });
        currentHead = req;
      });
    }
  }

  const avgSeekDistance = queue.length > 0 
    ? Number((cumulativeSeek / queue.length).toFixed(2))
    : 0;

  return {
    algorithm,
    sequence,
    trajectory,
    totalSeekDistance: cumulativeSeek,
    avgSeekDistance
  };
}
