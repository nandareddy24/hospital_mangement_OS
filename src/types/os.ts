export interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  color: string;
  lmsAction?: string;
}

export interface ExecutionInterval {
  start: number;
  end: number;
}

export interface WaitingInterval {
  start: number;
  end: number;
  reason: string;
}

export interface ProcessMetrics {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  responseTime: number;
  firstExecutionTime: number;
  color: string;
  executionIntervals: ExecutionInterval[];
  waitingIntervals: WaitingInterval[];
}

export interface GanttBlock {
  processId: string;
  processName: string;
  startTime: number;
  endTime: number;
  color: string;
}

export interface ProcessExecutionStep {
  stepIndex: number;
  time: number;
  activeProcessId: string | null;
  activeProcessName: string | null;
  readyQueue: string[];
  remainingBurstTimes: Record<string, number>;
  completedProcesses: string[];
  ganttSoFar: GanttBlock[];
  description: string;
}

export interface ProcessScheduleResult {
  ganttChart: GanttBlock[];
  metrics: ProcessMetrics[];
  avgTurnaroundTime: number;
  avgWaitingTime: number;
  avgResponseTime: number;
  cpuUtilization: number;
  totalExecutionTime: number;
  steps: ProcessExecutionStep[];
}

export interface MemoryConfig {
  ramBytes: number;
  pageSizeBytes: number;
  processLogicalSpaceBytes: number;
  numFrames: number;
}

export interface AddressTranslationResult {
  logicalAddress: number;
  pageNumber: number;
  offset: number;
  frameNumber: number | null;
  physicalAddress: number | null;
  isHit: boolean;
  hexLogical: string;
  hexPhysical: string | null;
  binaryLogical: string;
}

export interface PageReplacementStep {
  stepIndex: number;
  referencedPage: number;
  frames: (number | null)[];
  isPageFault: boolean;
  replacedPage: number | null;
  hitCount: number;
  faultCount: number;
  lmsReason?: string;
}

export interface PageReplacementResult {
  totalRequests: number;
  hits: number;
  faults: number;
  hitRate: number;
  faultRate: number;
  steps: PageReplacementStep[];
  finalFrames: (number | null)[];
}

export interface DiskConfig {
  cylinderRange: [number, number];
  initialHead: number;
  requestQueue: number[];
}

export interface DiskTrajectoryStep {
  stepIndex: number;
  fromCylinder: number;
  toCylinder: number;
  seekDistance: number;
  cumulativeSeek: number;
  remainingQueue: number[];
  visitedQueue: number[];
  lmsOperation?: string;
}

export interface DiskScheduleResult {
  algorithm: string;
  sequence: number[];
  trajectory: DiskTrajectoryStep[];
  totalSeekDistance: number;
  avgSeekDistance: number;
}

export interface LMSBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  quantity: number;
  availableCopies: number;
  status: 'Available' | 'Out of Stock' | 'Partially Issued';
  rackLocation: number;
  memoryPage: number;
  processBurst: number;
  coverColor?: string;
}

export interface LMSMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipStatus: 'Active' | 'Inactive' | 'Suspended';
  role: 'Student' | 'Faculty' | 'Researcher';
  department: string;
  booksBorrowedCount?: number;
}

export interface LMSTransaction {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Issued' | 'Returned' | 'Overdue';
  overdueDays: number;
  fineAmount: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  module: 'LMS' | 'PROCESS' | 'MEMORY' | 'DISK';
  action: string;
  details: string;
  status: 'success' | 'info' | 'warning' | 'alert';
}

export interface Team10Parameters {
  teamName: string;
  processes: { id: string; name: string; arrivalTime: number; burstTime: number; color: string }[];
  timeQuantum: number;
  ramGB: number;
  pageSizeKB: number;
  logicalSpaceMB: number;
  numFrames: number;
  cylinderMin: number;
  cylinderMax: number;
  initialHead: number;
  diskQueue: number[];
}
