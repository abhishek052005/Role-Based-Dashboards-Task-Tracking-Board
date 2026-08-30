'use client';

import React from 'react';
import { Task, TaskStatus, User } from '@/lib/types';
import { getDueStatus, canModifyTask, canManageTask } from '@/lib/auth/permissions';
import { AlertCircle, Clock, Building2, User as UserIcon, Edit3, ChevronDown } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  currentUser: User;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEditClick?: (task: Task) => void;
}

const priorityBadges = {
  URGENT: 'bg-slate-800 text-rose-300 border border-rose-500/40 font-bold',
  HIGH: 'bg-slate-800 text-amber-300 border border-amber-500/40 font-bold',
  MEDIUM: 'bg-slate-800 text-indigo-300 border border-indigo-500/40 font-semibold',
  LOW: 'bg-slate-800 text-slate-300 border border-slate-700 font-medium',
};

const statusBorderStrips = {
  NOT_STARTED: 'border-l-slate-600',
  IN_PROGRESS: 'border-l-indigo-500',
  UNDER_REVIEW: 'border-l-amber-500',
  COMPLETED: 'border-l-emerald-500',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  currentUser,
  onStatusChange,
  onEditClick,
}) => {
  const isCompleted = task.status === 'COMPLETED';
  const dueStat = getDueStatus(task.dueDate, isCompleted);
  const canModify = canModifyTask(currentUser, task).allowed;
  const isManager = canManageTask(currentUser, task);

  return (
    <div
      className={`group relative rounded-xl p-5 bg-slate-900 border-l-4 ${statusBorderStrips[task.status]} border-y border-r border-slate-800 shadow-sm hover:border-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between min-h-[190px]`}
    >
      <div>
        {/* Top Badges Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority Tag */}
            <span className={`text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider ${priorityBadges[task.priority]}`}>
              {task.priority} Priority
            </span>

            {/* Accessible Due Date Reminder Badge */}
            {dueStat === 'OVERDUE' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-800 uppercase tracking-wider">
                <AlertCircle className="w-3 h-3 text-rose-400" /> OVERDUE
              </span>
            )}
            {dueStat === 'DUE_TODAY' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-800 uppercase tracking-wider">
                <Clock className="w-3 h-3 text-amber-400" /> DUE TODAY
              </span>
            )}
            {dueStat === 'DUE_SOON' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                <Clock className="w-3 h-3 text-slate-400" /> DUE SOON
              </span>
            )}
          </div>

          {/* Manager Quick Action Edit Button */}
          {isManager && onEditClick && (
            <button
              onClick={() => onEditClick(task)}
              className="opacity-70 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              title="Quick Edit Task / Reassign"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Task Title */}
        <h4 className="text-sm font-extrabold text-white leading-snug mb-1.5 group-hover:text-indigo-300 transition-colors">
          {task.title}
        </h4>

        {/* Task Description */}
        {task.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed font-medium">
            {task.description}
          </p>
        )}
      </div>

      <div>
        {/* Client & Assignee Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2.5 border-t border-slate-800/90 my-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 overflow-hidden">
            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="font-bold text-slate-200 truncate" title={task.clientName}>
              {task.clientName}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 overflow-hidden">
            <UserIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate" title={task.assigneeName}>
              <span className="font-semibold text-slate-300">{task.assigneeName}</span>
            </span>
          </div>
        </div>

        {/* Footer: Due date & Direct Status Selector */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-slate-300">Due {task.dueDate}</span>
          </div>

          {/* Decent, padded dark status dropdown */}
          <div className="relative">
            <select
              disabled={!canModify}
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer appearance-none pr-7 transition-all ${
                !canModify ? 'opacity-60 cursor-not-allowed' : ''
              } ${
                task.status === 'COMPLETED'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                  : task.status === 'UNDER_REVIEW'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                  : task.status === 'IN_PROGRESS'
                  ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <option value="NOT_STARTED" className="bg-slate-900 text-slate-200">Not Started</option>
              <option value="IN_PROGRESS" className="bg-slate-900 text-slate-200">In Progress</option>
              <option value="UNDER_REVIEW" className="bg-slate-900 text-slate-200">Under Review</option>
              <option value="COMPLETED" className="bg-slate-900 text-slate-200">Completed</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
