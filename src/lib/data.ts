
// Mock data for the dashboard
import type { User, Project, CalendarEvent, Assignment } from './types';


export const mockUsers: User[] = [
  {
    id: 'MEM-001',
    name: '林雅婷',
    role: 'Manager',
    avatarUrl: '/avatars/01.png',
    email: 'lin.yuting@example.com',
  },
  {
    id: 'MEM-002',
    name: '陳志明',
    role: 'Member',
    avatarUrl: '/avatars/02.png',
    email: 'chen.zhiming@example.com',
  },
  {
    id: 'MEM-003',
    name: '王美玲',
    role: 'Member',
    avatarUrl: '/avatars/03.png',
    email: 'wang.meiling@example.com',
  },
  {
    id: 'MEM-004',
    name: '李偉倫',
    role: 'Member',
    avatarUrl: '/avatars/04.png',
    email: 'li.weilun@example.com',
  },
  {
    id: 'MEM-005',
    name: '黃靜香',
    role: 'Member',
    avatarUrl: '/avatars/05.png',
    email: 'huang.jingxiang@example.com',
  },
];

export const mockProjects: Project[] = [
  {
    id: 'PROJ-001',
    name: '下一代 ERP 系統',
    status: '進行中',
    progress: 75,
    assigneeId: 'MEM-001',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    description: '加速完成財報模組',
    estimatedHours: 160,
    isBossOrder: false,
    comments: [],
  },
  {
    id: 'PROJ-002',
    name: '行動版 CRM',
    status: '有風險',
    progress: 40,
    assigneeId: 'MEM-002',
    startDate: '2024-08-15',
    endDate: '2024-10-15',
    description: '整合新的地理位置 API',
    estimatedHours: 120,
    isBossOrder: false,
    comments: [],
  },
  {
    id: 'PROJ-003',
    name: '供應鏈可視化平台',
    status: '已延遲',
    progress: 60,
    assigneeId: 'MEM-003',
    startDate: '2024-06-01',
    endDate: '2024-08-30',
    description: '修復庫存追蹤的 Bug',
    estimatedHours: 200,
    isBossOrder: false,
    comments: [],
  },
  {
    id: 'PROJ-004',
    name: 'Sales AI Copilot',
    status: '進行中',
    progress: 10,
    assigneeId: 'MEM-002',
    startDate: '2024-09-01',
    endDate: '2024-09-15',
    description: '兩週內完成 Demo',
    estimatedHours: 80,
    isBossOrder: true,
    comments: [],
  },
];

export const mockSchedules: CalendarEvent[] = [
  {
    id: 'EVENT-001',
    title: '出差',
    start: '2024-02-09',
    end: '2024-02-12',
    allDay: true,
    description: '客戶現場',
  },
  {
    id: 'EVENT-002',
    title: '上海探親',
    start: '2024-02-14',
    end: '2024-02-22',
    allDay: true,
    description: '上海',
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: 'TASK-001',
    title: '完成第三季預算報告',
    assignedTo: '林雅婷',
    dueDate: '2024-08-15',
    status: '進行中',
  },
  {
    id: 'TASK-002',
    title: '準備董事會報告',
    assignedTo: '陳志明',
    dueDate: '2024-08-20',
    status: '未開始',
  },
];
