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
}

export interface SimulationState {
  time: number;
  processes: Process[];
  queue: number[];
  criticalSection: number[];
  logs: string[];
  isRunning: boolean;
  isPaused: boolean;
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
