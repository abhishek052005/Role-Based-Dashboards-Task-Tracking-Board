'use client';

import React from 'react';
import { Task, AttendanceRecord, User } from '@/lib/types';
import { StatCard } from './StatCard';
import { ProductivityChart } from './ProductivityChart';
import { TaskCompletionChart } from './TaskCompletionChart';
import { TaskCard } from '../tasks/TaskCard';
import { Users, Clock, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { getDueStatus } from '@/lib/auth/permissions';

interface TeamLeadDashboardProps {
  currentUser: User;
  tasks: Task[];
  attendance: AttendanceRecord[];
  onTaskStatusChange: (taskId: string, newStatus: any) => void;
  onEditTaskClick: (task: Task) => void;
}

export const TeamLeadDashboard: React.FC<TeamLeadDashboardProps> = ({
  currentUser,
  tasks,
  attendance,
  onTaskStatusChange,
  onEditTaskClick,
}) => {
  const teamTasks = tasks;
  const totalTeamMembers = 5;
  const openTasks = teamTasks.filter((t) => t.status !== 'COMPLETED').length;
  
  const dueTodayCount = teamTasks.filter(
    (t) => getDueStatus(t.dueDate, t.status === 'COMPLETED') === 'DUE_TODAY'
  ).length;

  const overdueCount = teamTasks.filter(
    (t) => getDueStatus(t.dueDate, t.status === 'COMPLETED') === 'OVERDUE'
  ).length;

  const completedThisWeek = teamTasks.filter((t) => t.status === 'COMPLETED').length;

  const teamOverdueList = teamTasks.filter(
    (t) => getDueStatus(t.dueDate, t.status === 'COMPLETED') === 'OVERDUE'
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Team Members"
          value={totalTeamMembers}
          subtext={currentUser.department}
          icon={Users}
          accentColor="indigo"
        />
        <StatCard
          title="Open Tasks"
          value={openTasks}
          subtext="Active team workload"
          icon={Clock}
          accentColor="blue"
        />
        <StatCard
          title="Due Today"
          value={dueTodayCount}
          subtext="Deadline today"
          icon={Calendar}
          accentColor="amber"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueCount}
          subtext="Action required"
          icon={AlertTriangle}
          accentColor="rose"
        />
        <StatCard
          title="Completed Tasks"
          value={completedThisWeek}
          subtext="Team deliverables"
          icon={CheckCircle2}
          accentColor="emerald"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductivityChart tasks={teamTasks} title="Team Member Task Distribution" groupBy="employee" />
        </div>
        <div>
          <TaskCompletionChart tasks={teamTasks} title="Team Task Status Ratio" />
        </div>
      </div>

      {/* Overdue Team Tasks Section */}
      {teamOverdueList.length > 0 && (
        <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Overdue Team Deliverables ({teamOverdueList.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teamOverdueList.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                currentUser={currentUser}
                onStatusChange={onTaskStatusChange}
                onEditClick={onEditTaskClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
