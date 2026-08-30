'use client';

import React from 'react';
import { Task, AttendanceRecord, Receivable, User } from '@/lib/types';
import { StatCard } from './StatCard';
import { AttendanceWidget } from './AttendanceWidget';
import { ProductivityChart } from './ProductivityChart';
import { TaskCompletionChart } from './TaskCompletionChart';
import { ReceivablesWidget } from './ReceivablesWidget';
import { Users, CheckCircle2, AlertTriangle, Clock, IndianRupee, PieChart } from 'lucide-react';
import { TaskCard } from '../tasks/TaskCard';

interface PartnerDashboardProps {
  currentUser: User;
  tasks: Task[];
  attendance: AttendanceRecord[];
  receivables: Receivable[];
  onTaskStatusChange: (taskId: string, newStatus: any) => void;
  onEditTaskClick: (task: Task) => void;
}

export const PartnerDashboard: React.FC<PartnerDashboardProps> = ({
  currentUser,
  tasks,
  attendance,
  receivables,
  onTaskStatusChange,
  onEditTaskClick,
}) => {
  const totalEmployees = 15;
  const presentToday = attendance.filter((r) => r.status === 'PRESENT' || r.status === 'HALF_DAY').length;
  const openTasks = tasks.filter((t) => t.status !== 'COMPLETED').length;
  const overdueTasks = tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED').length;
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const completionRate = Math.round((completedTasks / (tasks.length || 1)) * 100);

  const totalOutstanding = receivables.reduce((sum, r) => sum + (r.amount - r.paidAmount), 0);

  const urgentOverdueList = tasks
    .filter((t) => new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED')
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          subtext="Active workforce"
          icon={Users}
          accentColor="indigo"
        />
        <StatCard
          title="Present Today"
          value={presentToday}
          subtext={`${Math.round((presentToday / 10) * 100)}% attendance rate`}
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <StatCard
          title="Open Tasks"
          value={openTasks}
          subtext="Active assignments"
          icon={Clock}
          accentColor="blue"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueTasks}
          subtext="Requires intervention"
          icon={AlertTriangle}
          accentColor="rose"
        />
        <StatCard
          title="Task Completion Rate"
          value={`${completionRate}%`}
          subtext="Firm-wide efficiency"
          icon={PieChart}
          accentColor="purple"
        />
        <StatCard
          title="Receivables"
          value={`₹${(totalOutstanding / 1000).toFixed(0)}k`}
          subtext="Outstanding collections"
          icon={IndianRupee}
          accentColor="amber"
        />
      </div>

      {/* Main Charts & Receivables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductivityChart tasks={tasks} title="Firm-wide Productivity by Team Member" />
        </div>
        <div>
          <ReceivablesWidget receivables={receivables} />
        </div>
      </div>

      {/* Secondary Row: Attendance & Task Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceWidget records={attendance} currentUser={currentUser} />
        </div>
        <div>
          <TaskCompletionChart tasks={tasks} title="Task Status Breakdown" />
        </div>
      </div>

      {/* Critical Alerts / Overdue Tasks Focus */}
      {urgentOverdueList.length > 0 && (
        <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> Critical Overdue Tasks Needing Action
            </h3>
            <span className="text-xs font-medium text-rose-700 dark:text-rose-300">
              {urgentOverdueList.length} items
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {urgentOverdueList.map((t) => (
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
