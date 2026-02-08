import { useMemo } from 'react';
import { db } from '@/firebase/config'; // <-- We check this import
import type { AuthUser, User } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';

export function useAuthGuard() {
  // --- FINAL DEFENSE: Check if the db object is valid ---
  // If `db` is null, it means Firebase initialization in `config.ts` failed.
  // This is the most likely root cause of the infinite loading.
  if (!db) {
    console.error("🔥🔥🔥 CRITICAL ERROR: The Firestore database object ('db') is null. This means Firebase initialization in src/firebase/config.ts has failed, almost certainly due to missing environment variables. The app cannot connect to the backend.");
    return {
      isLoading: false, // Stop the loading screen
      isAuthenticated: false, // Cannot be authenticated without a backend
      currentUser: null,
      allUsers: [],
    };
  }

  const managerUser: AuthUser = {
    uid: 'MGR-001',
    email: 'manager@example.com',
    name: '陳經理',
    avatarUrl: `https://i.pravatar.cc/150?u=MGR-001`,
    role: 'Manager',
  };

  const usersCollection = useMemo(() => collection(db, 'users'), []);
  const { data: allUsers, isLoading: usersLoading, error } = useCollection<User>(usersCollection);

  if (error) {
    console.error("Error fetching users in useAuthGuard:", error);
  }

  return {
    isLoading: usersLoading, // Revert to the real loading state
    isAuthenticated: true, 
    currentUser: managerUser, 
    allUsers: allUsers || [],
  };
}
