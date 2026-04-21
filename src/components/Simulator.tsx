import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings2, 
  Activity, 
  History,
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { AlgorithmType, SimulationState, Process } from '../types';
import { COLORS, ALGORITHMS } from '../constants';

export function Simulator() {
  const [algo, setAlgo] = useState<AlgorithmType>('mutex');
  const [processCount, setProcessCount] = useState(4);
  const [burstTime, setBurstTime] = useState(3);
  const [speed, setSpeed] = useState(1);
  const [targetExecs, setTargetExecs] = useState(1);
  
  const [state, setState] = useState<SimulationState>({
    time: 0,
    processes: [],
    queue: [],
    criticalSection: [],
    ganttData: [],
    logs: ['Simulation initialized.'],
    isRunning: false,
    isPaused: false,
    isFinished: false,
    speed: 1,
    algorithm: 'mutex',
    stats: {
      totalWaitTime: 0,
      completedCount: 0,
      csEntries: 0
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initProcesses = useCallback(() => {
    const count = algo === 'peterson' ? 2 : processCount;
    const newProcesses: Process[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      state: 'idle',
      color: COLORS[i % COLORS.length],
      waitTime: 0,
      burstTime: burstTime + (Math.random() * 2 - 1),
      remainingTime: 0,
      progress: 0,
      completedExecutions: 0,
      targetExecutions: targetExecs
    }));

    setState(prev => ({
      ...prev,
      time: 0,
      processes: newProcesses,
      queue: [],
      criticalSection: [],
      ganttData: [],
      logs: [`Initialized ${algo} simulation with ${count} processes. Each will execute ${targetExecs} time(s).`],
      isRunning: false,
      isPaused: false,
      isFinished: false,
      algorithm: algo,
      stats: {
        totalWaitTime: 0,
        completedCount: 0,
        csEntries: 0
      }
    }));
  }, [algo, processCount, burstTime, targetExecs]);

  useEffect(() => {
    initProcesses();
  }, [initProcesses]);

  const addLog = (msg: string) => {
    setState(prev => ({
      ...prev,
      logs: [msg, ...prev.logs].slice(0, 50)
    }));
  };

  const tick = useCallback(() => {
    setState(prev => {
      if (prev.isPaused || !prev.isRunning) return prev;

      const nextTime = prev.time + (0.1 * speed);
      let nextProcesses = [...prev.processes];
      let nextQueue = [...prev.queue];
      let nextCS = [...prev.criticalSection];
      let nextGantt = [...prev.ganttData];
      let nextStats = { ...prev.stats };
      let logs = [...prev.logs];

      // Check if finished
      const allFinished = nextProcesses.every(p => p.state === 'finished');
      if (allFinished) {
        return { ...prev, isRunning: false, isFinished: true };
      }

      // 1. Update existing processes
      nextProcesses = nextProcesses.map(p => {
        if (p.state === 'waiting') {
          return { ...p, waitTime: p.waitTime + 0.1 };
        }
        if (p.state === 'running') {
          const newRemaining = Math.max(0, p.remainingTime - 0.1);
          const progress = ((p.burstTime - newRemaining) / p.burstTime) * 100;
          return { ...p, remainingTime: newRemaining, progress };
        }
        return p;
      });

      // 2. Handle state transitions
      nextProcesses = nextProcesses.map(p => {
        if (p.state === 'idle' && p.completedExecutions < p.targetExecutions) {
          // Add small delay or probabilistic request
          if (Math.random() < 0.05) {
            nextQueue.push(p.id);
            return { ...p, state: 'requesting' };
          }
        }
        if (p.state === 'requesting') {
          return { ...p, state: 'waiting' };
        }
        return p;
      });

      // 3. Algorithm Logic
      const canEnterCS = () => {
        if (prev.algorithm === 'mutex' || prev.algorithm === 'peterson') {
          return nextCS.length === 0;
        }
        if (prev.algorithm === 'semaphore') {
          return nextCS.length < 2; 
        }
        return nextCS.length === 0;
      };

      if (nextQueue.length > 0 && canEnterCS()) {
        const nextId = nextQueue[0];
        nextQueue.shift();
        nextCS.push(nextId);
        
        const proc = nextProcesses.find(p => p.id === nextId);
        if (proc) {
          nextGantt.push({
            processId: nextId,
            start: prev.time,
            end: prev.time, // updated on finish
            color: proc.color
          });
        }

        nextProcesses = nextProcesses.map(p => 
          p.id === nextId ? { ...p, state: 'running', remainingTime: p.burstTime, progress: 0 } : p
        );
        nextStats.csEntries++;
      }

      // 4. Handle completion
      const finishedIds: number[] = [];
      nextProcesses = nextProcesses.map(p => {
        if (p.state === 'running' && p.remainingTime <= 0) {
          finishedIds.push(p.id);
          const nextCompleted = p.completedExecutions + 1;
          
          // Update gantt entry
          const lastEntryIdx = nextGantt.length - 1 - [...nextGantt].reverse().findIndex(e => e.processId === p.id);
          if (lastEntryIdx !== -1) {
            nextGantt[lastEntryIdx] = { ...nextGantt[lastEntryIdx], end: prev.time };
          }

          if (nextCompleted >= p.targetExecutions) {
            return { ...p, state: 'finished', completedExecutions: nextCompleted, progress: 0 };
          }
          return { ...p, state: 'idle', completedExecutions: nextCompleted, progress: 0, burstTime: burstTime + (Math.random() * 2 - 1) };
        }
        return p;
      });

      if (finishedIds.length > 0) {
        nextCS = nextCS.filter(id => !finishedIds.includes(id));
        nextStats.completedCount += finishedIds.length;
      }

      const trulyFinished = nextProcesses.every(p => p.state === 'finished');

      return {
        ...prev,
        time: nextTime,
        processes: nextProcesses,
        queue: nextQueue,
        criticalSection: nextCS,
        ganttData: nextGantt,
        stats: nextStats,
        logs: trulyFinished ? ["Simulation sequence completed.", ...logs].slice(0, 50) : logs,
        isRunning: !trulyFinished,
        isFinished: trulyFinished
      };
    });
  }, [speed, burstTime]);

  useEffect(() => {
    if (state.isRunning && !state.isPaused) {
      timerRef.current = setInterval(tick, 100 / speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isRunning, state.isPaused, speed, tick]);

  const toggleStart = () => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning, isPaused: false }));
    addLog(state.isRunning ? "Simulation stopped." : "Simulation started.");
  };

  const togglePause = () => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    addLog(state.isPaused ? "Simulation resumed." : "Simulation paused.");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 py-6">
      {/* Sidebar Controls */}
      <div className="xl:col-span-3 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Settings2 className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Configuration</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-muted-foreground uppercase">Algorithm</label>
              <select 
                value={algo}
                onChange={(e) => setAlgo(e.target.value as AlgorithmType)}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="mutex">Mutex Lock</option>
                <option value="peterson">Peterson's Algorithm</option>
                <option value="semaphore">Counting Semaphore</option>
                <option value="prodcons">Producer-Consumer</option>
                <option value="dining">Dining Philosophers</option>
                <option value="rw">Readers-Writers</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase">Processes</label>
                <span className="text-xs font-bold">{algo === 'peterson' ? 2 : processCount}</span>
              </div>
              <input 
                type="range" min="2" max="8" 
                disabled={algo === 'peterson'}
                value={algo === 'peterson' ? 2 : processCount}
                onChange={(e) => setProcessCount(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase">Burst Time</label>
                <span className="text-xs font-bold">{burstTime}s</span>
              </div>
              <input 
                type="range" min="1" max="10" 
                value={burstTime}
                onChange={(e) => setBurstTime(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase">Target Executions</label>
                <span className="text-xs font-bold">{targetExecs}</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                value={targetExecs}
                onChange={(e) => setTargetExecs(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase">Speed</label>
                <span className="text-xs font-bold">{speed}x</span>
              </div>
              <input 
                type="range" min="0.5" max="5" step="0.5"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="pt-4 grid grid-cols-2 gap-3">
              <button
                onClick={toggleStart}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all",
                  state.isRunning 
                    ? "bg-destructive text-destructive-foreground" 
                    : "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                )}
              >
                {state.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                {state.isRunning ? "Stop" : "Start"}
              </button>
              <button
                onClick={initProcesses}
                className="flex items-center justify-center gap-2 py-3 bg-secondary text-secondary-foreground border border-border rounded-xl font-bold text-sm hover:bg-accent transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Real-time Stats</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-secondary rounded-xl">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Time</span>
              <span className="text-lg font-mono font-bold">{state.time.toFixed(1)}s</span>
            </div>
            <div className="p-3 bg-secondary rounded-xl">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">CS Entries</span>
              <span className="text-lg font-mono font-bold">{state.stats.csEntries}</span>
            </div>
            <div className="p-3 bg-secondary rounded-xl">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Queue</span>
              <span className="text-lg font-mono font-bold">{state.queue.length}</span>
            </div>
            <div className="p-3 bg-secondary rounded-xl">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Completed</span>
              <span className="text-lg font-mono font-bold">{state.stats.completedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="xl:col-span-6 space-y-6">
        <div className="bg-card border border-border rounded-3xl p-8 min-h-[500px] flex flex-col relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/10">
            <motion.div 
              className="h-full bg-primary"
              animate={{ width: state.isRunning ? '100%' : '0%' }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="flex items-center justify-between mb-12">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", state.isRunning ? "bg-green-500 animate-pulse" : "bg-muted")} />
              Live Visualization
            </h2>
            <div className="flex gap-4 text-xs font-bold text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-muted" /> Idle
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-500" /> Waiting
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500" /> Running
              </div>
            </div>
          </div>

          {/* Visual Canvas */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Critical Section Ring */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-dashed border-border flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse" />
              <div className="text-center z-10">
                <div className="w-16 h-16 bg-background border-2 border-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl">
                  <Shield className={cn("w-8 h-8", state.criticalSection.length > 0 ? "text-green-500" : "text-primary")} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Critical Section</span>
                <div className="mt-2 flex justify-center gap-2">
                  {state.criticalSection.map(id => (
                    <motion.div
                      key={id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-full border-2 border-background shadow-lg flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: state.processes.find(p => p.id === id)?.color }}
                    >
                      P{id}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Processes Orbiting */}
              {state.processes.map((p, i) => {
                const angle = (i / state.processes.length) * 2 * Math.PI;
                const radius = 160; // Orbit radius
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                const isWaiting = p.state === 'waiting' || p.state === 'requesting';
                const isRunning = p.state === 'running';

                return (
                  <motion.div
                    key={p.id}
                    className="absolute w-16 h-16 z-20"
                    animate={{
                      x: isRunning ? 0 : x,
                      y: isRunning ? -40 : y,
                      scale: isRunning ? 1.2 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  >
                    <div className="relative group">
                      <div 
                        className={cn(
                          "w-12 h-12 rounded-2xl border-2 border-background shadow-xl flex items-center justify-center text-white font-bold transition-all duration-300",
                          p.state === 'finished' ? "opacity-50 grayscale" : (isRunning && "ring-4 ring-green-500/30"),
                          isWaiting && "ring-4 ring-amber-500/30"
                        )}
                        style={{ backgroundColor: p.color }}
                      >
                        P{p.id}
                      </div>
                      
                      {/* Progress Ring for Running */}
                      {isRunning && (
                        <svg className="absolute -inset-2 w-16 h-16 -rotate-90">
                          <circle
                            cx="32" cy="32" r="28"
                            fill="none" stroke="currentColor" strokeWidth="3"
                            className="text-green-500/20"
                          />
                          <motion.circle
                            cx="32" cy="32" r="28"
                            fill="none" stroke="currentColor" strokeWidth="3"
                            strokeDasharray="175.9"
                            animate={{ strokeDashoffset: 175.9 * (1 - p.progress / 100) }}
                            className="text-green-500"
                          />
                        </svg>
                      )}

                      {/* State Badge */}
                      <div className={cn(
                        "absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[8px] font-bold uppercase whitespace-nowrap",
                        isRunning ? "bg-green-500 text-white" : 
                        isWaiting ? "bg-amber-500 text-white" : 
                        p.state === 'finished' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {p.state}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Final Gantt Chart Summary below the visualization */}
        <AnimatePresence>
          {state.isFinished && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-8 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Simulation Results</h2>
                  <p className="text-sm text-muted-foreground">Execution summary for {state.algorithm}</p>
                </div>
                <button 
                  onClick={initProcesses}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  Restart Simulation
                </button>
              </div>
              
              <div className="overflow-x-auto pr-2 custom-scrollbar">
                <div className="min-w-[600px] space-y-4">
                  {state.processes.map(p => {
                    const pEntries = state.ganttData.filter(e => e.processId === p.id);
                    return (
                      <div key={p.id} className="relative h-14 flex items-center">
                        <div className="w-20 pr-4 flex items-center gap-2 sticky left-0 z-10 bg-card">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg" style={{ backgroundColor: p.color }}>
                            P{p.id}
                          </div>
                        </div>
                        
                        <div className="flex-1 h-10 bg-secondary/30 rounded-xl relative overflow-hidden border border-border/50">
                           {/* Grid Lines */}
                           {Array.from({ length: 11 }).map((_, i) => (
                             <div key={i} className="absolute h-full w-px bg-border/20" style={{ left: `${i * 10}%` }} />
                           ))}
                           
                           {pEntries.map((entry, idx) => {
                             const left = (entry.start / state.time) * 100;
                             const width = ((entry.end - entry.start) / state.time) * 100;
                             return (
                               <motion.div
                                 key={idx}
                                 initial={{ width: 0 }}
                                 animate={{ width: `${width}%` }}
                                 className="absolute h-8 top-1 rounded-lg shadow-sm flex items-center justify-center overflow-hidden hover:brightness-110 transition-all border border-white/20"
                                 style={{ 
                                   left: `${left}%`, 
                                   backgroundColor: p.color,
                                   minWidth: '4px' 
                                 }}
                               >
                                  <span className="text-[9px] font-bold text-white px-1 whitespace-nowrap drop-shadow-md">
                                      {(entry.end - entry.start).toFixed(1)}s
                                  </span>
                               </motion.div>
                             );
                           })}
                        </div>
                      </div>
                    )
                  })}

                  <div className="flex pt-6 ml-20 border-t border-border mt-4">
                    {Array.from({ length: 11 }).map((_, i) => (
                      <div key={i} className="flex-1 text-[10px] font-mono text-muted-foreground relative">
                        <div className="absolute left-0 -top-1 w-px h-3 bg-border" />
                        <span className="-ml-4">{(i * state.time / 10).toFixed(1)}s</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  <div className="p-4 bg-secondary/50 rounded-2xl border border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Total Wait Time</span>
                      <span className="text-xl font-bold">{(state.processes.reduce((acc, p) => acc + p.waitTime, 0)).toFixed(1)}s</span>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-2xl border border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Avg Waiting</span>
                      <span className="text-xl font-bold">{(state.processes.reduce((acc, p) => acc + p.waitTime, 0) / state.processes.length).toFixed(2)}s</span>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-2xl border border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Utilization</span>
                      <span className="text-xl font-bold">{(state.ganttData.reduce((acc, e) => acc + (e.end - e.start), 0) / state.time * 100 / (state.algorithm === 'semaphore' ? 2 : 1)).toFixed(1)}%</span>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-2xl border border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Throughput</span>
                      <span className="text-xl font-bold">{(state.stats.completedCount / state.time).toFixed(2)}/s</span>
                  </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logs & Queue */}
      <div className="xl:col-span-3 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-[300px] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Execution Log</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {state.logs.map((log, i) => (
              <div key={i} className="text-xs font-mono py-1 border-b border-border/50 text-muted-foreground">
                <span className="text-primary opacity-50 mr-2">[{i}]</span>
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex-1">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Wait Queue</h2>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {state.queue.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-xs font-medium">Queue is empty</p>
                </div>
              ) : (
                state.queue.map((id, index) => {
                  const p = state.processes.find(proc => proc.id === id);
                  return (
                    <motion.div
                      key={`${id}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-3 p-3 bg-secondary rounded-xl border border-border"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: p?.color }}>
                        P{id}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold">Waiting...</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{p?.waitTime.toFixed(1)}s</span>
                        </div>
                        <div className="w-full h-1 bg-muted rounded-full mt-1 overflow-hidden">
                          <motion.div 
                            className="h-full bg-amber-500"
                            animate={{ width: '100%' }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
