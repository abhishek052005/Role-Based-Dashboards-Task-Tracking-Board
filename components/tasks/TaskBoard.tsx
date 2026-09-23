'use client';

import React from 'react';
import { Task, TaskStatus, User } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { Layers, Clock, PlayCircle, Eye, CheckCircle2 } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  currentUser: User;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEditClick?: (task: Task) => void;
}

const columns: {
  status: TaskStatus;
  label: string;
  icon: React.ReactNode;
  headerBg: string;
  badgeBg: string;
}[] = [
  {
    status: 'NOT_STARTED',
    label: 'Not Started',
    icon: <Clock className="w-4 h-4 text-slate-400" />,
    headerBg: 'bg-slate-800/70 border-slate-700/80',
    badgeBg: 'bg-slate-700/80 text-slate-200 border border-slate-600',
  },
  {
    status: 'IN_PROGRESS',
    label: 'In Progress',
    icon: <PlayCircle className="w-4 h-4 text-slate-300" />,
    headerBg: 'bg-slate-800/70 border-slate-700/80',
    badgeBg: 'bg-slate-700/80 text-slate-200 border border-slate-600',
  },
  {
    status: 'UNDER_REVIEW',
    label: 'Under Review',
    icon: <Eye className="w-4 h-4 text-slate-300" />,
    headerBg: 'bg-slate-800/70 border-slate-700/80',
    badgeBg: 'bg-slate-700/80 text-slate-200 border border-slate-600',
  },
  {
    status: 'COMPLETED',
    label: 'Completed',
    icon: <CheckCircle2 className="w-4 h-4 text-slate-300" />,
    headerBg: 'bg-slate-800/70 border-slate-700/80',
    badgeBg: 'bg-slate-700/80 text-slate-200 border border-slate-600',
  },
];

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  currentUser,
  onStatusChange,
  onEditClick,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 items-start">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className="rounded-xl p-3.5 border border-slate-800/90 bg-slate-900/65 min-h-[420px] flex flex-col shadow-lg shadow-black/10 backdrop-blur-md"
          >
            {/* Column Header Banner */}
            <div className={`flex items-center justify-between p-3 rounded-lg border ${col.headerBg} mb-3`}>
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                {col.icon}
                {col.label}
              </h3>
              <span className={`text-xs font-extrabold px-3 py-0.5 rounded-md ${col.badgeBg}`}>
                {colTasks.length}
              </span>
            </div>

            {/* Task Cards Container */}
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-1">
              {colTasks.length === 0 ? (
                <div className="h-40 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 text-xs font-semibold">
                  <Layers className="w-6 h-6 mb-1.5 opacity-40 text-slate-400" />
                  <span>No tasks in {col.label}</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      currentUser={currentUser}
                      onStatusChange={onStatusChange}
                      onEditClick={onEditClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
