'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { AttendanceRecord } from '@/lib/types';

interface AttendanceTrendChartProps {
  records: AttendanceRecord[];
  title?: string;
}

export const AttendanceTrendChart: React.FC<AttendanceTrendChartProps> = ({
  records,
  title = '30-Day Attendance Trend',
}) => {
  const dateMap: Record<string, { date: string; Present: number; Absent: number; Leave: number }> = {};

  records.forEach((r) => {
    if (!dateMap[r.date]) {
      dateMap[r.date] = { date: r.date.slice(5), Present: 0, Absent: 0, Leave: 0 };
    }
    if (r.status === 'PRESENT' || r.status === 'HALF_DAY') {
      dateMap[r.date].Present += 1;
    } else if (r.status === 'ABSENT') {
      dateMap[r.date].Absent += 1;
    } else {
      dateMap[r.date].Leave += 1;
    }
  });

  const chartData = Object.values(dateMap).reverse();

  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-xs">
      <div className="mb-4">
        <h3 className="text-base font-extrabold text-white">{title}</h3>
        <p className="text-xs text-slate-400 font-medium">Daily present vs absent headcount trend</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748B" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#64748B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} />
            <YAxis tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', border: '1px solid #334155', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="Present" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorPresent)" />
            <Area type="monotone" dataKey="Absent" stroke="#64748B" strokeWidth={2} fillOpacity={1} fill="url(#colorAbsent)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
