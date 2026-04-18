import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  increment, 
  serverTimestamp,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDocFromServer
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const googleProvider = new GoogleAuthProvider();

// Connection Test (Required by constraints)
async function testConnection() {
  try {
    // Attempt a serve-side fetch to verify connectivity
    await getDocFromServer(doc(db, 'system', 'health'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase Connection Error: The client is offline. Please check your network or Firebase configuration.");
    }
  }
}
testConnection();

// Auth Helpers
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // New User
      const userData = {
        userId: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
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
      
      // Trigger Welcome Email via Backend API
      await fetch("/api/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, displayName: user.displayName })
      }).catch(err => console.error("Email trigger failed:", err));
    } else {
      // Returning User: Update lastActive
      await updateDoc(userRef, { lastActive: serverTimestamp() });
    }
    
    return user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// Growth & Stats Helpers
export const updateUserProgress = async (userId: string, points: number, type: "quiz" | "simulator" | "reading") => {
  try {
    const userRef = doc(db, "users", userId);
    
    // calculate rank
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();
    const newPoints = (data?.totalPoints || 0) + points;
    let newRank = "Novice";
    if (newPoints > 500) newRank = "Adept";
    if (newPoints > 1500) newRank = "Expert";
    if (newPoints > 5000) newRank = "Master";

    await updateDoc(userRef, {
      totalPoints: increment(points),
      rating: increment(points / 2),
      rank: newRank,
      lastActive: serverTimestamp()
    });

    // Log activity
    await addDoc(collection(db, "activity_logs"), {
      userId,
      pointsEarned: points,
      type,
      date: new Date().toISOString().split('T')[0],
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to update user progress:", error);
    // Don't throw, just log to prevent UI breakage
  }
};

export const saveQuizProgress = async (userId: string, index: number, score: number) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    currentQuizIndex: index,
    currentQuizScore: score
  });
};

export const getActivityLogs = async (userId: string) => {
  try {
    const q = query(
      collection(db, "activity_logs"),
      where("userId", "==", userId),
      limit(100)
    );
    const snap = await getDocs(q);
    // Sort client-side to avoid index requirements
    return snap.docs
      .map(d => d.data())
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error("Error fetching logs:", error);
    return [];
  }
};
