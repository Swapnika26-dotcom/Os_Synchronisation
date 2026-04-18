import { 
  Sun, 
  Moon, 
  Cpu, 
  BookOpen, 
  Play, 
  BarChart3, 
  HelpCircle,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export function Navbar({ activeTab, setActiveTab, theme, toggleTheme }: NavbarProps) {
  const [user] = useAuthState(auth);
  
  const tabs = [
    { id: 'home', label: 'Home', icon: Cpu },
    { id: 'concepts', label: 'Concepts', icon: BookOpen },
    { id: 'simulator', label: 'Simulator', icon: Play },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform">
            <Cpu className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            Sync<span className="text-primary italic">Master</span>
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-4 bg-secondary/30 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden md:block">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-2 pr-2 border-r border-border mr-2 hidden sm:flex">
               <img 
                 src={user.photoURL || ''} 
                 alt="User" 
                 className="w-8 h-8 rounded-full border border-primary/20 cursor-pointer"
                 onClick={() => setActiveTab('profile')}
                 referrerPolicy="no-referrer"
               />
               <button 
                 onClick={() => auth.signOut()}
                 className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                 title="Logout"
               >
                 <LogOut className="w-4 h-4" />
               </button>
            </div>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-secondary border border-border hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
