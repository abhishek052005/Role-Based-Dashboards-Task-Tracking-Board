'use client';

import React, { useState } from 'react';
import { AttendanceRecord, User } from '@/lib/types';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AttendanceWidgetProps {
  records: AttendanceRecord[];
  currentUser: User;
}

export const AttendanceWidget: React.FC<AttendanceWidgetProps> = ({ records, currentUser }) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const todayStr = new Date().toISOString().split('T')[0];

  let filteredRecords = records;
  if (timeframe === 'daily') {
    filteredRecords = records.filter((r) => r.date === todayStr || r.date === records[0]?.date);
  } else if (timeframe === 'weekly') {
    filteredRecords = records.slice(0, 15);
  } else {
    filteredRecords = records;
  }

  const presentCount = filteredRecords.filter((r) => r.status === 'PRESENT').length;
  const absentCount = filteredRecords.filter((r) => r.status === 'ABSENT').length;
  const leaveCount = filteredRecords.filter((r) => r.status === 'ON_LEAVE').length;
  const halfDayCount = filteredRecords.filter((r) => r.status === 'HALF_DAY').length;
  const total = filteredRecords.length || 1;
  const attendanceRate = Math.round(((presentCount + halfDayCount * 0.5) / total) * 100);

  const isSelfOnly = currentUser.role === 'EMPLOYEE';

  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-extrabold text-white">
              {isSelfOnly ? 'My Attendance Log' : 'Attendance Register'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {isSelfOnly
              ? 'Personal attendance log and work hours tracking'
              : currentUser.role === 'TEAM_LEAD'
              ? 'Team attendance summary'
              : 'Firm-wide attendance metrics'}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-800 p-1 rounded-lg text-xs font-semibold self-start sm:self-auto border border-slate-700">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-3 py-1 rounded-md transition-colors ${
              timeframe === 'daily'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1 rounded-md transition-colors ${
              timeframe === 'weekly'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1 rounded-md transition-colors ${
              timeframe === 'monthly'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-slate-800 text-slate-200 rounded">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Present</div>
            <div className="text-lg font-extrabold text-white">{presentCount}</div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-slate-800 text-slate-200 rounded">
            <XCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Absent</div>
            <div className="text-lg font-extrabold text-white">{absentCount}</div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-slate-800 text-slate-200 rounded">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">On Leave</div>
            <div className="text-lg font-extrabold text-white">{leaveCount}</div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-slate-800 text-indigo-400 rounded">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Rate</div>
            <div className="text-lg font-extrabold text-white">{attendanceRate}%</div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 uppercase font-bold text-slate-400 border-y border-slate-800 text-[10px] tracking-wider">
            <tr>
              {!isSelfOnly && <th className="px-3 py-2.5">Employee</th>}
              <th className="px-3 py-2.5">Date</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5">Check In</th>
              <th className="px-3 py-2.5">Check Out</th>
              <th className="px-3 py-2.5 text-right">Work Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredRecords.slice(0, 7).map((record) => (
              <tr key={record.id} className="hover:bg-slate-800/50">
                {!isSelfOnly && (
                  <td className="px-3 py-2.5 font-bold text-white">
                    {record.employeeName}
                  </td>
                )}
                <td className="px-3 py-2.5 text-slate-400 font-mono">{record.date}</td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                    {record.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-mono text-slate-300">{record.checkIn || '-'}</td>
                <td className="px-3 py-2.5 font-mono text-slate-300">{record.checkOut || '-'}</td>
                <td className="px-3 py-2.5 text-right font-bold text-white">
                  {record.workHours ? `${record.workHours} hrs` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
