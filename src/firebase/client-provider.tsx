'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { initializeFirebase } from './index';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

// Define the shape of the context
interface FirebaseContextType {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

// Create the context with an undefined initial value
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// The provider component
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebase = useMemo(() => {
    console.log('[FirebaseClientProvider] Initializing Firebase');
    return initializeFirebase(); // Your initialization function
  }, []);

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Custom hook to access the entire Firebase context
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseClientProvider');
  }
  return context;
}

// Custom hook to access only the Firestore instance
export function useFirestore() {
  const { db } = useFirebase();
  return db;
}

// Custom hook to access only the Auth instance
export function useAuth() {
  const { auth } = useFirebase();
  return auth;
}
