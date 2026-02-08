
'use client';

import { useState, useMemo } from 'react';
import { toast } from "@/hooks/use-toast";
import { useAuthGuard } from "@/firebase/auth/use-user";
import type { Project, CalendarEvent, User, ProjectFormData, CalendarEventFormData } from "@/lib/types";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useUserManagement, type UserData } from "@/lib/user-management";
import { db } from "@/firebase/config";
import { collection } from 'firebase/firestore';

import Header from "@/components/dashboard/header";
import { MembersPage } from "@/components/dashboard/members-page";
import { ProjectStatusTable } from "@/components/dashboard/project-status-table";
import CalendarCard from "@/components/dashboard/calendar-card";
import { ProjectFormDialog } from "@/components/dashboard/project-form-dialog";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { ProjectDetailSheet } from "@/components/dashboard/project-detail-sheet";
import { CalendarEventFormDialog } from "@/components/dashboard/calendar-event-form-dialog";
import { MemberFormDialog } from "@/components/dashboard/member-form-dialog";

// --- Dashboard Content Component ---
function DashboardContent({ user, allUsers }: { user: User, allUsers: User[] }) {
  const [activeView, setActiveView] = useState<'dashboard' | 'team'>('dashboard');
  
  const projectsCollection = useMemo(() => collection(db, "projects"), []);
  const schedulesCollection = useMemo(() => collection(db, "schedules"), []);

  const { data: projects, loading: projectsLoading, add: addProject, update: updateProject, remove: removeProject } = useCollection<Project>(projectsCollection);
  const { data: calendarEvents, add: addCalendarEvent } = useCollection<CalendarEvent>(schedulesCollection);
  const { addMember, updateMember, deleteUser } = useUserManagement();

  const [dialogs, setDialogs] = useState({
    project: { isOpen: false, data: null as Project | null },
    member: { isOpen: false, data: null as User | null },
    calendar: { isOpen: false, data: null as CalendarEvent | null },
    delete: { isOpen: false, data: { id: '', type: ''} },
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState<'all' | 'risk' | 'boss'>("all");

  const handleOpenDialog = (type: 'project' | 'member' | 'calendar', data: any = null) => setDialogs(prev => ({ ...prev, [type]: { isOpen: true, data } }));
  const handleCloseDialog = (type: 'project' | 'member' | 'calendar' | 'delete') => setDialogs(prev => ({ ...prev, [type]: { isOpen: false, data: null } }));
  const handleOpenDeleteDialog = (id: string, type: 'project' | 'user') => setDialogs(prev => ({ ...prev, delete: { isOpen: true, data: { id, type } } }));

  const handleMemberSubmit = async (formData: UserData) => {
    if (!formData.name || !formData.email) {
      toast({ title: "Validation Error", description: "Member name and email cannot be empty.", variant: "destructive" });
      return;
    }
    try {
        if (dialogs.member.data) {
            await updateMember(dialogs.member.data.id, formData);
            toast({ title: "Success", description: "Member details have been updated." });
        } else {
            await addMember(formData);
            toast({ title: "Success", description: "New member has been added." });
        }
        handleCloseDialog('member');
    } catch (error) {
        console.error("Member submission error: ", error);
        toast({ title: "Error", description: "Could not save member details.", variant: "destructive" });
    }
  };

  const handleProjectSubmit = async (formData: ProjectFormData) => {
    if (!formData.name || !formData.manager) {
      toast({ title: "Validation Error", description: "Project name and manager cannot be empty.", variant: "destructive" });
      return;
    }
    try {
      const manager = allUsers.find(u => u.name === formData.manager);
      if (!manager) throw new Error("Manager not found");

      const projectData = {
          ...formData,
          assigneeId: manager.id, 
      };

      if (dialogs.project.data) {
          await updateProject(dialogs.project.data.id, projectData);
          toast({ title: "Success", description: "Project has been updated." });
      } else {
          await addProject(projectData);
          toast({ title: "Success", description: "New project has been created." });
      }
      handleCloseDialog('project');
    } catch (error) {
        console.error("Project submission error: ", error);
        toast({ title: "Error", description: "Could not save the project.", variant: "destructive" });
    }
  };
  
  const handleCalendarSubmit = async (formData: CalendarEventFormData) => {
    if (!formData.title) {
        toast({ title: "Validation Error", description: "Title cannot be empty.", variant: "destructive" });
        return;
    }
    try {
        await addCalendarEvent(formData);
        toast({ title: "Success", description: "Calendar event added." });
        handleCloseDialog('calendar');
    } catch (error) {
        console.error("Calendar submission error: ", error);
        toast({ title: "Error", description: "Could not save the event.", variant: "destructive" });
    }
  };

  const handleDeleteConfirm = async () => {
    const { id, type } = dialogs.delete.data;
    if (!id || !type) return;
    try {
      if (type === 'user') { await deleteUser(id); }
      else if (type === 'project') { await removeProject(id); }
      toast({ title: "Success", description: `The ${type} has been deleted.` });
    } catch (error) {
      toast({ title: "Error", description: `Failed to delete ${type}.`, variant: "destructive" });
    } finally {
        handleCloseDialog('delete');
    }
  };

  const filteredProjects = useMemo(() => {
    let displayProjects = projects || [];
    if (user.role === 'Member') displayProjects = displayProjects.filter(p => p.assigneeId === user.id);
    if (projectFilter === 'risk') return displayProjects.filter(p => p.status === '有風險' || p.status === '已延遲');
    if (projectFilter === 'boss') return displayProjects.filter(p => p.isBossOrder);
    return displayProjects;
  }, [projects, projectFilter, user]);

  const isManager = user.role === 'Manager';
  const managers = allUsers.filter(u => u.role === 'Manager').map(u => u.name);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header user={user} onSwitchView={setActiveView} notificationCount={0} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {activeView === 'dashboard' && (
          <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 grid gap-4 md:gap-8">
              <ProjectStatusTable projects={filteredProjects} onAddNew={() => handleOpenDialog('project')} onEdit={(p) => handleOpenDialog('project', p)} onDelete={(id) => handleOpenDeleteDialog(id, "project")} onSelectProject={setSelectedProject} />
            </div>
            <div className="grid gap-4 md:gap-8">
              <CalendarCard events={calendarEvents || []} onAddNew={() => handleOpenDialog('calendar')} />
            </div>
          </div>
        )}
        {activeView === 'team' && isManager && 
          <MembersPage users={allUsers} projects={projects || []} loading={projectsLoading} onAddMember={() => handleOpenDialog('member')} onEditMember={(m) => handleOpenDialog('member', m)} onDeleteMember={(id) => handleOpenDeleteDialog(id, "user")} />
        }
        {activeView === 'team' && !isManager &&
          <div className="flex items-center justify-center h-full"><p className="text-lg text-muted-foreground">You do not have permission to view this page.</p></div>
        }
      </main>

      <ProjectFormDialog key={`project-${dialogs.project.data?.id || "new"}`} open={dialogs.project.isOpen} onOpenChange={() => handleCloseDialog('project')} onSubmit={handleProjectSubmit} project={dialogs.project.data} managers={managers} />
      <MemberFormDialog key={`member-${dialogs.member.data?.id || "new"}`} isOpen={dialogs.member.isOpen} onClose={() => handleCloseDialog('member')} member={dialogs.member.data} onSubmit={handleMemberSubmit} />
      <CalendarEventFormDialog isOpen={dialogs.calendar.isOpen} onOpenChange={() => handleCloseDialog('calendar')} onSubmit={handleCalendarSubmit} />
      <DeleteConfirmationDialog open={dialogs.delete.isOpen} onOpenChange={() => handleCloseDialog('delete')} onConfirm={handleDeleteConfirm} title={`Delete ${dialogs.delete.data.type}`} description={`Are you sure you want to delete this ${dialogs.delete.data.type}? This action cannot be undone.`} />
      <ProjectDetailSheet project={selectedProject} users={allUsers} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}

// --- Main Page Component ---
export default function Page() {
  const { isLoading, currentUser, allUsers } = useAuthGuard();

  const fullCurrentUser = useMemo(() => {
    if (!currentUser || !allUsers) return null;

    let user = allUsers.find(u => u.id === currentUser.uid);

    // If the mocked manager is not in the database, create a profile for them on the fly
    // This makes the app resilient to the database not having the mocked user
    if (!user && currentUser.uid === 'MGR-001') {
      return {
        id: currentUser.uid,
        name: currentUser.name,
        email: currentUser.email!,
        avatarUrl: currentUser.avatarUrl,
        role: 'Manager',
        position: '總經理',
        weeklyHoursLimit: 40,
        projects: [],
        createdAt: new Date(),
      };
    }

    return user || null;
  }, [currentUser, allUsers]);

  // Display a loading indicator while the initial data is being fetched.
  if (isLoading || !fullCurrentUser) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Directly render the dashboard with the mocked user.
  return <DashboardContent user={fullCurrentUser} allUsers={allUsers} />;
}
