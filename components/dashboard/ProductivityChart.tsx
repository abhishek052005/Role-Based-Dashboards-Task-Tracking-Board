'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Task } from '@/lib/types';

interface ProductivityChartProps {
  tasks: Task[];
  title?: string;
  groupBy?: 'employee' | 'team';
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({
  tasks,
  title = 'Productivity Breakdown',
  groupBy = 'employee',
}) => {
  const dataMap: Record<string, { name: string; completed: number; inProgress: number; overdue: number }> = {};

  tasks.forEach((t) => {
    const key = groupBy === 'employee' ? t.assigneeName.split(' ')[0] : t.teamId === 'team_tax' ? 'Taxation' : 'Compliance';
    if (!dataMap[key]) {
      dataMap[key] = { name: key, completed: 0, inProgress: 0, overdue: 0 };
    }

    if (t.status === 'COMPLETED') {
      dataMap[key].completed += 1;
    } else {
      const isOverdue = new Date(t.dueDate) < new Date();
      if (isOverdue) {
        dataMap[key].overdue += 1;
      } else {
        dataMap[key].inProgress += 1;
      }
    }
  });

  const chartData = Object.values(dataMap);

  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-base font-extrabold text-white">{title}</h3>
        <p className="text-xs text-slate-400 font-medium">Completed vs In Progress vs Overdue tasks</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', border: '1px solid #334155', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontWeight: '600', paddingTop: '10px' }} />
            <Bar dataKey="completed" name="Completed" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="inProgress" name="In Progress" fill="#64748B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="overdue" name="Overdue" fill="#334155" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
