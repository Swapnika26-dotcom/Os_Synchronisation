import { 
  ShieldAlert, 
  Lock, 
  RotateCcw, 
  Hourglass, 
  Ban, 
  Trophy, 
  Layers, 
  Workflow 
} from 'lucide-react';

export interface TheoryConcept {
  id: string;
  title: string;
  description: string;
  icon: any;
  points: string[];
}

export const SYNCHRONIZATION_THEORY: TheoryConcept[] = [
  {
    id: 'race-condition',
    title: 'Race Condition',
    description: 'A situation where the outcome of a process depends on the specific order or timing of other uncontrollable events. It happens when multiple threads access shared data concurrently.',
    icon: ShieldAlert,
    points: [
      'Occurs in shared memory systems',
      'Leads to inconsistent data states',
      'Prevented using mutual exclusion'
    ]
  },
  {
    id: 'critical-section',
    title: 'Critical Section',
    description: 'A segment of code where a process accesses common variables, updates tables, or writes files. Only one process should execute in its critical section at any time.',
    icon: Lock,
    points: [
      'Mutual Exclusion: Only one process inside',
      'Progress: Decision to enter cannot be delayed indefinitely',
      'Bounded Waiting: Limit on number of times others enter before a waiting process'
    ]
  },
  {
    id: 'deadlock',
    title: 'Deadlock',
    description: 'A state where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.',
    icon: Ban,
    points: [
      'Mutual Exclusion',
      'Hold and Wait',
      'No Preemption',
      'Circular Wait'
    ]
  },
  {
    id: 'starvation',
    title: 'Starvation',
    description: 'A problem where a process is perpetually denied necessary resources to process its work. It often occurs in priority-based scheduling algorithms.',
    icon: Hourglass,
    points: [
      'Lower priority processes never execute',
      'Solved using "Aging" technique',
      'Resource management failure'
    ]
  },
  {
    id: 'monitors',
    title: 'Monitors',
    description: 'A high-level synchronization construct that provides a convenient and effective mechanism for process synchronization. It encapsulates shared variables and procedures.',
    icon: Layers,
    points: [
      'Implicit mutual exclusion',
      'Condition variables for signaling',
      'Simplified concurrency control'
    ]
  },
  {
    id: 'peterson-solution',
    title: 'Peterson\'s Solution',
    description: 'A classic software-based solution to the critical section problem for two processes. It uses shared flags and a turn variable.',
    icon: RotateCcw,
    points: [
      'Software-only solution',
      'Guarantees all three requirements',
      'Limited to two processes'
    ]
  },
  {
    id: 'bounded-waiting',
    title: 'Bounded Waiting',
    description: 'The requirement that there exists a bound on the number of times that other processes are allowed to enter their critical sections after a process has made a request.',
    icon: Trophy,
    points: [
      'Prevents starvation',
      'Ensures fairness',
      'Critical for real-time systems'
    ]
  },
  {
    id: 'inter-process',
    title: 'Inter-Process Communication',
    description: 'Mechanisms that allow processes to communicate and synchronize their actions, typically via shared memory or message passing.',
    icon: Workflow,
    points: [
      'Shared Memory (fast)',
      'Message Passing (robust)',
      'Semaphores as coordination agents'
    ]
  }
];
