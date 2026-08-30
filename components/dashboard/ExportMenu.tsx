'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Task, AttendanceRecord, User } from '@/lib/types';
import { exportToExcel, exportToPDF } from '@/lib/export/exportUtils';

interface ExportMenuProps {
  tasks: Task[];
  attendance: AttendanceRecord[];
  currentUser: User;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ tasks, attendance, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);

  const scopeLabel =
    currentUser.role === 'EMPLOYEE'
      ? 'My Data Only'
      : currentUser.role === 'TEAM_LEAD'
      ? 'My Team Data'
      : 'Firm-Wide Data';

  const handleExport = async (type: 'tasks' | 'attendance', format: 'excel' | 'pdf') => {
    setIsOpen(false);
    try {
      const fileName = `RMH_${type}_${currentUser.role}`;
      if (format === 'excel') {
        await exportToExcel(type, type === 'tasks' ? tasks : attendance, currentUser, fileName);
      } else {
        await exportToPDF(type, type === 'tasks' ? tasks : attendance, currentUser, fileName);
      }
    } catch (err: any) {
      alert(`Export failed: ${err.message || 'Error creating document'}`);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-black dark:bg-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 text-xs font-black rounded-lg transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-xs uppercase tracking-wider"
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-2xl bg-black text-white dark:bg-zinc-900 border border-zinc-800 z-50 p-2 space-y-1">
          <div className="px-3 py-2 border-b border-zinc-800">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Export Scope
            </p>
            <p className="text-xs font-black text-white">{scopeLabel}</p>
          </div>

          <div className="py-1 space-y-1">
            <div className="px-2 py-1 text-[10px] font-black text-zinc-400 uppercase tracking-wider">Tasks Register</div>
            <button
              onClick={() => handleExport('tasks', 'excel')}
              className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 rounded flex items-center gap-2 font-bold"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-300" /> Export Tasks to Excel (.xlsx)
            </button>
            <button
              onClick={() => handleExport('tasks', 'pdf')}
              className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 rounded flex items-center gap-2 font-bold"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-300" /> Export Tasks to PDF (.pdf)
            </button>

            <div className="px-2 py-1 text-[10px] font-black text-zinc-400 uppercase tracking-wider pt-2 border-t border-zinc-800">
              Attendance Register
            </div>
            <button
              onClick={() => handleExport('attendance', 'excel')}
              className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 rounded flex items-center gap-2 font-bold"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-300" /> Export Attendance to Excel (.xlsx)
            </button>
            <button
              onClick={() => handleExport('attendance', 'pdf')}
              className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 rounded flex items-center gap-2 font-bold"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-300" /> Export Attendance to PDF (.pdf)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
