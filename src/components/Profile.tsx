import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { auth, db, getActivityLogs } from '../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  Flame, 
  BadgeCheck,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Profile() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      try {
        const userRef = doc(db, "users", user.uid);
        let userDataResult;
        
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            userDataResult = userDoc.data();
            setProfile(userDataResult);
          } else {
            // AUTO-CREATE PROFILE IF MISSING
            const userData = {
              userId: user.uid,
              displayName: user.displayName || 'Learner',
              email: user.email || '',
              photoURL: user.photoURL || '',
              totalPoints: 0,
              rank: "Novice",
              rating: 1000,
              streak: 0,
              currentQuizIndex: 0,
              currentQuizScore: 0,
              lastActive: serverTimestamp(),
              createdAt: serverTimestamp()
            };
            await setDoc(userRef, userData);
            userDataResult = userData;
            setProfile(userDataResult);
          }
        } catch (getSetError: any) {
          console.error("Profile Document Error (Get/Set):", getSetError.message);
          throw getSetError;
        }
        
        try {
          const activity = await getActivityLogs(user.uid);
          setLogs(activity);
        } catch (logError: any) {
          console.error("Profile Logs Error:", logError.message);
          // Don't throw for log errors, just continue
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-bold animate-pulse text-muted-foreground">Synchronizing Data...</p>
    </div>
  );

  if (!profile) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4 text-center">
       <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 opacity-20" />
       </div>
       <h3 className="text-xl font-bold">Profile Not Found</h3>
       <p className="text-muted-foreground text-sm max-w-xs">There was an issue retrieving your learning profile. Try refreshing the page.</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 lg:py-12 space-y-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-8 items-center bg-card border border-border rounded-[3rem] p-10 shadow-sm">
        <div className="relative">
          <img 
            src={user?.photoURL || ''} 
            alt={profile.displayName} 
            className="w-32 h-32 rounded-[2rem] border-4 border-background shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-xl shadow-lg">
             <Trophy className="w-6 h-6" />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
           <h1 className="text-4xl font-black tracking-tight">{profile.displayName}</h1>
           <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">
                {profile.rank}
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-bold border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-current" />
                Rating: {profile.rating}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-xs font-bold border border-red-500/20">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {profile.streak} Day Streak
              </div>
           </div>
           <p className="text-muted-foreground text-sm max-w-md">
             Active learner since {profile.createdAt?.seconds 
                ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() 
                : new Date().toLocaleDateString()}
           </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
           <div className="p-6 bg-secondary rounded-[1.5rem] border border-border text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Total Points</span>
              <span className="text-3xl font-black text-primary">{profile.totalPoints}</span>
           </div>
           <div className="p-6 bg-secondary rounded-[1.5rem] border border-border text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Rank Points</span>
              <span className="text-3xl font-black text-primary">#{Math.floor(profile.totalPoints / 10)}</span>
           </div>
        </div>
      </div>

      {/* Growth Graph */}
      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-card border border-border rounded-[3rem] p-10 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-2xl font-black tracking-tight">Growth Trend</h2>
                  <p className="text-sm text-muted-foreground">Detailed activity points over time</p>
               </div>
               <TrendingUp className="w-8 h-8 text-primary opacity-20" />
            </div>

            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={logs}>
                  <defs>
                    <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={10} 
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={10} 
                    tick={{ fill: 'var(--muted-foreground)' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)', 
                      borderRadius: '16px',
                      fontSize: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pointsEarned" 
                    stroke="var(--primary)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorPoints)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
               <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <Target className="w-5 h-5 text-primary" />
                 Milestones
               </h3>
               <div className="space-y-4">
                  {[
                    { label: "Synchronization Novice", value: 100, current: profile.totalPoints, icon: BadgeCheck },
                    { label: "Expert Logic Solver", value: 1000, current: profile.totalPoints, icon: BadgeCheck },
                    { label: "Master Protocol Architect", value: 5000, current: profile.totalPoints, icon: BadgeCheck },
                  ].map((m, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-xs font-bold">
                          <span className={cn(m.current >= m.value ? "text-primary" : "text-muted-foreground")}>{m.label}</span>
                          <span className="text-muted-foreground">{Math.min(100, (m.current / m.value) * 100).toFixed(0)}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (m.current / m.value) * 100)}%` }}
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-primary text-primary-foreground rounded-[2rem] p-8 shadow-xl shadow-primary/20 relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                 <h3 className="text-lg font-black tracking-tight">Growth Formula</h3>
                 <p className="text-xs opacity-80 leading-relaxed">
                   Your Rating and Rank are calculated based on quiz accuracy, simulator target completions, and daily learning streaks.
                 </p>
                 <div className="flex items-center gap-4 pt-2">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                       <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold">Rise up through consistent practice!</span>
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            </div>
         </div>
      </div>
    </div>
  );
}
