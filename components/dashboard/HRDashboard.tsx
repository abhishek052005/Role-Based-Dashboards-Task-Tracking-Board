'use client';

import React from 'react';
import { Task, AttendanceRecord, PendingApproval, User } from '@/lib/types';
import { StatCard } from './StatCard';
import { AttendanceWidget } from './AttendanceWidget';
import { AttendanceTrendChart } from './AttendanceTrendChart';
import { PendingApprovals } from './PendingApprovals';
import { Users, CheckCircle2, XCircle, AlertCircle, Clock, FileCheck } from 'lucide-react';

interface HRDashboardProps {
  currentUser: User;
  tasks: Task[];
  attendance: AttendanceRecord[];
  approvals: PendingApproval[];
  onApprovalUpdated: () => void;
}

export const HRDashboard: React.FC<HRDashboardProps> = ({
  currentUser,
  tasks,
  attendance,
  approvals,
  onApprovalUpdated,
}) => {
  const presentCount = attendance.filter((r) => r.status === 'PRESENT' || r.status === 'HALF_DAY').length;
  const absentCount = attendance.filter((r) => r.status === 'ABSENT').length;
  const leaveCount = attendance.filter((r) => r.status === 'ON_LEAVE').length;
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'PENDING').length;
  const openTasksCount = tasks.filter((t) => t.status !== 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Present Today"
          value={presentCount}
          subtext="On-duty headcount"
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <StatCard
          title="Absent Today"
          value={absentCount}
          subtext="Unexcused absence"
          icon={XCircle}
          accentColor="rose"
        />
        <StatCard
          title="On Leave"
          value={leaveCount}
          subtext="Approved leave"
          icon={AlertCircle}
          accentColor="amber"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingApprovalsCount}
          subtext="Requires HR review"
          icon={FileCheck}
          accentColor="purple"
        />
        <StatCard
          title="Open Tasks"
          value={openTasksCount}
          subtext="Firm workload"
          icon={Clock}
          accentColor="indigo"
        />
      </div>

      {/* Main Grid: Attendance Trend & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceTrendChart records={attendance} title="Organization-wide 30-Day Attendance Trend" />
        </div>
        <div>
          <PendingApprovals
            approvals={approvals}
            currentUser={currentUser}
            onActionComplete={onApprovalUpdated}
          />
        </div>
      </div>

      {/* Attendance Detail Widget */}
      <div>
        <AttendanceWidget records={attendance} currentUser={currentUser} />
      </div>
    </div>
  );
};
