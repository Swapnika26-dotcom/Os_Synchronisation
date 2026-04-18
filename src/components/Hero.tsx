import { motion } from 'motion/react';
import { Play, ArrowRight, Shield, Zap, Layers } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onExplore: () => void;
}

export function Hero({ onStart, onExplore }: HeroProps) {
  return (
    <div className="relative overflow-hidden py-12 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary/10),transparent)]" />
      
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-6">
            Operating Systems Education
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Master <span className="text-primary">Process Synchronization</span> with Visual Learning
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            An interactive platform to explore, simulate, and analyze classic synchronization algorithms. 
            From Mutexes to Peterson's Algorithm, visualize the core of concurrent computing.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              <Play className="w-5 h-5 fill-current" />
              Launch Simulator
            </button>
            <button
              onClick={onExplore}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-bold text-lg hover:bg-accent transition-all"
            >
              Explore Concepts
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left"
        >
          {[
            {
              icon: Shield,
              title: "Mutual Exclusion",
              desc: "Ensure that only one process can access a critical section at any given time."
            },
            {
              icon: Zap,
              title: "Real-time Simulation",
              desc: "Watch processes transition between states and compete for resources in real-time."
            },
            {
              icon: Layers,
              title: "Performance Analytics",
              desc: "Compare algorithms based on throughput, wait times, and resource utilization."
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
