import {
  Task,
  TaskFilterOptions,
  User,
  Client,
  AttendanceRecord,
  Receivable,
  PendingApproval,
  TaskStatus,
  TaskPriority,
} from '../types';
import {
  MOCK_TASKS,
  MOCK_ATTENDANCE,
  MOCK_RECEIVABLES,
  MOCK_PENDING_APPROVALS,
  MOCK_USERS,
  MOCK_CLIENTS,
} from './mockData';
import {
  can,
  filterTasksForUser,
  filterAttendanceForUser,
  canModifyTask,
  canManageTask,
  getDueStatus,
} from '../auth/permissions';

// In-memory data store for live mutations during user interaction session
let liveTasks: Task[] = [...MOCK_TASKS];
let liveAttendance: AttendanceRecord[] = [...MOCK_ATTENDANCE];
let liveReceivables: Receivable[] = [...MOCK_RECEIVABLES];
let liveApprovals: PendingApproval[] = [...MOCK_PENDING_APPROVALS];
let lastUpdatedTime: string = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export const DataService = {
  getLastUpdatedTime(): string {
    return lastUpdatedTime;
  },

  setLastUpdatedTime(): void {
    lastUpdatedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  },

  async getUsers(): Promise<User[]> {
    return MOCK_USERS;
  },

  async getClients(): Promise<Client[]> {
    return MOCK_CLIENTS;
  },

  /**
   * Fetch tasks filtered by query params and enforced by RBAC
   */
  async getTasks(user: User, filters?: TaskFilterOptions): Promise<Task[]> {
    // RBAC Security Check: scope to allowed tasks first
    let tasks = filterTasksForUser(liveTasks, user);

    if (!filters) return tasks;

    // Search filter
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.clientName.toLowerCase().includes(q) ||
          t.assigneeName.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Assignee filter
    if (filters.assigneeId && filters.assigneeId !== 'ALL') {
      tasks = tasks.filter((t) => t.assigneeId === filters.assigneeId);
    }

    // Client filter
    if (filters.clientId && filters.clientId !== 'ALL') {
      tasks = tasks.filter((t) => t.clientId === filters.clientId);
    }

    // Status filter
    if (filters.status && filters.status !== 'ALL') {
      tasks = tasks.filter((t) => t.status === filters.status);
    }

    // Priority filter
    if (filters.priority && filters.priority !== 'ALL') {
      tasks = tasks.filter((t) => t.priority === filters.priority);
    }

    // Due filter (OVERDUE, DUE_TODAY, DUE_SOON)
    if (filters.dueFilter && filters.dueFilter !== 'ALL') {
      tasks = tasks.filter((t) => {
        const dueStat = getDueStatus(t.dueDate, t.status === 'COMPLETED');
        return dueStat === filters.dueFilter;
      });
    }

    // Sorting
    const sortBy = filters.sortBy || 'dueDate';
    const sortOrder = filters.sortOrder || 'asc';

    tasks.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        const pMap: Record<TaskPriority, number> = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        comparison = pMap[b.priority] - pMap[a.priority];
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'createdAt') {
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return tasks;
  },

  /**
   * Update task status with strict authorization check
   */
  async updateTaskStatus(user: User, taskId: string, newStatus: TaskStatus): Promise<Task> {
    const task = liveTasks.find((t) => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // RBAC Security Check
    const authCheck = canModifyTask(user, task);
    if (!authCheck.allowed) {
      throw new Error(authCheck.reason || 'Unauthorized to modify task');
    }

    task.status = newStatus;
    task.updatedAt = new Date().toISOString().split('T')[0];
    if (newStatus === 'COMPLETED') {
      task.completedAt = new Date().toISOString().split('T')[0];
    } else {
      task.completedAt = undefined;
    }

    this.setLastUpdatedTime();
    return task;
  },

  /**
   * Update task fields (Reassign, due date, priority, status) - Manager only action
   */
  async updateTaskDetails(
    user: User,
    taskId: string,
    updates: Partial<Pick<Task, 'assigneeId' | 'dueDate' | 'priority' | 'status' | 'title' | 'description'>>
  ): Promise<Task> {
    const task = liveTasks.find((t) => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // RBAC Security Check: Manager quick actions require authorization
    if (!canManageTask(user, task)) {
      throw new Error('Unauthorized: Manager permission required to edit task parameters');
    }

    if (updates.assigneeId) {
      const assignee = MOCK_USERS.find((u) => u.id === updates.assigneeId);
      if (assignee) {
        task.assigneeId = assignee.id;
        task.assigneeName = assignee.name;
        task.teamId = assignee.teamId || task.teamId;
      }
    }

    if (updates.dueDate) task.dueDate = updates.dueDate;
    if (updates.priority) task.priority = updates.priority;
    if (updates.title) task.title = updates.title;
    if (updates.description !== undefined) task.description = updates.description;
    
    if (updates.status) {
      task.status = updates.status;
      if (updates.status === 'COMPLETED') {
        task.completedAt = new Date().toISOString().split('T')[0];
      }
    }

    task.updatedAt = new Date().toISOString().split('T')[0];
    this.setLastUpdatedTime();
    return task;
  },

  /**
   * Create a new task (Authorized users only)
   */
  async createTask(
    user: User,
    data: {
      title: string;
      description?: string;
      clientId: string;
      assigneeId: string;
      dueDate: string;
      priority: TaskPriority;
    }
  ): Promise<Task> {
    if (!can(user, 'tasks:create')) {
      throw new Error('Unauthorized to create tasks');
    }

    const client = MOCK_CLIENTS.find((c) => c.id === data.clientId);
    const assignee = MOCK_USERS.find((u) => u.id === data.assigneeId);

    const newTask: Task = {
      id: `tsk_${Date.now().toString().slice(-6)}`,
      title: data.title,
      description: data.description,
      clientId: data.clientId,
      clientName: client ? client.companyName : 'Unknown Client',
      assigneeId: data.assigneeId,
      assigneeName: assignee ? assignee.name : 'Unassigned',
      teamId: assignee ? assignee.teamId || 'team_tax' : 'team_tax',
      dueDate: data.dueDate,
      priority: data.priority,
      status: 'NOT_STARTED',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    liveTasks.unshift(newTask);
    this.setLastUpdatedTime();
    return newTask;
  },

  /**
   * Fetch attendance records with RBAC
   */
  async getAttendance(user: User): Promise<AttendanceRecord[]> {
    return filterAttendanceForUser(liveAttendance, user);
  },

  /**
   * Fetch receivables (Partner / Admin only)
   */
  async getReceivables(user: User): Promise<Receivable[]> {
    if (!can(user, 'dashboard:view_firm')) {
      return [];
    }
    return liveReceivables;
  },

  /**
   * Fetch pending approvals (HR / Admin only)
   */
  async getPendingApprovals(user: User): Promise<PendingApproval[]> {
    if (!can(user, 'dashboard:view_firm')) {
      return [];
    }
    return liveApprovals;
  },

  /**
   * Approve or reject a pending request
   */
  async processApproval(user: User, approvalId: string, approved: boolean): Promise<PendingApproval> {
    if (!can(user, 'dashboard:view_firm')) {
      throw new Error('Unauthorized to process approvals');
    }

    const item = liveApprovals.find((a) => a.id === approvalId);
    if (!item) throw new Error('Approval request not found');

    item.status = approved ? 'APPROVED' : 'REJECTED';
    this.setLastUpdatedTime();
    return item;
  },
};
