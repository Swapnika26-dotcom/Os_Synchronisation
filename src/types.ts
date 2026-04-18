export type AlgorithmType = 
  | 'mutex' 
  | 'semaphore' 
  | 'peterson' 
  | 'prodcons' 
  | 'dining' 
  | 'rw';

export type ProcessState = 'idle' | 'requesting' | 'waiting' | 'running' | 'finished';

export interface Process {
  id: number;
  state: ProcessState;
  color: string;
  waitTime: number;
  burstTime: number;
  remainingTime: number;
  progress: number;
  completedExecutions: number;
  targetExecutions: number;
}

export interface GanttEntry {
  processId: number;
  start: number;
  end: number;
  color: string;
}

export interface SimulationState {
  time: number;
  processes: Process[];
  queue: number[];
  criticalSection: number[];
  ganttData: GanttEntry[];
  logs: string[];
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
  speed: number;
  algorithm: AlgorithmType;
  stats: {
    totalWaitTime: number;
    completedCount: number;
    csEntries: number;
  };
}

export interface ConceptData {
  id: AlgorithmType;
  title: string;
  subtitle: string;
  description: string;
  pseudocode: string;
  properties: { label: string; value: string }[];
}
