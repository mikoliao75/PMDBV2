
import { useMemo } from "react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { db } from "@/firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import type { User, Project, CalendarEvent, ProjectFormData, CalendarEventFormData } from "@/lib/types";

// A more specific type for adding/updating a user, excluding the ID.
export type UserData = Omit<User, "id">;

export function useUserManagement() {
  // This hook now correctly focuses only on user management.
  const { data: users, loading, error, add, update, remove } = useCollection<User>(collection(db, "users"));

  const teamMembers = useMemo(() => users || [], [users]);

  // Wrapper functions for add, update, and remove to match the expected signature.
  const addUser = async (userData: UserData) => {
    // The useCollection hook already handles adding the createdAt timestamp if configured.
    // Assuming it does, otherwise, you would add it here before calling `add`.
    await add(userData);
  };

  const updateUser = async (id: string, userData: Partial<UserData>) => {
    await update(id, userData);
  };

  const deleteUser = async (id: string) => {
    await remove(id);
  };

  return {
    teamMembers,
    loading,
    error,
    addMember: addUser,
    updateMember: updateUser,
    deleteUser,
  };
}
