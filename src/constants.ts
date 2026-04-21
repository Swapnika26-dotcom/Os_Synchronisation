import { ConceptData } from "./types";

export const ALGORITHMS: ConceptData[] = [
  {
    id: 'mutex',
    title: 'Mutex Lock',
    subtitle: 'Mutual Exclusion Lock',
    description: 'A Mutex (Mutual Exclusion) lock is a synchronization primitive that ensures only one thread or process can access a critical section at a time. It has two states: locked and unlocked.',
    properties: [
      { label: 'TYPE', value: 'Binary Lock' },
      { label: 'OWNERSHIP', value: 'Thread-specific' },
      { label: 'OVERHEAD', value: 'Very Low' }
    ],
    pseudocode: `acquire(mutex):
  while (TestAndSet(mutex.locked)):
    sleep(currentThread)
  mutex.locked = true

release(mutex):
  mutex.locked = false
  if mutex.waitQueue not empty:
    next = mutex.waitQueue.dequeue()
    wakeup(next)`
  },
  {
    id: 'peterson',
    title: "Peterson's Algorithm",
    subtitle: 'Software-based Synchronization for 2 Processes',
    description: "Peterson's algorithm is a concurrent programming algorithm for mutual exclusion that allows two processes to share a single-use resource without conflict, using only shared memory for communication.",
    properties: [
      { label: 'PROCESSES', value: 'Exactly 2' },
      { label: 'TYPE', value: 'Software-based' },
      { label: 'FAIRNESS', value: 'Strictly Fair' }
    ],
    pseudocode: `// Process i
flag[i] = true;
turn = j;
while (flag[j] && turn == j);

// critical section

flag[i] = false;`
  },
  {
    id: 'semaphore',
    title: 'Semaphore',
    subtitle: 'Counting Synchronization Tool',
    description: 'A semaphore is an integer variable that is used for controlling access to a common resource by multiple processes in a concurrent system.',
    properties: [
      { label: 'TYPE', value: 'Counting' },
      { label: 'OPERATIONS', value: 'Wait / Signal' },
      { label: 'OVERHEAD', value: 'Low' }
    ],
    pseudocode: `wait(S):
  S.value--
  if S.value < 0:
    block(currentProcess)

signal(S):
  S.value++
  if S.value <= 0:
    wakeup(S.waitQueue.dequeue())`
  },
  {
    id: 'prodcons',
    title: 'Producer-Consumer',
    subtitle: 'Bounded Buffer Problem',
    description: 'The producer-consumer problem describes two processes, the producer and the consumer, who share a common, fixed-size buffer used as a queue.',
    properties: [
      { label: 'BUFFER', value: 'Bounded' },
      { label: 'SYNC', value: '3 Semaphores' },
      { label: 'TYPE', value: 'Data Flow' }
    ],
    pseudocode: `producer():
  wait(empty); wait(mutex)
  buffer[in] = item; in = (in+1)%N
  signal(mutex); signal(full)

consumer():
  wait(full); wait(mutex)
  item = buffer[out]; out = (out+1)%N
  signal(mutex); signal(empty)`
  },
  {
    id: 'dining',
    title: 'Dining Philosophers',
    subtitle: 'Resource Allocation Problem',
    description: 'Five philosophers sit at a table and spend their lives thinking and eating. They share five forks, and a philosopher needs two forks to eat.',
    properties: [
      { label: 'RESOURCES', value: 'Shared Forks' },
      { label: 'DEADLOCK', value: 'Possible' },
      { label: 'STARVATION', value: 'Possible' }
    ],
    pseudocode: `philosopher(i):
  think()
  wait(room)
  wait(fork[i])
  wait(fork[(i+1)%5])
  eat()
  signal(fork[i])
  signal(fork[(i+1)%5])
  signal(room)`
  },
  {
    id: 'rw',
    title: 'Readers-Writers',
    subtitle: 'Concurrent Access Control',
    description: 'The readers-writers problem deals with multiple processes wanting to read or write to a shared data structure simultaneously.',
    properties: [
      { label: 'READERS', value: 'Concurrent' },
      { label: 'WRITERS', value: 'Exclusive' },
      { label: 'PRIORITY', value: 'Configurable' }
    ],
    pseudocode: `reader():
  wait(mutex); readCount++
  if readCount==1: wait(db)
  signal(mutex); readDatabase()
  wait(mutex); readCount--
  if readCount==0: signal(db)
  signal(mutex)

writer():
  wait(db); writeDatabase(); signal(db)`
  }
];

export const COLORS = [
  '#FBC3C1', // primary pink/peach
  '#3b82f6', // blue
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#f97316', // orange
  '#ef4444', // red
];
