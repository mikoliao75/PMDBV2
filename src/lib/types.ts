
// Defines the structure for a user/member in the system.
export type User = {
  id: string; // Firestore document ID
  uid?: string; // Firebase Auth UID
  name: string;
  // Role for permissions: Manager can see/do everything, Member has restricted access.
  role: 'Manager' | 'Member';
  position: string; // Job title, e.g., 'Frontend Developer'
  weeklyHoursLimit: number; // Maximum weekly work hours for workload calculation.
  avatarUrl?: string;
};

// Defines a sub-task within a project.
export type SubTask = {
  id: string;
  name: string;
  status: 'pending' | 'completed';
};

// Defines a comment on a project for team communication.
export type Comment = {
  id: string;
  userId: string;
  userName: string;
  timestamp: any; // Firestore Timestamp
  text: string;
};

// Defines the main project structure.
export type Project = {
  id: string; // Firestore document ID
  name: string;
  assigneeId: string; // The ID of the user assigned to this project.
  progress: number; // Percentage (0-100)
  status: '進行中' | '有風險' | '已延遲' | '已完成';
  endDate: string; // Formatted as YYYY-MM-DD
  estimatedHours: number; // Workload hours for this project.
  isBossOrder?: boolean; // Flag for urgent tasks from management.
  bossIntervention?: string; // The latest instruction from the boss.
  riskReason?: string; // Explanation if the project is at risk.
  acknowledgedByMember?: boolean; // For members to acknowledge boss orders.
  subTasks?: SubTask[];
  comments?: Comment[];
};

// Defines a generic assignment or task.
export type Assignment = {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed';
};

// Defines a calendar event for the schedule.
export type CalendarEvent = {
  id?: string;
  title: string;
  date: string; // Pre-formatted date string for display (e.g., "Jul 1 - 5")
  type: 'business' | 'personal' | 'meeting';
  location?: string;
  startDate: string; // Formatted as YYYY-MM-DD
  endDate?: string; // Formatted as YYYY-MM-DD
};

// Defines the structure of the user object provided by Firebase Auth.
export type AuthUser = {
  uid: string;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  role: 'Manager' | 'Member'; // Custom claim for RBAC
};
