'use client';

import React from 'react';
import { Task, AttendanceRecord, User } from '@/lib/types';
import { StatCard } from './StatCard';
import { AttendanceWidget } from './AttendanceWidget';
import { TaskCompletionChart } from './TaskCompletionChart';
import { TaskCard } from '../tasks/TaskCard';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, Target } from 'lucide-react';
import { getDueStatus } from '@/lib/auth/permissions';

interface EmployeeDashboardProps {
  currentUser: User;
  tasks: Task[];
  attendance: AttendanceRecord[];
  onTaskStatusChange: (taskId: string, newStatus: any) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  currentUser,
  tasks,
  attendance,
  onTaskStatusChange,
}) => {
  // STRICT SECURITY Scoping: Only tasks assigned to current user
  const myTasks = tasks.filter((t) => t.assigneeId === currentUser.id);

  const myOpenTasks = myTasks.filter((t) => t.status !== 'COMPLETED').length;
  const myCompletedTasks = myTasks.filter((t) => t.status === 'COMPLETED').length;
  const myTotalTasks = myTasks.length || 1;
  const myCompletionRate = Math.round((myCompletedTasks / myTotalTasks) * 100);

  const myOverdueTasks = myTasks.filter(
    (t) => getDueStatus(t.dueDate, t.status === 'COMPLETED') === 'OVERDUE'
  );

  const myUpcomingDeadlines = myTasks
    .filter((t) => t.status !== 'COMPLETED')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-6">
      {/* Privacy Badge */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-3 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Personal Workstation Dashboard (Privacy-Isolated View for {currentUser.name})</span>
        </div>
        <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
          ID: {currentUser.id}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Open Tasks"
          value={myOpenTasks}
          subtext="Active assignments"
          icon={Clock}
          accentColor="indigo"
        />
        <StatCard
          title="Completed Tasks"
          value={myCompletedTasks}
          subtext="Finished deliverables"
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <StatCard
          title="My Completion Rate"
          value={`${myCompletionRate}%`}
          subtext="Personal productivity"
          icon={Target}
          accentColor="purple"
        />
        <StatCard
          title="My Overdue Tasks"
          value={myOverdueTasks.length}
          subtext="Requires immediate attention"
          icon={AlertTriangle}
          accentColor="rose"
        />
      </div>

      {/* Grid: Personal Attendance & Personal Task Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceWidget records={attendance} currentUser={currentUser} />
        </div>
        <div>
          <TaskCompletionChart tasks={myTasks} title="My Task Status Ratio" />
        </div>
      </div>

      {/* My Upcoming Deadlines Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
          My Active Assignments & Upcoming Deadlines
        </h3>
        {myUpcomingDeadlines.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">No active assignments assigned to you</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myUpcomingDeadlines.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                currentUser={currentUser}
                onStatusChange={onTaskStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
