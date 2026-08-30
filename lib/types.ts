export type Role = 'PARTNER_ADMIN' | 'HR_MANAGER' | 'TEAM_LEAD' | 'EMPLOYEE';

export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type DueStatus = 'OVERDUE' | 'DUE_TODAY' | 'DUE_SOON' | 'NORMAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department: string;
  teamId?: string;
}

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  clientId: string;
  clientName: string;
  assigneeId: string;
  assigneeName: string;
  teamId: string;
  dueDate: string; // ISO String YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  estimatedHours?: number;
  completedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  teamId: string;
  date: string; // YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT' | 'ON_LEAVE' | 'HALF_DAY';
  checkIn?: string; // HH:mm
  checkOut?: string; // HH:mm
  workHours?: number;
  notes?: string;
}

export interface Receivable {
  id: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'OVERDUE' | 'PAID' | 'PARTIAL';
  paidAmount: number;
}

export interface PendingApproval {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'LEAVE' | 'ATTENDANCE_REGULARIZATION' | 'EXPENSE';
  startDate: string;
  endDate?: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface TaskFilterOptions {
  search?: string;
  assigneeId?: string;
  clientId?: string;
  status?: TaskStatus | 'ALL';
  priority?: TaskPriority | 'ALL';
  dueFilter?: 'ALL' | 'OVERDUE' | 'DUE_TODAY' | 'DUE_SOON';
  sortBy?: 'dueDate' | 'priority' | 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export type Permission =
  | 'dashboard:view_firm'
  | 'dashboard:view_team'
  | 'dashboard:view_self'
  | 'tasks:view_all'
  | 'tasks:view_team'
  | 'tasks:view_self'
  | 'tasks:create'
  | 'tasks:update_self'
  | 'tasks:update_team'
  | 'tasks:reassign'
  | 'tasks:change_due_date'
  | 'tasks:change_priority'
  | 'attendance:view_all'
  | 'attendance:view_team'
  | 'attendance:view_self'
  | 'reports:export_all'
  | 'reports:export_team'
  | 'reports:export_self';
