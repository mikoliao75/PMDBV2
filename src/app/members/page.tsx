
'use client';

import { useMemo } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { MembersPage } from '@/components/dashboard/members-page';
import type { User, Project } from '@/lib/types';

export default function Page() {
  const usersCollection = useMemo(() => collection(db, 'users'), []);
  const projectsCollection = useMemo(() => collection(db, 'projects'), []);

  const { data: users, loading: usersLoading } = useCollection<User>(usersCollection);
  const { data: projects, loading: projectsLoading } = useCollection<Project>(projectsCollection);

  return <MembersPage 
    users={users || []} 
    projects={projects || []} 
    loading={usersLoading || projectsLoading} 
    onAddMember={() => {}}
    onEditMember={() => {}}
    onDeleteMember={() => {}}
  />;
}
