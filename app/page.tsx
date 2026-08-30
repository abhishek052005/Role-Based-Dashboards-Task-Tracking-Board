'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User, Task, AttendanceRecord, Receivable, PendingApproval, TaskFilterOptions, TaskStatus } from '@/lib/types';
import { MOCK_USERS, MOCK_CLIENTS } from '@/lib/data/mockData';
import { DataService } from '@/lib/data/service';
import { filterTasksForUser, filterAttendanceForUser, can } from '@/lib/auth/permissions';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { PartnerDashboard } from '@/components/dashboard/PartnerDashboard';
import { HRDashboard } from '@/components/dashboard/HRDashboard';
import { TeamLeadDashboard } from '@/components/dashboard/TeamLeadDashboard';
import { EmployeeDashboard } from '@/components/dashboard/EmployeeDashboard';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskEditModal } from '@/components/tasks/TaskEditModal';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { AttendanceWidget } from '@/components/dashboard/AttendanceWidget';
import { Plus, RefreshCw, Layers } from 'lucide-react';

export default function Home() {
  // Current logged in user (Defaults to Partner / Admin for first view)
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'attendance'>('dashboard');

  // Application Data States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);

  // Metadata / UI States
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters State for Task Board
  const [filters, setFilters] = useState<TaskFilterOptions>({
    search: '',
    assigneeId: 'ALL',
    clientId: 'ALL',
    status: 'ALL',
    priority: 'ALL',
    dueFilter: 'ALL',
  });

  // Modal States
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Fetch Data Function with Stale-Data Error Handling (FR-B8)
  const fetchData = useCallback(
    async (isManualRefresh: boolean = false) => {
      if (isManualRefresh) setIsRefreshing(true);

      try {
        const fetchedTasks = await DataService.getTasks(currentUser, filters);
        const fetchedAttendance = await DataService.getAttendance(currentUser);
        const fetchedReceivables = await DataService.getReceivables(currentUser);
        const fetchedApprovals = await DataService.getPendingApprovals(currentUser);

        setTasks(fetchedTasks);
        setAttendance(fetchedAttendance);
        setReceivables(fetchedReceivables);
        setApprovals(fetchedApprovals);

        setLastUpdated(DataService.getLastUpdatedTime());
        setError(null);
      } catch (err: any) {
        // FR-B8: If API/data fetch fails, keep last known data and show non-blocking warning banner
        setError(err.message || 'Unable to refresh live data.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [currentUser, filters]
  );

  // Load Data on Initial Mount or when User / Filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Automatic Near-Real-Time Refresh interval (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Handle Task Status Change
  const handleTaskStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await DataService.updateTaskStatus(currentUser, taskId, newStatus);
      await fetchData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to update task status.');
    }
  };

  // Handle Manager Task Edit / Reassign
  const handleSaveTaskEdit = async (taskId: string, updates: Partial<Task>) => {
    try {
      await DataService.updateTaskDetails(currentUser, taskId, updates);
      await fetchData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to edit task details.');
    }
  };

  // Handle Create Task
  const handleCreateTask = async (newTaskData: any) => {
    try {
      await DataService.createTask(currentUser, newTaskData);
      await fetchData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to create task.');
    }
  };

  // Switch Active User / Role
  const handleRoleSwitch = (newUser: User) => {
    setCurrentUser(newUser);
    // Reset assignee filter when role changes
    setFilters((prev) => ({ ...prev, assigneeId: 'ALL' }));
  };

  return (
    <DashboardShell
      currentUser={currentUser}
      onRoleSwitch={handleRoleSwitch}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      lastUpdated={lastUpdated}
      isRefreshing={isRefreshing}
      error={error}
      onRefresh={() => fetchData(true)}
      tasks={tasks}
      attendance={attendance}
    >
      {isLoading ? (
        /* Loading Skeleton UI (NFR Accessibility & UX) */
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      ) : activeTab === 'dashboard' ? (
        /* Role-Specific Dashboard Composition (FR-B3) */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back, {currentUser.name.split(' ')[0]}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                RMH CRM & Workforce Dashboard • {currentUser.department}
              </p>
            </div>
            {can(currentUser, 'tasks:create') && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Task
              </button>
            )}
          </div>

          {currentUser.role === 'PARTNER_ADMIN' && (
            <PartnerDashboard
              currentUser={currentUser}
              tasks={tasks}
              attendance={attendance}
              receivables={receivables}
              onTaskStatusChange={handleTaskStatusChange}
              onEditTaskClick={setEditingTask}
            />
          )}

          {currentUser.role === 'HR_MANAGER' && (
            <HRDashboard
              currentUser={currentUser}
              tasks={tasks}
              attendance={attendance}
              approvals={approvals}
              onApprovalUpdated={() => fetchData(true)}
            />
          )}

          {currentUser.role === 'TEAM_LEAD' && (
            <TeamLeadDashboard
              currentUser={currentUser}
              tasks={tasks}
              attendance={attendance}
              onTaskStatusChange={handleTaskStatusChange}
              onEditTaskClick={setEditingTask}
            />
          )}

          {currentUser.role === 'EMPLOYEE' && (
            <EmployeeDashboard
              currentUser={currentUser}
              tasks={tasks}
              attendance={attendance}
              onTaskStatusChange={handleTaskStatusChange}
            />
          )}
        </div>
      ) : activeTab === 'tasks' ? (
        /* Task Tracking Board View (FR-B1) */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Layers className="w-6 h-6 text-indigo-600" />
                Task Tracking Board
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time workload management & status updates ({tasks.length} total tasks)
              </p>
            </div>
            {can(currentUser, 'tasks:create') && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Create New Task
              </button>
            )}
          </div>

          <TaskFilters
            filters={filters}
            onChange={setFilters}
            users={MOCK_USERS}
            clients={MOCK_CLIENTS}
            currentUser={currentUser}
          />

          <TaskBoard
            tasks={tasks}
            currentUser={currentUser}
            onStatusChange={handleTaskStatusChange}
            onEditClick={setEditingTask}
          />
        </div>
      ) : (
        /* Attendance Log View (FR-B4) */
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Attendance Log & Attendance Register
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Check-in, check-out and work hours logs
            </p>
          </div>
          <AttendanceWidget records={attendance} currentUser={currentUser} />
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          users={MOCK_USERS}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveTaskEdit}
        />
      )}

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <CreateTaskModal
          users={MOCK_USERS}
          clients={MOCK_CLIENTS}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateTask}
        />
      )}
    </DashboardShell>
  );
}
