
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth';
import { useAuth } from '../provider';
import { useCollection } from '../firestore/use-collection';
import { collection } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { User as AppUser } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  currentUser: AppUser | null;
  allUsers: AppUser[];
  signOut: () => Promise<void>;
}

export function useAuthGuard(): AuthState {
  const auth = useAuth();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const usersCollection = useMemo(() => collection(db, 'users'), []);
  const { data: allUsers, loading: isUsersLoading } = useCollection<AppUser>(usersCollection);

  useEffect(() => {
    if (!auth) {
        setIsAuthLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const currentUser = useMemo(() => {
    if (firebaseUser && allUsers) {
      return allUsers.find(u => u.email === firebaseUser.email) || null;
    }
    return null;
  }, [firebaseUser, allUsers]);

  const signOut = useCallback(async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
        toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
        // The onAuthStateChanged listener will handle the state update automatically
      } catch (error) {
        console.error("Sign Out Error", error);
        toast({ title: 'Error Signing Out', description: 'Please try again.', variant: 'destructive' });
      }
    }
  }, [auth]);

  const isLoading = isAuthLoading || (firebaseUser != null && isUsersLoading);

  return {
    isLoading,
    isAuthenticated: !isLoading && currentUser != null,
    currentUser,
    allUsers: allUsers || [],
    signOut,
  };
}
