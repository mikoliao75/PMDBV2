
"use client";

import type { User, Project } from "@/lib/types";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMembersList } from "./team-members-list";
import { WorkloadChart } from "./workload-chart";

interface MembersPageProps {
  users: User[];
  projects: Project[];
  loading: boolean;
  onAddMember: () => void;
  onEditMember: (user: User) => void;
  onDeleteMember: (id: string) => void;
}

export function MembersPage({ 
  users, 
  projects, 
  loading, 
  onAddMember, 
  onEditMember, 
  onDeleteMember 
}: MembersPageProps) {

  // Calculate workload data here, to be passed to the chart
  const workloadData = useMemo(() => {
    if (!users || !projects) return [];
    return users.map(u => {
      const userProjects = projects.filter(p => p.assigneeId === u.id);
      return {
        name: u.name,
        // Assuming 'estimatedHours' is the correct field for total hours
        standard: userProjects.filter(p => !p.isBossOrder).reduce((acc, p) => acc + (p.estimatedHours || 0), 0),
        urgent: userProjects.filter(p => p.isBossOrder).reduce((acc, p) => acc + (p.estimatedHours || 0), 0),
      };
    });
  }, [users, projects]);
  
  if (loading) {
      return <div>Loading team data...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Team Members</CardTitle>
            <Button onClick={onAddMember}>Add Member</Button>
          </CardHeader>
          <CardContent>
            <TeamMembersList 
              users={users} 
              onEdit={onEditMember} 
              onDelete={onDeleteMember} 
            />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Project Workload</CardTitle>
          </CardHeader>
          <CardContent>
             <WorkloadChart data={workloadData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
