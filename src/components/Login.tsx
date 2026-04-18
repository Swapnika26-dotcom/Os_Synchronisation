import { motion } from 'motion/react';
import { LogIn, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { loginWithGoogle } from '../services/firebase';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      onLogin();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,theme(colors.primary/5),transparent)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl space-y-10"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-primary/20 rotate-3">
             <ShieldCheck className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Sync<span className="text-muted-foreground">Master</span></h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px] mx-auto">
            Your high-performance synchronization learning environment.
          </p>
        </div>

        <div className="space-y-4">
           {[
             { icon: Sparkles, text: "Personalized Learning Path" },
             { icon: Zap, text: "Real-time Progress Tracking" },
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-2xl border border-border/50">
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{item.text}</span>
             </div>
           ))}
        </div>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-5 rounded-[1.5rem] font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
        >
          <LogIn className="w-6 h-6" />
          Continue with Google
        </button>

        <p className="text-center text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
          Secure Academic Authentication
        </p>
      </motion.div>
    </div>
  );
}
