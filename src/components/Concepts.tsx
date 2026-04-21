import { useState } from 'react';
import { ALGORITHMS } from '../constants';
import { SYNCHRONIZATION_THEORY } from '../data/theoryData';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Code2, Info, CheckCircle2, BookOpen } from 'lucide-react';

export function Concepts() {
  const [selectedId, setSelectedId] = useState(ALGORITHMS[0].id);
  const selected = ALGORITHMS.find(a => a.id === selectedId)!;

  return (
    <div className="space-y-12 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-4 mb-4 flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            Algorithms
          </h2>
          {ALGORITHMS.map((algo) => (
            <button
              key={algo.id}
              onClick={() => setSelectedId(algo.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group",
                selectedId === algo.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="font-semibold">{algo.title}</span>
              {selectedId === algo.id && <CheckCircle2 className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="bg-card border border-border rounded-3xl p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                      {selected.title}
                    </h1>
                    <p className="text-primary font-medium">{selected.subtitle}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selected.properties.map((prop, i) => (
                      <div key={i} className="px-3 py-1 bg-secondary rounded-lg border border-border">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block leading-none mb-1">
                          {prop.label}
                        </span>
                        <span className="text-xs font-bold">{prop.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Info className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Description</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {selected.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-secondary/50 rounded-2xl border border-border">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase mb-4">Key Insights</h4>
                      <ul className="space-y-3">
                        {[
                          "Prevents race conditions in shared memory.",
                          "Ensures progress and bounded waiting.",
                          "Critical for multi-threaded application stability."
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Code2 className="w-5 h-5 text-primary" />
                      <h3 className="font-bold">Pseudocode</h3>
                    </div>
                    <div className="bg-slate-950 rounded-2xl p-6 overflow-x-auto border border-slate-800 shadow-xl">
                      <pre className="text-slate-300 font-mono text-xs sm:text-sm leading-relaxed">
                        <code>{selected.pseudocode}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Theory Section */}
      <div className="pt-12 border-t border-border">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-black tracking-tight mb-4">Synchronization <span className="text-primary italic">Fundamentals</span></h2>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Master the core concepts that form the backbone of concurrent computing and process coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SYNCHRONIZATION_THEORY.map((concept, i) => (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-3xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-all group"
            >
              <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                <concept.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-3">{concept.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {concept.description}
              </p>
              <ul className="space-y-2">
                {concept.points.map((point, pi) => (
                  <li key={pi} className="flex items-start gap-2 text-[11px] font-medium text-muted-foreground/80">
                    <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
