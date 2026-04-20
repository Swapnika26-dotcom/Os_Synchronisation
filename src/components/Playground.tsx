import { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal } from './Terminal';
import { 
  Code2, 
  Terminal as TerminalIcon, 
  Settings, 
  ChevronRight, 
  Variable,
  Box,
  Binary
} from 'lucide-react';
import { cn } from '../lib/utils';

type Language = 'c' | 'cpp' | 'python' | 'java';

export function Playground() {
  const [language, setLanguage] = useState<Language>('c');
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState<string[]>([]);

  const boilerplates: Record<Language, string> = {
    c: `#include <stdio.h>\n#include <pthread.h>\n#include <semaphore.h>\n\nsem_t mutex;\n\nvoid* thread_func(void* arg) {\n    sem_wait(&mutex);\n    printf("Critical section accessed by thread %d\\n", *(int*)arg);\n    sem_post(&mutex);\n    return NULL;\n}\n\nint main() {\n    sem_init(&mutex, 0, 1);\n    // Implementation here...\n    return 0;\n}`,
    cpp: `#include <iostream>\n#include <thread>\n#include <mutex>\n\nstd::mutex mtx;\n\nvoid print_block(int n, char c) {\n    std::lock_guard<std::mutex> locker(mtx);\n    for (int i=0; i<n; ++i) { std::cout << c; }\n    std::cout << '\\n';\n}\n\nint main() {\n    std::thread th1(print_block, 50, '*');\n    th1.join();\n    return 0;\n}`,
    python: `import threading\nimport time\n\n# Peterson's Algorithm Simulation\nflag = [False, False]\nturn = 0\n\ndef critical_section(i):\n    print(f"Process {i} entering critical section")\n    time.sleep(1)\n    print(f"Process {i} leaving critical section")\n\ndef process(i):\n    j = 1 - i\n    flag[i] = True\n    turn = j\n    while flag[j] and turn == j: pass\n    critical_section(i)\n    flag[i] = False\n\n# Running simulation...\nthreading.Thread(target=process, args=(0,)).start()`,
    java: `import java.util.concurrent.Semaphore;\n\npublic class SyncApp {\n    private static Semaphore sem = new Semaphore(1);\n\n    public static void main(String[] args) {\n        try {\n            sem.acquire();\n            System.out.println("Locked section");\n            sem.release();\n        } catch (InterruptedException e) {}\n    }\n}`
  };

  const handleRun = (code: string) => {
    setIsExecuting(true);
    setOutput([]);
    
    // Simulate execution steps
    setTimeout(() => {
      setOutput(prev => [...prev, `[system] Compiling ${language.toUpperCase()} source...`]);
      setTimeout(() => {
        setOutput(prev => [...prev, `[system] Execution started at ${new Date().toLocaleTimeString()}`]);
        setTimeout(() => {
          if (code.length < 20) {
            setOutput(prev => [...prev, `[error] Main entry point not found or code too short.`]);
          } else {
             setOutput(prev => [...prev, `[stdout] Process initialized successfully.`]);
             setOutput(prev => [...prev, `[stdout] Synchronization primitives allocated.`]);
             setOutput(prev => [...prev, `[stdout] Execution completed with status 0.`]);
          }
          setIsExecuting(false);
        }, 1000);
      }, 800);
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 lg:py-12 space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Code2 className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">OS Algorithm <span className="text-primary underline decoration-primary/30 decoration-4">Playground</span></h1>
            <p className="text-sm text-muted-foreground font-mono">Multilingual Synchronization Lab v2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-secondary/50 p-1.5 rounded-2xl border border-border">
          {(['c', 'cpp', 'python', 'java'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                language === lang 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-1 overflow-hidden shadow-xl">
             <Terminal 
              boilerplate={boilerplates[language]} 
              onRun={handleRun}
              isLoading={isExecuting}
             />
          </div>

          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-mono text-sm min-h-[200px]">
             <div className="flex items-center gap-2 mb-4 text-[10px] uppercase font-bold text-zinc-500 border-b border-zinc-900 pb-2">
                <TerminalIcon className="w-3 h-3" />
                Execution Output
             </div>
             <div className="space-y-1.5">
                {output.length === 0 && !isExecuting && (
                  <p className="text-zinc-600 italic">No execution data yet. Press 'Execute' to run your algorithm.</p>
                )}
                {output.map((line, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      line.includes('[error]') ? "text-red-400" : 
                      line.includes('[system]') ? "text-zinc-500" : 
                      "text-green-400"
                    )}
                  >
                    <span className="opacity-50 mr-2">$</span>
                    {line}
                  </motion.div>
                ))}
                {isExecuting && (
                  <div className="flex items-center gap-2 text-primary font-bold animate-pulse">
                     <span className="w-2 h-2 bg-primary rounded-full" />
                     Executing system threads...
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <div className="bg-card border border-border rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-black flex items-center gap-2">
                 <Settings className="w-5 h-5 text-primary" />
                 Simulation Engine
              </h3>

              <div className="space-y-4">
                 {[
                   { label: "Compiler", value: language === 'python' ? "CPython 3.11" : language === 'java' ? "OpenJDK 17" : "GCC 11.4", icon: Binary },
                   { label: "OS Environment", value: "POSIX Compliant Kernel", icon: Box },
                   { label: "IPC Mechanism", value: "System-V Semaphores", icon: Variable }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-secondary/50 rounded-2xl border border-border/50">
                      <div className="flex items-center gap-3">
                         <item.icon className="w-4 h-4 text-muted-foreground" />
                         <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-primary">{item.value}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 space-y-4">
              <h4 className="font-bold flex items-center gap-2 text-primary">
                 <Settings className="w-4 h-4" />
                 Quick Examples
              </h4>
              <ul className="space-y-3">
                 {[
                   "Dining Philosophers (C)",
                   "Reader-Writer Problem (Python)",
                   "Producer-Consumer (Java)",
                   "Peterson's Algorithm (C++)"
                 ].map((ex, i) => (
                   <li key={i} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary cursor-pointer transition-colors group">
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      {ex}
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
