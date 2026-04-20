import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Concepts } from './components/Concepts';
import { Simulator } from './components/Simulator';
import { Analytics } from './components/Analytics';
import { Quiz } from './components/Quiz';
import { Playground } from './components/Playground';
import { cn } from './lib/utils';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './services/firebase';
import { Login } from './components/Login';
import { Profile } from './components/Profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'concepts' | 'simulator' | 'playground' | 'analytics' | 'quiz' | 'profile'>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (loading) return (
    <div className={cn("min-h-screen flex items-center justify-center bg-background", theme ==='dark' ? 'dark' : '')}>
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) {
    return (
      <div className={cn("min-h-screen bg-background text-foreground transition-colors duration-300", theme ==='dark' ? 'dark' : '')}>
        <Login onLogin={() => {}} />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-primary selection:text-primary-foreground", theme ==='dark' ? 'dark' : '')}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <main className="container mx-auto px-4 pt-20 pb-12">
        {activeTab === 'home' && (
          <Hero 
            onStart={() => setActiveTab('simulator')} 
            onExplore={() => setActiveTab('concepts')} 
          />
        )}
        {activeTab === 'concepts' && <Concepts />}
        {activeTab === 'simulator' && <Simulator />}
        {activeTab === 'playground' && <Playground />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'quiz' && <Quiz />}
        {activeTab === 'profile' && <Profile />}
      </main>

      <footer className="border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2026 SyncMaster - OS Process Synchronization Simulator</p>
          <p className="mt-2 text-xs">
            Built by <span className="font-bold text-foreground">swapnikakrishnajakka</span> and guided by <span className="font-bold text-foreground">dr rajulu</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
