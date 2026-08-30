'use client';

import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus, User } from '@/lib/types';
import { X, Save } from 'lucide-react';

interface TaskEditModalProps {
  task: Task;
  users: User[];
  onClose: () => void;
  onSave: (taskId: string, updates: Partial<Task>) => void;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
  task,
  users,
  onClose,
  onSave,
}) => {
  const [assigneeId, setAssigneeId] = useState(task.assigneeId);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(task.id, {
      assigneeId,
      dueDate,
      priority,
      status,
      title,
      description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-300 dark:border-zinc-700 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-tight">Quick Edit Task</h3>
            <p className="text-xs text-zinc-500 font-medium">Reassign task or modify timeline/priority</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-black dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
          <div>
            <label className="block text-zinc-700 dark:text-zinc-300 mb-1 uppercase text-[10px] tracking-wider font-black">
              Task Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-zinc-700 dark:text-zinc-300 mb-1 uppercase text-[10px] tracking-wider font-black">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 mb-1 uppercase text-[10px] tracking-wider font-black">
                Reassign To
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 mb-1 uppercase text-[10px] tracking-wider font-black">
                Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 mb-1 uppercase text-[10px] tracking-wider font-black">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white uppercase"
              >
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 mb-1 uppercase text-[10px] tracking-wider font-black">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white uppercase"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg uppercase tracking-wider text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-black text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black rounded-lg flex items-center gap-1.5 shadow-md uppercase tracking-wider text-xs"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
