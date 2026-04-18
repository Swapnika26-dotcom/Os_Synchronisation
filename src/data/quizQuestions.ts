export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
  type?: 'multiple-choice' | 'programming';
  boilerplate?: string;
  expectedOutput?: string;
  hint?: string;
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the primary purpose of process synchronization?",
    options: ["To prevent memory fragmentation", "To ensure orderly execution of cooperating processes", "To speed up CPU clock cycles", "To increase disk I/O speed"],
    answer: 1
  },
  {
    id: 2,
    question: "Which of the following describes a 'race condition'?",
    options: ["Two processes competing for the user's attention", "When the outcome of execution depends on the sequence or timing of other uncontrollable events", "A process that executes faster than others", "A system-wide crash due to high load"],
    answer: 1
  },
  {
    id: 3,
    question: "The part of the code where shared memory is accessed is called...",
    options: ["Safe Zone", "Isolation Block", "Critical Section", "Atomic Phase"],
    answer: 2
  },
  {
    id: 4,
    question: "Mutual exclusion can be defined as...",
    options: ["If a process is executing in its critical section, no other processes can be executing in their critical sections", "All processes must execute at the same time", "Each process has its own CPU", "Processes cannot access memory at all"],
    answer: 0
  },
  {
    id: 5,
    question: "Peterson's algorithm is typically used for how many processes?",
    options: ["Any number of processes", "Only one process", "Exactly two processes", "Exactly three processes"],
    answer: 2
  },
  {
    id: 6,
    question: "What does the 'TestAndSet' instruction do?",
    options: ["Tests a value and sets it to true atomically", "Deletes a block of memory", "Compares two strings", "Increases the priority of a process"],
    answer: 0
  },
  {
    id: 7,
    question: "A semaphore is basically an...",
    options: ["Array of characters", "Integer variable", "Boolean flag", "Float variable"],
    answer: 1
  },
  {
    id: 8,
    question: "The 'wait' operation in a semaphore is also known as...",
    options: ["V operation", "S operation", "P operation", "W operation"],
    answer: 2
  },
  {
    id: 9,
    question: "The 'signal' operation in a semaphore is also known as...",
    options: ["P operation", "V operation", "A operation", "S operation"],
    answer: 1
  },
  {
    id: 10,
    question: "A binary semaphore can take values...",
    options: ["0 and 1 only", "Any integer", "Any negative number", "0 through 10"],
    answer: 0
  },
  {
    id: 11,
    question: "Which synchronization problem involves a fixed-size buffer shared by two processes?",
    options: ["Dining Philosophers", "Readers-Writers", "Producer-Consumer", "Deadlock Prevention"],
    answer: 2
  },
  {
    id: 12,
    question: "In the Producer-Consumer problem, what happens if the buffer is full?",
    options: ["The producer is terminated", "The producer must wait until a slot is empty", "The consumer must stop", "The data is overwritten"],
    answer: 1
  },
  {
    id: 13,
    question: "The Dining Philosophers problem mainly illustrates...",
    options: ["The need for more memory", "Resource allocation and deadlock", "Inter-process communication speed", "Network protocols"],
    answer: 1
  },
  {
    id: 14,
    question: "How many forks are required for one philosopher to eat in a 5-philosopher setup?",
    options: ["1 fork", "2 forks", "5 forks", "0 forks"],
    answer: 1
  },
  {
    id: 15,
    question: "In the Readers-Writers problem, multiple ___ can read at the same time.",
    options: ["Writers", "Terminals", "Readers", "Systems"],
    answer: 2
  },
  {
    id: 16,
    question: "In the Readers-Writers problem, if a writer is active...",
    options: ["Multiple readers can read", "Another writer can write", "No other readers or writers can access the file", "The system must restart"],
    answer: 2
  },
  {
    id: 17,
    question: "What is a 'Monitor' in OS?",
    options: ["A hardware screen", "A high-level abstraction for synchronization", "A process that tracks CPU usage", "A software for security"],
    answer: 1
  },
  {
    id: 18,
    question: "What is 'Deadlock'?",
    options: ["A system that is powered off", "A set of processes waiting for events that only other processes in the set can cause", "A single process taking up 100% CPU", "A memory leak"],
    answer: 1
  },
  {
    id: 19,
    question: "Which of these is NOT a condition for a deadlock?",
    options: ["Mutual Exclusion", "Circular Wait", "No Preemption", "Strict Order"],
    answer: 3
  },
  {
    id: 20,
    question: "The 'Banker's Algorithm' is used for deadlock...",
    options: ["Detection", "Prevention", "Avoidance", "Recovery"],
    answer: 2
  },
  {
    id: 21,
    question: "A 'Counting Semaphore' is initialized to...",
    options: ["The number of available resources", "Zero always", "One always", "A negative number"],
    answer: 0
  },
  {
    id: 22,
    question: "What is the 'Hold and Wait' condition for deadlock?",
    options: ["A process holds a resource while waiting for another", "A process is terminated while holding a resource", "Processes must check in every 5 seconds", "Resources are forcedly taken"],
    answer: 0
  },
  {
    id: 23,
    question: "The condition 'No Preemption' means...",
    options: ["Processes cannot be interrupted", "Resources cannot be taken from a process holding them", "The CPU never switches tasks", "Users cannot end tasks"],
    answer: 1
  },
  {
    id: 24,
    question: "What is 'Starvation' in process management?",
    options: ["A process running out of memory", "A process being indefinitely delayed because others are prioritized", "A process using too much memory", "A slow internet connection"],
    answer: 1
  },
  {
    id: 25,
    question: "A high-level synchronization construct that includes only one active process at a time...",
    options: ["Mutex", "Monitor", "Semaphore", "Spinlock"],
    answer: 1
  },
  {
    id: 26,
    question: "What is an 'Atomic Operation'?",
    options: ["Operation that takes 1 second", "Operation that happens as a single indivisible unit", "Operation involving physics", "A complex multi-step process"],
    answer: 1
  },
  {
    id: 27,
    question: "In Peterson's algorithm, what does the 'turn' variable indicate?",
    options: ["Whose turn it is to wait", "Whose turn it is to enter the critical section", "How many cycles have passed", "The process ID"],
    answer: 1
  },
  {
    id: 28,
    question: "Which of these is a hardware-based solution for synchronization?",
    options: ["Peterson's Algorithm", "Mutex", "TestAndSet instruction", "Monitor"],
    answer: 2
  },
  {
    id: 29,
    question: "A semaphore value becoming negative usually means...",
    options: ["An error occurred", "System crash", "Number of processes blocked on it", "Resource is free"],
    answer: 2
  },
  {
    id: 30,
    question: "In the Readers-Writers problem, which prioritization leads to writer starvation?",
    options: ["Reader Priority", "Writer Priority", "Equal Priority", "Random Priority"],
    answer: 0
  },
  {
    id: 31,
    question: "The Bounded-Buffer problem is also known as...",
    options: ["Producer-Consumer", "Readers-Writers", "Dining Philosophers", "Sleeping Barber"],
    answer: 0
  },
  {
    id: 32,
    question: "A spinlock is called 'spin' because...",
    options: ["It rotates the CPU", "The process 'spins' in a while-loop checking the lock", "It makes the disk spin faster", "It switches memory pages"],
    answer: 1
  },
  {
    id: 33,
    question: "Which is a major disadvantage of spinlocks?",
    options: ["They are hard to code", "They waste CPU cycles (Busy waiting)", "They use too much RAM", "They only work on Windows"],
    answer: 1
  },
  {
    id: 34,
    question: "Deadlock prevention involves...",
    options: ["Using more CPUs", "Ensuring at least one Coffman condition cannot hold", "Giving up on synchronization", "Ignoring the problem"],
    answer: 1
  },
  {
    id: 35,
    question: "Resource-allocation graphs are used to...",
    options: ["Speed up processes", "Detect deadlocks", "Manage users", "Organize files"],
    answer: 1
  },
  {
    id: 36,
    question: "The 'Safe State' in Banker's algorithm means...",
    options: ["The system can allocate resources to all processes in some order without deadlock", "The CPU is below 50% usage", "Security is enabled", "All processes are completed"],
    answer: 0
  },
  {
    id: 37,
    question: "If a system is in an unsafe state, does it mean deadlock HAS occurred?",
    options: ["Yes, always", "No, but it may lead to deadlock", "Only on Linux", "Only on single-core systems"],
    answer: 1
  },
  {
    id: 38,
    question: "Livelock is different from deadlock because...",
    options: ["Processes are still running but making no progress", "Processes are completely frozen", "The power is cut off", "Memory is empty"],
    answer: 0
  },
  {
    id: 39,
    question: "A mutex lock is a ___ object.",
    options: ["Shared", "Synchronized", "Binary", "Priority"],
    answer: 2
  },
  {
    id: 40,
    question: "Wait() and Signal() operations must be performed...",
    options: ["Independently", "At certain times", "Atomically", "Slowly"],
    answer: 2
  },
  {
    id: 41,
    question: "Condition variables are often used within...",
    options: ["Mutexes", "Monitors", "Arrays", "Files"],
    answer: 1
  },
  {
    id: 42,
    question: "In the context of synchronization, 'Strict Alternation' can lead to...",
    options: ["Fast execution", "Better memory usage", "Waste of resources if one process is much slower", "No synchronization errors ever"],
    answer: 2
  },
  {
    id: 43,
    question: "The 'Critical Section Problem' solutions must satisfy which 3 requirements?",
    options: ["Speed, Size, Safety", "Mutual Exclusion, Progress, Bounded Waiting", "Memory, Disk, CPU", "User, Root, System"],
    answer: 1
  },
  {
    id: 44,
    question: "Progress requirement means...",
    options: ["Processes must be fast", "Only processes not in remainder section decide who enters critical section next", "Percentage of completion must show", "Memory must increase"],
    answer: 1
  },
  {
    id: 45,
    question: "Bounded Waiting ensures that...",
    options: ["A process will eventually enter its critical section (no starvation)", "Memory is bounded", "CPU speed is capped", "The system shuts down after 1 hour"],
    answer: 0
  },
  {
    id: 46,
    question: "Inter-process Communication (IPC) requires synchronization when...",
    options: ["Sharing data", "Sending emails", "Printing files", "Installing apps"],
    answer: 0
  },
  {
    id: 47,
    question: "What is a 'Critical Region'?",
    options: ["The same as critical section", "A system error", "A special hardware device", "A type of memory"],
    answer: 0
  },
  {
    id: 48,
    question: "In a 'Non-preemptive' kernel, race conditions on kernel data...",
    options: ["Are rampant", "Are largely avoided because only one process executes in kernel mode", "Only happen at night", "Require a restart"],
    answer: 1
  },
  {
    id: 49,
    question: "Which data structure is often used to manage a semaphore's wait queue?",
    options: ["Stack", "Queue (FIFO)", "Tree", "Graph"],
    answer: 1
  },
  {
    id: 50,
    question: "Priority Inversion occurs when...",
    options: ["Low priority process holds a resource a high priority process needs", "High priority process is deleted", "Memory is full", "Users logout"],
    answer: 0
  },
  {
    id: 51,
    question: "To solve Priority Inversion, one can use...",
    options: ["Priority Inheritance Protocol", "More RAM", "A faster disk", "A new OS"],
    answer: 0
  },
  {
    id: 52,
    question: "Which algorithm can allocate resources to processes efficiently?",
    options: ["First Fit", "Banker's Algorithm", "Round Robin", "LRU"],
    answer: 1
  },
  {
    id: 53,
    question: "What happens in a circular wait condition?",
    options: ["All processes finish", "A chain of processes exists such that each holds a resource requested by next", "Memory is cleared", "The user waits forever"],
    answer: 1
  },
  {
    id: 54,
    question: "In readers-writers, the writer must wait until...",
    options: ["All readers have finished", "Another writer starts", "10 seconds pass", "Memory is empty"],
    answer: 0
  },
  {
    id: 55,
    question: "Counting semaphores are more general than binary semaphores.",
    options: ["True", "False"],
    answer: 0
  },
  {
    id: 56,
    question: "Complete the pseudocode for Peterson's Algorithm Entry Section. (Enter exact missing line)",
    options: [],
    answer: 0,
    type: "programming",
    boilerplate: "// Entry Section for Process i\nflag[i] = true;\nturn = j;\nwhile (flag[j] && turn == j) {\n  // What goes here for busy wait?\n}",
    expectedOutput: "// empty"
  },
  {
    id: 57,
    question: "Implement the 'signal' (V) operation for a binary semaphore named 'mutex'.",
    options: [],
    answer: 0,
    type: "programming",
    boilerplate: "void signal(Semaphore mutex) {\n  // Write logic to release mutex\n}",
    expectedOutput: "mutex = 1"
  }
];
