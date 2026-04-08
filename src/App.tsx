import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Concepts } from './components/Concepts';
import { Simulator } from './components/Simulator';
import { Analytics } from './components/Analytics';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'concepts' | 'simulator' | 'analytics'>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <main className="container mx-auto px-4 pt-20 pb-12">
        {activeTab === 'home' && <Hero onStart={() => setActiveTab('simulator')} />}
        {activeTab === 'concepts' && <Concepts />}
        {activeTab === 'simulator' && <Simulator />}
        {activeTab === 'analytics' && <Analytics />}
      </main>

      <footer className="border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2026 SyncMaster - OS Process Synchronization Simulator</p>
          <p className="mt-2 font-mono text-xs">Designed for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
}
