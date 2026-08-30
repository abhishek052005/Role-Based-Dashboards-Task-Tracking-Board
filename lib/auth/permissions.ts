import { Permission, Role, Task, User, AttendanceRecord } from '../types';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  PARTNER_ADMIN: [
    'dashboard:view_firm',
    'dashboard:view_team',
    'dashboard:view_self',
    'tasks:view_all',
    'tasks:view_team',
    'tasks:view_self',
    'tasks:create',
    'tasks:update_self',
    'tasks:update_team',
    'tasks:reassign',
    'tasks:change_due_date',
    'tasks:change_priority',
    'attendance:view_all',
    'attendance:view_team',
    'attendance:view_self',
    'reports:export_all',
    'reports:export_team',
    'reports:export_self',
  ],
  HR_MANAGER: [
    'dashboard:view_firm',
    'dashboard:view_team',
    'dashboard:view_self',
    'tasks:view_all',
    'tasks:view_team',
    'tasks:view_self',
    'tasks:create',
    'tasks:update_self',
    'tasks:update_team',
    'attendance:view_all',
    'attendance:view_team',
    'attendance:view_self',
    'reports:export_all',
    'reports:export_team',
    'reports:export_self',
  ],
  TEAM_LEAD: [
    'dashboard:view_team',
    'dashboard:view_self',
    'tasks:view_team',
    'tasks:view_self',
    'tasks:create',
    'tasks:update_self',
    'tasks:update_team',
    'tasks:reassign',
    'tasks:change_due_date',
    'tasks:change_priority',
    'attendance:view_team',
    'attendance:view_self',
    'reports:export_team',
    'reports:export_self',
  ],
  EMPLOYEE: [
    'dashboard:view_self',
    'tasks:view_self',
    'tasks:update_self',
    'attendance:view_self',
    'reports:export_self',
  ],
};

/**
 * Checks if a user has a specific permission based on their role
 */
export function can(user: User | null | undefined, permission: Permission): boolean {
  if (!user || !user.role) return false;
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
}

/**
 * Filter tasks strictly by User RBAC rules
 * Security: Server-side & Client-side scoping
 */
export function filterTasksForUser(tasks: Task[], user: User): Task[] {
  if (!user) return [];

  if (can(user, 'tasks:view_all')) {
    return tasks;
  }

  if (can(user, 'tasks:view_team') && user.teamId) {
    return tasks.filter(
      (task) => task.teamId === user.teamId || task.assigneeId === user.id
    );
  }

  // Employee scope: strictly only tasks assigned to them
  return tasks.filter((task) => task.assigneeId === user.id);
}

/**
 * Verify if a user is authorized to update a task's status or details
 */
export function canModifyTask(user: User, task: Task): { allowed: boolean; reason?: string } {
  if (!user || !task) return { allowed: false, reason: 'Unauthenticated' };

  // Partner or HR Manager can update any task
  if (can(user, 'tasks:view_all')) {
    return { allowed: true };
  }

  // Team Lead can update tasks in their team
  if (can(user, 'tasks:update_team') && user.teamId && task.teamId === user.teamId) {
    return { allowed: true };
  }

  // Employee can ONLY update their own task status
  if (task.assigneeId === user.id && can(user, 'tasks:update_self')) {
    return { allowed: true };
  }

  return { allowed: false, reason: 'You do not have permission to modify this task.' };
}

/**
 * Verify if a user is authorized to perform manager actions (reassign, change due date, change priority)
 */
export function canManageTask(user: User, task: Task): boolean {
  if (!user || !task) return false;
  
  if (user.role === 'PARTNER_ADMIN') return true;
  
  if (user.role === 'TEAM_LEAD') {
    return task.teamId === user.teamId || task.assigneeId === user.id;
  }

  return false;
}

/**
 * Filter attendance records strictly by User RBAC rules
 */
export function filterAttendanceForUser(records: AttendanceRecord[], user: User): AttendanceRecord[] {
  if (!user) return [];

  if (can(user, 'attendance:view_all')) {
    return records;
  }

  if (can(user, 'attendance:view_team') && user.teamId) {
    return records.filter((r) => r.teamId === user.teamId || r.employeeId === user.id);
  }

  return records.filter((r) => r.employeeId === user.id);
}

/**
 * Calculate due status helper (Overdue, Due Today, Due Soon, Normal)
 */
export function getDueStatus(dueDateStr: string, isCompleted: boolean): 'OVERDUE' | 'DUE_TODAY' | 'DUE_SOON' | 'NORMAL' {
  if (isCompleted) return 'NORMAL';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'OVERDUE';
  if (diffDays === 0) return 'DUE_TODAY';
  if (diffDays > 0 && diffDays <= 3) return 'DUE_SOON';
  return 'NORMAL';
}
