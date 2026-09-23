'use client';

import React from 'react';
import { TaskFilterOptions, User, Client } from '@/lib/types';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface TaskFiltersProps {
  filters: TaskFilterOptions;
  onChange: (filters: TaskFilterOptions) => void;
  users: User[];
  clients: Client[];
  currentUser: User;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onChange,
  users,
  clients,
  currentUser,
}) => {
  const isEmployee = currentUser.role === 'EMPLOYEE';

  return (
    <div className="bg-slate-900/70 rounded-xl p-4 sm:p-5 border border-slate-800/90 shadow-lg shadow-black/10 mb-6 space-y-3 backdrop-blur-md">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
        <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
        Workload filters
      </div>
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title, client, description..."
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 text-xs font-medium text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!isEmployee && (
            <select
              value={filters.assigneeId || 'ALL'}
              onChange={(e) => onChange({ ...filters, assigneeId: e.target.value })}
              className="px-3 py-2.5 bg-slate-800/80 text-xs font-bold text-slate-200 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Employees</option>
              {users.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-900">
                  {u.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={filters.clientId || 'ALL'}
            onChange={(e) => onChange({ ...filters, clientId: e.target.value })}
            className="px-3 py-2.5 bg-slate-800/80 text-xs font-bold text-slate-200 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900">
                {c.companyName}
              </option>
            ))}
          </select>

          <select
            value={filters.priority || 'ALL'}
            onChange={(e) => onChange({ ...filters, priority: e.target.value as any })}
            className="px-3 py-2.5 bg-slate-800/80 text-xs font-bold text-slate-200 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900">All Priorities</option>
            <option value="URGENT" className="bg-slate-900">Urgent Priority</option>
            <option value="HIGH" className="bg-slate-900">High Priority</option>
            <option value="MEDIUM" className="bg-slate-900">Medium Priority</option>
            <option value="LOW" className="bg-slate-900">Low Priority</option>
          </select>

          <select
            value={filters.dueFilter || 'ALL'}
            onChange={(e) => onChange({ ...filters, dueFilter: e.target.value as any })}
            className="px-3 py-2.5 bg-slate-800/80 text-xs font-bold text-slate-200 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900">All Due Dates</option>
            <option value="OVERDUE" className="bg-slate-900">Overdue Tasks</option>
            <option value="DUE_TODAY" className="bg-slate-900">Due Today</option>
            <option value="DUE_SOON" className="bg-slate-900">Due Soon (3 Days)</option>
          </select>

          {(filters.search ||
            (filters.assigneeId && filters.assigneeId !== 'ALL') ||
            (filters.clientId && filters.clientId !== 'ALL') ||
            (filters.priority && filters.priority !== 'ALL') ||
            (filters.dueFilter && filters.dueFilter !== 'ALL')) && (
            <button
              onClick={() =>
                onChange({
                  search: '',
                  assigneeId: 'ALL',
                  clientId: 'ALL',
                  status: 'ALL',
                  priority: 'ALL',
                  dueFilter: 'ALL',
                })
              }
              className="px-3 py-2.5 text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
