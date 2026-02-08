
'use client';

import { collection } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { User } from '@/lib/types';
import { TeamMembersList } from '@/components/dashboard/team-members-list';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

export default function TeamPage() {
  const db = useFirestore();
  const usersCollection = db ? collection(db, 'users') : null;
  const { data: users, isLoading, error } = useCollection<User>(usersCollection);

  const handleEdit = (user: User) => {
    // This is a placeholder. In a real app, this would open a dialog.
    toast({ title: "Editing User", description: `Opening editor for ${user.name}` });
    console.log('Edit user:', user);
  };

  const handleDelete = (id: string) => {
    // This is a placeholder. In a real app, this would show a confirmation.
    toast({ title: "Deleting User", description: `Preparing to delete user ${id}`, variant: "destructive" });
    console.log('Delete user with id:', id);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">團隊成員</h1>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-red-500">Error: {error.message}</div>;
  }

  if (!users) {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">團隊成員</h1>
            <p>No team members found.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">團隊成員</h1>
      <TeamMembersList users={users} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
