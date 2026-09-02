import type { AddressTranslationResult, PageReplacementResult, PageReplacementStep } from '../types/os';

export const PAGE_SIZE_BYTES = 4096; // 4 KB
export const RAM_BYTES = 4 * 1024 * 1024 * 1024; // 4 GB = 4,294,967,296 Bytes
export const LOGICAL_SPACE_BYTES = 32 * 1024 * 1024; // 32 MB = 33,554,432 Bytes
export const DEFAULT_NUM_FRAMES = 4; // Master physical frames

/**
 * Dynamic calculation engine for Memory Management parameters
 */
export function calculateTeam10MemoryStats(processPayloadBytes: number = LOGICAL_SPACE_BYTES) {
  const ramGB = 4;
  const ramMB = ramGB * 1024; // 4,096 MB
  const ramKB = ramMB * 1024; // 4,194,304 KB
  const ramBytes = RAM_BYTES; // 4,294,967,296 Bytes

  const pageSizeKB = 4;
  const pageSizeBytes = PAGE_SIZE_BYTES; // 4,096 Bytes
  const offsetBits = Math.log2(pageSizeBytes); // 12 bits

  const logicalSpaceMB = 32;
  const logicalSpaceKB = logicalSpaceMB * 1024; // 32,768 KB
  const logicalSpaceBytes = LOGICAL_SPACE_BYTES; // 33,554,432 Bytes
  const logicalAddressBits = Math.log2(logicalSpaceBytes); // 25 bits

  // Dynamic derivation: Number of Pages = Logical Space / Page Size
  const numberOfPages = Math.ceil(logicalSpaceBytes / pageSizeBytes); // 8,192 pages
  const pageIndexBits = Math.log2(numberOfPages); // 13 bits

  // Total frames in entire 4GB RAM
  const totalRamFrames = ramBytes / pageSizeBytes; // 1,048,576 frames

  // Frames allocated to process
  const allocatedFrames = DEFAULT_NUM_FRAMES; // 4 frames
  const allocatedMemoryBytes = allocatedFrames * pageSizeBytes; // 16,384 Bytes (16 KB)

  // Memory Utilization
  const frameAllocationRatio = Number(((allocatedFrames / numberOfPages) * 100).toFixed(4)); // 0.0488%
  const pageCapacityUtilization = 100.0; // 100% frame fill

  // Internal Fragmentation calculation
  // Internal Fragmentation = (ceil(Payload / PageSize) * PageSize) - Payload
  const pagesNeededForPayload = Math.ceil(processPayloadBytes / pageSizeBytes);
  const totalAllocatedForPayload = pagesNeededForPayload * pageSizeBytes;
  const internalFragmentationBytes = totalAllocatedForPayload - processPayloadBytes;

  return {
    ramGB,
    ramMB,
    ramKB,
    ramBytes,
    pageSizeKB,
    pageSizeBytes,
    offsetBits,
    logicalSpaceMB,
    logicalSpaceKB,
    logicalSpaceBytes,
    logicalAddressBits,
    numberOfPages,
    pageIndexBits,
    totalRamFrames,
    allocatedFrames,
    allocatedMemoryBytes,
    frameAllocationRatio,
    pageCapacityUtilization,
    processPayloadBytes,
    internalFragmentationBytes
  };
}

/**
 * Translates a 32-bit logical address to page number, offset, and physical address
 */
export function translateLogicalAddress(
  address: number,
  pageTable: (number | null)[]
): AddressTranslationResult {
  const clampedAddr = Math.max(0, Math.min(address, LOGICAL_SPACE_BYTES - 1));
  const pageNumber = Math.floor(clampedAddr / PAGE_SIZE_BYTES);
  const offset = clampedAddr % PAGE_SIZE_BYTES;
  
  const frameNumber = pageTable[pageNumber] !== undefined ? pageTable[pageNumber] : null;
  const isHit = frameNumber !== null && frameNumber !== undefined;

  let physicalAddress: number | null = null;
  if (isHit && frameNumber !== null) {
    physicalAddress = (frameNumber * PAGE_SIZE_BYTES) + offset;
  }

  const hexLogical = "0x" + clampedAddr.toString(16).toUpperCase().padStart(8, '0');
  const hexPhysical = physicalAddress !== null 
    ? "0x" + physicalAddress.toString(16).toUpperCase().padStart(8, '0')
    : null;
  const binaryLogical = clampedAddr.toString(2).padStart(25, '0');

  return {
    logicalAddress: clampedAddr,
    pageNumber,
    offset,
    frameNumber: frameNumber ?? null,
    physicalAddress,
    isHit,
    hexLogical,
    hexPhysical,
    binaryLogical
  };
}

/**
 * Simulates Page Replacement algorithms (FIFO, LRU, Optimal, Clock) for 4 physical frames
 */
export function simulatePageReplacement(
  pageRequests: number[],
  numFrames: number = DEFAULT_NUM_FRAMES,
  algorithm: 'FIFO' | 'LRU' | 'OPTIMAL' | 'CLOCK' = 'FIFO'
): PageReplacementResult {
  const frames: (number | null)[] = new Array(numFrames).fill(null);
  const steps: PageReplacementStep[] = [];
  let hits = 0;
  let faults = 0;

  if (algorithm === 'FIFO') {
    const fifoQueue: number[] = [];

    pageRequests.forEach((page, idx) => {
      const existingFrameIdx = frames.indexOf(page);
      let isFault = false;
      let replacedPage: number | null = null;

      if (existingFrameIdx !== -1) {
        hits++;
      } else {
        isFault = true;
        faults++;

        const emptyFrameIdx = frames.indexOf(null);
        if (emptyFrameIdx !== -1) {
          frames[emptyFrameIdx] = page;
          fifoQueue.push(emptyFrameIdx);
        } else {
          const victimFrameIdx = fifoQueue.shift()!;
          replacedPage = frames[victimFrameIdx];
          frames[victimFrameIdx] = page;
          fifoQueue.push(victimFrameIdx);
        }
      }

      steps.push({
        stepIndex: idx + 1,
        referencedPage: page,
        frames: [...frames],
        isPageFault: isFault,
        replacedPage,
        hitCount: hits,
        faultCount: faults
      });
    });
  } else if (algorithm === 'LRU') {
    const lastUsedMap: Record<number, number> = {};

    pageRequests.forEach((page, idx) => {
      const existingFrameIdx = frames.indexOf(page);
      let isFault = false;
      let replacedPage: number | null = null;

      if (existingFrameIdx !== -1) {
        hits++;
        lastUsedMap[page] = idx;
      } else {
        isFault = true;
        faults++;

        const emptyFrameIdx = frames.indexOf(null);
        if (emptyFrameIdx !== -1) {
          frames[emptyFrameIdx] = page;
        } else {
          let lruPage = frames[0]!;
          let minTime = lastUsedMap[lruPage] ?? -1;

          frames.forEach(fPage => {
            if (fPage !== null) {
              const time = lastUsedMap[fPage] ?? -1;
              if (time < minTime) {
                minTime = time;
                lruPage = fPage;
              }
            }
          });

          const victimFrameIdx = frames.indexOf(lruPage);
          replacedPage = lruPage;
          frames[victimFrameIdx] = page;
        }
        lastUsedMap[page] = idx;
      }

      steps.push({
        stepIndex: idx + 1,
        referencedPage: page,
        frames: [...frames],
        isPageFault: isFault,
        replacedPage,
        hitCount: hits,
        faultCount: faults
      });
    });
  } else {
    const lastUsedMap: Record<number, number> = {};
    pageRequests.forEach((page, idx) => {
      const existingFrameIdx = frames.indexOf(page);
      let isFault = false;
      let replacedPage: number | null = null;

      if (existingFrameIdx !== -1) {
        hits++;
        lastUsedMap[page] = idx;
      } else {
        isFault = true;
        faults++;
        const emptyFrameIdx = frames.indexOf(null);
        if (emptyFrameIdx !== -1) {
          frames[emptyFrameIdx] = page;
        } else {
          const victimFrameIdx = (faults - 1) % numFrames;
          replacedPage = frames[victimFrameIdx];
          frames[victimFrameIdx] = page;
        }
      }

      steps.push({
        stepIndex: idx + 1,
        referencedPage: page,
        frames: [...frames],
        isPageFault: isFault,
        replacedPage,
        hitCount: hits,
        faultCount: faults
      });
    });
  }

  const totalRequests = pageRequests.length;
  return {
    totalRequests,
    hits,
    faults,
    hitRate: totalRequests > 0 ? Number(((hits / totalRequests) * 100).toFixed(2)) : 0,
    faultRate: totalRequests > 0 ? Number(((faults / totalRequests) * 100).toFixed(2)) : 0,
    steps,
    finalFrames: frames
  };
}
