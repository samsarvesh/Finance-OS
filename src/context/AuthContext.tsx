import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  age?: number | string;
  gender?: string;
  occupation?: string;
  experienceLevel?: string;
  financialGoal?: string;
  city?: string;
  phone?: string;
  completedLessons: Record<string, string[]>;
  quizHistory: Record<string, string[]>;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  markLessonComplete: (courseTitle: string, lessonTitle: string) => Promise<void>;
  recordQuizSolved: (topic: string, questionId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync with Firestore when user is authenticated
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);

        // Listen in real-time to user profile document
        const unsubscribeDoc = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Check if there is existing localStorage progress to migrate
            let existingLessons: Record<string, string[]> = {};
            let existingQuiz: Record<string, string[]> = {};
            try {
              const savedL = localStorage.getItem('af_completed_lessons');
              if (savedL) existingLessons = JSON.parse(savedL);
              const savedQ = localStorage.getItem('quiz_history');
              if (savedQ) existingQuiz = JSON.parse(savedQ);
            } catch (e) {
              console.error(e);
            }

            const initialProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
              photoURL: currentUser.photoURL,
              completedLessons: existingLessons,
              quizHistory: existingQuiz,
              updatedAt: new Date().toISOString(),
            };

            await setDoc(userDocRef, initialProfile, { merge: true });
            setProfile(initialProfile);
          }
          setLoading(false);
        }, (error) => {
          console.error('Error fetching user profile:', error);
          setLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error('Email Sign In Error:', err);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && res.user) {
        await updateProfile(res.user, { displayName: name });
      }
    } catch (err: any) {
      console.error('Email Sign Up Error:', err);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user is currently signed in.');

    // 1. Update Firebase Auth displayName if changed
    if (data.displayName && data.displayName !== user.displayName) {
      await updateProfile(user, { displayName: data.displayName });
    }

    // 2. Persist profile fields in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const rawData: Record<string, any> = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    // Remove any undefined keys so Firestore setDoc never encounters unsupported undefined values
    const sanitizedData: Record<string, any> = {};
    Object.keys(rawData).forEach((key) => {
      if (rawData[key] !== undefined) {
        sanitizedData[key] = rawData[key];
      }
    });

    await setDoc(userDocRef, sanitizedData, { merge: true });

    // 3. Immediately reflect in state
    setProfile((prev) => (prev ? { ...prev, ...sanitizedData } : null));
  };

  const markLessonComplete = async (courseTitle: string, lessonTitle: string) => {
    // Update local state and localStorage as immediate feedback
    let currentCompleted: Record<string, string[]> = {};
    try {
      const savedL = localStorage.getItem('af_completed_lessons');
      if (savedL) currentCompleted = JSON.parse(savedL);
    } catch (e) {}

    const courseLessons = currentCompleted[courseTitle] || [];
    if (!courseLessons.includes(lessonTitle)) {
      const updatedList = [...courseLessons, lessonTitle];
      const updatedObj = { ...currentCompleted, [courseTitle]: updatedList };
      localStorage.setItem('af_completed_lessons', JSON.stringify(updatedObj));
      window.dispatchEvent(new Event('storage'));

      // If logged in, sync with Firestore
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const currentProfileLessons = profile?.completedLessons || {};
        const profileCourseLessons = currentProfileLessons[courseTitle] || [];
        if (!profileCourseLessons.includes(lessonTitle)) {
          const newCompleted = {
            ...currentProfileLessons,
            [courseTitle]: [...profileCourseLessons, lessonTitle]
          };
          await setDoc(userDocRef, {
            completedLessons: newCompleted,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      }
    }
  };

  const recordQuizSolved = async (topic: string, questionId: string) => {
    let currentQuiz: Record<string, string[]> = {};
    try {
      const savedQ = localStorage.getItem('quiz_history');
      if (savedQ) currentQuiz = JSON.parse(savedQ);
    } catch (e) {}

    const topicQuestions = currentQuiz[topic] || [];
    if (!topicQuestions.includes(questionId)) {
      const updatedList = [...topicQuestions, questionId];
      const updatedObj = { ...currentQuiz, [topic]: updatedList };
      localStorage.setItem('quiz_history', JSON.stringify(updatedObj));
      window.dispatchEvent(new Event('storage'));

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const currentProfileQuiz = profile?.quizHistory || {};
        const profileTopicQuestions = currentProfileQuiz[topic] || [];
        if (!profileTopicQuestions.includes(questionId)) {
          const newQuiz = {
            ...currentProfileQuiz,
            [topic]: [...profileTopicQuestions, questionId]
          };
          await setDoc(userDocRef, {
            quizHistory: newQuiz,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      logout,
      updateUserProfile,
      markLessonComplete,
      recordQuizSolved
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
